/* ============================================================
   BACKPACK AIR — interactions (Lenis + GSAP + UI)
   ============================================================ */
(function () {
  "use strict";

  /* vh fix for mobile */
  var setVh = function () {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", vh + "px");
  };
  setVh();
  window.addEventListener("resize", setVh);

  var body = document.body;

  /* ---------------- Lenis smooth scroll ---------------- */
  var lenis = null;
  if (typeof Lenis !== "undefined") {
    lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 0.8,
      gestureOrientation: "vertical",
      normalizeWheel: false,
      smoothTouch: false
    });
  }

  /* ---------------- GSAP + SplitType ---------------- */
  var hasGsap = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
  if (!hasGsap) {
    document.querySelectorAll("[text-split]").forEach(function (el) { el.style.opacity = "1"; });
  }
  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);

    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    var createScrollTrigger = function (triggerEl, tl) {
      ScrollTrigger.create({
        trigger: triggerEl,
        start: "top 85%",
        once: true,
        onEnter: function () { tl.play(); }
      });
    };

    window.addEventListener("load", function () {
      var splitTargets = document.querySelectorAll("[text-split]");
      var splits = [];
      if (typeof SplitType !== "undefined") {
        splitTargets.forEach(function (el) {
          try {
            splits.push(new SplitType(el, { types: "words, chars", tagName: "span" }));
          } catch (e) { /* keep original markup */ }
        });
      }

      gsap.set("[text-split]", { opacity: 1 });

      document.querySelectorAll("[words-slide-up]").forEach(function (el) {
        var words = el.querySelectorAll(".word");
        if (words.length) {
          var tl = gsap.timeline({ paused: true });
          tl.from(words, { opacity: 0, yPercent: 100, duration: 0.5, ease: "back.out(2)", stagger: { amount: 0.5 } });
          createScrollTrigger(el, tl);
        }
      });

      document.querySelectorAll("[letters-slide-up]").forEach(function (el) {
        var chars = el.querySelectorAll(".char");
        if (chars.length) {
          var tl = gsap.timeline({ paused: true });
          tl.from(chars, { yPercent: 100, duration: 0.5, ease: "power1.out", stagger: { amount: 0.6 } });
          createScrollTrigger(el, tl);
        }
      });

      /* generic block reveals (cards, panels) */
      document.querySelectorAll("[words-slide-up]:not([text-split])").forEach(function (el) {
        if (!el.querySelector(".word")) {
          var tl = gsap.timeline({ paused: true });
          tl.from(el, { opacity: 0, y: 40, duration: 0.6, ease: "power2.out" });
          createScrollTrigger(el, tl);
        }
      });

      document.querySelectorAll(".ba-one_card, .ba-faq_item").forEach(function (el) {
        var tl = gsap.timeline({ paused: true });
        tl.from(el, { opacity: 0, y: 36, duration: 0.55, ease: "power2.out" });
        createScrollTrigger(el, tl);
      });

      /* ---------------- All becomes digital: 4 pinned screens ---------------- */
      var bagScene = document.querySelector(".ba-bag-scene");
      if (bagScene) {
        var bagHeadings = Array.prototype.slice.call(bagScene.querySelectorAll(".ba-bag-h"));
        var bagFrames = Array.prototype.slice.call(bagScene.querySelectorAll(".ba-bag-frame"));
        var bagHls = Array.prototype.slice.call(bagScene.querySelectorAll(".ba-hl_bg"));
        var bagReduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        gsap.set(bagHeadings, { autoAlpha: 0, y: 24 });
        gsap.set(bagHeadings[0], { autoAlpha: 1, y: 0 });
        gsap.set(bagFrames, { autoAlpha: 0, scale: 0.9 });
        gsap.set(bagFrames[0], { autoAlpha: 1, scale: 1 });
        gsap.set(bagHls, { scaleX: 0 });
        if (bagReduce) gsap.set(bagHls[0], { scaleX: 1 });
        if (!bagReduce && bagHeadings.length > 1) {
          var bagTl = gsap.timeline({
            scrollTrigger: {
              trigger: bagScene,
              start: "top top",
              end: "+=300%",
              scrub: 0.6,
              pin: true,
              anticipatePin: 1
            }
          });
          bagTl.to(bagHls[0], { scaleX: 1, duration: 1, ease: "power2.out" });
          for (var i = 0; i < bagHeadings.length - 1; i++) {
            bagTl.to(bagHeadings[i], { autoAlpha: 0, y: -24, duration: 0.4 }, "+=0.8")
                 .to(bagFrames[i], { autoAlpha: 0, scale: 0.9, duration: 0.4 }, "<")
                 .to(bagHeadings[i + 1], { autoAlpha: 1, y: 0, duration: 0.4 }, "<")
                 .to(bagFrames[i + 1], { autoAlpha: 1, scale: 1, duration: 0.4 }, "<")
                 .to(bagHls[i + 1], { scaleX: 1, duration: 1, ease: "power2.out" }, "<+=0.1");
          }
        }
      }
    });
  }

  /* ---------------- Nav ---------------- */
  var navButton = document.getElementById("ba-nav-button");
  var navMenu = document.getElementById("ba-nav-menu");

  var setNavState = function () {
    var y = window.scrollY;
    var inHero = y < window.innerHeight * 0.6;
    if (inHero) { body.classList.add("is-hero"); } else { body.classList.remove("is-hero"); }
  };
  setNavState();
  window.addEventListener("scroll", setNavState, { passive: true });

  var closeNav = function () {
    body.classList.remove("nav-open");
    navButton.setAttribute("aria-expanded", "false");
  };
  navButton.addEventListener("click", function () {
    var open = body.classList.toggle("nav-open");
    navButton.setAttribute("aria-expanded", open ? "true" : "false");
  });

  /* smooth anchor scrolling */
  var scrollToEl = function (el) {
    var target = document.querySelector(el.getAttribute("href"));
    if (!target) return;
    var top = target.getBoundingClientRect().top + window.scrollY;
    var offset = target.id === "top" ? 0 : 88;
    if (lenis) { lenis.scrollTo(top - offset); }
    else { window.scrollTo({ top: top - offset, behavior: "smooth" }); }
    closeNav();
  };
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var href = a.getAttribute("href");
      if (href && href.length > 1) {
        e.preventDefault();
        scrollToEl(a);
      }
    });
  });

  /* ---------------- Custom cursor ---------------- */
  var cursor = document.querySelector(".ba-cursor");
  if (cursor && window.matchMedia("(min-width: 992px)").matches) {
    var mx = -100, my = -100, cx = -100, cy = -100;
    document.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
    });
    (function loop() {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursor.style.transform = "translate3d(" + (cx - 16) + "px," + (cy - 16) + "px,0)";
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll("a, button, .ba-tool, .ba-tablet_app, .ba-faq_q, input, .ba-select").forEach(function (el) {
      el.addEventListener("mouseenter", function () { cursor.closest(".ba-cursor-wrapper").classList.add("is-hover"); });
      el.addEventListener("mouseleave", function () { cursor.closest(".ba-cursor-wrapper").classList.remove("is-hover"); });
    });
  }

  /* ---------------- Stylus tools (section 03) ---------------- */
  var inkPath = document.getElementById("ba-ink-path");
  var tools = document.querySelectorAll(".ba-tool");
  var inkState = { color: "#2f5bff", width: 6, dash: null };

  tools.forEach(function (tool) {
    tool.addEventListener("click", function () {
      tools.forEach(function (t) { t.classList.remove("is-active"); });
      tool.classList.add("is-active");
      inkState.color = tool.getAttribute("data-color") || "#2f5bff";
      inkState.width = parseInt(tool.getAttribute("data-width") || "6", 10);
      inkState.dash = tool.getAttribute("data-dash") || null;
      if (inkPath) {
        inkPath.setAttribute("stroke", inkState.color);
        inkPath.setAttribute("stroke-width", inkState.width);
        if (inkState.dash) { inkPath.setAttribute("stroke-dasharray", inkState.dash); }
        else { inkPath.removeAttribute("stroke-dasharray"); }
      }
      var stylus = document.getElementById("ba-stylus");
      if (stylus) {
        stylus.classList.remove("is-eraser");
        if (tool.getAttribute("data-tool") === "eraser") { stylus.classList.add("is-eraser"); }
      }
    });
  });
  if (tools.length) { tools[0].click(); }

  /* ---------------- Tablet app preview ---------------- */
  var tabletApps = document.querySelectorAll(".ba-tablet_app");
  tabletApps.forEach(function (app) {
    app.addEventListener("click", function () {
      tabletApps.forEach(function (a) { a.classList.remove("is-active"); });
      app.classList.add("is-active");
      var preview = app.getAttribute("data-preview");
      document.querySelectorAll("[data-preview-panel]").forEach(function (p) {
        p.classList.toggle("is-active", p.getAttribute("data-preview-panel") === preview);
      });
    });
  });
  if (tabletApps.length) { tabletApps[0].click(); }

  /* ---------------- Notebook paper-type switcher (item 5) ---------------- */
  var paperChoices = Array.prototype.slice.call(document.querySelectorAll(".ba-paper-choice"));
  var paperPreview = document.querySelector(".ba-notebook_paper");
  var coverValue = document.querySelector(".ba-cover-value");
  if (paperChoices.length && paperPreview) {
    paperChoices.forEach(function (ch) {
      ch.addEventListener("click", function () {
        var type = "";
        if (ch.classList.contains("ba-paper-choice-ruled")) type = "ruled";
        else if (ch.classList.contains("ba-paper-choice-grid")) type = "grid";
        else if (ch.classList.contains("ba-paper-choice-graph")) type = "graph";
        else if (ch.classList.contains("ba-paper-choice-blank")) type = "blank";
        paperPreview.classList.remove("is-ruled", "is-grid", "is-graph", "is-blank");
        paperPreview.classList.add("is-" + type);
        paperChoices.forEach(function (c) { c.classList.remove("is-active"); });
        ch.classList.add("is-active");
        if (coverValue) { coverValue.textContent = ch.querySelector("span").textContent; }
      });
    });
  }

  /* ---------------- 4 app icons fly into the tablet on scroll ---------------- */
  var oneDevice = document.getElementById("one-device");
  var floatWrap = document.querySelector(".ba-float-icons");
  if (oneDevice && floatWrap && hasGsap) {
    var ficons = Array.prototype.slice.call(floatWrap.querySelectorAll(".ba-float-icon"));
    var tabletCard = document.querySelector(".ba-one_card-tablet");
    var tabletScreen = tabletCard ? tabletCard.querySelector(".ba-tablet_screen") : null;
    var appBtns = tabletScreen ? Array.prototype.slice.call(tabletScreen.querySelectorAll(".ba-tablet_app")) : [];
    // Target: first 4 app buttons (Books, Notebooks, Timetable, Exams)
    var targets = appBtns.slice(0, 4);
    var starts = [{ x: -220, y: -160 }, { x: 220, y: -160 }, { x: -220, y: 160 }, { x: 220, y: 160 }];
    ficons.forEach(function (ic, i) { gsap.set(ic, { x: starts[i].x, y: starts[i].y, scale: 1, opacity: 1 }); });
    var flyTl = gsap.timeline({
      scrollTrigger: {
        trigger: oneDevice,
        start: "top 80%",
        end: "center 50%",
        scrub: 1.2
      }
    });
    ficons.forEach(function (ic, i) {
      // Phase 1: fly toward tablet center and shrink
      flyTl.to(ic, { x: 0, y: 0, scale: 0.4, ease: "power2.in", duration: 0.8 }, 0);
      // Hide label as it shrinks
      flyTl.to(ic.querySelector(".ba-float-label") || ic, { opacity: 0, duration: 0.2 }, 0.3);
      // Phase 2: fade out once it reaches the tablet
      flyTl.to(ic, { opacity: 0, ease: "power1.in", duration: 0.2 }, 0.85);
    });
    // Highlight the corresponding tablet app icons as icons land
    if (targets.length) {
      targets.forEach(function (btn, i) {
        var delay = 0.5 + i * 0.08;
        flyTl.to(btn, { scale: 1.15, boxShadow: "0 0 20px rgba(47,91,255,.3)", duration: 0.15 }, delay);
        flyTl.to(btn, { scale: 1, boxShadow: "none", duration: 0.2 }, delay + 0.15);
      });
    }
  }

  /* ---------------- FAQ ---------------- */
  document.querySelectorAll(".ba-faq_item").forEach(function (item) {
    var q = item.querySelector(".ba-faq_q");
    var a = item.querySelector(".ba-faq_a");
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");
      document.querySelectorAll(".ba-faq_item.is-open").forEach(function (i) {
        i.classList.remove("is-open");
        i.querySelector(".ba-faq_a").style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("is-open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ---------------- Demo form ---------------- */
  var form = document.getElementById("ba-demo-form");
  if (form) {
    var success = document.getElementById("ba-form-success");
    var fieldsWrap = form.querySelector(".ba-form-inline");
    var submitBtn = form.querySelector("button[type='submit']");
    var note = form.querySelector(".ba-form-note");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (fieldsWrap) fieldsWrap.style.display = "none";
      if (submitBtn) submitBtn.style.display = "none";
      if (note) note.style.display = "none";
      if (success) success.classList.add("is-visible");
    });
  }

  /* ---------------- Device Switcher (Download section) ---------------- */
  var switcher = document.getElementById("ba-device-switcher");
  if (switcher) {
    var tabs = switcher.querySelectorAll(".ba-device-tab");
    var panels = switcher.querySelectorAll(".ba-device-panel");

    /* Auto-detect device and select the right tab */
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 769;
    var defaultDevice = isMobile ? ( /iPad|iPod/.test(navigator.userAgent) ? "ios" : "android" ) : "laptop";

    /* On mobile, hide laptop tab entirely */
    var laptopTab = switcher.querySelector(".ba-device-tab-laptop");
    if (isMobile && laptopTab) laptopTab.style.display = "none";

    tabs.forEach(function (tab) {
      /* Skip laptop tab on mobile */
      if (isMobile && tab.classList.contains("ba-device-tab-laptop")) {
        tab.style.display = "none";
        return;
      }
      tab.addEventListener("click", function () {
        var device = this.getAttribute("data-device");
        tabs.forEach(function (t) { t.classList.remove("active"); });
        this.classList.add("active");
        panels.forEach(function (p) {
          p.classList.remove("active");
          if (p.getAttribute("data-panel") === device) p.classList.add("active");
        });
      });
    });

    /* Activate the default tab */
    var defaultTab = switcher.querySelector(".ba-device-tab[data-device='" + defaultDevice + "']");
    if (defaultTab && defaultTab.style.display !== "none") {
      defaultTab.click();
    }
  }

  /* ---------------- Redirect web.html on mobile ---------------- */
  if (window.location.pathname.indexOf("web.html") !== -1) {
    if (window.innerWidth < 1024) {
      window.location.replace("find-school.html#download");
    }
  }
})();