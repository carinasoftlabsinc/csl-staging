import { faqPageSchema } from './faq-schema.util';

describe('faqPageSchema', () => {
  it('returns nothing when the page shows no FAQs', () => {
    expect(faqPageSchema(undefined)).toEqual([]);
    expect(faqPageSchema([])).toEqual([]);
    expect(faqPageSchema([{ question: 'Only a question' }])).toEqual([]);
  });

  it('builds one Question per visible FAQ with plain-text answers', () => {
    const [schema] = faqPageSchema([
      { question: 'How long does it take?', answer: '<p>About&nbsp;<strong>4 weeks</strong>.</p>' },
      { question: '', answer: 'Skipped: no question' },
    ]) as Array<{ '@type': string; mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }> }>;

    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity.length).toBe(1);
    expect(schema.mainEntity[0].name).toBe('How long does it take?');
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe('About 4 weeks .');
  });
});
