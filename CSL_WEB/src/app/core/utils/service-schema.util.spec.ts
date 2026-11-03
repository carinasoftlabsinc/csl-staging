import { ORGANIZATION_ID } from './organization-schema.util';
import { serviceSchema } from './service-schema.util';

describe('serviceSchema', () => {
  const base = {
    name: 'Web Development Services',
    serviceType: 'Web development',
    description: 'Custom web apps.',
    url: 'https://carinasoftlabs.com/web-development',
  };

  it('builds a Service provided by the organization', () => {
    const schema = serviceSchema(base);
    expect(schema['@type']).toBe('Service');
    expect(schema['@id']).toBe('https://carinasoftlabs.com/web-development#service');
    expect(schema.provider['@id']).toBe(ORGANIZATION_ID);
    expect('hasOfferCatalog' in schema).toBeFalse();
    expect('image' in schema).toBeFalse();
  });

  it('lists the sub-services as an OfferCatalog', () => {
    const schema = serviceSchema({ ...base, offers: ['Websites', 'eCommerce'] });
    const names = schema.hasOfferCatalog?.itemListElement.map((offer) => offer.itemOffered.name);
    expect(names).toEqual(['Websites', 'eCommerce']);
  });

  it('serializes to valid JSON', () => {
    expect(() => JSON.parse(JSON.stringify(serviceSchema(base)))).not.toThrow();
  });
});
