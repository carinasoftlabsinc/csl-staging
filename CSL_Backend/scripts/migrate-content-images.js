// Moves base64 images out of blog and news post text into files (public/content-images/).
//
//   node scripts/migrate-content-images.js                     dry run: report only, writes nothing
//   node scripts/migrate-content-images.js --apply             convert, back up and update the posts
//   node scripts/migrate-content-images.js --restore <dir>     put the original HTML back from a backup folder
//
// Options:
//   --only <id>             one post only (blog or news id)
//   --limit <n>             at most n posts
//   --collections blog,news which collections (default both)
//   --backup-dir <dir>      where backups go (default backups/content-images/<time>)
//   --files-only            write the image files only (database untouched), to copy them to the server first
//   --allow-production      required when the database name does not end in "-Dev"
//
// The website loads the files from PUBLIC_FILE_BASE_URL (production: https://admin.carinasoftlabs.com/web/web/file).
// Only the changed fields are written; createdAt/updatedAt are not touched.
const { flag, option, connect, disconnect, createBackup, restoreBackup, kb, ObjectId } = require('./lib/migration');
const { extractEmbeddedImages, hasEmbeddedImages, CONTENT_IMAGE_DIR } = require('../utills/contentImages');

const APPLY = flag('apply');
const FILES_ONLY = flag('files-only');
const RESTORE = option('restore');
const ONLY = option('only');
const LIMIT = option('limit') ? parseInt(option('limit'), 10) : 0;
const COLLECTIONS = (option('collections') || 'blog,news').split(',').map((c) => c.trim());

// Which fields of each collection can hold post HTML.
const TARGETS = {
  blog: { collection: 'blogs', arrays: { sections: 'content', faqs: 'answer' }, fields: ['content'] },
  news: { collection: 'newsrooms', arrays: {}, fields: ['content'] },
};

// Mongo query matching documents with a base64 image in any target field.
const embeddedQuery = (target) => ({
  $or: [
    ...Object.entries(target.arrays).map(([arr, field]) => ({ [`${arr}.${field}`]: /data:image\//i })),
    ...target.fields.map((field) => ({ [field]: /data:image\//i })),
  ],
});

// Converts one document. Returns { set, before, after, images, errors } where `set` holds the changed fields.
const convertDocument = async (doc, target, write) => {
  const set = {};
  const report = { before: 0, after: 0, images: [], errors: [] };

  const convert = async (html) => {
    report.before += (html || '').length;
    if (!hasEmbeddedImages(html)) {
      report.after += (html || '').length;
      return { html, changed: false };
    }
    const res = await extractEmbeddedImages(html, { write });
    report.after += res.html.length;
    report.images.push(...res.images);
    report.errors.push(...res.errors);
    return res;
  };

  for (const [arr, field] of Object.entries(target.arrays)) {
    if (!Array.isArray(doc[arr])) continue;
    let changed = false;
    const items = [];
    for (const item of doc[arr]) {
      const res = await convert(item[field]);
      changed = changed || res.changed;
      items.push(res.changed ? { ...item, [field]: res.html } : item);
    }
    if (changed) set[arr] = items;
  }
  for (const field of target.fields) {
    const res = await convert(doc[field]);
    if (res.changed) set[field] = res.html;
  }
  return { set, ...report };
};

const migrate = async (db) => {
  const backup = APPLY ? createBackup('content-images') : null;
  const manifest = { startedAt: new Date().toISOString(), database: db.databaseName, files: [], posts: [] };
  const totals = { posts: 0, images: 0, before: 0, after: 0, imageBytes: 0, originalBytes: 0, errors: 0 };

  for (const name of COLLECTIONS) {
    const target = TARGETS[name];
    if (!target) throw new Error(`unknown collection "${name}" (use blog, news)`);
    const coll = db.collection(target.collection);
    const query = embeddedQuery(target);
    if (ONLY) query._id = new ObjectId(ONLY);

    let cursor = coll.find(query);
    if (LIMIT) cursor = cursor.limit(LIMIT);
    const docs = await cursor.toArray();
    console.log(`\n${name}: ${docs.length} post(s) with base64 images`);

    for (const doc of docs) {
      const res = await convertDocument(doc, target, APPLY || FILES_ONLY);
      const fields = Object.keys(res.set);
      const originalBytes = res.images.reduce((s, i) => s + i.originalBytes, 0);
      const imageBytes = res.images.reduce((s, i) => s + i.bytes, 0);
      totals.posts += 1;
      totals.images += res.images.length;
      totals.before += res.before;
      totals.after += res.after;
      totals.imageBytes += imageBytes;
      totals.originalBytes += originalBytes;
      totals.errors += res.errors.length;

      console.log(
        `  ${doc._id} ${String(doc.title || '').slice(0, 60)}\n` +
          `    images ${res.images.length}${res.errors.length ? `, failed ${res.errors.length} (${res.errors.join('; ')})` : ''}` +
          ` | text ${kb(res.before)} -> ${kb(res.after)} | images ${kb(originalBytes)} -> ${kb(imageBytes)} as files`
      );

      if (FILES_ONLY) {
        res.images.forEach((i) => console.log(`    file: ${i.fileName}`));
        continue;
      }
      if (!APPLY || !fields.length) continue;

      // Back up the original fields before changing anything.
      backup.save(target.collection, doc, fields);

      // Only update when the fields are still the ones we read (no edit in the admin in the meantime).
      const filter = { _id: doc._id };
      for (const f of fields) filter[f] = doc[f];
      const upd = await coll.updateOne(filter, { $set: res.set });
      if (upd.modifiedCount !== 1) {
        console.log('    NOT UPDATED: the post changed while the script was running. Run again.');
        continue;
      }
      manifest.files.push(...res.images.map((i) => i.fileName));
      manifest.posts.push({ collection: target.collection, id: String(doc._id), fields, images: res.images.length });
    }
  }

  console.log(
    `\nTotal: ${totals.posts} post(s), ${totals.images} image(s), ${totals.errors} failed` +
      ` | post text ${kb(totals.before)} -> ${kb(totals.after)}` +
      ` | images ${kb(totals.originalBytes)} -> ${kb(totals.imageBytes)}`
  );

  if (APPLY) {
    manifest.finishedAt = new Date().toISOString();
    manifest.files = [...new Set(manifest.files)];
    backup.writeManifest(manifest);
    console.log(`Updated ${manifest.posts.length} post(s). Files in ${CONTENT_IMAGE_DIR}`);
    console.log(`Backup: ${backup.dir}  (undo with --restore "${backup.dir}")`);
  } else {
    console.log(FILES_ONLY ? `Files written to ${CONTENT_IMAGE_DIR}. The database was not changed.` : 'Dry run: nothing was written. Add --apply to convert.');
  }
};

(async () => {
  const mode = RESTORE ? 'RESTORE' : APPLY ? 'APPLY' : FILES_ONLY ? 'FILES ONLY (no database writes)' : 'dry run';
  if (APPLY && !process.env.PUBLIC_FILE_BASE_URL && flag('allow-production')) {
    console.error('Refusing to apply on production without PUBLIC_FILE_BASE_URL (e.g. https://admin.carinasoftlabs.com/web/web/file).');
    process.exit(2);
  }
  const { db } = await connect(mode);
  try {
    if (RESTORE) {
      await restoreBackup(db, RESTORE, ONLY);
      console.log('The image files were left in place.');
    } else {
      await migrate(db);
    }
  } finally {
    await disconnect();
  }
})().catch((err) => {
  console.error('FAILED:', err.message);
  process.exit(1);
});
