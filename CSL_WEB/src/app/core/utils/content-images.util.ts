/**
 * Helpers for the images inside CMS post text (blog posts and news posts).
 *
 * The editor stores many of these images as base64 "data:" URIs, so the page template cannot give them a
 * width and height. These functions read the size from the image header and add `width`, `height`,
 * `loading="lazy"` and `decoding="async"` to every <img> in the HTML string. Runs the same on the server and in
 * the browser (no DOM needed).
 */

export interface ImageSize {
  width: number;
  height: number;
}

/** Only the start of the file is needed to read the size, so a long image is not decoded in full. */
const MAX_BASE64_CHARS = 524288;

function decodeBase64Prefix(payload: string, chars: number): Uint8Array {
  const slice = payload.slice(0, chars - (chars % 4));
  const binary = atob(slice);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function pngSize(b: Uint8Array): ImageSize | null {
  if (b.length < 24 || b[0] !== 0x89 || b[1] !== 0x50) return null;
  const width = (b[16] << 24) | (b[17] << 16) | (b[18] << 8) | b[19];
  const height = (b[20] << 24) | (b[21] << 16) | (b[22] << 8) | b[23];
  return width > 0 && height > 0 ? { width, height } : null;
}

function gifSize(b: Uint8Array): ImageSize | null {
  if (b.length < 10 || b[0] !== 0x47 || b[1] !== 0x49) return null;
  const width = b[6] | (b[7] << 8);
  const height = b[8] | (b[9] << 8);
  return width > 0 && height > 0 ? { width, height } : null;
}

function jpegSize(b: Uint8Array): ImageSize | null {
  if (b.length < 4 || b[0] !== 0xff || b[1] !== 0xd8) return null;
  let pos = 2;
  while (pos + 9 < b.length) {
    if (b[pos] !== 0xff) {
      pos++;
      continue;
    }
    const marker = b[pos + 1];
    if (marker === 0xff) {
      pos++;
      continue;
    }
    // Start-of-frame markers carry the size (C4, C8 and CC are not frames).
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      const height = (b[pos + 5] << 8) | b[pos + 6];
      const width = (b[pos + 7] << 8) | b[pos + 8];
      return width > 0 && height > 0 ? { width, height } : null;
    }
    pos += 2 + ((b[pos + 2] << 8) | b[pos + 3]);
  }
  return null;
}

function webpSize(b: Uint8Array): ImageSize | null {
  if (b.length < 30 || b[0] !== 0x52 || b[8] !== 0x57) return null;
  const chunk = String.fromCharCode(b[12], b[13], b[14], b[15]);
  if (chunk === 'VP8 ') {
    return { width: (b[26] | (b[27] << 8)) & 0x3fff, height: (b[28] | (b[29] << 8)) & 0x3fff };
  }
  if (chunk === 'VP8L') {
    const bits = b[21] | (b[22] << 8) | (b[23] << 16) | (b[24] << 24);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (chunk === 'VP8X') {
    return {
      width: (b[24] | (b[25] << 8) | (b[26] << 16)) + 1,
      height: (b[27] | (b[28] << 8) | (b[29] << 16)) + 1,
    };
  }
  return null;
}

/** Reads the pixel size of a base64 data URI (PNG, JPEG, GIF or WebP). Returns null when it cannot be read. */
export function sizeFromDataUri(uri: string): ImageSize | null {
  const match = /^data:image\/(png|jpe?g|gif|webp);base64,/i.exec(uri);
  if (!match) return null;
  try {
    const payload = uri.slice(match[0].length);
    const type = match[1].toLowerCase();
    const bytes = decodeBase64Prefix(payload, type.startsWith('jp') ? MAX_BASE64_CHARS : 96);
    const size =
      type === 'png' ? pngSize(bytes) : type === 'gif' ? gifSize(bytes) : type === 'webp' ? webpSize(bytes) : jpegSize(bytes);
    return size && size.width > 0 && size.height > 0 ? size : null;
  } catch {
    return null;
  }
}

/**
 * Adds `width`/`height` (when readable), `loading="lazy"` and `decoding="async"` to every <img> in the HTML.
 * Attributes that are already there are left alone.
 */
export function optimizeContentImages(html: string): string {
  if (!html || !/<img\b/i.test(html)) return html;
  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    let extra = '';
    if (!/\swidth\s*=/i.test(tag) && !/\sheight\s*=/i.test(tag)) {
      const src = /\ssrc\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(tag);
      const uri = src ? (src[1] ?? src[2]) : '';
      const size = uri && uri.startsWith('data:image') ? sizeFromDataUri(uri) : null;
      if (size) extra += ` width="${size.width}" height="${size.height}"`;
    }
    if (!/\sloading\s*=/i.test(tag)) extra += ' loading="lazy"';
    if (!/\sdecoding\s*=/i.test(tag)) extra += ' decoding="async"';
    return extra ? tag.replace(/(\s*\/?>)$/, extra + '$1') : tag;
  });
}

/**
 * Gives every content image that has no alt text (or an empty one) a short description, so no image
 * in a post is reported as missing alt text. Alt text written in the admin editor is kept as it is.
 * `nextNumber` keeps the numbering going across several pieces of the same post.
 */
export function addMissingImageAlts(html: string, label: string, nextNumber?: () => number): string {
  if (!html || !/<img\b/i.test(html)) return html;
  const base = (label || 'Carina Softlabs blog').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  let n = 0;
  const next = nextNumber ?? (() => ++n);
  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    const number = next();
    const alt = /\salt\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(tag);
    if (alt && (alt[1] ?? alt[2]).trim()) return tag;
    const text = `${base} - image ${number}`;
    return alt ? tag.replace(alt[0], ` alt="${text}"`) : tag.replace(/(\s*\/?>)$/, ` alt="${text}"$1`);
  });
}
