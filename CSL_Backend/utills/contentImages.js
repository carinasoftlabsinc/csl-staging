// Images inside CMS post text (blog sections, blog FAQ answers, news content).
// The admin editor embeds pictures as base64 "data:" URIs, which makes post pages several MB.
// These helpers turn each embedded picture into a real file in public/content-images/ and put
// the file URL in the HTML instead.
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const CONTENT_IMAGE_FOLDER = 'content-images';
const CONTENT_IMAGE_DIR = path.join(__dirname, '..', 'public', CONTENT_IMAGE_FOLDER);
const MAX_INPUT_BYTES = 10 * 1024 * 1024;
const MAX_WIDTH = 1600;
const WEBP_QUALITY = 82;

// Base URL the website uses to load the files: <base>/content-images/<name>.
// Production: https://admin.carinasoftlabs.com/web/web/file
const fileBaseUrl = () =>
  (process.env.PUBLIC_FILE_BASE_URL || `http://localhost:${process.env.PORT || 8086}/web/file`).replace(/\/+$/, '');

// Real type from the first bytes. The editor's "data:image/<type>" label is not reliable.
const detectType = (buf) => {
  if (buf.length >= 8 && buf[0] === 0x89 && buf.toString('ascii', 1, 4) === 'PNG') return 'png';
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpeg';
  if (buf.length >= 6 && buf.toString('ascii', 0, 4) === 'GIF8') return 'gif';
  if (buf.length >= 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  if (buf.length >= 12 && buf.toString('ascii', 4, 8) === 'ftyp') return 'avif';
  return null;
};

/**
 * Converts one image to WebP (max 1600 px wide, no enlarging, EXIF rotation applied, metadata removed).
 * Animated GIFs are kept as GIF so they keep moving. The file name is a hash of the original bytes, so the
 * same picture always gets the same file and running twice does not create copies.
 * With { write: false } nothing is written (used by the dry run to report sizes).
 * Returns { url, fileName, width, height, bytes, originalBytes, type }.
 */
const saveImage = async (buffer, { write = true } = {}) => {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) throw new Error('empty image');
  if (buffer.length > MAX_INPUT_BYTES) throw new Error(`image is larger than ${MAX_INPUT_BYTES / 1024 / 1024} MB`);
  const type = detectType(buffer);
  if (!type) throw new Error('unsupported image type');

  const hash = crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 32);
  const meta = await sharp(buffer, { animated: true }).metadata();

  let output;
  let ext;
  let width;
  let height;
  if (type === 'gif' && (meta.pages || 1) > 1) {
    output = buffer;
    ext = 'gif';
    width = meta.width;
    height = meta.pageHeight || meta.height;
  } else {
    const { data, info } = await sharp(buffer)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer({ resolveWithObject: true });
    output = data;
    ext = 'webp';
    width = info.width;
    height = info.height;
  }

  const fileName = `${hash}.${ext}`;
  if (write) {
    fs.mkdirSync(CONTENT_IMAGE_DIR, { recursive: true });
    const filePath = path.join(CONTENT_IMAGE_DIR, fileName);
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, output);
  }

  return {
    url: `${fileBaseUrl()}/${CONTENT_IMAGE_FOLDER}/${fileName}`,
    fileName,
    width,
    height,
    bytes: output.length,
    originalBytes: buffer.length,
    type,
  };
};

