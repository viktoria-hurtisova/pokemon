(function () {
  "use strict";

  function prefersReducedMotion() {
    return (
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function ensureStyles() {
    if (document.getElementById("scroll-top-style")) return;
    const style = document.createElement("style");
    style.id = "scroll-top-style";
    style.textContent = `
      .scroll-top-btn{
        position: fixed;
        right: 18px;
        bottom: 18px;
        width: 48px;
        height: 48px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.16);
        background: rgba(22,33,62,.92);
        color: #e8eef5;
        display: grid;
        place-items: center;
        cursor: pointer;
        box-shadow: 0 10px 26px rgba(0,0,0,.38);
        opacity: 0;
        transform: translateY(10px);
        pointer-events: none;
        transition: opacity .18s ease, transform .18s ease, background .18s ease, border-color .18s ease;
        z-index: 9998;
        -webkit-tap-highlight-color: transparent;
      }
      .scroll-top-btn:hover{
        background: rgba(45,74,111,.95);
        border-color: rgba(126,200,227,.55);
      }
      .scroll-top-btn:active{
        transform: translateY(10px) scale(.98);
      }
      .scroll-top-btn.is-visible{
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }
      .scroll-top-btn:focus{
        outline: none;
      }
      .scroll-top-btn:focus-visible{
        outline: 2px solid rgba(126,200,227,.85);
        outline-offset: 3px;
      }
      .scroll-top-btn svg{
        width: 22px;
        height: 22px;
        display: block;
      }
      @media print{
        .scroll-top-btn{ display:none !important; }
      }
    `;
    document.head.appendChild(style);
  }

  function createButton() {
    if (document.getElementById("scroll-top-btn")) return null;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = "scroll-top-btn";
    btn.className = "scroll-top-btn";
    btn.setAttribute("aria-label", "Scroll to top");
    btn.innerHTML =
      "<svg viewBox='0 0 24 24' aria-hidden='true' focusable='false'>" +
      "<path d='M12 5l-7 7 1.4 1.4L11 8.8V20h2V8.8l4.6 4.6L19 12z' fill='currentColor'/>" +
      "</svg>";

    btn.addEventListener("click", function () {
      const behavior = prefersReducedMotion() ? "auto" : "smooth";
      window.scrollTo({ top: 0, left: 0, behavior });
    });

    document.body.appendChild(btn);
    return btn;
  }

  function setup() {
    ensureStyles();
    const btn = createButton();
    if (!btn) return;

    const SHOW_AFTER_PX = 240;
    let raf = 0;

    function updateVisibility() {
      raf = 0;
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      btn.classList.toggle("is-visible", y > SHOW_AFTER_PX);
    }

    function onScroll() {
      if (raf) return;
      raf = window.requestAnimationFrame(updateVisibility);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateVisibility();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup);
  } else {
    setup();
  }
})();

