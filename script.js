(() => {
  "use strict";

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile navigation ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");

  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
  };

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  /* ---------- Highlight the nav link for the section in view ---------- */
  const links = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) =>
            link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`)
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
  }

  /* ---------- Interactive RC low-pass filter ---------- */
  const rSlider = document.getElementById("r-slider");
  const cSlider = document.getElementById("c-slider");
  const rLabel = document.getElementById("r-label");
  const cLabel = document.getElementById("c-label");
  const fcOut = document.getElementById("fc-out");

  // Format a value with an SI prefix, e.g. 4700 -> "4.7 k"
  const si = (value) => {
    const prefixes = [
      [1e9, "G"], [1e6, "M"], [1e3, "k"], [1, ""],
      [1e-3, "m"], [1e-6, "µ"], [1e-9, "n"], [1e-12, "p"],
    ];
    const [scale, prefix] = prefixes.find(([s]) => Math.abs(value) >= s) || prefixes[prefixes.length - 1];
    const scaled = value / scale;
    const digits = scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2;
    return `${parseFloat(scaled.toFixed(digits))} ${prefix}`;
  };

  const updateFilter = () => {
    const R = Math.pow(10, parseFloat(rSlider.value)); // ohms, 100 Ω to 100 kΩ
    const C = Math.pow(10, parseFloat(cSlider.value)); // farads, 1 nF to 10 µF
    const fc = 1 / (2 * Math.PI * R * C);

    rLabel.textContent = `R1 = ${si(R)}Ω`;
    cLabel.textContent = `C1 = ${si(C)}F`;
    fcOut.textContent = `${si(fc)}Hz`;

    rSlider.setAttribute("aria-valuetext", `${si(R)}ohms`);
    cSlider.setAttribute("aria-valuetext", `${si(C)}farads`);
  };

  if (rSlider && cSlider) {
    rSlider.addEventListener("input", updateFilter);
    cSlider.addEventListener("input", updateFilter);
    updateFilter();
  }
})();