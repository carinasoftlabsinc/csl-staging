// Production settings, used by `npm run build` (the live admin). Talks to the live API.
export const environment = {
  name: 'production' as 'production' | 'local' | 'live',
  production: true,
  apiUrl: 'https://admin.carinasoftlabs.com/web/web/v1',
  imageBaseUrl: 'https://admin.carinasoftlabs.com/web/web/file',
};
