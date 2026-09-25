import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import compression from 'compression';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();

// Enable Gzip/Deflate response compression for faster SSR and asset transfer
app.use(compression());

const angularApp = new AngularNodeAppEngine({
  allowedHosts: ['localhost', '127.0.0.1', 'carinasoftlabs.com', 'www.carinasoftlabs.com'],
  trustProxyHeaders: true,
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
    redirect: false,
  }),
);

const PERMANENT_REDIRECTS: Record<string, string> = {
  '/web': '/web-development',
  '/game': '/game-development',
  '/game2': '/game-development',
  '/service2': '/game-development',
  '/web-app-development': '/web-development',
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
  const cleanPath = req.path.replace(/\/+$/, '') || '/';
  const target = PERMANENT_REDIRECTS[cleanPath.toLowerCase()];
  if (target) {
    return res.redirect(301, target);
  }
  next();
});

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
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
