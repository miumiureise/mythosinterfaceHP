export function qs(selector, root = document) {
  return root.querySelector(selector);
}

export function qsa(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

export function createElement(tagName, options = {}) {
  const element = document.createElement(tagName);
  if (options.className) element.className = options.className;
  if (options.text !== undefined) element.textContent = options.text;
  if (options.attrs) {
    Object.entries(options.attrs).forEach(([key, value]) => {
      if (value !== undefined && value !== null) element.setAttribute(key, value);
    });
  }
  return element;
}

export function isSafeHttpUrl(url) {
  if (!url) return false;
  try {
    const base = typeof window !== "undefined" ? window.location.href : "https://example.invalid/";
    const parsed = new URL(url, base);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function isSafePublicHref(url) {
  if (!url) return false;
  if (/^\s*javascript:/i.test(url)) return false;
  if (/^(https?:)?\/\//i.test(url)) return isSafeHttpUrl(url);
  return /^[./#A-Za-z0-9_-]/.test(url);
}

export function setSafeLink(anchor, url) {
  if (!isSafePublicHref(url)) {
    anchor.setAttribute("aria-disabled", "true");
    anchor.classList.add("is-disabled");
    anchor.removeAttribute("href");
    return false;
  }
  anchor.href = url;
  if (/^https?:\/\//i.test(url)) {
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
  }
  return true;
}

export function normalizeForSearch(value) {
  return String(value || "").toLocaleLowerCase();
}

export function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

export function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}
