(() => {
  "use strict";

  const header = document.querySelector(".site-header");
  const hero = document.querySelector(".hero");
  const toggle = document.querySelector(".menu-toggle");
  const navList = document.getElementById("nav-list");
  const mobileMenu = window.matchMedia("(max-width: 1179px)");

  /* ---------- Cabeçalho: sólido depois do hero ---------- */
  if (hero && "IntersectionObserver" in window) {
    new IntersectionObserver(
      ([entry]) => header.classList.toggle("is-scrolled", !entry.isIntersecting),
      { rootMargin: `-${header.offsetHeight}px 0px 0px 0px`, threshold: 0.02 }
    ).observe(hero);
  }

  /* ---------- Menu mobile ---------- */
  const setMenu = (open) => {
    header.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    document.body.classList.toggle("is-locked", open);
  };
  toggle.addEventListener("click", () => setMenu(!header.classList.contains("is-open")));
  navList.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && header.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });
  mobileMenu.addEventListener("change", (e) => {
    if (!e.matches) setMenu(false);
  });

  /* ---------- Link ativo no menu ---------- */
  const navLinks = [...navList.querySelectorAll('a[href^="#"]')];
  const sections = navLinks.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = `#${entry.target.id}`;
          navLinks.forEach((a) =>
            a.getAttribute("href") === id ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Revelação ao rolar ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Modais das áreas ---------- */
  let lastTrigger = null;
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-dialog]");
    if (trigger) {
      const dlg = document.getElementById(trigger.dataset.dialog);
      if (!dlg || typeof dlg.showModal !== "function") return;
      lastTrigger = trigger;
      dlg.showModal();
      dlg.querySelector(".modal-body").scrollTop = 0;
      document.body.classList.add("is-locked");
      return;
    }
    if (e.target.closest("[data-close]")) {
      e.target.closest("dialog")?.close();
    }
  });
  document.querySelectorAll("dialog.modal").forEach((dlg) => {
    // clique no fundo escuro fecha
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg) dlg.close();
    });
    dlg.addEventListener("close", () => {
      if (!header.classList.contains("is-open")) document.body.classList.remove("is-locked");
      lastTrigger?.focus({ preventScroll: true });
    });
  });

  /* ---------- Depoimentos (carrossel no celular) ---------- */
  const track = document.querySelector(".testimonials");
  const dotsWrap = document.querySelector(".slider-dots");
  if (track) {
    const cards = [...track.children];
    const dots = cards.map(() => dotsWrap.appendChild(document.createElement("span")));
    const prev = document.querySelector('[data-slide="prev"]');
    const next = document.querySelector('[data-slide="next"]');

    const step = () => cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 16);
    const smooth = () => (window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");
    prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: smooth() }));
    next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: smooth() }));

    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      const idx = max <= 0 ? 0 : Math.round((track.scrollLeft / max) * (cards.length - 1));
      dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
    };
    let raf = 0;
    track.addEventListener(
      "scroll",
      () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(update);
      },
      { passive: true }
    );
    window.addEventListener("resize", update, { passive: true });
    update();
  }

  /* ---------- Ano no rodapé ---------- */
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
