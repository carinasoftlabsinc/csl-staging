import { RenderMode, PrerenderFallback, ServerRoute } from '@angular/ssr';
import { formatHeading } from './core/utils/slug.util';

const API = 'https://admin.carinasoftlabs.com/web/web/v1';

// Slugs with characters invalid for OS directory names (e.g. ':' on Windows) fall back to SSR at request time
const isFsSafe = (slug?: string) => !!slug && !/[<>:"/\\|?*]/.test(slug);

export const serverRoutes: ServerRoute[] = [
  // ── Client-only Routes ─────────────────────────────────────────
  { path: 'thank-you', renderMode: RenderMode.Client },

  // ── Static Public Routes (Prerendered at build time) ────────────
  { path: '',                    renderMode: RenderMode.Prerender },
  { path: 'know-us',             renderMode: RenderMode.Prerender },
  { path: 'services',            renderMode: RenderMode.Prerender },
  { path: 'blog',                renderMode: RenderMode.Prerender },
  { path: 'news-room',           renderMode: RenderMode.Prerender },
  // Not live yet (placeholder content). Restore together with the routes in website-routing.module.ts.
  // { path: 'what-you-can-expect', renderMode: RenderMode.Prerender },
  // { path: 'how-we-work',         renderMode: RenderMode.Prerender },
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
        const res = await fetch(`${API}/admin/getAll_blogTitles`, { signal: AbortSignal.timeout(12000) });
        if (!res.ok) return [];
        const json = await res.json();
        const params: { title: string }[] = [];
        const seen = new Set<string>();

        for (const b of json.data ?? []) {
          if (!b.titleLink) continue;
          const slug = formatHeading(b.titleLink);
          if (isFsSafe(slug) && !seen.has(slug)) {
            seen.add(slug);
            params.push({ title: slug });
          }
        }
        return params;
      } catch (err) {
        console.warn('Prerender blog routes skipped (API unreachable or timed out):', err);
        return [];
      }
    },
  },

  // ── Dynamic Prerender: News ────────────────────────────────────
  // Prerenders clean slugified routes with Server fallback.
  {
    path: 'news/:id',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Server,
    getPrerenderParams: async () => {
      try {
        const res = await fetch(`${API}/admin/getAll_news?fields=_id,titleLink`, { signal: AbortSignal.timeout(12000) });
        if (!res.ok) return [];
        const json = await res.json();
        const params: { id: string }[] = [];
        const seen = new Set<string>();

        for (const n of json.data?.data ?? []) {
          if (!n.titleLink) continue;
          const slug = formatHeading(n.titleLink);
          if (isFsSafe(slug) && !seen.has(slug)) {
            seen.add(slug);
            params.push({ id: slug });
          }
        }
        return params;
      } catch (err) {
        console.warn('Prerender news routes skipped (API unreachable or timed out):', err);
        return [];
      }
    },
  },

  // ── Dynamic Prerender: Portfolio / Case Studies ────────────────
  // Prerenders clean slugified routes with Server fallback.
  {
    path: 'portfolio/:id',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Server,
    getPrerenderParams: async () => {
      try {
        const res = await fetch(`${API}/admin/getAll_project?fields=_id,titleLink`, { signal: AbortSignal.timeout(12000) });
        if (!res.ok) return [];
        const json = await res.json();
        const params: { id: string }[] = [];
        const seen = new Set<string>();

        for (const p of json.data?.data ?? []) {
          if (!p.titleLink) continue;
          const slug = formatHeading(p.titleLink);
          if (isFsSafe(slug) && !seen.has(slug)) {
            seen.add(slug);
            params.push({ id: slug });
          }
        }
        return params;
      } catch (err) {
        console.warn('Prerender portfolio routes skipped (API unreachable or timed out):', err);
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

  // ── Catch-All: SSR on Demand ──────────────────────────────────
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
