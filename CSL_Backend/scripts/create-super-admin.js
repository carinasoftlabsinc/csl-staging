// Creates the first SuperAdmin account. Run it once per database; existing admins are not changed.
//
//   SUPERADMIN_NAME="..." SUPERADMIN_EMAIL="..." SUPERADMIN_PASSWORD="..." node scripts/create-super-admin.js
//
// or with options:
//
//   node scripts/create-super-admin.js --name "..." --email "..." --password "..."
//
// The database comes from DATABASE / DATABASE_PASSWORD, the same as server.js.
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './.env' });
const User = require('../model/admin.model');

const args = process.argv.slice(2);
const option = (name) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : undefined;
};

const MIN_PASSWORD_LENGTH = 12;

const name = option('name') || process.env.SUPERADMIN_NAME;
const email = (option('email') || process.env.SUPERADMIN_EMAIL || '').trim().toLowerCase();
const password = option('password') || process.env.SUPERADMIN_PASSWORD;

const fail = (message) => {
  console.error(message);
  process.exit(1);
};

const run = async () => {
  if (!name || !email || !password) {
    fail('Name, email and password are required (see the usage at the top of this file).');
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    fail(`The password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }

  const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
  await mongoose.connect(DB, { useNewUrlParser: true });

  try {
    // The email field has no unique index, so check first. Query the collection directly so
    // deactivated accounts count too (the model's find hook hides them).
    const existing = await User.collection.findOne({ email });
    if (existing) {
      fail(`An account with ${email} already exists (role: ${existing.role}). Nothing was changed.`);
    }

    const user = await User.create({
      name,
      email,
      password,
      passwordConfirm: password,
      role: 'SuperAdmin',
    });
    console.log(`SuperAdmin created: ${user.email} (id ${user._id}).`);
  } finally {
    await mongoose.disconnect();
  }
};

run().catch((err) => fail(`Could not create the SuperAdmin: ${err.message}`));
