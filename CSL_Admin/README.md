# CSL Admin

Admin panel for **Carina Softlabs**. The team uses it to publish and manage the content of [carinasoftlabs.com](https://carinasoftlabs.com) (blogs, news, case studies, careers) and of the TMGS website (games, ads, blogs, team, partners, policies), and to handle job applications and contact requests sent from both sites.

| | |
| --- | --- |
| Live admin | <https://admin.carinasoftlabs.com> |
| Live API | `https://admin.carinasoftlabs.com/web/web/v1` |
| Uploaded files | `https://admin.carinasoftlabs.com/web/web/file/<folder>/<file>` |
| Backend source | `../CSL_Backend` (Node/Express + MongoDB) |
| Server folder | `/var/www/html/admin` |
| Framework | Angular 22.2 (NgModules) |

## Contents

1. [What the admin manages](#what-the-admin-manages)
2. [How it works](#how-it-works)
3. [Requirements](#requirements)
4. [Local development](#local-development)
5. [Environments and commands](#environments-and-commands)
6. [Sign-in, sessions and roles](#sign-in-sessions-and-roles)
7. [API used by the admin](#api-used-by-the-admin)
8. [Build and deploy](#build-and-deploy)
9. [Project structure](#project-structure)
10. [Rules for working on this project](#rules-for-working-on-this-project)
11. [Troubleshooting](#troubleshooting)
12. [Known limitations](#known-limitations)

## What the admin manages

Addresses use hash routing, so every admin page is `https://admin.carinasoftlabs.com/#/<route>`.

### CSL Management (carinasoftlabs.com)

| Sidebar item | Route | What it does | Shows on the website |
| --- | --- | --- | --- |
| Dashboard | `/admin/dashboard` | Counts of blogs, careers, news and case studies, latest blog posts | |
| Blogs | `/admin/blogs`, `/admin/blogs/new`, `/admin/blogs/:id/edit`, `/admin/blog_details/:id` | Write, edit, reorder and delete blog posts, including SEO title, SEO description, cover images, body and FAQs | `/blog` and `/blog/<post>` |
| News Room | `/admin/news_room` | Company news posts | `/news-room` and `/news/<post>` |
| Project Details | `/admin/project_details` | Case studies: overview, tech stack, UI design system, results, work steps | `/portfolio` and `/portfolio/<project>` |
| Careers | `/admin/careers` | Job openings | `/careers` and `/job-description/<job>` |
| Job Application | `/admin/job_application` | Applications sent from the website job pages, with resumes and status | |
| Contact Details | `/admin/contact_details` | Messages sent from the website contact forms | |

### TMGS Management (TMGS website)

| Sidebar item | Route | What it does |
| --- | --- | --- |
| Dashboard | `/admin/tmgs_dashboard` | TMGS counts and analytics |
| Home | `/admin/tmgs_home` | Home page sections (hero, about, games, team, events, careers, call to action) |
| Game | `/admin/tmgs_games` | Games, platforms, galleries, tech and result images, display order |
| Advertisements | `/admin/tmgs_ads` | Ads, their platforms, status and analytics |
| Blogs Category | `/admin/tmgs_category` | Blog categories |
| Blogs | `/admin/tmgs_blogs` | TMGS blog posts and their order |
| Upload Image | `/admin/tmgs_image_upload` | Image library by folder |
| Careers | `/admin/tmgs_careers` | TMGS job openings |
| Job Application | `/admin/tmgs_job_application` | Applications for TMGS jobs |
| Contacts | `/admin/tmgs_contacts` | TMGS contact form messages |
| Team | `/admin/tmgs_team` | Team members |
| Partners | `/admin/tmgs_partners` | Partner logos |
| Privacy & Terms | `/admin/tmgs_terms-privacy` | Privacy policy and terms pages |

Other routes: `/signin` (sign-in), `/profile` (your name and profile picture), `/signin/page404` (not found).

## How it works

```text
Browser (admin)  ──HTTPS──▶  Express API  /web/v1/admin/...  ──▶  MongoDB
      │                          │
      │                          └── uploaded files in CSL_Backend/public, served at /web/file/<folder>/<file>
      └── token in local storage, added to every API request by the auth interceptor
```

- `authentication/auth-interceptor.ts` adds `Authorization: Bearer <token>` to requests for the API only, and only when signed in.
- `error-interceptor.ts` shows API error messages. A `401` from the API ends the session (see [Sign-in, sessions and roles](#sign-in-sessions-and-roles)).
- `admin/blog.service.ts` holds most API calls. New calls for existing modules belong there.
- Images inside rich text are uploaded to the server as files (`upload_content_image`); the saved HTML only references them by URL.

## Requirements

- **Node.js 24.15+ (24.x recommended)**. The installed Angular packages also support Node 22.22.3+ (22.x) or 26+. Validation used Node 24.21.0 and npm 11.19.0.
- npm (comes with Node).
- The backend (`../CSL_Backend`) running on your computer, connected to the **dev database** `CSLWEB-Dev`.
- Access to the team Git server.

## Local development

1. Install packages:

   ```bash
   npm install
   ```

2. Start the backend on port 8086 with the dev database. In `../CSL_Backend`, make sure the active `DATABASE` points at `CSLWEB-Dev`, then:

   ```bash
   npm run dev
   ```

3. Start the admin:

   ```bash
   npm start
   ```

4. Open `http://localhost:4200` and sign in with an account from the dev database.

Never develop against the live database. Anything you save locally is written to whichever database your backend uses.

## Environments and commands

| Command | Settings file | Talks to | Use it for |
| --- | --- | --- | --- |
| `npm start` / `npm run start:local` | `src/environments/environment.development.ts` | `http://localhost:8086` | Daily development |
| `npm run start:live` | `src/environments/environment.live.ts` | the live API | Looking at live data from your computer. Every save, delete or reorder changes the real websites |
| `npm run build` | `src/environments/environment.ts` | the live API | The build that is deployed |
| `npm test` | `src/environments/environment.ts` | | Unit tests (Karma) |
| `npm run lint` | | | ESLint |

- The file is chosen by the command (`fileReplacements` in `angular.json`). Do not edit the environment files by hand to switch servers.
- `npm run build` first runs `scripts/check-environment.js`. It stops the build if `environment.ts` points at localhost, if `environment.development.ts` points at the live API, if `environment.live.ts` points at localhost, or if `environment.ts` is not marked `production`.
- `ng build` on its own skips that check. Always use `npm run build`.
- The environment files contain only addresses. Never put passwords, keys or tokens in them; everything here is shipped to the browser.

## Sign-in, sessions and roles

**Sign-in.** `POST /admin/login` returns a token and the user (id, name, role). They are stored in the browser's local storage (`token`, `expiration`, `userId`, `username`, `role`).

**Session end.** The session ends:

- one day after sign-in (the earlier of the server's `expiresIn` and the token's own expiry),
- when the API answers `401` (token invalid or expired, account deactivated, password changed),
- when you log out.

In every case the saved session is removed and you return to `/signin` with one message ("Session expired, please log in again" or "Logged out"). The session is also checked when you return to the tab, because browsers pause timers while a laptop sleeps. A wrong password at sign-in or in "change password" shows its normal error and does not end the session.

**Roles.**

| Role | Can do |
| --- | --- |
| `SuperAdmin` | Everything an Admin can, plus create, list and deactivate admin accounts |
| `Admin` | Everything in the admin panel |

- There is no public sign-up. The first SuperAdmin is created once per database with `node scripts/create-super-admin.js` in `../CSL_Backend` (see the usage at the top of that file).
- Admin accounts are managed through the API (`GET /admin/users`, `POST /admin/users`, `PATCH /admin/users/:id/deactivate`, SuperAdmin only). There is no Users page in the admin yet.
- The sidebar shows the same menu to both roles. The real permission checks happen in the backend.

## API used by the admin

All paths are relative to `<apiUrl>/admin/`. Routes that change data require a valid token.

| Area | Endpoints |
| --- | --- |
| Account | `login`, `me`, `updateMe`, `updateMyPassword`, `users`, `users/:id/deactivate` |
| Dashboards | `analytics`, `getLatestBlogs`, `tmgsAnalytics` |
| Blogs | `blog_pagination`, `get_blog/:id`, `create_blog_full`, `update_blog_full/:id`, `delete_blog/:id`, `getBlogTitlesWithOrder`, `updateCslBlogOrder`, `reorder-blogs`, `upload_content_image` |
| News | `news_pagination`, `create_news`, `update_news/:id`, `delete_news/:id` |
| Project details | `project_pagination`, `create_project`, `update_project/:id`, `delete_project/:id` |
| Careers | `getCareerJobPostPagination`, `createCareerJobPost`, `updateCareerJobPost/:id`, `deleteCareerJobPost/:id` |
| Job applications | `getJobApplicationsPagination`, `updateJobApplicationStatus/:id`, `deleteJobApplication/:id` |
| Contact | `getAll_contact_details`, `delete_contact_data/:id` |
| TMGS games | `games`, `games/:id`, `paginatedgames`, `gameNames`, `gamesOrder`, `platforms` |
| TMGS home | `home` |
| TMGS ads | `createAd`, `getPaginatedAds`, `updateAd/:id`, `updateAdStatus/:id`, `deleteAd/:id`, `adsAnalytics` |
| TMGS blogs | `getAllTmgsBlogs`, `createTmgsBlog`, `updateTmgsBlog/:id`, `deleteTmgsBlog/:id`, `getBlogTitles`, `updateBlogOrder`, `reorderTmgsblogs` |
| TMGS categories | `getAllCategories`, `addCategory`, `updateCategory/:id`, `updateCategoryStatus/:id` |
| TMGS images | `uploadImage/:folder`, `uploadImageEditor/:folder`, `getImages/:folder`, `available-folders` |
| TMGS careers | `getTmgsJobPostPagination`, `createTmgsJobPost`, `updateTmgsJobPost/:id`, `deleteTmgsJobPost/:id` |
| TMGS job applications | `getTmgsJobApplicationsPagination`, `updateTmgsJobApplicationStatus/:id`, `deleteTmgsJobApplication/:id` |
| TMGS contacts | `getAllTmgsContactUsPagination`, `deleteTmgsContactUs/:id` |
| TMGS team and partners | `team`, `team/:id`, `partners`, `partners/:id` |
| TMGS policies | `getTmgsTermsPolicy`, `createOrUpdateTmgsTermPolicy` |

The backend routes are defined in `../CSL_Backend/routes/admin/`.

## Build and deploy

1. Make sure your branch is committed and up to date.
2. Build:

   ```bash
   npm run build
   ```

   The environment check must pass. Angular's `@angular/build:application` builder uses esbuild. The output remains in `dist/main` (`index.html`, hashed `.js` and `.css` files, `assets/`, `media/`, and `tinymce/`); no extra `browser/` directory is added.
3. On the server, keep the current version: rename `/var/www/html/admin` to `/var/www/html/admin-backup-<date>`, then create an empty `/var/www/html/admin`.
4. Upload the **contents** of `dist/main` into `/var/www/html/admin`.
5. Open <https://admin.carinasoftlabs.com> with a hard refresh (Ctrl+F5), sign in, and check the dashboard, one CSL page and one TMGS page.

Only the build is deployed. The admin is static files, so nothing has to be restarted.

**Rollback.** Delete the new `/var/www/html/admin` and rename the backup folder back to `/var/www/html/admin`. Remove old backups once a release has been stable for a few days.

## Project structure

```text
src/
  app/
    admin/                    admin pages
      blog/ news/ careers/ project-details/ job-applications/ contact-details/ dashboard/
      TMGS/                   TMGS pages (games, home, ads, blogs, careers, team, partners, ...)
      components/             shared admin components (image upload field with crop dialog)
      content-editor/         TinyMCE setup and content image upload
      blog.service.ts         API calls for most modules
      admin-routing.module.ts admin routes
    authentication/           sign-in page, AuthService (authServices.ts), route guard, token interceptor
    error-interceptor.ts      API error messages and 401 handling
    layout/                   header, sidebar (menu in sidebar-items.ts), settings panel, layouts
    extra-pages/profile/      profile page
    shared/                   shared modules and components (Material, breadcrumb, icons)
    core/                     Role list, theme direction and settings panel services
  environments/               environment.ts (production), environment.development.ts (local), environment.live.ts
  assets/                     images, icon fonts, template SCSS and themes
scripts/check-environment.js  runs before npm run build
```

## Rules for working on this project

- **Branches.** Work on a branch; do not commit directly to the main branch.
- **Commits.** One project per commit, named with its project: `fix(admin): ...`, `feat(admin): ...`, `chore(admin): ...`. Keep backend changes in separate `(backend)` commits.
- **Push** to the team Git server only.
- **Data.** Develop and test against the dev database only. Delete test accounts and records you create.
- **Secrets.** Never commit `.env` files, passwords or keys.
- **UI.** Use Angular Material components and Bootstrap utility classes. Tailwind is not installed.
- **Logging.** Never use `console` directly (`npm run lint` warns about it). Report errors with `LoggerService` (`src/app/core/service/logger.service.ts`): in development it prints the full details, on the live admin only one short line. Failed API requests and page crashes are already logged automatically by `error-interceptor.ts` and `core/global-error-handler.ts`. Users see errors through the snackbars.
- **Before pushing:** `npm run build` must pass, and the pages you touched must be checked in the browser.

## Troubleshooting

| Problem | Cause and fix |
| --- | --- |
| Every page shows errors after `npm start` | The backend is not running on port 8086. Start it with the dev database. |
| Sent back to sign-in with "Session expired" | The session ended or the API rejected the token. Sign in again. |
| `npm run build` stops with "Environment check failed" | An environment file points at the wrong server. Fix the file named in the message. |
| Images are broken locally | Uploaded files exist on the live server, not in your local `CSL_Backend/public`. Expected. |
| Changes not visible after a deploy | The browser cached the old `index.html`. Hard refresh with Ctrl+F5. |
| Build warns "2 rules skipped due to selector errors" | Comes from the Bootstrap CSS (`.form-floating>~label`). Harmless. |

## Known limitations

- **Build tooling:** production builds, the Vite development server, translation extraction, and Karma tests use `@angular/build`. Webpack dependencies have been removed. Restart `npm start` after installing the migrated dependencies.
- **The token is kept in local storage.** Moving it to an `httpOnly` cookie, with a shorter token lifetime on the server, is planned.
- **The TMGS blog editor's image upload** sends its own request (XMLHttpRequest) and does not go through the interceptors.
- **Tests cover component rendering and selected behavior**, not complete end-to-end workflows. They use real feature modules with a mocked HTTP backend. Run `npm test -- --watch=false --browsers=ChromeHeadless` (Chrome required).
- **Lint debt remains visible.** ESLint 9 uses `eslint.config.cjs`; NgModules and eager change detection are intentionally retained. Existing `any`, unused declarations, and newer Angular style recommendations still make `npm run lint` fail; see `MIGRATION_VALIDATION.md`.
- **Admin accounts are managed through the API only.** A Users page will come with the admin redesign.
- **The UI started from an admin template** (Material, Bootstrap and template SCSS side by side). Parts of it are being cleaned up step by step.
