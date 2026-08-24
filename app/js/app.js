/* ============================================================
   BACKPACK AIR — Document System V2 (app logic)
   Depends on: store.js (window.BAStore)
   ============================================================ */
(function () {
  "use strict";
  var S = window.BAStore;
  var DB = S.load();

function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return ({ "&": "&", "<": "<", ">": ">", '"': "\"", "'": "'" })[c]; }); }
  function openModal(id) {
    var m = $(id);
    if (!m) return;
    if (!m.classList.contains("ba-modal-bottom")) {
      document.querySelectorAll(".ba-modal.ba-modal-open:not(.ba-modal-bottom)").forEach(function (other) {
        if (other !== m) other.classList.remove("ba-modal-open");
      });
    }
    m.classList.add("ba-modal-open");
    console.log("[openModal] opened:", id);
  }
  function closeModal(id) { var m = $(id); if (m) { m.classList.remove("ba-modal-open"); console.log("[closeModal] closed:", id); } }
  function closeAllModals() { document.querySelectorAll(".ba-modal.ba-modal-open").forEach(function (m) { m.classList.remove("ba-modal-open"); console.log("[closeAllModals] closed:", m.id); }); }

  /* A4 virtual page size (96 dpi portrait) — resolution independent coordinates */
  var A4_W = 794, A4_H = 1123;

  /* ---------- SUBJECTS & TIMETABLE (config, not user data) ---------- */
  var SUBJECTS = S.SYSTEM_SUBJECTS;
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
  function getSubject(name) { for (var i = 0; i < SUBJECTS.length; i++) if (SUBJECTS[i].subject === name) return SUBJECTS[i]; return null; }

