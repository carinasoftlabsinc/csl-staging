import { toSalarySchema } from './salary-schema.util';

describe('toSalarySchema', () => {
  it('reads a yearly range in lakhs', () => {
    expect(toSalarySchema('3-5 LPA')?.value).toEqual({
      '@type': 'QuantitativeValue', minValue: 300000, maxValue: 500000, unitText: 'YEAR',
    });
  });

  it('reads a single lakh amount', () => {
    expect(toSalarySchema('4.5 Lakh')?.value).toEqual({ '@type': 'QuantitativeValue', value: 450000, unitText: 'YEAR' });
  });

  it('reads a monthly rupee range with commas', () => {
    const schema = toSalarySchema('₹25,000 - 40,000 per month');
    expect(schema?.currency).toBe('INR');
    expect(schema?.value).toEqual({
      '@type': 'QuantitativeValue', minValue: 25000, maxValue: 40000, unitText: 'MONTH',
    });
  });

  it('reads thousands written with k', () => {
    expect(toSalarySchema('50k-70k /month')?.value).toEqual({
      '@type': 'QuantitativeValue', minValue: 50000, maxValue: 70000, unitText: 'MONTH',
    });
  });

  it('reads a dollar hourly rate', () => {
    const schema = toSalarySchema('$40 per hour');
    expect(schema?.currency).toBe('USD');
    expect(schema?.value).toEqual({ '@type': 'QuantitativeValue', value: 40, unitText: 'HOUR' });
  });

  it('leaves out salaries with no amount', () => {
    expect(toSalarySchema('Negotiable')).toBeUndefined();
    expect(toSalarySchema('')).toBeUndefined();
    expect(toSalarySchema(undefined)).toBeUndefined();
  });
});
