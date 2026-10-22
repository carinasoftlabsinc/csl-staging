// Runs before `npm run build` (see "prebuild" in package.json).
// Stops the build if the production file points at a local backend, or the development file at the live one,
// so a hand-edited environment file can never reach the live website.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = join(import.meta.dirname, '..', 'src', 'environments');
const read = (name) => readFileSync(join(dir, name), 'utf8');

// Ignore comments so a note like "// localhost" does not trigger the check.
// A "//" only starts a comment at the start of a line or after a space, never inside a URL like "http://...".
const code = (text) => text.replace(/(^|\s)\/\/.*$/gm, '$1').replace(/\/\*[\s\S]*?\*\//g, '');
const local = /localhost|127\.0\.0\.1/;

const problems = [];
if (local.test(code(read('environment.ts')))) {
  problems.push('environment.ts (used by `npm run build`) points at localhost. It must point at the live API.');
}
if (local.test(code(read('environment.live.ts')))) {
  problems.push('environment.live.ts (used by `npm run start:live`) points at localhost. It must point at the live API.');
}
if (/admin\.carinasoftlabs\.com/.test(code(read('environment.development.ts')))) {
  problems.push('environment.development.ts (used by `npm start`) points at the live API. It must point at localhost:8086.');
}

if (problems.length) {
  console.error('\nEnvironment check failed:');
  problems.forEach((p) => console.error(`  - ${p}`));
  console.error('\nFix the file in src/environments and run the build again.\n');
  process.exit(1);
}

console.log('Environment check passed.');
