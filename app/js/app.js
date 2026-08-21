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

  window.addEventListener("load", init);
})();
