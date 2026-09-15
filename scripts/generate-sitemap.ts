import { writeFileSync } from 'node:fs';
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
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`Fetch returned status ${res.status} for ${url}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error(`Failed to fetch ${url}:`, err);
    return null;
  }
}

interface SitemapEntry {
  loc: string;
  lastmod: string;
}

async function main() {
  console.log('Generating sitemap.xml with real API dates and verbatim slugs...');

  const [blogTitlesRes, blogsRes, newsRes, projectsRes] = await Promise.all([
    fetchJson(`${API}/admin/getAll_blogTitles`),
    fetchJson(`${API}/admin/getAll_blog`),
    fetchJson(`${API}/admin/getAll_news`),
    fetchJson(`${API}/admin/getAll_project`),
  ]);

  const staticPaths = [
    '',
    '/know-us',
    '/services',
    '/digital-marketing',
    '/web',
    '/game2',
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

  // Blogs: verbatim titleLink from getAll_blogTitles + real updatedAt from getAll_blog
  const blogDetails = new Map<string, any>(
    (blogsRes?.data?.data ?? []).map((b: any) => [b._id, b])
  );
  const blogTitles = blogTitlesRes?.data ?? [];
  for (const b of blogTitles) {
    if (b.titleLink) {
      const full = blogDetails.get(b._id);
      entries.push({
        loc: `${BASE_URL}/blog/${b.titleLink}`,
        lastmod: formatDate(full?.updatedAt || full?.createdAt),
      });
    }
  }

  // News: verbatim titleLink + real updatedAt
  const news = newsRes?.data?.data ?? [];
  for (const n of news) {
    if (n.titleLink) {
      entries.push({
        loc: `${BASE_URL}/news/${n.titleLink}`,
        lastmod: formatDate(n.updatedAt || n.createdAt),
      });
    }
  }

  // Portfolio: verbatim titleLink + real updatedAt
  const projects = projectsRes?.data?.data ?? [];
  for (const p of projects) {
    if (p.titleLink) {
      entries.push({
        loc: `${BASE_URL}/portfolio/${p.titleLink}`,
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
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  const targetPath = join(process.cwd(), 'src/sitemap.xml');
  writeFileSync(targetPath, xml, 'utf-8');
  console.log(`✅ sitemap.xml generated with ${uniqueEntries.length} URLs at ${targetPath}`);
}

main();
