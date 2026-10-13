import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import compression from 'compression';
import { join } from 'node:path';
import { createDynamicSitemap } from './dynamic-sitemap';

const browserDistFolder = join(import.meta.dirname, '../browser');
const getSitemap = createDynamicSitemap(browserDistFolder);

const app = express();

// Enable Gzip/Deflate response compression for faster SSR and asset transfer
app.use(compression());

const angularApp = new AngularNodeAppEngine({
  allowedHosts: ['localhost', '127.0.0.1', 'carinasoftlabs.com', 'www.carinasoftlabs.com'],
  trustProxyHeaders: true,
});

const PERMANENT_REDIRECTS: Record<string, string> = {
  '/web': '/services',
  '/game': '/game-development',
  '/game2': '/game-development',
  '/service2': '/services',
  '/web-app-development': '/services',
  '/about': '/know-us',
  '/about-us': '/know-us',
  '/know2': '/what-you-can-expect',
  '/know3': '/how-we-work',
  '/know4': '/careers',
  '/blog-details': '/blog',
  '/contact': '/contact-us',
  '/service-details/digital-marketing': '/digital-marketing',
  '/service-details/game-development': '/game-development',
  '/service-details/web-development': '/web-development',
  '/service-details/mobile-app-development': '/services',
};

/**
 * 301 Permanent Redirect middleware for legacy, short, or orphaned URLs
 */
app.use((req, res, next) => {
  let decodedPath = req.path;
  try {
    decodedPath = decodeURIComponent(req.path);
  } catch {
    // Keep the original path if it contains malformed percent escapes.
  }

  const cleanPath = decodedPath.replace(/\/+$/, '') || '/';
  const target = PERMANENT_REDIRECTS[cleanPath.toLowerCase()];
  if (target) {
    return res.redirect(301, target);
  }

  const contentRoute = cleanPath.match(/^\/(blog|news|portfolio)\/([^/]+)$/i);
  if (contentRoute) {
    const canonicalSlug = contentRoute[2]
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    if (canonicalSlug && canonicalSlug !== contentRoute[2]) {
      const canonicalPath = `/${contentRoute[1].toLowerCase()}/${canonicalSlug}`;
      const queryIndex = req.url.indexOf('?');
      const queryString = queryIndex >= 0 ? req.url.slice(queryIndex) : '';
      return res.redirect(301, `${canonicalPath}${queryString}`);
    }
  }

  next();
});

// Refresh API-backed URLs without rebuilding the site. This must precede static assets.
app.get('/sitemap.xml', async (_req, res, next) => {
  try {
    const xml = await getSitemap();
    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=300');
    res.send(xml);
  } catch (error) {
    next(error);
  }
});

/**
 * Serve static files from /browser after redirects so legacy prerendered URLs
 * cannot bypass canonicalization.
 */
app.use(
  express.static(browserDistFolder, {
    // Hashed JS/CSS, images and fonts keep a long cache lifetime.
    maxAge: '1y',
    index: 'index.html',
    redirect: false,
    setHeaders: (res, filePath) => {
      if (/\.html?$/i.test(filePath)) {
        // HTML pages (including the prerendered homepage) are always revalidated, so updated titles, meta tags
        // and canonical links reach visitors straight away. The ETag keeps revalidation cheap (304).
        res.setHeader('Cache-Control', 'no-cache');
      } else if (/\.(txt|xml)$/i.test(filePath)) {
        // robots.txt and similar files are edited without changing the filename, so they must not be cached for a year.
        res.setHeader('Cache-Control', 'public, max-age=300');
      }
    },
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  // Rendered pages are HTML too: always revalidate (a response that sets its own Cache-Control wins).
  res.setHeader('Cache-Control', 'no-cache');
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
