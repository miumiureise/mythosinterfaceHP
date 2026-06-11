export async function loadPublicItems() {
  const response = await fetch("data/public-items.json", { cache: "no-cache" });
  if (!response.ok) throw new Error("public-items.json could not be loaded");
  const data = await response.json();
  return {
    version: data.version || 1,
    items: Array.isArray(data.items) ? data.items : []
  };
}

export async function loadUpdates() {
  const response = await fetch("data/updates.json", { cache: "no-cache" });
  if (!response.ok) throw new Error("updates.json could not be loaded");
  const data = await response.json();
  return {
    version: data.version || 1,
    updates: Array.isArray(data.updates) ? data.updates : []
  };
}

export function publicPortfolioItems(items) {
  return items.filter((item) => item.showInPortfolio === true && item.status !== "draft");
}

export function publicApps(items) {
  return publicPortfolioItems(items).filter((item) => item.type === "app");
}

export function publicBooks(items) {
  return publicPortfolioItems(items).filter((item) => item.type === "book" || item.type === "note");
}
