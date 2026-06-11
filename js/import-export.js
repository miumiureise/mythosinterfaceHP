import { backupDashboardState, saveDashboardState } from "./storage.js";
import { todayStamp } from "./utils.js";
import { validateImportData } from "./validation.js";

export function exportDashboard(state) {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    items: state.items.map((item) => ({
      id: item.id,
      title: item.title,
      publicUrl: item.publicUrl || "",
      repoUrl: item.repoUrl || "",
      favorite: Boolean(item.favorite),
      order: Number(item.order) || 0,
      privateNote: item.privateNote || "",
      nextAction: item.nextAction || "",
      localStatus: item.localStatus || item.status || "",
      maintenanceNote: item.maintenanceNote || ""
    }))
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `mythos-interface-dashboard-${todayStamp()}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

export function importDashboard(currentState, incomingData, mode) {
  const result = validateImportData(incomingData);
  if (!result.ok) return { state: currentState, warnings: result.warnings, changed: false };

  backupDashboardState(currentState);

  const currentItems = currentState.items || [];
  let nextItems;

  if (mode === "replace") {
    nextItems = result.items.map((item, index) => ({ ...item, order: item.order ?? index }));
  } else {
    nextItems = currentItems.map((item) => ({ ...item }));
    const nextById = new Map(nextItems.map((item) => [item.id, item]));
    result.items.forEach((incoming) => {
      const existing = nextById.get(incoming.id);
      if (existing && mode === "add") return;
      if (existing) {
        Object.assign(existing, incoming);
      } else {
        const added = { ...incoming, order: incoming.order ?? nextItems.length };
        nextItems.push(added);
        nextById.set(added.id, added);
      }
    });
  }

  const nextState = { version: 1, savedAt: new Date().toISOString(), items: nextItems };
  saveDashboardState(nextState);
  return { state: nextState, warnings: result.warnings, changed: true };
}
