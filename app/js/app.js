/* ============================================================
   BACKPACK AIR — App Prototype JavaScript
   ============================================================ */

(function () {
  "use strict";

  /* ---------- DOM Elements ---------- */
  var doc = document.documentElement;
  var body = document.body;

  /* ---------- App Data (Config) ---------- */
  var schoolConfig = {
    name: "Bahria College Karsaz",
    address: "Habib Rehmatullah Road, Karsaz, Karachi",
    class: "X-C",
    classTeacher: "47 — Ms. Saeeda (vii)",
    logo: "assets/logo.svg",
    timetable: {
      days: {
        mon: {
          periods: [
            { time: "08:00", end: "08:40", subject: "Chem Lab", teacher: "Ms. Saeeda", type: "double" },
            { time: "08:40", end: "09:20", subject: "Chem Lab", teacher: "Ms. Saeeda", type: "double" },
            { time: "09:20", end: "10:00", subject: "P St", teacher: "Mr. Imran", type: "single" },
            { time: "10:00", end: "10:40", subject: "Maths", teacher: "", type: "single" },
            { time: "10:40", end: "11:00", subject: "BREAK", teacher: "", type: "break" },
            { time: "11:00", end: "11:40", subject: "P-Lab", teacher: "Mr. Farhan", type: "double" },
            { time: "11:40", end: "12:20", subject: "P-Lab", teacher: "Mr. Farhan", type: "double" },
            { time: "12:20", end: "01:00", subject: "Urd", teacher: "New Urdu", type: "single" },
            { time: "01:00", end: "01:40", subject: "Comp. Sc", teacher: "New Computer", type: "single" }
          ]
        },
        tue: {
          periods: [
            { time: "08:00", end: "08:40", subject: "Chem", teacher: "Ms. Saeeda", type: "single" },
            { time: "08:40", end: "09:20", subject: "Phy", teacher: "Mr. Farhan", type: "single" },
            { time: "09:20", end: "10:00", subject: "Eng", teacher: "Mr. Hussain", type: "single" },
            { time: "10:00", end: "10:40", subject: "Maths", teacher: "", type: "single" },
            { time: "10:40", end: "11:00", subject: "BREAK", teacher: "", type: "break" },
            { time: "11:00", end: "11:40", subject: "Urd", teacher: "New Urdu", type: "single" },
            { time: "11:40", end: "12:20", subject: "P St", teacher: "Mr. Imran", type: "single" },
            { time: "12:20", end: "01:00", subject: "Comp. Sc", teacher: "New Computer", type: "single" },
            { time: "01:00", end: "01:40", subject: "T-E-Q", teacher: "Mr. Tahir", type: "single" }
          ]
        },
        wed: {
          periods: [
            { time: "08:00", end: "08:40", subject: "Chem", teacher: "Ms. Saeeda", type: "single" },
            { time: "08:40", end: "09:20", subject: "P St", teacher: "Mr. Imran", type: "single" },
            { time: "09:20", end: "10:00", subject: "T-E-Q", teacher: "Mr. Tahir", type: "single" },
            { time: "10:00", end: "10:40", subject: "Maths", teacher: "", type: "single" },
            { time: "10:40", end: "11:00", subject: "BREAK", teacher: "", type: "break" },
            { time: "11:00", end: "11:40", subject: "PT", teacher: "Mr. Rizwan", type: "single" },
            { time: "11:40", end: "12:20", subject: "Comp. Sc", teacher: "New Computer", type: "single" },
            { time: "12:20", end: "01:00", subject: "Phy", teacher: "Mr. Farhan", type: "single" },
            { time: "01:00", end: "01:40", subject: "Eng", teacher: "Mr. Hussain", type: "single" }
          ]
        },
        thu: {
          periods: [
            { time: "08:00", end: "08:40", subject: "Chem", teacher: "Ms. Saeeda", type: "single" },
            { time: "08:40", end: "09:20", subject: "Urd", teacher: "New Urdu", type: "single" },
            { time: "09:20", end: "10:00", subject: "Eng", teacher: "Mr. Hussain", type: "single" },
            { time: "10:00", end: "10:40", subject: "Phy", teacher: "Mr. Farhan", type: "single" },
            { time: "10:40", end: "11:00", subject: "BREAK", teacher: "", type: "break" },
            { time: "11:00", end: "11:40", subject: "Maths", teacher: "", type: "single" },
            { time: "11:40", end: "12:20", subject: "Maths", teacher: "", type: "single" },
            { time: "12:20", end: "01:00", subject: "Comp. Sc", teacher: "New Computer", type: "single" },
            { time: "01:00", end: "01:40", subject: "T-E-Q", teacher: "Mr. Tahir", type: "single" }
          ]
        },
        fri: {
          periods: [
            { time: "08:00", end: "08:40", subject: "Chem", teacher: "Ms. Saeeda", type: "single" },
            { time: "08:40", end: "09:20", subject: "Lib", teacher: "Ms. Zinhar", type: "single" },
            { time: "09:20", end: "10:00", subject: "Comp Lab", teacher: "New Computer", type: "double" },
            { time: "10:00", end: "10:40", subject: "Comp Lab", teacher: "New Computer", type: "double" },
            { time: "10:40", end: "11:00", subject: "BREAK", teacher: "", type: "break" },
            { time: "11:00", end: "11:40", subject: "Maths", teacher: "", type: "single" },
            { time: "11:40", end: "12:20", subject: "Eng", teacher: "Mr. Hussain", type: "single" },
            { time: "12:20", end: "01:00", subject: "Urd", teacher: "New Urdu", type: "single" },
            { time: "01:00", end: "01:40", subject: "Phy", teacher: "Mr. Farhan", type: "single" }
          ]
        }
      }
    },
    books: [
      { id: "math", subject: "Mathematics", name: "New Math", offline: true },
      { id: "english", subject: "English", offline: true },
      { id: "urdu", subject: "Urdu", offline: true, rtl: true },
      { id: "physics", subject: "Physics", offline: true },
      { id: "chemistry", subject: "Chemistry", offline: true },
      { id: "biology", subject: "Biology", offline: true },
      { id: "computer", subject: "Computer Science", offline: true },
      { id: "islamiat", subject: "Islamiat", offline: true },
      { id: "pakstudies", subject: "Pakistan Studies", offline: true }
    ],
    notebooks: [],
    exams: [
      { title: "1st Assessment", starts: "Mid-September", class: "X-C" }
    ],
    // Current time tracking
    currentTime: new Date()
  };

  /* ---------- Initialize ---------- */
  function init() {
    setupTimeTracking();
    setupNavigation();
    setupTimetable();
    setupBooks();
    setupNotebooks();
    setupExams();
    setupSchool();
    setupSettings();
    renderTime();
    renderHomeTimetable();
    renderCurrentPeriod();
    
    // Start time interval
    setInterval(renderTime, 1000);
  }

  /* ---------- Time Tracking ---------- */
  function setupTimeTracking() {
    function renderTime() {
      var now = new Date();
      schoolConfig.currentTime = now;
      
      // Format time
      var hours = now.getHours();
      var minutes = now.getMinutes();
      var ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      
      document.getElementById("app-header-time").innerHTML = hours + ":" + minutes + " " + ampm;
      
      // Determine current day of week (0=Sunday, 1=Monday, etc.)
      var dayIndex = now.getDay(); // 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 0=Sun
      var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      var dayName = dayNames[dayIndex];
      
      document.getElementById("home-screen-day").innerHTML = 
        dayName + "<br/>" + now.toLocaleDateString();
      
      // Highlight current period
      renderCurrentPeriod();
    }
    
    function renderCurrentPeriod() {
      var now = schoolConfig.currentTime;
      var dayIndex = now.getDay(); // 1=Mon through 5=Fri, 0=Sun, 6=Sat
      
      // Find the current day's timetable
      var dayKey;
      if (dayIndex >= 1 && dayIndex <= 5) {
        dayKey = ["mon", "tue", "wed", "thu", "fri"][dayIndex - 1];
      } else {
        // Weekend - show no periods
        updatePeriodDisplay(null, null);
        return;
      }
      
      var dayTimetable = schoolConfig.timetable.days[dayKey];
      if (!dayTimetable) return;
      
      var currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
      var currentPeriod = null;
      var nextPeriod = null;
      
      for (var i = 0; i < dayTimetable.periods.length; i++) {
        var period = dayTimetable.periods[i];
        var startParts = period.time.split(":");
        var startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
        var endMinutes;
        
        if (period.type === "break") {
          endMinutes = startMinutes + 20; // 20 min break
        } else {
          endMinutes = startMinutes + (period.type === "double" ? 40 : 40);
        }
        
        if (currentTimeMinutes >= startMinutes && currentTimeMinutes < endMinutes) {
          currentPeriod = period;
          // Find next period
          for (var j = i + 1; j < dayTimetable.periods.length; j++) {
            var next = dayTimetable.periods[j];
            var nextStartParts = next.time.split(":");
            var nextStartMinutes = parseInt(nextStartParts[0]) * 60 + parseInt(nextStartParts[1]);
            if (nextStartMinutes > currentTimeMinutes) {
              nextPeriod = next;
              break;
            }
          }
          break;
        }
      }
      
      updatePeriodDisplay(currentPeriod, nextPeriod);
    }
    
    function updatePeriodDisplay(currentPeriod, nextPeriod) {
      var periodEl = document.getElementById("ba-current-period");
      var nextEl = document.getElementById("ba-next-period");
      
      if (currentPeriod) {
        var typeText = currentPeriod.type === "break" ? "BREAK" : 
                       currentPeriod.type === "double" ? "Double Period" : "Period";
        periodEl.innerHTML = currentPeriod.time + " - " + currentPeriod.end + "<br/>" + 
          (currentPeriod.subject || "") + "<br/>" + (currentPeriod.teacher || "");
        periodEl.style.color = "#fff";
      } else {
        periodEl.innerHTML = "No class scheduled";
        periodEl.style.color = "#a4a4a4";
      }
      
      if (nextPeriod) {
        nextEl.innerHTML = nextPeriod.time + " - " + nextPeriod.end + "<br/>" + 
          (nextPeriod.subject || "") + "<br/>" + (nextPeriod.teacher || "");
      } else {
        nextEl.innerHTML = "No more periods today";
      }
    }
  }

  /* ---------- Navigation ---------- */
  function setupNavigation() {
    // Nav link clicks
    document.querySelectorAll(".ba-nav_link").forEach(function(link) {
      link.addEventListener("click", function(e) {
        e.preventDefault();
        var section = this.getAttribute("data-section");
        navigateToSection(section);
      });
    });
    
    // Back buttons
    document.querySelectorAll(".ba-back-button").forEach(function(btn) {
      btn.addEventListener("click", function() {
        navigateToSection("home");
      });
    });
    
    // Hamburger menu
    var navButton = document.getElementById("ba-nav-button");
    var navMenu = document.getElementById("ba-nav-menu");
    var body = document.body;
    
    if (navButton && navMenu) {
      navButton.addEventListener("click", function() {
        body.classList.toggle("nav-open");
        navButton.setAttribute("aria-expanded", body.classList.contains("nav-open"));
      });
    }
    
    // Close nav on link click
    document.querySelectorAll(".ba-nav_link").forEach(function(link) {
      link.addEventListener("click", function() {
        body.classList.remove("nav-open");
        navButton.setAttribute("aria-expanded", "false");
      });
    });
  }
  
  function navigateToSection(section) {
    // Update nav links
    document.querySelectorAll(".ba-nav_link").forEach(function(link) {
      link.classList.toggle("ba-nav_link-active", link.getAttribute("data-section") === section);
    });
    
    // Hide all screens
    document.querySelectorAll(".ba-screen").forEach(function(screen) {
      screen.classList.remove("ba-screen-active");
    });
    
    // Show target screen
    var targetScreen = document.getElementById(section + "-screen");
    if (targetScreen) {
      targetScreen.classList.add("ba-screen-active");
    }
    
    // Update main content area ID
    var main = document.getElementById("ba-main");
    if (main) {
      main.setAttribute("data-active-section", section);
    }
  }

  /* ---------- Timetable ---------- */
  function setupTimetable() {
    // Day navigation
    document.querySelectorAll(".ba-timetable-day").forEach(function(day) {
      day.addEventListener("click", function() {
        document.querySelectorAll(".ba-timetable-day").forEach(function(d) {
          d.classList.remove("ba-timetable-day-active");
        });
        day.classList.add("ba-timetable-day-active");
        
        var dayKey = day.getAttribute("data-day");
        renderTimetableDay(dayKey);
      });
    });
    
    // Initial render - Monday
    renderTimetableDay("mon");
  }
  
  function renderTimetableDay(dayKey) {
    var contentEl = document.getElementById("ba-timetable-content");
    var dayTimetable = schoolConfig.timetable.days[dayKey];
    
    if (!dayTimetable) return;
    
    var html = "";
    var isCurrentDay = false;
    
    // Check if this is today
    var now = schoolConfig.currentTime;
    var todayIndex = now.getDay();
    var todayKey = ["mon", "tue", "wed", "thu", "fri"][todayIndex - 1] || null;
    if (dayKey === todayKey) isCurrentDay = true;
    
    html += '<div class="ba-timetable-day-header ' + (isCurrentDay ? "ba-current-day" : "") + '">';
    html += '<div>' + dayKey.toUpperCase() + '</div>';
    html += '<div>Morning Timetable</div>';
    html += '</div>';
    
    html += '<div class="ba-timetable-periods">';
    
    dayTimetable.periods.forEach(function(period, index) {
      var isBreaktime = period.type === "break";
      var bgClass = isBreaktime ? "ba-period-break" : "ba-period-single";
      var timeDisplay = period.time + " - " + period.end;
      
      html += '<div class="ba-period-item ' + bgClass + '" data-period-index="' + index + '">';
      html += '<div class="ba-period-time">' + timeDisplay + '</div>';
      
      if (isBreaktime) {
        html += '<div class="ba-period-subject ba-period-break-subject">BREAK</div>';
        html += '<div class="ba-period-teacher"></div>';
      } else {
        html += '<div class="ba-period-subject ' + (isCurrentDay ? "ba-period-current" : "") + '">' + (period.subject || "") + '</div>';
        html += '<div class="ba-period-teacher">' + (period.teacher || "") + '</div>';
      }
      
      html += '</div>';
    });
    
    html += '</div>';
    
    contentEl.innerHTML = html;
    
    // Add click handlers for period items
    setupPeriodClicks();
  }
  
  function setupPeriodClicks() {
    document.querySelectorAll(".ba-period-item").forEach(function(item) {
      item.addEventListener("click", function() {
        var index = item.getAttribute("data-period-index");
        // Could navigate to book or notebook for this subject
        showSubjectInfo(parseInt(index));
      });
    });
  }

  /* ---------- Books ---------- */
  function setupBooks() {
    renderBooks();
  }
  
  function renderBooks() {
    var gridEl = document.getElementById("ba-books-grid");
    var emptyEl = document.getElementById("ba-books-empty");
    
    if (!gridEl || !emptyEl) return;
    
    var books = schoolConfig.books;
    
    if (books.length === 0) {
      gridEl.style.display = "none";
      emptyEl.style.display = "block";
      return;
    }
    
    gridEl.style.display = "grid";
    emptyEl.style.display = "none";
    
    var html = "";
    books.forEach(function(book) {
      var coverImg = "";
      switch(book.id) {
        case "math": coverImg = "📐"; break;
        case "english": coverImg = "📖"; break;
        case "urdu": coverImg = "اردو"; break;
        case "physics": coverImg = "⚛️"; break;
        case "chemistry": coverImg = "🧪"; break;
        case "biology": coverImg = "🧫"; break;
        case "computer": coverImg = "💻"; break;
        case "islamiat": coverImg = "☪️"; break;
        case "pakstudies": coverImg = "🏛️"; break;
      }
      
      html += '<div class="ba-book-card" data-book-id="' + book.id + '">';
      html += '<div class="ba-book-cover">' + coverImg + '</div>';
      html += '<div class="ba-book-subject">' + book.subject + '</div>';
      html += '<div class="ba-book-class">Class X</div>';
      html += '<div class="ba-book-offline">Available offline</div>';
      html += '<div class="ba-book-open">Open Book</div>';
      html += '</div>';
    });
    
    gridEl.innerHTML = html;
    
    // Add click handlers
    document.querySelectorAll(".ba-book-card").forEach(function(card) {
      card.addEventListener("click", function() {
        var bookId = this.getAttribute("data-book-id");
        openBook(bookId);
      });
    });
  }
  
  function openBook(bookId) {
    var book = schoolConfig.books.find(function(b) { return b.id === bookId; });
    if (!book) return;
    
    // Navigate to books screen with PDF reader
    navigateToSection("books");
    
    // In a real app, we'd open the PDF reader
    // For prototype, show alert
    alert("Opening " + book.subject + " textbook...\n\n" +
      "This is a prototype. PDF reader would load the actual bundled file.\n\n" +
      "Page 1 of " + (Math.floor(Math.random() * 200) + 100) + " pages");
  }

  /* ---------- Notebooks ---------- */
  function setupNotebooks() {
    renderNotebooks();
  }
  
  function renderNotebooks() {
    var gridEl = document.getElementById("ba-notebooks-grid");
    var emptyEl = document.getElementById("ba-notebooks-empty");
    
    if (!gridEl || !emptyEl) return;
    
    var notebooks = schoolConfig.notebooks;
    
    if (notebooks.length === 0) {
      gridEl.style.display = "none";
      emptyEl.style.display = "block";
      emptyEl.innerHTML = 'No notebooks yet. Tap <span class="ba-text-primary">+ New Notebook</span> to create one.';
      return;
    }
    
    gridEl.style.display = "grid";
    emptyEl.style.display = "none";
    
    var html = "";
    notebooks.forEach(function(nb) {
      html += '<div class="ba-notebook-card" data-notebook-id="' + nb.id + '">';
      html += '<div class="ba-notebook-cover">' + (nb.coverIcon || "📓") + '</div>';
      html += '<div class="ba-notebook-subject">' + nb.subject + '</div>';
      html += '<div class="ba-notebook-pages">' + nb.pages + ' pages</div>';
      html += '</div>';
    });
    
    gridEl.innerHTML = html;
    
    // Add click handlers
    document.querySelectorAll(".ba-notebook-card").forEach(function(card) {
      card.addEventListener("click", function() {
        var nbId = this.getAttribute("data-notebook-id");
        openNotebook(nbId);
      });
    });
  }
  
  function openNotebook(nbId) {
    navigateToSection("notebooks");
    // In prototype, show notebook editor
    var nb = schoolConfig.notebooks.find(function(n) { return n.id === nbId; });
    alert("Opening notebook: " + (nb ? nb.subject : "Untitled"));
  }
  
  // Create new notebook
  window.createNotebook = function() {
    var name = prompt("Enter notebook name:", "Physics Notes");
    if (!name) return;
    
    var subject = prompt("Select subject:", "Physics");
    if (subject === null) return;
    
    var paperType = prompt("Paper type (Ruled/Grid/Graph/Blank):", "Ruled");
    if (paperType === null) return;
    
    var direction = prompt("Writing direction (Left to Right/Right to Left):", "Left to Right");
    if (direction === null) return;
    
    var cover = prompt("Cover text (or cancel):", "");
    if (cover === null) return;
    
    var newNb = {
      id: "nb-" + Date.now(),
      subject: subject,
      name: name,
      paperType: paperType,
      writingDirection: direction,
      cover: cover,
      pages: 1,
      created: new Date().toISOString()
    };
    
    schoolConfig.notebooks.push(newNb);
    renderNotebooks();
    alert("Notebook created successfully!");
  };

  /* ---------- Exams ---------- */
  function setupExams() {
    renderExams();
  }
  
  function renderExams() {
    var contentEl = document.getElementById("ba-exams-content");
    
    if (!contentEl) return;
    
    var exams = schoolConfig.exams;
    
    var html = "";
    exams.forEach(function(exam) {
      html += '<div class="ba-exam-item">';
      html += '<div class="ba-exam-subject">' + exam.title + '</div>';
      html += '<div class="ba-exam-details">';
      html += '<span class="ba-exam-date">Starting: ' + exam.starts + '</span>';
      html += '<span>Class: ' + exam.class + '</span>';
      html += '</div>';
      html += '</div>';
    });
    
    if (html === "") {
      html = '<div class="ba-exams-empty">No exam schedule configured.</div>';
    }
    
    contentEl.innerHTML = html;
  }

  /* ---------- School ---------- */
  function setupSchool() {
    // School screen already renders from config
    renderSchool();
  }
  
  function renderSchool() {
    var contentEl = document.getElementById("school-screen");
    if (!contentEl) return;
    
    var c = schoolConfig;
    
    var html = '';
    html += '<div class="ba-school-details">';
    html += '<div class="ba-school-logo">' + (/* logo would go here */ "") + '</div>';
    html += '<div class="ba-school-name">' + c.name + '</div>';
    html += '<div class="ba-school-address">' + c.address + '</div>';
    html += '<div class="ba-school-class">' + c.class + '</div>';
    html += '<div class="ba-school-teacher">' + c.classTeacher + '</div>';
    html += '</div>';
    
    contentEl.innerHTML = html;
  }

  /* ---------- Settings ---------- */
  function setupSettings() {
    // Settings already rendered
  }
  
  // Theme toggle
  window.toggleTheme = function(theme) {
    if (theme === "dark") {
      body.classList.add("ba-section.cc-dark");
    } else if (theme === "light") {
      body.classList.remove("ba-section.cc-dark");
    }
    // "system" does nothing special
  };

  /* ---------- Subject info from period click ---------- */
  function showSubjectInfo(periodIndex) {
    // This would show subject-specific content
    alert("Subject info for period " + (periodIndex + 1));
  }

  /* ---------- Initialize on load ---------- */
  window.addEventListener("load", init);
})();
