import { RenderMode, PrerenderFallback, ServerRoute } from '@angular/ssr';

const API = 'https://admin.carinasoftlabs.com/web/web/v1';

// Slugs with characters invalid for OS directory names (e.g. ':' on Windows) fall back to SSR at request time
const isFsSafe = (slug?: string) => !!slug && !/[<>:"/\\|?*]/.test(slug);

export const serverRoutes: ServerRoute[] = [
  // ── Client-only Routes ─────────────────────────────────────────
  { path: 'game',      renderMode: RenderMode.Client },
  { path: 'thank-you', renderMode: RenderMode.Client },

  // ── Static Public Routes (Prerendered at build time) ────────────
  { path: '',                    renderMode: RenderMode.Prerender },
  { path: 'know-us',             renderMode: RenderMode.Prerender },
  { path: 'services',            renderMode: RenderMode.Prerender },
  { path: 'game2',               renderMode: RenderMode.Prerender },
  { path: 'digital-marketing',   renderMode: RenderMode.Prerender },
  { path: 'web',                 renderMode: RenderMode.Prerender },
  { path: 'blog',                renderMode: RenderMode.Prerender },
  { path: 'news-room',           renderMode: RenderMode.Prerender },
  { path: 'what-you-can-expect', renderMode: RenderMode.Prerender },
  { path: 'how-we-work',         renderMode: RenderMode.Prerender },
  { path: 'careers',             renderMode: RenderMode.Prerender },
  { path: 'portfolio',           renderMode: RenderMode.Prerender },
  { path: 'contact-us',          renderMode: RenderMode.Prerender },
  { path: 'privacy-policy',      renderMode: RenderMode.Prerender },
  { path: 'terms-conditions',    renderMode: RenderMode.Prerender },

  // ── Dynamic Prerender: Blog ────────────────────────────────────
  // Prerenders clean slugified routes and raw titleLink with Server fallback.
  {
    path: 'blog/:title',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Server,
    getPrerenderParams: async () => {
      try {
        const res = await fetch(`${API}/admin/getAll_blogTitles`);
        const json = await res.json();
        const params: { title: string }[] = [];
        const seen = new Set<string>();

        for (const b of json.data ?? []) {
          if (!b.titleLink) continue;
          const slug = b.titleLink.trim().toLowerCase().replace(/\s+/g, '-');
          if (isFsSafe(slug) && !seen.has(slug)) {
            seen.add(slug);
            params.push({ title: slug });
          }
          if (b.titleLink !== slug && isFsSafe(b.titleLink) && !seen.has(b.titleLink)) {
            seen.add(b.titleLink);
            params.push({ title: b.titleLink });
          }
        }
        return params;
      } catch (err) {
        console.error('Error fetching blog params for prerender:', err);
        return [];
      }
    },
  },

  // ── Dynamic Prerender: News ────────────────────────────────────
  // Prerenders clean slugified routes and raw titleLink with Server fallback.
  {
    path: 'news/:id',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Server,
    getPrerenderParams: async () => {
      try {
        const res = await fetch(`${API}/admin/getAll_news`);
        const json = await res.json();
        const params: { id: string }[] = [];
        const seen = new Set<string>();

        for (const n of json.data?.data ?? []) {
          if (!n.titleLink) continue;
          const slug = n.titleLink.trim().toLowerCase().replace(/\s+/g, '-');
          if (isFsSafe(slug) && !seen.has(slug)) {
            seen.add(slug);
            params.push({ id: slug });
          }
          if (n.titleLink !== slug && isFsSafe(n.titleLink) && !seen.has(n.titleLink)) {
            seen.add(n.titleLink);
            params.push({ id: n.titleLink });
          }
        }
        return params;
      } catch (err) {
        console.error('Error fetching news params for prerender:', err);
        return [];
      }
    },
  },

  // ── Dynamic Prerender: Portfolio / Case Studies ────────────────
  // Prerenders clean slugified routes and raw titleLink with Server fallback.
  {
    path: 'portfolio/:id',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Server,
    getPrerenderParams: async () => {
      try {
        const res = await fetch(`${API}/admin/getAll_project`);
        const json = await res.json();
        const params: { id: string }[] = [];
        const seen = new Set<string>();

        for (const p of json.data?.data ?? []) {
          if (!p.titleLink) continue;
          const slug = p.titleLink.trim().toLowerCase().replace(/\s+/g, '-');
          if (isFsSafe(slug) && !seen.has(slug)) {
            seen.add(slug);
            params.push({ id: slug });
          }
          if (p.titleLink !== slug && isFsSafe(p.titleLink) && !seen.has(p.titleLink)) {
            seen.add(p.titleLink);
            params.push({ id: p.titleLink });
          }
        }
        return params;
      } catch (err) {
        console.error('Error fetching portfolio params for prerender:', err);
        return [];
      }
    },
  },

  // ── Job Descriptions: SSR on Demand ────────────────────────────
  // Raw MongoDB _id, dynamic availability
  {
    path: 'job-description/:id',
    renderMode: RenderMode.Server,
  },

  // ── Catch-All: SSR with Genuine HTTP 404 Status ────────────────
  {
    path: '**',
    renderMode: RenderMode.Server,
    status: 404,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  },
];
