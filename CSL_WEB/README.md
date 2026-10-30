# Main

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.1.5.

## Environments

Pick the backend with the command. Never comment or uncomment addresses in `src/environments`.

| Command | API | File |
| --- | --- | --- |
| `npm start` | Local backend (`localhost:8086`) | `environment.development.ts` |
| `npm run start:live` | Live API, asks `LIVE data. Continue? (y/N)` first | `environment.live.ts` |
| `npm run build` | Live API (the build for the server) | `environment.ts` |

Before every build, `scripts/check-environment.mjs` stops the build if `environment.ts` points at localhost or
`environment.development.ts` points at the live API.

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