/*__APPEND__*/

  /* ---------- theme / header ---------- */
  function applyTheme() {
    var t = DB.settings.theme || "system";
    var dark = t === "dark" || (t === "system" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.body.classList.toggle("theme-dark", !!dark);
  }
  function applyHeader() {
    if ($("hdr-school")) $("hdr-school").textContent = DB.settings.school || "Bahria College Karsaz";
    if ($("hdr-class")) $("hdr-class").textContent = "Class " + (DB.settings.class || "X") + "-" + (DB.settings.section || "C");
  }

  /* ---------- navigation ---------- */
  function navigate(section) {
    document.querySelectorAll(".ba-tabbar-item").forEach(function (it) {
      var on = it.getAttribute("data-section") === section;
      it.classList.toggle("active", on);
    });
    document.querySelectorAll(".ba-screen").forEach(function (sc) {
      sc.classList.toggle("ba-screen-active", sc.getAttribute("data-section") === section);
    });
    var m = $("ba-main"); if (m) m.scrollTop = 0;
    if (section === "settings") {
      var sn = $("setting-name"); if (sn) sn.value = DB.settings.userName || "";
      renderSettingsSchoolInfo();
    }
  }

  /* ---------- onboarding ---------- */
  function setupOnboarding() {
    var ob = $("onboarding");
    if (!ob) return;
    if (DB.settings.onboarded) { closeModal("onboarding"); }
    else { openModal("onboarding"); }
  }
  function initOnboardingEvents() {
    var codeInput = $("onb-code");
    var classGroup = $("onb-class-group");
    if (codeInput) {
      codeInput.addEventListener("input", function () {
        var code = codeInput.value.trim().toUpperCase();
        var schoolCodes = { "BCKZ103": { school: "Bahria College Karsaz", address: "Habib Rehmatullah Rd", teacher: "Ms. Saeeda (47)", logo: "assets/bahria-clg-logo.png" } };
        if (schoolCodes[code]) {
          if (classGroup) classGroup.style.display = "";
          DB.settings._pendingSchool = schoolCodes[code];
        } else {
          if (classGroup) classGroup.style.display = "none";
          DB.settings._pendingSchool = null;
        }
      });
    }
    var cont = $("onb-continue");    if (cont) cont.addEventListener("click", function () {
      var s = DB.settings;
      s.userName = ($("onb-name").value || "").trim();
      if (!s.userName) { alert("Please enter your name."); return; }
      if (!s._pendingSchool) { alert("Please enter a valid school code."); return; }
      var schoolInfo = s._pendingSchool;
      s.school = schoolInfo.school; s.address = schoolInfo.address; s.teacher = schoolInfo.teacher;
      var classVal = $("onb-class") ? $("onb-class").value : "X-C";
      var parts = classVal.split("-");
      s.class = parts[0] || "X"; s.section = parts[1] || "C"; s.onboarded = true;
      delete s._pendingSchool;
      S.saveSettings(s);
      applyHeader(); renderHome(); renderSchoolbag(); renderExamInfo(); renderSettingsSchoolInfo();
      closeModal("onboarding");
    });
    var teacherLink = $("onb-teacher-link");
    if (teacherLink) teacherLink.addEventListener("click", function (e) {
      e.preventDefault();
      var teacherCode = prompt("Enter teacher access code:");
      if (teacherCode && teacherCode.trim()) {
        DB.settings.isTeacher = true;
        DB.settings.teacherCode = teacherCode.trim();
        DB.settings.onboarded = true;
        S.saveSettings(DB.settings);
        applyHeader(); renderHome();
        closeModal("onboarding");
        alert("Teacher mode enabled! You can share notebooks with students using sharing codes.");
      }
    });
  }

  /* ---------- home ---------- */
  function greeting() {
    var now = new Date();
    var h = now.getHours(), m = now.getMinutes();
    var mins = h * 60 + m;
    var day = now.getDay();
    var name = DB.settings.userName ? ", " + DB.settings.userName : "";
    /* Friday 12:15 to Sunday 21:00 = weekend */
    if (day === 5 && mins >= 12 * 60 + 15) return "Enjoy the weekend" + name + " 🎉";
    if (day === 6 || day === 0) {
      if (day === 0 && mins >= 21 * 60) return "Sleep tight" + name + " 😴";
      return "Enjoy the weekend" + name + " 🎉";
    }
    /* Weekday time-based */
    if (mins < 6 * 60) return "Sleep tight" + name + " 😴";
    if (mins < 8 * 60) return "Good morning" + name + " ☀️ Get ready!";
    var dayKey = currentDayKey();
    var periods = dayKey ? TIMETABLE[dayKey] : [];
    var at = periodAt(periods, mins);
    if (at && at.cur.type === "break") return "Recess time" + name + " — have lunch and play! 🍽️";
    if (at && at.cur.subject === "PT") return "PT time" + name + " — participate in sports! 🏃";
    if (mins < 14 * 60) return "Good " + (h < 12 ? "morning" : "afternoon") + name;
    if (mins < 17 * 60) return "Rest time" + name + " 😌";
    if (mins < 19 * 60) return "Play time" + name + " ⚽";
    if (mins < 21 * 60) return "Study time" + name + " 📚";
    return "Sleep tight" + name + " 😴";
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
    var hcp = $("home-current-period"); if (hcp) hcp.addEventListener("click", function () {
      var p = periodAt(TIMETABLE[currentDayKey()] || [], new Date().getHours() * 60 + new Date().getMinutes());
      var subj = p ? p.cur.subject : null;
      if (subj && subj !== "BREAK") openSubjectFolder(subj);
    });
    var hb = $("home-buckle"); if (hb) hb.addEventListener("click", openScheduleExams);
    var hho = $("home-homework-open"); if (hho) hho.addEventListener("click", function () { openModal("homework-modal"); renderHomework(); });
  }
  function renderHome() {
    if ($("home-greeting")) $("home-greeting").textContent = greeting();
    var dayKey = currentDayKey();
    var periods = dayKey ? TIMETABLE[dayKey] : [];
    var now = new Date();
    var mins = now.getHours() * 60 + now.getMinutes();
    var at = periodAt(periods, mins);
    var cp = $("home-current-period");
    if (dayKey && at && at.cur.type !== "break") {
      var p = at.cur;
      $("home-cp-time").textContent = p.time + " – " + p.end;
      $("home-cp-subject").textContent = p.subject;
      $("home-cp-teacher").textContent = p.teacher || "";
      cp.querySelector(".ba-cp-label").textContent = "NOW";
      cp.classList.remove("ba-cp-off");
    } else {
      var label, subj, teacher;
      if (!dayKey) { label = "WEEKEND"; subj = "No school today"; teacher = "Enjoy your weekend"; }
      else {
        var lastEnd = periods[periods.length - 1].end.split(":").map(Number);
        var lastMins = lastEnd[0] * 60 + lastEnd[1];
        var firstStart = periods[0].time.split(":").map(Number);
        var firstMins = firstStart[0] * 60 + firstStart[1];
        if (mins > lastMins) { label = "SCHOOL'S OVER"; subj = (dayKey === "fri") ? "Have a great weekend" : "Day complete"; teacher = "See you tomorrow"; }
        else if (mins < firstMins) { label = "BEFORE SCHOOL"; subj = "Starts at " + periods[0].time; teacher = "Get ready"; }
        else { label = "BREAK"; subj = "Recess"; teacher = "Stretch & breathe"; }
      }
      $("home-cp-time").textContent = "";
      $("home-cp-subject").textContent = subj;
      $("home-cp-teacher").textContent = teacher;
      cp.querySelector(".ba-cp-label").textContent = label;
      cp.classList.add("ba-cp-off");
    }
    var pcn = document.querySelector(".ba-pcn");
    if (pcn) pcn.style.display = at ? "grid" : "none";
    if (at) {
      var prev = null, next = null;
      for (var i = at.idx - 1; i >= 0; i--) { if (periods[i].type !== "break") { prev = periods[i]; break; } }
      for (var j = at.idx + 1; j < periods.length; j++) { if (periods[j].type !== "break") { next = periods[j]; break; } }
      setPcn("prev", prev); setPcn("next", next);
    } else { setPcn("prev", null); setPcn("next", null); }

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
    var open = DB.homework.filter(function (h) { return !h.done; }).length;
    if ($("home-homework-count")) $("home-homework-count").textContent = open + (open === 1 ? " task" : " tasks") + " due";
    if ($("schoolbag-homework-count")) $("schoolbag-homework-count").textContent = open + (open === 1 ? " task" : " tasks");
  }
  function setPcn(which, p) {
    var subj = $("home-" + which + "-subject"), time = $("home-" + which + "-time");
    if (!p) { subj.textContent = "—"; time.textContent = ""; }
    else { subj.textContent = p.subject; time.textContent = p.time + "–" + p.end; }
  }
/*__APPEND__*/

  /* ---------- schedule ---------- */
  function setupSchedule() {
    var stb = $("sch-timetable-btn"); if (stb) stb.addEventListener("click", function () { switchSch("timetable"); });
    var seb = $("sch-exams-btn"); if (seb) seb.addEventListener("click", function () { switchSch("exams"); });
    document.querySelectorAll("#schedule-timetable .ba-timetable-day").forEach(function (day) {
      day.addEventListener("click", function () {
        document.querySelectorAll("#schedule-timetable .ba-timetable-day").forEach(function (d) { d.classList.remove("ba-timetable-day-active"); });
        day.classList.add("ba-timetable-day-active");
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
    var html = '<div style="display:flex;justify-content:space-between;margin:.2rem 0 .8rem"><div>' + dayKey.toUpperCase() + '</div><div style="color:var(--blue);font-weight:800;font-size:.7rem">' + (isToday ? "Today" : "") + '</div></div>';
    periods.forEach(function (p) {
      if (p.type === "break") html += '<div class="ba-period-item ba-period-break"><div class="ba-period-time">' + p.time + " - " + p.end + '</div><div class="ba-period-break-subject">BREAK</div></div>';
      else html += '<div class="ba-period-item"><div class="ba-period-time">' + p.time + " - " + p.end + '</div><div class="ba-period-subject">' + esc(p.subject) + '</div><div class="ba-period-teacher">' + esc(p.teacher) + '</div></div>';
    });
    el.innerHTML = html;
  }
  function openScheduleExams() { navigate("schedule"); switchSch("exams"); }

  /* ---------- settings ---------- */  function setupSettings() {
    var sn = $("setting-name"); if (sn) sn.value = DB.settings.userName || "";
    renderSettingsSchoolInfo();
    var sd = $("setting-direction"); if (sd) sd.value = DB.settings.direction || "ltr";
    var sp = $("setting-paper"); if (sp) sp.value = DB.settings.paper || "ruled";
    var st = $("setting-theme"); if (st) st.value = DB.settings.theme || "system";
    var csb = $("settings-change-school"); if (csb) csb.addEventListener("click", function () {
      DB.settings.onboarded = false; S.saveSettings(DB.settings);
      openModal("onboarding");
    });
    function bind(id, key, after) {
      var el = $(id); if (el) el.addEventListener("change", function () { DB.settings[key] = this.value; S.saveSettings(DB.settings); if (after) after(); });
    }
    var nameEl = $("setting-name"); if (nameEl) nameEl.addEventListener("input", function () { console.log("[setting-name] input:", this.value); DB.settings.userName = this.value; S.saveSettings(DB.settings); applyHeader(); renderHome(); });
    // School info is now display-only (changed via onboarding)

    bind("setting-direction", "direction");
    bind("setting-paper", "paper");
    bind("setting-theme", "theme", applyTheme);
  }

  /* ---------- schoolbag ---------- */
  function setupSchoolbag() {
    var hwOpen = $("schoolbag-homework-open"); if (hwOpen) hwOpen.addEventListener("click", function () { console.log("[schoolbag-homework-open] click"); openModal("homework-modal"); renderHomework(); });
    var toolsOpen = $("schoolbag-tools-open"); if (toolsOpen) toolsOpen.addEventListener("click", function () { console.log("[schoolbag-tools-open] click"); openToolsMenu(); });
  }
  function renderSchoolbag() {
    var grid = $("schoolbag-folders"); if (!grid) return;
    grid.innerHTML = "";
    SUBJECTS.forEach(function (s) {
      var card = document.createElement("div");
      card.className = "ba-folder-card";
      var sysNb = S.getDocument(S.systemNotebookId(s.subject));
      var userDocs = S.getDocumentsBySubject(s.subject).filter(function (d) { return !d.system; });
      var meta = (s.file ? "Book · " : "No book · ") + (sysNb ? "1 school notebook" : "0") + " · " + userDocs.length + " your doc" + (userDocs.length === 1 ? "" : "s");
      card.innerHTML = '<div class="ba-folder-cover">' + esc(s.subject) + '</div><div class="ba-folder-subject">' + esc(s.subject) + '</div><div class="ba-folder-meta">' + meta + '</div>';
      card.addEventListener("click", function () { openSubjectFolder(s.subject); });
      grid.appendChild(card);
    });
    renderFolders();
  }
  function renderFolders() {
    var grid = $("schoolbag-folders"); if (!grid) return;
    var folders = S.getFolders();
    var hasLibrary = folders.some(function (f) { return f && f.purpose === "library"; });
    if (!hasLibrary) {
      var libFolder = S.addFolder("Library Notes", "#7c3aed", "📚");
      if (libFolder) { libFolder.purpose = "library"; S.updateFolder(libFolder.id, { purpose: "library" }); }
    }
    S.getFolders().forEach(function (f) {
      if (!f) return;
      var card = document.createElement("div");
      card.className = "ba-folder-card ba-folder-user";
      card.innerHTML = '<div class="ba-folder-cover" style="background:' + f.color + '">' + S.folderIconGlyph(f.icon) + '</div><div class="ba-folder-subject">' + esc(f.name) + '</div><div class="ba-folder-meta">' + S.getDocumentsByFolder(f.id).length + ' item(s)</div>';
      card.addEventListener("click", function () { openFolder(f.id); });
      card.addEventListener("contextmenu", function (e) { e.preventDefault(); openFolderMenu(f.id); });
      grid.appendChild(card);
    });
  }
  function openFolder(id) {
    var f = S.getFolder(id); if (!f) return;
    activeFolder = f;
    var isLib = f.purpose === "library";
    var subjEl = $("sf-subject"); if (subjEl) subjEl.textContent = isLib ? "Library Notes" : f.name;
    var bookEl = $("sf-book"); if (bookEl) bookEl.innerHTML = "";
    var head = $("sf-pages-head");
    var nbBtn = $("sf-new-notebook"); if (nbBtn) nbBtn.style.display = isLib ? "none" : "";
    var shBtn = $("sf-new-sheet"); if (shBtn) shBtn.style.display = isLib ? "none" : "";
    var wbBtn = $("sf-new-whiteboard"); if (wbBtn) wbBtn.style.display = isLib ? "none" : "";
    var qnBtn = $("sf-new-quicknote"); if (qnBtn) qnBtn.style.display = isLib ? "none" : "";
    var libBtn = $("sf-new-library"); if (libBtn) libBtn.style.display = isLib ? "" : "none";
    if (isLib) { if (head) head.textContent = "READING LOGS"; renderLibraryFolder(f); openModal("subject-folder-modal"); return; }
    if (head) head.textContent = "MY DOCUMENTS";
    var docs = S.getDocumentsByFolder(id);
    var list = $("sf-pages");
    if (list) {
      list.innerHTML = "";
      if (!docs.length) list.innerHTML = '<div class="ba-sf-book-none">No documents in this folder yet.</div>';
      docs.forEach(function (d) { list.appendChild(docRow(d)); });
    }
    if (nbBtn) nbBtn.onclick = function () { openNotebookCreate(f.id); };
    if (shBtn) shBtn.onclick = function () { openSheetCreate(f.id); };
    if (wbBtn) wbBtn.onclick = function () { createWhiteboard(f.id); };
    if (qnBtn) qnBtn.onclick = function () { openQuickNote(f.id); };
    openModal("subject-folder-modal");
  }
  function currentWeekKey() {
    var d = new Date(); var onejan = new Date(d.getFullYear(), 0, 1);
    var week = Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    return d.getFullYear() + "-W" + (week < 10 ? "0" : "") + week;
  }
  function renderLibraryFolder(f) {
    var list = $("sf-pages"); list.innerHTML = "";
    $("sf-new-library").onclick = function () { openLibraryNoteForm(f.id, null); };
    var weekKey = currentWeekKey();
    var notes = S.getDocumentsByFolder(f.id).filter(function (d) { return d.type === "library"; });
    var done = notes.some(function (n) { return n.week === weekKey && n.status === "submitted"; });
    $("sf-book").innerHTML = done
      ? '<div class="ba-ln-banner ba-ln-ok">✓ Reading log submitted for this week (' + weekKey + ').</div>'
      : '<div class="ba-ln-banner ba-ln-pending">⏳ Reading log for this week (' + weekKey + ') is PENDING — add one below.</div>';
    if (!notes.length) list.innerHTML = '<div class="ba-sf-book-none">No reading logs yet. Add your first one.</div>';
    notes.forEach(function (n) { list.appendChild(libraryRow(n)); });
  }
  function libraryRow(n) {
    var row = document.createElement("div");
    row.className = "ba-sf-page ba-ln-row";
    var statusBadge = n.status === "submitted"
      ? '<span class="ba-ln-badge ba-ln-ok">SUBMITTED</span>'
      : '<span class="ba-ln-badge ba-ln-pending">PENDING</span>';
    var shared = n.sharedWithLibrarian ? '<span class="ba-sf-shared">SHARED WITH LIBRARIAN</span>' : '';
    var pages = (n.fromPage || "?") + "–" + (n.toPage || "?");
    row.innerHTML = '<span class="ba-sf-page-icon">📚</span>' +
      '<span class="ba-sf-page-name">' + esc(n.bookName || n.title || "Untitled") + '</span>' +
      statusBadge + shared +
      '<span class="ba-sf-page-type">' + esc(n.week || "") + ' · pp ' + pages + '</span>' +
      (n.status !== "submitted" ? '<button class="ba-ln-submit" title="Submit to Librarian">📤</button>' : '') +
      '<button class="ba-sf-del" title="Delete">🗑</button>';
    row.addEventListener("click", function (e) { if (e.target.classList.contains("ba-sf-del") || e.target.classList.contains("ba-ln-submit")) return; openLibraryNoteForm(n.folderId, n); });
    if (n.status !== "submitted") row.querySelector(".ba-ln-submit").addEventListener("click", function (e) { e.stopPropagation(); submitLibraryNote(n.id); });
    row.querySelector(".ba-sf-del").addEventListener("click", function (e) { e.stopPropagation(); if (confirm("Delete this reading log?")) { S.removeDocument(n.id); renderFolderIfOpen(); } });
    return row;
  }
  function submitLibraryNote(id) {
    S.updateDocument(id, { status: "submitted", sharedWithLibrarian: true, submittedAt: new Date().toISOString() });
    renderFolderIfOpen();
  }
  function openLibraryNoteForm(folderId, doc) {
    console.log("[openLibraryNoteForm] called, folderId:", folderId, "editing:", !!doc);
    activeLibraryFolder = folderId;
    var editing = !!doc;
    editingLibId = editing ? doc.id : null;
    $("ln-title").textContent = editing ? "Edit Reading Log" : "New Reading Log";
    $("ln-book").value = editing ? (doc.bookName || "") : "";
    $("ln-from").value = editing ? (doc.fromPage || "") : "";
    $("ln-to").value = editing ? (doc.toPage || "") : "";
    $("ln-week").value = editing ? (doc.week || "") : currentWeekKey();
    $("ln-learned").value = editing ? (doc.learned || "") : "";
    var st = $("ln-status");
    if (editing) {
      st.innerHTML = "Status: " + (doc.status === "submitted" ? "Submitted" : "Pending") + (doc.sharedWithLibrarian ? " · Shared with librarian" : "");
      $("ln-submit").style.display = doc.status === "submitted" ? "none" : "";
      $("ln-delete").style.display = "";
    } else { st.innerHTML = ""; $("ln-submit").style.display = "none"; $("ln-delete").style.display = "none"; }
    openModal("library-note-modal");
  }
  function setupLibraryNoteForm() {
    $("ln-back").addEventListener("click", function () { closeModal("library-note-modal"); });
    $("ln-save").addEventListener("click", function () {
      var payload = {
        bookName: $("ln-book").value.trim() || "Untitled Book",
        fromPage: parseInt($("ln-from").value, 10) || 0,
        toPage: parseInt($("ln-to").value, 10) || 0,
        week: $("ln-week").value.trim() || currentWeekKey(),
        learned: $("ln-learned").value,
        folderId: activeLibraryFolder,
        title: $("ln-book").value.trim() || "Untitled Book"
      };
      if (editingLibId) {
        var ex = S.getDocument(editingLibId);
        payload.status = ex.status; payload.sharedWithLibrarian = ex.sharedWithLibrarian;
        payload.submittedAt = ex.submittedAt; payload.type = "library";
        S.updateDocument(editingLibId, payload);
      } else {
        payload.type = "library"; payload.status = "pending"; payload.sharedWithLibrarian = false;
        S.addDocument(payload);
      }
      closeModal("library-note-modal"); renderFolderIfOpen();
    });
    $("ln-submit").addEventListener("click", function () { if (editingLibId) submitLibraryNote(editingLibId); closeModal("library-note-modal"); renderFolderIfOpen(); });
    $("ln-delete").addEventListener("click", function () { if (editingLibId && confirm("Delete this reading log?")) { S.removeDocument(editingLibId); closeModal("library-note-modal"); renderFolderIfOpen(); } });
  }
  function openFolderMenu(id) {
    var f = S.getFolder(id);
    if (!f) return;
    activeFolderId = id;
    showDocMenu(null, f);
  }
  var activeFolder = null, activeFolderId = null;
  var activeLibraryFolder = null, editingLibId = null;

  function docRow(d) {
    if (d.type === "library") return libraryRow(d);
    var row = document.createElement("div");
    row.className = "ba-sf-page";
    var icon = d.type === "sheet" ? "📊" : d.type === "whiteboard" ? "⬜" : d.type === "quicknote" ? "📝" : "📄";
    var typeLabel = d.type === "sheet" ? "Sheet" : d.type === "whiteboard" ? "Whiteboard" : d.type === "quicknote" ? "Quick Note" : (d.system ? "School Notebook" : "Notebook");
    var name = d.title || d.name || "Untitled";
    row.innerHTML = '<span class="ba-sf-page-icon">' + icon + '</span><span class="ba-sf-page-name">' + esc(name) + '</span>' + (d.sharedWithTeacher ? '<span class="ba-sf-shared">SHARED WITH TEACHER</span>' : '') + '<span class="ba-sf-page-type">' + typeLabel + '</span><button class="ba-sf-del" title="Delete">🗑</button>';
    row.addEventListener("click", function (e) { if (e.target.classList.contains("ba-sf-del")) return; openDocument(d); });
    row.querySelector(".ba-sf-del").addEventListener("click", function (e) {
      e.stopPropagation();
      if (d.system) { alert("This is a mandatory school notebook and cannot be deleted."); return; }
      if (confirm("Delete '" + name + "'? This cannot be undone.")) { S.removeDocument(d.id); renderSchoolbag(); renderFolderIfOpen(); }
    });
    return row;
  }
  function renderFolderIfOpen() {
    if (activeFolder) openFolder(activeFolder.id);
  }

  function showDocMenu(docId, folder) {
    var titleEl = $("doc-menu-title");
    var info = $("doc-info");
    var renameGroup = $("doc-rename-group");
    var renameInput = $("doc-rename-input");
    var renameBtn = $("doc-rename");
    renameGroup.style.display = "none";
    if (folder) {
      titleEl.textContent = folder.name;
      info.innerHTML = '<div class="ba-doc-info-row"><span>Type</span><span>Folder</span></div><div class="ba-doc-info-row"><span>Items</span><span>' + S.getDocumentsByFolder(folder.id).length + '</span></div>';
      renameBtn.style.display = "block";
      renameBtn.textContent = "Rename Folder";
      renameBtn.onclick = function () { renameGroup.style.display = "block"; renameInput.value = folder.name; renameInput.onblur = function () {}; renameInput.onkeydown = function (e) { if (e.key === "Enter") { S.updateFolder(folder.id, { name: renameInput.value || folder.name }); renameGroup.style.display = "none"; closeModal("doc-menu-modal"); renderSchoolbag(); } }; renameInput.focus(); };
      var delFolder = $("doc-delete-folder"); delFolder.style.display = "block";
      delFolder.onclick = function () {
        var n = S.getDocumentsByFolder(folder.id).length;
        var msg = n ? ("This folder contains " + n + " document(s). Delete the folder? Its documents will be moved to your schoolbag (not deleted).") : "Delete this folder?";
        if (confirm(msg)) { S.removeFolder(folder.id); closeModal("doc-menu-modal"); renderSchoolbag(); }
      };
      $("doc-menu-close").onclick = function () { closeModal("doc-menu-modal"); };
    } else if (docId) {
      var d = S.getDocument(docId); if (!d) return;
      titleEl.textContent = d.title || d.name || "Untitled";
      var pages = d.pages ? d.pages.length : (d.type === "whiteboard" ? "—" : (d.type === "sheet" ? (d.sheet ? d.sheet.rows + "×" + d.sheet.cols : "") : ""));
      info.innerHTML =
        '<div class="ba-doc-info-row"><span>Subject</span><span>' + esc(d.subject || "—") + '</span></div>' +
        '<div class="ba-doc-info-row"><span>Created</span><span>' + new Date(d.createdAt).toLocaleString() + '</span></div>' +
        '<div class="ba-doc-info-row"><span>Last modified</span><span>' + new Date(d.updatedAt).toLocaleString() + '</span></div>' +
        '<div class="ba-doc-info-row"><span>Page count</span><span>' + (d.pages ? d.pages.length : "—") + '</span></div>' +
        '<div class="ba-doc-info-row"><span>Paper type</span><span>' + (S.paperDef(d.paper).label) + '</span></div>' +
        '<div class="ba-doc-info-row"><span>Page size</span><span>A4 (210 × 297 mm)</span></div>' +
        '<div class="ba-doc-info-row"><span>Storage</span><span>' + (JSON.stringify(d).length < 1024 ? JSON.stringify(d).length + " B" : (JSON.stringify(d).length / 1024).toFixed(1) + " KB") + '</span></div>';
      renameBtn.style.display = d.system ? "none" : "block";
      renameBtn.textContent = "Rename";
      $("doc-delete-folder").style.display = "none";
      renameBtn.onclick = function () { renameGroup.style.display = "block"; renameInput.value = d.title || ""; renameInput.onkeydown = function (e) { if (e.key === "Enter") { S.updateDocument(d.id, { title: renameInput.value || d.title }); renameGroup.style.display = "none"; closeModal("doc-menu-modal"); renderSchoolbag(); renderFolderIfOpen(); } }; renameInput.focus(); };
      $("doc-menu-close").onclick = function () { closeModal("doc-menu-modal"); };
    }
    openModal("doc-menu-modal");
  }
/*__APPEND__*/

  var activeSubject = null;
  function openSubjectFolder(subject) {
    activeSubject = subject;
    var s = getSubject(subject);
    $("sf-subject").textContent = subject;
    var book = $("sf-book");
    var bookDoc = S.getDocument(S.systemNotebookId(subject).replace("sys-nb-", "sys-book-"));
    var bookFile = bookDoc ? bookDoc.file : (s && s.file);
    console.log("[openSubjectFolder] subject:", subject, "bookDoc:", bookDoc, "bookFile:", bookFile);
    if (bookFile) {
      book.innerHTML = '<div class="ba-sf-book-cover">📕</div><div class="ba-sf-book-name">' + esc(subject) + ' — Class ' + esc(DB.settings.class || "X") + '</div><div class="ba-sf-book-offline">● Available Offline</div><button class="ba-button ba-button-primary" id="sf-open-book" style="margin-top:.6rem;">Open Book</button>';
      setTimeout(function () {
        var btn = $("sf-open-book");
        if (btn) btn.addEventListener("click", function () { console.log("[sf-open-book] click"); openPdf({ subject: subject, file: bookFile, title: bookDoc ? bookDoc.title : subject }); });
      }, 0);
    } else {
      book.innerHTML = '<div class="ba-sf-book-none">Book PDF not provided yet for this subject.</div>';
    }
    renderFolderPages(subject);
    openModal("subject-folder-modal");
  }
  function renderFolderPages(subject) {
    var list = $("sf-pages");
    var sysNb = S.getDocument(S.systemNotebookId(subject));
    var docs = S.getDocumentsBySubject(subject).filter(function (d) { return !d.system; });
    list.innerHTML = "";
    if (sysNb) { list.appendChild(docRow(sysNb)); }
    if (!docs.length && !sysNb) { list.innerHTML = '<div class="ba-sf-book-none">No documents yet. Create a notebook or sheet.</div>'; }
    docs.forEach(function (d) { list.appendChild(docRow(d)); });
  }
  function setupSubjectFolder() {
    var sfBack = $("sf-back"); if (sfBack) sfBack.addEventListener("click", function () { console.log("[sf-back] click"); closeModal("subject-folder-modal"); });
    var sfNb = $("sf-new-notebook"); if (sfNb) sfNb.addEventListener("click", function () { console.log("[sf-new-notebook] click"); openNotebookCreate(null, activeSubject); });
    var sfSh = $("sf-new-sheet"); if (sfSh) sfSh.addEventListener("click", function () { console.log("[sf-new-sheet] click"); openSheetCreate(null, activeSubject); });
    var sfWb = $("sf-new-whiteboard"); if (sfWb) sfWb.addEventListener("click", function () { console.log("[sf-new-whiteboard] click"); createWhiteboard(null, activeSubject); });
    var sfQn = $("sf-new-quicknote"); if (sfQn) sfQn.addEventListener("click", function () { console.log("[sf-new-quicknote] click"); openQuickNote(null, activeSubject); });
    var sfLib = $("sf-new-library"); if (sfLib) sfLib.addEventListener("click", function () { console.log("[sf-new-library] click"); var libF = S.getLibraryFolder(); if (libF) openLibraryNoteForm(libF.id, null); });
  }

  function openDocument(d) {
    if (d.type === "sheet") openSheetEditor(d);
    else if (d.type === "whiteboard") openWhiteboard(d);
    else if (d.type === "quicknote") openQuickNoteEdit(d);
    else if (d.type === "library") openLibraryNoteForm(d.folderId, d);
    else if (d.type === "book") openPdf({ subject: d.subject || d.title, file: d.file, title: d.title });
    else openEditor(d);
  }

  /* ---------- + NEW menu / FAB ---------- */
  function setupNewMenu() {
    var fab = $("fab-new");
    if (fab) {
      fab.addEventListener("click", function () { openModal("new-menu-modal"); });
    }
    document.querySelectorAll("#new-menu-grid .ba-new-item").forEach(function (btn) {
      btn.addEventListener("click", function () {
        closeModal("new-menu-modal");
        var kind = btn.getAttribute("data-create");
        if (kind === "notebook") openNotebookCreate();
        else if (kind === "whiteboard") openWhiteboardCreate();
        else if (kind === "sheet") openSheetCreate();
        else if (kind === "quicknote") openQuickNote();
        else if (kind === "folder") openFolderCreate();
      });
    });
  }

  /* ---------- FOLDER CREATE ---------- */
  var folderState = { color: "#2f5bff", icon: "folder" };
  function openFolderCreate() {
    folderState = { color: BAStore.FOLDER_COLORS[0], icon: "folder" };
    $("folder-name").value = "";
    renderFolderColors(); renderFolderIcons();
    openModal("folder-modal");
  }
  function renderFolderColors() {
    var wrap = $("folder-colors"); wrap.innerHTML = "";
    BAStore.FOLDER_COLORS.forEach(function (c) {
      var b = document.createElement("button");
      b.className = "ba-folder-color" + (c === folderState.color ? " active" : "");
      b.style.background = c;
      b.addEventListener("click", function () { folderState.color = c; renderFolderColors(); });
      wrap.appendChild(b);
    });
  }
  function renderFolderIcons() {
    var wrap = $("folder-icons"); wrap.innerHTML = "";
    BAStore.FOLDER_ICONS.forEach(function (f) {
      var b = document.createElement("button");
      b.className = "ba-folder-icon" + (f.id === folderState.icon ? " active" : "");
      b.textContent = f.glyph;
      b.addEventListener("click", function () { folderState.icon = f.id; renderFolderIcons(); });
      wrap.appendChild(b);
    });
  }
  function setupFolderModal() {
    var fc = $("folder-close"); if (fc) fc.addEventListener("click", function () { closeModal("folder-modal"); });
    var fca = $("folder-cancel"); if (fca) fca.addEventListener("click", function () { closeModal("folder-modal"); });
    var fcb = $("folder-custom-btn"); if (fcb) fcb.addEventListener("click", function () { var fci = $("folder-custom-input"); if (fci) { fci.style.display = "inline-block"; fci.click(); } });
    var fci = $("folder-custom-input"); if (fci) fci.addEventListener("input", function () { folderState.color = this.value; renderFolderColors(); });
    var fcr = $("folder-create"); if (fcr) fcr.addEventListener("click", function () {
      var fn = $("folder-name"); var name = fn ? fn.value.trim() || "Folder" : "Folder";
      S.addFolder(name, folderState.color, folderState.icon);
      closeModal("folder-modal"); renderSchoolbag();
    });
  }
/*__APPEND__*/

  /* ---------- NOTEBOOK CREATE (premium, live preview) ---------- */
  var nbc = { title: "", subject: "", cover: "classic", paper: "ruled", paperColor: "white" };
  function openNotebookCreate(folderId, subject) {
    console.log("[openNotebookCreate] called, folderId:", folderId, "subject:", subject);
    var defaultSubject = (SUBJECTS && SUBJECTS[0] && SUBJECTS[0].subject) ? SUBJECTS[0].subject : "General";
    nbc = { title: "", subject: subject || defaultSubject, cover: "classic", paper: DB.settings.paper || "ruled", paperColor: DB.settings.paperColor || "white", folderId: folderId || null };
    nbcFolder = folderId || null;
    var sel = $("nbc-subject");
    if (sel) {
      sel.innerHTML = "";
      (SUBJECTS || []).forEach(function (s) { var o = document.createElement("option"); o.value = s.subject; o.textContent = s.subject; sel.appendChild(o); });
      sel.value = nbc.subject;
      sel.onchange = function () { nbc.subject = this.value; renderNbcPreview(); };
    }
    var titleEl = $("nbc-title");
    if (titleEl) {
      titleEl.value = "";
      titleEl.oninput = function () { nbc.title = this.value; };
    }
    renderNbcCovers(); renderNbcPaperColors(); renderNbcPaperTypes();
    renderNbcPreview();
    openModal("nb-create-modal");
  }
  var nbcFolder = null;
  function renderNbcCovers() {
    var wrap = $("nbc-covers"); wrap.innerHTML = "";
    BAStore.COVER_TYPES.forEach(function (c) {
      var card = document.createElement("div");
      card.className = "ba-cover-card" + (c.id === nbc.cover ? " active" : "");
      card.innerHTML = coverPreviewHTML(c.id);
      card.addEventListener("click", function () { nbc.cover = c.id; renderNbcCovers(); renderNbcPreview(); });
      wrap.appendChild(card);
    });
  }
  function renderNbcPaperColors() {
    var wrap = $("nbc-papercolors"); wrap.innerHTML = "";
    [["white", "#ffffff"], ["yellow", "#fdf6da"], ["dark", "#1f2330"]].forEach(function (p) {
      var b = document.createElement("button");
      b.className = "ba-paper-color" + (p[0] === nbc.paperColor ? " active" : "");
      b.style.background = p[1];
      b.addEventListener("click", function () { nbc.paperColor = p[0]; renderNbcPaperColors(); renderNbcPreview(); });
      wrap.appendChild(b);
    });
  }
  function renderNbcPaperTypes() {
    var wrap = $("nbc-papertypes"); wrap.innerHTML = "";
    BAStore.PAPER_TYPES.forEach(function (p) {
      var card = document.createElement("div");
      card.className = "ba-paper-card" + (p.id === nbc.paper ? " active" : "");
      card.innerHTML = '<canvas width="60" height="80"></canvas><span>' + esc(p.label) + '</span>';
      var cv = card.querySelector("canvas");
      drawPaperMini(cv, p.id, nbc.paperColor);
      card.addEventListener("click", function () { nbc.paper = p.id; renderNbcPaperTypes(); renderNbcPreview(); });
      wrap.appendChild(card);
    });
  }
  function renderNbcPreview() {
    var cover = $("nbc-cover-preview");
    cover.innerHTML = coverPreviewHTML(nbc.cover);
    cover.style.background = paperColorBg(nbc.paperColor);
    var cv = $("nbc-preview-canvas");
    drawPagePreview(cv, nbc.paper, nbc.paperColor);
  }
  function setupNbCreate() {
    var ncb = $("nb-create-back"); if (ncb) ncb.addEventListener("click", function () { closeModal("nb-create-modal"); });
    var ncc = $("nbc-cancel"); if (ncc) ncc.addEventListener("click", function () { closeModal("nb-create-modal"); });
    var ncr = $("nbc-create"); if (ncr) ncr.addEventListener("click", function () {
      var title = nbc.title.trim() || "Untitled Document";
      var doc = S.addDocument({
        type: "notebook", title: title, subject: nbc.subject, folderId: nbcFolder,
        cover: nbc.cover, paper: nbc.paper, paperColor: nbc.paperColor,
        pages: [ S.newPage(nbc.paper, nbc.paperColor) ]
      });
      closeModal("nb-create-modal");
      renderSchoolbag();
      openEditor(doc);
    });
  }
  function coverPreviewHTML(id) {
    var c = BAStore.coverDef(id);
    var grad = { none: "transparent", dotted: "radial-gradient(#cbd5e1 1px, transparent 1px)", simple: "linear-gradient(#f1f5f9,#e2e8f0)",
      classic: "linear-gradient(135deg,#eaf1ff,#cfddff)", academic: "linear-gradient(135deg,#eef2ff,#dbe4ff)", minimal: "linear-gradient(#ffffff,#f1f5f9)",
      dark: "linear-gradient(135deg,#1f2330,#2b3145)", paper: "linear-gradient(#fdfaf0,#f3ead0)", grid: "linear-gradient(rgba(60,110,200,.15) 1px,transparent 1px)" }[id] || "linear-gradient(135deg,#eaf1ff,#cfddff)";
    return '<div class="ba-cover-mini" style="background:' + grad + ';background-size:14px 14px"></div>';
  }
  function paperColorBg(c) { return BAStore.paperColorDef(c).bg; }
/*__APPEND__*/

  /* ============================================================
     DRAWING PRIMITIVES (A4 virtual coordinate space)
     ============================================================ */
  function drawPaper(ctx, paper, paperColor, W, H) {
    var pc = BAStore.paperColorDef(paperColor);
    ctx.fillStyle = pc.bg; ctx.fillRect(0, 0, W, H);
    var pd = BAStore.paperDef(paper);
    var kind = pd.kind, rule = pd.rule, layout = pd.layout;
    ctx.lineWidth = 1;
    if (kind === "blank") return;
    if (kind === "dotted") {
      ctx.fillStyle = "rgba(80,110,160,.35)";
      for (var y = rule; y < H; y += rule) for (var x = rule; x < W; x += rule) { ctx.beginPath(); ctx.arc(x, y, 1.1, 0, Math.PI * 2); ctx.fill(); }
      return;
    }
    if (kind === "green") {
      ctx.fillStyle = "rgba(40,120,60,.10)";
      for (var gy = 0; gy < H; gy += rule) { ctx.fillRect(0, gy, W, rule / 2); }
      return;
    }
    if (kind === "grid" || kind === "graph") {
      ctx.strokeStyle = pc.ink;
      for (var gx = 0; gx <= W; gx += rule) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
      for (var gy2 = 0; gy2 <= H; gy2 += rule) { ctx.beginPath(); ctx.moveTo(0, gy2); ctx.lineTo(W, gy2); ctx.stroke(); }
      return;
    }
    if (kind === "ruled") {
      ctx.strokeStyle = pc.ink;
      for (var ry = rule; ry < H; ry += rule) { ctx.beginPath(); ctx.moveTo(0, ry); ctx.lineTo(W, ry); ctx.stroke(); }
      var mx = layout === "rtl" ? W - 40 : (layout === "left" ? 40 : 56);
      ctx.strokeStyle = pc.accent; ctx.beginPath(); ctx.moveTo(mx, 0); ctx.lineTo(mx, H); ctx.stroke();
      if (layout === "left") { ctx.beginPath(); ctx.moveTo(W - 40, 0); ctx.lineTo(W - 40, H); ctx.stroke(); }
    }
  }
  function drawPaperMini(canvas, paper, paperColor) {
    var ctx = canvas.getContext("2d"); var W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    var sx = W / A4_W, sy = H / A4_H;
    ctx.save(); ctx.scale(sx, sy); drawPaper(ctx, paper, paperColor, A4_W, A4_H); ctx.restore();
  }
  function drawPagePreview(canvas, paper, paperColor) {
    var ctx = canvas.getContext("2d"); var W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    var s = Math.min(W / A4_W, H / A4_H);
    ctx.translate((W - A4_W * s) / 2, (H - A4_H * s) / 2); ctx.scale(s, s);
    drawPaper(ctx, paper, paperColor, A4_W, A4_H); ctx.restore();
  }
  function drawStrokes(ctx, strokes) {
    if (!ctx || !strokes) return;
    strokes.forEach(function (s) {
      if (!s) return;
      ctx.lineJoin = "round"; ctx.lineCap = "round";
      var pts = s.points || [];
      if (s.tool === "text") {
        ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
        ctx.fillStyle = s.color || "#0f0f0f"; ctx.textBaseline = "top";
        ctx.font = (s.size || 22) + "px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(s.text || "", s.x || 0, s.y || 0); return;
      }
      if (s.tool === "rect" || s.tool === "circle" || s.tool === "triangle" || s.tool === "line" || s.tool === "arrow" || s.tool === "square") {
        if (pts.length < 2) return;
        var p0 = pts[0], p1 = pts[1];
        ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
        ctx.strokeStyle = s.color || "#2f5bff"; ctx.lineWidth = s.size || 3;
        ctx.beginPath();
        if (s.tool === "rect" || s.tool === "square") {
          var x = Math.min(p0.x, p1.x), y = Math.min(p0.y, p1.y), w = Math.abs(p1.x - p0.x), h = Math.abs(p1.y - p0.y);
          if (s.tool === "square") { var side = Math.max(w, h); if (p1.x < p0.x) x = p0.x - side; if (p1.y < p0.y) y = p0.y - side; ctx.rect(x, y, side, side); }
          else ctx.rect(x, y, w, h);
        }
        else if (s.tool === "line" || s.tool === "arrow") { ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); }
        else if (s.tool === "circle") { var r = Math.hypot(p1.x - p0.x, p1.y - p0.y); ctx.arc(p0.x, p0.y, r, 0, Math.PI * 2); }
        else if (s.tool === "triangle") { ctx.moveTo((p0.x + p1.x) / 2, p0.y); ctx.lineTo(p1.x, p1.y); ctx.lineTo(p0.x, p1.y); ctx.closePath(); }
        ctx.stroke();
        if (s.tool === "arrow") {
          var ang = Math.atan2(p1.y - p0.y, p1.x - p0.x), len = 12;
          ctx.beginPath(); ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p1.x - len * Math.cos(ang - Math.PI / 6), p1.y - len * Math.sin(ang - Math.PI / 6));
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p1.x - len * Math.cos(ang + Math.PI / 6), p1.y - len * Math.sin(ang + Math.PI / 6));
          ctx.stroke();
        }
        return;
      }
      if (s.tool === "eraser" && s.mode === "regular") {
        strokePath(ctx, s); return;
      }
      if (pts.length === 0) return;
      strokePath(ctx, s);
    });
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
  }
  function smoothPath(ctx, pts) {
    if (pts.length === 1) { ctx.beginPath(); ctx.arc(pts[0].x, pts[0].y, Math.max(ctx.lineWidth / 2, 0.6), 0, Math.PI * 2); ctx.fillStyle = ctx.strokeStyle; ctx.fill(); return; }
    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
    if (pts.length === 2) { ctx.lineTo(pts[1].x, pts[1].y); }
    else { for (var i = 1; i < pts.length - 1; i++) { var xc = (pts[i].x + pts[i + 1].x) / 2, yc = (pts[i].y + pts[i + 1].y) / 2; ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc); } ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y); }
    ctx.stroke();
  }
  function taperedPath(ctx, pts, baseW) {
    if (pts.length === 1) { ctx.beginPath(); ctx.arc(pts[0].x, pts[0].y, baseW * 0.6, 0, Math.PI * 2); ctx.fillStyle = ctx.strokeStyle; ctx.fill(); return; }
    for (var i = 0; i < pts.length - 1; i++) {
      var t0 = i / (pts.length - 1), t1 = (i + 1) / (pts.length - 1);
      var w0 = baseW * (0.5 + 0.7 * Math.sin(t0 * Math.PI)), w1 = baseW * (0.5 + 0.7 * Math.sin(t1 * Math.PI));
      ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[i + 1].x, pts[i + 1].y); ctx.lineWidth = (w0 + w1) / 2; ctx.stroke();
    }
  }
  function strokePath(ctx, s) {
    var pts = s.points; if (!pts || !pts.length) return;
    ctx.save();
    ctx.lineJoin = "round"; ctx.lineCap = "round";
    var baseW = s.size || 2.5;
    var style = s.style || (s.tool === "pencil" ? "pencil" : "ball");
    if (s.tool === "highlighter") {
      ctx.globalAlpha = (s.density == null ? 0.4 : s.density); ctx.strokeStyle = s.color; ctx.lineWidth = baseW; smoothPath(ctx, pts); ctx.restore(); return;
    }
    if (s.tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out"; ctx.strokeStyle = "rgba(0,0,0,1)"; ctx.lineWidth = baseW; smoothPath(ctx, pts); ctx.restore(); return;
    }
    if (s.tool === "pencil") {
      ctx.globalAlpha = 0.85; ctx.strokeStyle = s.color; ctx.lineWidth = baseW; smoothPath(ctx, pts); ctx.restore(); return;
    }
    ctx.strokeStyle = s.color;
    if (style === "brush") { ctx.globalAlpha = 0.92; ctx.lineWidth = baseW * 1.7; smoothPath(ctx, pts); ctx.restore(); return; }
    if (style === "fountain") { taperedPath(ctx, pts, baseW); ctx.restore(); return; }
    ctx.lineWidth = baseW; smoothPath(ctx, pts); ctx.restore(); return;
  }
