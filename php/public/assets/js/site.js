/*
 * AAK site behaviour for the PHP build. Plain JavaScript, no build step.
 * Each feature looks for its own data-* hooks and does nothing when the
 * page doesn't have them. Mirrors the React components in src/.
 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var root = document.documentElement;

  /* Header ------------------------------------------------------------ */
  function initHeader() {
    var header = $("[data-header]");
    if (!header) return;

    // Publish the live header height for sticky bars (register strip, Spotlight).
    var setHeight = function () { root.style.setProperty("--header-h", header.offsetHeight + "px"); };
    if ("ResizeObserver" in window) new ResizeObserver(setHeight).observe(header);
    setHeight();

    // Shrink once scrolled, and fill the reading-progress bar.
    var progress = $("[data-progress]", header);
    var frame = null;
    var update = function () {
      frame = null;
      var max = root.scrollHeight - window.innerHeight;
      if (window.scrollY > 80) header.setAttribute("data-scrolled", "");
      else header.removeAttribute("data-scrolled");
      if (progress) progress.style.transform = "scaleX(" + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ")";
    };
    var onScroll = function () { if (frame === null) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    // Mega menus: open on hover/focus/click, close after a short delay on
    // leaving the bar, on Esc or on a click outside.
    var nav = $("[data-nav]", header);
    var triggers = $$("[data-menu-trigger]", header);
    var active = null;
    var closeTimer = null;
    var setMenu = function (label) {
      active = label;
      triggers.forEach(function (t) { t.setAttribute("aria-expanded", String(t.dataset.menuTrigger === label)); });
      $$("[data-menu-panel]", header).forEach(function (p) { p.hidden = p.dataset.menuPanel !== label; });
    };
    var cancelClose = function () { if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; } };
    var openMenu = function (label) { cancelClose(); setMenu(label); };
    var closeNow = function () { cancelClose(); setMenu(null); };
    triggers.forEach(function (t) {
      var label = t.dataset.menuTrigger;
      t.addEventListener("mouseenter", function () { openMenu(label); });
      t.addEventListener("focus", function () { openMenu(label); });
      t.addEventListener("click", function () { active === label ? closeNow() : openMenu(label); });
    });
    if (nav) {
      nav.addEventListener("mouseleave", function () { closeTimer = setTimeout(function () { setMenu(null); }, 150); });
      nav.addEventListener("mouseenter", cancelClose);
    }
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && active) closeNow(); });
    document.addEventListener("mousedown", function (e) { if (active && nav && !nav.contains(e.target)) closeNow(); });
    $$("[data-menu-panel] a", header).forEach(function (a) { a.addEventListener("click", closeNow); });

    // Full-screen mobile menu with a focus trap.
    var panel = $("#mobile-nav");
    var toggle = $("[data-mobile-toggle]", header);
    if (!panel || !toggle) return;
    var focusables = function () { return $$("a[href], button:not([disabled]), summary", panel); };
    var onKey = function (e) {
      if (e.key === "Escape") return setMobile(false);
      if (e.key !== "Tab") return;
      var items = focusables();
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    var setMobile = function (open) {
      panel.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
      if (open) {
        document.addEventListener("keydown", onKey);
        var items = focusables();
        (items[1] || items[0]).focus();
      } else {
        document.removeEventListener("keydown", onKey);
        toggle.focus();
      }
    };
    toggle.addEventListener("click", function () { setMobile(panel.hidden); });
    $("[data-mobile-close]", panel).addEventListener("click", function () { setMobile(false); });
    $$("a", panel).forEach(function (a) { a.addEventListener("click", function () { setMobile(false); }); });
  }

  /* Scroll reveal ----------------------------------------------------- */
  function initReveal() {
    var els = $$("[data-reveal]");
    var show = function (el) {
      el.classList.add("reveal-in");
      if (el.classList.contains("rule-draw")) el.classList.add("rule-draw-in");
      var wipe = el.querySelector(":scope > .wipe");
      if (wipe) wipe.classList.add("wipe-in");
    };
    if (!("IntersectionObserver" in window)) return els.forEach(show);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { show(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px 80px 0px" });
    els.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) show(el);
      else io.observe(el);
    });
  }

  /* Count-up numbers -------------------------------------------------- */
  function initCountUp() {
    var els = $$("[data-countup]");
    if (reduceMotion || !els.length || !("IntersectionObserver" in window)) return;
    var ease = function (t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        var el = entry.target;
        var value = Number(el.dataset.countup);
        var grouped = el.hasAttribute("data-grouped");
        var start = performance.now();
        var tick = function (now) {
          var p = Math.min((now - start) / 1400, 1);
          var n = Math.round(value * ease(p));
          el.textContent = grouped ? n.toLocaleString("en-GB") : String(n);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* Countdowns ("Starts in 11d 4h") ----------------------------------- */
  function initCountdowns() {
    var els = $$("[data-countdown]");
    if (!els.length) return;
    var parse = function (iso) { return new Date(iso.length === 10 ? iso + "T00:00:00Z" : iso).getTime(); };
    var render = function () {
      var now = Date.now();
      els.forEach(function (el) {
        var target = parse(el.dataset.countdown);
        var end = parse(el.dataset.countdownEnd || el.dataset.countdown);
        if (now > end) { el.hidden = true; return; }
        el.hidden = false;
        if (now >= target) {
          el.innerHTML = '<span class="pulse-dot mr-1.5 inline-block h-1.5 w-1.5 bg-primary align-middle"></span>Happening now';
          return;
        }
        var s = Math.floor((target - now) / 1000);
        var d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60);
        el.textContent = "Starts in " + (d > 0 ? d + "d " + h + "h" : h > 0 ? h + "h " + m + "m" : m + "m");
      });
    };
    render();
    setInterval(render, 60000);
  }

  /* Sticky register strip: share its height with other sticky elements. */
  function initRegisterStrip() {
    var el = $("[data-register-sticky]");
    if (!el || !("ResizeObserver" in window)) return;
    new ResizeObserver(function () {
      var stuck = getComputedStyle(el).position === "sticky";
      root.style.setProperty("--register-h", (stuck ? el.offsetHeight : 0) + "px");
    }).observe(el);
  }

  /* Auto-advancing rails (src/hooks/use-auto-rail.ts) ------------------ */
  function initRails() {
    $$("[data-rail]").forEach(function (el) {
      var name = el.dataset.rail;
      var seamless = el.hasAttribute("data-rail-seamless");
      var interval = Number(el.dataset.railInterval || 4500);
      var busy = { hover: false, focus: false, touch: false, hidden: false, offscreen: true };
      var behavior = reduceMotion ? "auto" : "smooth";

      var step = function (dir) {
        if (el.scrollWidth <= el.clientWidth + 4) return;
        var max = el.scrollWidth - el.clientWidth;
        var items = Array.prototype.slice.call(el.children);
        var origin = items[0] ? items[0].offsetLeft : 0;
        var lefts = items.map(function (item) { return item.offsetLeft - origin; });
        if (seamless) {
          var period = lefts[items.length / 2] || 0;
          if (period > 0) {
            if (dir === 1 && el.scrollLeft >= period - 4) el.scrollTo({ left: el.scrollLeft - period, behavior: "auto" });
            if (dir === -1 && el.scrollLeft <= 4) el.scrollTo({ left: el.scrollLeft + period, behavior: "auto" });
            var at = el.scrollLeft;
            var target = dir === 1
              ? lefts.find(function (l) { return l > at + 4; })
              : lefts.slice().reverse().find(function (l) { return l < at - 4; });
            el.scrollTo({ left: Math.max(0, Math.min(target || 0, max)), behavior: behavior });
            return;
          }
        }
        if (dir === 1) {
          if (el.scrollLeft >= max - 4) return el.scrollTo({ left: 0, behavior: behavior });
          var next = lefts.find(function (l) { return l > el.scrollLeft + 4; });
          el.scrollTo({ left: Math.min(next === undefined ? max : next, max), behavior: behavior });
        } else {
          if (el.scrollLeft <= 4) return el.scrollTo({ left: max, behavior: behavior });
          var prev = lefts.slice().reverse().find(function (l) { return l < el.scrollLeft - 4; });
          el.scrollTo({ left: Math.max(prev || 0, 0), behavior: behavior });
        }
      };

      $$('[data-rail-next="' + name + '"]').forEach(function (b) { b.addEventListener("click", function () { step(1); }); });
      $$('[data-rail-prev="' + name + '"]').forEach(function (b) { b.addEventListener("click", function () { step(-1); }); });

      if (seamless) {
        // A visitor swiping into the second copy is moved back to the same card.
        var settle;
        el.addEventListener("scroll", function () {
          clearTimeout(settle);
          settle = setTimeout(function () {
            var items = el.children;
            var mid = items[items.length / 2];
            var period = mid ? mid.offsetLeft - items[0].offsetLeft : 0;
            if (period > 0 && el.scrollLeft >= period - 2) el.scrollTo({ left: el.scrollLeft - period, behavior: "auto" });
          }, 180);
        }, { passive: true });
      }

      if (reduceMotion) return;
      var touchTimer;
      el.addEventListener("pointerenter", function () { busy.hover = true; });
      el.addEventListener("pointerleave", function () { busy.hover = false; });
      el.addEventListener("focusin", function () { busy.focus = true; });
      el.addEventListener("focusout", function (e) { if (!el.contains(e.relatedTarget)) busy.focus = false; });
      el.addEventListener("touchstart", function () { busy.touch = true; clearTimeout(touchTimer); }, { passive: true });
      el.addEventListener("touchend", function () {
        clearTimeout(touchTimer);
        touchTimer = setTimeout(function () { busy.touch = false; }, 6000);
      }, { passive: true });
      document.addEventListener("visibilitychange", function () { busy.hidden = document.visibilityState !== "visible"; });
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) { busy.offscreen = !entries[0].isIntersecting; }, { threshold: 0.4 }).observe(el);
      }
      setInterval(function () {
        if (busy.hover || busy.focus || busy.touch || busy.hidden || busy.offscreen) return;
        step(1);
      }, interval);
    });
  }

  /* Parallax drift (src/hooks/use-scroll-parallax.tsx) ----------------- */
  function initParallax() {
    if (reduceMotion) return;
    $$("[data-parallax]").forEach(function (box) {
      var strength = Number(box.dataset.parallax) || 24;
      var target = $("[data-parallax-target]", box);
      if (!target) return;
      var frame = null;
      var update = function () {
        frame = null;
        var r = box.getBoundingClientRect();
        var progress = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
        target.style.transform = "translateY(" + (progress * strength - strength) + "px)";
      };
      var onScroll = function () { if (frame === null) frame = requestAnimationFrame(update); };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      update();
    });
  }

  /* Statement morph (src/components/home/Statement.tsx) --------------- */
  function initStatement() {
    var track = $("[data-statement]");
    if (!track) return;
    if (reduceMotion) {
      var tpl = $("template[data-statement-static]");
      if (tpl) track.replaceWith(tpl.content.cloneNode(true));
      return;
    }
    var frame = null;
    var last = -1;
    var update = function () {
      frame = null;
      var r = track.getBoundingClientRect();
      var span = r.height - window.innerHeight;
      var p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      if (p === last) return;
      last = p;
      track.style.setProperty("--p", p.toFixed(4));
    };
    var onScroll = function () { if (frame === null) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  /* Chapters hover index ---------------------------------------------- */
  function initChapterIndex() {
    var box = $("[data-chapter-index]");
    if (!box) return;
    var info = JSON.parse($("[data-chapter-data]", box).textContent);
    var items = $$("[data-chapter-item]", box);
    var photos = $$("[data-chapter-photo]", box);
    var set = function (i) {
      items.forEach(function (el) { el.dataset.active = String(Number(el.dataset.chapterItem) === i); });
      photos.forEach(function (el) { el.dataset.active = String(Number(el.dataset.chapterPhoto) === i); });
      $("[data-chapter-num]", box).textContent = String(i + 1).padStart(2, "0");
      $("[data-chapter-name]", box).textContent = info[i].name;
      $("[data-chapter-tagline]", box).textContent = info[i].tagline;
    };
    items.forEach(function (el) {
      var i = Number(el.dataset.chapterItem);
      el.addEventListener("mouseenter", function () { set(i); });
      el.addEventListener("focus", function () { set(i); });
    });
  }

  /* Membership picker (ChapterPicker.tsx) ------------------------------ */
  function initPicker() {
    var box = $("[data-picker]");
    if (!box) return;
    var d = JSON.parse($("[data-picker-data]", box).textContent);
    var chapter = null, stage = null;
    var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
    var render = function () {
      $$("[data-picker-chapter]", box).forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.pickerChapter === chapter)); });
      $$("[data-picker-stage]", box).forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.pickerStage === stage)); });
      var c = d.chapters.find(function (x) { return x.slug === chapter; });
      var s = d.stages.find(function (x) { return x.id === stage; });
      $("[data-picker-empty]", box).hidden = !!(c && s);
      $("[data-picker-result]", box).hidden = !(c && s);
      if (!(c && s)) return;
      var fees = d.fees.filter(function (f) { return s.categories.indexOf(f.category) !== -1; });
      $("[data-picker-name]", box).textContent = c.name + " Chapter";
      $("[data-picker-tagline]", box).textContent = c.tagline;
      $("[data-picker-fees]", box).innerHTML = fees.map(function (f) {
        return '<div class="flex flex-wrap justify-between gap-x-4"><dt class="font-semibold">' + esc(f.category) + ' member</dt>' +
          '<dd class="text-muted-foreground">Entrance ' + (f.entrance === "None" ? "none" : "KES " + esc(f.entrance)) +
          ' &middot; Annual KES ' + esc(f.annual) + "</dd></div>";
      }).join("");
      $("[data-picker-note]", box).hidden = fees.length < 2;
    };
    $$("[data-picker-chapter]", box).forEach(function (b) { b.addEventListener("click", function () { chapter = b.dataset.pickerChapter; render(); }); });
    $$("[data-picker-stage]", box).forEach(function (b) { b.addEventListener("click", function () { stage = b.dataset.pickerStage; render(); }); });
  }

  /* Floating section index --------------------------------------------- */
  function initSectionIndicator() {
    var nav = $("[data-section-indicator]");
    if (!nav) return;
    var rules = $$("main [data-section-index]");
    if (!rules.length) return;
    var list = $("[data-section-list]", nav);
    var toggle = $("[data-section-toggle]", nav);
    var footer = $("main ~ footer");
    var current = -1;
    $("[data-section-total]", nav).textContent = "/ " + String(rules.length).padStart(2, "0");
    list.innerHTML = rules.map(function (el, i) {
      return '<li><button type="button" data-jump="' + i + '" class="flex w-full items-baseline gap-3 px-4 py-2 text-left text-sm text-background/85 transition-colors hover:bg-background/10 aria-[current=location]:text-[oklch(0.75_0.13_38.5)]">' +
        '<span class="meta-label w-6">' + el.dataset.sectionIndex + "</span>" + el.dataset.sectionLabel + "</button></li>";
    }).join("");
    var setOpen = function (open) { list.hidden = !open; toggle.setAttribute("aria-expanded", String(open)); };
    toggle.addEventListener("click", function () { setOpen(list.hidden); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
    $$("[data-jump]", list).forEach(function (b) {
      b.addEventListener("click", function () {
        var el = rules[Number(b.dataset.jump)];
        var css = getComputedStyle(root);
        var offset = (parseFloat(css.getPropertyValue("--header-h")) || 86) + (parseFloat(css.getPropertyValue("--register-h")) || 0) + 24;
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: reduceMotion ? "auto" : "smooth" });
        setOpen(false);
      });
    });
    var frame = null;
    var update = function () {
      frame = null;
      var line = window.innerHeight * 0.45;
      var idx = -1;
      rules.forEach(function (el, i) { if (el.getBoundingClientRect().top < line) idx = i; });
      var hidden = idx < 0 || (footer ? footer.getBoundingClientRect().top < window.innerHeight * 0.6 : false);
      nav.dataset.visible = String(!hidden);
      if (hidden) { nav.setAttribute("inert", ""); setOpen(false); } else nav.removeAttribute("inert");
      if (idx === current) return;
      current = idx;
      var cur = rules[Math.max(idx, 0)];
      $("[data-section-current-index]", nav).textContent = cur.dataset.sectionIndex;
      $("[data-section-current-label]", nav).textContent = cur.dataset.sectionLabel;
      $$("[data-jump]", list).forEach(function (b, i) {
        if (i === idx) b.setAttribute("aria-current", "location"); else b.removeAttribute("aria-current");
      });
    };
    var onScroll = function () { if (frame === null) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  /* Lightbox ------------------------------------------------------------ */
  function initLightbox() {
    var dialog = $("[data-lightbox]");
    if (!dialog || typeof dialog.showModal !== "function") return;
    var items = [];
    var index = 0;
    var show = function (i) {
      index = (i + items.length) % items.length;
      var it = items[index].dataset;
      var img = $("[data-lightbox-img]", dialog);
      img.src = it.lightboxImage;
      img.alt = it.lightboxTitle;
      $("[data-lightbox-meta-out]", dialog).textContent = it.lightboxMeta || "";
      $("[data-lightbox-title-out]", dialog).textContent = it.lightboxTitle || "";
      $("[data-lightbox-caption-out]", dialog).textContent = it.lightboxCaption || "";
      var link = $("[data-lightbox-link]", dialog);
      link.hidden = !it.lightboxHref;
      if (it.lightboxHref) {
        link.href = it.lightboxHref;
        $("[data-lightbox-link-label]", dialog).textContent = it.lightboxHrefLabel || "View";
      }
    };
    document.addEventListener("click", function (e) {
      var item = e.target.closest && e.target.closest("[data-lightbox-item]");
      if (!item) return;
      var group = item.closest("[data-lightbox-group]");
      items = group ? $$("[data-lightbox-item]", group) : [item];
      show(items.indexOf(item));
      dialog.showModal();
    });
    $("[data-lightbox-prev]", dialog).addEventListener("click", function () { show(index - 1); });
    $("[data-lightbox-next]", dialog).addEventListener("click", function () { show(index + 1); });
    $("[data-lightbox-close]", dialog).addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (e) { if (e.target === dialog || e.target === dialog.firstElementChild) dialog.close(); });
    dialog.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); show(index - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); show(index + 1); }
    });
    var start = null;
    dialog.addEventListener("touchstart", function (e) { var t = e.touches[0]; start = t ? { x: t.clientX, y: t.clientY } : null; }, { passive: true });
    dialog.addEventListener("touchend", function (e) {
      var t = e.changedTouches[0];
      if (!start || !t) return;
      var dx = t.clientX - start.x, dy = t.clientY - start.y;
      start = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(index + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  /* "Show all / Show fewer" lists ([data-expand] toggles [data-expandable]) */
  function initExpanders() {
    $$("[data-expand]").forEach(function (button) {
      var list = $('[data-expandable="' + button.dataset.expand + '"]');
      if (!list) return;
      var label = $("[data-expand-label]", button);
      button.addEventListener("click", function () {
        var open = button.getAttribute("aria-expanded") !== "true";
        $$("[data-extra]", list).forEach(function (el) { el.hidden = !open; });
        button.setAttribute("aria-expanded", String(open));
        if (label) label.textContent = open ? button.dataset.labelLess : button.dataset.labelMore;
      });
    });
  }

  /* Click-to-load map (ClickToLoadMap.tsx): no Google request until asked. */
  function initMaps() {
    $$("[data-map]").forEach(function (box) {
      var button = $("[data-map-load]", box);
      if (!button) return;
      button.addEventListener("click", function () {
        var frame = document.createElement("iframe");
        frame.src = box.dataset.map;
        frame.title = box.dataset.mapTitle || "Map";
        frame.referrerPolicy = "no-referrer-when-downgrade";
        frame.className = "h-full w-full border-0";
        box.replaceWith(frame);
      });
    });
  }

  var ready = function () {
    initExpanders();
    initMaps();
    initHeader();
    initStatement(); // before reveal: may swap in the static version
    initReveal();
    initCountUp();
    initCountdowns();
    initRegisterStrip();
    initRails();
    initParallax();
    initChapterIndex();
    initPicker();
    initSectionIndicator();
    initLightbox();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready);
  else ready();
})();
