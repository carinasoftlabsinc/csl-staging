import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const API = 'https://admin.carinasoftlabs.com/web/web/v1';
const BASE_URL = 'https://carinasoftlabs.com';
const BUILD_DATE = new Date().toISOString().split('T')[0];

function formatDate(dateStr?: string): string {
  if (!dateStr) return BUILD_DATE;
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? BUILD_DATE : d.toISOString().split('T')[0];
  } catch {
    return BUILD_DATE;
  }
}

async function fetchJson(url: string) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
    if (!res.ok) {
      console.warn(`Fetch returned status ${res.status} for ${url}`);
      return null;
    }
    return await res.json();
  } catch (err: any) {
    console.warn(`Failed to fetch ${url} (using fallback):`, err?.message || err);
    return null;
  }
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

async function main() {
  console.log('Generating sitemap.xml with real API dates and verbatim slugs...');

  const [blogsRes, newsRes, projectsRes] = await Promise.all([
    fetchJson(`${API}/admin/getAll_blog?fields=_id,titleLink,updatedAt,createdAt`),
    fetchJson(`${API}/admin/getAll_news?fields=_id,titleLink,updatedAt,createdAt`),
    fetchJson(`${API}/admin/getAll_project?fields=_id,titleLink,updatedAt,createdAt`),
  ]);

  const hasCollection = (value: any) => Array.isArray(value?.data?.data);
  if ((!hasCollection(blogsRes) || !hasCollection(newsRes) || !hasCollection(projectsRes)) && existsSync(join(process.cwd(), 'src/sitemap.xml'))) {
    console.warn('A content API is unavailable or returned an unexpected response; keeping the existing sitemap.');
    return;
  }

  const staticPaths = [
    '',
    '/know-us',
    '/services',
    // '/web-development',
    // '/game-development',
    // '/digital-marketing',
    '/what-you-can-expect',
    '/how-we-work',
    '/careers',
    '/blog',
    '/news-room',
    '/portfolio',
    '/contact-us',
    '/privacy-policy',
    '/terms-conditions',
  ];

  const entries: SitemapEntry[] = staticPaths.map(p => ({
    loc: `${BASE_URL}${p}`,
    lastmod: BUILD_DATE,
  }));

  // Blogs: clean slugified titleLink + real updatedAt from getAll_blog
  const blogs = blogsRes?.data?.data ?? [];
  for (const b of blogs) {
    if (b.titleLink) {
      const slug = b.titleLink.trim().toLowerCase().replace(/\s+/g, '-');
      entries.push({
        loc: `${BASE_URL}/blog/${slug}`,
        lastmod: formatDate(b.updatedAt || b.createdAt),
      });
    }
  }

  // News: clean slugified titleLink + real updatedAt
  const news = newsRes?.data?.data ?? [];
  for (const n of news) {
    if (n.titleLink) {
      const slug = n.titleLink.trim().toLowerCase().replace(/\s+/g, '-');
      entries.push({
        loc: `${BASE_URL}/news/${slug}`,
        lastmod: formatDate(n.updatedAt || n.createdAt),
      });
    }
  }

  // Portfolio: clean slugified titleLink + real updatedAt
  const projects = projectsRes?.data?.data ?? [];
  for (const p of projects) {
    if (p.titleLink) {
      const slug = p.titleLink.trim().toLowerCase().replace(/\s+/g, '-');
      entries.push({
        loc: `${BASE_URL}/portfolio/${slug}`,
        lastmod: formatDate(p.updatedAt || p.createdAt),
      });
    }
  }

  // Deduplicate by URL
  const uniqueMap = new Map<string, SitemapEntry>();
  for (const entry of entries) {
    uniqueMap.set(entry.loc, entry);
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
</urlset>`;

  const targetPath = join(process.cwd(), 'src/sitemap.xml');
  writeFileSync(targetPath, xml, 'utf-8');
  console.log(`✅ sitemap.xml generated with ${uniqueEntries.length} URLs at ${targetPath}`);
}

main();
