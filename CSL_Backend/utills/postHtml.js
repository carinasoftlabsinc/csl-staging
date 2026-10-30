// Cleans the HTML of post text (blog content, FAQ answers, news, careers, projects) before it is saved.
// Only the tags and attributes the admin editor produces are kept, so a pasted <script>, an
// onerror="…" or a javascript: link can never reach the website.
const sanitizeHtml = require('sanitize-html');
const { moveEmbeddedImagesToFiles, addSizesToFileImages } = require('./contentImages');

// CSS values: colours, sizes, keywords. No url(...) or expressions.
const SAFE_CSS_VALUE = /^(?!.*(url|expression)\s*\()[#a-z0-9(),.%\s'"-]+$/i;
const ALLOWED_STYLE_PROPERTIES = [
  'color',
  'background-color',
  'text-align',
  'font-size',
  'font-weight',
  'font-style',
  'text-decoration',
  'width',
  'height',
  'max-width',
];

/**
 * The website does not show inline styles, so the editor's alignment (text-align) and indent
 * (padding-left, 40px per step) become classes it styles: post-align-center, post-indent-2, …
 */
const layoutStylesToClasses = (attribs) => {
  if (!attribs.style) return attribs;
  const classes = String(attribs.class || '')
    .split(/\s+/)
    .filter((c) => c && !/^post-(align|indent)-/.test(c));
  const rest = [];
  for (const rule of String(attribs.style).split(';')) {
    const [prop, ...value] = rule.split(':');
    const name = (prop || '').trim().toLowerCase();
    const val = value.join(':').trim().toLowerCase();
    if (!name) continue;
    if (name === 'text-align' && ['left', 'center', 'right', 'justify'].includes(val)) {
      if (val !== 'left') classes.push(`post-align-${val}`);
    } else if ((name === 'padding-left' || name === 'margin-left') && /^\d+(\.\d+)?px$/.test(val)) {
      const steps = Math.min(4, Math.round(parseFloat(val) / 40));
      if (steps > 0) classes.push(`post-indent-${steps}`);
    } else {
      rest.push(`${name}: ${value.join(':').trim()}`);
    }
  }
  const out = { ...attribs };
  if (classes.length) out.class = classes.join(' ');
  else delete out.class;
  if (rest.length) out.style = rest.join('; ');
  else delete out.style;
  return out;
};

const OPTIONS = {
  allowedTags: [
    'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'div', 'span', 'br', 'hr',
    'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'sub', 'sup',
    'blockquote', 'pre', 'code',
    'ul', 'ol', 'li',
    'a', 'img', 'figure', 'figcaption',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ],
  allowedAttributes: {
    // `id` is the target of an anchor link (#name); its value is limited in transformTags.a.
    a: ['href', 'target', 'rel', 'title', 'id'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'decoding'],
    td: ['colspan', 'rowspan'],
    th: ['colspan', 'rowspan'],
    '*': ['class', 'style', 'dir'],
  },
  allowedStyles: {
    '*': Object.fromEntries(ALLOWED_STYLE_PROPERTIES.map((p) => [p, [SAFE_CSS_VALUE]])),
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  // An image whose conversion to a file failed stays as base64 rather than disappearing.
  allowedSchemesByTag: { img: ['http', 'https', 'data'] },
  transformTags: {
    // The post title is the page's only H1.
    h1: 'h2',
    a: (tagName, attribs) => {
      if (attribs.target === '_blank') {
        // Keep what the editor chose (e.g. nofollow) and always add noopener noreferrer.
        const rel = new Set(String(attribs.rel || '').split(/\s+/).filter(Boolean));
        rel.add('noopener').add('noreferrer');
        attribs.rel = [...rel].join(' ');
      }
      if (attribs.id !== undefined) {
        const id = String(attribs.id).toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
        if (id) attribs.id = id;
        else delete attribs.id;
      }
      return { tagName, attribs };
    },
    '*': (tagName, attribs) => ({ tagName, attribs: layoutStylesToClasses(attribs) }),
  },
};

const EMPTY_BLOCK = /<(h[2-6]|p|div)\b[^>]*>(?:\s|&nbsp;| |<br\s*\/?>)*<\/\1>/gi;

/**
 * Removes the editor leftovers that make posts messy: images inside headings (moved right after the
 * heading), repeated or trailing <br>, and empty headings, paragraphs and divs.
 */
const tidyPostHtml = (html) => {
  let out = html.replace(/<(h[2-6])\b([^>]*)>([\s\S]*?)<\/\1>/gi, (match, tag, attrs, inner) => {
    const images = inner.match(/<img\b[^>]*>/gi);
    if (!images) return match;
    return `<${tag}${attrs}>${inner.replace(/<img\b[^>]*>/gi, '')}</${tag}><p>${images.join('')}</p>`;
  });
  out = out
    .replace(/(?:<br\s*\/?>\s*)+(<\/(?:p|div|h[2-6]|li|blockquote)>)/gi, '$1')
    .replace(/(?:<br\s*\/?>\s*){2,}/gi, '<br />');
  let previous;
  do {
    previous = out;
    out = out.replace(EMPTY_BLOCK, '');
  } while (out !== previous);
  return out.trim();
};

const sanitizePostHtml = (html) => {
  if (html === null || html === undefined) return html;
  return tidyPostHtml(sanitizeHtml(String(html), OPTIONS));
};

// Everything a save handler needs: embedded images to files, sizes on our file images, then the allow-list.
const preparePostHtml = async (html) => {
  if (html === null || html === undefined || html === '') return html;
  return sanitizePostHtml(await addSizesToFileImages(await moveEmbeddedImagesToFiles(html)));
};

// Counts each tag in the HTML, used by the scripts to report what the cleaner removed.
const countTags = (html) => {
  const counts = {};
  for (const m of String(html || '').matchAll(/<([a-z][a-z0-9]*)\b/gi)) {
    const tag = m[1].toLowerCase();
    counts[tag] = (counts[tag] || 0) + 1;
  }
  return counts;
};

module.exports = { sanitizePostHtml, preparePostHtml, tidyPostHtml, countTags };
