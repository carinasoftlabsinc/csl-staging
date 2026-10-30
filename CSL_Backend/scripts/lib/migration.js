// Shared parts of the data scripts in scripts/: command-line options, the dev-database guard,
// backups before a change and putting a backup back.
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

const databaseName = (uri) => (uri.split('@').pop().match(/\/([^/?]+)(\?|$)/) || [])[1] || '';
const isDevDatabase = (name) => /-Dev$/.test(name);

/**
 * Connects to the database from .env. Refuses to run on anything but a "-Dev" database unless
 * --allow-production is passed. Returns { db, dbName, isDev }.
 */
const connect = async (mode) => {
  const uri = process.env.DATABASE || '';
  const dbName = databaseName(uri);
  const isDev = isDevDatabase(dbName);
  console.log(`Database: ${dbName || '(unknown)'} | mode: ${mode}`);
  if (!isDev && !flag('allow-production')) {
    console.error('Refusing to run: the database name does not end in "-Dev". Pass --allow-production to run on production.');
    process.exit(2);
  }
  await mongoose.connect(uri.replace('<PASSWORD>', process.env.DATABASE_PASSWORD));
  return { db: mongoose.connection.db, dbName, isDev };
};

const disconnect = () => mongoose.disconnect();

/** A backup folder: one JSON file per changed document (original fields) plus a manifest. */
const createBackup = (name) => {
  const dir = path.resolve(
    option('backup-dir') ||
      path.join(__dirname, '..', '..', 'backups', name, new Date().toISOString().replace(/[:.]/g, '-'))
  );
  fs.mkdirSync(dir, { recursive: true });
  return {
    dir,
    save(collection, doc, fields) {
      const original = { _id: String(doc._id), collection, fields: {}, missing: [] };
      for (const f of fields) {
        if (doc[f] === undefined) original.missing.push(f);
        else original.fields[f] = doc[f];
      }
      fs.writeFileSync(path.join(dir, `${collection}-${doc._id}.json`), JSON.stringify(original));
    },
    writeManifest(manifest) {
      fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2));
    },
  };
};

/** Puts the backed-up fields back (fields that did not exist before are removed again). */
const restoreBackup = async (db, dir, only) => {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json') && f !== 'manifest.json');
  let restored = 0;
  for (const file of files) {
    const backup = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    if (only && backup._id !== only) continue;
    // Older backups stored the fields at the top level.
    const { _id, collection, fields = {}, missing = [], ...legacy } = backup;
    const set = { ...legacy, ...fields };
    const update = {};
    if (Object.keys(set).length) update.$set = set;
    if (missing.length) update.$unset = Object.fromEntries(missing.map((f) => [f, '']));
    const res = await db.collection(collection).updateOne({ _id: new mongoose.Types.ObjectId(_id) }, update);
    console.log(`  ${collection} ${_id}: ${res.matchedCount ? 'restored' : 'NOT FOUND'} (${[...Object.keys(set), ...missing].join(', ')})`);
    restored += res.matchedCount;
  }
  console.log(`Restored ${restored} document(s).`);
};

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

module.exports = { flag, option, connect, disconnect, createBackup, restoreBackup, kb, ObjectId: mongoose.Types.ObjectId };
