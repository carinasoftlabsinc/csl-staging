// Live settings for local work, used by `npm run start:live` (fileReplacements in angular.json).
// The admin runs on your computer but talks to the LIVE API: every change is real.
export const environment = {
  name: 'live' as 'production' | 'local' | 'live',
  production: false,
  apiUrl: 'https://admin.carinasoftlabs.com/web/web/v1',
  imageBaseUrl: 'https://admin.carinasoftlabs.com/web/web/file',
};
