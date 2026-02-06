/* =========================================
   FP&A Portfolio — JS
   Minimal: mobile nav + reveal animations + back-to-top + footer year
   ========================================= */

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
