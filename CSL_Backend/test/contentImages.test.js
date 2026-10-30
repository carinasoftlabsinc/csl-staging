// node --test test/
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const {
  CONTENT_IMAGE_DIR,
  detectType,
  saveImage,
  hasEmbeddedImages,
  extractEmbeddedImages,
  moveEmbeddedImagesToFiles,
} = require('../utills/contentImages');

const png = (width, height) =>
  sharp({ create: { width, height, channels: 3, background: { r: 200, g: 40, b: 90 } } }).png().toBuffer();
const dataUri = (buf, label = 'png') => `data:image/${label};base64,${buf.toString('base64')}`;

test('detectType reads the real type from the bytes', async () => {
  assert.strictEqual(detectType(await png(4, 4)), 'png');
  assert.strictEqual(detectType(await sharp(await png(4, 4)).jpeg().toBuffer()), 'jpeg');
  assert.strictEqual(detectType(await sharp(await png(4, 4)).webp().toBuffer()), 'webp');
  assert.strictEqual(detectType(Buffer.from('<svg></svg>')), null);
});

test('saveImage converts to WebP, keeps small images small and limits the width to 1600', async () => {
  const small = await saveImage(await png(300, 200), { write: false });
  assert.match(small.url, /\/content-images\/[a-f0-9]{32}\.webp$/);
  assert.deepStrictEqual([small.width, small.height], [300, 200]);

  const wide = await saveImage(await png(3200, 1000), { write: false });
  assert.deepStrictEqual([wide.width, wide.height], [1600, 500]);
});

test('saveImage gives the same picture the same file name', async () => {
  const buf = await png(50, 50);
  const a = await saveImage(buf, { write: false });
  const b = await saveImage(buf, { write: false });
  assert.strictEqual(a.fileName, b.fileName);
});

test('saveImage rejects files that are not images', async () => {
  await assert.rejects(saveImage(Buffer.from('not an image'), { write: false }), /unsupported image type/);
  await assert.rejects(saveImage(Buffer.alloc(0), { write: false }), /empty image/);
});

test('extractEmbeddedImages replaces base64 images and keeps everything else', async () => {
  const buf = await png(120, 80);
  const html =
    `<p>Intro</p><p><img src="${dataUri(buf, 'webp')}" alt="Chart"></p>` +
    '<img src="https://example.com/a.webp" alt="Already a file" width="10" height="10">' +
    `<img style="width: 50%;" src="${dataUri(buf)}" width="60">`;

  const res = await extractEmbeddedImages(html, { write: false });

  assert.strictEqual(res.changed, true);
  assert.strictEqual(res.errors.length, 0);
  assert.strictEqual(res.images.length, 2);
  assert.ok(!res.html.includes('data:image'));
  assert.match(res.html, /<img src="[^"]+\.webp" alt="Chart" width="120" height="80" loading="lazy" decoding="async">/);
  assert.ok(res.html.includes('<img src="https://example.com/a.webp" alt="Already a file" width="10" height="10">'));
  // An image that already has a width keeps it (no height is added next to it).
  assert.match(res.html, /<img style="width: 50%;" src="[^"]+\.webp" width="60" loading="lazy" decoding="async">/);
  assert.ok(res.html.startsWith('<p>Intro</p>'));
});

test('extractEmbeddedImages leaves an image that cannot be read and reports it', async () => {
  const html = '<p><img src="data:image/png;base64,bm90IGFuIGltYWdl" alt="Broken"></p>';
  const res = await extractEmbeddedImages(html, { write: false });
  assert.strictEqual(res.changed, false);
  assert.strictEqual(res.html, html);
  assert.strictEqual(res.errors.length, 1);
});

test('HTML without base64 images is returned unchanged', async () => {
  const html = '<p>Text <img src="/blog/x.png"></p>';
  assert.strictEqual(hasEmbeddedImages(html), false);
  assert.strictEqual(await moveEmbeddedImagesToFiles(html), html);
  assert.strictEqual(await moveEmbeddedImagesToFiles(null), null);
  assert.strictEqual(await moveEmbeddedImagesToFiles(''), '');
});

test('moveEmbeddedImagesToFiles writes the file and a second run changes nothing', async () => {
  const buf = await png(33, 21);
  const once = await moveEmbeddedImagesToFiles(`<img src="${dataUri(buf)}">`);
  const fileName = /content-images\/([a-f0-9]{32}\.webp)/.exec(once)[1];
  const filePath = path.join(CONTENT_IMAGE_DIR, fileName);
  try {
    assert.ok(fs.existsSync(filePath));
    assert.strictEqual(await moveEmbeddedImagesToFiles(once), once);
  } finally {
    fs.rmSync(filePath, { force: true });
  }
});