/*__APPEND__*/

  /* ============================================================
     NOTEBOOK / BOOK EDITOR (A4 engine + full toolbar)
     ============================================================ */
  var ed = { doc: null, pageIndex: 0, mode: "edit", tool: "pen", shape: "rect", color: "#2f5bff", size: 2.5,
             penStyle: "ball", hlDensity: 0.4, eraserSize: 16, eraserMode: "regular",
             undo: [], redo: [], drawing: false, cur: null,
             select: { mode: "rect", filters: { ink: true, shapes: true, highlight: false, text: true }, rect: null, free: [], active: false } };
  var PEN_COLORS = ["#0f0f0f", "#2f5bff", "#ff6a5e", "#2fbf6f", "#ffc21c", "#7c3aed"];
  var CUSTOM_COLORS = [];

  function openEditor(doc) {
    ed.doc = doc; ed.pageIndex = 0; ed.mode = "edit"; ed.undo = []; ed.redo = [];
    ed.tool = "pen"; ed.color = "#2f5bff"; ed.size = 2.5;
    $("editor-modal").querySelector(".ba-ve-mode").textContent = "Edit";
    $("editor-modal").classList.toggle("ba-editor-view", false);
    setActiveToolBtn("editor-modal", "pen");
    openModal("editor-modal");
    setTimeout(function () { resizeEditor(); renderEditor(); renderSidebar(); }, 60);
  }
  function activePage() {
    var pages = BAStore.getPages(ed.doc);
    return pages[Math.min(ed.pageIndex, pages.length - 1)] || pages[0];
  }
  function resizeEditor() {
    if (!ed.doc) return;
    var a4 = $("ed-a4"), canvas = $("ed-canvas");
    var dpr = window.devicePixelRatio || 1;
    var w = a4.clientWidth, h = a4.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + "px"; canvas.style.height = h + "px";
    var ctx = canvas.getContext("2d");
    var scale = (w / A4_W) * dpr;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
  }
  function renderEditor() {
    if (!ed.doc) return;
    var canvas = $("ed-canvas"), ctx = canvas.getContext("2d");
    var dpr = window.devicePixelRatio || 1;
    var scale = (canvas.clientWidth / A4_W) * dpr;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    var pg = activePage();
    drawPaper(ctx, pg.paper, pg.paperColor, A4_W, A4_H);
    drawStrokes(ctx, pg.strokes);
    var info = $("ed-canvas").previousSibling;
    updatePageInfo();
  }
  function updatePageInfo() {
    var pages = BAStore.getPages(ed.doc);
    var t = $("editor-modal").querySelector(".ba-nb-create-actions"); /* placeholder safe */
  }
  function toVirtual(e) {
    var r = $("ed-canvas").getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width * A4_W, y: (e.clientY - r.top) / r.height * A4_H };
  }
  function pushUndo() {
    var pg = activePage();
    ed.undo.push(JSON.stringify(pg.strokes));
    if (ed.undo.length > 80) ed.undo.shift();
    ed.redo = [];
  }
  function doUndo() {
    var pg = activePage(); if (!ed.undo.length) return;
    ed.redo.push(JSON.stringify(pg.strokes));
    pg.strokes = JSON.parse(ed.undo.pop());
    pg.updatedAt = new Date().toISOString(); ed.doc.updatedAt = pg.updatedAt;
    renderEditor(); persistEditor();
  }
  function doRedo() {
    var pg = activePage(); if (!ed.redo.length) return;
    ed.undo.push(JSON.stringify(pg.strokes));
    pg.strokes = JSON.parse(ed.redo.pop());
    pg.updatedAt = new Date().toISOString(); ed.doc.updatedAt = pg.updatedAt;
    renderEditor(); persistEditor();
  }
  function persistEditor() { if (ed.doc) S.updateDocument(ed.doc.id, { pages: ed.doc.pages, updatedAt: ed.doc.updatedAt }); }

  function setupEditor() {
    var modal = $("editor-modal");
    window.addEventListener("resize", function () { if (modal.classList.contains("ba-modal-open")) { resizeEditor(); renderEditor(); } });
    var canvas = $("ed-canvas");
    canvas.addEventListener("pointerdown", function (e) {
      if (ed.mode === "view") return;
      if (ed.tool === "text") { placeText(e); return; }
      if (ed.tool === "select") { startSelect(e); return; }
      ed.drawing = true; try { canvas.setPointerCapture(e.pointerId); } catch (x) {}
      var p = toVirtual(e);
      var tool = ed.tool;
      if (tool === "shapes") tool = ed.shape;
      var cur = { tool: tool, color: ed.color, size: ed.size, points: [p, p] };
      if (tool === "pen") cur.style = ed.penStyle;
      if (tool === "pencil") cur.style = "pencil";
      if (tool === "highlighter") cur.density = ed.hlDensity;
      if (tool === "eraser") {
        if (ed.eraserMode === "stroke") { eraseStrokeAt(p, ed.eraserSize); ed.drawing = false; return; }
        cur.mode = "regular"; cur.size = ed.eraserSize;
      }
      ed.cur = cur;
      pushUndo();
    });
    canvas.addEventListener("pointermove", function (e) {
      if (!ed.drawing) {
        if (ed.tool === "select") {
          if (ed.select.mode === "free" && ed.select.free) moveSelect(e);
          else if (ed.select.rect) moveSelect(e);
        }
        return;
      }
      var p = toVirtual(e);
      if (["rect", "circle", "triangle", "line", "arrow", "square"].indexOf(ed.cur.tool) >= 0) ed.cur.points[1] = p;
      else ed.cur.points.push(p);
      renderEditor(); drawCurrent();
    });
    canvas.addEventListener("pointerup", function () {
      if (ed.drawing) {
        ed.drawing = false;
        if (ed.cur && ed.cur.points.length) { activePage().strokes.push(ed.cur); persistEditor(); }
        ed.cur = null; renderEditor();
      } else if (ed.tool === "select" && ed.select.mode === "free" && ed.select.free && ed.select.free.length > 2) {
        ed.select.poly = ed.select.free; ed.select.free = null; renderEditor();
      }
    });
    document.querySelectorAll("#editor-modal .ba-etb-btn, #editor-modal .ba-etb-ve").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var act = btn.getAttribute("data-act"), tool = btn.getAttribute("data-tool");
        if (act === "home") { persistEditor(); closeModal("editor-modal"); renderSchoolbag(); renderFolderIfOpen(); return; }
        if (act === "sidebar") { toggleSidebar(); return; }
        if (act === "undo") { doUndo(); return; }
        if (act === "redo") { doRedo(); return; }
        if (act === "addpage") { addEditorPage(); return; }
        if (act === "share") { exportDocPDF(); return; }
        if (act === "more") { showDocMenu(ed.doc.id); return; }
        if (act === "viewedit") { toggleViewEdit(); return; }
        if (tool) { setActiveToolBtn("editor-modal", tool); ed.tool = tool; renderToolOpts(); }
      });
    });
    $("ed-addpage").addEventListener("click", function () { addEditorPage(); });
  }
  function drawCurrent() {
    if (!ed.cur) return;
    var canvas = $("ed-canvas"), ctx = canvas.getContext("2d");
    var dpr = window.devicePixelRatio || 1;
    var scale = (canvas.clientWidth / A4_W) * dpr;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    var pg = activePage();
    drawPaper(ctx, pg.paper, pg.paperColor, A4_W, A4_H);
    drawStrokes(ctx, pg.strokes);
    drawStrokes(ctx, [ed.cur]);
  }
  function setActiveToolBtn(modalId, tool) {
    document.querySelectorAll("#" + modalId + " [data-tool]").forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-tool") === tool); });
  }
  function eraseStrokeAt(p, thr) {
    var pg = activePage(); var t = thr || 12;
    for (var i = pg.strokes.length - 1; i >= 0; i--) {
      if (hitStroke(pg.strokes[i], p, t)) { pushUndo(); pg.strokes.splice(i, 1); persistEditor(); renderEditor(); break; }
    }
  }
  function hitStroke(s, p, thr) {
    var pts = s.points || []; if (!pts.length) return false;
    var t = thr || 12;
    if (s.tool === "rect" || s.tool === "circle" || s.tool === "triangle" || s.tool === "line" || s.tool === "arrow" || s.tool === "square") {
      var b = bbox(s); return p.x >= b.x - t && p.x <= b.x + b.w + t && p.y >= b.y - t && p.y <= b.y + b.h + t;
    }
    for (var i = 0; i < pts.length; i++) { if (Math.hypot(pts[i].x - p.x, pts[i].y - p.y) < t) return true; }
    return false;
  }
  function bbox(s) {
    var pts = s.points || []; var xs = pts.map(function (p) { return p.x; }), ys = pts.map(function (p) { return p.y; });
    var x = Math.min.apply(null, xs), y = Math.min.apply(null, ys);
    return { x: x, y: y, w: Math.max.apply(null, xs) - x, h: Math.max.apply(null, ys) - y };
  }
  function addEditorPage() {
    var pg = BAStore.addPage(ed.doc.id, true);
    ed.pageIndex = BAStore.getPages(ed.doc).length - 1;
    ed.undo = []; ed.redo = [];
    renderEditor(); renderSidebar(); persistEditor();
  }
  function toggleSidebar() { $("ed-sidebar").classList.toggle("open"); if ($("ed-sidebar").classList.contains("open")) renderSidebar(); }
  function toggleViewEdit() {
    ed.mode = ed.mode === "edit" ? "view" : "edit";
    var btn = $("editor-modal").querySelector(".ba-ve-mode");
    btn.textContent = ed.mode === "edit" ? "Edit" : "View";
    $("editor-modal").classList.toggle("ba-editor-view", ed.mode === "view");
  }
