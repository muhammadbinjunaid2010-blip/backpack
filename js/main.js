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

      /* ---------------- Bag scroll scene: cards enter the tablet ---------------- */
      var bagScene = document.querySelector(".ba-bag-scene");
      if (bagScene) {
        bagScene.classList.add("js-bag");
        var bagCards = Array.prototype.slice.call(bagScene.querySelectorAll(".ba-bag-card"));
        var bagSub = bagScene.querySelector("#ba-bag-sub");
        var bagListItems = Array.prototype.slice.call(bagScene.querySelectorAll("#ba-bag-list li"));
        var bagTakeaway = bagScene.querySelector("#ba-bag-takeaway");
        var bagTexts = [
          "Books become digital.",
          "Notebooks become digital.",
          "Stationery becomes digital.",
          "A complete digital schoolbag."
        ];
        var bagTl = gsap.timeline({
          scrollTrigger: {
            trigger: bagScene,
            start: "top top",
            end: "+=250%",
            scrub: 1,
            pin: true,
            anticipatePin: 1
          }
        });
        var bagPer = 1 / bagCards.length;
        bagCards.forEach(function (card) {
          gsap.set(card, { y: "46vh", scale: 1, autoAlpha: 1 });
        });
        bagCards.forEach(function (card, i) {
          var seg = i * bagPer;
          bagTl.fromTo(card, { y: "46vh", scale: 1, autoAlpha: 1 }, { y: "10vh", scale: 0.6, autoAlpha: 1, ease: "power1.inOut", duration: bagPer * 0.55 }, seg);
          bagTl.to(card, { scale: 0.16, autoAlpha: 0, ease: "power2.in", duration: bagPer * 0.45 }, seg + bagPer * 0.55);
          bagTl.call(function () { bagSub.style.opacity = 0; }, null, seg + bagPer * 0.08);
          bagTl.call(function (idx) {
            bagSub.textContent = bagTexts[idx];
            bagSub.style.opacity = 1;
            if (bagListItems[idx]) bagListItems[idx].classList.add("is-in");
          }, [i], seg + bagPer * 0.14);
        });
        bagTl.call(function () {
          bagSub.textContent = bagTexts[3];
          bagTakeaway.classList.add("is-visible");
        }, null, 0.985);
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
})();