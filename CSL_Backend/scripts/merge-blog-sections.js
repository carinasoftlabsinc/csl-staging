// Turns the old blog `sections` list into one `content` HTML document (each heading becomes an <h2>).
//
//   node scripts/merge-blog-sections.js                    dry run: report only, writes nothing
//   node scripts/merge-blog-sections.js --apply            write `content`, keep `sections` as a backup
//   node scripts/merge-blog-sections.js --restore <dir>    undo an --apply from its backup folder
//   node scripts/merge-blog-sections.js --drop-sections    later step: remove `sections` where `content` exists
//
// Options:
//   --only <id>          one post only
//   --limit <n>          at most n posts
//   --backup-dir <dir>   where backups go (default backups/merge-blog-sections/<time>)
//   --allow-production   required when the database name does not end in "-Dev"
//
// The HTML goes through the same steps as a save in the admin (base64 images to files, allow-list cleaning).
// createdAt/updatedAt are not touched, so the sitemap dates do not change.
const he = require('he');
const { flag, option, connect, disconnect, createBackup, restoreBackup, kb, ObjectId } = require('./lib/migration');
const { preparePostHtml, countTags } = require('../utills/postHtml');

const APPLY = flag('apply');
const DROP = flag('drop-sections');
const RESTORE = option('restore');
const ONLY = option('only');
const LIMIT = option('limit') ? parseInt(option('limit'), 10) : 0;

// Same rule as the admin's blog page uses for posts that have not been merged yet.
const sectionsToHtml = (sections) =>
  (sections || [])
    .map((s) => {
      const heading = String(s.heading || '').trim();
      const body = String(s.content || '').trim();
      return (heading ? `<h2>${he.escape(heading)}</h2>` : '') + body;
    })
    .filter(Boolean)
    .join('\n');

// Tags the cleaner removed (or renamed, like h1 -> h2), e.g. "script x1, h1 x2".
const removedTags = (before, after) => {
  const a = countTags(before);
  const b = countTags(after);
  return Object.entries(a)
    .filter(([tag, n]) => (b[tag] || 0) < n)
    .map(([tag, n]) => `${tag} x${n - (b[tag] || 0)}`)
    .join(', ');
};

const merge = async (db) => {
  const coll = db.collection('blogs');
  const query = {
    'sections.0': { $exists: true },
    $or: [{ content: { $exists: false } }, { content: null }, { content: '' }],
  };
  if (ONLY) query._id = new ObjectId(ONLY);
  let cursor = coll.find(query);
  if (LIMIT) cursor = cursor.limit(LIMIT);
  const docs = await cursor.toArray();
  console.log(`\n${docs.length} blog post(s) to merge`);

  const backup = APPLY ? createBackup('merge-blog-sections') : null;
  const manifest = { startedAt: new Date().toISOString(), database: db.databaseName, posts: [] };
  let merged = 0;

  for (const doc of docs) {
    const raw = sectionsToHtml(doc.sections);
    const content = await preparePostHtml(raw);
    const headings = doc.sections.filter((s) => String(s.heading || '').trim()).length;
    const removed = removedTags(raw, content);
    console.log(
      `  ${doc._id} ${String(doc.title || '').slice(0, 60)}\n` +
        `    sections ${doc.sections.length} (headings ${headings}) | ${kb(raw.length)} -> ${kb(content.length)}` +
        (removed ? ` | cleaned: ${removed}` : '') +
        (/data:image\//i.test(content) ? ' | WARNING: base64 image left' : '')
    );
    if (!APPLY) continue;

    backup.save('blogs', doc, ['content']);
    const res = await coll.updateOne({ _id: doc._id, $or: query.$or }, { $set: { content } });
    if (res.modifiedCount !== 1) {
      console.log('    NOT UPDATED: the post changed while the script was running. Run again.');
      continue;
    }
    merged += 1;
    manifest.posts.push({ id: String(doc._id), sections: doc.sections.length });
  }

  if (APPLY) {
    manifest.finishedAt = new Date().toISOString();
    backup.writeManifest(manifest);
    console.log(`\nMerged ${merged} post(s). Their sections were kept.`);
    console.log(`Backup: ${backup.dir}  (undo with --restore "${backup.dir}")`);
  } else {
    console.log('\nDry run: nothing was written. Add --apply to merge.');
  }
};

// Removes the old `sections` once every post shows its `content` correctly.
const dropSections = async (db) => {
  const coll = db.collection('blogs');
  const query = { sections: { $exists: true }, content: { $nin: [null, ''] } };
  if (ONLY) query._id = new ObjectId(ONLY);
  const docs = await coll.find(query, { projection: { title: 1, sections: 1 } }).toArray();
  const waiting = await coll.countDocuments({ 'sections.0': { $exists: true }, content: { $in: [null, ''] } });
  console.log(`\n${docs.length} post(s) have both content and sections; ${waiting} post(s) still have only sections (left alone).`);
  if (!APPLY) {
    docs.forEach((d) => console.log(`  ${d._id} ${String(d.title || '').slice(0, 60)} (${(d.sections || []).length} sections)`));
    console.log('\nDry run: nothing was removed. Add --apply together with --drop-sections to remove them.');
    return;
  }
  const backup = createBackup('drop-blog-sections');
  for (const doc of docs) backup.save('blogs', doc, ['sections']);
  const res = await coll.updateMany({ _id: { $in: docs.map((d) => d._id) } }, { $unset: { sections: '' } });
  backup.writeManifest({ finishedAt: new Date().toISOString(), database: db.databaseName, posts: docs.map((d) => String(d._id)) });
  console.log(`Removed sections from ${res.modifiedCount} post(s). Backup: ${backup.dir}`);
};

(async () => {
  const mode = RESTORE ? 'RESTORE' : `${DROP ? 'DROP SECTIONS' : 'MERGE'} ${APPLY ? 'APPLY' : 'dry run'}`;
  const { db } = await connect(mode);
  try {
    if (RESTORE) await restoreBackup(db, RESTORE, ONLY);
    else if (DROP) await dropSections(db);
    else await merge(db);
  } finally {
    await disconnect();
  }
})().catch((err) => {
  console.error('FAILED:', err.message);
  process.exit(1);
});
