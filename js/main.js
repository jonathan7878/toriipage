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

  /* ---- Current year in footer ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Scroll-reveal: tag sections, then observe ---- */
  var revealEls = document.querySelectorAll(
    ".section, .stats-grid, .feature-card, .impact-item, .timeline li, .cta-inner, .partner-card, " +
    ".curric-card, .point-item, .testi-card, .principle-item, .roadmap-card, .ba-col"
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