const IMG_TAG = /<img\b[^>]*>/gi;
const DATA_SRC = /(\ssrc\s*=\s*)(["'])data:image\/[a-z0-9.+-]*;base64,([^"']*)\2/i;

const hasEmbeddedImages = (html) => typeof html === 'string' && /<img\b[^>]*\ssrc\s*=\s*["']data:image\//i.test(html);

/**
 * Replaces every base64 <img> in the HTML with a file URL and adds width, height, loading="lazy" and
 * decoding="async" when they are missing. Everything else in the HTML is left exactly as it was.
 * An image that cannot be converted is left as it is and reported in `errors`.
 * Returns { html, changed, images, errors }.
 */
const extractEmbeddedImages = async (html, { write = true } = {}) => {
  const result = { html, changed: false, images: [], errors: [] };
  if (!hasEmbeddedImages(html)) return result;

  const tags = html.match(IMG_TAG) || [];
  const replacements = new Map();
  for (const tag of tags) {
    if (replacements.has(tag)) continue;
    const src = DATA_SRC.exec(tag);
    if (!src) continue;
    try {
      const buffer = Buffer.from(src[3].replace(/\s+/g, ''), 'base64');
      const saved = await saveImage(buffer, { write });
      let newTag = tag.replace(DATA_SRC, `$1$2${saved.url}$2`);
      let extra = '';
      if (!/\swidth\s*=/i.test(newTag) && !/\sheight\s*=/i.test(newTag)) {
        extra += ` width="${saved.width}" height="${saved.height}"`;
      }
      if (!/\sloading\s*=/i.test(newTag)) extra += ' loading="lazy"';
      if (!/\sdecoding\s*=/i.test(newTag)) extra += ' decoding="async"';
      if (extra) newTag = newTag.replace(/(\s*\/?>)$/, `${extra}$1`);
      replacements.set(tag, newTag);
      result.images.push(saved);
    } catch (err) {
      result.errors.push(err.message);
    }
  }

  if (replacements.size) {
    result.html = html.replace(IMG_TAG, (tag) => replacements.get(tag) || tag);
    result.changed = true;
  }
  return result;
};

/**
 * For save handlers: returns the HTML with its embedded images moved to files. Never throws, so a save
 * never fails because of one picture; an image that cannot be converted stays as it is and is logged.
 */
const moveEmbeddedImagesToFiles = async (html) => {
  if (!hasEmbeddedImages(html)) return html;
  try {
    const res = await extractEmbeddedImages(html);
    if (res.errors.length) console.error('Content images left embedded:', res.errors.join('; '));
    return res.html;
  } catch (err) {
    console.error('Content images not converted:', err.message);
    return html;
  }
};

const FILE_SRC = /\ssrc\s*=\s*["'][^"']*\/content-images\/([a-f0-9]{32}\.(?:webp|gif))["']/i;

/**
 * Images inserted with the editor's image button point at our files but have no size. Adds width,
 * height, loading="lazy" and decoding="async" (read from the file) so the page does not jump while loading.
 */
const addSizesToFileImages = async (html) => {
  if (typeof html !== 'string' || !html.includes('/content-images/')) return html;
  const sizes = new Map();
  for (const tag of html.match(IMG_TAG) || []) {
    const file = FILE_SRC.exec(tag);
    if (!file || /\s(width|height)\s*=/i.test(tag) || sizes.has(file[1])) continue;
    try {
      // Read into memory first: sharp keeps opened files cached, which locks them on Windows.
      const meta = await sharp(await fs.promises.readFile(path.join(CONTENT_IMAGE_DIR, file[1]))).metadata();
      sizes.set(file[1], { width: meta.width, height: meta.pageHeight || meta.height });
    } catch (err) {
      sizes.set(file[1], null); // file not on this server: leave the tag as it is
    }
  }
  if (!sizes.size) return html;
  return html.replace(IMG_TAG, (tag) => {
    const file = FILE_SRC.exec(tag);
    const size = file && sizes.get(file[1]);
    if (!size || /\s(width|height)\s*=/i.test(tag)) return tag;
    let extra = ` width="${size.width}" height="${size.height}"`;
    if (!/\sloading\s*=/i.test(tag)) extra += ' loading="lazy"';
    if (!/\sdecoding\s*=/i.test(tag)) extra += ' decoding="async"';
    return tag.replace(/(\s*\/?>)$/, `${extra}$1`);
  });
};

module.exports = {
  addSizesToFileImages,
  CONTENT_IMAGE_DIR,
  CONTENT_IMAGE_FOLDER,
  MAX_INPUT_BYTES,
  detectType,
  saveImage,
  hasEmbeddedImages,
  extractEmbeddedImages,
  moveEmbeddedImagesToFiles,
};
