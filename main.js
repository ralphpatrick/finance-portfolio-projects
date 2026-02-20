// GA4 tracking + recruiter action events + module engagement time
(function () {
  const MEASUREMENT_ID = "G-G86TZJHY3K";

  if (window.__ga4_loaded) return;
  window.__ga4_loaded = true;

  // Load gtag.js
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + MEASUREMENT_ID;
  document.head.appendChild(s);

  // Init gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  gtag("js", new Date());
  gtag("config", MEASUREMENT_ID);

  // Track clicks (modules + outbound recruiter actions)
  document.addEventListener("click", (e) => {
    const a = e.target && e.target.closest ? e.target.closest("a") : null;
    if (!a || !window.gtag) return;

    const href = a.getAttribute("href") || "";
    const text = (a.textContent || "").trim().slice(0, 80);

    // Email click (mailto or Cloudflare email protection)
    if (href.startsWith("mailto:") || href.includes("/cdn-cgi/l/email-protection")) {
      gtag("event", "click_email", { link_url: href, link_text: text });
      return;
    }

    // Module open (internal .html pages)
    if (href.endsWith(".html")) {
      gtag("event", "open_module", { link_url: href, link_text: text });
      return;
    }

    // Outbound clicks (LinkedIn, GitHub, other)
    const isExternal = href.startsWith("http") && !href.includes("ralphpatrick.github.io");
    if (isExternal) {
      const isLinkedIn = href.includes("linkedin.com");
      const isGitHub = href.includes("github.com");

      gtag("event", isLinkedIn ? "click_linkedin" : isGitHub ? "click_github" : "outbound_click", {
        link_url: href,
        link_text: text
      });
    }
  });

  // Track time on module (fires at 30s, 60s, 120s while tab is active)
  (function trackTimeOnModule() {
    const path = location.pathname || "";
    const isModule = path.endsWith(".html") && !path.endsWith("index.html");
    if (!isModule || !window.gtag) return;

    const moduleName = path.split("/").pop(); // e.g., working-capital.html
    const marks = [30, 60, 120];
    const fired = new Set();

    function fire(seconds) {
      if (document.visibilityState !== "visible") return;
      if (fired.has(seconds)) return;
      fired.add(seconds);

      // Always record the raw engagement mark
      window.gtag("event", "module_engaged", {
        module: moduleName,
        seconds_engaged: seconds
      });

      // Intent tiers
      if (seconds >= 120) {
        window.gtag("event", "module_intent_high", { module: moduleName });
      } else if (seconds >= 60) {
        window.gtag("event", "module_intent_med", { module: moduleName });
      } else if (seconds >= 30) {
        window.gtag("event", "module_intent_low", { module: moduleName });
      }
    }

    marks.forEach((sec) => setTimeout(() => fire(sec), sec * 1000));
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
