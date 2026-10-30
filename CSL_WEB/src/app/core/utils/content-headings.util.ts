/**
 * Table of contents for CMS post text (blog posts store the whole body as one HTML document).
 *
 * Gives every <h2> an `id` made from its text and returns the list of headings, so the page can link to
 * them. String code only (no DOM), so it runs the same on the server and in the browser.
 */

export interface ContentHeading {
  id: string;
  text: string;
}

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", apos: "'", nbsp: ' ' };

function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&([a-z0-9#]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m);
}

/** "Why Speed Matters?" -> "why-speed-matters" */
export function headingId(text: string): string {
  return (
    text
      .normalize('NFKD')
      .replace(/\p{M}/gu, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'section'
  );
}

/**
 * Adds a unique `id` to each <h2> (an existing id is kept) and returns the headings in order.
 * Run it after any HTML sanitizer, because Angular's sanitizer removes `id` attributes.
 */
export function addHeadingIds(html: string): { html: string; headings: ContentHeading[] } {
  const headings: ContentHeading[] = [];
  if (!html || !/<h2\b/i.test(html)) return { html, headings };

  const used = new Set<string>();
  const out = html.replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi, (match, attrs: string, inner: string) => {
    const text = decodeEntities(inner.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();
    if (!text) return match;

    const existing = /\sid\s*=\s*["']([^"']+)["']/i.exec(attrs);
    let id = existing ? existing[1] : headingId(text);
    if (!existing) {
      const base = id;
      for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
    }
    used.add(id);
    headings.push({ id, text });
    return existing ? match : `<h2 id="${id}"${attrs}>${inner}</h2>`;
  });
  return { html: out, headings };
}
