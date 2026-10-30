# Angular 22 Migration Validation

Validated on 23 October 2026 with Node 24.21.0 and npm 11.19.0.

## Migration scope

- Angular 22.2.3; CLI, Material and CDK 22.2.4; TypeScript 6.0.3.
- Retained NgModules and explicitly eager component change detection to preserve behavior.
- Retained XHR and class-based HTTP interceptors, including upload support.
- Replaced deprecated TypeScript options with explicit source path aliases.
- Migrated build, serve, translation extraction, and Karma targets to `@angular/build`. Builds use esbuild and the development server uses Vite. Removed `@angular-devkit/build-angular`, `webpack`, and `webpack-dev-server`.
- Kept the deployment layout at `dist/main/index.html` with `outputPath.browser` set to an empty string. Local/live environment replacements, styles, scripts, and static assets remain configured.
- Retained generated safe-navigation compatibility wrappers. The two suppressed extended diagnostics concern redundant optional chaining/nullish coalescing; strict TypeScript and template checks remain enabled.
- Replaced the legacy ESLint configuration with ESLint 9 flat configuration. Standalone and OnPush preferences are disabled because those architectural changes are outside this migration.
- Migrated the template and theme styles to Sass modules and namespaced built-ins. Removed a duplicate Material theme import; the theme remains loaded by `angular.json`.

## Code checks

| Check | Result |
| --- | --- |
| `npm run build` | Passed, including the environment validation hook. |
| `npm test -- --watch=false --browsers=ChromeHeadless` | 49 tests passed using `@angular/build:karma`. |
| `npm ls --depth=0` | Passed; installed direct dependencies resolve. |
| `git diff --check` | Passed for migration changes. |
| `npm run lint` | Runs successfully as a tool, but exits with 1,241 errors and 64 warnings. |
| Development server | Vite serves the app, its client module, and TinyMCE scripts successfully over HTTP. No interactive UI testing performed for this build-system migration. |
| Deployment artifacts | Index and stylesheet references resolve to generated files; TinyMCE assets are copied; package metadata matches the lockfile. |
| Sass migration | Both stylesheet entry points compile with zero Sass warnings. Before/after CSS syntax-tree comparisons preserve every rule, declaration, and their order, excluding comments and the removed duplicate theme import. |

Component tests now import their actual feature modules and supply mocked HTTP and dialog dependencies. They do not contact the live API. Stale starter assertions were replaced with authentication initialization and router-outlet checks. A news-table regression test verifies that a response arriving after the initial render updates the view.

## Existing lint debt

The Angular 21 source at commit `698f0f2` was linted with the same new configuration. Its 190 existing linted files produce exactly the same totals and rule counts as the migrated source:

| Rule | Findings |
| --- | ---: |
| `no-explicit-any` | 507 |
| `template/prefer-control-flow` | 333 |
| `prefer-inject` | 239 |
| `no-unused-vars` | 157 |
| `use-lifecycle-interface` (warning) | 64 |
| `prefer-const` | 3 |
| `no-empty` | 1 |
| `no-unused-expressions` | 1 |

These findings remain visible; the migration does not claim a clean lint run. Addressing them is a separate source cleanup.

## Remaining validation and maintenance

- The contributor will complete UI acceptance testing before deployment.
- The application and Karma builder migration is complete. The deployment process still uploads the contents of `dist/main`.
- Sass import/global-function deprecations have been resolved. Existing CSS keyframe-selector messages from critical-CSS processing are separate from Sass compatibility.
- Automated component checks do not replace end-to-end validation of all content-management workflows.
