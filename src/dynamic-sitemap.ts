import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { formatHeading } from './app/core/utils/slug.util';

const API = 'https://admin.carinasoftlabs.com/web/web/v1';
const BASE_URL = 'https://carinasoftlabs.com';
const REFRESH_INTERVAL_MS = 15 * 60 * 1000;
const RETRY_INTERVAL_MS = 60 * 1000;

interface SitemapEntry {
  loc: string;
  lastmod: string;
}

interface ContentItem {
  titleLink?: string;
  updatedAt?: string;
  createdAt?: string;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function parseSnapshot(xml: string): SitemapEntry[] {
  return [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>\s*<\/url>/g)]
    .map((match) => ({ loc: match[1].replace(/&amp;/g, '&'), lastmod: match[2] }));
}

function serialize(entries: SitemapEntry[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
    .map(({ loc, lastmod }) => `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${escapeXml(lastmod)}</lastmod>\n  </url>`)
    .join('\n')}\n</urlset>\n`;
}

function lastmod(item: ContentItem, loc: string): string {
  const rawDate = item.updatedAt || item.createdAt;
  const date = rawDate ? new Date(rawDate) : null;
  if (!date || Number.isNaN(date.getTime()) || date.getTime() > Date.now()) {
    throw new Error(`Missing or invalid lastmod date for ${loc}`);
  }
  return date.toISOString().slice(0, 10);
}

async function fetchItems(collection: 'blog' | 'news' | 'project'): Promise<ContentItem[]> {
  const url = `${API}/admin/getAll_${collection}?fields=_id,titleLink,updatedAt,createdAt`;
  const response = await fetch(url, { signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error(`Sitemap API returned ${response.status} for ${collection}`);
  const body = await response.json();
  if (!Array.isArray(body?.data?.data)) {
    throw new Error(`Sitemap API returned unexpected ${collection} data`);
  }
  return body.data.data;
}

export function createDynamicSitemap(browserDistFolder: string) {
  const snapshotPath = join(browserDistFolder, 'sitemap.xml');
  let cachedXml: string | undefined;
  let nextRefresh = 0;
  let pendingRefresh: Promise<string> | undefined;

  async function refresh(): Promise<string> {
    // The build-time sitemap supplies stable static URLs and is also the fallback.
    const snapshot = readFileSync(snapshotPath, 'utf8');
    const snapshotEntries = parseSnapshot(snapshot);
    if (!snapshotEntries.length) throw new Error('The build-time sitemap is empty');

    try {
      const [blogs, news, projects] = await Promise.all([
        fetchItems('blog'), fetchItems('news'), fetchItems('project'),
      ]);
      const contentPrefixes = ['/blog/', '/news/', '/portfolio/'];
      const entries = new Map<string, SitemapEntry>();
      for (const entry of snapshotEntries) {
        if (!contentPrefixes.some((prefix) => entry.loc.startsWith(`${BASE_URL}${prefix}`))) {
          entries.set(entry.loc, entry);
        }
      }

      for (const [items, prefix] of [
        [blogs, '/blog/'], [news, '/news/'], [projects, '/portfolio/'],
      ] as const) {
        for (const item of items) {
          const slug = formatHeading(item.titleLink);
          if (!slug) continue;
          const loc = `${BASE_URL}${prefix}${slug}`;
          const date = lastmod(item, loc);
          const previous = entries.get(loc);
          entries.set(loc, { loc, lastmod: previous && previous.lastmod > date ? previous.lastmod : date });
        }
      }

      for (const [listing, prefix] of [
        ['/blog', '/blog/'], ['/news-room', '/news/'], ['/portfolio', '/portfolio/'],
      ] as const) {
        const entry = entries.get(`${BASE_URL}${listing}`);
        if (!entry) continue;
        for (const item of entries.values()) {
          if (item.loc.startsWith(`${BASE_URL}${prefix}`) && item.lastmod > entry.lastmod) {
            entry.lastmod = item.lastmod;
          }
        }
      }

      cachedXml = serialize([...entries.values()]);
      nextRefresh = Date.now() + REFRESH_INTERVAL_MS;
      return cachedXml;
    } catch (error) {
      console.error('Could not refresh sitemap from the content API:', error);
      nextRefresh = Date.now() + RETRY_INTERVAL_MS;
      cachedXml ??= snapshot;
      return cachedXml;
    }
  }

  return async (): Promise<string> => {
    if (cachedXml && Date.now() < nextRefresh) return cachedXml;
    pendingRefresh ??= refresh().finally(() => { pendingRefresh = undefined; });
    return pendingRefresh;
  };
}
