import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { formatHeading } from '../src/app/core/utils/slug.util';

const API = 'https://admin.carinasoftlabs.com/web/web/v1';
const BASE_URL = 'https://carinasoftlabs.com';
const TODAY = new Date().toISOString().split('T')[0];
const SITEMAP_PATH = join(process.cwd(), 'src/sitemap.xml');

function formatDate(dateStr: string | undefined, url: string): string {
  const date = dateStr ? new Date(dateStr) : null;
  if (!date || isNaN(date.getTime()) || date.getTime() > Date.now()) {
    throw new Error(`Missing or invalid lastmod date for ${url}`);
  }
  return date.toISOString().split('T')[0];
}

async function fetchJson(url: string) {
  const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
  if (!res.ok) throw new Error(`Fetch returned status ${res.status} for ${url}`);
  return await res.json();
}

interface SitemapEntry {
  loc: string;
  lastmod: string;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function previousLastmod(url: string): string | undefined {
  if (!existsSync(SITEMAP_PATH)) return undefined;
  const xml = readFileSync(SITEMAP_PATH, 'utf8');
  const entry = [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>\s*<\/url>/g)]
    .find((match) => match[1] === url);
  return entry?.[2];
}

function staticLastmod(component: string, url: string): string {
  const sources = [
    `src/app/website/${component}.component.ts`,
    `src/app/website/${component}.component.html`,
  ];
  try {
    const changed = execFileSync('git', ['status', '--porcelain', '--', ...sources], { encoding: 'utf8' }).trim();
    if (changed) return TODAY;

    const committed = execFileSync('git', ['log', '-1', '--format=%cs', '--', ...sources], { encoding: 'utf8' }).trim();
    if (committed) return formatDate(committed, url);
  } catch {
    // Release builds without Git metadata can reuse the last verified date.
  }

  const previous = previousLastmod(url);
  if (previous) return formatDate(previous, url);
  throw new Error(`No reliable lastmod date for ${url}`);
}

function newerDate(first: string, second: string): string {
  return first > second ? first : second;
}

async function main() {
  console.log('Generating sitemap.xml with canonical slugs and page modification dates...');

  const [blogsRes, newsRes, projectsRes] = await Promise.all([
    fetchJson(`${API}/admin/getAll_blog?fields=_id,titleLink,updatedAt,createdAt`),
    fetchJson(`${API}/admin/getAll_news?fields=_id,titleLink,updatedAt,createdAt`),
    fetchJson(`${API}/admin/getAll_project?fields=_id,titleLink,updatedAt,createdAt`),
  ]);

  const hasCollection = (value: any) => Array.isArray(value?.data?.data);
  if (!hasCollection(blogsRes) || !hasCollection(newsRes) || !hasCollection(projectsRes)) {
    throw new Error('A content API returned an unexpected response; sitemap was not regenerated.');
  }

  const staticPages = [
    ['', 'website'],
    ['/know-us', 'know/know'],
    ['/services', 'services/services'],
    // Not live yet (placeholder content). Restore together with the routes in website-routing.module.ts.
    // ['/what-you-can-expect', 'know2/know2'],
    // ['/how-we-work', 'know3/know3'],
    ['/careers', 'know4/know4'],
    ['/blog', 'blog/blog'],
    ['/news-room', 'newsroom/newsroom'],
    ['/portfolio', 'portfolio/portfolio'],
    ['/contact-us', 'contact/contact'],
    ['/privacy-policy', 'privacy-policy/privacy-policy'],
    ['/terms-conditions', 'terms-conditions/terms-conditions'],
  ] as const;

  const entries: SitemapEntry[] = staticPages.map(([path, component]) => ({
    loc: `${BASE_URL}${path}`,
    lastmod: staticLastmod(component, `${BASE_URL}${path}`),
  }));

  // Blogs: canonical slugified titleLink + real updatedAt from getAll_blog
  const blogs = blogsRes?.data?.data ?? [];
  for (const b of blogs) {
    if (b.titleLink) {
      const slug = formatHeading(b.titleLink);
      if (!slug) continue;
      const loc = `${BASE_URL}/blog/${slug}`;
      entries.push({
        loc,
        lastmod: formatDate(b.updatedAt || b.createdAt, loc),
      });
    }
  }

  // News: clean slugified titleLink + real updatedAt
  const news = newsRes?.data?.data ?? [];
  for (const n of news) {
    if (n.titleLink) {
      const slug = formatHeading(n.titleLink);
      if (!slug) continue;
      const loc = `${BASE_URL}/news/${slug}`;
      entries.push({
        loc,
        lastmod: formatDate(n.updatedAt || n.createdAt, loc),
      });
    }
  }

  // Portfolio: clean slugified titleLink + real updatedAt
  const projects = projectsRes?.data?.data ?? [];
  for (const p of projects) {
    if (p.titleLink) {
      const slug = formatHeading(p.titleLink);
      if (!slug) continue;
      const loc = `${BASE_URL}/portfolio/${slug}`;
      entries.push({
        loc,
        lastmod: formatDate(p.updatedAt || p.createdAt, loc),
      });
    }
  }

  // Deduplicate by URL
  const uniqueMap = new Map<string, SitemapEntry>();
  for (const entry of entries) {
    const previous = uniqueMap.get(entry.loc);
    uniqueMap.set(entry.loc, previous
      ? { ...entry, lastmod: newerDate(previous.lastmod, entry.lastmod) }
      : entry);
  }

  for (const [listing, prefix] of [
    ['/blog', '/blog/'],
    ['/news-room', '/news/'],
    ['/portfolio', '/portfolio/'],
  ] as const) {
    const listingEntry = uniqueMap.get(`${BASE_URL}${listing}`);
    if (!listingEntry) continue;
    for (const item of uniqueMap.values()) {
      if (item.loc.startsWith(`${BASE_URL}${prefix}`)) {
        listingEntry.lastmod = newerDate(listingEntry.lastmod, item.lastmod);
      }
    }
  }
  const uniqueEntries = Array.from(uniqueMap.values());

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueEntries
  .map(
    e => `  <url>
    <loc>${escapeXml(e.loc)}</loc>
    <lastmod>${escapeXml(e.lastmod)}</lastmod>
  </url>`,
  )
  .join('\n')}
</urlset>\n`;

  writeFileSync(SITEMAP_PATH, xml, 'utf-8');
  console.log(`sitemap.xml generated with ${uniqueEntries.length} URLs at ${SITEMAP_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
