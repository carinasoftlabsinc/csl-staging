# Repository Guidelines

## Project Structure & Module Organization

This repository contains three independent npm projects; run commands inside the relevant directory.

- `CSL_WEB/`: public Angular website with SSR. Pages live in `src/app/website/`; static assets in `src/assets/`; sitemap and image utilities in `scripts/`.
- `CSL_Admin/`: Angular content-management panel. Feature screens live in `src/app/admin/`, with authentication, layout, and shared components alongside it.
- `CSL_Backend/`: Express/Mongoose API. Entry points are `server.js` and `app.js`; implementation lives in `routes/`, `controller/`, `model/`, and `utills/` (preserve this spelling). Tests live in `test/`.
- `scripts/`: staging publishing helpers; read `scripts/README.md` before using them.

## Build, Test, and Development Commands

Run `npm ci` in each project to install its locked dependencies.

For either Angular app:

- `npm start`: run the local development server on port 4200. Use `npm start -- --port 4201` for a second frontend.
- `npm run build`: validate environment settings and build deployment artifacts. The web build also generates the sitemap; avoid bypassing these hooks with direct `ng build`.
- `npm test -- --watch=false --browsers=ChromeHeadless`: run Jasmine/Karma tests once.
- `npm run lint`: run Angular ESLint.

In `CSL_WEB`, `npm run serve:ssr:main` serves the built SSR application. In `CSL_Backend`, `npm run dev` starts nodemon (default port 8086), and `npm test` runs Node's built-in test runner.

## Coding Style & Naming Conventions

Follow the frontend `.editorconfig` files: two-space indentation, UTF-8, final newlines, and single-quoted TypeScript strings. Preserve strict TypeScript checks. Use kebab-case Angular filenames such as `blog-editor.component.ts`, PascalCase classes, and camelCase members. Backend modules use CommonJS; follow adjacent code. Guard browser-only APIs in SSR code.

## Testing Guidelines

Place Angular `*.spec.ts` files beside their implementation and backend `*.test.js` files under `test/`. Add regression tests for changed behavior, especially HTML sanitization and image handling. No numeric coverage threshold is configured. Run affected tests, frontend lint, and builds before submitting.

## Commit & Pull Request Guidelines

Follow the scoped conventions in history: `fix(web): ...` and `chore(admin): ...`. Keep commits focused. PRs should describe behavior changes, link relevant issues, report validation, and include screenshots for UI changes.

## Security & Configuration

Use local APIs and a development database. Select frontend environments through npm scripts, not manual URL toggles. `start:live` accesses production data. Keep credentials out of frontend files and commits; configure backend secrets through `.env`.

For development and testing, never connect to a production backend or database. Before starting servers, running tests, builds, or scripts, verify their effective API endpoints, database hosts, and external side effects without printing credentials. Use loopback-only services and a local test database; a remotely hosted database with a development name is not local. If a destination cannot be verified, do not run the operation. Check build hooks and background integrations as well as the main command.

## Engineering Judgment

- Treat the user as the final decision-maker. Challenge incorrect assumptions respectfully, and explain disagreements with evidence.
- Reassess recommendations when questioned; change them when evidence warrants it, not simply to agree. State assumptions and uncertainty.
- Before significant architecture changes, inspect the existing code and compare practical options against project constraints. Explain the recommendation and trade-offs before implementation, unless the user directs otherwise.
- Consider server load, concurrent traffic, cost, storage, security, existing data, failure handling, deployment, and rollback where relevant.
- Verify changes with tests suited to the risk. Report what was actually tested, what remains unverified, and any limitations; do not claim completion without required validation.
