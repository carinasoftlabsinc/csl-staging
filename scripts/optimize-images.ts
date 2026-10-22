// Writes a .webp twin for PNG/JPG/SVG/GIF inputs (GIF animation is kept); re-encodes WebP inputs in place only when smaller.
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { extname } from 'node:path';
import sharp from 'sharp';

const args = process.argv.slice(2);
const flag = (name: string) => args.find(a => a.startsWith(`--${name}=`))?.split('=')[1];
const width = flag('width') ? Number(flag('width')) : undefined;
const quality = Number(flag('quality') ?? 80);
const lossless = args.includes('--lossless');
const files = args.filter(a => !a.startsWith('--'));

if (!files.length) {
  console.error('Usage: npm run optimize-images -- <file...> [--width=N] [--quality=N] [--lossless]');
  process.exit(1);
}

const kb = (bytes: number) => `${Math.round(bytes / 1024)} KB`;

async function optimize(file: string): Promise<void> {
  if (!existsSync(file)) throw new Error(`${file} does not exist`);
  const ext = extname(file).toLowerCase();
  const output = ext === '.webp' ? file : file.slice(0, -ext.length) + '.webp';
  const before = statSync(file).size;

  const animated = ext === '.gif' || ext === '.webp';
  let image = sharp(readFileSync(file), ext === '.svg' && width ? { density: 72 * 4 } : { animated });
  if (width) image = image.resize({ width, withoutEnlargement: ext !== '.svg' });
  const data = await image.webp({ quality, lossless, effort: 6, smartSubsample: true }).toBuffer();

  if (output === file && data.length >= before) {
    console.log(`skip  ${file} (${kb(before)}; re-encoding would not shrink it)`);
    return;
  }
  writeFileSync(output, data);
  console.log(`${kb(before).padStart(8)} -> ${kb(data.length).padStart(7)}  ${output}`);
}

async function main(): Promise<void> {
  for (const file of files) await optimize(file);
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
