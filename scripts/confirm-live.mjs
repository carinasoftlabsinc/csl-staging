// Runs before `npm run start:live` (see "prestart:live" in package.json): asks before starting with live data.
import { createInterface } from 'node:readline/promises';

if (!process.stdin.isTTY) {
  console.error('start:live needs a terminal to confirm. Run it from a terminal.');
  process.exit(1);
}

const rl = createInterface({ input: process.stdin, output: process.stdout });
const answer = (await rl.question('LIVE data. Continue? (y/N) ')).trim().toLowerCase();
rl.close();

if (answer !== 'y' && answer !== 'yes') {
  console.log('Cancelled.');
  process.exit(1);
}
