// The company's schema.org Organization, used by the home page and referenced from other pages by @id.
// Company details confirmed by management (Nov 2026): the registered entity is the Indian private
// limited company; "Carina Softlabs Inc." is the name used for the Miami office.

export const SITE_ORIGIN = 'https://carinasoftlabs.com';
export const ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`;
export const ORGANIZATION_NAME = 'Carina Softlabs';
export const ORGANIZATION_LOGO = `${SITE_ORIGIN}/assets/CSL-logo-footer.svg`;

export const INDIA_ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: '10/2, 2nd Floor, Shree Mahadeo House, near Hotel Surya, Sriram Nagar, South Tukoganj',
  addressLocality: 'Indore',
  addressRegion: 'Madhya Pradesh',
  postalCode: '452001',
  addressCountry: 'IN',
};

const USA_ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: '66 W Flagler St, Suite 900-2034',
  addressLocality: 'Miami',
  addressRegion: 'FL',
  postalCode: '33130',
  addressCountry: 'US',
};

/** Short reference for schemas on other pages, such as a JobPosting's hiringOrganization. */
export const organizationReference = {
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: ORGANIZATION_NAME,
  url: `${SITE_ORIGIN}/`,
  logo: ORGANIZATION_LOGO,
};

export const organizationSchema = {
  '@context': 'https://schema.org',
  ...organizationReference,
  legalName: 'Carina Softlabs Private Limited',
  alternateName: ['Carina Softlabs Pvt. Ltd.', 'Carina Softlabs Inc.'],
  identifier: {
    '@type': 'PropertyValue',
    propertyID: 'CIN',
    value: 'U72900MP2019PTC049627',
  },
  foundingDate: '2011-09-24',
  founders: [
    { '@type': 'Person', name: 'Mayank Pande', jobTitle: 'Co-founder & CEO' },
    { '@type': 'Person', name: 'Pragati Singh Suman', jobTitle: 'Co-founder & Director' },
    { '@type': 'Person', name: 'Neha Pande', jobTitle: 'Co-founder' },
  ],
  address: [INDIA_ADDRESS, USA_ADDRESS],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: '+91-91319-58215',
      email: 'business@carinasoftlabs.com',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
    },
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: '+1-786-649-0411',
      email: 'business@carinasoftlabs.com',
      areaServed: 'US',
      availableLanguage: 'English',
    },
  ],
  sameAs: [
    'https://www.linkedin.com/company/carinasoftlabsinc',
    'https://clutch.co/profile/carina-softlabs',
    'https://www.upwork.com/agencies/carinasoftlabs/',
    'https://www.crunchbase.com/organization/carina-softlabs-inc',
    'https://www.youtube.com/@CarinaSoftlabs',
    'https://www.artstation.com/carinasoftlabsinc',
    'https://www.instagram.com/carinasoftlabs/',
    'https://www.facebook.com/CarinaSoftLabsInc/',
    'https://twitter.com/carinasoftlabs',
  ],
};

/** The Indore office as a LocalBusiness (values from the SEO audit doc, Home §3.III Local Schema). */
export const indiaOfficeSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_ORIGIN}/#india-office`,
  name: ORGANIZATION_NAME,
  url: `${SITE_ORIGIN}/`,
  image: `${SITE_ORIGIN}/assets/CSL-logo.svg`,
  logo: `${SITE_ORIGIN}/assets/CSL-logo.svg`,
  telephone: '+91 9131958215',
  priceRange: '$$',
  address: INDIA_ADDRESS,
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 22.7177305,
    longitude: 75.8763343,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:30',
      closes: '18:30',
    },
  ],
  parentOrganization: { '@id': ORGANIZATION_ID },
};
