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
  // Uses verbatim API titleLink. Falls back to SSR at request time.
  {
    path: 'blog/:title',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Server,
    getPrerenderParams: async () => {
      try {
        const res = await fetch(`${API}/admin/getAll_blogTitles`);
        const json = await res.json();
        return (json.data ?? [])
          .filter((b: { titleLink: string }) => isFsSafe(b.titleLink))
          .map((b: { titleLink: string }) => ({
            title: b.titleLink,
          }));
      } catch (err) {
        console.error('Error fetching blog params for prerender:', err);
        return [];
      }
    },
  },

  // ── Dynamic Prerender: News ────────────────────────────────────
  // Uses verbatim API titleLink. Falls back to SSR at request time.
  {
    path: 'news/:id',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Server,
    getPrerenderParams: async () => {
      try {
        const res = await fetch(`${API}/admin/getAll_news`);
        const json = await res.json();
        return (json.data?.data ?? [])
          .filter((n: { titleLink: string }) => isFsSafe(n.titleLink))
          .map((n: { titleLink: string }) => ({
            id: n.titleLink,
          }));
      } catch (err) {
        console.error('Error fetching news params for prerender:', err);
        return [];
      }
    },
  },

  // ── Dynamic Prerender: Portfolio / Case Studies ────────────────
  // Uses verbatim API titleLink. Falls back to SSR at request time.
  {
    path: 'portfolio/:id',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Server,
    getPrerenderParams: async () => {
      try {
        const res = await fetch(`${API}/admin/getAll_project`);
        const json = await res.json();
        return (json.data?.data ?? [])
          .filter((p: { titleLink: string }) => isFsSafe(p.titleLink))
          .map((p: { titleLink: string }) => ({
            id: p.titleLink,
          }));
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
