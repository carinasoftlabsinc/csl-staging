export interface FaqItem {
  question?: string;
  answer?: string;
}

/**
 * schema.org FAQPage for the FAQs shown on a page, as a list so it can be spread into a page's JSON-LD.
 * Returns an empty list when the page shows no FAQs, since FAQPage must match visible content.
 */
export function faqPageSchema(faqs: readonly FaqItem[] | null | undefined): object[] {
  const entries = (faqs || [])
    .map((faq) => ({ question: toPlainText(faq.question), answer: toPlainText(faq.answer) }))
    .filter((faq) => faq.question && faq.answer);
  if (!entries.length) return [];

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: entries.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    },
  ];
}

function toPlainText(html?: string): string {
  return (html || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}