/*__APPEND__*/

  function toolState() { if ($("whiteboard-modal").classList.contains("ba-modal-open")) return wb; return ed; }
  function renderToolOpts() {
    var ST = toolState();
    var box = $(ST === wb ? "wb-toolopts" : "ed-toolopts"); box.style.display = "flex";
    var html = "";
    if (ST === ed && ed.tool === "select") { renderSelectOpts(); $("ed-selectopts").style.display = "block"; box.style.display = "none"; return; }
    else { $("ed-selectopts").style.display = "none"; }
    if (ST.tool === "shapes") {
      var shapes = [["rect", "▢"], ["square", "◼"], ["circle", "◯"], ["triangle", "△"], ["line", "／"], ["arrow", "→"]];
      html += '<span class="ba-to-label">Shape</span>';
      shapes.forEach(function (s) { html += '<button class="ba-to-btn' + (ST.shape === s[0] ? " active" : "") + '" data-shape="' + s[0] + '">' + s[1] + '</button>'; });
      html += '<span class="ba-to-sep"></span>';
    }
    if (ST.tool === "pen") {
      html += '<span class="ba-to-label">Pen</span>';
      [["ball", "Ball"], ["fountain", "Fountain"], ["brush", "Brush"]].forEach(function (s) { html += '<button class="ba-to-btn' + (ST.penStyle === s[0] ? " active" : "") + '" data-penstyle="' + s[0] + '">' + s[1] + '</button>'; });
      html += '<span class="ba-to-sep"></span>';
    }
    if (ST.tool === "highlighter") {
      html += '<span class="ba-to-label">Density</span>';
      [["0.25", "Light"], ["0.4", "Med"], ["0.6", "Strong"]].forEach(function (s) { html += '<button class="ba-to-btn' + (Math.abs(ST.hlDensity - parseFloat(s[0])) < 0.001 ? " active" : "") + '" data-density="' + s[0] + '">' + s[1] + '</button>'; });
      html += '<span class="ba-to-sep"></span>';
    }
    if (ST.tool !== "eraser") {
      html += '<span class="ba-to-label">Color</span>';
      PEN_COLORS.concat(CUSTOM_COLORS).forEach(function (c) { html += '<span class="ba-to-swatch' + (c === ST.color ? " active" : "") + '" data-c="' + c + '" style="background:' + c + '"></span>'; });
      html += '<button class="ba-to-custom" data-custom="1">+</button>';
      html += '<span class="ba-to-sep"></span><span class="ba-to-label">Size</span><input type="range" class="ba-to-size" min="1" max="40" step="0.5" value="' + ST.size + '">';
    } else {
      html += '<span class="ba-to-label">Eraser</span>';
      html += '<button class="ba-to-btn' + (ST.eraserMode === "stroke" ? " active" : "") + '" data-emode="stroke">Stroke</button>';
      html += '<button class="ba-to-btn' + (ST.eraserMode !== "stroke" ? " active" : "") + '" data-emode="regular">Regular</button>';
      html += '<span class="ba-to-sep"></span><span class="ba-to-label">Size</span>';
      [["10", "S"], ["20", "M"], ["40", "L"]].forEach(function (s) { html += '<button class="ba-to-btn' + (ST.eraserSize === parseInt(s[0], 10) ? " active" : "") + '" data-esize="' + s[0] + '">' + s[1] + '</button>'; });
    }
    box.innerHTML = html;
    box.querySelectorAll("[data-c]").forEach(function (sw) { sw.addEventListener("click", function () { ST.color = sw.getAttribute("data-c"); renderToolOpts(); }); });
    box.querySelectorAll("[data-shape]").forEach(function (b) { b.addEventListener("click", function () { ST.shape = b.getAttribute("data-shape"); renderToolOpts(); }); });
    box.querySelectorAll("[data-penstyle]").forEach(function (b) { b.addEventListener("click", function () { ST.penStyle = b.getAttribute("data-penstyle"); renderToolOpts(); }); });
    box.querySelectorAll("[data-density]").forEach(function (b) { b.addEventListener("click", function () { ST.hlDensity = parseFloat(b.getAttribute("data-density")); renderToolOpts(); }); });
    box.querySelectorAll("[data-emode]").forEach(function (b) { b.addEventListener("click", function () { ST.eraserMode = b.getAttribute("data-emode"); renderToolOpts(); }); });
    box.querySelectorAll("[data-esize]").forEach(function (b) { b.addEventListener("click", function () { ST.eraserSize = parseInt(b.getAttribute("data-esize"), 10); renderToolOpts(); }); });
    var sz = box.querySelector(".ba-to-size"); if (sz) sz.addEventListener("input", function () { ST.size = parseFloat(this.value); });
    var cc = box.querySelector("[data-custom]"); if (cc) cc.addEventListener("click", function () {
      var c = prompt("Enter a hex color (e.g. #ff5500):", ST.color); if (c) { CUSTOM_COLORS.push(c); ST.color = c; renderToolOpts(); }
    });
  }
  function renderSelectOpts() {
    var sel = ed.select;
    var html = '<span class="ba-to-label">Mode</span><button class="ba-to-btn' + (sel.mode === "free" ? " active" : "") + '" data-smode="free">Freehand</button><button class="ba-to-btn' + (sel.mode === "rect" ? " active" : "") + '" data-smode="rect">Rectangle</button>';
    html += '<span class="ba-to-sep"></span><span class="ba-to-label">Select</span>';
    [["ink", "Ink"], ["shapes", "Shapes"], ["highlight", "Highlight"], ["text", "Text"]].forEach(function (f) {
      html += '<button class="ba-to-btn' + (sel.filters[f[0]] ? " active" : "") + '" data-filter="' + f[0] + '">' + f[1] + '</button>';
    });
    html += '<span class="ba-to-sep"></span><button class="ba-to-btn ba-to-danger" data-sdelete="1">Delete</button>';
    var box = $("ed-selectopts"); box.style.display = "flex"; box.innerHTML = html;
    box.querySelectorAll("[data-smode]").forEach(function (b) { b.addEventListener("click", function () { sel.mode = b.getAttribute("data-smode"); renderSelectOpts(); }); });
    box.querySelectorAll("[data-filter]").forEach(function (b) { b.addEventListener("click", function () { var f = b.getAttribute("data-filter"); sel.filters[f] = !sel.filters[f]; renderSelectOpts(); }); });
    box.querySelector("[data-sdelete]").addEventListener("click", deleteSelected);
    return html;
  }
  function startSelect(e) {
    var p = toVirtual(e);
    if (ed.select.mode === "free") { ed.select.free = [p]; ed.select.poly = null; ed.select.rect = null; }
    else { ed.select.rect = { x: p.x, y: p.y, w: 0, h: 0 }; ed.select.start = p; ed.select.free = null; ed.select.poly = null; }
  }
  function moveSelect(e) {
    var p = toVirtual(e);
    if (ed.select.mode === "free") {
      if (!ed.select.free) return;
      ed.select.free.push(p);
      renderEditor(); drawLasso(ed.select.free);
    } else {
      if (!ed.select.rect) return;
      var s = ed.select.start;
      ed.select.rect = { x: Math.min(s.x, p.x), y: Math.min(s.y, p.y), w: Math.abs(p.x - s.x), h: Math.abs(p.y - s.y) };
      renderEditor(); drawSelRect(ed.select.rect);
    }
  }
  function drawSelRect(r) {
    var c = $("ed-canvas"), ctx = c.getContext("2d"), dpr = window.devicePixelRatio || 1;
    var scale = (c.clientWidth / A4_W) * dpr; ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.strokeStyle = "#2f5bff"; ctx.lineWidth = 2; ctx.setLineDash([8, 6]); ctx.strokeRect(r.x, r.y, r.w, r.h); ctx.setLineDash([]);
  }
  function drawLasso(pts) {
    var c = $("ed-canvas"), ctx = c.getContext("2d"), dpr = window.devicePixelRatio || 1;
    var scale = (c.clientWidth / A4_W) * dpr; ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.strokeStyle = "#2f5bff"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
    for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y); ctx.stroke();
  }
  function pointInPoly(x, y, poly) {
    var inside = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var xi = poly[i].x, yi = poly[i].y, xj = poly[j].x, yj = poly[j].y;
      var hit = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (hit) inside = !inside;
    }
    return inside;
  }
  function strokeInPoly(s, poly) {
    if (s.tool === "text") return pointInPoly(s.x, s.y, poly);
    var pts = s.points || []; for (var i = 0; i < pts.length; i++) if (pointInPoly(pts[i].x, pts[i].y, poly)) return true;
    return false;
  }
  function deleteSelected() {
    var pg = activePage(); var f = ed.select.filters;
    var inSel = function (s) {
      if (s.tool === "text" && !f.text) return false;
      if ((s.tool === "rect" || s.tool === "circle" || s.tool === "triangle" || s.tool === "square" || s.tool === "line" || s.tool === "arrow") && !f.shapes) return false;
      if (s.tool === "highlighter" && !f.highlight) return false;
      if (s.tool !== "highlighter" && s.tool !== "text" && (s.tool === "pen" || s.tool === "pencil" || s.tool === "eraser" || !s.tool) && !f.ink) return false;
      if (ed.select.poly) return strokeInPoly(s, ed.select.poly);
      var r = ed.select.rect; if (!r) return false;
      var b = s.tool === "text" ? { x: s.x, y: s.y, w: 4, h: 4 } : bbox(s);
      return b.x >= r.x && b.x + b.w <= r.x + r.w && b.y >= r.y && b.y + b.h <= r.y + r.h;
    };
    pushUndo();
    pg.strokes = pg.strokes.filter(function (s) { return !inSel(s); });
    ed.select.rect = null; ed.select.poly = null; ed.select.free = null; persistEditor(); renderEditor();
  }
  function placeText(e) {
    var p = toVirtual(e);
    var t = prompt("Enter text:"); if (!t) return;
    pushUndo();
    activePage().strokes.push({ tool: "text", x: p.x, y: p.y, text: t, color: ed.color, size: ed.size * 8 });
    persistEditor(); renderEditor();
  }
/*__APPEND__*/

  function renderSidebar() {
    var wrap = $("ed-pages"); if (!wrap) return;
    var pages = BAStore.getPages(ed.doc);
    wrap.innerHTML = "";
    pages.forEach(function (pg, idx) {
      var th = document.createElement("div");
      th.className = "ba-ed-thumb" + (idx === ed.pageIndex ? " active" : "");
      th.innerHTML = '<canvas width="84" height="118"></canvas><span class="ba-ed-thumb-n">' + (idx + 1) + '</span>' +
        '<button class="ba-ed-thumb-del" title="Delete">✕</button><button class="ba-ed-thumb-dup" title="Duplicate">⧉</button>' +
        '<button class="ba-ed-thumb-up" title="Move up">▲</button><button class="ba-ed-thumb-down" title="Move down">▼</button>';
      var c = th.querySelector("canvas"); var cx = c.getContext("2d");
      cx.save(); var s = Math.min(84 / A4_W, 118 / A4_H); cx.translate((84 - A4_W * s) / 2, (118 - A4_H * s) / 2); cx.scale(s, s);
      drawPaper(cx, pg.paper, pg.paperColor, A4_W, A4_H); drawStrokes(cx, pg.strokes); cx.restore();
      th.querySelector("canvas").addEventListener("click", function () { ed.pageIndex = idx; ed.undo = []; ed.redo = []; renderEditor(); renderSidebar(); });
      th.querySelector(".ba-ed-thumb-del").addEventListener("click", function (e) {
        e.stopPropagation();
        if (pages.length <= 1) { alert("A notebook needs at least one page."); return; }
        BAStore.deletePage(ed.doc.id, pg.id); ed.pageIndex = Math.min(ed.pageIndex, pages.length - 2);
        renderEditor(); renderSidebar(); persistEditor();
      });
      th.querySelector(".ba-ed-thumb-dup").addEventListener("click", function (e) {
        e.stopPropagation();
        BAStore.duplicatePage(ed.doc.id, pg.id); renderSidebar(); persistEditor();
      });
      th.querySelector(".ba-ed-thumb-up").addEventListener("click", function (e) {
        e.stopPropagation();
        if (idx > 0) { BAStore.reorderPage(ed.doc.id, pg.id, idx - 1); ed.pageIndex = idx - 1; renderEditor(); renderSidebar(); persistEditor(); }
      });
      th.querySelector(".ba-ed-thumb-down").addEventListener("click", function (e) {
        e.stopPropagation();
        if (idx < pages.length - 1) { BAStore.reorderPage(ed.doc.id, pg.id, idx + 1); ed.pageIndex = idx + 1; renderEditor(); renderSidebar(); persistEditor(); }
      });
      wrap.appendChild(th);
    });
  }

  /* Export to PDF via print (A4 preserved) */
  function exportDocPDF() {
    var pages = BAStore.getPages(ed.doc);
    var w = window.open("", "_blank");
    if (!w) { alert("Please allow pop-ups to export."); return; }
    var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + esc(ed.doc.title) + '</title><style>' +
      'body{margin:0;font-family:sans-serif}@page{size:A4;margin:0}.pg{width:210mm;height:297mm;page-break-after:always;position:relative}canvas{width:210mm;height:297mm;display:block}</style></head><body>';
    pages.forEach(function (pg) {
      var cv = document.createElement("canvas"); cv.width = A4_W; cv.height = A4_H;
      var ctx = cv.getContext("2d"); drawPaper(ctx, pg.paper, pg.paperColor, A4_W, A4_H); drawStrokes(ctx, pg.strokes);
      html += '<div class="pg"><img src="' + cv.toDataURL("image/png") + '" style="width:210mm;height:297mm"></div>';
    });
    html += '</body></html>';
    w.document.open(); w.document.write(html); w.document.close();
    setTimeout(function () { w.focus(); w.print(); }, 400);
  }
/*__APPEND__*/

  /* ============================================================
     WHITEBOARD (infinite canvas)
     ============================================================ */
  var wb = { doc: null, undo: [], redo: [], cam: { x: 0, y: 0, zoom: 1 }, tool: "pen", shape: "rect", color: "#2f5bff", size: 2.5, penStyle: "ball", hlDensity: 0.4, eraserSize: 18, drawing: false, cur: null, pointers: {}, panning: false };
  function openWhiteboard(doc) {
    wb.doc = doc; wb.undo = []; wb.redo = []; wb.cam = doc.wb.camera || { x: 0, y: 0, zoom: 1 }; wb.tool = "pen";
    setActiveToolBtn("whiteboard-modal", "pen");
    openModal("whiteboard-modal");
    setTimeout(function () { resizeWB(); renderWB(); renderWBToolBar(); }, 60);
  }
function createWhiteboard(folderId, subject) {
    console.log("[createWhiteboard] called, folderId:", folderId, "subject:", subject);
    var doc = S.addDocument({ type: "whiteboard", title: "Whiteboard", subject: subject || null, folderId: folderId || null,
      wb: { strokes: [], shapes: [], text: [], camera: { x: 0, y: 0, zoom: 1 } } });
    renderSchoolbag(); openWhiteboard(doc);
  }
  function openWhiteboardCreate() {
    var name = prompt("Whiteboard name:", "Whiteboard");
    var doc = S.addDocument({ type: "whiteboard", title: name || "Whiteboard", subject: null, folderId: null,
      wb: { strokes: [], shapes: [], text: [], camera: { x: 0, y: 0, zoom: 1 } } });
    renderSchoolbag(); openWhiteboard(doc);
  }
  function resizeWB() {
    var stage = $("wb-stage"), canvas = $("wb-canvas"); var dpr = window.devicePixelRatio || 1;
    canvas.width = stage.clientWidth * dpr; canvas.height = stage.clientHeight * dpr;
    canvas.style.width = stage.clientWidth + "px"; canvas.style.height = stage.clientHeight + "px";
  }
  function wbWorld(e) {
    var r = $("wb-canvas").getBoundingClientRect();
    return { x: (e.clientX - r.left - wb.cam.x) / wb.cam.zoom, y: (e.clientY - r.top - wb.cam.y) / wb.cam.zoom };
  }
  function renderWB() {
    var canvas = $("wb-canvas"), ctx = canvas.getContext("2d"); var dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#f4f6fb"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(wb.cam.x, wb.cam.y); ctx.scale(wb.cam.zoom, wb.cam.zoom);
    drawWBGrid(ctx);
    drawStrokes(ctx, wb.doc.wb.strokes);
    if (wb.cur) drawStrokes(ctx, [wb.cur]);
    ctx.restore();
  }
  function drawWBGrid(ctx) {
    var step = 40;
    var x0 = -wb.cam.x / wb.cam.zoom, y0 = -wb.cam.y / wb.cam.zoom;
    var x1 = x0 + canvasWidth() / wb.cam.zoom, y1 = y0 + canvasHeight() / wb.cam.zoom;
    ctx.strokeStyle = "rgba(120,140,180,.12)"; ctx.lineWidth = 1 / wb.cam.zoom;
    for (var x = Math.floor(x0 / step) * step; x < x1; x += step) { ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke(); }
    for (var y = Math.floor(y0 / step) * step; y < y1; y += step) { ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); }
  }
  function canvasWidth() { return $("wb-canvas").clientWidth; }
  function canvasHeight() { return $("wb-canvas").clientHeight; }
  function wbPushUndo() { wb.undo.push(JSON.stringify(wb.doc.wb.strokes)); if (wb.undo.length > 80) wb.undo.shift(); wb.redo = []; }
  function wbPersist() { wb.doc.wb.camera = wb.cam; S.updateDocument(wb.doc.id, { wb: wb.doc.wb, updatedAt: new Date().toISOString() }); }
  function setupWhiteboard() {
    var modal = $("whiteboard-modal");
    window.addEventListener("resize", function () { if (modal.classList.contains("ba-modal-open")) { resizeWB(); renderWB(); } });
    var canvas = $("wb-canvas");
    canvas.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    canvas.addEventListener("pointerdown", function (e) {
      wb.pointers[e.pointerId] = e;
      if (Object.keys(wb.pointers).length === 2) { wb.panning = "pinch"; wb.drawing = false; return; }
      if (e.button === 2 || e.button === 1) { wb.panning = "drag"; wb.panStart = { x: e.clientX, y: e.clientY, cx: wb.cam.x, cy: wb.cam.y }; return; }
      if (e.button !== 0) return;
      if (wb.tool === "text") { var p = wbWorld(e); var t = prompt("Text:"); if (t) { wbPushUndo(); wb.doc.wb.strokes.push({ tool: "text", x: p.x, y: p.y, text: t, color: wb.color, size: wb.size * 6 }); wbPersist(); renderWB(); } return; }
      wb.drawing = true; try { canvas.setPointerCapture(e.pointerId); } catch (x) {}
      var p = wbWorld(e); var tool = wb.tool === "shapes" ? wb.shape : wb.tool;
      var cur = { tool: tool, color: wb.color, size: wb.size, points: [p, p] };
      if (tool === "pen") cur.style = wb.penStyle;
      if (tool === "pencil") cur.style = "pencil";
      if (tool === "highlighter") cur.density = wb.hlDensity;
      if (tool === "eraser") { if (wb.eraserMode === "stroke") { /* not used on wb */ } cur.mode = "regular"; cur.size = wb.eraserSize; }
      wb.cur = cur;
      wbPushUndo();
    });
    canvas.addEventListener("pointermove", function (e) {
      wb.pointers[e.pointerId] = e;
      if (wb.panning === "pinch" && Object.keys(wb.pointers).length === 2) { wbPinch(); return; }
      if (wb.panning === "drag") {
        wb.cam.x = wb.panStart.cx + (e.clientX - wb.panStart.x); wb.cam.y = wb.panStart.cy + (e.clientY - wb.panStart.y); renderWB(); return;
      }
      if (!wb.drawing) return;
      var p = wbWorld(e);
      if (["rect", "circle", "triangle", "line", "arrow", "square"].indexOf(wb.cur.tool) >= 0) wb.cur.points[1] = p; else wb.cur.points.push(p);
      renderWB();
    });
    function up(e) {
      delete wb.pointers[e.pointerId];
      if (wb.panning === "pinch") { if (Object.keys(wb.pointers).length < 2) { wb.panning = false; wb.pinchDist = null; } return; }
      if (wb.panning === "drag") { if (Object.keys(wb.pointers).length === 0) wb.panning = false; return; }
      if (wb.drawing) { wb.drawing = false; if (wb.cur && wb.cur.points.length) { wb.doc.wb.strokes.push(wb.cur); wb.cur = null; wbPersist(); } renderWB(); }
    }
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("wheel", function (e) {
      e.preventDefault();
      var r = canvas.getBoundingClientRect();
      var mx = e.clientX - r.left, my = e.clientY - r.top;
      var wx = (mx - wb.cam.x) / wb.cam.zoom, wy = (my - wb.cam.y) / wb.cam.zoom;
      var f = e.deltaY < 0 ? 1.1 : 0.9;
      wb.cam.zoom = Math.max(0.2, Math.min(5, wb.cam.zoom * f));
      wb.cam.x = mx - wx * wb.cam.zoom; wb.cam.y = my - wy * wb.cam.zoom;
      renderWB();
    }, { passive: false });
    document.querySelectorAll("#whiteboard-modal .ba-etb-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var act = btn.getAttribute("data-act"), tool = btn.getAttribute("data-tool");
        if (act === "home") { wbPersist(); closeModal("whiteboard-modal"); renderSchoolbag(); renderFolderIfOpen(); return; }
        if (act === "wb-fit") { wb.cam = { x: 0, y: 0, zoom: 1 }; renderWB(); return; }
        if (act === "undo") { if (wb.undo.length) { wb.redo.push(JSON.stringify(wb.doc.wb.strokes)); wb.doc.wb.strokes = JSON.parse(wb.undo.pop()); wbPersist(); renderWB(); } return; }
        if (act === "redo") { if (wb.redo.length) { wb.undo.push(JSON.stringify(wb.doc.wb.strokes)); wb.doc.wb.strokes = JSON.parse(wb.redo.pop()); wbPersist(); renderWB(); } return; }
        if (act === "share") { exportWB(); return; }
        if (act === "more") { showDocMenu(wb.doc.id); return; }
        if (tool) { setActiveToolBtn("whiteboard-modal", tool); wb.tool = tool; renderWBToolBar(); }
      });
    });
  }
  function wbPinch() {
    var ids = Object.keys(wb.pointers); if (ids.length < 2) return;
    var a = wb.pointers[ids[0]], b = wb.pointers[ids[1]];
    var dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    if (!wb.pinchDist) wb.pinchDist = dist;
    var f = dist / wb.pinchDist; wb.pinchDist = dist;
    wb.cam.zoom = Math.max(0.2, Math.min(5, wb.cam.zoom * f));
    renderWB();
  }
  function renderWBToolBar() {
    var box = $("wb-toolopts"); box.style.display = "flex";
    var html = "";
    if (wb.tool === "shapes") {
      [["rect", "▢"], ["circle", "◯"], ["triangle", "△"], ["line", "／"], ["arrow", "→"]].forEach(function (s) { html += '<button class="ba-to-btn' + (wb.shape === s[0] ? " active" : "") + '" data-wshape="' + s[0] + '">' + s[1] + '</button>'; });
      html += '<span class="ba-to-sep"></span>';
    }
    html += '<span class="ba-to-label">Color</span>';
    PEN_COLORS.concat(CUSTOM_COLORS).forEach(function (c) { html += '<span class="ba-to-swatch' + (c === wb.color ? " active" : "") + '" data-wc="' + c + '" style="background:' + c + '"></span>'; });
    html += '<span class="ba-to-sep"></span><span class="ba-to-label">Size</span><input type="range" class="ba-to-size" min="1" max="40" step="0.5" value="' + wb.size + '">';
    box.innerHTML = html;
    box.querySelectorAll("[data-wshape]").forEach(function (b) { b.addEventListener("click", function () { wb.shape = b.getAttribute("data-wshape"); renderWBToolBar(); }); });
    box.querySelectorAll("[data-wc]").forEach(function (sw) { sw.addEventListener("click", function () { wb.color = sw.getAttribute("data-wc"); renderWBToolBar(); }); });
    box.querySelector(".ba-to-size").addEventListener("input", function () { wb.size = parseFloat(this.value); });
  }
  function exportWB() {
    var cv = document.createElement("canvas"); cv.width = 1600; cv.height = 1000;
    var ctx = cv.getContext("2d"); ctx.fillStyle = "#f4f6fb"; ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.save(); ctx.translate(cv.width / 2, cv.height / 2); drawStrokes(ctx, wb.doc.wb.strokes); ctx.restore();
    var w = window.open("", "_blank"); if (!w) { alert("Allow pop-ups to export."); return; }
    w.document.open(); w.document.write('<img src="' + cv.toDataURL() + '" style="width:100%"><script>window.onload=function(){window.print()}<\/script>'); w.document.close();
  }
