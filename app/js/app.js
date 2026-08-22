/* ============================================================
   BACKPACK AIR — App Prototype (4-page architecture)
   ============================================================ */
(function () {
  "use strict";

  var STORE_SETTINGS = "ba_settings_v2";
  var STORE_ITEMS = "ba_items_v2";
  var STORE_HW = "ba_homework_v2";
  var STORE_PDF = "ba_pdf_annot_v2";

  var SUBJECTS = [
    { subject: "Mathematics", file: "math-10.pdf", rtl: false },
    { subject: "English", file: "eng-10.pdf", rtl: false },
    { subject: "Urdu", file: "urd-10.pdf", rtl: true },
    { subject: "Physics", file: "phy-10.pdf", rtl: false },
    { subject: "Chemistry", file: "chem-10.pdf", rtl: false },
    { subject: "Computer Science", file: "cs-10.pdf", rtl: false },
    { subject: "Pakistan Studies", file: "pst-10.pdf", rtl: false },
    { subject: "Biology", file: null, rtl: false },
    { subject: "Islamiat", file: null, rtl: false }
  ];

  var TIMETABLE = {
    mon: [
      { time: "08:00", end: "08:40", subject: "Chemistry", teacher: "Ms. Saeeda", type: "double" },
      { time: "08:40", end: "09:20", subject: "Chemistry", teacher: "Ms. Saeeda", type: "double" },
      { time: "09:20", end: "10:00", subject: "Pakistan Studies", teacher: "Mr. Imran", type: "single" },
      { time: "10:00", end: "10:40", subject: "Mathematics", teacher: "", type: "single" },
      { time: "10:40", end: "11:00", subject: "BREAK", teacher: "", type: "break" },
      { time: "11:00", end: "11:40", subject: "Physics", teacher: "Mr. Farhan", type: "double" },
      { time: "11:40", end: "12:20", subject: "Physics", teacher: "Mr. Farhan", type: "double" },
      { time: "12:20", end: "01:00", subject: "Urdu", teacher: "", type: "single" },
      { time: "01:00", end: "01:40", subject: "Computer Science", teacher: "", type: "single" }
    ],
    tue: [
      { time: "08:00", end: "08:40", subject: "Chemistry", teacher: "Ms. Saeeda", type: "single" },
      { time: "08:40", end: "09:20", subject: "Physics", teacher: "Mr. Farhan", type: "single" },
      { time: "09:20", end: "10:00", subject: "English", teacher: "Mr. Hussain", type: "single" },
      { time: "10:00", end: "10:40", subject: "Mathematics", teacher: "", type: "single" },
      { time: "10:40", end: "11:00", subject: "BREAK", teacher: "", type: "break" },
      { time: "11:00", end: "11:40", subject: "Urdu", teacher: "", type: "single" },
      { time: "11:40", end: "12:20", subject: "Pakistan Studies", teacher: "Mr. Imran", type: "single" },
      { time: "12:20", end: "01:00", subject: "Computer Science", teacher: "", type: "single" },
      { time: "01:00", end: "01:40", subject: "T-E-Q", teacher: "Mr. Tahir", type: "single" }
    ],
    wed: [
      { time: "08:00", end: "08:40", subject: "Chemistry", teacher: "Ms. Saeeda", type: "single" },
      { time: "08:40", end: "09:20", subject: "Pakistan Studies", teacher: "Mr. Imran", type: "single" },
      { time: "09:20", end: "10:00", subject: "T-E-Q", teacher: "Mr. Tahir", type: "single" },
      { time: "10:00", end: "10:40", subject: "Mathematics", teacher: "", type: "single" },
      { time: "10:40", end: "11:00", subject: "BREAK", teacher: "", type: "break" },
      { time: "11:00", end: "11:40", subject: "PT", teacher: "Mr. Rizwan", type: "single" },
      { time: "11:40", end: "12:20", subject: "Computer Science", teacher: "", type: "single" },
      { time: "12:20", end: "01:00", subject: "Physics", teacher: "Mr. Farhan", type: "single" },
      { time: "01:00", end: "01:40", subject: "English", teacher: "Mr. Hussain", type: "single" }
    ],
    thu: [
      { time: "08:00", end: "08:40", subject: "Chemistry", teacher: "Ms. Saeeda", type: "single" },
      { time: "08:40", end: "09:20", subject: "Urdu", teacher: "", type: "single" },
      { time: "09:20", end: "10:00", subject: "English", teacher: "Mr. Hussain", type: "single" },
      { time: "10:00", end: "10:40", subject: "Physics", teacher: "Mr. Farhan", type: "single" },
      { time: "10:40", end: "11:00", subject: "BREAK", teacher: "", type: "break" },
      { time: "11:00", end: "11:40", subject: "Mathematics", teacher: "", type: "single" },
      { time: "11:40", end: "12:20", subject: "Mathematics", teacher: "", type: "single" },
      { time: "12:20", end: "01:00", subject: "Computer Science", teacher: "", type: "single" },
      { time: "01:00", end: "01:40", subject: "T-E-Q", teacher: "Mr. Tahir", type: "single" }
    ],
    fri: [
      { time: "08:00", end: "08:40", subject: "Chemistry", teacher: "Ms. Saeeda", type: "single" },
      { time: "08:40", end: "09:20", subject: "Library", teacher: "Ms. Zinhar", type: "single" },
      { time: "09:20", end: "10:00", subject: "Computer Science", teacher: "", type: "double" },
      { time: "10:00", end: "10:40", subject: "Computer Science", teacher: "", type: "double" },
      { time: "10:40", end: "11:00", subject: "BREAK", teacher: "", type: "break" },
      { time: "11:00", end: "11:40", subject: "Mathematics", teacher: "", type: "single" },
      { time: "11:40", end: "12:20", subject: "English", teacher: "Mr. Hussain", type: "single" },
      { time: "12:20", end: "01:00", subject: "Urdu", teacher: "", type: "single" },
      { time: "01:00", end: "01:40", subject: "Physics", teacher: "Mr. Farhan", type: "single" }
    ]
  };

  /* ---------- Store ---------- */
  function load(k, fb) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch (e) { return fb; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); }

  var settings = load(STORE_SETTINGS, { userName: "", school: "Bahria College Karsaz", class: "X", section: "C", direction: "ltr", paper: "ruled", theme: "system" });
  var items = load(STORE_ITEMS, []);
  var homework = load(STORE_HW, []);

  function getSubject(name) { for (var i = 0; i < SUBJECTS.length; i++) if (SUBJECTS[i].subject === name) return SUBJECTS[i]; return null; }
  function subjectItems(name) { return items.filter(function (it) { return it.subject === name; }); }

  /* ---------- Init ---------- */
  function init() {
    applyTheme();
    applyHeader();
    setupOnboarding();
    setupNav();
    setupHome();
    setupSchoolbag();
    setupSchoolbagHomework();
    setupSchedule();
    setupSettings();
    setupSubjectFolder();
    setupNotebookModal();
    setupNotebookEditor();
    setupSheetModal();
    setupSheetEditor();
    setupHomework();
    setupPdfReader();
    setupToolsMenu();
    setupCalculator();
    setupFocusTime();
    setupSchoolClock();
    setupStickyNotes();
    setupFormulaBook();
    setupGames();
    setupHiddenGestures();
    renderHome();
    setInterval(renderHome, 60000);
  }

  /* ---------- Theme / header ---------- */
  function applyTheme() {
    var t = settings.theme || "system";
    var dark = t === "dark" || (t === "system" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.body.classList.toggle("theme-dark", !!dark);
  }
  function applyHeader() {
    var s = $("hdr-school"), c = $("hdr-class");
    if (s) s.textContent = settings.school || "Bahria College Karsaz";
    if (c) c.textContent = "Class " + (settings.class || "X") + "-" + (settings.section || "C");
  }

  /* ---------- Navigation ---------- */
  function navigate(section) {
    document.querySelectorAll(".ba-tabbar-item").forEach(function (it) {
      var on = it.getAttribute("data-section") === section;
      it.classList.toggle("active", on);
      it.setAttribute("aria-selected", on ? "true" : "false");
    });
    document.querySelectorAll(".ba-screen").forEach(function (sc) {
      sc.classList.toggle("ba-screen-active", sc.getAttribute("data-section") === section);
    });
    var m = $("ba-main"); if (m) m.scrollTop = 0;
  }
  function setupOnboarding() {
    var ob = $("onboarding"); if (!ob) return;
    var s = load(STORE_SETTINGS) || {};
    if (s.onboarded) { ob.classList.remove("ba-modal-open"); return; }
    ob.classList.add("ba-modal-open");
    var cont = $("onb-continue");
    if (cont) cont.addEventListener("click", function () {
      var sv = load(STORE_SETTINGS) || {};
      sv.userName = ($("onb-name").value || "").trim();
      sv.school = $("onb-school").value;
      var parts = $("onb-class").value.split("-");
      sv.class = parts[0] || "X";
      sv.section = parts[1] || "C";
      sv.onboarded = true;
      localStorage.setItem(STORE_SETTINGS, JSON.stringify(sv));
      settings.userName = sv.userName; settings.school = sv.school; settings.class = sv.class; settings.section = sv.section;
      applyHeader();
      renderHome();
      ob.classList.remove("ba-modal-open");
    });
  }

  function setupSchoolbagHomework() {
    var sb = $("schoolbag-homework-open");
    if (sb) sb.addEventListener("click", function () { openHomeworkModal(); });
    renderSchoolbagHomeworkCount();
  }
  function renderSchoolbagHomeworkCount() {
    var el = $("schoolbag-homework-count"); if (!el) return;
    var hw = load(STORE_HW) || [];
    var open = hw.filter(function (h) { return !h.done; }).length;
    el.textContent = open + (open === 1 ? " task" : " tasks");
  }

  function setupNav() {
    document.querySelectorAll(".ba-tabbar-item").forEach(function (it) {
      it.addEventListener("click", function () { navigate(this.getAttribute("data-section")); });
    });
  }

  /* ---------- Home ---------- */
  function greeting() {
    var h = new Date().getHours();
    var part = h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
    return settings.userName ? "Good " + part + ", " + settings.userName : "Good " + part;
  }
  function currentDayKey() {
    var d = new Date().getDay();
    return (d >= 1 && d <= 5) ? ["mon", "tue", "wed", "thu", "fri"][d - 1] : null;
  }
  function periodAt(periods, mins) {
    for (var i = 0; i < periods.length; i++) {
      var p = periods[i], s = p.time.split(":").map(Number), e = p.end.split(":").map(Number);
      var sm = s[0] * 60 + s[1], em = e[0] * 60 + e[1];
      if (mins >= sm && mins < em) return { cur: p, idx: i };
    }
    return null;
  }
  function setupHome() {
    $("home-current-period").addEventListener("click", function () {
      var p = periodAt(TIMETABLE[currentDayKey()] || [], new Date().getHours() * 60 + new Date().getMinutes());
      var subj = p ? p.cur.subject : null;
      if (subj && subj !== "BREAK") openSubjectFolder(subj);
    });
    $("home-buckle").addEventListener("click", openScheduleExams);
    $("home-homework-open").addEventListener("click", function () { $("homework-modal").classList.add("ba-modal-open"); renderHomework(); });
  }
  function renderHome() {
    var g = $("home-greeting"); if (g) g.textContent = greeting();
    var dayKey = currentDayKey();
    var periods = dayKey ? TIMETABLE[dayKey] : [];
    var now = new Date();
    var mins = now.getHours() * 60 + now.getMinutes();
    var at = periodAt(periods, mins);
    var pcn = document.querySelector(".ba-pcn");

    var cp = $("home-current-period");
    if (dayKey && at && at.cur.type !== "break") {
      var p = at.cur;
      $("home-cp-time").textContent = p.time + " – " + p.end;
      $("home-cp-subject").textContent = p.subject;
      $("home-cp-teacher").textContent = p.teacher || "";
      cp.querySelector(".ba-cp-label").textContent = "NOW";
      cp.classList.remove("ba-cp-off");
      if (pcn) pcn.style.display = "grid";
    } else {
      // No current class — show a meaningful state instead of a blank period card
      var label, subj, teacher;
      if (!dayKey) { label = "WEEKEND"; subj = "No school today"; teacher = "Enjoy your weekend"; }
      else {
        var lastEnd = periods[periods.length - 1].end.split(":").map(Number);
        var lastMins = lastEnd[0] * 60 + lastEnd[1];
        var firstStart = periods[0].time.split(":").map(Number);
        var firstMins = firstStart[0] * 60 + firstStart[1];
        if (mins > lastMins) { if (dayKey === "fri") { label = "SCHOOL'S OVER"; subj = "Have a great weekend"; teacher = "See you Monday"; } else { label = "SCHOOL'S OVER"; subj = "Day complete"; teacher = "See you tomorrow"; } }
        else if (mins < firstMins) { label = "BEFORE SCHOOL"; subj = "Starts at " + periods[0].time; teacher = "Get ready"; }
        else { label = "BREAK"; subj = "Recess"; teacher = "Stretch & breathe"; }
      }
      $("home-cp-time").textContent = "";
      $("home-cp-subject").textContent = subj;
      $("home-cp-teacher").textContent = teacher;
      cp.querySelector(".ba-cp-label").textContent = label;
      cp.classList.add("ba-cp-off");
      if (pcn) pcn.style.display = "none";
    }

    // prev / next (only when a current period is active)
    if (at) {
      var prev = null, next = null;
      for (var i = at.idx - 1; i >= 0; i--) { if (periods[i].type !== "break") { prev = periods[i]; break; } }
      for (var j = at.idx + 1; j < periods.length; j++) { if (periods[j].type !== "break") { next = periods[j]; break; } }
      setPcn("prev", prev);
      setPcn("next", next);
    } else { setPcn("prev", null); setPcn("next", null); }

    // today list
    var list = $("home-today-list");
    if (list) {
      if (!dayKey) { list.innerHTML = '<div class="ba-today-row"><div class="ba-today-subject">No school today</div></div>'; }
      else {
        list.innerHTML = "";
        periods.forEach(function (p) {
          var row = document.createElement("div");
          row.className = "ba-today-row" + (p.type === "break" ? " ba-break" : "");
          row.innerHTML = '<div class="ba-today-time">' + p.time + '</div><div class="ba-today-subject">' + esc(p.subject) + '</div><div class="ba-today-teacher">' + esc(p.teacher) + '</div>';
          if (p.type !== "break") row.addEventListener("click", function () { openSubjectFolder(p.subject); });
          list.appendChild(row);
        });
      }
    }

    // homework count
    var open = homework.filter(function (h) { return !h.done; }).length;
    var hwc = $("home-homework-count"); if (hwc) hwc.textContent = open + (open === 1 ? " task" : " tasks") + " due";
    renderSchoolbagHomeworkCount();
  }
  function setPcn(which, p) {
    var subj = $("home-" + which + "-subject"), time = $("home-" + which + "-time");
    if (!p) { subj.textContent = "—"; time.textContent = ""; }
    else { subj.textContent = p.subject; time.textContent = p.time + "–" + p.end; }
  }

  /* ---------- Schoolbag ---------- */
  function setupSchoolbag() {
    var grid = $("schoolbag-folders");
    if (!grid) return;
    grid.innerHTML = "";
    SUBJECTS.forEach(function (s) {
      var card = document.createElement("div");
      card.className = "ba-folder-card";
      var count = subjectItems(s.subject).length;
      card.innerHTML = '<div class="ba-folder-cover">' + esc(s.subject) + '</div><div class="ba-folder-subject">' + esc(s.subject) + '</div><div class="ba-folder-meta">' + (s.file ? "Book · " : "No book · ") + count + ' page' + (count === 1 ? "" : "s") + '</div>';
      card.addEventListener("click", function () { openSubjectFolder(s.subject); });
      grid.appendChild(card);
    });
  }

  /* ---------- Subject folder modal ---------- */
  var activeFolderSubject = null;
  function openSubjectFolder(subject) {
    activeFolderSubject = subject;
    var s = getSubject(subject);
    $("sf-subject").textContent = subject;
    var book = $("sf-book");
    if (s && s.file) {
      book.innerHTML = '<div class="ba-sf-book-cover">📕</div><div class="ba-sf-book-name">' + esc(subject) + ' — Class ' + esc(settings.class || "X") + '</div><div class="ba-sf-book-offline">● Available Offline</div><button class="ba-button ba-button-primary" id="sf-open-book" style="margin-top:.6rem;">Open Book</button>';
      $("sf-open-book").addEventListener("click", function () { openPdf(s); });
    } else {
      book.innerHTML = '<div class="ba-sf-book-none">Book PDF not provided yet for this subject.</div>';
    }
    renderFolderPages();
    $("subject-folder-modal").classList.add("ba-modal-open");
  }
  function renderFolderPages() {
    var wrap = $("sf-pages");
    var list = subjectItems(activeFolderSubject);
    wrap.innerHTML = "";
    if (!list.length) { wrap.innerHTML = '<div class="ba-sf-book-none">No pages yet. Create a notebook or sheet.</div>'; return; }
    list.forEach(function (it) {
      var row = document.createElement("div");
      row.className = "ba-sf-page";
      row.innerHTML = '<span class="ba-sf-page-icon">' + (it.type === "sheet" ? "📊" : "📄") + '</span><span class="ba-sf-page-name">' + esc(it.name) + '</span><span class="ba-sf-page-type">' + (it.type === "sheet" ? "Sheet" : "Notebook") + '</span>';
      row.addEventListener("click", function () {
        if (it.type === "sheet") openSheetEditor(it);
        else openNotebookEditor(it);
      });
      wrap.appendChild(row);
    });
  }
  function setupSubjectFolder() {
    $("sf-back").addEventListener("click", function () { $("subject-folder-modal").classList.remove("ba-modal-open"); });
    $("sf-new-notebook").addEventListener("click", function () {
      $("nb-subject").value = activeFolderSubject;
      $("new-notebook-modal").classList.add("ba-modal-open");
    });
    $("sf-new-sheet").addEventListener("click", function () {
      $("sheet-subject").value = activeFolderSubject;
      $("new-sheet-modal").classList.add("ba-modal-open");
    });
  }

  /* ---------- Create notebook ---------- */
  function setupNotebookModal() {
    var sel = $("nb-subject");
    SUBJECTS.forEach(function (s) { var o = document.createElement("option"); o.value = s.subject; o.textContent = s.subject; sel.appendChild(o); });
    sel.value = "Physics";
    $("nb-close").addEventListener("click", function () { $("new-notebook-modal").classList.remove("ba-modal-open"); });
    $("nb-cancel").addEventListener("click", function () { $("new-notebook-modal").classList.remove("ba-modal-open"); });
    $("new-notebook-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var it = {
        id: "nb-" + Date.now(), type: "notebook", name: $("nb-name").value || "Notebook",
        subject: $("nb-subject").value, paperType: $("nb-paper").value, direction: $("nb-direction").value,
        pages: [{ strokes: [] }], created: new Date().toISOString()
      };
      items.push(it); save(STORE_ITEMS, items);
      $("new-notebook-modal").classList.remove("ba-modal-open");
      this.reset();
      setupSchoolbag(); renderFolderPages();
      openNotebookEditor(it);
    });
  }

  /* ---------- Notebook editor (redesigned) ---------- */
  var activeNb = null, activePage = 0, nbUndo = [], nbRedo = [], nbDrawing = false, nbCur = null, nbTool = { type: "pen", color: "#2f5bff", size: 2.5 };
  function setupNotebookEditor() {
    $("nb-editor-back").addEventListener("click", closeNotebookEditor);
    var canvas = $("nb-canvas");
    window.addEventListener("resize", function () { if ($("notebook-editor-modal").classList.contains("ba-modal-open")) { resizeNb(); renderNbPage(); } });
    canvas.addEventListener("pointerdown", function (e) { nbDrawing = true; try { canvas.setPointerCapture(e.pointerId); } catch (x) {} var p = nbPos(e); nbCur = { tool: nbTool.type, color: nbTool.color, size: nbSize(nbTool.type), points: [p, p] }; nbUndo.push(nbCur); nbRedo = []; });
    canvas.addEventListener("pointermove", function (e) { if (!nbDrawing) return; if (nbTool.type === "square" || nbTool.type === "circle") nbCur.points[1] = nbPos(e); else nbCur.points.push(nbPos(e)); renderNbPage(); });
    canvas.addEventListener("pointerup", function () { if (nbDrawing) { nbDrawing = false; persistNb(); } });
    document.querySelectorAll("#notebook-editor-modal .ba-nb-tool").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var t = this.getAttribute("data-tool"), act = this.getAttribute("data-action");
        if (act === "undo") { if (nbUndo.length) { nbRedo.push(nbUndo.pop()); renderNbPage(); persistNb(); } return; }
        if (act === "redo") { if (nbRedo.length) { nbUndo.push(nbRedo.pop()); renderNbPage(); persistNb(); } return; }
        if (act === "add-page") { addNbPage(); return; }
        if (act === "pages") { toggleNbPages(); return; }
        if (act === "paper") { showNbPaperOptions(); return; }
        if (t) {
          nbTool = { type: t, color: this.querySelector(".ba-dot") ? this.querySelector(".ba-dot").style.background : (t === "highlighter" ? "#ffe58a" : t === "pencil" ? "#8a8a8a" : "#0f0f0f"), size: nbSize(t) };
          document.querySelectorAll("#notebook-editor-modal .ba-nb-tool").forEach(function (b) { b.classList.remove("active"); });
          this.classList.add("active");
          showNbToolOptions(t);
        }
      });
    });
  }
  function nbPos(e) { var r = $("nb-canvas").getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  function nbSize(t) { return t === "highlighter" ? 16 : t === "eraser" ? 26 : t === "pencil" ? 1.5 : (t === "square" || t === "circle") ? 3 : 2.5; }
  function showNbToolOptions(t) {
    var box = $("nb-tool-options");
    if (t === "eraser") { box.style.display = "none"; return; }
    var colors = ["#0f0f0f", "#2f5bff", "#ff6a5e", "#2fbf6f", "#ffc21c"];
    var html = '<span style="font-size:.7rem;font-weight:800;color:var(--silver)">Color</span>';
    colors.forEach(function (c) { html += '<span class="ba-nb-swatch' + (c === nbTool.color ? " active" : "") + '" data-c="' + c + '" style="background:' + c + '"></span>'; });
    html += '<span style="font-size:.7rem;font-weight:800;color:var(--silver);margin-left:.4rem">Size</span><input type="range" class="ba-nb-size" min="1" max="8" step="0.5" value="' + nbTool.size + '">';
    box.innerHTML = html; box.style.display = "flex";
    box.querySelectorAll(".ba-nb-swatch").forEach(function (sw) {
      sw.addEventListener("click", function () { nbTool.color = this.getAttribute("data-c"); box.querySelectorAll(".ba-nb-swatch").forEach(function (s) { s.classList.remove("active"); }); this.classList.add("active"); });
    });
    box.querySelector(".ba-nb-size").addEventListener("input", function () { nbTool.size = parseFloat(this.value); });
  }
  function openNotebookEditor(it) {
    activeNb = it; activePage = 0; nbUndo = []; nbRedo = [];
    $("nb-editor-title").textContent = it.name;
    $("notebook-editor-modal").classList.add("ba-modal-open");
    showNbCover(it);
    setTimeout(function () { resizeNb(); renderNbPage(); }, 50);
  }
  function showNbCover(it) {
    var page = $("nb-page");
    var old = $("nb-cover"); if (old) old.remove();
    var cover = document.createElement("div");
    cover.id = "nb-cover";
    cover.style.cssText = "position:absolute;inset:0;z-index:4;background:#fff;display:flex;align-items:center;justify-content:center;";
    cover.innerHTML = '<div style="width:70%;aspect-ratio:3/4;background:linear-gradient(160deg,#fff7e6,#ffe9bd);border:1px solid #e8d6a8;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.15);padding:1.4rem;display:flex;flex-direction:column;justify-content:center;text-align:center;gap:.4rem">' +
      '<div style="font-weight:800;font-size:1rem">' + esc(it.subject.toUpperCase()) + '</div>' +
      '<div style="font-weight:800;font-size:1.3rem;letter-spacing:.02em">' + esc(it.name.toUpperCase()) + '</div>' +
      '<div style="font-size:.8rem;font-weight:700">CLASS ' + esc((settings.class || "X") + "-" + (settings.section || "C")) + '</div>' +
      '<div style="font-size:.9rem;font-weight:800;margin-top:.4rem">' + esc(settings.userName || "Student") + '</div>' +
      '<div style="font-size:.66rem;color:#8a7a4a">' + esc(settings.school) + '</div>' +
      '<button class="ba-button ba-button-primary" id="nb-cover-open" style="margin-top:1rem">Open Notebook</button></div>';
    page.appendChild(cover);
    $("nb-cover-open").addEventListener("click", function () { cover.remove(); });
  }
  function closeNotebookEditor() { persistNb(); $("notebook-editor-modal").classList.remove("ba-modal-open"); }
  function persistNb() { if (!activeNb) return; var i = items.findIndex(function (x) { return x.id === activeNb.id; }); if (i >= 0) { items[i] = activeNb; save(STORE_ITEMS, items); } }
  function resizeNb() {
    var canvas = $("nb-canvas"), wrap = canvas.parentElement;
    var dpr = window.devicePixelRatio || 1;
    canvas.width = wrap.clientWidth * dpr; canvas.height = wrap.clientHeight * dpr;
    canvas.style.width = wrap.clientWidth + "px"; canvas.style.height = wrap.clientHeight + "px";
    canvas.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function renderNbPage() {
    if (!activeNb) return;
    var canvas = $("nb-canvas"), ctx = canvas.getContext("2d");
    var w = canvas.clientWidth, h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    drawPaper(ctx, activeNb.paperType, activeNb.direction, w, h);
    var page = activeNb.pages[activePage] || { strokes: [] };
    drawStrokes(ctx, page.strokes);
    $("nb-current-page").textContent = activePage + 1;
    $("nb-total-pages").textContent = activeNb.pages.length;
  }
  function addNbPage() { activeNb.pages.push({ strokes: [] }); activePage = activeNb.pages.length - 1; persistNb(); renderNbPage(); }
  function toggleNbPages() {
    var panel = $("nb-page-thumbnails");
    if (panel.style.display === "flex") { panel.style.display = "none"; return; }
    panel.innerHTML = "";
    activeNb.pages.forEach(function (pg, idx) {
      var th = document.createElement("div");
      th.className = "ba-nb-thumb" + (idx === activePage ? " active" : "");
      var c = document.createElement("canvas"); c.width = 84; c.height = 112;
      var cx = c.getContext("2d");
      drawPaper(cx, activeNb.paperType, activeNb.direction, 84, 112);
      drawStrokes(cx, pg.strokes);
      th.appendChild(c);
      th.addEventListener("click", function () { activePage = idx; panel.style.display = "none"; renderNbPage(); });
      panel.appendChild(th);
    });
    panel.style.display = "flex";
  }
  function showNbPaperOptions() {
    var box = $("nb-tool-options");
    if (!box || !activeNb) return;
    var opts = [
      ["ruled", "Ruled"], ["ruled-rtl", "Ruled RTL"], ["grid", "Grid"],
      ["graph-1cm", "Graph 1 cm"], ["graph-1in", "Graph 1 in"], ["blank", "Blank"]
    ];
    var html = '<span style="font-size:.7rem;font-weight:800;color:var(--silver);align-self:center">Paper</span>';
    opts.forEach(function (o) {
      html += '<button type="button" class="ba-nb-paper-opt' + (o[0] === activeNb.paperType ? " active" : "") + '" data-p="' + o[0] + '">' + o[1] + '</button>';
    });
    box.innerHTML = html; box.style.display = "flex";
    box.querySelectorAll(".ba-nb-paper-opt").forEach(function (b) {
      b.addEventListener("click", function () {
        activeNb.paperType = b.getAttribute("data-p");
        renderNbPage(); persistNb();
        box.querySelectorAll(".ba-nb-paper-opt").forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active");
      });
    });
  }
  function drawPaper(ctx, type, dir, w, h) {
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(60,110,200,.25)"; ctx.lineWidth = 1; var i;
    if (type === "ruled" || type === "ruled-rtl") {
      for (i = 40; i < h; i += 34) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }
      var mx = dir === "rtl" ? w - 34 : 34;
      ctx.strokeStyle = "rgba(255,90,90,.45)"; ctx.beginPath(); ctx.moveTo(mx, 0); ctx.lineTo(mx, h); ctx.stroke();
    } else if (type === "grid") {
      for (i = 0; i < w; i += 24) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
      for (i = 0; i < h; i += 24) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }
    } else if (type === "graph-1cm") {
      ctx.strokeStyle = "rgba(60,110,200,.18)";
      for (i = 0; i < w; i += 28) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
      for (i = 0; i < h; i += 28) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }
    } else if (type === "graph-1in") {
      ctx.strokeStyle = "rgba(60,110,200,.18)";
      for (i = 0; i < w; i += 56) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
      for (i = 0; i < h; i += 56) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }
    }
  }
  function drawStrokes(ctx, strokes) {
    if (!ctx || !strokes) return;
    strokes.forEach(function (s) {
      if (!s.points || !s.points.length) return;
      var p0 = s.points[0], p1 = s.points[s.points.length - 1];
      ctx.lineJoin = "round"; ctx.lineCap = "round";
      if (s.tool === "square" || s.tool === "circle") {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = s.color; ctx.lineWidth = s.size; ctx.globalAlpha = 1;
        ctx.beginPath();
        if (s.tool === "square") {
          var side = Math.min(Math.abs(p1.x - p0.x), Math.abs(p1.y - p0.y));
          var sx = p1.x >= p0.x ? p0.x : p0.x - side;
          var sy = p1.y >= p0.y ? p0.y : p0.y - side;
          ctx.rect(sx, sy, side, side);
        } else {
          var r = Math.min(Math.abs(p1.x - p0.x), Math.abs(p1.y - p0.y)) / 2;
          ctx.arc((p0.x + p1.x) / 2, (p0.y + p1.y) / 2, r, 0, Math.PI * 2);
        }
        ctx.stroke();
      } else if (s.tool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(0,0,0,1)"; ctx.lineWidth = s.size;
        ctx.beginPath(); ctx.moveTo(p0.x, p0.y);
        for (var i = 1; i < s.points.length; i++) ctx.lineTo(s.points[i].x, s.points[i].y);
        if (s.points.length === 1) ctx.lineTo(p0.x + 0.1, p0.y + 0.1);
        ctx.stroke();
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = s.color; ctx.lineWidth = s.size; ctx.globalAlpha = s.tool === "highlighter" ? 0.4 : 1;
        ctx.beginPath(); ctx.moveTo(p0.x, p0.y);
        for (var i = 1; i < s.points.length; i++) ctx.lineTo(s.points[i].x, s.points[i].y);
        if (s.points.length === 1) ctx.lineTo(p0.x + 0.1, p0.y + 0.1);
        ctx.stroke();
      }
    });
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
  }

  /* ---------- Sheet (spreadsheet) ---------- */
  function setupSheetModal() {
    var sel = $("sheet-subject");
    SUBJECTS.forEach(function (s) { var o = document.createElement("option"); o.value = s.subject; o.textContent = s.subject; sel.appendChild(o); });
    sel.value = "Physics";
    $("sheet-close").addEventListener("click", function () { $("new-sheet-modal").classList.remove("ba-modal-open"); });
    $("sheet-cancel").addEventListener("click", function () { $("new-sheet-modal").classList.remove("ba-modal-open"); });
    $("new-sheet-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var cols = 4, rows = 10;
      var data = []; for (var r = 0; r < rows; r++) { var row = []; for (var c = 0; c < cols; c++) row.push(""); data.push(row); }
      var it = { id: "sh-" + Date.now(), type: "sheet", name: $("sheet-name").value || "Sheet", subject: $("sheet-subject").value, sheet: { rows: rows, cols: cols, data: data, colWidths: [], rowHeights: new Array(rows).fill(38) }, created: new Date().toISOString() };
      items.push(it); save(STORE_ITEMS, items);
      $("new-sheet-modal").classList.remove("ba-modal-open"); this.reset();
      setupSchoolbag(); renderFolderPages(); openSheetEditor(it);
    });
  }
  var activeSheet = null;
  function setupSheetEditor() {
    $("sheet-editor-back").addEventListener("click", function () { persistSheet(); $("sheet-editor-modal").classList.remove("ba-modal-open"); });
    document.querySelectorAll("#sheet-editor-modal .ba-sheet-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var a = this.getAttribute("data-action");
        if (!activeSheet) return;
        if (a === "add-row") { activeSheet.sheet.rows++; activeSheet.sheet.data.push(new Array(activeSheet.sheet.cols).fill("")); activeSheet.sheet.rowHeights.push(38); }
        else if (a === "del-row") { if (activeSheet.sheet.rows > 1) { activeSheet.sheet.rows--; activeSheet.sheet.data.pop(); activeSheet.sheet.rowHeights.pop(); } }
        else if (a === "add-col") { activeSheet.sheet.cols++; activeSheet.sheet.data.forEach(function (r) { r.push(""); }); }
        else if (a === "del-col") { if (activeSheet.sheet.cols > 1) { activeSheet.sheet.cols--; activeSheet.sheet.data.forEach(function (r) { r.pop(); }); } }
        renderSheet(); persistSheet();
      });
    });
    document.querySelectorAll("#sheet-editor-modal [data-format]").forEach(function (btn) {
      btn.addEventListener("mousedown", function (e) { e.preventDefault(); });
      btn.addEventListener("click", function () { document.execCommand(this.getAttribute("data-format")); syncActiveCell(); });
    });
    document.querySelectorAll("#sheet-editor-modal .ba-nb-swatch").forEach(function (sw) {
      sw.addEventListener("mousedown", function (e) { e.preventDefault(); });
      sw.addEventListener("click", function () { document.execCommand("foreColor", false, this.getAttribute("data-color")); syncActiveCell(); });
    });
  }
  function colLetter(n) { var s = ""; n++; while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; }
  function cellRefToRC(ref) {
    var m = ref.match(/^([A-Z]+)(\d+)$/); if (!m) return null;
    var col = 0; for (var i = 0; i < m[1].length; i++) col = col * 26 + (m[1].charCodeAt(i) - 64);
    return { r: parseInt(m[2], 10) - 1, c: col - 1 };
  }
  function evalFormula(raw, sheet) {
    var expr = raw.slice(1).toUpperCase();
    expr = expr.replace(/SUM\(([A-Z]+\d+):([A-Z]+\d+)\)/g, function (_, a, b) {
      var ra = cellRefToRC(a), rb = cellRefToRC(b); if (!ra || !rb) return "0";
      var sum = 0;
      for (var r = Math.min(ra.r, rb.r); r <= Math.max(ra.r, rb.r); r++)
        for (var c = Math.min(ra.c, rb.c); c <= Math.max(ra.c, rb.c); c++)
          sum += parseFloat(sheet.data[r][c]) || 0;
      return sum;
    });
    expr = expr.replace(/[A-Z]+\d+/g, function (ref) { var rc = cellRefToRC(ref); return rc ? (parseFloat(sheet.data[rc.r][rc.c]) || 0) : "0"; });
    try { var v = Function('"use strict";return (' + expr + ')')(); return (isNaN(v) ? raw : String(v)); } catch (e) { return raw; }
  }
  function renderSheet() {
    var table = $("sheet-grid"); var sh = activeSheet.sheet;
    table.innerHTML = "";
    var thead = document.createElement("tr");
    var corner = document.createElement("th"); corner.className = "ba-sheet-rowhead"; thead.appendChild(corner);
    for (var c = 0; c < sh.cols; c++) {
      var th = document.createElement("th"); th.className = "ba-sheet-colhead"; th.textContent = colLetter(c);
      var w = sh.colWidths[c] || 80; th.style.width = w + "px";
      var rs = document.createElement("span"); rs.className = "ba-sheet-resizer";
      rs.addEventListener("pointerdown", startResize(c));
      th.appendChild(rs); thead.appendChild(th);
    }
    table.appendChild(thead);
    for (var r = 0; r < sh.rows; r++) {
      var tr = document.createElement("tr");
      tr.style.height = (sh.rowHeights[r] || 38) + "px";
      var rh = document.createElement("th"); rh.className = "ba-sheet-rowhead"; rh.textContent = r + 1;
      var rr = document.createElement("span"); rr.className = "ba-sheet-resizer-row"; rr.setAttribute("data-row", r);
      rr.addEventListener("pointerdown", startRowResize(r));
      rh.appendChild(rr); tr.appendChild(rh);
      for (var c2 = 0; c2 < sh.cols; c2++) {
        var td = document.createElement("td"); td.className = "ba-sheet-cell"; td.contentEditable = "true";
        td.style.width = (sh.colWidths[c2] || 80) + "px";
        var raw = sh.data[r][c2];
        var txt = raw ? String(raw).replace(/<[^>]*>/g, "").trim() : "";
        td.innerHTML = raw || "";
        if (txt.charAt(0) === "=") td.innerHTML = evalFormula(txt, sh);
        td.addEventListener("blur", function () { var r3 = +this.getAttribute("data-r"), c3 = +this.getAttribute("data-c"); sh.data[r3][c3] = this.innerHTML; persistSheet(); });
        td.setAttribute("data-r", r); td.setAttribute("data-c", c2);
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
  }
  function startResize(c) {
    return function (e) {
      e.preventDefault(); var startX = e.clientX; var startW = activeSheet.sheet.colWidths[c] || 80;
      function move(ev) { activeSheet.sheet.colWidths[c] = Math.max(40, startW + ev.clientX - startX); renderSheet(); }
      function up() { document.removeEventListener("pointermove", move); document.removeEventListener("pointerup", up); persistSheet(); }
      document.addEventListener("pointermove", move); document.addEventListener("pointerup", up);
    };
  }
  function startRowResize(r) {
    return function (e) {
      e.preventDefault(); var startY = e.clientY; var startH = activeSheet.sheet.rowHeights[r] || 38;
      function move(ev) { activeSheet.sheet.rowHeights[r] = Math.max(24, startH + ev.clientY - startY); renderSheet(); }
      function up() { document.removeEventListener("pointermove", move); document.removeEventListener("pointerup", up); persistSheet(); }
      document.addEventListener("pointermove", move); document.addEventListener("pointerup", up);
    };
  }
  function syncActiveCell() {
    var cell = document.activeElement;
    if (cell && cell.classList && cell.classList.contains("ba-sheet-cell")) {
      activeSheet.sheet.data[+cell.getAttribute("data-r")][+cell.getAttribute("data-c")] = cell.innerHTML;
      persistSheet();
    }
  }
  function persistSheet() { if (!activeSheet) return; var i = items.findIndex(function (x) { return x.id === activeSheet.id; }); if (i >= 0) { items[i] = activeSheet; save(STORE_ITEMS, items); } }
  function openSheetEditor(it) {
    activeSheet = it;
    if (!it.sheet.rowHeights || it.sheet.rowHeights.length !== it.sheet.rows) it.sheet.rowHeights = new Array(it.sheet.rows).fill(38);
    $("sheet-editor-title").textContent = it.name;
    $("sheet-editor-modal").classList.add("ba-modal-open");
    renderSheet();
  }

  /* ---------- Homework diary ---------- */
  function setupHomework() {
    $("hw-close").addEventListener("click", function () { $("homework-modal").classList.remove("ba-modal-open"); });
    $("hw-form").addEventListener("submit", function (e) {
      e.preventDefault();
      homework.push({ id: "hw-" + Date.now(), subject: $("hw-subject").value, task: $("hw-task").value, due: $("hw-due").value, done: false });
      save(STORE_HW, homework); this.reset(); renderHomework(); renderHome();
    });
  }
  function openHomeworkModal() { $("homework-modal").classList.add("ba-modal-open"); renderHomework(); }
  function renderHomework() {
    var wrap = $("hw-list"); wrap.innerHTML = "";
    var done = homework.filter(function (h) { return h.done; });
    var today = homework.filter(function (h) { return !h.done && (!h.due || /today/i.test(h.due)); });
    var tom = homework.filter(function (h) { return !h.done && /tomorrow/i.test(h.due); });
    var up = homework.filter(function (h) { return !h.done && h.due && !/today|tomorrow/i.test(h.due); });
    renderHwGroup(wrap, "TODAY", today);
    renderHwGroup(wrap, "TOMORROW", tom);
    renderHwGroup(wrap, "UPCOMING", up);
    renderHwGroup(wrap, "COMPLETED", done);
  }
  function renderHwGroup(wrap, title, list) {
    if (!list.length) return;
    var g = document.createElement("div");
    g.innerHTML = '<div class="ba-hw-group-title">' + title + '</div>';
    list.forEach(function (h) {
      var row = document.createElement("div");
      row.className = "ba-hw-item" + (h.done ? " done" : "");
      row.innerHTML = '<input type="checkbox" class="ba-hw-check"' + (h.done ? " checked" : "") + '><div><div class="ba-hw-subject">' + esc(h.subject) + '</div><div class="ba-hw-task">' + esc(h.task) + '</div>' + (h.due ? '<div class="ba-hw-due">Due: ' + esc(h.due) + '</div>' : '') + '</div>';
      row.querySelector(".ba-hw-check").addEventListener("change", function () { h.done = this.checked; save(STORE_HW, homework); renderHomework(); renderHome(); });
      g.appendChild(row);
    });
    wrap.appendChild(g);
  }

  /* ---------- Schedule ---------- */
  function setupSchedule() {
    $("sch-timetable-btn").addEventListener("click", function () { switchSch("timetable"); });
    $("sch-exams-btn").addEventListener("click", function () { switchSch("exams"); });
    document.querySelectorAll("#schedule-timetable .ba-timetable-day").forEach(function (day) {
      day.addEventListener("click", function () {
        document.querySelectorAll("#schedule-timetable .ba-timetable-day").forEach(function (d) { d.classList.remove("ba-timetable-day-active"); d.setAttribute("aria-selected", "false"); });
        day.classList.add("ba-timetable-day-active"); day.setAttribute("aria-selected", "true");
        renderTimetableDay(day.getAttribute("data-day"));
      });
    });
    renderTimetableDay("mon");
  }
  function switchSch(which) {
    $("sch-timetable-btn").classList.toggle("ba-sch-tab-active", which === "timetable");
    $("sch-exams-btn").classList.toggle("ba-sch-tab-active", which === "exams");
    $("schedule-timetable").style.display = which === "timetable" ? "block" : "none";
    $("schedule-exams").style.display = which === "exams" ? "block" : "none";
  }
  function renderTimetableDay(dayKey) {
    var el = $("ba-timetable-content"); if (!el) return;
    var periods = TIMETABLE[dayKey];
    var isToday = dayKey === currentDayKey();
    var html = '<div class="ba-timetable-day-header" style="display:flex;justify-content:space-between;margin:.2rem 0 .8rem"><div>' + dayKey.toUpperCase() + '</div><div style="color:var(--blue);font-weight:800;font-size:.7rem">' + (isToday ? "Today" : "") + '</div></div>';
    periods.forEach(function (p) {
      if (p.type === "break") html += '<div class="ba-period-item ba-period-break"><div class="ba-period-time">' + p.time + " - " + p.end + '</div><div class="ba-period-break-subject">BREAK</div></div>';
      else html += '<div class="ba-period-item ' + (isToday ? "ba-period-current" : "") + '"><div class="ba-period-time">' + p.time + " - " + p.end + '</div><div class="ba-period-subject">' + esc(p.subject) + '</div><div class="ba-period-teacher">' + esc(p.teacher) + '</div></div>';
    });
    el.innerHTML = html;
  }
  function openScheduleExams() {
    navigate("schedule");
    switchSch("exams");
    var sec = $("schedule-exams");
    if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- Settings ---------- */
  function setupSettings() {
    $("setting-name").value = settings.userName || "";
    $("setting-school").value = settings.school || "Bahria College Karsaz";
    $("setting-class").value = settings.class || "X";
    $("setting-section").value = settings.section || "C";
    $("setting-direction").value = settings.direction || "ltr";
    $("setting-paper").value = settings.paper || "ruled";
    $("setting-theme").value = settings.theme || "system";
    function bind(id, key, after) {
      $(id).addEventListener("change", function () { settings[key] = this.value; save(STORE_SETTINGS, settings); if (after) after(); });
      $(id).addEventListener("input", function () { settings[key] = this.value; save(STORE_SETTINGS, settings); if (after) after(); });
    }
    bind("setting-name", "userName");
    bind("setting-school", "school", applyHeader);
    bind("setting-class", "class", applyHeader);
    bind("setting-section", "section", applyHeader);
    bind("setting-direction", "direction");
    bind("setting-paper", "paper");
    bind("setting-theme", "theme", applyTheme);
  }

  /* ---------- PDF Reader ---------- */
  var pdf = { book: null, page: 1, zoom: 100, annotating: false };
  function setupPdfReader() {
    $("pdf-close").addEventListener("click", closePdf);
    $("pdf-prev").addEventListener("click", function () { gotoPdf(pdf.page - 1); });
    $("pdf-next").addEventListener("click", function () { gotoPdf(pdf.page + 1); });
    $("pdf-page-input").addEventListener("change", function () { gotoPdf(parseInt(this.value, 10) || 1); });
    $("pdf-zoom-in").addEventListener("click", function () { setZoom(pdf.zoom + 25); });
    $("pdf-zoom-out").addEventListener("click", function () { setZoom(pdf.zoom - 25); });
    $("pdf-search").addEventListener("click", function () { alert("Use your browser's find (Ctrl/Cmd + F) inside the PDF viewer to search."); });
    $("pdf-bookmark").addEventListener("click", function () { if (!pdf.book) return; var bm = load("ba_bookmarks_v1", {}); bm[pdf.book.subject] = pdf.page; save("ba_bookmarks_v1", bm); $("pdf-bookmark").textContent = "🔖✓"; setTimeout(function () { $("pdf-bookmark").textContent = "🔖"; }, 1200); });
    $("pdf-annotate").addEventListener("click", togglePdfAnnotate);
    setupAnnotate("pdf-annotation-toolbar",
      function (key) { var rec = load(STORE_PDF, {})[key || annKey()]; return rec && rec.strokes ? rec.strokes : []; },
      function (s, key) { var k = key || annKey(); var all = load(STORE_PDF, {}); var rec = all[k] || {}; rec.zoom = pdf.zoom; rec.strokes = s || []; all[k] = rec; save(STORE_PDF, all); });
  }
  function annKey() { return pdf.book ? pdf.book.subject + ":" + pdf.page + ":" + (pdf.zoom || 100) : null; }
  function openPdf(book) { pdf.book = book; pdf.page = 1; pdf.zoom = 100; pdf.annotating = false; $("pdf-title").textContent = book.subject; $("pdf-annotation-toolbar").style.display = "none"; gotoPdf(1); $("pdf-reader-modal").classList.add("ba-modal-open"); }
  function closePdf() { if (window.__ba_saveAnnotNow) window.__ba_saveAnnotNow(); $("pdf-reader-modal").classList.remove("ba-modal-open"); $("pdf-iframe").src = "about:blank"; }
  function gotoPdf(n, oldZoom) { if (!pdf.book) return; var savedZoom = (oldZoom != null) ? oldZoom : pdf.zoom; var oldKey = pdf.book.subject + ":" + pdf.page + ":" + savedZoom; if (pdf.annotating && window.__ba_saveAnnotNow) window.__ba_saveAnnotNow(oldKey); n = Math.max(1, n); var newKey = pdf.book.subject + ":" + n + ":" + pdf.zoom; pdf.page = n; $("pdf-iframe").src = encodeURI(pdf.book.file) + "#page=" + n + "&zoom=" + pdf.zoom; $("pdf-current-page").textContent = n; $("pdf-page-input").value = n; if (pdf.annotating && window.__ba_reseedAnnot) window.__ba_reseedAnnot(newKey); }
  function setZoom(z) { z = Math.max(50, Math.min(300, z)); var oldZ = pdf.zoom; pdf.zoom = z; $("pdf-zoom-level").textContent = z + "%"; gotoPdf(pdf.page, oldZ); }
  function togglePdfAnnotate() {
    pdf.annotating = !pdf.annotating;
    $("pdf-annotation-toolbar").style.display = pdf.annotating ? "block" : "none";
    var ov = $("pdf-annot-overlay");
    if (pdf.annotating) {
      if (!ov) { ov = document.createElement("canvas"); ov.id = "pdf-annot-overlay"; ov.style.cssText = "position:absolute;inset:0;width:100%;height:100%;z-index:5;touch-action:none;"; $("pdf-viewer").appendChild(ov); }
      ov.style.display = "block";
      var wrap = $("pdf-viewer"), dpr = window.devicePixelRatio || 1;
      ov.width = wrap.clientWidth * dpr; ov.height = wrap.clientHeight * dpr; ov.style.width = wrap.clientWidth + "px"; ov.style.height = wrap.clientHeight + "px";
      if (window.__ba_bindAnnot) window.__ba_bindAnnot(ov, dpr); else renderPdfAnnot();
    } else if (ov) { ov.style.display = "none"; if (window.__ba_saveAnnotNow) window.__ba_saveAnnotNow(); }
  }
  function renderPdfAnnot() {
    var ov = $("pdf-annot-overlay"); if (!ov || !pdf.annotating) return;
    var wrap = $("pdf-viewer"), dpr = window.devicePixelRatio || 1;
    ov.width = wrap.clientWidth * dpr; ov.height = wrap.clientHeight * dpr; ov.style.width = wrap.clientWidth + "px"; ov.style.height = wrap.clientHeight + "px";
    var ctx = ov.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, ov.width, ov.height);
    var rec = load(STORE_PDF, {})[annKey()];
    drawStrokes(ctx, rec && rec.strokes ? rec.strokes : []);
  }
  function setupAnnotate(toolbarId, loadFn, saveFn) {
    var toolbar = $(toolbarId); if (!toolbar) return;
    var canvas, ctx, drawing = false, cur = null, undo = [], redo = [], tool = { type: "pen", color: "#2f5bff", size: 2.5 };
    function cw() { return (canvas && canvas.clientWidth) || (canvas && canvas.width) || 1; }
    function ch() { return (canvas && canvas.clientHeight) || (canvas && canvas.height) || 1; }
    function norm(list) { var w = cw(), h = ch(); return (list || []).map(function (s) { return { tool: s.tool, color: s.color, size: s.size, points: (s.points || []).map(function (p) { return { x: p.x / w, y: p.y / h }; }) }; }); }
    function denorm(list) { var w = cw(), h = ch(); return (list || []).map(function (s) { return { tool: s.tool, color: s.color, size: s.size, points: (s.points || []).map(function (p) { return { x: p.x * w, y: p.y * h }; }) }; }); }
    function bind(target, dpr) { canvas = target; ctx = canvas.getContext("2d"); if (dpr) ctx.setTransform(dpr, 0, 0, dpr, 0, 0); undo = denorm(loadFn()); redo = []; target.addEventListener("pointerdown", start); target.addEventListener("pointermove", move); window.addEventListener("pointerup", end); redraw(); }
    function start(e) { drawing = true; try { canvas.setPointerCapture(e.pointerId); } catch (x) {} var p = pos(e); cur = { tool: tool.type, color: tool.color, size: sz(tool.type), points: [p, p] }; undo.push(cur); redo = []; }
    function move(e) { if (!drawing) return; if (tool.type === "square" || tool.type === "circle") cur.points[1] = pos(e); else cur.points.push(pos(e)); redraw(); }
    function end() { if (!drawing) return; drawing = false; if (saveFn) saveFn(norm(undo)); }
    function pos(e) { var r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    function sz(t) { return t === "highlighter" ? 16 : t === "eraser" ? 22 : t === "pencil" ? 1.5 : (t === "square" || t === "circle") ? 3 : 2.5; }
    function redraw() { if (!ctx) return; ctx.clearRect(0, 0, canvas.clientWidth || canvas.width, canvas.clientHeight || canvas.height); drawStrokes(ctx, undo); }
    toolbar.querySelectorAll(".ba-annotate-tool").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var t = this.getAttribute("data-tool"), act = this.getAttribute("data-action");
        if (act === "undo") { if (undo.length) { redo.push(undo.pop()); redraw(); if (saveFn) saveFn(norm(undo)); } return; }
        if (act === "redo") { if (redo.length) { undo.push(redo.pop()); redraw(); if (saveFn) saveFn(norm(undo)); } return; }
        if (act === "save") { if (saveFn) saveFn(norm(undo)); return; }
        if (t) { tool = { type: t, color: this.getAttribute("data-color") || "#0f0f0f", size: sz(t) }; toolbar.querySelectorAll(".ba-annotate-tool").forEach(function (b) { b.classList.remove("active"); }); this.classList.add("active"); }
      });
    });
    window.__ba_bindAnnot = bind;
    window.__ba_reseedAnnot = function (key) { if (canvas) { undo = denorm(loadFn(key)); redo = []; redraw(); } };
    window.__ba_saveAnnotNow = function (key) { if (saveFn && canvas) saveFn(norm(undo), key); };
  }

  /* ---------- Formula Book ---------- */
  var MATH_FORMULAS = [
    {name:"Area of rectangle", expr:"A = l × w"},
    {name:"Area of triangle", expr:"A = ½ × b × h"},
    {name:"Area of circle", expr:"A = π × r²"},
    {name:"Perimeter of rectangle", expr:"P = 2(l + w)"},
    {name:"Pythagorean theorem", expr:"a² + b² = c²"},
    {name:"Simple interest", expr:"SI = P × R × T / 100"},
    {name:"Percentage", expr:"P = (Value / Total) × 100"},
    {name:"Distance, Speed, Time", expr:"D = S × T"},
    {name:"Average", expr:"Avg = Sum / Count"},
    {name:"Quadratic formula", expr:"x = (-b ± √(b²-4ac)) / 2a"}
  ];
  var PHYSICS_FORMULAS = [
    {name:"Speed", expr:"v = d / t"},
    {name:"Acceleration", expr:"a = Δv / t"},
    {name:"Force", expr:"F = m × a"},
    {name:"Weight", expr:"W = m × g"},
    {name:"Work", expr:"W = F × d"},
    {name:"Power", expr:"P = W / t"},
    {name:"Kinetic Energy", expr:"KE = ½ × m × v²"},
    {name:"Potential Energy", expr:"PE = m × g × h"},
    {name:"Density", expr:"ρ = m / V"},
    {name:"Electrical Power", expr:"P = V × I"}
  ];
  var STORE_FORMULAS = "ba_formulas_v1";
  var userFormulas = load(STORE_FORMULAS, []);
  
  function setupFormulaBook() {
    $("formula-back").addEventListener("click", function () { $("formula-modal").classList.remove("ba-modal-open"); });
    document.querySelectorAll(".ba-formula-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        document.querySelectorAll(".ba-formula-tab").forEach(function (t) { t.classList.remove("ba-formula-tab-active"); });
        this.classList.add("ba-formula-tab-active");
        renderFormulaContent(this.getAttribute("data-subject"));
      });
    });
  }
  function renderFormulaContent(subject) {
    var wrap = $("formula-content");
    var html = "";
    var formulas = subject === "math" ? MATH_FORMULAS : (subject === "physics" ? PHYSICS_FORMULAS : userFormulas);
    
    formulas.forEach(function (f, i) {
      html += '<div class="ba-formula-card">' +
        '<div class="ba-formula-num">' + String(i + 1).padStart(2, "0") + '</div>' +
        '<div class="ba-formula-name">' + esc(f.name) + '</div>' +
        '<div class="ba-formula-expr">' + esc(f.expr) + '</div>' +
        '</div>';
    });
    
    if (subject === "my") {
      html += '<div class="ba-formula-add-section">' +
        '<div class="ba-section-title">MY FORMULAS</div>' +
        '<div class="ba-form-group"><label>Name</label><input id="my-form-name" placeholder="e.g. Work-Energy"></div>' +
        '<div class="ba-form-group"><label>Formula</label><input id="my-form-expr" placeholder="e.g. W = F × d"></div>' +
        '<div class="ba-form-group"><label>Notes</label><input id="my-form-notes" placeholder="Optional"></div>' +
        '<button class="ba-button ba-button-primary" id="my-form-save">Save Formula</button>' +
        '</div>';
    }
    wrap.innerHTML = html;
    
    if (subject === "my") {
      $("my-form-save").addEventListener("click", function () {
        var name = $("my-form-name").value.trim();
        var expr = $("my-form-expr").value.trim();
        if (!name || !expr) return;
        userFormulas.push({ name: name, expr: expr });
        save(STORE_FORMULAS, userFormulas);
        renderFormulaContent("my");
      });
    }
  }

  /* ---------- Tools Menu ---------- */
  function setupToolsMenu() {
    var toolsBtn = $("schoolbag-tools-open");
    if (toolsBtn) toolsBtn.addEventListener("click", function () { $("tools-menu-modal").classList.add("ba-modal-open"); });
    $("tools-back").addEventListener("click", function () { $("tools-menu-modal").classList.remove("ba-modal-open"); });
    
    var openTool = function (id) {
      $("tools-menu-modal").classList.remove("ba-modal-open");
      setTimeout(function () { $(id).classList.add("ba-modal-open"); }, 100);
    };
    
    $("tool-calculator").addEventListener("click", function () { openTool("calculator-modal"); });
    $("tool-focus").addEventListener("click", function () { openTool("focus-modal"); });
    $("tool-clock").addEventListener("click", function () { openTool("clock-modal"); });
    $("tool-sticky").addEventListener("click", function () { openTool("sticky-modal"); renderStickyNotes(); });
    $("tool-formulas").addEventListener("click", function () { openTool("formula-modal"); renderFormulaContent("math"); });
  }

  /* ---------- Calculator ---------- */
  var calcExpr = "";
  function setupCalculator() {
    // Tabs
    $("calc-tab-basic").addEventListener("click", function () { showCalcTab("basic"); });
    $("calc-tab-sci").addEventListener("click", function () { showCalcTab("sci"); });
    $("calc-tab-conv").addEventListener("click", function () { showCalcTab("conv"); });
    
    // Basic buttons
    document.querySelectorAll("#calc-view-basic .ba-calc-btn").forEach(function (btn) {
      btn.addEventListener("click", function () { handleCalcBtn(this.textContent, "calc-display"); });
    });
    
    // Scientific buttons
    document.querySelectorAll("#calc-view-sci .ba-calc-btn").forEach(function (btn) {
      btn.addEventListener("click", function () { handleCalcBtn(this.textContent, "calc-sci-display"); });
    });
    
    // Unit converter
    $("conv-category").addEventListener("change", updateConvUnits);
    updateConvUnits();
    $("conv-from-val").addEventListener("input", updateConvResult);
    $("conv-from-unit").addEventListener("change", updateConvResult);
    $("conv-to-unit").addEventListener("change", updateConvResult);
  }
  function showCalcTab(tab) {
    $("calc-view-basic").style.display = tab === "basic" ? "flex" : "none";
    $("calc-view-sci").style.display = tab === "sci" ? "flex" : "none";
    $("calc-view-conv").style.display = tab === "conv" ? "flex" : "none";
    document.querySelectorAll(".ba-calc-tab").forEach(function (t) { t.classList.remove("ba-calc-tab-active"); });
    $("calc-tab-" + tab).classList.add("ba-calc-tab-active");
  }
  function handleCalcBtn(val, displayId) {
    var dispEl = $(displayId);
    if (val === "C") { calcExpr = ""; dispEl.textContent = "0"; return; }
    if (val === "=") {
      try {
        var expr = calcExpr.replace(/÷/g, "/").replace(/×/g, "*").replace(/−/g, "-");
        var result = Function("'use strict'; return (" + expr + ")")();
        dispEl.textContent = result;
        calcExpr = String(result);
      } catch (e) { dispEl.textContent = "Error"; calcExpr = ""; }
      return;
    }
    if (val === "π") val = "Math.PI";
    if (val === "√") val = "Math.sqrt(";
    if (val === "x²") val = "**2";
    if (val === "sin") val = "Math.sin(";
    if (val === "cos") val = "Math.cos(";
    if (val === "tan") val = "Math.tan(";
    if (val === "log") val = "Math.log10(";
    if (val === "ln") val = "Math.log(";
    calcExpr += val;
    dispEl.textContent = calcExpr;
  }
  var CONV_DATA = {
    length: [{u:"m",f:1},{u:"cm",f:100},{u:"mm",f:1000},{u:"km",f:0.001},{u:"in",f:39.3701},{u:"ft",f:3.28084}],
    mass: [{u:"kg",f:1},{u:"g",f:1000},{u:"mg",f:1000000},{u:"lb",f:2.20462},{u:"oz",f:35.274}],
    time: [{u:"s",f:1},{u:"min",f:1/60},{u:"hr",f:1/3600},{u:"day",f:1/86400}],
    temp: [{u:"C"},{u:"F"},{u:"K"}]
  };
  function updateConvUnits() {
    var cat = $("conv-category").value;
    var units = CONV_DATA[cat];
    var fromSel = $("conv-from-unit"), toSel = $("conv-to-unit");
    fromSel.innerHTML = ""; toSel.innerHTML = "";
    units.forEach(function (item) {
      fromSel.innerHTML += '<option value="' + item.u + '">' + item.u + '</option>';
      toSel.innerHTML += '<option value="' + item.u + '">' + item.u + '</option>';
    });
    if (units.length > 1) toSel.selectedIndex = 1;
    updateConvResult();
  }
  function updateConvResult() {
    var cat = $("conv-category").value;
    var val = parseFloat($("conv-from-val").value) || 0;
    var from = $("conv-from-unit").value;
    var to = $("conv-to-unit").value;
    var result = 0;
    
    if (cat === "temp") {
      if (from === "C" && to === "F") result = val * 9/5 + 32;
      else if (from === "C" && to === "K") result = val + 273.15;
      else if (from === "F" && to === "C") result = (val - 32) * 5/9;
      else if (from === "F" && to === "K") result = (val - 32) * 5/9 + 273.15;
      else if (from === "K" && to === "C") result = val - 273.15;
      else if (from === "K" && to === "F") result = (val - 273.15) * 9/5 + 32;
      else result = val;
    } else {
      var units = CONV_DATA[cat];
      var fromF = units.find(function (x) { return x.u === from; }).f;
      var toF = units.find(function (x) { return x.u === to; }).f;
      result = val * fromF / toF;
    }
    $("conv-to-val").value = parseFloat(result.toFixed(4));
  }

  /* ---------- Focus Time (Persistent) ---------- */
  var focusTimer = null;
  var focusRemaining = 0;
  function setupFocusTime() {
    $("focus-back").addEventListener("click", function () { $("focus-modal").classList.remove("ba-modal-open"); });
    $("focus-bar-end").addEventListener("click", function () { stopFocusTimer(); });
    $("focus-restart").addEventListener("click", function () {
      $("focus-ended").style.display = "none";
      $("focus-setup").style.display = "block";
    });
    
    document.querySelectorAll(".ba-focus-dur").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".ba-focus-dur").forEach(function (b) { b.classList.remove("active"); });
        this.classList.add("active");
      });
    });
    
    $("focus-start").addEventListener("click", function () {
      var activeBtn = document.querySelector(".ba-focus-dur.active");
      var mins = parseInt(activeBtn.getAttribute("data-min"), 10);
      focusRemaining = mins * 60;
      $("focus-modal").classList.remove("ba-modal-open");
      $("focus-bar").style.display = "flex";
      startFocusTimer();
    });
    
    document.addEventListener("visibilitychange", function () {
      if (focusTimer && document.hidden) {
        // User left the app
        clearInterval(focusTimer);
        focusTimer = "paused";
      } else if (focusTimer === "paused") {
        // User returned to the app
        stopFocusTimer();
      }
    });
  }
  function startFocusTimer() {
    if (focusTimer) clearInterval(focusTimer);
    updateFocusDisplay();
    focusTimer = setInterval(function () {
      if (focusRemaining <= 0) { stopFocusTimer(); return; }
      focusRemaining--;
      updateFocusDisplay();
    }, 1000);
  }
  function stopFocusTimer() {
    if (focusTimer) clearInterval(focusTimer);
    focusTimer = null;
    $("focus-bar").style.display = "none";
    $("focus-setup").style.display = "block";
    $("focus-ended").style.display = "block";
  }
  function updateFocusDisplay() {
    var m = Math.floor(focusRemaining / 60);
    var s = focusRemaining % 60;
    var str = String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
    $("focus-bar-time").textContent = str;
  }

  /* ---------- School Clock ---------- */
  var clockInterval = null;
  function setupSchoolClock() {
    $("clock-back").addEventListener("click", function () { $("clock-modal").classList.remove("ba-modal-open"); if (clockInterval) clearInterval(clockInterval); });
    var startClock = function () {
      if (clockInterval) clearInterval(clockInterval);
      renderClock();
      clockInterval = setInterval(renderClock, 1000);
    };
    startClock();
  }
  function renderClock() {
    var now = new Date();
    $("clock-time").textContent = now.toLocaleTimeString();
    var dayKey = currentDayKey();
    var periods = dayKey ? TIMETABLE[dayKey] : [];
    var mins = now.getHours() * 60 + now.getMinutes();
    var at = periodAt(periods, mins);
    
    if (at && at.cur.type !== "break") {
      $("clock-subject").textContent = at.cur.subject;
      var endMins = at.cur.end.split(":").map(Number);
      var remain = (endMins[0] * 60 + endMins[1]) - (now.getHours() * 60 + now.getMinutes());
      $("clock-period-info").textContent = "Ends in " + remain + " minutes";
    } else {
      // Find next period
      var nextPeriod = null;
      for (var i = 0; i < periods.length; i++) {
        var pStart = periods[i].time.split(":").map(Number);
        var pMins = pStart[0] * 60 + pStart[1];
        if (pMins > mins && periods[i].type !== "break") { nextPeriod = periods[i]; break; }
      }
      
      if (nextPeriod) {
        $("clock-subject").textContent = "Next: " + nextPeriod.subject;
        $("clock-period-info").textContent = "Starts at " + nextPeriod.time;
      } else {
        $("clock-subject").textContent = "No more classes today";
        $("clock-period-info").textContent = "";
      }
    }
  }

  /* ---------- Sticky Notes ---------- */
  var STORE_STICKY = "ba_sticky_v1";
  var stickies = load(STORE_STICKY, []);
  var editingStickyId = null;
  function setupStickyNotes() {
    $("sticky-back").addEventListener("click", function () { $("sticky-modal").classList.remove("ba-modal-open"); });
    $("sticky-add").addEventListener("click", function () {
      editingStickyId = null;
      $("sticky-text").value = "";
      $("sticky-label").value = "";
      $("sticky-grid").style.display = "none";
      $("sticky-editor").style.display = "block";
    });
    $("sticky-cancel").addEventListener("click", function () {
      $("sticky-grid").style.display = "grid";
      $("sticky-editor").style.display = "none";
    });
    $("sticky-save").addEventListener("click", function () {
      var text = $("sticky-text").value.trim();
      if (!text) return;
      var label = $("sticky-label").value.trim();
      if (editingStickyId) {
        var idx = stickies.findIndex(function (n) { return n.id === editingStickyId; });
        if (idx >= 0) { stickies[idx].text = text; stickies[idx].label = label; }
      } else {
        stickies.push({ id: "st-" + Date.now(), text: text, label: label, created: new Date().toISOString() });
      }
      save(STORE_STICKY, stickies);
      $("sticky-grid").style.display = "grid";
      $("sticky-editor").style.display = "none";
      renderStickyNotes();
    });
  }
  function renderStickyNotes() {
    var grid = $("sticky-grid");
    grid.innerHTML = "";
    stickies.forEach(function (n) {
      var card = document.createElement("div");
      card.className = "ba-sticky-note";
      card.innerHTML = (n.label ? '<div class="ba-sticky-note-label">' + esc(n.label) + '</div>' : '') + '<div class="ba-sticky-note-content">' + esc(n.text) + '</div>';
      card.addEventListener("click", function () {
        editingStickyId = n.id;
        $("sticky-text").value = n.text;
        $("sticky-label").value = n.label || "";
        $("sticky-grid").style.display = "none";
        $("sticky-editor").style.display = "block";
      });
      grid.appendChild(card);
    });
  }

  /* ---------- GAMES ---------- */
  var gameConfigs = {};

  function setupGames() {
    var games = ['snake','memory','tictactoe','sudoku','minesweeper','flappy','breakout','whack','connect4','2048'];
    var modals = {
      snake:'snake-modal', '2048':'game-2048-modal', memory:'memory-modal', tictactoe:'tictactoe-modal',
      sudoku:'sudoku-modal', minesweeper:'minesweeper-modal', flappy:'flappy-modal', breakout:'breakout-modal',
      whack:'whack-modal', connect4:'connect4-modal'
    };
    var starters = {
      snake:startSnake, '2048':start2048, memory:startMemory, tictactoe:startTicTacToe,
      sudoku:startSudoku, minesweeper:startMinesweeper, flappy:startFlappy, breakout:startBreakout,
      whack:startWhack, connect4:startConnect4
    };
    var stoppers = {
      snake:stopSnake, flappy:stopFlappy, breakout:stopBreakout, whack:stopWhack
    };
    var openIds = {
      snake:'open-snake', '2048':'open-2048', memory:'open-memory', tictactoe:'open-tictactoe',
      sudoku:'open-sudoku', minesweeper:'open-minesweeper', flappy:'open-flappy', breakout:'open-breakout',
      whack:'open-whack', connect4:'open-connect4'
    };

    games.forEach(function(g) {
      gameConfigs[g] = { mode: 'solo', diff: 'easy' };
      // Openers
      var openId = openIds[g];
      if (openId && $(openId)) {
        $(openId).addEventListener('click', function() {
          $('games-modal').classList.remove('ba-modal-open');
          $(modals[g]).classList.add('ba-modal-open');
          showGameSetup(g);
        });
      }
      // Back buttons
      var backId = g === '2048' ? 'game-2048-back' : g + '-back';
      if ($(backId)) {
        $(backId).addEventListener('click', function() {
          if (stoppers[g]) stoppers[g]();
          $(modals[g]).classList.remove('ba-modal-open');
          $('games-modal').classList.add('ba-modal-open');
        });
      }
      // Setup mode buttons
      document.querySelectorAll('[data-game="' + g + '"][data-mode]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          document.querySelectorAll('[data-game="' + g + '"][data-mode]').forEach(function(b) { b.classList.remove('selected'); });
          this.classList.add('selected');
          gameConfigs[g].mode = this.getAttribute('data-mode');
          // Show/hide difficulty row for games that have it
          var diffRow = this.closest('.ba-game-mode-group').querySelectorAll('.ba-game-diff-btn');
          diffRow.forEach(function(d) { d.style.opacity = '1'; d.style.pointerEvents = 'auto'; });
        });
      });
      // Setup difficulty buttons
      document.querySelectorAll('[data-game="' + g + '"][data-diff]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          document.querySelectorAll('[data-game="' + g + '"][data-diff]').forEach(function(b) { b.classList.remove('selected'); });
          this.classList.add('selected');
          gameConfigs[g].diff = this.getAttribute('data-diff');
          // Update minesweeper description
          if (g === 'minesweeper') updateMinesweeperDesc();
        });
      });
      // Start button
      var startBtn = $(g + '-start');
      if (startBtn) {
        startBtn.addEventListener('click', function() {
          var setup = $(g + '-setup');
          var play = $(g + '-play');
          if (setup) setup.style.display = 'none';
          if (play) play.style.display = 'flex';
          if (starters[g]) starters[g]();
        });
      }
    });

    // Minesweeper diff description
    updateMinesweeperDesc();

    // Restart buttons
    if ($('tictactoe-restart')) $('tictactoe-restart').addEventListener('click', startTicTacToe);
    if ($('minesweeper-restart')) $('minesweeper-restart').addEventListener('click', startMinesweeper);
    if ($('connect4-restart')) $('connect4-restart').addEventListener('click', startConnect4);
  }

  function showGameSetup(g) {
    var setup = $(g + '-setup');
    var play = $(g + '-play');
    if (setup) setup.style.display = 'flex';
    if (play) play.style.display = 'none';
  }

  function updateMinesweeperDesc() {
    var el = $('ms-diff-desc');
    var d = gameConfigs.minesweeper ? gameConfigs.minesweeper.diff : 'easy';
    var info = { easy: '8×8 · 10 mines', medium: '10×10 · 20 mines', hard: '12×12 · 35 mines' };
    if (el) el.textContent = info[d] || info.easy;
  }

  /* ---------- SNAKE ---------- */
  var snakeTimer = null;
  function startSnake() {
    var cfg = gameConfigs.snake || { mode:'solo', diff:'easy' };
    var speeds = { easy: 150, medium: 110, hard: 70 };
    var interval = speeds[cfg.diff] || 150;
    var isFriend = cfg.mode === 'friend';
    var canvas = $('snake-canvas');
    var wrap = canvas.parentElement;
    canvas.width = Math.min(340, wrap.clientWidth - 32);
    canvas.height = canvas.width;
    var ctx = canvas.getContext('2d');
    var box = 15; var W = canvas.width; var H = canvas.height;
    var cols = Math.floor(W/box), rows = Math.floor(H/box);
    var snake1 = [{x:Math.floor(cols/3),y:Math.floor(rows/2)}];
    var dir1 = {x:1,y:0};
    var snake2, dir2;
    if (isFriend) {
      snake2 = [{x:Math.floor(cols*2/3),y:Math.floor(rows/2)}];
      dir2 = {x:-1,y:0};
    }
    var food = spawnFood(); var score = 0; var score2 = 0; var running = true;
    function spawnFood() { return {x: Math.floor(Math.random()*cols), y: Math.floor(Math.random()*rows)}; }
    function draw() {
      ctx.fillStyle='#1a1a2e'; ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#2f5bff'; snake1.forEach(function(s){ ctx.fillRect(s.x*box,s.y*box,box-1,box-1); });
      if (isFriend && snake2) {
        ctx.fillStyle='#2fbf6f'; snake2.forEach(function(s){ ctx.fillRect(s.x*box,s.y*box,box-1,box-1); });
      }
      ctx.fillStyle='#ff6a5e'; ctx.fillRect(food.x*box,food.y*box,box-1,box-1);
      if (!running) {
        ctx.fillStyle='rgba(0,0,0,.5)'; ctx.fillRect(0,0,W,H);
        ctx.fillStyle='#fff'; ctx.font='bold 20px sans-serif'; ctx.textAlign='center';
        ctx.fillText('Game Over',W/2,H/2-10);
        var winner = isFriend ? (score > score2 ? 'P1 wins!' : score2 > score ? 'P2 wins!' : 'Draw!') : '';
        ctx.fillText((isFriend ? winner+' ' : '')+'Score: '+(isFriend ? score+'/'+score2 : score),W/2,H/2+20);
        ctx.font='12px sans-serif'; ctx.fillText('Tap to restart',W/2,H/2+50);
      }
    }
    function step() {
      if(!running) return;
      var h1 = {x:snake1[0].x+dir1.x, y:snake1[0].y+dir1.y};
      if(h1.x<0||h1.x>=cols||h1.y<0||h1.y>=rows) { running=false; draw(); return; }
      for(var i=0;i<snake1.length;i++) { if(h1.x===snake1[i].x && h1.y===snake1[i].y) { running=false; draw(); return; } }
      if (isFriend && snake2) {
        for(var i=0;i<snake2.length;i++) { if(h1.x===snake2[i].x && h1.y===snake2[i].y) { running=false; draw(); return; } }
      }
      snake1.unshift(h1);
      if(h1.x===food.x && h1.y===food.y) { score++; food=spawnFood(); $('snake-score').textContent='Score: '+score+(isFriend?' (P2: '+score2+')':''); } else { snake1.pop(); }
      if (isFriend && snake2) {
        var h2 = {x:snake2[0].x+dir2.x, y:snake2[0].y+dir2.y};
        if(h2.x<0||h2.x>=cols||h2.y<0||h2.y>=rows) { running=false; draw(); return; }
        for(var i=0;i<snake2.length;i++) { if(h2.x===snake2[i].x && h2.y===snake2[i].y) { running=false; draw(); return; } }
        for(var i=0;i<snake1.length;i++) { if(h2.x===snake1[i].x && h2.y===snake1[i].y) { running=false; draw(); return; } }
        snake2.unshift(h2);
        if(h2.x===food.x && h2.y===food.y) { score2++; food=spawnFood(); $('snake-score').textContent='Score: '+score+' (P2: '+score2+')'; } else { snake2.pop(); }
      }
      draw();
    }
    draw();
    snakeTimer = setInterval(step, interval);
    // P1 controls: Arrow keys
    var dirs = {up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}};
    function setDir1(k) { if(dirs[k] && (dirs[k].x+dir1.x!==0 || dirs[k].y+dir1.y!==0)) dir1=dirs[k]; }
    $('snake-up').onclick=function(){setDir1('up');}; $('snake-down').onclick=function(){setDir1('down');};
    $('snake-left').onclick=function(){setDir1('left');}; $('snake-right').onclick=function(){setDir1('right');};
    document.addEventListener('keydown', function handler(e) {
      if(!$('snake-modal').classList.contains('ba-modal-open')) { document.removeEventListener('keydown',handler); return; }
      if(e.key==='ArrowUp') setDir1('up'); else if(e.key==='ArrowDown') setDir1('down');
      else if(e.key==='ArrowLeft') setDir1('left'); else if(e.key==='ArrowRight') setDir1('right');
      if (isFriend && snake2) {
        if(e.key==='w') { if(dir2.y!==1) dir2={x:0,y:-1}; }
        else if(e.key==='s') { if(dir2.y!==-1) dir2={x:0,y:1}; }
        else if(e.key==='a') { if(dir2.x!==1) dir2={x:-1,y:0}; }
        else if(e.key==='d') { if(dir2.x!==-1) dir2={x:1,y:0}; }
      }
    });
    if (isFriend) {
      $('snake-score').textContent = 'Score: 0 (P2: 0)';
    }
  }
  function stopSnake() { clearInterval(snakeTimer); }

  /* ---------- 2048 ---------- */
  var grid2048 = [];
  function start2048() {
    grid2048 = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    addTile2048(); addTile2048(); render2048();
    document.addEventListener('keydown', function handler(e) {
      if(!$('game-2048-modal').classList.contains('ba-modal-open')) { document.removeEventListener('keydown',handler); return; }
      if(e.key==='ArrowUp') move2048('up'); else if(e.key==='ArrowDown') move2048('down');
      else if(e.key==='ArrowLeft') move2048('left'); else if(e.key==='ArrowRight') move2048('right');
    });
    // Touch swipe support
    var wrap = $('game-2048-grid');
    if(wrap) {
      var sx=0,sy=0;
      wrap.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;sy=e.touches[0].clientY;},{passive:true});
      wrap.addEventListener('touchend',function(e){
        var dx=e.changedTouches[0].clientX-sx;
        var dy=e.changedTouches[0].clientY-sy;
        if(Math.abs(dx)>30||Math.abs(dy)>30) {
          if(Math.abs(dx)>Math.abs(dy)) move2048(dx>0?'right':'left');
          else move2048(dy>0?'down':'up');
        }
      },{passive:true});
    }
  }
  function addTile2048() {
    var empty=[]; for(var r=0;r<4;r++) for(var c=0;c<4;c++) if(grid2048[r][c]===0) empty.push({r:r,c:c});
    if(!empty.length) return;
    var p=empty[Math.floor(Math.random()*empty.length)];
    grid2048[p.r][p.c]=Math.random()<0.9?2:4;
  }
  function render2048() {
    var el=$('game-2048-grid'); el.innerHTML=''; var sc=0;
    for(var r=0;r<4;r++) for(var c=0;c<4;c++) {
      var v=grid2048[r][c]; sc+=v;
      var d=document.createElement('div'); d.className='ba-2048-cell'; if(v) d.setAttribute('data-val',v);
      d.textContent=v||''; el.appendChild(d);
    }
    $('game-2048-score').textContent='Score: '+sc;
  }
  function move2048(dir) {
    var moved=false; var g=grid2048;
    function slide(row) { var a=row.filter(function(x){return x;}); var missing=4-a.length; var z=[]; for(var i=0;i<missing;i++) z.push(0); return a.concat(z); }
    function combine(row) { for(var i=0;i<3;i++) { if(row[i]&&row[i]===row[i+1]) { row[i]*=2; row[i+1]=0; } } return row; }
    var old=JSON.stringify(g);
    if(dir==='left') { for(var r=0;r<4;r++) { g[r]=slide(g[r]); g[r]=combine(g[r]); g[r]=slide(g[r]); } }
    else if(dir==='right') { for(var r=0;r<4;r++) { g[r]=slide(g[r].reverse()).reverse(); g[r]=combine(g[r]); g[r]=slide(g[r]); } }
    else if(dir==='up') { for(var c=0;c<4;c++) { var col=[g[0][c],g[1][c],g[2][c],g[3][c]]; col=slide(col); col=combine(col); col=slide(col); for(var r=0;r<4;r++) g[r][c]=col[r]; } }
    else if(dir==='down') { for(var c=0;c<4;c++) { var col=[g[0][c],g[1][c],g[2][c],g[3][c]].reverse(); col=slide(col); col=combine(col); col=slide(col); col=col.reverse(); for(var r=0;r<4;r++) g[r][c]=col[r]; } }
    if(JSON.stringify(g)!==old) { moved=true; addTile2048(); }
    render2048();
  }

  /* ---------- MEMORY ---------- */
  function startMemory() {
    var cfg = gameConfigs.memory || { mode:'solo', diff:'easy' };
    var pairCounts = { easy:8, medium:12, hard:18 };
    var numPairs = pairCounts[cfg.diff] || 8;
    var allEmojis=['🍎','🍊','🍋','🍇','🍉','🍓','🍒','🫐','🥑','🌽','🥕','🫑','🍑','🥝','🫒','🌸','⭐','🔥'];
    var chosen = allEmojis.slice(0, numPairs);
    var cards = chosen.concat(chosen).sort(function(){return Math.random()-0.5;});
    var flipped=[]; var matched=[]; var moves=0; var busy=false;
    var isFriend = cfg.mode === 'friend';
    var turn = 1; var p1Score = 0, p2Score = 0; var firstFlippedIdx = -1;
    var grid=$('memory-grid'); grid.innerHTML='';
    grid.className = 'ba-memory-grid';
    if (numPairs <= 8) grid.style.gridTemplateColumns = 'repeat(4,1fr)';
    else if (numPairs <= 12) grid.style.gridTemplateColumns = 'repeat(6,1fr)';
    else grid.style.gridTemplateColumns = 'repeat(6,1fr)';
    var turnBar = $('memory-turn-bar');
    if (turnBar) turnBar.style.display = isFriend ? 'flex' : 'none';
    if (isFriend) $('memory-turn-text').textContent = "P1's turn";
    cards.forEach(function(emoji,i) {
      var d=document.createElement('div'); d.className='ba-memory-card'; d.dataset.idx=i;
      d.addEventListener('click', function() {
        if(busy||matched.includes(i)||flipped.includes(i)) return;
        d.classList.add('flipped'); d.textContent=emoji; flipped.push(i);
        if(flipped.length===2) {
          busy=true; moves++;
          if(isFriend) $('memory-score').textContent='P1: '+p1Score+' | P2: '+p2Score;
          else $('memory-score').textContent='Moves: '+moves;
          if(cards[flipped[0]]===cards[flipped[1]]) {
            matched.push(flipped[0]); matched.push(flipped[1]);
            document.querySelectorAll('.ba-memory-card')[flipped[0]].classList.add('matched');
            document.querySelectorAll('.ba-memory-card')[flipped[1]].classList.add('matched');
            if (isFriend) {
              if (turn===1) p1Score++; else p2Score++;
              $('memory-score').textContent='P1: '+p1Score+' | P2: '+p2Score;
            }
            flipped=[]; busy=false;
          } else {
            var f0=flipped[0], f1=flipped[1]; flipped=[];
            var prevTurn = turn;
            setTimeout(function() {
              document.querySelectorAll('.ba-memory-card')[f0].classList.remove('flipped');
              document.querySelectorAll('.ba-memory-card')[f0].textContent='';
              document.querySelectorAll('.ba-memory-card')[f1].classList.remove('flipped');
              document.querySelectorAll('.ba-memory-card')[f1].textContent='';
              if (isFriend) { turn = turn===1 ? 2 : 1; $('memory-turn-text').textContent="P"+turn+"'s turn"; }
              busy=false;
            },800);
          }
        }
      });
      grid.appendChild(d);
    });
  }

  /* ---------- TIC-TAC-TOE ---------- */
  var tttBoard=[], tttTurn='X', tttMode='friend', tttDiff='easy';
  function startTicTacToe() {
    var cfg = gameConfigs.tictactoe || { mode:'friend', diff:'easy' };
    tttMode = cfg.mode; tttDiff = cfg.diff;
    tttBoard=['','','','','','','','','']; tttTurn='X';
    $('tictactoe-status').textContent="Player X's turn";
    var tb = $('ttt-turn-bar'); if(tb) tb.style.display='flex';
    renderTTT();
  }
  function renderTTT() {
    var grid=$('tictactoe-grid'); grid.innerHTML='';
    tttBoard.forEach(function(v,i) {
      var d=document.createElement('div'); d.className='ba-ttt-cell'; d.textContent=v;
      d.addEventListener('click', function() {
        if(tttBoard[i]||checkTTT()) return;
        if(tttMode==='bot' && tttTurn==='O') return;
        tttBoard[i]=tttTurn;
        if(checkTTT()) { $('tictactoe-status').textContent=tttTurn+' wins!'; }
        else if(!tttBoard.includes('')) { $('tictactoe-status').textContent='Draw!'; }
        else { tttTurn=tttTurn==='X'?'O':'X'; $('tictactoe-status').textContent=(tttMode==='bot' && tttTurn==='O'?'Bot thinking...':'Player '+tttTurn+"'s turn"); }
        renderTTT();
        if (tttMode==='bot' && tttTurn==='O' && !checkTTT() && tttBoard.includes('')) {
          setTimeout(tttBotMove, 400);
        }
      });
      grid.appendChild(d);
    });
  }
  function tttBotMove() {
    if (checkTTT() || !tttBoard.includes('')) return;
    var wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    var move = -1;
    // Hard: win or block
    if (tttDiff==='hard' || tttDiff==='medium') {
      // Try to win
      for(var i=0;i<wins.length;i++) { var w=wins[i]; var vals=[tttBoard[w[0]],tttBoard[w[1]],tttBoard[w[2]]];
        var os=vals.filter(function(v){return v==='O';}).length, es=vals.filter(function(v){return v==='';}).length;
        if(os===2 && es===1) { move=w[vals.indexOf('')]; break; }
      }
      // Block
      if (move<0) { for(var i=0;i<wins.length;i++) { var w=wins[i]; var vals=[tttBoard[w[0]],tttBoard[w[1]],tttBoard[w[2]]];
        var xs=vals.filter(function(v){return v==='X';}).length, es=vals.filter(function(v){return v==='';}).length;
        if(xs===2 && es===1) { move=w[vals.indexOf('')]; break; }
      }}
    }
    // Medium: 50% chance of smart move
    if (tttDiff==='medium' && move<0 && Math.random()>0.5) { move=-1; }
    // Random fallback
    if (move<0) {
      var empty=[]; for(var i=0;i<9;i++) if(!tttBoard[i]) empty.push(i);
      move=empty[Math.floor(Math.random()*empty.length)];
    }
    tttBoard[move]='O';
    if(checkTTT()) { $('tictactoe-status').textContent='Bot wins! 😔'; }
    else if(!tttBoard.includes('')) { $('tictactoe-status').textContent='Draw!'; }
    else { tttTurn='X'; $('tictactoe-status').textContent="Your turn (X)"; }
    renderTTT();
  }
  function checkTTT() {
    var w=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for(var i=0;i<w.length;i++) { var a=w[i]; if(tttBoard[a[0]]&&tttBoard[a[0]]===tttBoard[a[1]]&&tttBoard[a[1]]===tttBoard[a[2]]) return true; }
    return false;
  }

  /* ---------- MINESWEEPER ---------- */
  var msGrid=[], msRevealed=[], msGameOver=false, msR=8, msC=8;
  function startMinesweeper() {
    var cfg = gameConfigs.minesweeper || { mode:'solo', diff:'easy' };
    var grids = { easy:{r:8,c:8,m:10}, medium:{r:10,c:10,m:20}, hard:{r:12,c:12,m:35} };
    var g = grids[cfg.diff] || grids.easy;
    msR=g.r; msC=g.c; msGameOver=false; msGrid=[]; msRevealed=[];
    for(var r=0;r<msR;r++) { msGrid[r]=[]; msRevealed[r]=[]; for(var c=0;c<msC;c++) { msGrid[r][c]=0; msRevealed[r][c]=false; } }
    var placed=0;
    while(placed<g.m) { var r=Math.floor(Math.random()*msR), c=Math.floor(Math.random()*msC); if(msGrid[r][c]!==-1) { msGrid[r][c]=-1; placed++; } }
    for(var r=0;r<msR;r++) for(var c=0;c<msC;c++) { if(msGrid[r][c]===-1) continue; var cnt=0;
      for(var dr=-1;dr<=1;dr++) for(var dc=-1;dc<=1;dc++) { var nr=r+dr,nc=c+dc; if(nr>=0&&nr<msR&&nc>=0&&nc<msC&&msGrid[nr][nc]===-1) cnt++; }
      msGrid[r][c]=cnt;
    }
    var grid=$('minesweeper-grid'); grid.style.gridTemplateColumns='repeat('+msC+',1fr)';
    renderMinesweeper();
  }
  function renderMinesweeper() {
    var grid=$('minesweeper-grid'); grid.innerHTML='';
    for(var r=0;r<msR;r++) for(var c=0;c<msC;c++) {
      var d=document.createElement('div'); d.className='ba-mine-cell';
      if(msRevealed[r][c]) { d.classList.add('revealed'); if(msGrid[r][c]===-1) { d.classList.add('mine'); d.textContent='💣'; } else { d.textContent=msGrid[r][c]||''; } }
      (function(r,c){
        d.addEventListener('click', function() { if(msGameOver||msRevealed[r][c]) return; msRevealed[r][c]=true;
          if(msGrid[r][c]===-1) { msGameOver=true; for(var i=0;i<msR;i++) for(var j=0;j<msC;j++) msRevealed[i][j]=true; }
          renderMinesweeper();
        });
      })(r,c);
      grid.appendChild(d);
    }
  }

  /* ---------- SUDOKU ---------- */
  var sdkGrid=[], sdkSolution=[], sdkFixed=[], sdkSelected=-1;
  function startSudoku() {
    sdkGrid=[]; sdkSolution=[]; sdkFixed=[]; sdkSelected=-1;
    // Generate a simple valid puzzle
    var base=[[1,2,3,4,5,6,7,8,9],[4,5,6,7,8,9,1,2,3],[7,8,9,1,2,3,4,5,6],
              [2,3,1,5,6,4,8,9,7],[5,6,4,8,9,7,2,3,1],[8,9,7,2,3,1,5,6,4],
              [3,1,2,6,4,5,9,7,8],[6,4,5,9,7,8,3,1,2],[9,7,8,3,1,2,6,4,5]];
    sdkSolution=base;
    for(var r=0;r<9;r++) { sdkGrid[r]=[]; sdkFixed[r]=[]; for(var c=0;c<9;c++) { sdkFixed[r][c]=Math.random()>0.45; sdkGrid[r][c]=sdkFixed[r][c]?base[r][c]:0; } }
    renderSudoku();
    // Numpad
    var pad=$('sudoku-numpad'); pad.innerHTML='';
    for(var n=1;n<=9;n++) {
      var b=document.createElement('button'); b.className='ba-sudoku-num'; b.textContent=n;
      b.addEventListener('click', function() { if(sdkSelected<0) return; var r=Math.floor(sdkSelected/9), c=sdkSelected%9; if(sdkFixed[r][c]) return; sdkGrid[r][c]=parseInt(this.textContent); renderSudoku(); });
      pad.appendChild(b);
    }
    // Clear button
    var clr=document.createElement('button'); clr.className='ba-sudoku-num'; clr.textContent='✕';
    clr.addEventListener('click', function() { if(sdkSelected<0) return; var r=Math.floor(sdkSelected/9), c=sdkSelected%9; if(sdkFixed[r][c]) return; sdkGrid[r][c]=0; renderSudoku(); });
    pad.appendChild(clr);
  }
  function renderSudoku() {
    var grid=$('sudoku-grid'); grid.innerHTML='';
    for(var r=0;r<9;r++) for(var c=0;c<9;c++) {
      var d=document.createElement('div'); d.className='ba-sudoku-cell';
      if(sdkFixed[r][c]) d.classList.add('fixed');
      if((r*9+c)===sdkSelected) d.classList.add('selected');
      d.textContent=sdkGrid[r][c]||'';
      var idx=r*9+c;
      (function(idx,r,c){
        d.addEventListener('click', function() { sdkSelected=idx; renderSudoku(); });
      })(idx,r,c);
      grid.appendChild(d);
    }
  }
  if ($('sudoku-restart')) $('sudoku-restart').addEventListener('click', startSudoku);

  /* ---------- FLAPPY BIRD ---------- */
  var flappyTimer = null;
  function startFlappy() {
    var cfg = gameConfigs.flappy || { mode:'solo', diff:'easy' };
    var diffCfg = { easy:{gravity:0.3,flap:-5.5,speed:2,gap:140}, medium:{gravity:0.38,flap:-6,speed:2.8,gap:120}, hard:{gravity:0.45,flap:-6.5,speed:3.5,gap:100} };
    var dc = diffCfg[cfg.diff] || diffCfg.easy;
    var isFriend = cfg.mode === 'friend';
    var canvas = $('flappy-canvas');
    var wrap = canvas.parentElement;
    canvas.width = Math.min(340, wrap.clientWidth - 32);
    canvas.height = Math.round(canvas.width * 1.33);
    var ctx = canvas.getContext('2d');
    var W = canvas.width, H = canvas.height;
    var turnBar = $('flappy-turn-bar');
    var turnLabel = $('flappy-turn-text');
    if (turnBar) turnBar.style.display = isFriend ? 'flex' : 'none';
    var currentTurn = 1, scores = [0,0], turnsLeft = isFriend ? 2 : 999;
    var bird, pipes, pipeW=40, frame, score, running;
    function resetBird() {
      bird = {x:60, y:H/2, vy:0, w:20, h:16}; pipes=[]; frame=0; score=0; running=true;
    }
    function flap() { if(running) bird.vy = dc.flap; }
    function step() {
      if(!running) return;
      bird.vy += dc.gravity; bird.y += bird.vy; frame++;
      if(frame%90===0) { pipes.push({x:W, gapY:80+Math.random()*(H-200)}); }
      for(var i=pipes.length-1;i>=0;i--) {
        pipes[i].x -= dc.speed;
        if(pipes[i].x+pipeW<0) { pipes.splice(i,1); continue; }
        if(pipes[i].x+pipeW < bird.x && !pipes[i].scored) { score++; pipes[i].scored=true; updateFlappyScore(); }
        if(bird.x+bird.w>pipes[i].x && bird.x<pipes[i].x+pipeW) {
          if(bird.y<pipes[i].gapY || bird.y+bird.h>pipes[i].gapY+dc.gap) { running=false; }
        }
      }
      if(bird.y<0||bird.y+bird.h>H) running=false;
      drawFlappy();
    }
    function updateFlappyScore() {
      if(isFriend) $('flappy-score').textContent='P'+currentTurn+': '+score+' (P'+(currentTurn===1?2:1)+': '+scores[currentTurn===1?0:1]+')';
      else $('flappy-score').textContent='Score: '+score;
    }
    function drawFlappy() {
      ctx.fillStyle='#1a1a2e'; ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#ffc21c'; ctx.fillRect(bird.x,bird.y,bird.w,bird.h);
      ctx.fillStyle='#0f0f0f'; ctx.fillRect(bird.x+14,bird.y+3,4,4);
      ctx.fillStyle='#2fbf6f';
      pipes.forEach(function(p){ ctx.fillRect(p.x,0,pipeW,p.gapY); ctx.fillRect(p.x,p.gapY+dc.gap,pipeW,H-p.gapY-dc.gap); });
      if(!running) {
        ctx.fillStyle='rgba(0,0,0,.5)'; ctx.fillRect(0,0,W,H);
        ctx.fillStyle='#fff'; ctx.font='bold 20px sans-serif'; ctx.textAlign='center';
        if(isFriend) {
          scores[currentTurn===1?0:1]=score;
          var msg = turnsLeft<=0 ? (scores[0]>scores[1]?'P1 wins!':scores[1]>scores[0]?'P2 wins!':'Draw!') : 'P'+currentTurn+' crashed!';
          ctx.fillText(msg,W/2,H/2-10);
          ctx.font='bold 14px sans-serif'; ctx.fillText('P1: '+scores[0]+' | P2: '+scores[1],W/2,H/2+15);
        } else {
          ctx.fillText('Game Over',W/2,H/2-10);
          ctx.font='bold 14px sans-serif'; ctx.fillText('Score: '+score,W/2,H/2+15);
        }
        ctx.font='12px sans-serif'; ctx.fillText('Tap to restart',W/2,H/2+45);
      }
    }
    function loop() {
      if(!$('flappy-modal').classList.contains('ba-modal-open')) return;
      step();
      if(!running) {
        canvas.onclick = function() {
          if(isFriend) {
            scores[currentTurn===1?0:1]=score;
            if(turnsLeft>0) {
              currentTurn=currentTurn===1?2:1; turnsLeft--;
              turnLabel.textContent='P'+currentTurn+'\'s turn';
              resetBird(); drawFlappy();
              $('flappy-score').textContent='P1: '+scores[0]+' | P2: '+scores[1];
              canvas.onclick=flap;
              if(turnsLeft<=0 && currentTurn===1) {
                // Both played
              }
            } else {
              var winner=scores[0]>scores[1]?'P1 wins!':scores[1]>scores[0]?'P2 wins!':'Draw!';
              turnLabel.textContent=winner;
            }
          } else {
            resetBird(); canvas.onclick=flap;
          }
        };
        return;
      }
      flappyTimer=requestAnimationFrame(loop);
    }
    resetBird(); updateFlappyScore();
    canvas.onclick=flap;
    flappyTimer=requestAnimationFrame(loop);
  }
  function stopFlappy() { cancelAnimationFrame(flappyTimer); }

  /* ---------- BREAKOUT ---------- */
  var breakoutTimer = null;
  function startBreakout() {
    var cfg = gameConfigs.breakout || { mode:'solo', diff:'easy' };
    var dc = { easy:{ballSpd:3,paddleW:80,rows:4}, medium:{ballSpd:4,paddleW:65,rows:5}, hard:{ballSpd:5,paddleW:50,rows:6} };
    var d = dc[cfg.diff] || dc.easy;
    var isFriend = cfg.mode === 'friend';
    var canvas = $('breakout-canvas');
    var wrap = canvas.parentElement;
    canvas.width = Math.min(340, wrap.clientWidth - 32);
    canvas.height = Math.round(canvas.width * 1.1);
    var ctx = canvas.getContext('2d');
    var W = canvas.width, H = canvas.height;
    var paddleH = 12, ballR = 6, brickCols = 6, brickW = Math.floor((W-20)/brickCols), brickH = 18, brickPad = 4, brickTop = 30;
    var paddle = {x:W/2-d.paddleW/2, y:H-30}, ball={x:W/2,y:H-42,vx:d.ballSpd,vy:-d.ballSpd};
    var brickRows = d.rows, bricks=[], score=0, running=true;
    var turnBar = $('breakout-turn-bar'), turnLabel = $('breakout-turn-text');
    if (turnBar) turnBar.style.display = isFriend ? 'flex' : 'none';
    var currentTurn=1, pScores=[0,0], turnsLeft=isFriend?2:999;
    var colors=['#ff6a5e','#ffc21c','#2fbf6f','#2f5bff','#a855f7','#e879f9'];
    function initBricks() { bricks=[]; for(var r=0;r<brickRows;r++) { bricks[r]=[]; for(var c=0;c<brickCols;c++) bricks[r][c]={alive:true}; } }
    initBricks();
    function setPaddleX(cx) { var rect=canvas.getBoundingClientRect(); var x=(cx-rect.left)/rect.width*W; paddle.x=Math.max(0,Math.min(W-d.paddleW,x-d.paddleW/2)); }
    canvas.addEventListener('touchstart',function(e){setPaddleX(e.touches[0].clientX);},{passive:true});
    canvas.addEventListener('touchmove',function(e){e.preventDefault();setPaddleX(e.touches[0].clientX);},{passive:false});
    canvas.addEventListener('mousemove',function(e){setPaddleX(e.clientX);});
    function updateScore() {
      if(isFriend) $('breakout-score').textContent='P'+currentTurn+': '+score;
      else $('breakout-score').textContent='Score: '+score;
    }
    function step() {
      if(!running) return;
      ball.x+=ball.vx; ball.y+=ball.vy;
      if(ball.x-ballR<0||ball.x+ballR>W) ball.vx*=-1;
      if(ball.y-ballR<0) ball.vy*=-1;
      if(ball.y+ballR>=paddle.y&&ball.x>=paddle.x&&ball.x<=paddle.x+d.paddleW&&ball.vy>0) {
        ball.vy=-Math.abs(ball.vy);
        var hit=(ball.x-(paddle.x+d.paddleW/2))/(d.paddleW/2);
        ball.vx=hit*d.ballSpd;
      }
      for(var r=0;r<brickRows;r++) for(var c=0;c<brickCols;c++) {
        var b=bricks[r][c]; if(!b.alive) continue;
        var bx=c*(brickW+brickPad)+brickPad, by=r*(brickH+brickPad)+brickTop;
        if(ball.x+ballR>bx&&ball.x-ballR<bx+brickW&&ball.y+ballR>by&&ball.y-ballR<by+brickH) {
          b.alive=false; ball.vy*=-1; score+=10; updateScore();
        }
      }
      if(ball.y>H) running=false;
      draw();
    }
    function draw() {
      ctx.fillStyle='#1a1a2e'; ctx.fillRect(0,0,W,H);
      for(var r=0;r<brickRows;r++) for(var c=0;c<brickCols;c++) {
        if(!bricks[r][c].alive) continue;
        ctx.fillStyle=colors[r%colors.length];
        ctx.fillRect(c*(brickW+brickPad)+brickPad,r*(brickH+brickPad)+brickTop,brickW,brickH);
      }
      ctx.fillStyle='#fff'; ctx.fillRect(paddle.x,paddle.y,d.paddleW,paddleH);
      ctx.fillStyle='#ffc21c'; ctx.beginPath(); ctx.arc(ball.x,ball.y,ballR,0,Math.PI*2); ctx.fill();
      if(!running) {
        ctx.fillStyle='rgba(0,0,0,.5)'; ctx.fillRect(0,0,W,H);
        ctx.fillStyle='#fff'; ctx.font='bold 20px sans-serif'; ctx.textAlign='center';
        if(isFriend) {
          pScores[currentTurn===1?0:1]=score;
          var msg=turnsLeft<=0?(pScores[0]>pScores[1]?'P1 wins!':pScores[1]>pScores[0]?'P2 wins!':'Draw!'):'P'+currentTurn+' lost the ball!';
          ctx.fillText(msg,W/2,H/2-10);
        } else { ctx.fillText('Game Over',W/2,H/2-10); }
        ctx.font='bold 14px sans-serif'; ctx.fillText(isFriend?'P1: '+pScores[0]+' | P2: '+pScores[1]:'Score: '+score,W/2,H/2+15);
        ctx.font='12px sans-serif'; ctx.fillText('Tap to restart',W/2,H/2+45);
      }
    }
    function loop() {
      if(!$('breakout-modal').classList.contains('ba-modal-open')) return;
      step();
      if(!running) {
        canvas.onclick=function() {
          if(isFriend) {
            pScores[currentTurn===1?0:1]=score;
            if(turnsLeft>0) { currentTurn=currentTurn===1?2:1; turnsLeft--; turnLabel.textContent='P'+currentTurn; }
            score=0; ball={x:W/2,y:H-42,vx:d.ballSpd,vy:-d.ballSpd}; paddle.x=W/2-d.paddleW/2; initBricks(); running=true; canvas.onclick=null;
            if(turnBar) turnBar.style.display='flex';
            updateScore();
          } else { score=0; ball={x:W/2,y:H-42,vx:d.ballSpd,vy:-d.ballSpd}; paddle.x=W/2-d.paddleW/2; initBricks(); running=true; canvas.onclick=null; }
        };
        return;
      }
      breakoutTimer=requestAnimationFrame(loop);
    }
    breakoutTimer=requestAnimationFrame(loop);
  }
  function stopBreakout() { cancelAnimationFrame(breakoutTimer); }

  /* ---------- WHACK-A-MOLE ---------- */
  var whackTimer = null, whackScore = 0, whackTime = 30, whackHoles = [];
  function startWhack() {
    var cfg = gameConfigs.whack || { mode:'solo', diff:'easy' };
    var dc = { easy:{time:45,moleRate:0.35,hideRate:0.2}, medium:{time:30,moleRate:0.45,hideRate:0.3}, hard:{time:20,moleRate:0.6,hideRate:0.4} };
    var d = dc[cfg.diff] || dc.easy;
    var isFriend = cfg.mode === 'friend';
    whackScore=0; whackTime=d.time; whackHoles=new Array(9).fill(false);
    var turnBar = $('whack-turn-bar'), turnLabel = $('whack-turn-text');
    if (turnBar) turnBar.style.display = isFriend ? 'flex' : 'none';
    var currentTurn=1, pScores=[0,0];
    function updateScore() {
      if(isFriend) $('whack-score').textContent='P1: '+pScores[0]+' | P2: '+pScores[1]+' | Time: '+whackTime+'s';
      else $('whack-score').textContent='Score: '+whackScore+' | Time: '+whackTime+'s';
    }
    updateScore();
    renderWhack();
    var grid = $('whack-grid');
    grid.onclick = function(e) {
      var idx = parseInt(e.target.getAttribute('data-idx'));
      if(isNaN(idx)||!whackHoles[idx]) return;
      whackHoles[idx]=false;
      if(isFriend) { pScores[currentTurn===1?0:1]+=10; } else { whackScore+=10; }
      updateScore(); renderWhack();
    };
    whackTimer=setInterval(function() {
      whackTime--;
      if(Math.random()<d.moleRate) {
        var empty=[]; for(var i=0;i<9;i++) if(!whackHoles[i]) empty.push(i);
        if(empty.length) whackHoles[empty[Math.floor(Math.random()*empty.length)]]=true;
        for(var i=0;i<9;i++) if(Math.random()<d.hideRate) whackHoles[i]=false;
      }
      renderWhack(); updateScore();
      if(whackTime<=0) {
        clearInterval(whackTimer);
        if(isFriend) {
          var winner=pScores[0]>pScores[1]?'P1 wins!':pScores[1]>pScores[0]?'P2 wins!':'Draw!';
          $('whack-score').textContent=winner+' P1: '+pScores[0]+' | P2: '+pScores[1];
        } else { $('whack-score').textContent='Final: '+whackScore+' points!'; }
      }
    },1000);
  }
  function renderWhack() {
    var grid=$('whack-grid'); grid.innerHTML='';
    for(var i=0;i<9;i++) {
      var d=document.createElement('div');
      d.className='ba-whack-hole'+(whackHoles[i]?' ba-whack-active':'');
      d.setAttribute('data-idx',i);
      d.textContent=whackHoles[i]?'🐹':'';
      grid.appendChild(d);
    }
  }
  function stopWhack() { clearInterval(whackTimer); }

  /* ---------- CONNECT FOUR ---------- */
  var c4Board=[], c4Turn='red', c4GameOver=false, c4Mode='bot', c4Diff='easy';
  function startConnect4() {
    var cfg = gameConfigs.connect4 || { mode:'bot', diff:'easy' };
    c4Mode=cfg.mode; c4Diff=cfg.diff;
    c4Board=[]; c4Turn='red'; c4GameOver=false;
    for(var r=0;r<6;r++) { c4Board[r]=[]; for(var c=0;c<7;c++) c4Board[r][c]=''; }
    var statusEl = $('connect4-status');
    if(c4Mode==='friend') { statusEl.textContent='Red\'s turn'; }
    else { statusEl.textContent='Your turn (Red)'; }
    var tb = $('c4-turn-bar'); if(tb) tb.style.display='flex';
    renderConnect4();
    $('connect4-grid').onclick=function(e) {
      if(c4GameOver) return;
      if(c4Mode==='bot' && c4Turn!=='red') return;
      var col=parseInt(e.target.getAttribute('data-col'));
      if(isNaN(col)) return;
      dropC4(col, c4Turn);
      var winner = checkC4();
      if(winner) { c4GameOver=true; statusEl.textContent=(c4Mode==='friend'?c4Turn+' wins! 🎉':c4Turn==='red'?'You win! 🎉':'Computer wins! 😔'); renderConnect4(); return; }
      if(isC4Full()) { c4GameOver=true; statusEl.textContent='Draw!'; renderConnect4(); return; }
      if(c4Mode==='bot') {
        c4Turn='yellow'; statusEl.textContent='Computer thinking...';
        renderConnect4(); setTimeout(c4AI, 400);
      } else {
        c4Turn=c4Turn==='red'?'yellow':'red';
        statusEl.textContent=c4Turn==='red'?'Red\'s turn':'Yellow\'s turn';
        renderConnect4();
      }
    };
  }
  function dropC4(col,player) { for(var r=5;r>=0;r--) { if(!c4Board[r][col]) { c4Board[r][col]=player; return true; } } return false; }
  function c4AI() {
    if(c4GameOver) return;
    var col=-1;
    // Easy: 40% chance of smart move
    if(c4Diff==='easy') {
      if(Math.random()>0.4) { col=-1; } else { col=c4SmartMove('yellow'); }
    }
    // Medium: always tries win/block, 50% look-ahead
    else if(c4Diff==='medium') {
      col=c4SmartMove('yellow');
      if(col<0 && Math.random()>0.5) col=c4RandomMove();
    }
    // Hard: always smart + tries to set up 2-move wins
    else {
      col=c4SmartMove('yellow');
      if(col<0) col=c4LookAhead('yellow');
      if(col<0) col=c4RandomMove();
    }
    dropC4(col,'yellow');
    if(checkC4For('yellow')) { c4GameOver=true; $('connect4-status').textContent='Computer wins! 😔'; }
    else if(isC4Full()) { c4GameOver=true; $('connect4-status').textContent='Draw!'; }
    else { c4Turn='red'; $('connect4-status').textContent='Your turn (Red)'; }
    renderConnect4();
  }
  function c4SmartMove(p) {
    var opp=p==='red'?'yellow':'red';
    // Win
    for(var c=0;c<7;c++) { var r=findC4Row(c); if(r>=0) { c4Board[r][c]=p; if(checkC4For(p)) { c4Board[r][c]=''; return c; } c4Board[r][c]=''; } }
    // Block
    for(var c=0;c<7;c++) { var r=findC4Row(c); if(r>=0) { c4Board[r][c]=opp; if(checkC4For(opp)) { c4Board[r][c]=''; return c; } c4Board[r][c]=''; } }
    return -1;
  }
  function c4RandomMove() {
    var avail=[]; for(var c=0;c<7;c++) { if(findC4Row(c)>=0) avail.push(c); }
    return avail[Math.floor(Math.random()*avail.length)];
  }
  function c4LookAhead(p) {
    var opp=p==='red'?'yellow':'red';
    for(var c=0;c<7;c++) {
      var r=findC4Row(c); if(r<0) continue;
      c4Board[r][c]=p;
      // Does opponent have a block that lets me win next?
      var blocked=false;
      for(var c2=0;c2<7;c2++) {
        var r2=findC4Row(c2); if(r2<0) continue;
        c4Board[r2][c2]=opp;
        if(checkC4For(opp)) { blocked=true; c4Board[r2][c2]=''; break; }
        c4Board[r2][c2]='';
      }
      c4Board[r][c]='';
    }
    return -1;
  }
  function findC4Row(col) {
    for (var r = 5; r >= 0; r--) { if (!c4Board[r][col]) return r; }
    return -1;
  }
  function checkC4() { return checkC4For('red'); }
  function checkC4For(p) {
    // Horizontal
    for (var r = 0; r < 6; r++) for (var c = 0; c < 4; c++) {
      if (c4Board[r][c]===p && c4Board[r][c+1]===p && c4Board[r][c+2]===p && c4Board[r][c+3]===p) return true;
    }
    // Vertical
    for (var r = 0; r < 3; r++) for (var c = 0; c < 7; c++) {
      if (c4Board[r][c]===p && c4Board[r+1][c]===p && c4Board[r+2][c]===p && c4Board[r+3][c]===p) return true;
    }
    // Diagonal
    for (var r = 0; r < 3; r++) for (var c = 0; c < 4; c++) {
      if (c4Board[r][c]===p && c4Board[r+1][c+1]===p && c4Board[r+2][c+2]===p && c4Board[r+3][c+3]===p) return true;
    }
    for (var r = 3; r < 6; r++) for (var c = 0; c < 4; c++) {
      if (c4Board[r][c]===p && c4Board[r-1][c+1]===p && c4Board[r-2][c+2]===p && c4Board[r-3][c+3]===p) return true;
    }
    return false;
  }
  function isC4Full() {
    for (var c = 0; c < 7; c++) if (!c4Board[0][c]) return false;
    return true;
  }
  function renderConnect4() {
    var grid = $('connect4-grid'); grid.innerHTML = '';
    for (var r = 0; r < 6; r++) for (var c = 0; c < 7; c++) {
      var d = document.createElement('div');
      d.className = 'ba-c4-cell';
      d.setAttribute('data-col', c);
      if (c4Board[r][c]) d.classList.add('ba-c4-' + c4Board[r][c]);
      grid.appendChild(d);
    }
  }
  if ($('connect4-restart')) $('connect4-restart').addEventListener('click', startConnect4);

  function setupHiddenGestures() {
    var eggTrigger = $("easter-egg-trigger");
    var eggTapCount = 0;
    var eggTapTimer = null;
    
    $("games-back").addEventListener("click", function () { $("games-modal").classList.remove("ba-modal-open"); });
    
    if (eggTrigger) {
      eggTrigger.addEventListener("click", function () {
        eggTapCount++;
        clearTimeout(eggTapTimer);
        eggTapTimer = setTimeout(function () { eggTapCount = 0; }, 1500);
        
        if (eggTapCount >= 7) {
          eggTapCount = 0;
          $("games-modal").classList.add("ba-modal-open");
          if (focusTimer) stopFocusTimer();
        }
      });
    }
    
    // One-Swipe Current Subject (from edge)
    document.addEventListener("touchstart", function (e) {
      if (e.touches[0].clientX < 15) { // Left edge swipe
        var startY = e.touches[0].clientY;
        document.addEventListener("touchend", function (ev) {
          if (startY - ev.changedTouches[0].clientY > 30) {
            var dayKey = currentDayKey();
            var periods = dayKey ? TIMETABLE[dayKey] : [];
            var mins = new Date().getHours() * 60 + new Date().getMinutes();
            var at = periodAt(periods, mins);
            if (at && at.cur.subject && at.cur.subject !== "BREAK") {
              var s = getSubject(at.cur.subject);
              if (s) openPdf(s);
            }
          }
        }, { once: true });
      }
    });
  }

  window.addEventListener("load", init);
})();
