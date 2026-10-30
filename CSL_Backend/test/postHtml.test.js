const test = require('node:test');
const assert = require('node:assert');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { sanitizePostHtml, preparePostHtml, countTags } = require('../utills/postHtml');
const { CONTENT_IMAGE_DIR } = require('../utills/contentImages');

test('removes scripts, frames and event handlers', () => {
  const out = sanitizePostHtml(
    '<p>Hi<script>alert(1)</script></p><iframe src="https://evil.example"></iframe>' +
      '<img src="/blog/a.png" onerror="alert(2)"><p onclick="x()">Text</p><style>p{}</style>'
  );
  assert.ok(!/script|iframe|onerror|onclick|style>/i.test(out), out);
  assert.ok(out.includes('<img src="/blog/a.png" />') || out.includes('<img src="/blog/a.png">'), out);
  assert.ok(out.includes('<p>Text</p>'), out);
});

test('removes javascript: links but keeps normal ones', () => {
  const out = sanitizePostHtml('<a href="javascript:alert(1)">bad</a> <a href="https://carinasoftlabs.com">good</a>');
  assert.ok(!out.includes('javascript:'), out);
  assert.ok(out.includes('<a href="https://carinasoftlabs.com">good</a>'), out);
});

test('turns h1 into h2 and keeps h2 to h6', () => {
  const out = sanitizePostHtml('<h1>Title</h1><h2>Part</h2><h3>Sub</h3>');
  assert.strictEqual(out, '<h2>Title</h2><h2>Part</h2><h3>Sub</h3>');
});

test('keeps image attributes, file URLs and base64 images', () => {
  const img = '<img src="https://admin.carinasoftlabs.com/web/web/file/content-images/abc.webp" alt="Chart" width="1600" height="800" loading="lazy" decoding="async" />';
  assert.strictEqual(sanitizePostHtml(img), img);
  const data = '<img src="data:image/png;base64,iVBORw0KGgo=" />';
  assert.strictEqual(sanitizePostHtml(data), data);
  assert.ok(!sanitizePostHtml('<a href="data:text/html;base64,PHNjcmlwdD4=">x</a>').includes('data:'));
});

test('new-tab links get rel="noopener noreferrer"', () => {
  const out = sanitizePostHtml('<a href="https://x.com" target="_blank">x</a>');
  assert.strictEqual(out, '<a href="https://x.com" target="_blank" rel="noopener noreferrer">x</a>');
});

test('keeps classes and allowed styles, drops other styles', () => {
  const out = sanitizePostHtml(
    '<p class="quote" style="text-align:center;color:#ff0000;position:absolute;background-image:url(https://x.com/a.png)">Hi</p>'
  );
  assert.strictEqual(out, '<p class="quote post-align-center" style="color:#ff0000">Hi</p>');
});

test('keeps editor formatting (lists, bold, font, tables)', () => {
  const html =
    '<ul><li><b>One</b></li><li><i>Two</i></li></ul><p>Red</p>' +
    '<table><tbody><tr><td colspan="2">Cell</td></tr></tbody></table><blockquote>Q</blockquote><pre><code>x = 1</code></pre>';
  assert.strictEqual(sanitizePostHtml(html), html);
});

test('null, undefined and empty values pass through', async () => {
  assert.strictEqual(sanitizePostHtml(null), null);
  assert.strictEqual(sanitizePostHtml(undefined), undefined);
  assert.strictEqual(await preparePostHtml(''), '');
  assert.strictEqual(await preparePostHtml(null), null);
});

test('preparePostHtml moves base64 images to files and cleans the HTML', async () => {
  const png = await sharp({ create: { width: 30, height: 20, channels: 3, background: '#336699' } }).png().toBuffer();
  const out = await preparePostHtml(
    `<h1>Title</h1><p><img src="data:image/png;base64,${png.toString('base64')}" onerror="alert(1)" alt="A"></p>`
  );
  const file = /content-images\/([a-f0-9]{32}\.webp)/.exec(out)[1];
  try {
    assert.match(out, /^<h2>Title<\/h2><p><img src="[^"]+\.webp" alt="A" width="30" height="20" loading="lazy" decoding="async" \/><\/p>$/);
  } finally {
    fs.rmSync(path.join(CONTENT_IMAGE_DIR, file), { force: true });
  }
});

test('countTags counts each tag', () => {
  assert.deepStrictEqual(countTags('<p><b>a</b></p><p><img src="x"></p>'), { p: 2, b: 1, img: 1 });
});

test('preparePostHtml adds the size to an uploaded image that has none', async () => {
  const png = await sharp({ create: { width: 40, height: 25, channels: 3, background: '#aa3366' } }).png().toBuffer();
  const { saveImage } = require('../utills/contentImages');
  const saved = await saveImage(png);
  try {
    const out = await preparePostHtml(`<p><img src="${saved.url}"></p><img src="https://x.com/content-images/${'0'.repeat(32)}.webp">`);
    assert.ok(out.includes(`<img src="${saved.url}" width="40" height="25" loading="lazy" decoding="async" />`), out);
    assert.ok(out.includes(`<img src="https://x.com/content-images/${'0'.repeat(32)}.webp" />`), out);
  } finally {
    fs.rmSync(path.join(CONTENT_IMAGE_DIR, saved.fileName), { force: true });
  }
});

test('tidies the leftovers of the old editor (real post from the admin)', () => {
  const img = '<img src="http://localhost:8086/web/file/content-images/7aa9fc1cab664d32e2513e13f1f6996f.webp" width="1600" height="668" loading="lazy" decoding="async" />';
  const html =
    '<h2><font face="Arial"><br /></font></h2><h2><font face="Arial">This is the heading on h2 <br /></font>' + img +
    '<br /><br /><font face="Arial"></font></h2><div>The desc for the image is here <br /><br /><br /></div>';
  assert.strictEqual(
    sanitizePostHtml(html),
    `<h2>This is the heading on h2 </h2><p>${img}</p><div>The desc for the image is here </div>`
  );
});

test('collapses repeated <br> and keeps single ones', () => {
  assert.strictEqual(sanitizePostHtml('<p>a<br /><br /><br />b<br>c</p>'), '<p>a<br />b<br />c</p>');
  assert.strictEqual(sanitizePostHtml('<p>&nbsp;</p><p>Text</p><p><br></p>'), '<p>Text</p>');
});

test('alignment and indent become classes the website styles', () => {
  assert.strictEqual(
    sanitizePostHtml('<p style="text-align: right;">R</p><h2 style="text-align: center;">C</h2><p style="padding-left: 80px;">I</p><p style="text-align: left;">L</p>'),
    '<p class="post-align-right">R</p><h2 class="post-align-center">C</h2><p class="post-indent-2">I</p><p>L</p>'
  );
});

test('anchors keep a safe id; new-tab links keep nofollow', () => {
  assert.strictEqual(sanitizePostHtml('<p><a id="Part One!"></a>x</p>'), '<p><a id="part-one"></a>x</p>');
  assert.strictEqual(
    sanitizePostHtml('<a href="https://x.com" target="_blank" rel="nofollow">x</a>'),
    '<a href="https://x.com" target="_blank" rel="nofollow noopener noreferrer">x</a>'
  );
});

test('code samples, horizontal lines and sub/superscript are kept', () => {
  const html = '<pre class="language-javascript"><code>const a = 1 &lt; 2;</code></pre><hr /><p>H<sub>2</sub>O x<sup>2</sup> <s>old</s></p>';
  assert.strictEqual(sanitizePostHtml(html), html);
});
