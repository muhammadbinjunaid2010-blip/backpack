/* ============================================================
   BACKPACK AIR — Persistent Data Layer (Document System V2)
   CRITICAL RULE: Application updates MUST NEVER delete user data.
   - single versioned database
   - non-destructive migrations (add fields only)
   - documents preserved by permanent ID
   - system content seeded only when missing
   - legacy prototype data imported once
   ============================================================ */
window.BAStore = (function () {
  "use strict";

  var DB_KEY = "ba_db";
  var CURRENT_SCHEMA = 3;

  function uid(prefix) {
    return (prefix || "doc") + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  }
  function safeParse(s, fb) {
    try { var v = JSON.parse(s); return v == null ? fb : v; } catch (e) { return fb; }
  }
  function nowISO() { return new Date().toISOString(); }
  function clone(o) { try { return JSON.parse(JSON.stringify(o)); } catch (e) { return {}; } }

  /* ---------- paper descriptors ---------- */
  var PAPER_TYPES = [
    { id: "legal",        label: "Legal",          kind: "ruled", layout: "ltr",  rule: 34 },
    { id: "legal-left",   label: "Legal — Left",   kind: "ruled", layout: "left", rule: 34 },
    { id: "blank",        label: "Blank",          kind: "blank", layout: "ltr",  rule: 0 },
    { id: "dotted",       label: "Dotted",         kind: "dotted", layout: "ltr", rule: 30 },
    { id: "grid",         label: "Grid",           kind: "grid",  layout: "ltr",  rule: 26 },
    { id: "graph",        label: "Graph Paper",    kind: "graph", layout: "ltr",  rule: 28 },
    { id: "green",        label: "Green",          kind: "green", layout: "ltr",  rule: 30 },
    { id: "ruled-narrow", label: "Ruled — Narrow", kind: "ruled", layout: "ltr",  rule: 26 },
    { id: "ruled-wide",   label: "Ruled — Wide",   kind: "ruled", layout: "ltr",  rule: 42 },
    { id: "ruled",        label: "Ruled",          kind: "ruled", layout: "ltr",  rule: 34 },
    { id: "ruled-rtl",    label: "Ruled RTL",      kind: "ruled", layout: "rtl",  rule: 34 },
    { id: "graph-1cm",    label: "Graph 1 cm",     kind: "graph", layout: "ltr",  rule: 28 },
    { id: "graph-1in",    label: "Graph 1 in",     kind: "graph", layout: "ltr",  rule: 56 }
  ];
  var PAPER_MAP = {};
  PAPER_TYPES.forEach(function (p) { PAPER_MAP[p.id] = p; });
  function paperDef(id) { return PAPER_MAP[id] || PAPER_MAP["ruled"]; }

  var PAPER_COLORS = {
    white: { bg: "#ffffff", ink: "rgba(60,110,200,.22)", accent: "rgba(255,90,90,.45)" },
    yellow: { bg: "#fdf6da", ink: "rgba(120,90,20,.22)", accent: "rgba(200,60,40,.40)" },
    dark: { bg: "#1f2330", ink: "rgba(150,170,220,.20)", accent: "rgba(255,120,120,.40)" }
  };
  function paperColorDef(c) { return PAPER_COLORS[c] || PAPER_COLORS.white; }

  var COVER_TYPES = [
    { id: "none", label: "No Cover" }, { id: "dotted", label: "Dotted" },
    { id: "simple", label: "Simple" }, { id: "classic", label: "Classic" },
    { id: "academic", label: "Academic" }, { id: "minimal", label: "Minimal" },
    { id: "dark", label: "Dark" }, { id: "paper", label: "Paper" }, { id: "grid", label: "Grid" }
  ];
  var COVER_MAP = {};
  COVER_TYPES.forEach(function (c) { COVER_MAP[c.id] = c; });
  function coverDef(id) { return COVER_MAP[id] || COVER_MAP["classic"]; }

  var FOLDER_ICONS = [
    { id: "web", glyph: "🌐" }, { id: "settings", glyph: "⚙️" }, { id: "plus", glyph: "➕" },
    { id: "minus", glyph: "➖" }, { id: "music", glyph: "🎵" }, { id: "code", glyph: "</>" },
    { id: "islamic", glyph: "🕌" }, { id: "book", glyph: "📖" }, { id: "label", glyph: "🏷️" },
    { id: "star", glyph: "⭐" }, { id: "folder", glyph: "📁" }, { id: "flask", glyph: "🧪" },
    { id: "math", glyph: "📐" }, { id: "pen", glyph: "🖊️" }
  ];
  var FOLDER_ICON_MAP = {};
  FOLDER_ICONS.forEach(function (f) { FOLDER_ICON_MAP[f.id] = f; });
  function folderIconGlyph(id) { return (FOLDER_ICON_MAP[id] || FOLDER_ICON_MAP["folder"]).glyph; }

  var FOLDER_COLORS = [
    "#2f5bff", "#16a34a", "#dc2626", "#d97706",
    "#7c3aed", "#0891b2", "#db2777", "#0d9488", "#475569"
  ];

  /* ---------- document factory ---------- */
  function newPage(paper, paperColor) {
    return {
      id: uid("pg"),
      order: 0,
      paper: paper || "ruled",
      paperColor: paperColor || "white",
      strokes: [], shapes: [], text: [],
      createdAt: nowISO(), updatedAt: nowISO()
    };
  }
/*__APPEND__*/

  /* ---------- empty database ---------- */
  function emptyDB() {
    return {
      schemaVersion: CURRENT_SCHEMA,
      settings: {
        userName: "", school: "Bahria College Karsaz", class: "X", section: "C",
        teacher: "", address: "", email: "",
        direction: "ltr", paper: "ruled", paperColor: "white", theme: "system"
      },
      documents: {}, documentOrder: [],
      folders: {}, folderOrder: [],
      homework: [], pdfAnnotations: {}, bookmarks: {},
      legacyImported: false, seededSystem: 0
    };
  }

  /* ---------- migrations (NON-DESTRUCTIVE) ---------- */
  var MIGRATIONS = {
    1: function (db) { /* v1->v2 */
      db.folders = db.folders || {}; db.folderOrder = db.folderOrder || [];
      Object.keys(db.documents || {}).forEach(function (id) {
        var d = db.documents[id];
        if (d.paperColor == null) d.paperColor = "white";
        if (d.folderId == null) d.folderId = null;
        if (d.cover == null) d.cover = "classic";
        (d.pages || []).forEach(function (p) { if (p.shapes == null) p.shapes = []; if (p.text == null) p.text = []; });
      });
    },
    2: function (db) { /* v2->v3 */
      db.seededSystem = db.seededSystem || 0;
      Object.keys(db.documents || {}).forEach(function (id) {
        var d = db.documents[id];
        d.system = !!d.system;
        d.owner = d.owner || (d.system ? "school" : "user");
        if (d.type === "whiteboard" && !d.wb) d.wb = { strokes: [], shapes: [], text: [], camera: { x: 0, y: 0, zoom: 1 } };
        if (d.type === "notebook" && (!d.pages || !d.pages.length)) d.pages = [ newPage("ruled", "white") ];
      });
    }
  };

  /* ---------- load + migrate ---------- */
  var db = null;

  function load() {
    if (db) return db;
    var raw = safeParse(localStorage.getItem(DB_KEY), null);
    if (!raw || typeof raw !== "object") {
      db = emptyDB();
      importLegacy(db);
      persist();
      seedSystem(db);
      persist();
      return db;
    }
    var v = raw.schemaVersion || 0;
    if (v < CURRENT_SCHEMA) {
      for (var target = v + 1; target <= CURRENT_SCHEMA; target++) {
        if (MIGRATIONS[target - 1]) MIGRATIONS[target - 1](raw);
      }
      raw.schemaVersion = CURRENT_SCHEMA;
      raw.settings = raw.settings || {};
      raw.documents = raw.documents || {};
      raw.documentOrder = raw.documentOrder || Object.keys(raw.documents);
      raw.folders = raw.folders || {};
      raw.folderOrder = raw.folderOrder || Object.keys(raw.folders);
      raw.homework = raw.homework || [];
      raw.pdfAnnotations = raw.pdfAnnotations || {};
      raw.bookmarks = raw.bookmarks || {};
    }
    db = raw;
    seedSystem(db);
    persist();
    return db;
  }

  function persist() { try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch (e) {} }
  function getDB() { return db || load(); }
/*__APPEND__*/

  /* ---------- legacy import (one-time) ---------- */
  function legacyItemToDoc(it) {
    if (!it || !it.id) return null;
    var type = it.type === "sheet" ? "sheet" : "notebook";
    var doc = {
      id: it.id, type: type, title: it.name || "Untitled", subject: it.subject || null,
      folderId: null, cover: "classic", paper: it.paperType || "ruled", paperColor: "white",
      system: false, owner: "user", sharedWithTeacher: false,
      createdAt: it.created || nowISO(), updatedAt: it.created || nowISO(), pages: []
    };
    if (type === "sheet") {
      doc.sheet = it.sheet || { rows: 10, cols: 4, data: [], colWidths: [], rowHeights: [] };
    } else {
      (it.pages || []).forEach(function (pg, i) {
        doc.pages.push({
          id: uid("pg"), order: i, paper: doc.paper, paperColor: "white",
          strokes: pg.strokes || [], shapes: [], text: [],
          createdAt: nowISO(), updatedAt: nowISO()
        });
      });
      if (!doc.pages.length) doc.pages = [ newPage(doc.paper, "white") ];
    }
    return doc;
  }
  function importLegacy(db) {
    if (db.legacyImported) return;
    var items = safeParse(localStorage.getItem("ba_items_v2"), null);
    if (items && Array.isArray(items)) {
      items.forEach(function (it) {
        var doc = legacyItemToDoc(it);
        if (doc && !db.documents[doc.id]) { db.documents[doc.id] = doc; db.documentOrder.push(doc.id); }
      });
    }
    var hw = safeParse(localStorage.getItem("ba_homework_v2"), null);
    if (hw && Array.isArray(hw)) db.homework = hw;
    var pdf = safeParse(localStorage.getItem("ba_pdf_annot_v2"), null);
    if (pdf && typeof pdf === "object") db.pdfAnnotations = pdf;
    var bm = safeParse(localStorage.getItem("ba_bookmarks_v1"), null);
    if (bm && typeof bm === "object") db.bookmarks = bm;
    var st = safeParse(localStorage.getItem("ba_settings_v2"), null);
    if (st && typeof st === "object") db.settings = Object.assign(db.settings, st);
    db.legacyImported = true;
  }

  /* ---------- mandatory school notebooks ---------- */
  /* One permanent, non-deletable school notebook per subject. */
  console.log("[store] loaded, BAStore ready");
  var SYSTEM_SUBJECTS = [
    { subject: "Mathematics",  file: "math-10.pdf",  rtl: false, teacher: "", cover: "academic", paper: "grid" },
    { subject: "English",      file: "eng-10.pdf",   rtl: false, teacher: "", cover: "classic",  paper: "ruled" },
    { subject: "Urdu",         file: "urd-10.pdf",   rtl: true,  teacher: "", cover: "minimal",  paper: "ruled" },
    { subject: "Physics",      file: "phy-10.pdf",   rtl: false, teacher: "47 — Ms. Saeeda", cover: "academic", paper: "ruled-narrow" },
    { subject: "Chemistry",    file: "chem-10.pdf",  rtl: false, teacher: "", cover: "classic",  paper: "graph" },
    { subject: "Computer Science", file: "cs-10.pdf", rtl: false, teacher: "", cover: "dark",    paper: "grid" },
    { subject: "Pakistan Studies", file: "pst-10.pdf", rtl: false, teacher: "", cover: "simple", paper: "ruled-wide" },
    { subject: "Tarjumatul Quran", file: null, noBook: true, rtl: false, teacher: "", cover: "paper", paper: "ruled" }
  ];
  function systemNotebookId(subject) { return "sys-nb-" + subject.replace(/[^a-z0-9]/gi, "").toLowerCase(); }
  function blankPdfDataUrl() {
    var pdf = "%PDF-1.4\n1 0 obj<<\/Type\/Catalog\/Pages 2 0 R>>endobj\n" +
      "2 0 obj<<\/Type\/Pages\/Kids[3 0 R]\/Count 1>>endobj\n" +
      "3 0 obj<<\/Type\/Page\/Parent 2 0 R\/MediaBox[0 0 595 842]\/Resources<<>>\/Contents 4 0 R>>endobj\n" +
      "4 0 obj<<\/Length 0>>stream\nendstream\nendobj\ntrailer<<\/Root 1 0 R>>\n%%EOF";
    try { return "data:application/pdf;base64," + btoa(pdf); } catch (e) { return "about:blank"; }
  }
  function seedSystem(db) {
    SYSTEM_SUBJECTS.forEach(function (s) {
      var id = systemNotebookId(s.subject);
      if (!db.documents[id]) { /* seed only when missing */
        var d = {
          id: id, type: "notebook", title: s.subject, subject: s.subject,
          folderId: null, cover: s.cover, paper: s.paper, paperColor: "white",
          system: true, owner: "school", sharedWithTeacher: true, teacher: s.teacher || "",
          createdAt: nowISO(), updatedAt: nowISO(),
          pages: [ newPage(s.paper, "white") ]
        };
        db.documents[id] = d;
        if (db.documentOrder.indexOf(id) < 0) db.documentOrder.push(id);
      }
      /* school book (PDF) — separate from the notebook, annotation layer only.
         Subjects flagged noBook (e.g. Tarjumatul Quran) have a notebook but no textbook. */
      if (!s.noBook) {
        var bid = "sys-book-" + s.subject.replace(/[^a-z0-9]/gi, "").toLowerCase();
        if (!db.documents[bid]) {
          var b = {
            id: bid, type: "book", title: s.subject + " — Class X", subject: s.subject,
            folderId: null, system: true, owner: "school", teacher: s.teacher || "",
            file: s.file || blankPdfDataUrl(),
            createdAt: nowISO(), updatedAt: nowISO()
          };
          db.documents[bid] = b;
          if (db.documentOrder.indexOf(bid) < 0) db.documentOrder.push(bid);
        }
      }
    });
    db.seededSystem = SYSTEM_SUBJECTS.length;
    seedLibraryFolder(db);
  }
  function seedLibraryFolder(db) {
    /* Library Notes folder — student reading logs shared with the librarian */
    for (var i = 0; i < db.folderOrder.length; i++) {
      var f = db.folders[db.folderOrder[i]];
      if (f && f.purpose === "library") return; /* already exists */
    }
    var id = "sys-folder-library";
    if (!db.folders[id]) {
      db.folders[id] = { id: id, name: "Library Notes", color: "#7c3aed", icon: "📚", purpose: "library", createdAt: nowISO() };
      db.folderOrder.push(id);
    }
  }
  function getLibraryFolder() {
    var f = getFolders();
    for (var i = 0; i < f.length; i++) if (f[i].purpose === "library") return f[i];
    return null;
  }
/*__APPEND__*/

  /* ---------- DOCUMENTS ---------- */
  function getDocuments() { return getDB().documentOrder.map(function (id) { return getDB().documents[id]; }).filter(Boolean); }
  function getDocument(id) { return getDB().documents[id] || null; }
  function getDocumentsBySubject(subject) { return getDocuments().filter(function (d) { return d.subject === subject; }); }
  function getDocumentsByFolder(folderId) { return getDocuments().filter(function (d) { return (d.folderId || null) === (folderId || null); }); }
  function getUserDocuments() { return getDocuments().filter(function (d) { return !d.system; }); }

  function touch(doc) { doc.updatedAt = nowISO(); return doc; }

  function addDocument(doc) {
    var d = getDB();
    doc.id = doc.id || uid(doc.type || "doc");
    doc.createdAt = doc.createdAt || nowISO();
    doc.updatedAt = doc.updatedAt || nowISO();
    if (doc.type === "notebook" && (!doc.pages || !doc.pages.length)) doc.pages = [ newPage(doc.paper, doc.paperColor) ];
    if (doc.type === "whiteboard" && !doc.wb) doc.wb = { strokes: [], shapes: [], text: [], camera: { x: 0, y: 0, zoom: 1 } };
    if (doc.type === "quicknote" && !doc.text) doc.text = "";
    d.documents[doc.id] = doc;
    if (d.documentOrder.indexOf(doc.id) < 0) d.documentOrder.push(doc.id);
    persist();
    return doc;
  }
  function updateDocument(id, patch) {
    var d = getDB();
    if (!d.documents[id]) return null;
    var doc = d.documents[id];
    /* never allow flipping system flag off, never allow renaming a system notebook away */
    if (doc.system) { delete patch.system; delete patch.title; delete patch.subject; delete patch.folderId; }
    Object.keys(patch).forEach(function (k) { doc[k] = patch[k]; });
    touch(doc);
    persist();
    return doc;
  }
  function removeDocument(id) {
    var d = getDB();
    var doc = d.documents[id];
    if (!doc) return false;
    if (doc.system) return false; /* mandatory school content cannot be deleted */
    if (doc.folderId) {
      var f = d.folders[doc.folderId];
      if (f && f.locked && f.lockedContent === id) return false;
    }
    delete d.documents[id];
    var i = d.documentOrder.indexOf(id); if (i >= 0) d.documentOrder.splice(i, 1);
    persist();
    return true;
  }
  function reorderDocument(id, toIndex) {
    var d = getDB();
    var i = d.documentOrder.indexOf(id); if (i < 0) return;
    d.documentOrder.splice(i, 1);
    d.documentOrder.splice(Math.max(0, Math.min(toIndex, d.documentOrder.length)), 0, id);
    persist();
  }
  function setDocumentFolder(id, folderId) {
    var d = getDB();
    var doc = d.documents[id];
    if (!doc || doc.system) return; /* system notebooks stay in their subject */
    doc.folderId = folderId || null; touch(doc); persist();
  }

  /* ---------- PAGES ---------- */
  function getPages(doc) { return (doc.pages || []).slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); }); }
  function addPage(docId, inheritPaper) {
    var d = getDB(); var doc = d.documents[docId]; if (!doc) return null;
    var paper = inheritPaper ? doc.paper : (doc.pages[0] ? doc.pages[0].paper : "ruled");
    var pg = newPage(paper, doc.paperColor);
    pg.order = getPages(doc).length;
    doc.pages.push(pg); touch(doc); persist();
    return pg;
  }
  function deletePage(docId, pageId) {
    var d = getDB(); var doc = d.documents[docId]; if (!doc) return;
    if (doc.pages.length <= 1) return; /* keep at least one page */
    doc.pages = doc.pages.filter(function (p) { return p.id !== pageId; });
    doc.pages.forEach(function (p, i) { p.order = i; });
    touch(doc); persist();
  }
  function duplicatePage(docId, pageId) {
    var d = getDB(); var doc = d.documents[docId]; if (!doc) return;
    var src = doc.pages.filter(function (p) { return p.id === pageId; })[0]; if (!src) return;
    var copy = clone(src); copy.id = uid("pg"); copy.createdAt = nowISO(); copy.updatedAt = nowISO();
    doc.pages.push(copy);
    doc.pages.forEach(function (p, i) { p.order = i; });
    touch(doc); persist(); return copy;
  }
  function reorderPage(docId, pageId, toIndex) {
    var d = getDB(); var doc = d.documents[docId]; if (!doc) return;
    var pages = getPages(doc);
    var i = pages.findIndex(function (p) { return p.id === pageId; }); if (i < 0) return;
    var pg = pages.splice(i, 1)[0];
    pages.splice(Math.max(0, Math.min(toIndex, pages.length)), 0, pg);
    pages.forEach(function (p, idx) { p.order = idx; });
    touch(doc); persist();
  }

  /* ---------- FOLDERS ---------- */
  function getFolders() { return getDB().folderOrder.map(function (id) { return getDB().folders[id]; }).filter(Boolean); }
  function getFolder(id) { return getDB().folders[id] || null; }
  function addFolder(name, color, icon, lockedDocId) {
    var d = getDB();
    var f = { id: uid("fld"), name: name || "Folder", color: color || "#2f5bff", icon: icon || "folder", createdAt: nowISO() };
    if (lockedDocId) f.lockedContent = lockedDocId;
    d.folders[f.id] = f; d.folderOrder.push(f.id); persist(); return f;
  }
  function updateFolder(id, patch) {
    var d = getDB(); if (!d.folders[id]) return;
    Object.keys(patch).forEach(function (k) { d.folders[id][k] = patch[k]; });
    persist();
  }
  function removeFolder(id) {
    var d = getDB();
    var f = d.folders[id]; if (!f) return false;
    /* move contained docs back to root (never delete user docs) */
    getDocumentsByFolder(id).forEach(function (doc) { doc.folderId = null; });
    delete d.folders[id];
    var i = d.folderOrder.indexOf(id); if (i >= 0) d.folderOrder.splice(i, 1);
    persist(); return true;
  }

  /* ---------- HOMEWORK ---------- */
  function getHomework() { return getDB().homework; }
  function addHomework(h) { var d = getDB(); d.homework.push(Object.assign({ id: uid("hw"), done: false }, h)); persist(); }
  function updateHomework(id, patch) {
    var d = getDB(); var h = d.homework.filter(function (x) { return x.id === id; })[0];
    if (h) { Object.keys(patch).forEach(function (k) { h[k] = patch[k]; }); persist(); }
  }
  function removeHomework(id) { var d = getDB(); d.homework = d.homework.filter(function (x) { return x.id !== id; }); persist(); }

  /* ---------- PDF ANNOTATIONS ---------- */
  function getPdfAnnotation(key) { return getDB().pdfAnnotations[key] || null; }
  function setPdfAnnotation(key, data) { var d = getDB(); d.pdfAnnotations[key] = data; persist(); }

  /* ---------- BOOKMARKS ---------- */
  function getBookmark(subject) { return getDB().bookmarks[subject] || null; }
  function setBookmark(subject, page) { var d = getDB(); d.bookmarks[subject] = page; persist(); }

  /* ---------- SETTINGS ---------- */
  function getSettings() { return getDB().settings; }
  function saveSettings(patch) { var d = getDB(); d.settings = Object.assign(d.settings, patch); persist(); return d.settings; }

  /* ---------- migration simulation hook (for critical test) ---------- */
  function forceRemigrate() {
    var raw = safeParse(localStorage.getItem(DB_KEY), null);
    if (!raw) return;
    raw.schemaVersion = Math.max(0, (raw.schemaVersion || 1) - 1); /* pretend older */
    localStorage.setItem(DB_KEY, JSON.stringify(raw));
    db = null; load();
  }

  /* ---------- public API ---------- */
  return {
    load: load,
    getDB: getDB,
    persist: persist,
    PAPER_TYPES: PAPER_TYPES, paperDef: paperDef,
    PAPER_COLORS: PAPER_COLORS, paperColorDef: paperColorDef,
    COVER_TYPES: COVER_TYPES, coverDef: coverDef,
    FOLDER_ICONS: FOLDER_ICONS, folderIconGlyph: folderIconGlyph,
    FOLDER_COLORS: FOLDER_COLORS,
    SYSTEM_SUBJECTS: SYSTEM_SUBJECTS, systemNotebookId: systemNotebookId,
    newPage: newPage, uid: uid,
    getDocuments: getDocuments, getDocument: getDocument,
    getDocumentsBySubject: getDocumentsBySubject, getDocumentsByFolder: getDocumentsByFolder,
    getUserDocuments: getUserDocuments,
    addDocument: addDocument, updateDocument: updateDocument, removeDocument: removeDocument,
    reorderDocument: reorderDocument, setDocumentFolder: setDocumentFolder,
    getPages: getPages, addPage: addPage, deletePage: deletePage, duplicatePage: duplicatePage, reorderPage: reorderPage,
    getFolders: getFolders, getFolder: getFolder, addFolder: addFolder, updateFolder: updateFolder, removeFolder: removeFolder, getLibraryFolder: getLibraryFolder,
    getHomework: getHomework, addHomework: addHomework, updateHomework: updateHomework, removeHomework: removeHomework,
    getPdfAnnotation: getPdfAnnotation, setPdfAnnotation: setPdfAnnotation,
    getBookmark: getBookmark, setBookmark: setBookmark,
    getSettings: getSettings, saveSettings: saveSettings,
    forceRemigrate: forceRemigrate
  };
})();

