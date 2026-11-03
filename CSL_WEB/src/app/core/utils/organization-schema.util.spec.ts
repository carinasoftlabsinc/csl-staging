import {
  INDIA_ADDRESS,
  ORGANIZATION_ID,
  indiaOfficeSchema,
  organizationReference,
  organizationSchema,
} from './organization-schema.util';

describe('organization schema', () => {
  it('has every field the SEO audit (T11) asks for', () => {
    const org = organizationSchema;
    expect(org['@type']).toBe('Organization');
    expect(org.name).toBe('Carina Softlabs');
    expect(org.legalName).toBe('Carina Softlabs Private Limited');
    expect(org.alternateName).toContain('Carina Softlabs Inc.');
    expect(org.foundingDate).toBe('2011-09-24');
    expect(org.founders.map((f) => f.name)).toEqual(['Mayank Pande', 'Pragati Singh Suman', 'Neha Pande']);
    expect(org.address.map((a) => a.addressCountry)).toEqual(['IN', 'US']);
    expect(org.contactPoint.length).toBe(2);
    expect(org.sameAs.length).toBe(9);
  });

  it('uses the non-www domain for every URL and id', () => {
    const json = JSON.stringify([organizationSchema, indiaOfficeSchema, organizationReference]);
    expect(json).not.toContain('www.carinasoftlabs.com');
  });

  it('uses the current Indore office (South Tukoganj) everywhere', () => {
    expect(INDIA_ADDRESS.streetAddress).toContain('South Tukoganj');
    expect(indiaOfficeSchema.address).toBe(INDIA_ADDRESS);
    expect(organizationSchema.address[0]).toBe(INDIA_ADDRESS);
  });

  it('links the local office and short references to the one organization', () => {
    expect(indiaOfficeSchema.parentOrganization['@id']).toBe(ORGANIZATION_ID);
    expect(organizationReference['@id']).toBe(ORGANIZATION_ID);
    expect(organizationSchema['@id']).toBe(ORGANIZATION_ID);
  });
});
