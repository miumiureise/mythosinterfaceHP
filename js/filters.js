import { localized } from "./i18n.js";
import { normalizeForSearch } from "./utils.js";

export function filterItems(items, filters, language) {
  const query = normalizeForSearch(filters.query);
  return items.filter((item) => {
    if (filters.category && item.category !== filters.category) return false;
    if (filters.type && item.type !== filters.type) return false;
    if (filters.status && item.status !== filters.status) return false;
    if (!query) return true;

    const haystack = [
      item.title,
      item.category,
      item.status,
      localized(item.subtitle, language),
      localized(item.description, language),
      ...(item.tags || []),
      ...(item.technologies || [])
    ].join(" ");
    return normalizeForSearch(haystack).includes(query);
  });
}
