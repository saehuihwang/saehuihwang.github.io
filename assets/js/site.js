/* =========================================================
   Site behaviour.
   Everything here is progressive enhancement: the page is
   complete and navigable with JS disabled. All motion is
   gated on prefers-reduced-motion.
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Theme toggle ---------- */
  function initTheme() {
    var btn = document.getElementById("theme-toggler");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* ---------- Header state on scroll ---------- */
  function initHeader() {
    var body = document.body;
    var ticking = false;
    function update() {
      body.classList.toggle("is-scrolled", window.scrollY > 24);
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------- Mobile navigation ---------- */
  function initNav() {
    var btn = document.querySelector(".nav-toggle");
    var nav = document.getElementById("site-nav");
    if (!btn || !nav) return;

    function close() {
      btn.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    }

    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") {
        close();
        btn.focus();
      }
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest(".nav__link")) close();
    });
  }

  /* ---------- Table of contents ----------
     Built from the article's own headings so nothing has to be
     maintained by hand. Hidden entirely when there are fewer
     than two headings to link to. */
  function initToc() {
    var source = document.querySelector("[data-toc-source]");
    var targets = document.querySelectorAll("[data-toc-list]");
    if (!source || !targets.length) return;

    var headings = [].slice.call(source.querySelectorAll("h2[id], h3[id]"));
    if (headings.length < 2) {
      Array.prototype.forEach.call(document.querySelectorAll("[data-toc]"), function (el) {
        el.hidden = true;
      });
      return;
    }

    var html = headings.map(function (h) {
      var level = h.tagName === "H3" ? "3" : "2";
      var text = (h.textContent || "").trim();
      var span = document.createElement("span");
      span.textContent = text;
      return '<a class="toc__link toc__link--' + level + '" href="#' + h.id + '">' +
             span.innerHTML + "</a>";
    }).join("");

    Array.prototype.forEach.call(targets, function (list) { list.innerHTML = html; });

    var links = [].slice.call(document.querySelectorAll(".toc__link"));
    function setActive(id) {
      links.forEach(function (a) {
        if (a.getAttribute("href") === "#" + id) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    }

    if (!("IntersectionObserver" in window)) return;
    var visible = {};
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visible[entry.target.id] = entry.boundingClientRect.top;
        else delete visible[entry.target.id];
      });
      var best = null, bestTop = Infinity;
      Object.keys(visible).forEach(function (id) {
        if (visible[id] < bestTop) { bestTop = visible[id]; best = id; }
      });
      if (best) setActive(best);
    }, { rootMargin: "-90px 0px -65% 0px", threshold: 0 });

    headings.forEach(function (h) { observer.observe(h); });
  }

  /* ---------- Horizontal carousels ---------- */
  function initCarousels() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-carousel]"), function (root) {
      var track = root.querySelector("[data-carousel-track]");
      var prev  = root.querySelector("[data-carousel-prev]");
      var next  = root.querySelector("[data-carousel-next]");
      var nav   = root.querySelector("[data-carousel-nav]");
      if (!track) return;

      function step() {
        var card = track.firstElementChild;
        if (!card) return track.clientWidth * 0.8;
        var gap = parseFloat(getComputedStyle(track).columnGap || "0") || 0;
        return card.getBoundingClientRect().width + gap;
      }

      function sync() {
        var max = track.scrollWidth - track.clientWidth;
        if (prev) prev.disabled = track.scrollLeft <= 2;
        if (next) next.disabled = track.scrollLeft >= max - 2;
        if (nav) nav.hidden = max <= 2;
      }

      function go(dir) {
        track.scrollBy({ left: dir * step(), behavior: reduceMotion ? "auto" : "smooth" });
      }

      if (prev) prev.addEventListener("click", function () { go(-1); });
      if (next) next.addEventListener("click", function () { go(1); });
      track.addEventListener("scroll", function () { window.requestAnimationFrame(sync); }, { passive: true });
      window.addEventListener("resize", sync);
      sync();
    });
  }

  /* ---------- Image galleries (dot indicators) ---------- */
  function initGalleries() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-gallery]"), function (root) {
      var track = root.querySelector("[data-gallery-track]");
      var dots  = [].slice.call(root.querySelectorAll("[data-gallery-dot]"));
      if (!track || !dots.length) return;

      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
          var slide = track.children[i];
          if (slide) {
            track.scrollTo({
              left: slide.offsetLeft - track.offsetLeft,
              behavior: reduceMotion ? "auto" : "smooth"
            });
          }
        });
      });

      track.addEventListener("scroll", function () {
        window.requestAnimationFrame(function () {
          var mid = track.scrollLeft + track.clientWidth / 2;
          var active = 0;
          [].slice.call(track.children).forEach(function (slide, i) {
            if (slide.offsetLeft - track.offsetLeft <= mid) active = i;
          });
          dots.forEach(function (d, i) {
            if (i === active) d.setAttribute("aria-current", "true");
            else d.removeAttribute("aria-current");
          });
        });
      }, { passive: true });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(items, function (el) { el.classList.add("is-revealed"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

    Array.prototype.forEach.call(items, function (el, i) {
      el.style.setProperty("--reveal-delay", (i % 4) * 70 + "ms");
      observer.observe(el);
    });
  }

  function init() {
    initTheme();
    initHeader();
    initNav();
    initToc();
    initCarousels();
    initGalleries();
    initReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
