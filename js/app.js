import { applyStaticTranslations, getLanguage, initLanguageSwitcher, localized, t } from "./i18n.js";
import { filterItems } from "./filters.js";
import { loadPublicItems, loadUpdates, publicApps, publicBooks, publicPortfolioItems } from "./public-items.js";
import { createElement, qs, setSafeLink, unique } from "./utils.js";

function metaLine(label, value) {
  const node = createElement("span", { className: "meta-chip" });
  node.append(createElement("strong", { text: `${label}: ` }));
  node.append(document.createTextNode(value));
  return node;
}

function renderItemCard(item, language) {
  const article = createElement("article", { className: "catalog-item" });
  const header = createElement("div", { className: "catalog-heading" });
  header.append(createElement("span", { className: "catalog-icon", text: item.icon || "✧", attrs: { "aria-hidden": "true" } }));
  const titleWrap = createElement("div");
  titleWrap.append(createElement("h3", { text: item.title }));
  titleWrap.append(createElement("p", { className: "subtitle", text: localized(item.subtitle, language) }));
  header.append(titleWrap);

  const screenshot = createElement("div", { className: "screenshot-slot" });
  if (item.screenshot) {
    const image = createElement("img", { attrs: { src: item.screenshot, alt: `${item.title} ${t("screenshot", language)}` } });
    screenshot.append(image);
  } else {
    screenshot.append(createElement("span", { text: "Instrumenta" }));
  }

  const description = createElement("p", { className: "description", text: localized(item.description, language) });
  const meta = createElement("div", { className: "meta-list" });
  meta.append(metaLine(t("category", language), categoryLabel(item.category, language)));
  meta.append(metaLine(t("status", language), t(item.status, language)));
  if (item.technologies?.length) meta.append(metaLine(t("technologies", language), item.technologies.join(", ")));

  const tags = createElement("div", { className: "tag-row" });
  (item.tags || []).forEach((tag) => tags.append(createElement("span", { className: "tag", text: tag })));

  const actions = createElement("div", { className: "action-row" });
  const open = createElement("a", { className: "button-link", text: t("open", language) });
  setSafeLink(open, item.publicUrl);
  const details = createElement("button", { className: "button-link button-secondary", text: t("details", language), attrs: { type: "button" } });
  details.addEventListener("click", () => article.classList.toggle("is-expanded"));
  actions.append(open, details);

  article.append(header, screenshot, description, meta, tags, actions);
  return article;
}

function categoryLabel(category, language) {
  const labels = {
    time: { ja: "時間", de: "Zeit" },
    calendar: { ja: "暦", de: "Kalender" },
    direction: { ja: "方位", de: "Richtung" },
    number: { ja: "数", de: "Zahl" },
    sky: { ja: "天文", de: "Himmel" },
    workshop: { ja: "工房", de: "Werkstatt" },
    book: { ja: "本", de: "Buch" },
    note: { ja: "覚え書き", de: "Notiz" }
  };
  return labels[category]?.[language] || labels[category]?.ja || category || "";
}

function renderList(container, items, language) {
  container.replaceChildren();
  if (!items.length) {
    container.append(createElement("p", { className: "empty-note", text: t("noItems", language) }));
    return;
  }
  items.forEach((item) => container.append(renderItemCard(item, language)));
}

function renderUpdates(container, updates, language, limit = Infinity) {
  container.replaceChildren();
  updates.slice(0, limit).forEach((update) => {
    const row = createElement("li", { className: "update-row" });
    row.append(createElement("time", { text: update.date, attrs: { datetime: update.date } }));
    row.append(createElement("span", { text: localized(update.text, language) }));
    container.append(row);
  });
}

function fillSelect(select, values, labeler, language) {
  const current = select.value;
  select.replaceChildren(createElement("option", { text: t("all", language), attrs: { value: "" } }));
  values.forEach((value) => select.append(createElement("option", { text: labeler(value, language), attrs: { value } })));
  select.value = current;
}

function setupFilters(items, render) {
  const form = qs("[data-filter-form]");
  if (!form) return;
  const query = qs("[name='query']", form);
  const category = qs("[name='category']", form);
  const type = qs("[name='type']", form);
  const status = qs("[name='status']", form);
  const clear = qs("[data-clear-filters]", form);

  const refreshOptions = () => {
    const language = getLanguage();
    fillSelect(category, unique(items.map((item) => item.category)), categoryLabel, language);
    fillSelect(type, unique(items.map((item) => item.type)), (value) => value, language);
    fillSelect(status, unique(items.map((item) => item.status)), (value, lang) => t(value, lang), language);
  };
  const apply = () => render(filterItems(items, {
    query: query.value,
    category: category.value,
    type: type.value,
    status: status.value
  }, getLanguage()));

  form.addEventListener("input", apply);
  form.addEventListener("change", apply);
  clear.addEventListener("click", () => {
    form.reset();
    apply();
  });
  window.addEventListener("mythos:language", () => {
    refreshOptions();
    apply();
  });
  refreshOptions();
  const params = new URLSearchParams(window.location.search);
  if (params.get("category")) category.value = params.get("category");
  if (params.get("type")) type.value = params.get("type");
  if (params.get("status")) status.value = params.get("status");
  apply();
}

async function initHome() {
  const data = await loadPublicItems();
  const updates = await loadUpdates();
  const render = () => {
    const language = getLanguage();
    renderList(qs("[data-recent-items]"), publicApps(data.items).slice(0, 3), language);
    renderList(qs("[data-recommended-items]"), publicPortfolioItems(data.items).filter((item) => ["moon-astrolabe", "sectio-aurea"].includes(item.id)), language);
    renderUpdates(qs("[data-updates-list]"), updates.updates, language, 4);
  };
  window.addEventListener("mythos:language", render);
  render();
}

async function initApps() {
  const data = await loadPublicItems();
  const items = publicPortfolioItems(data.items);
  const container = qs("[data-items-list]");
  const render = (visible = items) => renderList(container, visible, getLanguage());
  setupFilters(items, render);
  window.addEventListener("mythos:language", () => render(filterItems(items, {
    query: qs("[name='query']")?.value || "",
    category: qs("[name='category']")?.value || "",
    type: qs("[name='type']")?.value || "",
    status: qs("[name='status']")?.value || ""
  }, getLanguage())));
}

async function initBooks() {
  const data = await loadPublicItems();
  const render = () => renderList(qs("[data-books-list]"), publicBooks(data.items), getLanguage());
  window.addEventListener("mythos:language", render);
  render();
}

async function initUpdatesPage() {
  const updates = await loadUpdates();
  const render = () => renderUpdates(qs("[data-updates-list]"), updates.updates, getLanguage());
  window.addEventListener("mythos:language", render);
  render();
}

function initAbout() {
  applyStaticTranslations();
}

async function main() {
  initLanguageSwitcher();
  applyStaticTranslations();
  const page = document.body.dataset.page;
  try {
    if (page === "home") await initHome();
    if (page === "apps") await initApps();
    if (page === "books") await initBooks();
    if (page === "updates") await initUpdatesPage();
    if (page === "about") initAbout();
  } catch (error) {
    const mainNode = qs("main");
    mainNode?.append(createElement("p", { className: "empty-note", text: "Data could not be loaded. Please check the JSON files." }));
    console.error(error);
  }
}

main();