/*__APPEND__*/

  /* ============================================================
     SHEET (spreadsheet)
     ============================================================ */
  function openSheetCreate(folderId, subject) {
    console.log("[openSheetCreate] called, folderId:", folderId, "subject:", subject);
    var name = prompt("Sheet name:", "Sheet"); if (name === null) return;
    var cols = 4, rows = 10, data = [];
    for (var r = 0; r < rows; r++) { var row = []; for (var c = 0; c < cols; c++) row.push(""); data.push(row); }
    var doc = S.addDocument({ type: "sheet", title: name || "Sheet", subject: subject || null, folderId: folderId || null,
      sheet: { rows: rows, cols: cols, data: data, colWidths: [], rowHeights: new Array(rows).fill(38) } });
    renderSchoolbag(); openSheetEditor(doc);
  }
  var activeSheet = null;
  function openSheetEditor(d) {
    activeSheet = d;
    if (!d.sheet) {
      var rows = 10, cols = 4;
      d.sheet = { rows: rows, cols: cols, data: Array.from({length: rows}, () => Array(cols).fill("")), colWidths: [], rowHeights: new Array(rows).fill(38) };
    }
    if (!d.sheet.rowHeights || d.sheet.rowHeights.length !== d.sheet.rows) d.sheet.rowHeights = new Array(d.sheet.rows).fill(38);
    $("sheet-editor-title").textContent = d.title;
    openModal("sheet-editor-modal");
    renderSheet();
  }
  function colLetter(n) { var s = ""; n++; while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; }
  function renderSheet() {
    var table = $("sheet-grid"); var sh = activeSheet.sheet; table.innerHTML = "";
    var thead = document.createElement("tr"); var corner = document.createElement("th"); corner.className = "ba-sheet-rowhead"; thead.appendChild(corner);
    for (var c = 0; c < sh.cols; c++) { var th = document.createElement("th"); th.className = "ba-sheet-colhead"; th.textContent = colLetter(c); th.style.width = (sh.colWidths[c] || 80) + "px"; thead.appendChild(th); }
    table.appendChild(thead);
    for (var r = 0; r < sh.rows; r++) {
      var tr = document.createElement("tr"); tr.style.height = (sh.rowHeights[r] || 38) + "px";
      var rh = document.createElement("th"); rh.className = "ba-sheet-rowhead"; rh.textContent = r + 1; tr.appendChild(rh);
      for (var c2 = 0; c2 < sh.cols; c2++) {
        var td = document.createElement("td"); td.className = "ba-sheet-cell"; td.contentEditable = "true"; td.style.width = (sh.colWidths[c2] || 80) + "px";
        td.innerHTML = sh.data[r][c2] || "";
        td.setAttribute("data-r", r); td.setAttribute("data-c", c2);
        td.addEventListener("blur", function () { sh.data[+this.getAttribute("data-r")][+this.getAttribute("data-c")] = this.innerHTML; persistSheet(); });
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
  }
  function persistSheet() { if (activeSheet) S.updateDocument(activeSheet.id, { sheet: activeSheet.sheet, updatedAt: new Date().toISOString() }); }
  function setupSheetEditor() {
    var seb = $("sheet-editor-back"); if (seb) seb.addEventListener("click", function () { persistSheet(); closeModal("sheet-editor-modal"); renderSchoolbag(); renderFolderIfOpen(); });
    document.querySelectorAll("#sheet-editor-modal [data-action]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var a = btn.getAttribute("data-action"); if (!activeSheet) return;
        if (a === "add-row") { activeSheet.sheet.rows++; activeSheet.sheet.data.push(new Array(activeSheet.sheet.cols).fill("")); activeSheet.sheet.rowHeights.push(38); }
        else if (a === "del-row") { if (activeSheet.sheet.rows > 1) { activeSheet.sheet.rows--; activeSheet.sheet.data.pop(); activeSheet.sheet.rowHeights.pop(); } }
        else if (a === "add-col") { activeSheet.sheet.cols++; activeSheet.sheet.data.forEach(function (r) { r.push(""); }); }
        else if (a === "del-col") { if (activeSheet.sheet.cols > 1) { activeSheet.sheet.cols--; activeSheet.sheet.data.forEach(function (r) { r.pop(); }); } }
        renderSheet(); persistSheet();
      });
    });
    document.querySelectorAll("#sheet-editor-modal [data-format]").forEach(function (btn) {
      btn.addEventListener("mousedown", function (e) { e.preventDefault(); });
      btn.addEventListener("click", function () { document.execCommand(this.getAttribute("data-format")); });
    });
    var sw = $("sheet-swatches");
    if (sw) {
      ["#0f0f0f", "#2f5bff", "#ff6a5e", "#2fbf6f", "#ffc21c"].forEach(function (c) {
        var s = document.createElement("span"); s.className = "ba-nb-swatch"; s.style.background = c;
        s.addEventListener("mousedown", function (e) { e.preventDefault(); });
        s.addEventListener("click", function () { document.execCommand("foreColor", false, c); });
        sw.appendChild(s);
      });
    }
  }

  /* ============================================================
     QUICK NOTE
     ============================================================ */
  var activeQN = null;
  function openQuickNote(folderId, subject) {
    console.log("[openQuickNote] called, folderId:", folderId, "subject:", subject);
    var doc = S.addDocument({ type: "quicknote", title: "Quick Note", subject: subject || null, folderId: folderId || null, text: "" });
    renderSchoolbag(); openQuickNoteEdit(doc);
  }
  function openQuickNoteEdit(d) {
    activeQN = d; $("qn-title").value = d.title || ""; $("qn-text").value = d.text || "";
    openModal("quicknote-modal");
  }
  function setupQuickNote() {
    var qnb = $("qn-back"); if (qnb) qnb.addEventListener("click", function () {
      if (activeQN) S.updateDocument(activeQN.id, { title: $("qn-title").value || "Quick Note", text: $("qn-text").value, updatedAt: new Date().toISOString() });
      closeModal("quicknote-modal"); renderSchoolbag(); renderFolderIfOpen();
    });
  }

  /* ============================================================
     HOMEWORK
     ============================================================ */
  function setupHomework() {
    var hwc = $("hw-close"); if (hwc) hwc.addEventListener("click", function () { closeModal("homework-modal"); });
    var hwf = $("hw-form"); if (hwf) hwf.addEventListener("submit", function (e) {
      e.preventDefault();
      var hs = $("hw-subject"); var ht = $("hw-task"); var hd = $("hw-due");
      S.addHomework({ subject: hs ? hs.value : "", task: ht ? ht.value : "", due: hd ? hd.value : "", done: false });
      this.reset(); renderHomework(); renderHome();
    });
  }
  function renderHomework() {
    var wrap = $("hw-list"); wrap.innerHTML = "";
    var hw = DB.homework;
    var done = hw.filter(function (h) { return h.done; });
    var today = hw.filter(function (h) { return !h.done && (!h.due || /today/i.test(h.due)); });
    var tom = hw.filter(function (h) { return !h.done && /tomorrow/i.test(h.due); });
    var up = hw.filter(function (h) { return !h.done && h.due && !/today|tomorrow/i.test(h.due); });
    function grp(title, list) {
      if (!list.length) return;
      var g = document.createElement("div"); g.innerHTML = '<div class="ba-hw-group-title">' + title + '</div>';
      list.forEach(function (h) {
        var row = document.createElement("div"); row.className = "ba-hw-item" + (h.done ? " done" : "");
        row.innerHTML = '<input type="checkbox" class="ba-hw-check"' + (h.done ? " checked" : "") + '><div><div class="ba-hw-subject">' + esc(h.subject) + '</div><div class="ba-hw-task">' + esc(h.task) + '</div>' + (h.due ? '<div class="ba-hw-due">Due: ' + esc(h.due) + '</div>' : '') + '</div>';
        row.querySelector(".ba-hw-check").addEventListener("change", function () { S.updateHomework(h.id, { done: this.checked }); renderHomework(); renderHome(); });
        g.appendChild(row);
      });
      wrap.appendChild(g);
    }
    grp("TODAY", today); grp("TOMORROW", tom); grp("UPCOMING", up); grp("COMPLETED", done);
  }
  function openToolsMenu() { console.log("[openToolsMenu] called"); openModal("tools-menu-modal"); }
