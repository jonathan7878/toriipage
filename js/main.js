/* ============================================================
   Torii × Technical Hub — interactivity
   ============================================================ */
(function () {
  "use strict";

  /* ---- Mobile nav toggle ---- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("mainNav");

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    nav.querySelectorAll(".nav-item.open").forEach(function (it) {
      it.classList.remove("open");
      var t = it.querySelector(".nav-sub-toggle");
      if (t) t.setAttribute("aria-expanded", "false");
    });
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
  }

  /* ---- Dropdown sub-menus (click toggles; hover handled by CSS) ---- */
  document.querySelectorAll(".nav-sub-toggle").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var item = btn.closest(".nav-item");
      var willOpen = !item.classList.contains("open");
      // close sibling dropdowns
      document.querySelectorAll(".nav-item.open").forEach(function (other) {
        if (other !== item) {
          other.classList.remove("open");
          var ot = other.querySelector(".nav-sub-toggle");
          if (ot) ot.setAttribute("aria-expanded", "false");
        }
      });
      item.classList.toggle("open", willOpen);
      btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
  });

  /* close any open dropdown when clicking outside the nav */
  document.addEventListener("click", function (e) {
    if (nav && !nav.contains(e.target) && (!toggle || !toggle.contains(e.target))) {
      document.querySelectorAll(".nav-item.open").forEach(function (it) {
        it.classList.remove("open");
        var t = it.querySelector(".nav-sub-toggle");
        if (t) t.setAttribute("aria-expanded", "false");
      });
    }
  });

  /* ---- Image carousel (supports multiple instances) ---- */
  function initCarousel(root) {
    if (!root) return;
    var track = root.querySelector(".carousel-track");
    var slides = root.querySelectorAll(".carousel-slide");
    var dotsWrap = root.querySelector(".carousel-dots");
    var counter = root.querySelector(".carousel-counter");
    var n = slides.length, i = 0, timer = null;

    for (var d = 0; d < n; d++) {
      (function (idx) {
        var b = document.createElement("button");
        b.setAttribute("role", "tab");
        b.setAttribute("aria-label", "Go to slide " + (idx + 1));
        b.addEventListener("click", function () { go(idx); restart(); });
        dotsWrap.appendChild(b);
      })(d);
    }
    var dots = dotsWrap.querySelectorAll("button");

    function go(idx) {
      i = (idx + n) % n;
      track.style.transform = "translateX(" + (-i * 100) + "%)";
      dots.forEach(function (x, k) { x.classList.toggle("active", k === i); });
      if (counter) counter.textContent = (i + 1) + " / " + n;
    }
    function next() { go(i + 1); }
    function prev() { go(i - 1); }
    function play() { timer = setInterval(next, 5000); }
    function restart() { clearInterval(timer); play(); }

    root.querySelector(".next").addEventListener("click", function () { next(); restart(); });
    root.querySelector(".prev").addEventListener("click", function () { prev(); restart(); });
    root.addEventListener("mouseenter", function () { clearInterval(timer); });
    root.addEventListener("mouseleave", play);

    root.setAttribute("tabindex", "0");
    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { next(); restart(); }
      if (e.key === "ArrowLeft") { prev(); restart(); }
    });

    /* basic touch / swipe support */
    var x0 = null;
    root.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    root.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) { (dx < 0 ? next() : prev()); restart(); }
      x0 = null;
    });

    go(0); play();
  }

  document.querySelectorAll(".carousel").forEach(initCarousel);

  /* ---- Current year in footer ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Scroll-reveal: tag sections, then observe ---- */
  var revealEls = document.querySelectorAll(
    ".section, .stats-grid, .feature-card, .impact-item, .timeline li, .cta-inner, .partner-card, " +
    ".curric-card, .point-item, .testi-card, .principle-item, .roadmap-card, .ba-col, " +
    ".myna-table, .metric, .myna-callout"
  );
  revealEls.forEach(function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Animated counters ---- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1400, start = null;

    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);           // easeOutCubic
      var val = Math.round(target * eased);
      el.innerHTML = prefix + val + '<span class="u">' + suffix + "</span>";
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var counters = document.querySelectorAll(".stat-num");
  if ("IntersectionObserver" in window && counters.length) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          co.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(animateCount);
  }
})();
