// GA4 tracking + recruiter action events + module engagement time (30/60/120 intent)
(function () {
  const MEASUREMENT_ID = "G-G86TZJHY3K";
  const SITE_HOST = "ralphpatrick.github.io";

  // Only skip if GA is already initialized AND gtag exists
  if (window.__ga4_loaded && typeof window.gtag === "function") return;
  window.__ga4_loaded = true;

  // Always create dataLayer + gtag function (even if gtag.js is blocked)
  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  // Load gtag.js (non-blocking)
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + MEASUREMENT_ID;
  document.head.appendChild(s);

  gtag("js", new Date());
  gtag("config", MEASUREMENT_ID);
  // =========================================
  // 1) ENTRY MODULE (the “hook”)
  // Fires once per session, on the first module page they land on
  // =========================================
  (function trackEntryModule() {
    const file = (location.pathname || "").split("/").pop() || "";
    const isModule = file.endsWith(".html") && file !== "index.html";
    if (!isModule) return;

    const key = "ga_entry_module";
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, file);
      gtag("event", "entry_module", { module: file });
    }
  })();

  // =========================================
  // 2) ROUTE TAKEN (portfolio flow)
  // Logs from -> to on every page load (same session)
  // =========================================
  (function trackNavFlow() {
    const to = (location.pathname || "") + (location.search || "");
    const from = sessionStorage.getItem("ga_prev_path") || "(entry)";
    gtag("event", "nav_flow", { from, to });

    // Set prev for the NEXT page
    sessionStorage.setItem("ga_prev_path", to);
  })();

  // =========================================
  // 3) SERIOUS INTENT (interactions inside modules)
  // Tracks when they touch controls (sliders, toggles, selects, inputs, buttons)
  // Dedupes per control so you don’t spam GA
  // =========================================
  (function trackModuleInteractions() {
    const file = (location.pathname || "").split("/").pop() || "";
    const isModule = file.endsWith(".html") && file !== "index.html";
    if (!isModule) return;

    const fired = new Set();

    function controlName(el) {
      return (
        el.getAttribute("data-ga") ||
        el.id ||
        el.name ||
        el.getAttribute("aria-label") ||
        (el.className && String(el.className).split(" ")[0]) ||
        el.tagName
      ).slice(0, 80);
    }

    function fire(el, action) {
      const name = controlName(el);
      const key = action + "|" + name;
      if (fired.has(key)) return;
      fired.add(key);

      gtag("event", "module_interaction", {
        module: file,
        action,            // "input" | "change" | "click"
        control: name
      });
    }

    // Sliders / number / text inputs (fires once per element)
    document.addEventListener("input", (e) => {
      const el = e.target;
      if (!el) return;
      if (el.matches && el.matches('input[type="range"], input[type="number"], input[type="text"]')) {
        fire(el, "input");
      }
    }, { passive: true });

    // Selects / checkboxes / radios / file upload
    document.addEventListener("change", (e) => {
      const el = e.target;
      if (!el) return;
      if (el.matches && el.matches("select, input[type='checkbox'], input[type='radio'], input[type='file']")) {
        fire(el, "change");
      }
    }, { passive: true });

    // Buttons (randomize / sample / reset / etc.)
    document.addEventListener("click", (e) => {
      const btn = e.target && e.target.closest ? e.target.closest("button") : null;
      if (!btn) return;
      fire(btn, "click");
    }, { passive: true });
  })();

  // =========================================
  // 4) SCROLL DEPTH (real engagement)
  // Fires once at 50% and 90% depth on module pages
  // =========================================
  (function trackScrollDepth() {
    const file = (location.pathname || "").split("/").pop() || "";
    const isModule = file.endsWith(".html") && file !== "index.html";
    if (!isModule) return;

    let fired50 = false;
    let fired90 = false;
    let ticking = false;

    function percent() {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const height = Math.max(doc.scrollHeight - doc.clientHeight, 1);
      return (scrollTop / height) * 100;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const p = percent();

        if (!fired50 && p >= 50) {
          fired50 = true;
          gtag("event", "module_scroll_50", { module: file });
        }
        if (!fired90 && p >= 90) {
          fired90 = true;
          gtag("event", "module_scroll_90", { module: file });
        }

        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  })();
  // =========================================
  // 5) Click tracking (modules + recruiter actions)
  // =========================================
  document.addEventListener("click", (e) => {
    const a = e.target && e.target.closest ? e.target.closest("a") : null;
    if (!a || typeof window.gtag !== "function") return;

    const href = (a.getAttribute("href") || "").trim();
    const text = (a.textContent || "").trim().slice(0, 80);

    // Email click
    if (href.startsWith("mailto:") || href.includes("/cdn-cgi/l/email-protection")) {
      gtag("event", "click_email", { link_url: href, link_text: text });
      return;
    }

    // Module open (internal .html pages) — supports relative OR absolute internal links
    const isHtml = href.endsWith(".html");
    const isInternalAbsolute = href.startsWith("http") && href.includes(SITE_HOST);
    const isInternalRelative = !href.startsWith("http");

    if (isHtml && (isInternalRelative || isInternalAbsolute)) {
      gtag("event", "open_module", { link_url: href, link_text: text });
      return;
    }

    // Outbound clicks
    const isExternal = href.startsWith("http") && !href.includes(SITE_HOST);
    if (isExternal) {
      const isLinkedIn = href.includes("linkedin.com");
      const isGitHub = href.includes("github.com");

      gtag("event", isLinkedIn ? "click_linkedin" : isGitHub ? "click_github" : "outbound_click", {
        link_url: href,
        link_text: text
      });
    }
  });

  // =========================================
  // 6) Module engagement time (TRUE engaged seconds)
  // Fires intent events at 30s / 60s / 120s
  // ONLY counts while tab is visible
  // =========================================
  (function trackModuleIntent() {
    const file = (location.pathname || "").split("/").pop() || "";
    const isModule = file.endsWith(".html") && file !== "index.html";
    if (!isModule || typeof window.gtag !== "function") return;

    const moduleName = file; // e.g., working-capital.html
    const marks = [
      { sec: 30, event: "module_intent_low" },
      { sec: 60, event: "module_intent_med" },
      { sec: 120, event: "module_intent_high" }
    ];

    let engagedSeconds = 0;
    const fired = new Set();
    let timerId = null;

    function tick() {
      if (document.visibilityState !== "visible") return;

      engagedSeconds += 1;

      for (const m of marks) {
        if (engagedSeconds >= m.sec && !fired.has(m.sec)) {
          fired.add(m.sec);

          // Generic "engaged" event (lets you graph engagement marks)
          gtag("event", "module_engaged", {
            module: moduleName,
            seconds_engaged: m.sec
          });

          // Tiered intent event (cleaner for key event)
          gtag("event", m.event, {
            module: moduleName,
            seconds_engaged: m.sec
          });
        }
      }

      // Stop after highest intent fires
      if (fired.has(120)) stop();
    }

    function start() {
      if (timerId) return;
      timerId = setInterval(tick, 1000);
    }

    function stop() {
      if (!timerId) return;
      clearInterval(timerId);
      timerId = null;
    }

    // Start immediately if visible
    if (document.visibilityState === "visible") start();

    // Pause/resume on tab visibility changes
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") start();
      else stop();
    });
  })();
})();

