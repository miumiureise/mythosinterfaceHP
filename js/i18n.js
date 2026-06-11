const LANG_KEY = "mythos-interface-language";
let activeLanguage = "ja";

export const translations = {
  ja: {
    home: "Home",
    apps: "Apps / Instrumente",
    books: "Books / Bücher",
    notes: "Notes / Notizen",
    about: "About",
    updates: "Updates",
    dashboard: "Dashboard",
    werkstatt: "Werkstatt",
    category: "カテゴリー",
    status: "状態",
    published: "公開中",
    prototype: "試作",
    maintenance: "保守中",
    dormant: "休眠",
    draft: "下書き",
    open: "開く",
    details: "詳細",
    import: "インポート",
    export: "エクスポート",
    merge: "統合",
    replace: "置き換え",
    addOnly: "追加のみ",
    favorite: "お気に入り",
    nextAction: "次に直したいこと",
    privateNote: "自分用メモ",
    maintenanceNote: "保守メモ",
    toWerkstatt: "工房へ",
    toPortfolio: "ポートフォリオへ",
    clear: "クリア",
    search: "検索",
    all: "すべて",
    type: "種類",
    technologies: "技術",
    tags: "タグ",
    recent: "最近追加したアプリ",
    recommended: "おすすめの器具",
    kindleLead: "Kindle / Notes",
    dashboardLead: "Dashboard入口",
    workshopStatus: "工房状態",
    categoryEntrances: "カテゴリ別入口",
    welcomeTitle: "ようこそ Mythos Interface へ",
    siteDescription: "日常に神話的なインターフェースをつくる小さなデジタル工房。",
    welcomeBody: "ようこそ、Mythos Interfaceへ。ここは、時間・暦・方位・数・天文・象徴を、日常で触れる小さな道具に変えるためのデジタル工房です。",
    englishNote: "A small digital workshop for time, symbols, numbers, and strange instruments.",
    aboutBody: "Mythos Interfaceは、AIとの対話やCodexによる実装を通じて、暦、天文、方位、数、象徴をテーマにした小さなWebアプリを作る個人プロジェクトです。",
    dashboardWarning: "このDashboardはGitHub Pages上の静的ページです。秘密情報や個人情報は保存しないでください。",
    noItems: "表示できる項目がありません。",
    publicOnly: "公開ページには showInPortfolio が true で、draft ではない項目だけを表示します。",
    resetInitial: "初期公開データを再読み込み",
    restorePrevious: "直前の状態に戻す",
    moveUp: "上へ",
    moveDown: "下へ",
    localStatus: "手元の状態",
    repoUrl: "GitHubリポジトリURL",
    githubPages: "GitHub Pagesリンク",
    displayOrder: "表示順",
    importMode: "インポート方法",
    chooseFile: "JSONファイルを選択",
    importRun: "読み込む",
    exportRun: "JSONを書き出す",
    importWarnings: "読み込みメッセージ",
    saved: "保存しました",
    invalidUrl: "URLは http / https のみ使えます。",
    screenshot: "スクリーンショット枠"
  },
  de: {
    home: "Home",
    apps: "Apps / Instrumente",
    books: "Books / Bücher",
    notes: "Notizen",
    about: "Über",
    updates: "Aktuelles",
    dashboard: "Dashboard",
    werkstatt: "Werkstatt",
    category: "Kategorie",
    status: "Status",
    published: "Veröffentlicht",
    prototype: "Prototyp",
    maintenance: "In Wartung",
    dormant: "Ruhend",
    draft: "Entwurf",
    open: "Öffnen",
    details: "Details",
    import: "Importieren",
    export: "Exportieren",
    merge: "Zusammenführen",
    replace: "Ersetzen",
    addOnly: "Nur hinzufügen",
    favorite: "Favorit",
    nextAction: "Nächste Aufgabe",
    privateNote: "Private Notiz",
    maintenanceNote: "Wartungsnotiz",
    toWerkstatt: "Zur Werkstatt",
    toPortfolio: "Zum Portfolio",
    clear: "Zurücksetzen",
    search: "Suche",
    all: "Alle",
    type: "Typ",
    technologies: "Technik",
    tags: "Schlagwörter",
    recent: "Zuletzt hinzugefügte Apps",
    recommended: "Empfohlene Instrumente",
    kindleLead: "Kindle / Notizen",
    dashboardLead: "Eingang zum Dashboard",
    workshopStatus: "Werkstattzustand",
    categoryEntrances: "Eingänge nach Kategorie",
    welcomeTitle: "Willkommen bei Mythos Interface",
    siteDescription: "Eine kleine digitale Werkstatt für mythische Schnittstellen im Alltag.",
    welcomeBody: "Willkommen bei Mythos Interface. Dies ist eine kleine digitale Werkstatt, in der Zeit, Kalender, Richtung, Zahlen, Himmel und Symbole zu kleinen Werkzeugen für den Alltag werden.",
    englishNote: "A small digital workshop for time, symbols, numbers, and strange instruments.",
    aboutBody: "Mythos Interface ist ein persönliches Projekt, das mit Hilfe von KI und Codex kleine Web-Apps zu Kalendern, Himmel, Richtung, Zahlen und Symbolen entwickelt.",
    dashboardWarning: "Dieses Dashboard ist eine statische Seite auf GitHub Pages. Speichere hier keine geheimen oder persönlichen Daten.",
    noItems: "Keine Einträge gefunden.",
    publicOnly: "Öffentliche Seiten zeigen nur Einträge mit showInPortfolio true und ohne Entwurfsstatus.",
    resetInitial: "Öffentliche Anfangsdaten neu laden",
    restorePrevious: "Vorherigen Zustand wiederherstellen",
    moveUp: "Nach oben",
    moveDown: "Nach unten",
    localStatus: "Lokaler Status",
    repoUrl: "GitHub-Repository-URL",
    githubPages: "GitHub-Pages-Link",
    displayOrder: "Reihenfolge",
    importMode: "Importmethode",
    chooseFile: "JSON-Datei wählen",
    importRun: "Importieren",
    exportRun: "JSON exportieren",
    importWarnings: "Importmeldungen",
    saved: "Gespeichert",
    invalidUrl: "URLs müssen mit http oder https beginnen.",
    screenshot: "Screenshot-Feld"
  }
};

