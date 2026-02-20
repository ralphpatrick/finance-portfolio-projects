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
  // Click tracking (modules + recruiter actions)
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

    // Module open (internal .html pages)
    if (href.endsWith(".html") && !href.startsWith("http")) {
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
  // Module engagement time (TRUE engaged seconds)
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
