import { organizationReference } from './organization-schema.util';

export interface ServiceSchemaConfig {
  name: string;
  serviceType: string;
  description: string;
  url: string;
  image?: string;
  /** Sub-services listed on the page, emitted as an OfferCatalog. */
  offers?: readonly string[];
}

/** schema.org Service for a service page, provided by the site's Organization. */
export function serviceSchema(config: ServiceSchemaConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${config.url}#service`,
    name: config.name,
    serviceType: config.serviceType,
    description: config.description,
    url: config.url,
    ...(config.image ? { image: config.image } : {}),
    provider: organizationReference,
    areaServed: 'Worldwide',
    ...(config.offers?.length
      ? {
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: config.name,
            itemListElement: config.offers.map((offer) => ({
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: offer },
            })),
          },
        }
      : {}),
  };
}
