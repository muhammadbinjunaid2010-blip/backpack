/* ============================================================
   BACKPACK AIR — Web (Desktop) sidebar controller
   ============================================================ */
(function () {
  "use strict";

  /* Only run on web.html */
  if (!document.querySelector('.ba-web-shell')) return;

  var $ = function (id) { return document.getElementById(id); };

  /* ---------- Student sidebar navigation ---------- */
  var navItems = document.querySelectorAll('.ba-web-nav-item');
  var screens = document.querySelectorAll('.ba-screen');
  var pageTitle = $('web-page-title');

  var sectionTitles = {
    home: 'Home',
    schoolbag: 'My Schoolbag',
    schedule: 'Schedule',
    settings: 'Settings'
  };

  navItems.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var section = this.getAttribute('data-section');

      /* Update nav active state */
      navItems.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');

      /* Show/hide screens */
      screens.forEach(function (s) { s.classList.remove('ba-screen-active'); });
      var target = document.querySelector('[data-section="' + section + '"].ba-screen');
      if (target) target.classList.add('ba-screen-active');

      /* Update page title */
      if (pageTitle) pageTitle.textContent = sectionTitles[section] || section;
    });
  });

  /* ---------- Sync sidebar header with app data ---------- */
  function syncWebHeader() {
    try {
      var DB = loadDB();
      if (!DB || !DB.settings) return;

      var school = (DB.settings.school || 'Bahria College Karsaz')
        .replace(/\s*[·•]\s*Prototype\s*&\s*Testing/gi, '').trim();
      var isTeacher = DB.settings.isTeacher;
      /* In teacher mode always use DB.settings.name; in student mode prefer userName */
      var userName = isTeacher ? (DB.settings.name || 'Teacher') : (DB.settings.userName || DB.settings.name || 'Student');

      var schoolEl = $('web-hdr-school');
      var classEl = $('web-hdr-class');
      var userNameEl = $('web-user-name');
      var userAvatar = $('web-user-avatar');
      var userRole = $('web-user-role');

      if (schoolEl) schoolEl.textContent = school;
      if (userNameEl) userNameEl.textContent = userName;
      if (userAvatar) userAvatar.textContent = (userName.charAt(0) || 'S').toUpperCase();

      if (isTeacher) {
        if (classEl) classEl.textContent = 'Teacher · ' + (DB.settings.name || 'Ms. Sadia');
        if (userRole) userRole.textContent = 'Teacher Mode';
      } else {
        var cls = 'Class ' + (DB.settings.class || 'X') + '-' + (DB.settings.section || 'C');
        if (classEl) classEl.textContent = cls;
        if (userRole) userRole.textContent = 'Student Mode';
      }
    } catch (e) { /* silent */ }
  }

  /* Run on load + observe changes */
  syncWebHeader();
  setInterval(syncWebHeader, 2000);

  /* ---------- Teacher dashboard sidebar override ---------- */
  var teacherSidebarActive = 'home'; /* track active section across re-renders */
  var teacherSidebarSetup = false;
  function setupTeacherSidebar() {
    var sidebar = $('ba-web-sidebar-nav');
    if (!sidebar) return;

    var TEACHER_TABS = [
      { id: 'home', label: 'Home', svg: '<svg viewBox="0 0 24 24" fill="none"><path d="M3 9L12 2L21 9V20C21 20.53 20.53 21 20 21H4C3.47 21 3 20.53 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
      { id: 'material', label: 'Material', svg: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" stroke-width="2"/><line x1="9" y1="3" x2="9" y2="21" stroke="currentColor" stroke-width="2"/></svg>' },
      { id: 'classes', label: 'Classes', svg: '<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/><line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="2"/><line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="2"/></svg>' },
      { id: 'students', label: 'Students', svg: '<svg viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/></svg>' },
      { id: 'settings', label: 'Settings', svg: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3.2" stroke="currentColor" stroke-width="2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5 5l2.1 2.1M16.9 16.9 19 19M19 5l-2.1 2.1M7.1 16.9 5 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' }
    ];

    var TEACHER_TITLES = {
      home: 'Home', material: 'Study Material', classes: 'My Classes',
      students: 'Students', settings: 'Settings',
      'class-detail': 'Class Detail', 'student-detail': 'Student Detail',
      marks: 'Marks', attendance: 'Attendance', 'notebook-view': 'Notebook'
    };

    /* Replace sidebar nav with teacher tabs */
    var html = '';
    TEACHER_TABS.forEach(function (tab) {
      html += '<button class="ba-web-nav-item' + (tab.id === teacherSidebarActive ? ' active' : '') + '" data-tsection="' + tab.id + '">';
      html += tab.svg + '<span>' + tab.label + '</span></button>';
    });
    sidebar.innerHTML = html;

    /* Hide student-only screens */
    screens.forEach(function (s) { s.classList.remove('ba-screen-active'); });

    /* Bind teacher nav clicks */
    sidebar.querySelectorAll('[data-tsection]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        sidebar.querySelectorAll('.ba-web-nav-item').forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        var section = this.getAttribute('data-tsection');
        teacherSidebarActive = section;
        if (pageTitle) pageTitle.textContent = TEACHER_TITLES[section] || section;
        if (window.TeacherDashboard && window.TeacherDashboard.renderScreen) {
          window.TeacherDashboard.renderScreen(section);
        }
      });
    });

    /* Render teacher home into ba-main if not already rendered */
    var main = $('ba-main');
    if (main && main.children.length > 0 && main.querySelector('.ba-screen')) {
      /* Student screens are still visible, render teacher content */
      if (window.TeacherDashboard && window.TeacherDashboard.renderScreen) {
        window.TeacherDashboard.renderScreen('home');
      }
    }
  }

  /* Helper: load DB from BAStore */
  function loadDB() {
    try {
      if (window.BAStore && window.BAStore.load) return window.BAStore.load();
    } catch (e) { /* silent */ }
    return null;
  }

  /* Check immediately on load — handles returning teachers */
  try {
    var initDB = loadDB();
    if (initDB && initDB.settings && initDB.settings.isTeacher) {
      setupTeacherSidebar();
    }
  } catch (e) { /* silent */ }

  /* Watch for teacher mode activation (stop once detected) */
  var teacherWatch = setInterval(function () {
    try {
      var DB = loadDB();
      if (DB && DB.settings && DB.settings.isTeacher) {
        clearInterval(teacherWatch);
        setupTeacherSidebar();
      }
    } catch (e) { /* silent */ }
  }, 1000);

  /* Also trigger sidebar setup right after teacher login button is clicked */
  var tlBtn = $('tl-continue');
  if (tlBtn) {
    tlBtn.addEventListener('click', function () {
      setTimeout(function () {
        try {
          var DB = loadDB();
          if (DB && DB.settings && DB.settings.isTeacher) {
            teacherSidebarActive = 'home'; /* reset to home on fresh login */
            setupTeacherSidebar();
          }
        } catch (e) { /* silent */ }
      }, 300);
    });
  }

  /* ---------- Mobile redirect (runtime check) ---------- */
  window.addEventListener('resize', function () {
    if (window.innerWidth < 1024) {
      window.location.replace('../find-school.html#download');
    }
  });
})();
