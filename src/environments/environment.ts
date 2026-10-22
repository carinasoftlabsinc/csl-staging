// Live API. Used by `npm run build` (the build that goes to the server).
// Do not point this at localhost: the build check (scripts/check-environment.mjs) stops the build if you do.
export const environment = {
  production: true,
  apiUrl: 'https://admin.carinasoftlabs.com/web/web/v1',
  imageBaseUrl: 'https://admin.carinasoftlabs.com/web/web/file',
};
