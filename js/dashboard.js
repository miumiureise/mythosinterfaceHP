import { getLanguage, initLanguageSwitcher, localized, t } from "./i18n.js";
import { exportDashboard, importDashboard } from "./import-export.js";
import { loadPublicItems } from "./public-items.js";
import { backupDashboardState, loadDashboardBackup, loadDashboardState, saveDashboardState } from "./storage.js";
import { createElement, qs, setSafeLink } from "./utils.js";

let state = { version: 1, items: [] };
let initialItems = [];

function makeDashboardItem(item, index) {
  return {
    ...item,
    repoUrl: item.repoUrl || `https://github.com/username/${item.id}`,
    favorite: Boolean(item.favorite),
    order: item.order ?? index,
    privateNote: item.privateNote || "",
    nextAction: item.nextAction || "",
    localStatus: item.localStatus || item.status || "prototype",
    maintenanceNote: item.maintenanceNote || ""
  };
}

function mergeInitialWithSaved(initial, saved) {
  const savedById = new Map((saved?.items || []).map((item) => [item.id, item]));
  const merged = initial.map((item, index) => makeDashboardItem({ ...item, ...(savedById.get(item.id) || {}) }, index));
  (saved?.items || []).forEach((item) => {
    if (!merged.some((existing) => existing.id === item.id)) merged.push(makeDashboardItem(item, merged.length));
  });
  return { version: 1, items: merged.sort((a, b) => (a.order || 0) - (b.order || 0)) };
}

function persist(message = "") {
  state.savedAt = new Date().toISOString();
  state.items.forEach((item, index) => {
    item.order = index;
  });
  saveDashboardState(state);
  if (message) {
    const status = qs("[data-dashboard-status]");
    status.textContent = message;
  }
}

function swapItems(index, direction) {
  const target = index + direction;
  if (target < 0 || target >= state.items.length) return;
  const copy = [...state.items];
  [copy[index], copy[target]] = [copy[target], copy[index]];
  state.items = copy;
  persist(t("saved"));
  renderDashboard();
}

function field(label, control) {
  const wrap = createElement("label", { className: "dash-field" });
  wrap.append(createElement("span", { text: label }));
  wrap.append(control);
  return wrap;
}

function renderDashboardItem(item, index) {
  const language = getLanguage();
  const article = createElement("article", { className: "dashboard-item" });
  const head = createElement("div", { className: "dashboard-heading" });
  const favorite = createElement("button", {
    className: item.favorite ? "icon-button is-active" : "icon-button",
    text: item.favorite ? "★" : "☆",
    attrs: { type: "button", "aria-pressed": String(item.favorite), "aria-label": t("favorite", language) }
  });
  favorite.addEventListener("click", () => {
    item.favorite = !item.favorite;
    persist(t("saved", language));
    renderDashboard();
  });
  const title = createElement("div");
  title.append(createElement("h3", { text: item.title }));
  title.append(createElement("p", { className: "subtitle", text: localized(item.subtitle, language) }));
  head.append(favorite, title);

  const links = createElement("div", { className: "action-row" });
  const publicLink = createElement("a", { className: "button-link", text: t("githubPages", language) });
  setSafeLink(publicLink, item.publicUrl);
  const repoLink = createElement("a", { className: "button-link button-secondary", text: t("repoUrl", language) });
  setSafeLink(repoLink, item.repoUrl);
  links.append(publicLink, repoLink);

  const grid = createElement("div", { className: "dashboard-grid" });
  const localStatus = createElement("select");
  ["published", "prototype", "maintenance", "dormant", "draft"].forEach((status) => {
    localStatus.append(createElement("option", { text: t(status, language), attrs: { value: status } }));
  });
  localStatus.value = item.localStatus;
  localStatus.addEventListener("change", () => {
    item.localStatus = localStatus.value;
    persist(t("saved", language));
  });

  const privateNote = createElement("textarea", { attrs: { rows: "3" } });
  privateNote.value = item.privateNote;
  privateNote.addEventListener("input", () => {
    item.privateNote = privateNote.value;
    persist();
  });

  const nextAction = createElement("textarea", { attrs: { rows: "3" } });
  nextAction.value = item.nextAction;
  nextAction.addEventListener("input", () => {
    item.nextAction = nextAction.value;
    persist();
  });

  const maintenanceNote = createElement("textarea", { attrs: { rows: "3" } });
  maintenanceNote.value = item.maintenanceNote;
  maintenanceNote.addEventListener("input", () => {
    item.maintenanceNote = maintenanceNote.value;
    persist();
  });

  const repoUrl = createElement("input", { attrs: { type: "url" } });
  repoUrl.value = item.repoUrl;
  repoUrl.addEventListener("input", () => {
    item.repoUrl = repoUrl.value;
    persist();
  });

  grid.append(
    field(t("localStatus", language), localStatus),
    field(t("repoUrl", language), repoUrl),
    field(t("privateNote", language), privateNote),
    field(t("nextAction", language), nextAction),
    field(t("maintenanceNote", language), maintenanceNote)
  );

  const controls = createElement("div", { className: "action-row" });
  const up = createElement("button", { className: "button-link button-secondary", text: t("moveUp", language), attrs: { type: "button" } });
  const down = createElement("button", { className: "button-link button-secondary", text: t("moveDown", language), attrs: { type: "button" } });
  up.disabled = index === 0;
  down.disabled = index === state.items.length - 1;
  up.addEventListener("click", () => swapItems(index, -1));
  down.addEventListener("click", () => swapItems(index, 1));
  controls.append(up, down);

  article.append(head, links, grid, controls);
  return article;
}

function renderDashboard() {
  const container = qs("[data-dashboard-list]");
  container.replaceChildren();
  state.items.forEach((item, index) => container.append(renderDashboardItem(item, index)));
}

function renderWarnings(messages) {
  const box = qs("[data-import-warnings]");
  box.replaceChildren();
  messages.forEach((message) => box.append(createElement("li", { text: message })));
}

function setupImportExport() {
  qs("[data-export]").addEventListener("click", () => exportDashboard(state));
  qs("[data-reset]").addEventListener("click", () => {
    backupDashboardState(state);
    state = { version: 1, items: initialItems.map(makeDashboardItem) };
    persist(t("saved", getLanguage()));
    renderDashboard();
  });
  qs("[data-restore]").addEventListener("click", () => {
    const backup = loadDashboardBackup();
    if (!backup) {
      renderWarnings(["No backup found."]);
      return;
    }
    state = backup;
    persist(t("saved", getLanguage()));
    renderDashboard();
  });
  qs("[data-import-run]").addEventListener("click", async () => {
    const file = qs("[data-import-file]").files[0];
    if (!file) {
      renderWarnings(["Please choose a JSON file."]);
      return;
    }
    try {
      const data = JSON.parse(await file.text());
      const result = importDashboard(state, data, qs("[name='import-mode']:checked").value);
      state = result.state;
      renderWarnings(result.warnings.length ? result.warnings : [result.changed ? "Import completed." : "Import failed."]);
      renderDashboard();
    } catch {
      renderWarnings(["Invalid JSON. Existing data was not changed."]);
    }
  });
}

async function main() {
  initLanguageSwitcher();
  const data = await loadPublicItems();
  initialItems = data.items;
  state = mergeInitialWithSaved(data.items, loadDashboardState());
  persist();
  setupImportExport();
  renderDashboard();
  window.addEventListener("mythos:language", renderDashboard);
}

main().catch((error) => {
  qs("main")?.append(createElement("p", { className: "empty-note", text: "Dashboard data could not be loaded." }));
  console.error(error);
});
