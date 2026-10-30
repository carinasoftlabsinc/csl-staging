// Local settings, used by `npm start` / `npm run start:local` (fileReplacements in angular.json).
// Talks to the backend on your own computer (port 8086). Start it on the DEV database first, never on the live one.
export const environment = {
  name: 'local' as 'production' | 'local' | 'live',
  production: false,
  apiUrl: 'http://localhost:8086/web/v1',
  imageBaseUrl: 'http://localhost:8086/web/file',
};