/*__APPEND__*/

  /* ============================================================
     PDF READER + ANNOTATION LAYER (separate from source PDF)
     ============================================================ */
  var pdf = { book: null, page: 1, zoom: 100, annotating: false, undo: [], redo: [], drawing: false, cur: null };
  function openPdf(book) {
    console.log("[openPdf] called, book:", book);
    pdf.book = book; pdf.page = 1; pdf.zoom = 100; pdf.annotating = false; pdf.undo = []; pdf.redo = [];
    $("pdf-title").textContent = book.subject;
    $("pdf-ve").textContent = "View";
    $("pdf-annotation-toolbar").style.display = "none";
    $("pdf-tools").style.display = "flex";
    gotoPdf(1); openModal("pdf-reader-modal");
    setTimeout(setupPdfOverlay, 200);
  }
  function gotoPdf(n) {
    if (!pdf.book) return;
    pdf.page = Math.max(1, n);
    var bm = S.getBookmark(pdf.book.subject);
    $("pdf-iframe").src = encodeURI(pdf.book.file) + "#page=" + pdf.page + "&zoom=" + pdf.zoom;
    $("pdf-current-page").textContent = pdf.page;
    if ($("pdf-page-input")) $("pdf-page-input").value = pdf.page;
    if (pdf.annotating) renderPdfAnnot();
  }
  function setupPdfOverlay() {
    var ov = $("pdf-annot-overlay"); var v = $("pdf-viewer"); var dpr = window.devicePixelRatio || 1;
    ov.width = v.clientWidth * dpr; ov.height = v.clientHeight * dpr;
    ov.style.width = v.clientWidth + "px"; ov.style.height = v.clientHeight + "px";
  }
  function annKey() { return pdf.book ? pdf.book.subject + ":" + pdf.page : null; }
  function loadPdfStrokes() { var rec = S.getPdfAnnotation(annKey()); return rec && rec.strokes ? rec.strokes : []; }
  function resetPdfUndo() { pdf.undo = JSON.parse(JSON.stringify(loadPdfStrokes())); pdf.redo = []; }
  function renderPdfAnnot() {
    var ov = $("pdf-annot-overlay"); if (!ov) return;
    var ctx = ov.getContext("2d"); var dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, ov.clientWidth, ov.clientHeight);
    var strokes = loadPdfStrokes();
    strokes.forEach(function (s) {
      ctx.lineJoin = "round"; ctx.lineCap = "round";
      ctx.strokeStyle = s.color; ctx.lineWidth = s.size; ctx.globalAlpha = s.tool === "highlighter" ? 0.4 : 1;
      if (s.tool === "highlighter") ctx.globalAlpha = 0.4;
      ctx.beginPath(); var p = s.points[0]; ctx.moveTo(p.x * ov.clientWidth, p.y * ov.clientHeight);
      for (var i = 1; i < s.points.length; i++) ctx.lineTo(s.points[i].x * ov.clientWidth, s.points[i].y * ov.clientHeight);
      ctx.stroke(); ctx.globalAlpha = 1;
    });
  }
  function savePdfStrokes(strokes) { S.setPdfAnnotation(annKey(), { page: pdf.page, strokes: strokes }); }
  function setupPdfReader() {
    var pb = $("pdf-back"); if (pb) pb.addEventListener("click", function () { closeModal("pdf-reader-modal"); var pi = $("pdf-iframe"); if (pi) pi.src = "about:blank"; });
    var pp = $("pdf-prev"); if (pp) pp.addEventListener("click", function () { gotoPdf(pdf.page - 1); });
    var pn = $("pdf-next"); if (pn) pn.addEventListener("click", function () { gotoPdf(pdf.page + 1); });
    var ppi = $("pdf-page-input"); if (ppi) ppi.addEventListener("change", function () { gotoPdf(parseInt(this.value, 10) || 1); });
    var pzi = $("pdf-zoom-in"); if (pzi) pzi.addEventListener("click", function () { pdf.zoom = Math.min(300, pdf.zoom + 25); gotoPdf(pdf.page); });
    var pzo = $("pdf-zoom-out"); if (pzo) pzo.addEventListener("click", function () { pdf.zoom = Math.max(50, pdf.zoom - 25); gotoPdf(pdf.page); });
    var pbk = $("pdf-bookmark"); if (pbk) pbk.addEventListener("click", function () { if (!pdf.book) return; S.setBookmark(pdf.book.subject, pdf.page); var b = $("pdf-bookmark"); if (b) { b.textContent = "🔖✓"; setTimeout(function () { b.textContent = "🔖"; }, 1200); } });
    var pve = $("pdf-ve"); if (pve) pve.addEventListener("click", function () {
      pdf.annotating = !pdf.annotating;
      var pve2 = $("pdf-ve"); if (pve2) pve2.textContent = pdf.annotating ? "Edit" : "View";
      var pat = $("pdf-annotation-toolbar"); if (pat) pat.style.display = pdf.annotating ? "flex" : "none";
      var ov = $("pdf-annot-overlay"); if (ov) ov.style.pointerEvents = pdf.annotating ? "auto" : "none";
      if (pdf.annotating) { setupPdfOverlay(); resetPdfUndo(); renderPdfAnnot(); }
    });
    var ov = $("pdf-annot-overlay");
    if (ov) {
      ov.addEventListener("pointerdown", function (e) {
        if (!pdf.annotating) return;
        pdf.drawing = true; try { ov.setPointerCapture(e.pointerId); } catch (x) {}
        var r = ov.getBoundingClientRect();
        var p = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
        var t = currentPdfTool();
        if (t.tool === "eraser") { erasePdfAt(p); pdf.drawing = false; return; }
        pdf.cur = { tool: t.tool, color: t.color, size: t.size, points: [p, p] };
      });
      ov.addEventListener("pointermove", function (e) {
        if (!pdf.drawing) return;
        var r = ov.getBoundingClientRect(); var p = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
        if (["rect", "circle", "triangle", "line", "arrow"].indexOf(pdf.cur.tool) >= 0) pdf.cur.points[1] = p; else pdf.cur.points.push(p);
        renderPdfAnnotLive();
      });
      ov.addEventListener("pointerup", function () {
        if (!pdf.drawing) return; pdf.drawing = false;
        if (pdf.cur && pdf.cur.points.length) { var s = loadPdfStrokes(); s.push(pdf.cur); savePdfStrokes(s); }
        pdf.cur = null; renderPdfAnnot();
      });
    }
    document.querySelectorAll("#pdf-annotation-toolbar .ba-annotate-tool").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var t = btn.getAttribute("data-tool"), act = btn.getAttribute("data-action");
        if (act === "undo") { var s = loadPdfStrokes(); if (s.length) { pdf.redo.push(s.pop()); savePdfStrokes(s); renderPdfAnnot(); } return; }
        if (act === "redo") { if (pdf.redo.length) { var s2 = loadPdfStrokes(); s2.push(pdf.redo.pop()); savePdfStrokes(s2); renderPdfAnnot(); } return; }
        if (act === "save") { renderPdfAnnot(); alert("Annotations saved."); return; }
        if (t) { document.querySelectorAll("#pdf-annotation-toolbar .ba-annotate-tool").forEach(function (b) { b.classList.remove("active"); }); btn.classList.add("active"); }
      });
    });
  }
  function currentPdfTool() {
    var active = document.querySelector("#pdf-annotation-toolbar .ba-annotate-tool.active");
    if (!active) return { tool: "pen", color: "#2f5bff", size: 2.5 };
    var t = active.getAttribute("data-tool");
    var sz = t === "highlighter" ? 14 : t === "eraser" ? 18 : t === "pencil" ? 1.5 : 2.5;
    return { tool: t, color: active.getAttribute("data-color") || "#2f5bff", size: sz };
  }
  function renderPdfAnnotLive() {
    renderPdfAnnot();
    var ov = $("pdf-annot-overlay"); var ctx = ov.getContext("2d"); var dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalAlpha = 1;
    var s = pdf.cur; ctx.strokeStyle = s.color; ctx.lineWidth = s.size;
    if (["rect", "circle", "triangle", "line", "arrow"].indexOf(s.tool) >= 0) {
      var p0 = s.points[0], p1 = s.points[1];
      ctx.beginPath();
      if (s.tool === "rect") ctx.rect(Math.min(p0.x, p1.x) * ov.clientWidth, Math.min(p0.y, p1.y) * ov.clientHeight, Math.abs(p1.x - p0.x) * ov.clientWidth, Math.abs(p1.y - p0.y) * ov.clientHeight);
      else if (s.tool === "circle") ctx.arc(p0.x * ov.clientWidth, p0.y * ov.clientHeight, Math.hypot((p1.x - p0.x) * ov.clientWidth, (p1.y - p0.y) * ov.clientHeight), 0, Math.PI * 2);
      ctx.stroke();
    } else { ctx.beginPath(); ctx.moveTo(s.points[0].x * ov.clientWidth, s.points[0].y * ov.clientHeight); for (var i = 1; i < s.points.length; i++) ctx.lineTo(s.points[i].x * ov.clientWidth, s.points[i].y * ov.clientHeight); ctx.stroke(); }
  }
  function erasePdfAt(p) {
    var s = loadPdfStrokes();
    for (var i = s.length - 1; i >= 0; i--) {
      var st = s[i]; var pts = st.points;
      for (var j = 0; j < pts.length; j++) { if (Math.hypot(pts[j].x - p.x, pts[j].y - p.y) < 0.03) { s.splice(i, 1); savePdfStrokes(s); renderPdfAnnot(); return; } }
    }
  }
  function openScheduleExamsSafe() { openScheduleExams(); }  function renderExamInfo() {
    var block = $("ba-exam-block");
    if (!block) return;
    var cls = (DB.settings.class || "X") + "-" + (DB.settings.section || "C");
    var school = DB.settings.school || "Bahria College Karsaz";
    var rows = block.querySelectorAll(".ba-exam-row");
    rows.forEach(function (r) {
      var spans = r.querySelectorAll("span");
      if (spans.length >= 2) {
        if (spans[0].textContent === "Class") spans[1].textContent = cls;
        if (spans[0].textContent === "School") spans[1].textContent = school;
      }
    });
  }
  function renderSettingsSchoolInfo() {
    var school = DB.settings.school || "Bahria College Karsaz";
    var cls = (DB.settings.class || "X") + "-" + (DB.settings.section || "C");
    var teacher = DB.settings.teacher || "Ms. Saeeda (47)";
    var address = DB.settings.address || "Habib Rehmatullah Rd";
    var logo = DB.settings.logo || "assets/bahria-clg-logo.png";
    if ($("setting-school-display")) $("setting-school-display").textContent = school;
    if ($("setting-class-display")) $("setting-class-display").textContent = cls;
    if ($("setting-teacher-display")) $("setting-teacher-display").textContent = teacher;
    if ($("setting-address-display")) $("setting-address-display").textContent = address;
    var logoImg = document.querySelector(".ba-settings-school-logo");
    if (logoImg) logoImg.src = logo;
  }


  /* ============================================================
     TOOLS: Calculator + Clock + Focus + Formulas + Stickies
     ============================================================ */
  function setupTools() {
    var toolsBack = $("tools-back"); if (toolsBack) toolsBack.addEventListener("click", function () { closeModal("tools-menu-modal"); });
    var toolCalc = $("tool-calculator"); if (toolCalc) toolCalc.addEventListener("click", function () { closeModal("tools-menu-modal"); openModal("calculator-modal"); });
    var toolClock = $("tool-clock"); if (toolClock) toolClock.addEventListener("click", function () { closeModal("tools-menu-modal"); openModal("clock-modal"); startClock(); });
    var toolFocus = $("tool-focus"); if (toolFocus) toolFocus.addEventListener("click", function () { closeModal("tools-menu-modal"); openModal("focus-modal"); setupFocusUI(); });
    var toolFormulas = $("tool-formulas"); if (toolFormulas) toolFormulas.addEventListener("click", function () { closeModal("tools-menu-modal"); openModal("formulas-modal"); renderFormulas("physics"); });
    var toolSticky = $("tool-stickynotes"); if (toolSticky) toolSticky.addEventListener("click", function () { closeModal("tools-menu-modal"); openModal("stickynotes-modal"); renderStickyNotes(); });
    var calcBack = $("calc-back"); if (calcBack) calcBack.addEventListener("click", function () { closeModal("calculator-modal"); });
    var disp = $("calc-display"), expr = "";
    function upd() { disp.textContent = expr || "0"; }
    document.querySelectorAll("#calculator-modal .ba-calc-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        var t = b.textContent;
        if (b.classList.contains("ba-calc-clear")) { expr = ""; }
        else if (b.classList.contains("ba-calc-eq")) { try { expr = String(Function('"use strict";return (' + expr.replace(/×/g, "*").replace(/÷/g, "/") + ')')()); } catch (e) { expr = "Error"; } }
        else if (b.classList.contains("ba-calc-op")) { expr += t; }
        else { expr += t; }
        upd();
      });
    });
    var clockBack = $("clock-back"); if (clockBack) clockBack.addEventListener("click", function () { closeModal("clock-modal"); if (clockTimer) clearInterval(clockTimer); });
    var focusBack = $("focus-back"); if (focusBack) focusBack.addEventListener("click", function () { stopFocusTimer(); closeModal("focus-modal"); });
    var formulasBack = $("formulas-back"); if (formulasBack) formulasBack.addEventListener("click", function () { closeModal("formulas-modal"); });
    var stickyBack = $("stickynotes-back"); if (stickyBack) stickyBack.addEventListener("click", function () { saveStickyNotes(); closeModal("stickynotes-modal"); });
    var stickyAdd = $("stickynotes-add"); if (stickyAdd) stickyAdd.addEventListener("click", function () { addStickyNote(); });
    var focusBarEnd = $("focus-bar-end"); if (focusBarEnd) focusBarEnd.addEventListener("click", function () { stopFocusTimer(); });
    document.querySelectorAll("#formulas-modal .ba-formulas-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        document.querySelectorAll("#formulas-modal .ba-formulas-tab").forEach(function (t) { t.classList.remove("ba-formulas-tab-active"); });
        tab.classList.add("ba-formulas-tab-active");
        renderFormulas(tab.getAttribute("data-ftype"));
      });
    });
  }

  /* ---------- CLOCK ---------- */
  var clockTimer = null;
  function startClock() {
    if (clockTimer) clearInterval(clockTimer);
    function tick() {
      var d = new Date(); $("clock-time").textContent = d.toLocaleTimeString();
      var dayKey = currentDayKey(); var periods = dayKey ? TIMETABLE[dayKey] : [];
      var mins = d.getHours() * 60 + d.getMinutes();
      var at = periodAt(periods, mins);
      $("clock-subject").textContent = at ? (at.cur.subject + (at.cur.teacher ? " · " + at.cur.teacher : "")) : "No class right now";
    }
    tick(); clockTimer = setInterval(tick, 1000);
  }

  /* ---------- FOCUS TIMER ---------- */
  var focusTimer = null, focusRemaining = 0, focusTotal = 0, focusRunning = false;
  function setupFocusUI() {
    var presets = [5, 10, 15, 20, 25, 30, 45, 60];
    var wrap = $("focus-presets"); wrap.innerHTML = "";
    presets.forEach(function (m) {
      var b = document.createElement("button"); b.className = "ba-focus-preset"; b.textContent = m + " min";
      b.addEventListener("click", function () {
        document.querySelectorAll(".ba-focus-preset").forEach(function (x) { x.classList.remove("selected"); });
        b.classList.add("selected");
        focusRemaining = m * 60; focusTotal = m * 60;
        updateFocusDisplay();
      });
      wrap.appendChild(b);
    });
    focusRemaining = 25 * 60; focusTotal = 25 * 60;
    updateFocusDisplay();
    var startBtn = $("focus-start");
    if (startBtn) startBtn.onclick = function () {
      if (focusRunning) { pauseFocusTimer(); } else { startFocusTimer(); }
    };
  }
  function updateFocusDisplay() {
    var mins = Math.floor(focusRemaining / 60), secs = focusRemaining % 60;
    var timeStr = (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs;
    if ($("focus-time")) $("focus-time").textContent = timeStr;
    if ($("focus-bar-time")) $("focus-bar-time").textContent = timeStr;
    var pct = focusTotal > 0 ? (1 - focusRemaining / focusTotal) : 0;
    var circ = 2 * Math.PI * 90;
    var ring = $("focus-ring");
    if (ring) ring.style.strokeDashoffset = circ * (1 - pct);
  }
  function startFocusTimer() {
    focusRunning = true;
    var startBtn = $("focus-start"); if (startBtn) startBtn.textContent = "Pause";
    if ($("focus-label")) $("focus-label").textContent = "Focusing...";
    if ($("focus-bar")) $("focus-bar").style.display = "flex";
    document.addEventListener("visibilitychange", function focusVisibilityHandler() {
      if (document.hidden && focusRunning) {
        pauseFocusTimer();
        if ($("focus-bar")) $("focus-bar").style.display = "none";
      }
      if (!document.hidden && focusRunning === false && focusRemaining > 0 && focusRemaining < focusTotal) {
        if ($("focus-bar")) $("focus-bar").style.display = "flex";
      }
    });
    focusTimer = setInterval(function () {
      focusRemaining--;
      updateFocusDisplay();
      if (focusRemaining <= 0) {
        stopFocusTimer();
        if ($("focus-label")) $("focus-label").textContent = "Done! Great work 🎉";
        try { new Audio("data:audio/wav;base64,UklGRl4FAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YToFAACAgICAgICAgICAgICAgICA").play(); } catch (e) {}
      }
    }, 1000);
  }
  function pauseFocusTimer() {
    focusRunning = false;
    if (focusTimer) clearInterval(focusTimer); focusTimer = null;
    var startBtn = $("focus-start"); if (startBtn) startBtn.textContent = "Resume";
    if ($("focus-label")) $("focus-label").textContent = "Paused";
  }
  function stopFocusTimer() {
    focusRunning = false;
    if (focusTimer) clearInterval(focusTimer); focusTimer = null;
    if ($("focus-bar")) $("focus-bar").style.display = "none";
    var startBtn = $("focus-start"); if (startBtn) startBtn.textContent = "Start";
    if ($("focus-label")) $("focus-label").textContent = "Ready";
  }

  /* ---------- FORMULA BOOK ---------- */
  var FORMULAS = {
    physics: [
      { section: "Mechanics", items: [
        { name: "Speed", expr: "v = d / t" },
        { name: "Acceleration", expr: "a = (v - u) / t" },
        { name: "Newton's 2nd Law", expr: "F = m × a" },
        { name: "Weight", expr: "W = m × g" },
        { name: "Momentum", expr: "p = m × v" },
        { name: "Kinetic Energy", expr: "KE = ½mv²" },
        { name: "Work Done", expr: "W = F × d × cos θ" },
        { name: "Power", expr: "P = W / t = F × v" },
        { name: "Gravitational PE", expr: "GPE = m × g × h" },
        { name: "Distance (accel.)", expr: "s = ut + ½at²" }
      ]},
      { section: "Electricity", items: [
        { name: "Ohm's Law", expr: "V = I × R" },
        { name: "Power (elec.)", expr: "P = V × I = I²R = V²/R" },
        { name: "Energy", expr: "E = V × I × t" },
        { name: "Resistance (series)", expr: "R_total = R₁ + R₂ + R₃" },
        { name: "Resistance (parallel)", expr: "1/R_total = 1/R₁ + 1/R₂ + 1/R₃" }
      ]},
      { section: "Waves & Optics", items: [
        { name: "Wave Speed", expr: "v = f × λ" },
        { name: "Snell's Law", expr: "n₁ sin θ₁ = n₂ sin θ₂" },
        { name: "Mirror / Lens", expr: "1/f = 1/v - 1/u" },
        { name: "Refractive Index", expr: "n = c / v" }
      ]},
      { section: "Thermal Physics", items: [
        { name: "Heat Energy", expr: "Q = m × c × ΔT" },
        { name: "Ideal Gas", expr: "PV = nRT" },
        { name: "Efficiency", expr: "η = W_out / Q_in × 100%" }
      ]},
      { section: "Nuclear Physics", items: [
        { name: "Nuclear Energy", expr: "E = mc²" },
        { name: "Half-life", expr: "N = N₀ × (½)^(t/t½)" },
        { name: "Activity", expr: "A = λN" }
      ]}
    ],
    maths: [
      { section: "Algebra", items: [
        { name: "Quadratic Formula", expr: "x = (-b ± √(b²-4ac)) / 2a" },
        { name: "Sum of AP", expr: "Sₙ = n/2 × [2a + (n-1)d]" },
        { name: "Sum of GP", expr: "Sₙ = a(rⁿ - 1) / (r - 1)" },
        { name: "Binomial Theorem", expr: "(a+b)ⁿ = Σ C(n,k) aⁿ⁻ᵏbᵏ" }
      ]},
      { section: "Geometry", items: [
        { name: "Area of Triangle", expr: "A = ½ × base × height" },
        { name: "Area of Circle", expr: "A = πr²" },
        { name: "Circumference", expr: "C = 2πr" },
        { name: "Pythagoras Theorem", expr: "a² + b² = c²" },
        { name: "Sphere Volume", expr: "V = (4/3)πr³" },
        { name: "Sphere Surface", expr: "A = 4πr²" },
        { name: "Cylinder Volume", expr: "V = πr²h" },
        { name: "Cone Volume", expr: "V = (1/3)πr²h" }
      ]},
      { section: "Trigonometry", items: [
        { name: "SOH CAH TOA", expr: "sin θ = opp/hyp, cos θ = adj/hyp, tan θ = opp/adj" },
        { name: "Sine Rule", expr: "a/sin A = b/sin B = c/sin C" },
        { name: "Cosine Rule", expr: "a² = b² + c² - 2bc cos A" },
        { name: "Area (trig)", expr: "A = ½ab sin C" },
        { name: "sin²θ + cos²θ", expr: "sin²θ + cos²θ = 1" }
      ]},
      { section: "Statistics", items: [
        { name: "Mean", expr: "x̄ = Σx / n" },
        { name: "Standard Deviation", expr: "σ = √(Σ(x - x̄)² / n)" },
        { name: "Probability", expr: "P(A) = favorable / total" },
        { name: "Combined Probability", expr: "P(A and B) = P(A) × P(B)" }
      ]},
      { section: "Calculus", items: [
        { name: "Power Rule", expr: "d/dx(xⁿ) = nxⁿ⁻¹" },
        { name: "Integration", expr: "∫xⁿ dx = xⁿ⁺¹/(n+1) + C" },
        { name: "Product Rule", expr: "d/dx(uv) = u'v + uv'" },
        { name: "Chain Rule", expr: "d/dx[f(g(x))] = f'(g(x)) × g'(x)" }
      ]}
    ]
  };
  function renderFormulas(type) {
    var body = $("formulas-body"); if (!body) return;
    var data = FORMULAS[type] || [];
    var html = "";
    data.forEach(function (sec) {
      html += '<div class="ba-formula-section-title">' + esc(sec.section) + '</div>';
      sec.items.forEach(function (item) {
        html += '<div class="ba-formula-card"><div class="ba-formula-name">' + esc(item.name) + '</div><div class="ba-formula-expr">' + esc(item.expr) + '</div></div>';
      });
    });
    body.innerHTML = html;
  }

  /* ---------- STICKY NOTES ---------- */
  var STICKY_KEY = "ba_sticky_notes";
  function loadStickyNotes() {
    try { var raw = localStorage.getItem(STICKY_KEY); return raw ? JSON.parse(raw) : []; } catch (e) { return []; }
  }
  function saveStickyNotes() {
    var grid = $("stickynotes-grid"); if (!grid) return;
    var notes = [];
    grid.querySelectorAll(".ba-sticky-note").forEach(function (el) {
      notes.push({
        title: el.querySelector(".ba-sticky-note-title").value,
        text: el.querySelector(".ba-sticky-note-text").value,
        color: el.getAttribute("data-color") || "#fff740"
      });
    });
    try { localStorage.setItem(STICKY_KEY, JSON.stringify(notes)); } catch (e) {}
  }
  var STICKY_COLORS = ["#fff740", "#ff6b6b", "#51cf66", "#74c0fc", "#da77f2", "#ffc078"];
  function renderStickyNotes() {
    var grid = $("stickynotes-grid"); if (!grid) return;
    grid.innerHTML = "";
    var notes = loadStickyNotes();
    if (!notes.length) notes.push({ title: "", text: "", color: STICKY_COLORS[0] });
    notes.forEach(function (n) { addStickyNoteEl(grid, n); });
  }
  function addStickyNote() {
    var grid = $("stickynotes-grid"); if (!grid) return;
    addStickyNoteEl(grid, { title: "", text: "", color: STICKY_COLORS[Math.floor(Math.random() * STICKY_COLORS.length)] });
    saveStickyNotes();
  }
  function addStickyNoteEl(grid, note) {
    var el = document.createElement("div");
    el.className = "ba-sticky-note";
    el.setAttribute("data-color", note.color || STICKY_COLORS[0]);
    el.style.background = note.color || STICKY_COLORS[0];
    var colorsDiv = document.createElement("div");
    colorsDiv.className = "ba-sticky-colors";
    STICKY_COLORS.forEach(function (c) {
      var dot = document.createElement("span");
      dot.className = "ba-sticky-color" + (c === note.color ? " active" : "");
      dot.style.background = c;
      dot.addEventListener("click", function () {
        el.setAttribute("data-color", c); el.style.background = c;
        colorsDiv.querySelectorAll(".ba-sticky-color").forEach(function (x) { x.classList.remove("active"); });
        dot.classList.add("active");
        saveStickyNotes();
      });
      colorsDiv.appendChild(dot);
    });
    el.appendChild(colorsDiv);
    var titleInput = document.createElement("input");
    titleInput.className = "ba-sticky-note-title"; titleInput.placeholder = "Title"; titleInput.value = note.title || "";
    titleInput.addEventListener("input", function () { saveStickyNotes(); });
    el.appendChild(titleInput);
    var textArea = document.createElement("textarea");
    textArea.className = "ba-sticky-note-text"; textArea.placeholder = "Write something..."; textArea.value = note.text || "";
    textArea.addEventListener("input", function () { saveStickyNotes(); });
    el.appendChild(textArea);
    var delBtn = document.createElement("button");
    delBtn.className = "ba-sticky-note-del"; delBtn.textContent = "✕";
    delBtn.addEventListener("click", function () { el.remove(); saveStickyNotes(); });
    el.appendChild(delBtn);
    grid.appendChild(el);
  }
/*__APPEND__*/

  /* ============================================================
     GAMES
     ============================================================ */
  var gameConfigs = {};

  function setupGames() {
    var games = ["snake","memory","tictactoe","sudoku","minesweeper","flappy","breakout","whack","connect4","2048"];
    var modals = {
      snake:"snake-modal", "2048":"game-2048-modal", memory:"memory-modal", tictactoe:"tictactoe-modal",
      sudoku:"sudoku-modal", minesweeper:"minesweeper-modal", flappy:"flappy-modal", breakout:"breakout-modal",
      whack:"whack-modal", connect4:"connect4-modal"
    };
    var starters = {
      snake:startSnake, "2048":start2048, memory:startMemory, tictactoe:startTicTacToe,
      sudoku:startSudoku, minesweeper:startMinesweeper, flappy:startFlappy, breakout:startBreakout,
      whack:startWhack, connect4:startConnect4
    };
    var stoppers = {
      snake:stopSnake, flappy:stopFlappy, breakout:stopBreakout, whack:stopWhack
    };

    games.forEach(function (g) {
      gameConfigs[g] = gameConfigs[g] || { mode: "solo", diff: "easy" };

      // Game card in the games-modal grid → open that game
      var card = document.querySelector(".ba-game-card[data-game='" + g + "']");
      if (card) {
        card.addEventListener("click", function () {
          $("games-modal").classList.remove("ba-modal-open");
          $(modals[g]).classList.add("ba-modal-open");
          showGameSetup(g);
        });
      }

      // Back buttons
      var backId = g === "2048" ? "game-2048-back" : g + "-back";
      if ($(backId)) {
        $(backId).addEventListener("click", function () {
          if (stoppers[g]) stoppers[g]();
          $(modals[g]).classList.remove("ba-modal-open");
          $("games-modal").classList.add("ba-modal-open");
        });
      }

      // Setup mode buttons
      document.querySelectorAll("[data-game='" + g + "'][data-mode]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          document.querySelectorAll("[data-game='" + g + "'][data-mode]").forEach(function (b) { b.classList.remove("selected"); });
          this.classList.add("selected");
          gameConfigs[g].mode = this.getAttribute("data-mode");
        });
      });

      // Setup difficulty buttons
      document.querySelectorAll("[data-game='" + g + "'][data-diff]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          document.querySelectorAll("[data-game='" + g + "'][data-diff]").forEach(function (b) { b.classList.remove("selected"); });
          this.classList.add("selected");
          gameConfigs[g].diff = this.getAttribute("data-diff");
          if (g === "minesweeper") updateMinesweeperDesc();
        });
      });

      // Start button
      var startBtn = $(g + "-start");
      if (startBtn) {
        startBtn.addEventListener("click", function () {
          var setup = $(g + "-setup");
          var play = $(g + "-play");
          if (setup) setup.style.display = "none";
          if (play) play.style.display = "flex";
          if (starters[g]) starters[g]();
        });
      }
    });

    updateMinesweeperDesc();
    if ($("tictactoe-restart")) $("tictactoe-restart").addEventListener("click", startTicTacToe);
    if ($("minesweeper-restart")) $("minesweeper-restart").addEventListener("click", startMinesweeper);
    if ($("connect4-restart")) $("connect4-restart").addEventListener("click", startConnect4);
  }

  function showGameSetup(g) {
    var setup = $(g + "-setup");
    var play = $(g + "-play");
    if (setup) setup.style.display = "flex";
    if (play) play.style.display = "none";
  }

  function updateMinesweeperDesc() {
    var el = $("ms-diff-desc");
    var d = gameConfigs.minesweeper ? gameConfigs.minesweeper.diff : "easy";
    var info = { easy: "8×8 · 10 mines", medium: "10×10 · 20 mines", hard: "12×12 · 35 mines" };
    if (el) el.textContent = info[d] || info.easy;
  }

  /* ---------- SNAKE ---------- */
  var snakeTimer = null;
  function startSnake() {
    var cfg = gameConfigs.snake || { mode:"solo", diff:"easy" };
    var speeds = { easy: 150, medium: 110, hard: 70 };
    var interval = speeds[cfg.diff] || 150;
    var isFriend = cfg.mode === "friend";
    var canvas = $("snake-canvas");
    var wrap = canvas.parentElement;
    canvas.width = Math.min(340, wrap.clientWidth - 32);
    canvas.height = canvas.width;
    var ctx = canvas.getContext("2d");
    var box = 15; var W = canvas.width; var H = canvas.height;
    var cols = Math.floor(W / box), rows = Math.floor(H / box);
    var snake1 = [{ x: Math.floor(cols / 3), y: Math.floor(rows / 2) }];
    var dir1 = { x: 1, y: 0 };
    var snake2, dir2;
    if (isFriend) {
      snake2 = [{ x: Math.floor(cols * 2 / 3), y: Math.floor(rows / 2) }];
      dir2 = { x: -1, y: 0 };
    }
    var food = spawnFood(); var score = 0; var score2 = 0; var running = true;
    function spawnFood() { return { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) }; }
    function draw() {
      ctx.fillStyle = "#1a1a2e"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#2f5bff"; snake1.forEach(function (s) { ctx.fillRect(s.x * box, s.y * box, box - 1, box - 1); });
      if (isFriend && snake2) {
        ctx.fillStyle = "#2fbf6f"; snake2.forEach(function (s) { ctx.fillRect(s.x * box, s.y * box, box - 1, box - 1); });
      }
      ctx.fillStyle = "#ff6a5e"; ctx.fillRect(food.x * box, food.y * box, box - 1, box - 1);
      if (!running) {
        ctx.fillStyle = "rgba(0,0,0,.5)"; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#fff"; ctx.font = "bold 20px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("Game Over", W / 2, H / 2 - 10);
        var winner = isFriend ? (score > score2 ? "P1 wins!" : score2 > score ? "P2 wins!" : "Draw!") : "";
        ctx.fillText((isFriend ? winner + " " : "") + "Score: " + (isFriend ? score + "/" + score2 : score), W / 2, H / 2 + 20);
        ctx.font = "12px sans-serif"; ctx.fillText("Tap to restart", W / 2, H / 2 + 50);
      }
    }
    function step() {
      if (!running) return;
      var h1 = { x: snake1[0].x + dir1.x, y: snake1[0].y + dir1.y };
      if (h1.x < 0 || h1.x >= cols || h1.y < 0 || h1.y >= rows) { running = false; draw(); return; }
      for (var i = 0; i < snake1.length; i++) { if (h1.x === snake1[i].x && h1.y === snake1[i].y) { running = false; draw(); return; } }
      if (isFriend && snake2) {
        for (var i = 0; i < snake2.length; i++) { if (h1.x === snake2[i].x && h1.y === snake2[i].y) { running = false; draw(); return; } }
      }
      snake1.unshift(h1);
      if (h1.x === food.x && h1.y === food.y) { score++; food = spawnFood(); $("snake-score").textContent = "Score: " + score + (isFriend ? " (P2: " + score2 + ")" : ""); } else { snake1.pop(); }
      if (isFriend && snake2) {
        var h2 = { x: snake2[0].x + dir2.x, y: snake2[0].y + dir2.y };
        if (h2.x < 0 || h2.x >= cols || h2.y < 0 || h2.y >= rows) { running = false; draw(); return; }
        for (var i = 0; i < snake2.length; i++) { if (h2.x === snake2[i].x && h2.y === snake2[i].y) { running = false; draw(); return; } }
        for (var i = 0; i < snake1.length; i++) { if (h2.x === snake1[i].x && h2.y === snake1[i].y) { running = false; draw(); return; } }
        snake2.unshift(h2);
        if (h2.x === food.x && h2.y === food.y) { score2++; food = spawnFood(); $("snake-score").textContent = "Score: " + score + " (P2: " + score2 + ")"; } else { snake2.pop(); }
      }
      draw();
    }
    draw();
    snakeTimer = setInterval(step, interval);
    var dirs = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
    function setDir1(k) { if (dirs[k] && (dirs[k].x + dir1.x !== 0 || dirs[k].y + dir1.y !== 0)) dir1 = dirs[k]; }
    $("snake-up").onclick = function () { setDir1("up"); };
    $("snake-down").onclick = function () { setDir1("down"); };
    $("snake-left").onclick = function () { setDir1("left"); };
    $("snake-right").onclick = function () { setDir1("right"); };
    document.addEventListener("keydown", function handler(e) {
      if (!$("snake-modal").classList.contains("ba-modal-open")) { document.removeEventListener("keydown", handler); return; }
      if (e.key === "ArrowUp") setDir1("up"); else if (e.key === "ArrowDown") setDir1("down");
      else if (e.key === "ArrowLeft") setDir1("left"); else if (e.key === "ArrowRight") setDir1("right");
      if (isFriend && snake2) {
        if (e.key === "w") { if (dir2.y !== 1) dir2 = { x: 0, y: -1 }; }
        else if (e.key === "s") { if (dir2.y !== -1) dir2 = { x: 0, y: 1 }; }
        else if (e.key === "a") { if (dir2.x !== 1) dir2 = { x: -1, y: 0 }; }
        else if (e.key === "d") { if (dir2.x !== -1) dir2 = { x: 1, y: 0 }; }
      }
    });
    if (isFriend) $("snake-score").textContent = "Score: 0 (P2: 0)";
  }
  function stopSnake() { clearInterval(snakeTimer); }

  /* ---------- 2048 ---------- */
  var grid2048 = [];
  function start2048() {
    grid2048 = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    addTile2048(); addTile2048(); render2048();
    document.addEventListener("keydown", function handler(e) {
      if (!$("game-2048-modal").classList.contains("ba-modal-open")) { document.removeEventListener("keydown", handler); return; }
      if (e.key === "ArrowUp") move2048("up"); else if (e.key === "ArrowDown") move2048("down");
      else if (e.key === "ArrowLeft") move2048("left"); else if (e.key === "ArrowRight") move2048("right");
    });
    var wrap = $("game-2048-grid");
    if (wrap) {
      var sx = 0, sy = 0;
      wrap.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
      wrap.addEventListener("touchend", function (e) {
        var dx = e.changedTouches[0].clientX - sx;
        var dy = e.changedTouches[0].clientY - sy;
        if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
          if (Math.abs(dx) > Math.abs(dy)) move2048(dx > 0 ? "right" : "left");
          else move2048(dy > 0 ? "down" : "up");
        }
      }, { passive: true });
    }
  }
  function addTile2048() {
    var empty = [];
    for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) if (grid2048[r][c] === 0) empty.push({ r: r, c: c });
    if (!empty.length) return;
    var p = empty[Math.floor(Math.random() * empty.length)];
    grid2048[p.r][p.c] = Math.random() < 0.9 ? 2 : 4;
  }
  function render2048() {
    var el = $("game-2048-grid"); el.innerHTML = ""; var sc = 0;
    for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) {
      var v = grid2048[r][c]; sc += v;
      var d = document.createElement("div"); d.className = "ba-2048-cell"; if (v) d.setAttribute("data-val", v);
      d.textContent = v || ""; el.appendChild(d);
    }
    $("game-2048-score").textContent = "Score: " + sc;
  }
  function move2048(dir) {
    var moved = false; var g = grid2048;
    function slide(row) { var a = row.filter(function (x) { return x; }); var missing = 4 - a.length; var z = []; for (var i = 0; i < missing; i++) z.push(0); return a.concat(z); }
    function combine(row) { for (var i = 0; i < 3; i++) { if (row[i] && row[i] === row[i + 1]) { row[i] *= 2; row[i + 1] = 0; } } return row; }
    var old = JSON.stringify(g);
    if (dir === "left") { for (var r = 0; r < 4; r++) { g[r] = slide(g[r]); g[r] = combine(g[r]); g[r] = slide(g[r]); } }
    else if (dir === "right") { for (var r = 0; r < 4; r++) { g[r] = slide(g[r].reverse()).reverse(); g[r] = combine(g[r]); g[r] = slide(g[r]); } }
    else if (dir === "up") { for (var c = 0; c < 4; c++) { var col = [g[0][c], g[1][c], g[2][c], g[3][c]]; col = slide(col); col = combine(col); col = slide(col); for (var r = 0; r < 4; r++) g[r][c] = col[r]; } }
    else if (dir === "down") { for (var c = 0; c < 4; c++) { var col = [g[0][c], g[1][c], g[2][c], g[3][c]].reverse(); col = slide(col); col = combine(col); col = slide(col); col = col.reverse(); for (var r = 0; r < 4; r++) g[r][c] = col[r]; } }
    if (JSON.stringify(g) !== old) { moved = true; addTile2048(); }
    render2048();
  }

  /* ---------- MEMORY ---------- */
  function startMemory() {
    var cfg = gameConfigs.memory || { mode: "solo", diff: "easy" };
    var pairCounts = { easy: 8, medium: 12, hard: 18 };
    var numPairs = pairCounts[cfg.diff] || 8;
    var allEmojis = ["🍎","🍊","🍋","🍇","🍉","🍓","🍒","🫐","🥑","🌽","🥕","🫑","🍑","🥝","🫒","🌸","⭐","🔥"];
    var chosen = allEmojis.slice(0, numPairs);
    var cards = chosen.concat(chosen).sort(function () { return Math.random() - 0.5; });
    var flipped = []; var matched = []; var moves = 0; var busy = false;
    var isFriend = cfg.mode === "friend";
    var turn = 1; var p1Score = 0, p2Score = 0;
    var grid = $("memory-grid"); grid.innerHTML = "";
    grid.className = "ba-memory-grid";
    if (numPairs <= 8) grid.style.gridTemplateColumns = "repeat(4,1fr)";
    else if (numPairs <= 12) grid.style.gridTemplateColumns = "repeat(6,1fr)";
    else grid.style.gridTemplateColumns = "repeat(6,1fr)";
    var turnBar = $("memory-turn-bar");
    if (turnBar) turnBar.style.display = isFriend ? "flex" : "none";
    if (isFriend) $("memory-turn-text").textContent = "P1's turn";
    cards.forEach(function (emoji, i) {
      var d = document.createElement("div"); d.className = "ba-memory-card"; d.dataset.idx = i;
      d.addEventListener("click", function () {
        if (busy || matched.indexOf(i) >= 0 || flipped.indexOf(i) >= 0) return;
        d.classList.add("flipped"); d.textContent = emoji; flipped.push(i);
        if (flipped.length === 2) {
          busy = true; moves++;
          if (isFriend) $("memory-score").textContent = "P1: " + p1Score + " | P2: " + p2Score;
          else $("memory-score").textContent = "Moves: " + moves;
          if (cards[flipped[0]] === cards[flipped[1]]) {
            matched.push(flipped[0]); matched.push(flipped[1]);
            document.querySelectorAll(".ba-memory-card")[flipped[0]].classList.add("matched");
            document.querySelectorAll(".ba-memory-card")[flipped[1]].classList.add("matched");
            if (isFriend) {
              if (turn === 1) p1Score++; else p2Score++;
              $("memory-score").textContent = "P1: " + p1Score + " | P2: " + p2Score;
            }
            flipped = []; busy = false;
          } else {
            var f0 = flipped[0], f1 = flipped[1]; flipped = [];
            setTimeout(function () {
              document.querySelectorAll(".ba-memory-card")[f0].classList.remove("flipped");
              document.querySelectorAll(".ba-memory-card")[f0].textContent = "";
              document.querySelectorAll(".ba-memory-card")[f1].classList.remove("flipped");
              document.querySelectorAll(".ba-memory-card")[f1].textContent = "";
              if (isFriend) { turn = turn === 1 ? 2 : 1; $("memory-turn-text").textContent = "P" + turn + "'s turn"; }
              busy = false;
            }, 800);
          }
        }
      });
      grid.appendChild(d);
    });
  }

  /* ---------- TIC-TAC-TOE ---------- */
  var tttBoard = [], tttTurn = "X", tttMode = "friend", tttDiff = "easy";
  function startTicTacToe() {
    var cfg = gameConfigs.tictactoe || { mode: "friend", diff: "easy" };
    tttMode = cfg.mode; tttDiff = cfg.diff;
    tttBoard = ["","","","","","","","",""]; tttTurn = "X";
    $("tictactoe-status").textContent = "Player X's turn";
    var tb = $("ttt-turn-bar"); if (tb) tb.style.display = "flex";
    renderTTT();
  }
  function renderTTT() {
    var grid = $("tictactoe-grid"); grid.innerHTML = "";
    tttBoard.forEach(function (v, i) {
      var d = document.createElement("div"); d.className = "ba-ttt-cell"; d.textContent = v;
      d.addEventListener("click", function () {
        if (tttBoard[i] || checkTTT()) return;
        if (tttMode === "bot" && tttTurn === "O") return;
        tttBoard[i] = tttTurn;
        if (checkTTT()) { $("tictactoe-status").textContent = tttTurn + " wins!"; }
        else if (tttBoard.indexOf("") < 0) { $("tictactoe-status").textContent = "Draw!"; }
        else { tttTurn = tttTurn === "X" ? "O" : "X"; $("tictactoe-status").textContent = (tttMode === "bot" && tttTurn === "O" ? "Bot thinking..." : "Player " + tttTurn + "'s turn"); }
        renderTTT();
        if (tttMode === "bot" && tttTurn === "O" && !checkTTT() && tttBoard.indexOf("") >= 0) {
          setTimeout(tttBotMove, 400);
        }
      });
      grid.appendChild(d);
    });
  }
  function tttBotMove() {
    if (checkTTT() || tttBoard.indexOf("") < 0) return;
    var wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    var move = -1;
    if (tttDiff === "hard" || tttDiff === "medium") {
      for (var i = 0; i < wins.length; i++) { var w = wins[i]; var vals = [tttBoard[w[0]], tttBoard[w[1]], tttBoard[w[2]]];
        var os = vals.filter(function (v) { return v === "O"; }).length, es = vals.filter(function (v) { return v === ""; }).length;
        if (os === 2 && es === 1) { move = w[vals.indexOf("")]; break; }
      }
      if (move < 0) { for (var i = 0; i < wins.length; i++) { var w = wins[i]; var vals = [tttBoard[w[0]], tttBoard[w[1]], tttBoard[w[2]]];
        var xs = vals.filter(function (v) { return v === "X"; }).length, es = vals.filter(function (v) { return v === ""; }).length;
        if (xs === 2 && es === 1) { move = w[vals.indexOf("")]; break; }
      }}
    }
    if (tttDiff === "medium" && move < 0 && Math.random() > 0.5) { move = -1; }
    if (move < 0) {
      var empty = []; for (var i = 0; i < 9; i++) if (!tttBoard[i]) empty.push(i);
      move = empty[Math.floor(Math.random() * empty.length)];
    }
    tttBoard[move] = "O";
    if (checkTTT()) { $("tictactoe-status").textContent = "Bot wins! 😔"; }
    else if (tttBoard.indexOf("") < 0) { $("tictactoe-status").textContent = "Draw!"; }
    else { tttTurn = "X"; $("tictactoe-status").textContent = "Your turn (X)"; }
    renderTTT();
  }
  function checkTTT() {
    var w = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (var i = 0; i < w.length; i++) { var a = w[i]; if (tttBoard[a[0]] && tttBoard[a[0]] === tttBoard[a[1]] && tttBoard[a[1]] === tttBoard[a[2]]) return true; }
    return false;
  }

  /* ---------- MINESWEEPER ---------- */
  var msGrid = [], msRevealed = [], msGameOver = false, msR = 8, msC = 8;
  function startMinesweeper() {
    var cfg = gameConfigs.minesweeper || { mode: "solo", diff: "easy" };
    var grids = { easy: { r: 8, c: 8, m: 10 }, medium: { r: 10, c: 10, m: 20 }, hard: { r: 12, c: 12, m: 35 } };
    var g = grids[cfg.diff] || grids.easy;
    msR = g.r; msC = g.c; msGameOver = false; msGrid = []; msRevealed = [];
    for (var r = 0; r < msR; r++) { msGrid[r] = []; msRevealed[r] = []; for (var c = 0; c < msC; c++) { msGrid[r][c] = 0; msRevealed[r][c] = false; } }
    var placed = 0;
    while (placed < g.m) { var r = Math.floor(Math.random() * msR), c = Math.floor(Math.random() * msC); if (msGrid[r][c] !== -1) { msGrid[r][c] = -1; placed++; } }
    for (var r = 0; r < msR; r++) for (var c = 0; c < msC; c++) { if (msGrid[r][c] === -1) continue; var cnt = 0;
      for (var dr = -1; dr <= 1; dr++) for (var dc = -1; dc <= 1; dc++) { var nr = r + dr, nc = c + dc; if (nr >= 0 && nr < msR && nc >= 0 && nc < msC && msGrid[nr][nc] === -1) cnt++; }
      msGrid[r][c] = cnt;
    }
    var grid = $("minesweeper-grid"); grid.style.gridTemplateColumns = "repeat(" + msC + ",1fr)";
    renderMinesweeper();
  }
  function renderMinesweeper() {
    var grid = $("minesweeper-grid"); grid.innerHTML = "";
    for (var r = 0; r < msR; r++) for (var c = 0; c < msC; c++) {
      var d = document.createElement("div"); d.className = "ba-mine-cell";
      if (msRevealed[r][c]) { d.classList.add("revealed"); if (msGrid[r][c] === -1) { d.classList.add("mine"); d.textContent = "💣"; } else { d.textContent = msGrid[r][c] || ""; } }
      (function (r, c) {
        d.addEventListener("click", function () { if (msGameOver || msRevealed[r][c]) return; msRevealed[r][c] = true;
          if (msGrid[r][c] === -1) { msGameOver = true; for (var i = 0; i < msR; i++) for (var j = 0; j < msC; j++) msRevealed[i][j] = true; }
          renderMinesweeper();
        });
      })(r, c);
      grid.appendChild(d);
    }
  }

  /* ---------- SUDOKU ---------- */
  var sdkGrid = [], sdkSolution = [], sdkFixed = [], sdkSelected = -1;
  function startSudoku() {
    sdkGrid = []; sdkSolution = []; sdkFixed = []; sdkSelected = -1;
    var base = [[1,2,3,4,5,6,7,8,9],[4,5,6,7,8,9,1,2,3],[7,8,9,1,2,3,4,5,6],
              [2,3,1,5,6,4,8,9,7],[5,6,4,8,9,7,2,3,1],[8,9,7,2,3,1,5,6,4],
              [3,1,2,6,4,5,9,7,8],[6,4,5,9,7,8,3,1,2],[9,7,8,3,1,2,6,4,5]];
    sdkSolution = base;
    for (var r = 0; r < 9; r++) { sdkGrid[r] = []; sdkFixed[r] = []; for (var c = 0; c < 9; c++) { sdkFixed[r][c] = Math.random() > 0.45; sdkGrid[r][c] = sdkFixed[r][c] ? base[r][c] : 0; } }
    renderSudoku();
    var pad = $("sudoku-numpad"); pad.innerHTML = "";
    for (var n = 1; n <= 9; n++) {
      var b = document.createElement("button"); b.className = "ba-sudoku-num"; b.textContent = n;
      b.addEventListener("click", function () { if (sdkSelected < 0) return; var r = Math.floor(sdkSelected / 9), c = sdkSelected % 9; if (sdkFixed[r][c]) return; sdkGrid[r][c] = parseInt(this.textContent); renderSudoku(); });
      pad.appendChild(b);
    }
    var clr = document.createElement("button"); clr.className = "ba-sudoku-num"; clr.textContent = "✕";
    clr.addEventListener("click", function () { if (sdkSelected < 0) return; var r = Math.floor(sdkSelected / 9), c = sdkSelected % 9; if (sdkFixed[r][c]) return; sdkGrid[r][c] = 0; renderSudoku(); });
    pad.appendChild(clr);
  }
  function renderSudoku() {
    var grid = $("sudoku-grid"); grid.innerHTML = "";
    for (var r = 0; r < 9; r++) for (var c = 0; c < 9; c++) {
      var d = document.createElement("div"); d.className = "ba-sudoku-cell";
      if (sdkFixed[r][c]) d.classList.add("fixed");
      if ((r * 9 + c) === sdkSelected) d.classList.add("selected");
      d.textContent = sdkGrid[r][c] || "";
      var idx = r * 9 + c;
      (function (idx, r, c) {
        d.addEventListener("click", function () { sdkSelected = idx; renderSudoku(); });
      })(idx, r, c);
      grid.appendChild(d);
    }
  }
  if ($("sudoku-restart")) $("sudoku-restart").addEventListener("click", startSudoku);

  /* ---------- FLAPPY BIRD ---------- */
  var flappyTimer = null;
  function startFlappy() {
    var cfg = gameConfigs.flappy || { mode: "solo", diff: "easy" };
    var diffCfg = { easy: { gravity: 0.3, flap: -5.5, speed: 2, gap: 140 }, medium: { gravity: 0.38, flap: -6, speed: 2.8, gap: 120 }, hard: { gravity: 0.45, flap: -6.5, speed: 3.5, gap: 100 } };
    var dc = diffCfg[cfg.diff] || diffCfg.easy;
    var isFriend = cfg.mode === "friend";
    var canvas = $("flappy-canvas");
    var wrap = canvas.parentElement;
    canvas.width = Math.min(340, wrap.clientWidth - 32);
    canvas.height = Math.round(canvas.width * 1.33);
    var ctx = canvas.getContext("2d");
    var W = canvas.width, H = canvas.height;
    var turnBar = $("flappy-turn-bar");
    var turnLabel = $("flappy-turn-text");
    if (turnBar) turnBar.style.display = isFriend ? "flex" : "none";
    var currentTurn = 1, scores = [0, 0], turnsLeft = isFriend ? 2 : 999;
    var bird, pipes, pipeW = 40, frame, score, running;
    function resetBird() {
      bird = { x: 60, y: H / 2, vy: 0, w: 20, h: 16 }; pipes = []; frame = 0; score = 0; running = true;
    }
    function flap() { if (running) bird.vy = dc.flap; }
    function step() {
      if (!running) return;
      bird.vy += dc.gravity; bird.y += bird.vy; frame++;
      if (frame % 90 === 0) { pipes.push({ x: W, gapY: 80 + Math.random() * (H - 200) }); }
      for (var i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= dc.speed;
        if (pipes[i].x + pipeW < 0) { pipes.splice(i, 1); continue; }
        if (pipes[i].x + pipeW < bird.x && !pipes[i].scored) { score++; pipes[i].scored = true; updateFlappyScore(); }
        if (bird.x + bird.w > pipes[i].x && bird.x < pipes[i].x + pipeW) {
          if (bird.y < pipes[i].gapY || bird.y + bird.h > pipes[i].gapY + dc.gap) { running = false; }
        }
      }
      if (bird.y < 0 || bird.y + bird.h > H) running = false;
      drawFlappy();
    }
    function updateFlappyScore() {
      if (isFriend) $("flappy-score").textContent = "P" + currentTurn + ": " + score + " (P" + (currentTurn === 1 ? 2 : 1) + ": " + scores[currentTurn === 1 ? 0 : 1] + ")";
      else $("flappy-score").textContent = "Score: " + score;
    }
    function drawFlappy() {
      ctx.fillStyle = "#1a1a2e"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#ffc21c"; ctx.fillRect(bird.x, bird.y, bird.w, bird.h);
      ctx.fillStyle = "#0f0f0f"; ctx.fillRect(bird.x + 14, bird.y + 3, 4, 4);
      ctx.fillStyle = "#2fbf6f"; pipes.forEach(function (p) { ctx.fillRect(p.x, 0, pipeW, p.gapY); ctx.fillRect(p.x, p.gapY + dc.gap, pipeW, H - p.gapY - dc.gap); });
      if (!running) {
        ctx.fillStyle = "rgba(0,0,0,.5)"; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#fff"; ctx.font = "bold 20px sans-serif"; ctx.textAlign = "center";
        if (isFriend) {
          scores[currentTurn === 1 ? 0 : 1] = score;
          var msg = turnsLeft <= 0 ? (scores[0] > scores[1] ? "P1 wins!" : scores[1] > scores[0] ? "P2 wins!" : "Draw!") : "P" + currentTurn + " crashed!";
          ctx.fillText(msg, W / 2, H / 2 - 10);
          ctx.font = "bold 14px sans-serif"; ctx.fillText("P1: " + scores[0] + " | P2: " + scores[1], W / 2, H / 2 + 15);
        } else {
          ctx.fillText("Game Over", W / 2, H / 2 - 10);
          ctx.font = "bold 14px sans-serif"; ctx.fillText("Score: " + score, W / 2, H / 2 + 15);
        }
        ctx.font = "12px sans-serif"; ctx.fillText("Tap to restart", W / 2, H / 2 + 45);
      }
    }
    function loop() {
      if (!$("flappy-modal").classList.contains("ba-modal-open")) return;
      step();
      if (!running) {
        canvas.onclick = function () {
          if (isFriend) {
            scores[currentTurn === 1 ? 0 : 1] = score;
            if (turnsLeft > 0) {
              currentTurn = currentTurn === 1 ? 2 : 1; turnsLeft--;
              turnLabel.textContent = "P" + currentTurn + "'s turn";
              resetBird(); drawFlappy();
              $("flappy-score").textContent = "P1: " + scores[0] + " | P2: " + scores[1];
              canvas.onclick = flap;
            }
          } else {
            resetBird(); canvas.onclick = flap;
          }
        };
        return;
      }
      flappyTimer = requestAnimationFrame(loop);
    }
    resetBird(); updateFlappyScore();
    canvas.onclick = flap;
    flappyTimer = requestAnimationFrame(loop);
  }
  function stopFlappy() { cancelAnimationFrame(flappyTimer); }

  /* ---------- BREAKOUT ---------- */
  var breakoutTimer = null;
  function startBreakout() {
    var cfg = gameConfigs.breakout || { mode: "solo", diff: "easy" };
    var dc = { easy: { ballSpd: 3, paddleW: 80, rows: 4 }, medium: { ballSpd: 4, paddleW: 65, rows: 5 }, hard: { ballSpd: 5, paddleW: 50, rows: 6 } };
    var d = dc[cfg.diff] || dc.easy;
    var isFriend = cfg.mode === "friend";
    var canvas = $("breakout-canvas");
    var wrap = canvas.parentElement;
    canvas.width = Math.min(340, wrap.clientWidth - 32);
    canvas.height = Math.round(canvas.width * 1.1);
    var ctx = canvas.getContext("2d");
    var W = canvas.width, H = canvas.height;
    var paddleH = 12, ballR = 6, brickCols = 6, brickW = Math.floor((W - 20) / brickCols), brickH = 18, brickPad = 4, brickTop = 30;
    var paddle = { x: W / 2 - d.paddleW / 2, y: H - 30 }, ball = { x: W / 2, y: H - 42, vx: d.ballSpd, vy: -d.ballSpd };
    var brickRows = d.rows, bricks = [], score = 0, running = true;
    var turnBar = $("breakout-turn-bar"), turnLabel = $("breakout-turn-text");
    if (turnBar) turnBar.style.display = isFriend ? "flex" : "none";
    var currentTurn = 1, pScores = [0, 0], turnsLeft = isFriend ? 2 : 999;
    var colors = ["#ff6a5e","#ffc21c","#2fbf6f","#2f5bff","#a855f7","#e879f9"];
    function initBricks() { bricks = []; for (var r = 0; r < brickRows; r++) { bricks[r] = []; for (var c = 0; c < brickCols; c++) bricks[r][c] = { alive: true }; } }
    initBricks();
    function setPaddleX(cx) { var rect = canvas.getBoundingClientRect(); var x = (cx - rect.left) / rect.width * W; paddle.x = Math.max(0, Math.min(W - d.paddleW, x - d.paddleW / 2)); }
    canvas.addEventListener("touchstart", function (e) { setPaddleX(e.touches[0].clientX); }, { passive: true });
    canvas.addEventListener("touchmove", function (e) { e.preventDefault(); setPaddleX(e.touches[0].clientX); }, { passive: false });
    canvas.addEventListener("mousemove", function (e) { setPaddleX(e.clientX); });
    function updateScore() {
      if (isFriend) $("breakout-score").textContent = "P" + currentTurn + ": " + score;
      else $("breakout-score").textContent = "Score: " + score;
    }
    function step() {
      if (!running) return;
      ball.x += ball.vx; ball.y += ball.vy;
      if (ball.x - ballR < 0 || ball.x + ballR > W) ball.vx *= -1;
      if (ball.y - ballR < 0) ball.vy *= -1;
      if (ball.y + ballR >= paddle.y && ball.x >= paddle.x && ball.x <= paddle.x + d.paddleW && ball.vy > 0) {
        ball.vy = -Math.abs(ball.vy);
        var hit = (ball.x - (paddle.x + d.paddleW / 2)) / (d.paddleW / 2);
        ball.vx = hit * d.ballSpd;
      }
      for (var r = 0; r < brickRows; r++) for (var c = 0; c < brickCols; c++) {
        var b = bricks[r][c]; if (!b.alive) continue;
        var bx = c * (brickW + brickPad) + brickPad, by = r * (brickH + brickPad) + brickTop;
        if (ball.x + ballR > bx && ball.x - ballR < bx + brickW && ball.y + ballR > by && ball.y - ballR < by + brickH) {
          b.alive = false; ball.vy *= -1; score += 10; updateScore();
        }
      }
      if (ball.y > H) running = false;
      draw();
    }
    function draw() {
      ctx.fillStyle = "#1a1a2e"; ctx.fillRect(0, 0, W, H);
      for (var r = 0; r < brickRows; r++) for (var c = 0; c < brickCols; c++) {
        if (!bricks[r][c].alive) continue;
        ctx.fillStyle = colors[r % colors.length];
        ctx.fillRect(c * (brickW + brickPad) + brickPad, r * (brickH + brickPad) + brickTop, brickW, brickH);
      }
      ctx.fillStyle = "#fff"; ctx.fillRect(paddle.x, paddle.y, d.paddleW, paddleH);
      ctx.fillStyle = "#ffc21c"; ctx.beginPath(); ctx.arc(ball.x, ball.y, ballR, 0, Math.PI * 2); ctx.fill();
      if (!running) {
        ctx.fillStyle = "rgba(0,0,0,.5)"; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#fff"; ctx.font = "bold 20px sans-serif"; ctx.textAlign = "center";
        if (isFriend) {
          pScores[currentTurn === 1 ? 0 : 1] = score;
          var msg = turnsLeft <= 0 ? (pScores[0] > pScores[1] ? "P1 wins!" : pScores[1] > pScores[0] ? "P2 wins!" : "Draw!") : "P" + currentTurn + " lost the ball!";
          ctx.fillText(msg, W / 2, H / 2 - 10);
        } else { ctx.fillText("Game Over", W / 2, H / 2 - 10); }
        ctx.font = "bold 14px sans-serif"; ctx.fillText(isFriend ? "P1: " + pScores[0] + " | P2: " + pScores[1] : "Score: " + score, W / 2, H / 2 + 15);
        ctx.font = "12px sans-serif"; ctx.fillText("Tap to restart", W / 2, H / 2 + 45);
      }
    }
    function loop() {
      if (!$("breakout-modal").classList.contains("ba-modal-open")) return;
      step();
      if (!running) {
        canvas.onclick = function () {
          if (isFriend) {
            pScores[currentTurn === 1 ? 0 : 1] = score;
            if (turnsLeft > 0) { currentTurn = currentTurn === 1 ? 2 : 1; turnsLeft--; turnLabel.textContent = "P" + currentTurn; }
            score = 0; ball = { x: W / 2, y: H - 42, vx: d.ballSpd, vy: -d.ballSpd }; paddle.x = W / 2 - d.paddleW / 2; initBricks(); running = true; canvas.onclick = null;
            if (turnBar) turnBar.style.display = "flex";
            updateScore();
          } else { score = 0; ball = { x: W / 2, y: H - 42, vx: d.ballSpd, vy: -d.ballSpd }; paddle.x = W / 2 - d.paddleW / 2; initBricks(); running = true; canvas.onclick = null; }
        };
        return;
      }
      breakoutTimer = requestAnimationFrame(loop);
    }
    breakoutTimer = requestAnimationFrame(loop);
  }
  function stopBreakout() { cancelAnimationFrame(breakoutTimer); }

  /* ---------- WHACK-A-MOLE ---------- */
  var whackTimer = null, whackScore = 0, whackTime = 30, whackHoles = [];
  function startWhack() {
    var cfg = gameConfigs.whack || { mode: "solo", diff: "easy" };
    var dc = { easy: { time: 45, moleRate: 0.35, hideRate: 0.2 }, medium: { time: 30, moleRate: 0.45, hideRate: 0.3 }, hard: { time: 20, moleRate: 0.6, hideRate: 0.4 } };
    var d = dc[cfg.diff] || dc.easy;
    var isFriend = cfg.mode === "friend";
    whackScore = 0; whackTime = d.time; whackHoles = new Array(9).fill(false);
    var turnBar = $("whack-turn-bar"), turnLabel = $("whack-turn-text");
    if (turnBar) turnBar.style.display = isFriend ? "flex" : "none";
    var currentTurn = 1, pScores = [0, 0];
    function updateScore() {
      if (isFriend) $("whack-score").textContent = "P1: " + pScores[0] + " | P2: " + pScores[1] + " | Time: " + whackTime + "s";
      else $("whack-score").textContent = "Score: " + whackScore + " | Time: " + whackTime + "s";
    }
    updateScore();
    renderWhack();
    var grid = $("whack-grid");
    grid.onclick = function (e) {
      var idx = parseInt(e.target.getAttribute("data-idx"));
      if (isNaN(idx) || !whackHoles[idx]) return;
      whackHoles[idx] = false;
      if (isFriend) { pScores[currentTurn === 1 ? 0 : 1] += 10; } else { whackScore += 10; }
      updateScore(); renderWhack();
    };
    whackTimer = setInterval(function () {
      whackTime--;
      if (Math.random() < d.moleRate) {
        var empty = []; for (var i = 0; i < 9; i++) if (!whackHoles[i]) empty.push(i);
        if (empty.length) whackHoles[empty[Math.floor(Math.random() * empty.length)]] = true;
        for (var i = 0; i < 9; i++) if (Math.random() < d.hideRate) whackHoles[i] = false;
      }
      renderWhack(); updateScore();
      if (whackTime <= 0) {
        clearInterval(whackTimer);
        if (isFriend) {
          var winner = pScores[0] > pScores[1] ? "P1 wins!" : pScores[1] > pScores[0] ? "P2 wins!" : "Draw!";
          $("whack-score").textContent = winner + " P1: " + pScores[0] + " | P2: " + pScores[1];
        } else { $("whack-score").textContent = "Final: " + whackScore + " points!"; }
      }
    }, 1000);
  }
  function renderWhack() {
    var grid = $("whack-grid"); grid.innerHTML = "";
    for (var i = 0; i < 9; i++) {
      var d = document.createElement("div");
      d.className = "ba-whack-hole" + (whackHoles[i] ? " ba-whack-active" : "");
      d.setAttribute("data-idx", i);
      d.textContent = whackHoles[i] ? "🐹" : "";
      grid.appendChild(d);
    }
  }
  function stopWhack() { clearInterval(whackTimer); }

  /* ---------- CONNECT FOUR ---------- */
  var c4Board = [], c4Turn = "red", c4GameOver = false, c4Mode = "bot", c4Diff = "easy";
  function startConnect4() {
    var cfg = gameConfigs.connect4 || { mode: "bot", diff: "easy" };
    c4Mode = cfg.mode; c4Diff = cfg.diff;
    c4Board = []; c4Turn = "red"; c4GameOver = false;
    for (var r = 0; r < 6; r++) { c4Board[r] = []; for (var c = 0; c < 7; c++) c4Board[r][c] = ""; }
    var statusEl = $("connect4-status");
    if (c4Mode === "friend") { statusEl.textContent = "Red's turn"; }
    else { statusEl.textContent = "Your turn (Red)"; }
    var tb = $("c4-turn-bar"); if (tb) tb.style.display = "flex";
    renderConnect4();
    $("connect4-grid").onclick = function (e) {
      if (c4GameOver) return;
      if (c4Mode === "bot" && c4Turn !== "red") return;
      var col = parseInt(e.target.getAttribute("data-col"));
      if (isNaN(col)) return;
      dropC4(col, c4Turn);
      var winner = checkC4();
      if (winner) { c4GameOver = true; statusEl.textContent = (c4Mode === "friend" ? c4Turn + " wins! 🎉" : c4Turn === "red" ? "You win! 🎉" : "Computer wins! 😔"); renderConnect4(); return; }
      if (isC4Full()) { c4GameOver = true; statusEl.textContent = "Draw!"; renderConnect4(); return; }
      if (c4Mode === "bot") {
        c4Turn = "yellow"; statusEl.textContent = "Computer thinking...";
        renderConnect4(); setTimeout(c4AI, 400);
      } else {
        c4Turn = c4Turn === "red" ? "yellow" : "red";
        statusEl.textContent = c4Turn === "red" ? "Red's turn" : "Yellow's turn";
        renderConnect4();
      }
    };
  }
  function dropC4(col, player) { for (var r = 5; r >= 0; r--) { if (!c4Board[r][col]) { c4Board[r][col] = player; return true; } } return false; }
  function c4AI() {
    if (c4GameOver) return;
    var col = -1;
    if (c4Diff === "easy") {
      if (Math.random() > 0.4) { col = -1; } else { col = c4SmartMove("yellow"); }
    } else if (c4Diff === "medium") {
      col = c4SmartMove("yellow");
      if (col < 0 && Math.random() > 0.5) col = c4RandomMove();
    } else {
      col = c4SmartMove("yellow");
      if (col < 0) col = c4LookAhead("yellow");
      if (col < 0) col = c4RandomMove();
    }
    dropC4(col, "yellow");
    if (checkC4For("yellow")) { c4GameOver = true; $("connect4-status").textContent = "Computer wins! 😔"; }
    else if (isC4Full()) { c4GameOver = true; $("connect4-status").textContent = "Draw!"; }
    else { c4Turn = "red"; $("connect4-status").textContent = "Your turn (Red)"; }
    renderConnect4();
  }
  function c4SmartMove(p) {
    var opp = p === "red" ? "yellow" : "red";
    for (var c = 0; c < 7; c++) { var r = findC4Row(c); if (r >= 0) { c4Board[r][c] = p; if (checkC4For(p)) { c4Board[r][c] = ""; return c; } c4Board[r][c] = ""; } }
    for (var c = 0; c < 7; c++) { var r = findC4Row(c); if (r >= 0) { c4Board[r][c] = opp; if (checkC4For(opp)) { c4Board[r][c] = ""; return c; } c4Board[r][c] = ""; } }
    return -1;
  }
  function c4RandomMove() {
    var avail = []; for (var c = 0; c < 7; c++) { if (findC4Row(c) >= 0) avail.push(c); }
    return avail[Math.floor(Math.random() * avail.length)];
  }
  function c4LookAhead(p) {
    var opp = p === "red" ? "yellow" : "red";
    for (var c = 0; c < 7; c++) {
      var r = findC4Row(c); if (r < 0) continue;
      c4Board[r][c] = p;
      var blocked = false;
      for (var c2 = 0; c2 < 7; c2++) {
        var r2 = findC4Row(c2); if (r2 < 0) continue;
        c4Board[r2][c2] = opp;
        if (checkC4For(opp)) { blocked = true; c4Board[r2][c2] = ""; break; }
        c4Board[r2][c2] = "";
      }
      c4Board[r][c] = "";
    }
    return -1;
  }
  function findC4Row(col) {
    for (var r = 5; r >= 0; r--) { if (!c4Board[r][col]) return r; }
    return -1;
  }
  function checkC4() { return checkC4For("red"); }
  function checkC4For(p) {
    for (var r = 0; r < 6; r++) for (var c = 0; c < 4; c++) {
      if (c4Board[r][c] === p && c4Board[r][c + 1] === p && c4Board[r][c + 2] === p && c4Board[r][c + 3] === p) return true;
    }
    for (var r = 0; r < 3; r++) for (var c = 0; c < 7; c++) {
      if (c4Board[r][c] === p && c4Board[r + 1][c] === p && c4Board[r + 2][c] === p && c4Board[r + 3][c] === p) return true;
    }
    for (var r = 0; r < 3; r++) for (var c = 0; c < 4; c++) {
      if (c4Board[r][c] === p && c4Board[r + 1][c + 1] === p && c4Board[r + 2][c + 2] === p && c4Board[r + 3][c + 3] === p) return true;
    }
    for (var r = 3; r < 6; r++) for (var c = 0; c < 4; c++) {
      if (c4Board[r][c] === p && c4Board[r - 1][c + 1] === p && c4Board[r - 2][c + 2] === p && c4Board[r - 3][c + 3] === p) return true;
    }
    return false;
  }
  function isC4Full() {
    for (var c = 0; c < 7; c++) if (!c4Board[0][c]) return false;
    return true;
  }
  function renderConnect4() {
    var grid = $("connect4-grid"); grid.innerHTML = "";
    for (var r = 0; r < 6; r++) for (var c = 0; c < 7; c++) {
      var d = document.createElement("div");
      d.className = "ba-c4-cell";
      d.setAttribute("data-col", c);
      if (c4Board[r][c]) d.classList.add("ba-c4-" + c4Board[r][c]);
      grid.appendChild(d);
    }
  }
  if ($("connect4-restart")) $("connect4-restart").addEventListener("click", startConnect4);

  /* ---------- HIDDEN GESTURES (easter egg to open games) ---------- */
  function setupHiddenGestures() {
    var eggTrigger = $("easter-egg-trigger");
    var eggTapCount = 0;
    var eggTapTimer = null;

    if ($("games-back")) {
      $("games-back").addEventListener("click", function () { $("games-modal").classList.remove("ba-modal-open"); });
    }

    if (eggTrigger) {
      eggTrigger.addEventListener("click", function () {
        console.log("[easter-egg] tap count:", eggTapCount + 1);
        eggTapCount++;
        clearTimeout(eggTapTimer);
        eggTapTimer = setTimeout(function () { eggTapCount = 0; }, 1500);
        if (eggTapCount >= 7) {
          eggTapCount = 0;
          console.log("[easter-egg] opening games modal");
          if (focusRunning) stopFocusTimer();
          openModal("games-modal");
        }
      });
    }

    // Swipe from left edge to open current subject PDF
    document.addEventListener("touchstart", function (e) {
      if (e.touches[0].clientX < 15) {
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

/*__APPEND__*/

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    console.log("[init] starting");
    applyTheme(); applyHeader();
    setupOnboarding();
    console.log("[init] onboarding done");
    document.querySelectorAll(".ba-tabbar-item").forEach(function (it) {
      it.addEventListener("click", function () { navigate(this.getAttribute("data-section")); });
    });
    document.querySelectorAll(".ba-modal").forEach(function (m) {
      m.addEventListener("click", function (e) { if (e.target === m && !m.classList.contains("ba-modal-bottom")) closeModal(m.id); });
    });
    var setups = [
      setupHome, setupSchedule, setupSettings, setupSchoolbag, setupSubjectFolder,
      setupNewMenu, setupFolderModal, setupNbCreate, setupEditor, setupWhiteboard,
      setupSheetEditor, setupQuickNote, setupHomework, setupPdfReader, setupTools,
      setupLibraryNoteForm, setupGames, setupHiddenGestures, initOnboardingEvents
    ];
    setups.forEach(function (fn) { try { console.log("[init] running setup:", fn.name); fn(); console.log("[init] done setup:", fn.name); } catch (e) { console.warn("Setup failed:", fn.name, e); } });
    document.querySelectorAll(".ba-modal-close").forEach(function (b) { if (!b.id) return; b.addEventListener("click", function () { closeModal(b.closest(".ba-modal").id); }); });
    var docMenuClose = $("doc-menu-close"); if (docMenuClose) docMenuClose.addEventListener("click", function () { closeModal("doc-menu-modal"); });
    renderHome(); renderSchoolbag(); renderExamInfo();
    setInterval(renderHome, 60000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
