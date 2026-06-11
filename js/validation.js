import { isSafeHttpUrl } from "./utils.js";

export function validateImportData(data) {
  const warnings = [];
  const validItems = [];

  if (!data || typeof data !== "object") {
    return { ok: false, items: [], warnings: ["JSON root must be an object."] };
  }
  if (!data.version) warnings.push("version is missing.");
  if (!Array.isArray(data.items)) {
    return { ok: false, items: [], warnings: [...warnings, "items must be an array."] };
  }

  data.items.forEach((rawItem, index) => {
    const label = `items[${index}]`;
    if (!rawItem || typeof rawItem !== "object") {
      warnings.push(`${label} skipped: not an object.`);
      return;
    }
    if (!rawItem.id) {
      warnings.push(`${label} skipped: id is missing.`);
      return;
    }
    if (!rawItem.title) {
      warnings.push(`${label} skipped: title is missing.`);
      return;
    }
    if (!rawItem.publicUrl && !rawItem.repoUrl) {
      warnings.push(`${label} skipped: publicUrl or repoUrl is required.`);
      return;
    }
    if (rawItem.publicUrl && !isSafeHttpUrl(rawItem.publicUrl)) {
      warnings.push(`${label} skipped: publicUrl must be http or https.`);
      return;
    }
    if (rawItem.repoUrl && !isSafeHttpUrl(rawItem.repoUrl)) {
      warnings.push(`${label} skipped: repoUrl must be http or https.`);
      return;
    }
    validItems.push({
      ...rawItem,
      id: String(rawItem.id),
      title: String(rawItem.title)
    });
  });

  return { ok: true, items: validItems, warnings };
}
