/**
 * Formats a title or string into a clean, URL-safe kebab-case slug.
 */
export function formatHeading(title?: string): string {
  if (!title) return '';
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');
}

/**
 * Checks if a given data item (from API) matches the route parameter slug.
 * Handles:
 * 1. Exact raw parameter (e.g. "galaxy-chess")
 * 2. URL-decoded parameter (e.g. "Galaxy%20Chess" -> "Galaxy Chess")
 * 3. Hyphenated / slugified titleLink or title
 * 4. Case-insensitive comparison
 * 5. MongoDB _id matching
 * 6. Special character variations (& vs and, punctuation)
 */
export function matchesSlug(item: any, routeParam?: string): boolean {
  if (!item || !routeParam) return false;

  const rawParam = routeParam.trim();
  let decodedParam = rawParam;
  try {
    decodedParam = decodeURIComponent(rawParam).trim();
  } catch {
    decodedParam = rawParam;
  }

  // 1. Direct MongoDB ID match
  if (item._id && (item._id === rawParam || item._id === decodedParam)) {
    return true;
  }

  const titleLink = (item.titleLink || '').trim();
  const title = (item.title || '').trim();

  // 2. Direct string equality (case-sensitive or insensitive)
  if (
    titleLink === rawParam ||
    titleLink === decodedParam ||
    titleLink.toLowerCase() === rawParam.toLowerCase() ||
    titleLink.toLowerCase() === decodedParam.toLowerCase()
  ) {
    return true;
  }

  if (
    title === rawParam ||
    title === decodedParam ||
    title.toLowerCase() === rawParam.toLowerCase() ||
    title.toLowerCase() === decodedParam.toLowerCase()
  ) {
    return true;
  }

  // 3. Simple space-to-hyphen slug match
  const slugFromParam = rawParam.toLowerCase().replace(/\s+/g, '-');
  const slugFromTitleLink = titleLink.toLowerCase().replace(/\s+/g, '-');
  const slugFromTitle = title.toLowerCase().replace(/\s+/g, '-');

  if (
    slugFromTitleLink === slugFromParam ||
    slugFromTitleLink === rawParam.toLowerCase() ||
    slugFromTitleLink === decodedParam.toLowerCase() ||
    slugFromTitle === slugFromParam ||
    slugFromTitle === rawParam.toLowerCase() ||
    slugFromTitle === decodedParam.toLowerCase()
  ) {
    return true;
  }

  // 4. Normalized alphanumeric slug match (strips non-alphanumeric except hyphens)
  const clean = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  const cleanParam = clean(decodedParam.replace(/\s+/g, '-'));
  const cleanTitleLink = clean(titleLink.replace(/\s+/g, '-'));
  const cleanTitle = clean(title.replace(/\s+/g, '-'));

  if (cleanParam && cleanTitleLink && cleanParam === cleanTitleLink) {
    return true;
  }
  if (cleanParam && cleanTitle && cleanParam === cleanTitle) {
    return true;
  }

  return false;
}
