// Turns the free-text salary typed in the admin (e.g. "3-5 LPA", "₹25,000 - 40,000 per month")
// into a schema.org MonetaryAmount that Google's JobPosting rich results accept.

export interface SalarySchema {
  '@type': 'MonetaryAmount';
  currency: 'INR' | 'USD';
  value: {
    '@type': 'QuantitativeValue';
    value?: number;
    minValue?: number;
    maxValue?: number;
    unitText: 'HOUR' | 'MONTH' | 'YEAR';
  };
}

/** Returns undefined when no amount can be read (e.g. "Negotiable"), so baseSalary is left out. */
export function toSalarySchema(salary: string | null | undefined): SalarySchema | undefined {
  const text = (salary || '').toLowerCase().replace(/,/g, '');
  const multiplier = /\b(lpa|lakhs?|lacs?|l)\b|\d\s*l\b/.test(text) ? 100000 : /\d\s*k\b|\bk\b/.test(text) ? 1000 : 1;
  const amounts = (text.match(/\d+(\.\d+)?/g) || [])
    .map((n) => Math.round(parseFloat(n) * multiplier))
    .filter((n) => n > 0)
    .slice(0, 2);
  if (!amounts.length) return undefined;

  const unitText = /hour|\/hr|per hr/.test(text)
    ? 'HOUR'
    : /month|\/m\b|\bpm\b|p\.m/.test(text)
      ? 'MONTH'
      : 'YEAR';
  const currency = /\$|usd/.test(text) ? 'USD' : 'INR';
  const [min, max] = [Math.min(...amounts), Math.max(...amounts)];

  return {
    '@type': 'MonetaryAmount',
    currency,
    value:
      min === max
        ? { '@type': 'QuantitativeValue', value: min, unitText }
        : { '@type': 'QuantitativeValue', minValue: min, maxValue: max, unitText },
  };
}