/* =========================================
   FP&A Portfolio — JS
   Minimal: mobile nav + reveal animations + back-to-top + footer year
   ========================================= */

/**
 * withStableScroll(fn)
 * ─────────────────────────────────────────
 * Root-cause fix for "view jump on data change":
 *
 * When Chart.js calls chart.destroy() + new Chart(), the browser's
 * scroll-anchoring algorithm detects DOM/layout changes and tries to
 * keep content visible — which snaps the viewport to the canvas area.
 * Same happens with large innerHTML replacements that shift layout.
 *
 * Strategy: capture scrollY BEFORE the update, let the browser paint,
 * then restore to the captured position via double-rAF (two frames
 * ensures the layout has fully settled before we correct).
 *
 * Usage:  withStableScroll(() => { myChart.destroy(); compute(); });
 */
window.withStableScroll = function withStableScroll(fn) {
  const scrollY = window.scrollY;
  fn();
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      if (Math.abs(window.scrollY - scrollY) > 2) {
        window.scrollTo({ top: scrollY, behavior: 'instant' });
      }
    });
  });
};

(function () {
  // Footer year
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector("[data-mobile-menu]");

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close on link click
    menu.addEventListener("click", (e) => {
      const target = e.target;
      if (target && target.classList && target.classList.contains("mobile-link")) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Reveal on scroll (IntersectionObserver)
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 }
    );

    revealEls.forEach((el) => io.observe(el));
  } else {
    // Fallback: show everything
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  // Back to top visibility
  const toTop = document.querySelector(".to-top");
  const onScroll = () => {
    if (!toTop) return;
    const show = window.scrollY > 650;
    toTop.classList.toggle("is-visible", show);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

// =========================================
// INDEX ENHANCEMENTS
// =========================================

// Hero full-width override: ensure hero--full uses single-column container
// (handled in CSS, no JS needed)

// Active nav link highlighting based on scroll position
(function () {
  var sections = ['start-here', 'pick-problem', 'projects', 'about', 'contact'];
  var navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

  if (!navLinks.length) return;

  function getActiveSection() {
    var scrollY = window.scrollY + 100;
    var active = '';
    for (var i = 0; i < sections.length; i++) {
      var el = document.getElementById(sections[i]);
      if (el && el.offsetTop <= scrollY) {
        active = sections[i];
      }
    }
    return active;
  }

  function updateNav() {
    var active = getActiveSection();
    navLinks.forEach(function (a) {
      var href = a.getAttribute('href') || '';
      var matches = href === '#' + active;
      if (matches) {
        a.style.color = 'var(--accent)';
        a.style.fontWeight = '650';
      } else {
        a.style.color = '';
        a.style.fontWeight = '';
      }
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
})();


// =========================================
// TOOLTIP ENGINE (shared)
// Usage: add data-tt="Your tooltip text" to any element (e.g., .help-icon)
// Then call initTooltips() once per page (safe to call multiple times).
// =========================================
(function () {
  if (window.initTooltips) return;

  function ensureRoot() {
    var el = document.getElementById("tt-root");
    if (!el) {
      el = document.createElement("div");
      el.id = "tt-root";
      el.setAttribute("role", "tooltip");
      el.setAttribute("aria-hidden", "true");
      document.body.appendChild(el);
    }
    return el;
  }

  window.initTooltips = function initTooltips() {
    var ttEl = ensureRoot();
    var hideTimer = null;
    var activeEl = null;
    var rafId = null;

    function position(targetEl) {
      if (!targetEl) return;
      var r = targetEl.getBoundingClientRect();
      // default: centered above the target
      var top = r.top + window.scrollY - 10;
      var left = r.left + window.scrollX + r.width / 2;

      ttEl.style.left = left + "px";
      ttEl.style.top = top + "px";
    }

    function show(text, targetEl) {
      clearTimeout(hideTimer);
      activeEl = targetEl;

      ttEl.textContent = text || "";
      ttEl.classList.add("tt-visible");
      ttEl.setAttribute("aria-hidden", "false");
      position(targetEl);
    }

    function hide() {
      hideTimer = setTimeout(function () {
        activeEl = null;
        ttEl.classList.remove("tt-visible");
        ttEl.setAttribute("aria-hidden", "true");
      }, 80);
    }

    function getText(el) {
      return (
        (el && (el.getAttribute("data-tt") || el.getAttribute("aria-label") || "")) ||
        ""
      );
    }

    // Delegate hover/focus to elements with data-tt
    document.addEventListener(
      "mouseover",
      function (e) {
        var t = e.target && e.target.closest && e.target.closest("[data-tt]");
        if (!t) return;
        show(getText(t), t);
      },
      true
    );

    document.addEventListener(
      "mouseout",
      function (e) {
        var t = e.target && e.target.closest && e.target.closest("[data-tt]");
        if (!t) return;
        hide();
      },
      true
    );

    document.addEventListener(
      "focusin",
      function (e) {
        var t = e.target && e.target.closest && e.target.closest("[data-tt]");
        if (!t) return;
        show(getText(t), t);
      },
      true
    );

    document.addEventListener(
      "focusout",
      function (e) {
        var t = e.target && e.target.closest && e.target.closest("[data-tt]");
        if (!t) return;
        hide();
      },
      true
    );

    // Reposition on scroll/resize (throttled)
    window.addEventListener(
      "scroll",
      function () {
        if (!activeEl || !ttEl.classList.contains("tt-visible")) return;
        if (rafId) return;
        rafId = requestAnimationFrame(function () {
          rafId = null;
          position(activeEl);
        });
      },
      { passive: true }
    );

    window.addEventListener(
      "resize",
      function () {
        if (!activeEl || !ttEl.classList.contains("tt-visible")) return;
        position(activeEl);
      },
      { passive: true }
    );

    // Tap/click support: tap toggles tooltip; tapping elsewhere hides
    document.addEventListener("click", function (e) {
      var t = e.target && e.target.closest && e.target.closest("[data-tt]");
      if (!t) {
        // click outside
        activeEl = null;
        ttEl.classList.remove("tt-visible");
        ttEl.setAttribute("aria-hidden", "true");
        return;
      }
      // click on a tooltip-enabled element
      if (activeEl === t && ttEl.classList.contains("tt-visible")) {
        activeEl = null;
        ttEl.classList.remove("tt-visible");
        ttEl.setAttribute("aria-hidden", "true");
      } else {
        show(getText(t), t);
      }
    });
  };
})();
