const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const express = require('express');
const sharp = require('sharp');
const { createCardImage, createBlogCardHandler, generateUploadedBlogCard } = require('../utills/blogCardImages');
const { uploadAndResizeImages } = require('../controller/handlerFactory');
const { generateBlogCards } = require('../scripts/generate-blog-cards');

test('uploads generate a permanent card; existing images fall back until migrated', async (t) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'blog-card-test-'));
  const blogDir = path.join(dir, 'blog');
  const cardDir = path.join(dir, 'cards');
  await fs.mkdir(blogDir);
  const app = express();
  app.get('/card/:filename', createBlogCardHandler(blogDir, cardDir));
  app.get('/blog/:filename', (req, res) => res.sendFile(path.join(blogDir, req.params.filename)));
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    await fs.rm(dir, { recursive: true, force: true });
  });
  const original = await sharp({ create: { width: 1800, height: 1200, channels: 4, background: '#8844aa80' } }).png().toBuffer();
  const name = 'image_2-existing.png';
  await fs.writeFile(path.join(blogDir, name), original);
  const url = `http://127.0.0.1:${server.address().port}/card/${name}.webp`;
  const before = await fetch(url);
  assert.match(before.headers.get('content-type'), /image\/png/);
  assert.deepEqual(Buffer.from(await before.arrayBuffer()), original);
  await createCardImage(original, name, cardDir);
  const saved = await fs.readFile(path.join(cardDir, `${name}.webp`));
  const results = await Promise.all(Array.from({ length: 10 }, () => fetch(url)));
  for (const result of results) {
    assert.match(result.headers.get('content-type'), /image\/webp/);
    assert.deepEqual(Buffer.from(await result.arrayBuffer()), saved);
  }
  const metadata = await sharp(saved).metadata();
  assert.equal(metadata.width, 960);
  assert.equal(metadata.hasAlpha, true);
  assert.deepEqual(await fs.readFile(path.join(blogDir, name)), original);
  const newName = 'image_2-new.png';
  await new Promise((resolve) => generateUploadedBlogCard(cardDir)(
    { files: { image_2: [{ buffer: original }] }, body: { image_2: `/blog/${newName}` } }, {}, resolve
  ));
  assert.equal((await sharp(await fs.readFile(path.join(cardDir, `${newName}.webp`))).metadata()).width, 960);
  assert.equal((await fetch(`http://127.0.0.1:${server.address().port}/card/image_2-missing.png.webp`)).status, 404);
  assert.equal((await fetch(`http://127.0.0.1:${server.address().port}/card/${name}`)).status, 404);
});

test('migration dry run makes no files and write mode is safe to rerun', async (t) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'blog-migration-test-'));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  const blogDir = path.join(dir, 'blog');
  const cardDir = path.join(dir, 'cards');
  await fs.mkdir(blogDir);
  const original = await sharp({ create: { width: 200, height: 100, channels: 3, background: '#ffffff' } }).png().toBuffer();
  await fs.writeFile(path.join(blogDir, 'image_2-old.png'), original);
  assert.equal((await generateBlogCards(blogDir, cardDir)).created, 1);
  await assert.rejects(fs.access(cardDir), { code: 'ENOENT' });
  assert.equal((await generateBlogCards(blogDir, cardDir, true)).created, 1);
  assert.equal((await generateBlogCards(blogDir, cardDir, true)).existing, 1);
  assert.deepEqual(await fs.readFile(path.join(blogDir, 'image_2-old.png')), original);
});

test('multipart upload saves the original and generates a card through the real upload middleware', async (t) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'blog-upload-test-'));
  const previousDir = process.cwd();
  process.chdir(dir);
  const app = express();
  app.post('/upload', uploadAndResizeImages([{ name: 'image_2', maxCount: 1 }], 'blog'),
    generateUploadedBlogCard(path.join(dir, 'public/blog-card')),
    (req, res) => res.json({ image: req.body.image_2 }));
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    process.chdir(previousDir);
    await fs.rm(dir, { recursive: true, force: true });
  });
  const input = await sharp({ create: { width: 1200, height: 800, channels: 3, background: '#634599' } }).png().toBuffer();
  const form = new FormData();
  form.append('image_2', new Blob([input], { type: 'image/png' }), 'preview.png');
  const response = await fetch(`http://127.0.0.1:${server.address().port}/upload`, { method: 'POST', body: form });
  assert.equal(response.status, 200);
  const { image } = await response.json();
  const filename = path.basename(image);
  assert.deepEqual(await fs.readFile(path.join(dir, 'public/blog', filename)), input);
  const card = await sharp(await fs.readFile(path.join(dir, 'public/blog-card', `${filename}.webp`))).metadata();
  assert.equal(card.format, 'webp');
  assert.equal(card.width, 960);
});