export function getLanguage() {
  try {
    activeLanguage = localStorage.getItem(LANG_KEY) || activeLanguage;
  } catch {
    // Some browsers block localStorage for local files or strict privacy settings.
  }
  return translations[activeLanguage] ? activeLanguage : "ja";
}

export function setLanguage(language) {
  activeLanguage = translations[language] ? language : "ja";
  try {
    localStorage.setItem(LANG_KEY, activeLanguage);
  } catch {
    // Public pages still work without storage.
  }
  document.documentElement.lang = activeLanguage;
  window.dispatchEvent(new CustomEvent("mythos:language", { detail: { language: activeLanguage } }));
}

export function t(key, language = getLanguage()) {
  return translations[language]?.[key] || translations.ja[key] || key;
}

export function localized(value, language = getLanguage()) {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  return value[language] || value.ja || "";
}

export function applyStaticTranslations(root = document) {
  const language = getLanguage();
  document.documentElement.lang = language;
  root.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n, language);
  });
  root.querySelectorAll("[data-i18n-aria]").forEach((node) => {
    node.setAttribute("aria-label", t(node.dataset.i18nAria, language));
  });
}

export function initLanguageSwitcher() {
  const buttons = document.querySelectorAll("[data-language]");
  const update = () => {
    const current = getLanguage();
    buttons.forEach((button) => {
      const active = button.dataset.language === current;
      button.setAttribute("aria-pressed", String(active));
      button.classList.toggle("is-active", active);
    });
    applyStaticTranslations();
  };
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      setLanguage(button.dataset.language);
      update();
    });
  });
  update();
}
