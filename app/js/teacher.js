/* ============================================================
   BACKPACK AIR — Teacher Dashboard Module
   Renders inside the same app-shell as student mode.
   Uses bottom tab bar for navigation.
   ============================================================ */
window.TeacherDashboard = (function () {
  "use strict";
  var S = window.BAStore;
  var DB = S.load();
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); }
  function notify(msg) { if (window.BAUI) BAUI.toast(msg); else window.alert(msg); }
  function confirmAction(msg, cb) { if (window.BAUI) BAUI.confirm(msg, cb); else { if (window.confirm(msg)) cb(true); else cb(false); } }
  function promptAction(msg, def, cb) { if (window.BAUI) BAUI.prompt(msg, def, cb); else { var r = window.prompt(msg, def); cb(r); } }
  var BAApp = function () { return window.BAApp || {}; };

  /* ---- Teacher data ---- */
  var TEACHER = {
    name: DB.settings.name || "Ms. Sadia",
    id: "T-2024-048",
    school: DB.settings.school || "Bahria College Karsaz",
    address: "Habib Rahmatullah Road, Karsaz, Karachi",
    subjects: ["Chemistry"],
    classes: [
      { id: "xc", name: "X-C", subject: "Chemistry", isClassTeacher: true, studentCount: 30 },
      { id: "xa", name: "X-A", subject: "Chemistry", isClassTeacher: false, studentCount: 28 }
    ]
  };

  var STUDENTS = {
    xc: [
      { id: "s1", name: "Muhammad Ali", roll: 1, notebook: "Excellent", review: "Excellent", marks: { a1: 18, a2: 17 }, attendance: {} },
      { id: "s2", name: "Ahmed Raza", roll: 2, notebook: "Complete", review: "Complete", marks: { a1: 16, a2: 19 }, attendance: {} },
      { id: "s3", name: "Ali Hassan", roll: 3, notebook: "Incomplete", review: "Incomplete", marks: { a1: 12, a2: 15 }, attendance: {} },
      { id: "s4", name: "Hassan Khan", roll: 4, notebook: "Needs Attention", review: "Needs Attention", marks: { a1: 14, a2: 11 }, attendance: {} },
      { id: "s5", name: "Bilal Shah", roll: 5, notebook: "Complete", review: "Not Reviewed", marks: { a1: 19, a2: 18 }, attendance: {} },
      { id: "s6", name: "Omar Farooq", roll: 6, notebook: "Excellent", review: "Excellent", marks: { a1: 20, a2: 19 }, attendance: {} },
      { id: "s7", name: "Zain Malik", roll: 7, notebook: "Complete", review: "Complete", marks: { a1: 15, a2: 16 }, attendance: {} },
      { id: "s8", name: "Hamza Tariq", roll: 8, notebook: "Incomplete", review: "Incomplete", marks: { a1: 10, a2: 13 }, attendance: {} },
      { id: "s9", name: "Usman Ghani", roll: 9, notebook: "Needs Attention", review: "Needs Attention", marks: { a1: 11, a2: 9 }, attendance: {} },
      { id: "s10", name: "Saad Altaf", roll: 10, notebook: "Excellent", review: "Excellent", marks: { a1: 17, a2: 20 }, attendance: {} }
    ],
    xa: [
      { id: "s11", name: "Faisal Noor", roll: 1, notebook: "Complete", review: "Complete", marks: { a1: 15, a2: 14 }, attendance: {} },
      { id: "s12", name: "Kamran Bhatti", roll: 2, notebook: "Excellent", review: "Excellent", marks: { a1: 19, a2: 18 }, attendance: {} },
      { id: "s13", name: "Danish Habib", roll: 3, notebook: "Incomplete", review: "Incomplete", marks: { a1: 9, a2: 11 }, attendance: {} },
      { id: "s14", name: "Rehan Qadir", roll: 4, notebook: "Complete", review: "Not Reviewed", marks: { a1: 14, a2: 16 }, attendance: {} },
      { id: "s15", name: "Talha Mirza", roll: 5, notebook: "Needs Attention", review: "Needs Attention", marks: { a1: 8, a2: 10 }, attendance: {} }
    ]
  };

  var ASSESSMENTS = [
    { id: "a1", name: "Assessment 1", maxMarks: 20, date: "2026-08-10" },
    { id: "a2", name: "Assessment 2", maxMarks: 20, date: "2026-08-22" }
  ];

  var REVIEW_STATUSES = ["Not Reviewed", "Incomplete", "Needs Attention", "Complete", "Excellent"];
  var REVIEW_COLORS = { "Not Reviewed": "#9ca3af", "Incomplete": "#ef4444", "Needs Attention": "#f59e0b", "Complete": "#3b82f6", "Excellent": "#10b981" };
  var ATTENDANCE_STATUSES = ["Present", "Absent", "Late", "Leave"];
  var ATTENDANCE_COLORS = { Present: "#10b981", Absent: "#ef4444", Late: "#f59e0b", Leave: "#6366f1" };

  var currentScreen = "home";
  var currentClass = null;
  var currentStudent = null;
  var currentMarkTab = null;
  var currentStudentTab = null;
  var currentClassTab = "students";
  var attendanceDate = new Date().toISOString().split("T")[0];
  var materialFilter = "classes";

  /* ---- Tab items for teacher mode ---- */
  var TEACHER_TABS = [
    { id: "home", label: "Home", svg: '<svg viewBox="0 0 24 24" fill="none"><path d="M3 9L12 2L21 9V20C21 20.53 20.53 21 20 21H4C3.47 21 3 20.53 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { id: "material", label: "Material", svg: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" stroke-width="2"/><line x1="9" y1="3" x2="9" y2="21" stroke="currentColor" stroke-width="2"/></svg>' },
    { id: "classes", label: "Classes", svg: '<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/><line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="2"/><line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="2"/></svg>' },
    { id: "students", label: "Students", svg: '<svg viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/><path d="M23 21v-2a4 4 0 00-3-3.87" stroke="currentColor" stroke-width="2"/><path d="M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="2"/></svg>' },
    { id: "settings", label: "Settings", svg: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3.2" stroke="currentColor" stroke-width="2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5 5l2.1 2.1M16.9 16.9 19 19M19 5l-2.1 2.1M7.1 16.9 5 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' }
  ];

  /* ---- Helpers ---- */
  function todayGreeting() {
    var now = new Date();
    var h = now.getHours(), m = now.getMinutes();
    var mins = h * 60 + m;
    var day = now.getDay();
    var name = TEACHER.name;
    /* Weekend */
    if (day === 6 || day === 0) return "Enjoy the weekend, " + name + " 🎉";
    /* Friday after 12:15 = weekend */
    if (day === 5 && mins >= 12 * 60 + 15) return "Enjoy the weekend, " + name + " 🎉";
    /* Weekday */
    if (mins < 6 * 60) return "Sleep tight, " + name + " 😴";
    if (mins < 7 * 60) return "Good morning, " + name + " ☀️";
    if (mins < 8 * 60) return "Good morning, " + name + " — first class soon! 📋";
    if (mins < 10 * 60) return "Good morning, " + name + " — classes in session 🧪";
    if (mins < 12 * 60) return "Morning, " + name + " — keep teaching! 💪";
    if (mins < 13 * 60) return "Lunch time, " + name + " 🍽️";
    if (mins < 15 * 60) return "Good afternoon, " + name + " — afternoon classes 📚";
    if (mins < 17 * 60) return "Good afternoon, " + name + " — wrapping up 📝";
    if (mins < 19 * 60) return "Good evening, " + name + " — reviews & prep ✏️";
    if (mins < 21 * 60) return "Good evening, " + name + " 🌙";
    return "Good night, " + name + " 😴";
  }
  function todayDateStr() {
    var d = new Date();
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    return d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
  }
  function todayShort() {
    var d = new Date();
    var y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2,"0"), day = String(d.getDate()).padStart(2,"0");
    return y+"-"+m+"-"+day;
  }
  function todayStamp() {
    var d = new Date();
    var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
  }
  function dayKey() { return ["sun","mon","tue","wed","thu","fri","sat"][new Date().getDay()]; }

  /* ============================================================
     MAIN ENTRY — activate teacher mode within app-shell
     ============================================================ */
  function activate() {
    document.querySelectorAll(".ba-screen").forEach(function (s) { s.style.display = "none"; s.classList.remove("ba-screen-active"); });
    var fab = $("fab-new"); if (fab) fab.style.display = "none";
    var fb = $("focus-bar"); if (fb) fb.style.display = "none";

    var hdrSchool = $("hdr-school");
    var hdrClass = $("hdr-class");
    if (hdrSchool) hdrSchool.textContent = TEACHER.school;
    if (hdrClass) hdrClass.textContent = "Teacher · " + TEACHER.subjects.join(", ");

    var tabbar = $("ba-tabbar");
    if (tabbar) {
      var html = "";
      TEACHER_TABS.forEach(function (tab) {
        html += '<button class="ba-tabbar-item' + (tab.id === currentScreen ? " active" : "") + '" data-section="' + tab.id + '">' + tab.svg + '<span>' + tab.label + '</span></button>';
      });
      tabbar.innerHTML = html;
      tabbar.querySelectorAll(".ba-tabbar-item").forEach(function (btn) {
        btn.addEventListener("click", function () {
          currentScreen = btn.getAttribute("data-section");
          renderTeacherScreen(currentScreen);
          updateTabbar();
        });
      });
    }
    renderTeacherScreen(currentScreen);
  }

  function updateTabbar() {
    var tabbar = $("ba-tabbar");
    if (!tabbar) return;
    tabbar.querySelectorAll(".ba-tabbar-item").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-section") === currentScreen);
    });
  }

  function renderTeacherScreen(screen) {
    currentScreen = screen;
    var main = $("ba-main");
    if (!main) return;
    switch (screen) {
      case "home": main.innerHTML = renderHome(); bindHome(); break;
      case "material": main.innerHTML = renderStudyMaterial(); bindStudyMaterial(); break;
      case "classes": main.innerHTML = renderMyClasses(); bindMyClasses(); break;
      case "students": main.innerHTML = renderStudents(); bindStudents(); break;
      case "settings": main.innerHTML = renderTeacherSettings(); bindTeacherSettings(); break;
      case "class-detail": main.innerHTML = renderClassDetail(); bindClassDetail(); break;
      case "student-detail": main.innerHTML = renderStudentDetail(); bindStudentDetail(); break;
      case "marks": main.innerHTML = renderMarks(); bindMarks(); break;
      case "attendance": main.innerHTML = renderAttendance(); bindAttendance(); break;
      case "notebook-view": main.innerHTML = renderNotebookView(); bindNotebookView(); break;
    }
    updateTabbar();
  }

  function navigateTo(screen, extra) {
    if (extra) {
      if (extra.cls) currentClass = extra.cls;
      if (extra.student) currentStudent = extra.student;
      if (extra.tab) currentStudentTab = extra.tab;
      if (extra.classTab) currentClassTab = extra.classTab;
      if (extra.doc) currentViewDoc = extra.doc;
    }
    renderTeacherScreen(screen);
  }

  /* ============================================================
     1. HOME
     ============================================================ */
  function renderHome() {
    var totalStudents = TEACHER.classes.reduce(function (a, c) { return a + c.studentCount; }, 0);
    var totalMaterial = getTeacherMaterial().length;
    var reviewCount = 0;
    TEACHER.classes.forEach(function (cls) {
      (STUDENTS[cls.id] || []).forEach(function (s) {
        if (s.review === "Incomplete" || s.review === "Needs Attention") reviewCount++;
      });
    });
    var todaySchedule = getTodaySchedule();
    var needsAttention = getNeedsAttention();

    var h = '<div class="ba-container">';
    h += '<div class="ba-home-greeting">' + todayGreeting() + '</div>';
    h += '<div style="font-size:.8rem;color:var(--silver);margin-bottom:1rem;">' + esc(TEACHER.subjects.join(", ")) + " Teacher · " + esc(TEACHER.school) + " · " + todayDateStr() + '</div>';

    h += '<div class="td-quick-cards">';
    h += quickCard(TEACHER.classes.length, "My Classes", "#3b82f6");
    h += quickCard(totalStudents, "Students", "#8b5cf6");
    h += quickCard(totalMaterial, "Material", "#f59e0b");
    h += quickCard(reviewCount, "To Review", "#ef4444");
    h += '</div>';

    h += '<div class="ba-section-block"><div class="ba-section-title">TODAY\'S CLASSES</div>';
    h += '<div class="ba-today-list">';
    if (todaySchedule.length === 0) {
      h += '<div style="padding:1rem;text-align:center;color:var(--silver);">No classes today</div>';
    } else {
      todaySchedule.forEach(function (cls) {
        h += '<div class="td-class-row"><div><div class="td-class-name">' + esc(cls.class) + ' · ' + esc(cls.subject) + '</div><div class="td-class-time">' + esc(cls.time) + '</div></div></div>';
      });
    }
    h += '</div></div>';

    h += '<div class="ba-section-block"><div class="ba-section-title">NEEDS ATTENTION</div><div class="ba-today-list">';
    if (needsAttention.length === 0) {
      h += '<div style="padding:1rem;text-align:center;color:var(--silver);">All students are on track ✓</div>';
    } else {
      needsAttention.forEach(function (item) {
        h += '<div class="td-student-row td-needs-attention" data-sid="' + item.sid + '" data-cid="' + item.cid + '">';
        h += '<div class="td-student-avatar" style="background:' + (REVIEW_COLORS[item.review] || "#9ca3af") + '">' + esc(item.name.charAt(0)) + '</div>';
        h += '<div class="td-student-info"><div class="td-student-name">' + esc(item.name) + '</div>';
        h += '<div class="td-student-meta">' + esc(item.className) + ' · ' + esc(item.review) + '</div></div>';
        h += '<span class="td-arrow">→</span></div>';
      });
    }
    h += '</div></div>';
    h += '</div>';
    return h;
  }

  function quickCard(value, label, color) {
    return '<div class="td-quick-card"><div class="td-quick-card-value" style="color:' + color + '">' + value + '</div><div class="td-quick-card-label">' + label + '</div></div>';
  }

  function getTodaySchedule() {
    var dk = dayKey();
    var schedule = [];
    if (dk === "sat" || dk === "sun") return [];
    var times = { mon: ["08:00–08:40", "08:40–09:20"], tue: ["08:00–08:40"], wed: ["09:20–10:00"], thu: ["08:00–08:40"], fri: ["08:00–08:40"] };
    TEACHER.classes.forEach(function (cls, i) {
      var t = (times[dk] || [])[i] || "08:00–08:40";
      schedule.push({ class: cls.name, subject: cls.subject, time: t });
    });
    return schedule;
  }

  function getNeedsAttention() {
    var list = [];
    TEACHER.classes.forEach(function (cls) {
      (STUDENTS[cls.id] || []).forEach(function (s) {
        if (s.review === "Incomplete" || s.review === "Needs Attention" || s.review === "Not Reviewed") {
          list.push({ sid: s.id, cid: cls.id, name: s.name, className: cls.name, subject: cls.subject, review: s.review });
        }
      });
    });
    return list.slice(0, 5);
  }

  function bindHome() {
    document.querySelectorAll(".td-needs-attention").forEach(function (el) {
      el.addEventListener("click", function () {
        var cls = TEACHER.classes.find(function (c) { return c.id === el.dataset.cid; });
        var stu = (STUDENTS[el.dataset.cid] || []).find(function (s) { return s.id === el.dataset.sid; });
        if (cls && stu) navigateTo("student-detail", { cls: cls, student: stu, tab: "info" });
      });
    });
  }

  /* ============================================================
     2. STUDY MATERIAL — real books + student notebooks
     ============================================================ */
  function getTeacherMaterial() {
    var app = BAApp();
    var items = [];

    /* Get real books from store (Chemistry textbook) */
    TEACHER.classes.forEach(function (cls) {
      var subjectDocs = app.getDocumentsBySubject ? app.getDocumentsBySubject(cls.subject) : [];
      subjectDocs.forEach(function (d) {
        if (d.type === "book") {
          items.push({ id: d.id, name: d.title || (cls.subject + " — Class X"), class: cls.name, type: "book", doc: d });
        }
      });
    });

    /* Extra material */
    items.push({ id: "extra-lab", name: "Lab Manual", class: "All", type: "doc", doc: null });
    items.push({ id: "extra-formula", name: "Formula / Reference Material", class: "All", type: "doc", doc: null });
    items.push({ id: "extra-periodic", name: "Periodic Table Reference", class: "All", type: "reference", doc: null });
    items.push({ id: "extra-guide", name: "Exam Preparation Guide", class: "All", type: "guide", doc: null });

    return items;
  }

  function renderStudyMaterial() {
    var material = getTeacherMaterial();
    var h = '<div class="ba-container">';
    h += '<div class="ba-screen-header"><h2 class="ba-title-4">Study Material</h2></div>';
    h += '<div class="ba-sch-tabs" id="sm-tabs">';
    h += '<button class="ba-sch-tab ' + (materialFilter === "classes" ? "ba-sch-tab-active" : "") + '" data-filter="classes">My Classes</button>';
    h += '<button class="ba-sch-tab ' + (materialFilter === "books" ? "ba-sch-tab-active" : "") + '" data-filter="books">Books</button>';
    h += '<button class="ba-sch-tab ' + (materialFilter === "other" ? "ba-sch-tab-active" : "") + '" data-filter="other">Other</button>';
    h += '</div>';
    h += '<div id="sm-grid"></div>';
    h += '</div>';
    return h;
  }

  function renderMaterialGrid(filter) {
    materialFilter = filter;
    var grid = $("sm-grid");
    if (!grid) return;
    var items = getTeacherMaterial();

    if (filter === "books") items = items.filter(function (m) { return m.type === "book"; });
    else if (filter === "other") items = items.filter(function (m) { return m.type !== "book" && m.type !== "notebook"; });

    /* Group by class */
    var groups = {};
    items.forEach(function (m) {
      var g = m.class || "Other";
      if (!groups[g]) groups[g] = [];
      groups[g].push(m);
    });

    var html = '';
    Object.keys(groups).forEach(function (cls) {
      html += '<div style="margin-bottom:1rem;">';
      html += '<div class="ba-section-title" style="margin-bottom:.4rem;">' + esc(cls) + '</div>';
      groups[cls].forEach(function (m) {
        var icon = m.type === "book" ? "📖" : m.type === "notebook" ? "📓" : "📄";
        var typeLabel = m.type === "book" ? "Textbook" : m.type === "notebook" ? m.review || "Notebook" : m.type;
        var extra = "";
        if (m.type === "notebook") {
          /* Share with VP badge */
          extra = '<span style="font-size:.6rem;padding:.15rem .4rem;border-radius:4px;font-weight:700;background:#ede9fe;color:#6d28d9;margin-left:.3rem;">VP</span>';
        }
        html += '<div class="td-material-card td-mat-tap" data-mat-id="' + m.id + '">';
        html += '<div class="td-material-icon" style="font-size:1.2rem;">' + icon + '</div>';
        html += '<div class="td-material-info"><div class="td-material-name">' + esc(m.name) + extra + '</div>';
        html += '<div class="td-material-type">' + esc(typeLabel) + '</div></div>';
        html += '<span class="td-arrow" style="font-size:.9rem;">→</span>';
        html += '</div>';
      });
      html += '</div>';
    });
    grid.innerHTML = html || '<div class="ba-homework-access">No material found</div>';

    /* Bind clicks */
    grid.querySelectorAll(".td-mat-tap").forEach(function (el) {
      el.addEventListener("click", function () {
        var matId = el.dataset.matId;
        var mat = getTeacherMaterial().find(function (m) { return m.id === matId; });
        if (!mat) return;
        if (mat.type === "book" && mat.doc) {
          /* Open book in PDF reader — same as student mode */
          var app = BAApp();
          if (app.openDocument) {
            app.openDocument(mat.doc);
          } else {
            notify("PDF reader not available.");
          }
        } else {
          notify("Material: " + mat.name);
        }
      });
    });
  }

  function bindStudyMaterial() {
    renderMaterialGrid(materialFilter);
    var tabs = $("sm-tabs");
    if (tabs) tabs.addEventListener("click", function (e) {
      var btn = e.target.closest(".ba-sch-tab");
      if (!btn) return;
      tabs.querySelectorAll(".ba-sch-tab").forEach(function (t) { t.classList.remove("ba-sch-tab-active"); });
      btn.classList.add("ba-sch-tab-active");
      renderMaterialGrid(btn.dataset.filter);
    });
  }

  /* ============================================================
     NOTEBOOK VIEWER — stamp, comment, share with VP
     ============================================================ */
  var currentViewDoc = null;
  var nbCurrentPage = 0;
  var nbStamps = {};  /* docId -> { pageIdx: [{ text, date }] } */
  var nbComments = {};  /* docId -> { pageIdx: "comment text" } */
  var nbVPShared = {};  /* docId -> true */

  function renderNotebookView() {
    if (!currentViewDoc) return '<div class="ba-container"><div class="ba-homework-access">No notebook selected</div></div>';
    var mat = currentViewDoc;
    var studentName = mat.studentName || "Student";
    var className = mat.class || "";
    var doc = mat.doc;

    var h = '<div class="ba-container">';
    h += '<div class="ba-screen-header">';
    h += '<div id="nv-back" style="color:var(--blue);cursor:pointer;font-weight:700;font-size:.9rem;margin-bottom:.5rem;">← Back to Material</div>';
    h += '<h2 class="ba-title-4">' + esc(studentName) + '</h2>';
    h += '<div style="font-size:.8rem;color:var(--silver);">' + esc(className) + ' · Chemistry Notebook</div></div>';

    /* Notebook info */
    h += '<div class="ba-homework-access"><div><div class="ba-section-title">Status</div><div style="font-size:.9rem;"><span style="font-size:.7rem;padding:.2rem .5rem;border-radius:6px;font-weight:700;color:#fff;background:' + (REVIEW_COLORS[mat.review] || "#9ca3af") + '">' + esc(mat.review || "Not Reviewed") + '</span></div></div></div>';

    /* Pages list */
    var pages = [];
    if (doc && doc.pages) {
      pages = doc.pages;
    } else {
      /* Simulate empty notebook pages */
      pages = [{ id: "p1", paper: "ruled" }, { id: "p2", paper: "ruled" }];
    }

    h += '<div class="ba-section-block" style="margin-top:1rem;"><div class="ba-section-title">PAGES (' + pages.length + ')</div>';
    h += '<div class="ba-today-list" id="nv-pages">';
    pages.forEach(function (pg, idx) {
      var pgStamps = (nbStamps[mat.id] || {})[idx] || [];
      var pgComment = (nbComments[mat.id] || {})[idx] || "";
      h += '<div class="td-student-row nv-page-tap" data-page="' + idx + '" style="cursor:pointer;">';
      h += '<div class="td-student-avatar" style="background:var(--blue);width:32px;height:32px;font-size:.75rem;">' + (idx + 1) + '</div>';
      h += '<div class="td-student-info"><div class="td-student-name" style="font-size:.85rem;">Page ' + (idx + 1) + '</div>';
      h += '<div class="td-student-meta">' + (pg.paper || "ruled") + ' paper';
      if (pgStamps.length) h += ' · <span style="color:#10b981;font-weight:600;">Signed</span>';
      if (pgComment) h += ' · <span style="color:#f59e0b;font-weight:600;">Commented</span>';
      h += '</div></div>';
      if (pgStamps.length) h += '<span style="font-size:.65rem;padding:.15rem .4rem;border-radius:4px;font-weight:700;background:#dcfce7;color:#166534;">✓ Signed</span>';
      h += '</div>';
    });
    h += '</div></div>';

    /* Actions */
    h += '<div style="display:flex;gap:.5rem;margin:1rem 0;flex-wrap:wrap;">';
    /* Share with VP */
    var isVP = nbVPShared[mat.id];
    h += '<button class="ba-button ' + (isVP ? 'ba-button-primary' : 'ba-button-secondary') + '" id="nv-vp" style="flex:1;min-width:140px;font-size:.82rem;">' + (isVP ? '✓ Shared with VP' : '📤 Share with Vice Principal') + '</button>';
    h += '</div>';

    h += '</div>';
    return h;
  }

  function bindNotebookView() {
    $("nv-back") && $("nv-back").addEventListener("click", function () {
      navigateTo("material");
    });

    /* Page tap — stamp + comment */
    document.querySelectorAll(".nv-page-tap").forEach(function (el) {
      el.addEventListener("click", function () {
        var pageIdx = parseInt(el.dataset.page);
        if (!currentViewDoc) return;
        var docId = currentViewDoc.id;

        /* Options: Stamp / Comment */
        promptAction("Page " + (pageIdx + 1) + " — Type a comment or leave blank for stamp only:", "", function (text) {
          if (text === null) return;
          /* Add stamp */
          if (!nbStamps[docId]) nbStamps[docId] = {};
          if (!nbStamps[docId][pageIdx]) nbStamps[docId][pageIdx] = [];
          nbStamps[docId][pageIdx].push({ text: "Signed — Ms. Sadia", date: todayStamp() });
          /* Add comment if any */
          if (text.trim()) {
            if (!nbComments[docId]) nbComments[docId] = {};
            nbComments[docId][pageIdx] = text.trim();
          }
          notify("Stamped page " + (pageIdx + 1) + " ✓");
          /* Re-render */
          renderTeacherScreen("notebook-view");
        });
      });
    });

    /* Share with VP */
    $("nv-vp") && $("nv-vp").addEventListener("click", function () {
      if (!currentViewDoc) return;
      var docId = currentViewDoc.id;
      if (nbVPShared[docId]) {
        nbVPShared[docId] = false;
        notify("Unshared from Vice Principal");
      } else {
        nbVPShared[docId] = true;
        notify("Shared with Vice Principal ✓");
      }
      renderTeacherScreen("notebook-view");
    });
  }

  /* ============================================================
     3. MY CLASSES
     ============================================================ */
  function renderMyClasses() {
    var h = '<div class="ba-container">';
    h += '<div class="ba-screen-header"><h2 class="ba-title-4">My Classes</h2></div>';
    TEACHER.classes.forEach(function (cls) {
      h += '<div class="ba-tool-card td-class-tap" data-class="' + cls.id + '">';
      h += '<div class="ba-tool-icon" style="background:#e0e7ff;color:#3b82f6;">📚</div>';
      h += '<div class="ba-tool-info"><div class="ba-section-title">' + esc(cls.name) + '</div>';
      h += '<div class="ba-homework-count">' + esc(cls.subject) + ' · ' + cls.studentCount + ' Students</div></div>';
      h += '<div class="ba-tool-arrow">→</div></div>';
    });
    h += '</div>';
    return h;
  }

  function bindMyClasses() {
    document.querySelectorAll(".td-class-tap").forEach(function (btn) {
      btn.addEventListener("click", function () {
        currentClass = TEACHER.classes.find(function (c) { return c.id === btn.dataset.class; });
        currentClassTab = "students";
        navigateTo("class-detail", { cls: currentClass });
      });
    });
  }

  /* ============================================================
     CLASS DETAIL
     ============================================================ */
  function renderClassDetail() {
    if (!currentClass) return '<div class="ba-container"><div class="ba-homework-access">No class selected</div></div>';
    var cls = currentClass;
    var students = STUDENTS[cls.id] || [];
    var needsReview = students.filter(function (s) { return s.review === "Incomplete" || s.review === "Needs Attention"; }).length;

    var h = '<div class="ba-container">';
    h += '<div class="ba-screen-header">';
    h += '<div id="cd-back" style="color:var(--blue);cursor:pointer;font-weight:700;font-size:.9rem;margin-bottom:.5rem;">← Back to Classes</div>';
    h += '<h2 class="ba-title-4">Class ' + esc(cls.name) + '</h2>';
    h += '<div style="font-size:.8rem;color:var(--silver);">' + esc(cls.subject) + ' · ' + cls.studentCount + ' Students · ' + needsReview + ' need review</div></div>';

    h += '<div class="ba-sch-tabs" id="cd-tabs">';
    h += '<button class="ba-sch-tab ' + (currentClassTab === "students" ? "ba-sch-tab-active" : "") + '" data-tab="students">Students</button>';
    h += '<button class="ba-sch-tab ' + (currentClassTab === "copies" ? "ba-sch-tab-active" : "") + '" data-tab="copies">Copies</button>';
    if (cls.isClassTeacher) h += '<button class="ba-sch-tab ' + (currentClassTab === "attendance" ? "ba-sch-tab-active" : "") + '" data-tab="attendance">Attendance</button>';
    h += '<button class="ba-sch-tab ' + (currentClassTab === "marks" ? "ba-sch-tab-active" : "") + '" data-tab="marks">Marks</button>';
    h += '</div>';

    h += '<div id="cd-content"></div>';
    h += '</div>';
    return h;
  }

  function renderClassTab(tab) {
    currentClassTab = tab;
    var content = $("cd-content");
    if (!content || !currentClass) return;
    var students = STUDENTS[currentClass.id] || [];

    if (tab === "students") {
      var html = '';
      students.forEach(function (s) {
        var total = (s.marks.a1 || 0) + (s.marks.a2 || 0);
        html += '<div class="td-student-row td-student-tap" data-student="' + s.id + '">';
        html += '<div class="td-student-avatar" style="background:' + (REVIEW_COLORS[s.review] || "#9ca3af") + '">' + esc(s.name.charAt(0)) + '</div>';
        html += '<div class="td-student-info"><div class="td-student-name">' + esc(s.name) + '</div>';
        html += '<div class="td-student-meta">' + esc(s.notebook) + ' · ' + total + '/40</div></div>';
        html += '<span style="font-size:.7rem;padding:.2rem .5rem;border-radius:6px;font-weight:700;color:#fff;background:' + (REVIEW_COLORS[s.review] || "#9ca3af") + '">' + esc(s.review) + '</span>';
        html += '</div>';
      });
      content.innerHTML = html || '<div class="ba-homework-access">No students</div>';
      content.querySelectorAll(".td-student-tap").forEach(function (el) {
        el.addEventListener("click", function () {
          var stu = students.find(function (s) { return s.id === el.dataset.student; });
          if (stu) navigateTo("student-detail", { student: stu, tab: "info" });
        });
      });
    } else if (tab === "copies") {
      var html = '';
      students.forEach(function (s) {
        html += '<div class="td-student-row td-student-tap" data-student="' + s.id + '">';
        html += '<div class="td-student-avatar" style="background:' + (REVIEW_COLORS[s.review] || "#9ca3af") + '">' + esc(s.name.charAt(0)) + '</div>';
        html += '<div class="td-student-info"><div class="td-student-name">' + esc(s.name) + '</div>';
        html += '<div class="td-student-meta">Primary ' + esc(currentClass.subject) + '</div></div>';
        html += '<span style="font-size:.7rem;padding:.2rem .5rem;border-radius:6px;font-weight:700;color:#fff;background:' + (REVIEW_COLORS[s.review] || "#9ca3af") + '">' + esc(s.review) + '</span>';
        html += '</div>';
      });
      content.innerHTML = html || '<div class="ba-homework-access">No copies</div>';
      content.querySelectorAll(".td-student-tap").forEach(function (el) {
        el.addEventListener("click", function () {
          /* Open the real notebook directly */
          var app = BAApp();
          var subjectDocs = app.getDocumentsBySubject ? app.getDocumentsBySubject(currentClass.subject) : [];
          var sysNb = subjectDocs.find(function (d) { return d.type === "notebook" && d.system; });
          if (sysNb && app.openDocument) {
            app.openDocument(sysNb);
          } else {
            var stu = students.find(function (s) { return s.id === el.dataset.student; });
            if (stu) navigateTo("student-detail", { student: stu, tab: "notebook" });
          }
        });
      });
    } else if (tab === "marks") {
      navigateTo("marks");
      return;
    } else if (tab === "attendance") {
      navigateTo("attendance");
      return;
    }
  }

  function bindClassDetail() {
    $("cd-back") && $("cd-back").addEventListener("click", function () { navigateTo("classes"); });
    var tabs = $("cd-tabs");
    if (tabs) {
      tabs.addEventListener("click", function (e) {
        var btn = e.target.closest(".ba-sch-tab");
        if (!btn) return;
        tabs.querySelectorAll(".ba-sch-tab").forEach(function (t) { t.classList.remove("ba-sch-tab-active"); });
        btn.classList.add("ba-sch-tab-active");
        renderClassTab(btn.dataset.tab);
      });
      renderClassTab(currentClassTab);
    }
  }

  /* ============================================================
     STUDENT DETAIL
     ============================================================ */
  function renderStudentDetail() {
    if (!currentStudent || !currentClass) return '<div class="ba-container"><div class="ba-homework-access">No student selected</div></div>';
    var s = currentStudent;
    var cls = currentClass;

    var h = '<div class="ba-container">';
    h += '<div class="ba-screen-header">';
    h += '<div id="sd-back" style="color:var(--blue);cursor:pointer;font-weight:700;font-size:.9rem;margin-bottom:.5rem;">← Back</div>';
    h += '<h2 class="ba-title-4">' + esc(s.name) + '</h2>';
    h += '<div style="font-size:.8rem;color:var(--silver);">' + esc(cls.name) + ' · Roll #' + s.roll + '</div></div>';

    h += '<div class="ba-sch-tabs" id="sd-tabs">';
    h += '<button class="ba-sch-tab ' + (currentStudentTab === "info" ? "ba-sch-tab-active" : "") + '" data-tab="info">Info</button>';
    h += '<button class="ba-sch-tab ' + (currentStudentTab === "notebook" ? "ba-sch-tab-active" : "") + '" data-tab="notebook">Notebook</button>';
    h += '</div>';

    if (currentStudentTab === "info") {
      h += '<div class="ba-homework-access"><div><div class="ba-section-title">Name</div><div style="font-size:.9rem;">' + esc(s.name) + '</div></div></div>';
      h += '<div class="ba-homework-access"><div><div class="ba-section-title">Class</div><div style="font-size:.9rem;">' + esc(cls.name) + '</div></div></div>';
      h += '<div class="ba-homework-access"><div><div class="ba-section-title">Roll Number</div><div style="font-size:.9rem;">' + s.roll + '</div></div></div>';
      h += '<div class="ba-homework-access"><div><div class="ba-section-title">Subject</div><div style="font-size:.9rem;">' + esc(cls.subject) + '</div></div></div>';
      h += '<div class="ba-homework-access"><div><div class="ba-section-title">Notebook</div><div style="font-size:.9rem;">Primary ' + esc(cls.subject) + '</div></div></div>';

      h += '<div class="ba-section-block" style="margin-top:1rem;"><div class="ba-section-title">REVIEW STATUS</div>';
      h += '<div style="display:flex;flex-wrap:wrap;gap:.4rem;">';
      REVIEW_STATUSES.forEach(function (st) {
        var isActive = s.review === st;
        h += '<button class="td-review-option' + (isActive ? " td-review-active" : "") + '" data-status="' + st + '" style="border:2px solid ' + REVIEW_COLORS[st] + ';color:' + (isActive ? "#fff" : REVIEW_COLORS[st]) + ';background:' + (isActive ? REVIEW_COLORS[st] : "transparent") + ';border-radius:8px;padding:.35rem .7rem;font-size:.78rem;font-weight:700;cursor:pointer;">' + esc(st) + '</button>';
      });
      h += '</div></div>';
    } else if (currentStudentTab === "notebook") {
      h += '<div class="ba-homework-access"><div><div class="ba-section-title">Notebook</div><div style="font-size:.9rem;">Primary ' + esc(cls.subject) + '</div></div></div>';
      h += '<div class="ba-homework-access"><div><div class="ba-section-title">Status</div><div style="font-size:.9rem;"><span style="font-size:.7rem;padding:.2rem .5rem;border-radius:6px;font-weight:700;color:#fff;background:' + (REVIEW_COLORS[s.review] || "#9ca3af") + '">' + esc(s.review) + '</span></div></div></div>';
      h += '<div class="ba-homework-access"><div><div class="ba-section-title">Shared</div><div style="font-size:.9rem;color:#10b981;font-weight:600;">Yes</div></div></div>';

      /* Open notebook button */
      var matItem = { id: "nb-" + s.id, name: s.name + " — " + cls.subject + " Notebook", studentName: s.name, studentId: s.id, class: cls.name, classId: cls.id, type: "notebook", review: s.review, doc: null };
      h += '<div style="padding:1rem 0;"><button class="ba-button ba-button-primary td-open-nb" style="width:100%;">Open Notebook</button></div>';
    }
    h += '</div>';
    return h;
  }

  function bindStudentDetail() {
    $("sd-back") && $("sd-back").addEventListener("click", function () {
      navigateTo("class-detail", { tab: currentClassTab });
    });
    document.querySelectorAll(".td-review-option").forEach(function (btn) {
      btn.addEventListener("click", function () {
        currentStudent.review = btn.dataset.status;
        renderTeacherScreen("student-detail");
      });
    });
    var tabs = $("sd-tabs");
    if (tabs) tabs.addEventListener("click", function (e) {
      var btn = e.target.closest(".ba-sch-tab");
      if (!btn) return;
      currentStudentTab = btn.dataset.tab;
      renderTeacherScreen("student-detail");
    });
    /* Open notebook — same editor as student mode */
    document.querySelectorAll(".td-open-nb").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var app = BAApp();
        /* Find the system notebook for this subject */
        var subjectDocs = app.getDocumentsBySubject ? app.getDocumentsBySubject(currentClass.subject) : [];
        var sysNb = subjectDocs.find(function (d) { return d.type === "notebook" && d.system; });
        if (sysNb && app.openDocument) {
          app.openDocument(sysNb);
        } else {
          notify("Notebook not found.");
        }
      });
    });
  }

  /* ============================================================
     MARKS
     ============================================================ */
  function renderMarks() {
    if (!currentClass) return '<div class="ba-container"><div class="ba-homework-access">Select a class first</div></div>';
    var students = STUDENTS[currentClass.id] || [];
    var h = '<div class="ba-container">';
    h += '<div class="ba-screen-header">';
    h += '<div id="mk-back" style="color:var(--blue);cursor:pointer;font-weight:700;font-size:.9rem;margin-bottom:.5rem;">← Back</div>';
    h += '<h2 class="ba-title-4">Marks — ' + esc(currentClass.name) + '</h2>';
    h += '<div style="font-size:.8rem;color:var(--silver);">' + esc(currentClass.subject) + '</div></div>';

    ASSESSMENTS.forEach(function (a) {
      h += '<div class="ba-section-block"><div class="ba-section-title">' + esc(a.name) + ' (out of ' + a.maxMarks + ')</div>';
      h += '<div class="ba-today-list">';
      students.forEach(function (s) {
        var val = s.marks[a.id] || 0;
        h += '<div class="td-student-row">';
        h += '<div class="td-student-avatar" style="background:var(--blue);width:32px;height:32px;font-size:.75rem;">' + esc(s.name.charAt(0)) + '</div>';
        h += '<div class="td-student-info"><div class="td-student-name" style="font-size:.82rem;">' + esc(s.name) + '</div></div>';
        h += '<input class="td-mark-input" data-student="' + s.id + '" data-assessment="' + a.id + '" type="number" min="0" max="' + a.maxMarks + '" value="' + val + '" style="width:56px;padding:.3rem;border:1px solid var(--mercury);border-radius:6px;text-align:center;font-size:.85rem;font-weight:700;">';
        h += '</div>';
      });
      h += '</div></div>';
    });

    h += '<div style="display:flex;gap:.5rem;margin:1rem 0;">';
    h += '<button class="ba-button ba-button-primary" id="mk-add" style="flex:1;">+ Add Assessment</button>';
    h += '<button class="ba-button ba-button-primary" id="mk-save" style="flex:1;">Save Marks</button>';
    h += '</div>';
    h += '</div>';
    return h;
  }

  function bindMarks() {
    $("mk-back") && $("mk-back").addEventListener("click", function () { navigateTo("class-detail", { tab: "marks" }); });
    $("mk-save") && $("mk-save").addEventListener("click", function () {
      document.querySelectorAll(".td-mark-input").forEach(function (input) {
        var s = (STUDENTS[currentClass.id] || []).find(function (st) { return st.id === input.dataset.student; });
        if (s) s.marks[input.dataset.assessment] = parseInt(input.value) || 0;
      });
      notify("Marks saved!");
      renderTeacherScreen("marks");
    });
    $("mk-add") && $("mk-add").addEventListener("click", function () {
      promptAction("Assessment name:", "", function (name) {
        if (!name) return;
        promptAction("Maximum marks:", "20", function (max) {
          if (!max) return;
          ASSESSMENTS.push({ id: "a" + (ASSESSMENTS.length + 1), name: name, maxMarks: parseInt(max) || 20, date: todayShort() });
          renderTeacherScreen("marks");
        });
      });
    });
    document.querySelectorAll(".td-mark-input").forEach(function (input) {
      input.addEventListener("input", function () { /* live total */ });
    });
  }

  /* ============================================================
     ATTENDANCE
     ============================================================ */
  function renderAttendance() {
    if (!currentClass) return '<div class="ba-container"><div class="ba-homework-access">Select a class first</div></div>';
    var students = STUDENTS[currentClass.id] || [];
    var h = '<div class="ba-container">';
    h += '<div class="ba-screen-header">';
    h += '<div id="att-back" style="color:var(--blue);cursor:pointer;font-weight:700;font-size:.9rem;margin-bottom:.5rem;">← Back</div>';
    h += '<h2 class="ba-title-4">Attendance — ' + esc(currentClass.name) + '</h2></div>';

    h += '<div class="ba-homework-access"><div><div class="ba-section-title">Date</div></div><input type="date" id="att-date" value="' + attendanceDate + '" style="border:1px solid var(--mercury);border-radius:8px;padding:.4rem .6rem;font-size:.85rem;"></div>';

    h += '<div class="ba-today-list" id="att-list">';
    students.forEach(function (s) {
      var status = (s.attendance && s.attendance[attendanceDate]) || "";
      h += '<div class="td-student-row">';
      h += '<div class="td-student-avatar" style="width:32px;height:32px;font-size:.75rem;">' + esc(s.name.charAt(0)) + '</div>';
      h += '<div class="td-student-info"><div class="td-student-name" style="font-size:.85rem;">' + esc(s.name) + '</div></div>';
      h += '<div style="display:flex;gap:.2rem;">';
      ATTENDANCE_STATUSES.forEach(function (st) {
        var isActive = status === st;
        h += '<button class="td-att-btn' + (isActive ? " active" : "") + '" data-student="' + s.id + '" data-status="' + st + '" style="border:1px solid ' + ATTENDANCE_COLORS[st] + ';background:' + (isActive ? ATTENDANCE_COLORS[st] : "transparent") + ';color:' + (isActive ? "#fff" : ATTENDANCE_COLORS[st]) + ';border-radius:6px;padding:.2rem .4rem;font-size:.65rem;font-weight:700;cursor:pointer;">' + esc(st.charAt(0)) + '</button>';
      });
      h += '</div></div>';
    });
    h += '</div>';

    h += '<button class="ba-button ba-button-primary" id="att-save" style="width:100%;margin:1rem 0;">Save Attendance</button>';
    h += '</div>';
    return h;
  }

  function bindAttendance() {
    $("att-back") && $("att-back").addEventListener("click", function () { navigateTo("class-detail", { tab: "attendance" }); });
    $("att-date") && $("att-date").addEventListener("change", function (e) {
      attendanceDate = e.target.value;
      renderTeacherScreen("attendance");
    });
    var list = $("att-list");
    if (list) list.addEventListener("click", function (e) {
      var btn = e.target.closest(".td-att-btn");
      if (!btn) return;
      var row = btn.closest(".td-student-row");
      if (!row) return;
      row.querySelectorAll(".td-att-btn").forEach(function (b) { b.classList.remove("active"); b.style.background = "transparent"; b.style.color = ATTENDANCE_COLORS[b.dataset.status]; });
      btn.classList.add("active");
      btn.style.background = ATTENDANCE_COLORS[btn.dataset.status];
      btn.style.color = "#fff";
      var s = (STUDENTS[currentClass.id] || []).find(function (st) { return st.id === btn.dataset.student; });
      if (s) { if (!s.attendance) s.attendance = {}; s.attendance[attendanceDate] = btn.dataset.status; }
    });
    $("att-save") && $("att-save").addEventListener("click", function () { notify("Attendance saved for " + attendanceDate); });
  }

  /* ============================================================
     STUDENTS (searchable directory)
     ============================================================ */
  function renderStudents() {
    var h = '<div class="ba-container">';
    h += '<div class="ba-screen-header"><h2 class="ba-title-4">Students</h2></div>';
    h += '<div class="ba-form-group"><input type="text" id="stu-search" placeholder="Search students..." style="width:100%;padding:.7rem;border:1px solid var(--mercury);border-radius:10px;font-size:.9rem;"></div>';
    h += '<div id="stu-grid"></div>';
    h += '</div>';
    return h;
  }

  function renderStudentGrid() {
    var grid = $("stu-grid");
    if (!grid) return;
    var search = (($("stu-search") || {}).value || "").toLowerCase();

    var html = '';
    TEACHER.classes.forEach(function (cls) {
      (STUDENTS[cls.id] || []).forEach(function (s) {
        if (search && s.name.toLowerCase().indexOf(search) === -1) return;
        html += '<div class="td-student-row td-view-stu" data-student="' + s.id + '" data-class="' + cls.id + '">';
        html += '<div class="td-student-avatar" style="background:var(--blue);">' + esc(s.name.charAt(0)) + '</div>';
        html += '<div class="td-student-info"><div class="td-student-name">' + esc(s.name) + '</div>';
        html += '<div class="td-student-meta">' + esc(cls.name) + ' · ' + esc(cls.subject) + '</div></div>';
        html += '<span class="td-arrow">→</span></div>';
      });
    });
    grid.innerHTML = html || '<div class="ba-homework-access">No students found</div>';
    grid.querySelectorAll(".td-view-stu").forEach(function (el) {
      el.addEventListener("click", function () {
        var cls = TEACHER.classes.find(function (c) { return c.id === el.dataset.class; });
        var stu = (STUDENTS[el.dataset.class] || []).find(function (s) { return s.id === el.dataset.student; });
        if (cls && stu) navigateTo("student-detail", { cls: cls, student: stu, tab: "info" });
      });
    });
  }

  function bindStudents() {
    renderStudentGrid();
    var search = $("stu-search");
    if (search) search.addEventListener("input", renderStudentGrid);
  }

  /* ============================================================
     SETTINGS
     ============================================================ */
  function renderTeacherSettings() {
    var curTheme = DB.settings.theme || 'system';
    var h = '<div class="ba-container">';
    h += '<div class="ba-screen-header"><h2 class="ba-title-4">Settings</h2></div>';
    h += '<div class="ba-settings-content">';

    h += '<div class="ba-setting-group"><div class="ba-section-title">YOUR PROFILE</div>';
    h += '<div class="ba-form-row"><label>Name</label><input id="ts-name" placeholder="Teacher Name" value="' + esc(TEACHER.name) + '"></div>';
    h += '<div class="ba-form-row"><label>Teacher ID</label><input id="ts-id" value="' + esc(TEACHER.id) + '" readonly style="background:var(--concrete);color:var(--silver);"></div>';
    h += '</div>';

    h += '<div class="ba-setting-group"><div class="ba-section-title">SCHOOL INFO</div>';
    h += '<div class="ba-settings-school">';
    h += '<img src="assets/bahria-clg-logo.png" alt="School" class="ba-settings-school-logo">';
    h += '<div class="ba-settings-school-name">' + esc(TEACHER.school) + '</div>';
    h += '<div class="ba-settings-school-row"><span>Address</span><span>Habib Rahmatullah Road, Karsaz, Karachi</span></div>';
    h += '<div class="ba-settings-school-row"><span>Subjects</span><span>' + esc(TEACHER.subjects.join(", ")) + '</span></div>';
    h += '<div class="ba-settings-school-row"><span>Classes</span><span>' + esc(TEACHER.classes.map(function (c) { return c.name; }).join(", ")) + '</span></div>';
    h += '</div>';
    h += '</div>';

    h += '<div class="ba-setting-group"><div class="ba-section-title">PREFERENCES</div>';
    h += '<div class="ba-form-row"><label>Theme</label><select id="ts-theme"><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></select></div>';
    h += '</div>';

    h += '<div class="ba-setting-group"><div class="ba-section-title">ACCOUNT</div>';
    h += '<button class="ba-button ba-button-secondary" id="ts-logout" style="width:100%;color:#ef4444;border-color:#fca5a5;">Log Out</button>';
    h += '</div>';

    h += '<div class="ba-form-row" style="border:none;"><label>Version</label><span style="color:var(--silver);cursor:pointer;font-size:.85rem;padding:.3rem .6rem;border-radius:8px;">1.0.0</span></div>';
    h += '<div class="ba-credit-block">Backpack Air · A project of MO Digital</div>';
    h += '</div>';
    h += '</div>';
    return h;
  }

  function bindTeacherSettings() {
    var ts = $("ts-theme");
    if (ts) {
      ts.value = DB.settings.theme || "system";
      ts.addEventListener("change", function () {
        DB.settings.theme = this.value;
        S.saveSettings(DB.settings);
        var t = DB.settings.theme || 'system';
        var dark = t === 'dark' || (t === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
        document.body.classList.toggle('theme-dark', !!dark);
      });
    }
    var tn = $("ts-name");
    if (tn) tn.addEventListener("input", function () {
      DB.settings.name = this.value;
      S.saveSettings(DB.settings);
    });
    $("ts-logout") && $("ts-logout").addEventListener("click", function () {
      confirmAction("Log out and return to onboarding?", function (yes) {
        if (yes) {
          DB.settings.onboarded = false;
          DB.settings.isTeacher = false;
          delete DB.settings.teacherCode;
          S.saveSettings(DB.settings);
          location.reload();
        }
      });
    });
  }

  /* ============================================================
     PUBLIC API
     ============================================================ */
  function init() { activate(); }

  return { init: init, activate: activate, renderScreen: renderTeacherScreen };
})();
