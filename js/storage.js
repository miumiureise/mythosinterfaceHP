const DASHBOARD_KEY = "mythos-interface-dashboard";
const BACKUP_KEY = "mythos-interface-dashboard-backup";

function safeStorage(action, fallback) {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") return fallback;
  try {
    return action();
  } catch {
    return fallback;
  }
}

export function loadDashboardState() {
  return safeStorage(() => {
    const raw = localStorage.getItem(DASHBOARD_KEY);
    return raw ? JSON.parse(raw) : null;
  }, null);
}

export function saveDashboardState(state) {
  return safeStorage(() => {
    localStorage.setItem(DASHBOARD_KEY, JSON.stringify(state));
    return true;
  }, false);
}

export function backupDashboardState(state) {
  return safeStorage(() => {
    localStorage.setItem(BACKUP_KEY, JSON.stringify(state));
    return true;
  }, false);
}

export function loadDashboardBackup() {
  return safeStorage(() => {
    const raw = localStorage.getItem(BACKUP_KEY);
    return raw ? JSON.parse(raw) : null;
  }, null);
}

export function clearDashboardState() {
  return safeStorage(() => {
    localStorage.removeItem(DASHBOARD_KEY);
    return true;
  }, false);
}
