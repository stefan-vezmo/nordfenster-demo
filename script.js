/* =========================================================
   DEMO PRICING — ALL ESTIMATE PRICES LIVE HERE AND ONLY HERE
   ---------------------------------------------------------
   These numbers are INVENTED FOR THE DEMO. They are not real
   prices. Change them here and the whole configurator updates.

   How the estimate is calculated:
     per-opening price (low / high) for the chosen product
     × material factor × size factor × glazing factor
     × number of openings
   If an option is not chosen yet, the LOW end uses that
   option's cheapest factor and the HIGH end its most expensive
   one — so the range narrows as the visitor answers.
   ========================================================= */
const DEMO_PRICING = {
  currency: "€",
  roundTo: 10,              // round results to the nearest 10
  maxOpenings: 30,

  // Price per opening in EUR, for a medium-size PVC double-glazed unit, fitted
  products: {
    windows: { label: "Windows",         low: 220, high: 320 },
    doors:   { label: "Doors",           low: 520, high: 850 },
    sliding: { label: "Sliding systems", low: 1100, high: 1700 }
  },

  // Multipliers
  material: {
    pvc: { label: "PVC", factor: 1.0 },
    alu: { label: "ALU", factor: 1.35 }
  },
  size: {
    small:  { label: "Small",  factor: 0.75 },
    medium: { label: "Medium", factor: 1.0 },
    large:  { label: "Large",  factor: 1.45 }
  },
  glazing: {
    double: { label: "Double", factor: 1.0 },
    triple: { label: "Triple", factor: 1.15 }
  }
};

/* =========================================================
   Everything below is page behaviour.
   ========================================================= */
(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hasGsap = typeof window.gsap !== "undefined";

  /* ---------- Nav: glass background after scrolling, mobile menu ---------- */
  const nav = $("#nav");
  const menuBtn = $("#menu-btn");
  const navLinks = $("#nav-links");

  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 20);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    navLinks.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    $(".menu-btn-text", menuBtn).textContent = open ? "Close" : "Menu";
  }
  menuBtn.addEventListener("click", () => setMenu(!navLinks.classList.contains("is-open")));
  navLinks.addEventListener("click", (e) => { if (e.target.tagName === "A") setMenu(false); });

  /* =========================================================
     INSTANT ESTIMATE CONFIGURATOR
     ========================================================= */
  const form = $("#estimate-form");
  const openingsInput = $("#openings");
  const openingsOut = $("#openings-out");
  const rangeEl = $("#range");
  const rangeHint = $("#range-hint");
  const ringFg = $("#ring-fg");
  const ringPct = $("#ring-pct");
  const success = $("#form-success");
  const RING_LENGTH = 2 * Math.PI * 52;

  const OPTION_GROUPS = ["material", "size", "glazing"];

  // Read the current choices from the form
  function getState() {
    return {
      product: form.elements.product.value,
      material: form.elements.material.value,
      size: form.elements.size.value,
      glazing: form.elements.glazing.value,
      openings: parseInt(openingsInput.value, 10) || 1
    };
  }

  // Work out the low/high estimate, or null if no product chosen yet
  function computeRange(s) {
    const product = DEMO_PRICING.products[s.product];
    if (!product) return null;

    let low = product.low;
    let high = product.high;

    OPTION_GROUPS.forEach((group) => {
      const options = DEMO_PRICING[group];
      if (s[group] && options[s[group]]) {
        low *= options[s[group]].factor;
        high *= options[s[group]].factor;
      } else {
        const factors = Object.values(options).map((o) => o.factor);
        low *= Math.min(...factors);
        high *= Math.max(...factors);
      }
    });

    const r = DEMO_PRICING.roundTo;
    return {
      low: Math.floor((low * s.openings) / r) * r,
      high: Math.ceil((high * s.openings) / r) * r
    };
  }

  const money = (n) => DEMO_PRICING.currency + Math.round(n).toLocaleString("en-US");
  const writeRange = (v) => { rangeEl.textContent = money(v.low) + " – " + money(v.high); };

  // The numbers that are currently on screen (animated towards the new values)
  const shown = { low: 0, high: 0, started: false };
  let rangeFallback = null;

  function updateEstimate() {
    const s = getState();
    const r = computeRange(s);

    // Summary list
    $("#sum-product").textContent = s.product ? DEMO_PRICING.products[s.product].label : "—";
    OPTION_GROUPS.forEach((g) => {
      $("#sum-" + g).textContent = s[g] ? DEMO_PRICING[g][s[g]].label : "—";
    });
    $("#sum-openings").textContent = s.openings;

    if (!r) {
      rangeEl.textContent = "€— – €—";
      rangeHint.textContent = "Choose a product to see a range.";
      return;
    }

    const missing = OPTION_GROUPS.filter((g) => !s[g]).length;
    rangeHint.textContent = missing
      ? "Pick the remaining " + missing + " option" + (missing > 1 ? "s" : "") + " to narrow the range."
      : "Based on your choices.";

    if (!shown.started) {           // first time: count up from a bit lower
      shown.low = r.low * 0.7;
      shown.high = r.high * 0.7;
      shown.started = true;
    }

    if (hasGsap && !reduceMotion.matches) {
      const tween = gsap.to(shown, {
        low: r.low,
        high: r.high,
        duration: 0.7,
        ease: "power3.out",
        overwrite: true,
        onUpdate: () => writeRange(shown)
      });
      gsap.fromTo(rangeEl, { scale: 1.06, transformOrigin: "left center" },
        { scale: 1, duration: 0.5, ease: "power2.out", overwrite: "auto" });

      // Safety net: if the browser isn't drawing frames, show the final numbers anyway
      clearTimeout(rangeFallback);
      rangeFallback = setTimeout(() => {
        if (tween.progress() < 1) {
          tween.kill();
          shown.low = r.low;
          shown.high = r.high;
          writeRange(r);
        }
      }, 1200);
    } else {
      shown.low = r.low;
      shown.high = r.high;
      writeRange(r);
    }
  }

  /* ---------- Validation rules (shared by the ring and the submit) ---------- */
  // Phone and email are each optional, but at least one is needed (checked separately below).
  // If one is filled in, it must look valid.
  const rules = {
    product: (v) => (v ? "" : "Please choose a product."),
    name: (v) => (v.trim().length >= 2 ? "" : "Please enter your name."),
    phone: (v) => {
      v = v.trim();
      if (!v) return "";
      const digits = v.replace(/\D/g, "");
      return /^[\d\s+\-()/]+$/.test(v) && digits.length >= 6 ? "" : "Please enter a valid phone number.";
    },
    email: (v) => {
      v = v.trim();
      if (!v) return "";
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Please enter a valid email address.";
    }
  };
  const CONTACT_MSG = "Please enter a phone number or an email address.";
  const contactMissing = () => !form.elements.phone.value.trim() && !form.elements.email.value.trim();

  /* ---------- Progress ring: how complete is the request? ---------- */
  function updateProgress() {
    const s = getState();
    // Options are preselected, so "complete" means: product chosen + contact details valid
    const checks = [
      !!s.product,
      rules.name(form.elements.name.value) === "",
      !contactMissing() &&
        rules.phone(form.elements.phone.value) === "" &&
        rules.email(form.elements.email.value) === ""
    ];
    const pct = Math.round((checks.filter(Boolean).length / checks.length) * 100);
    ringFg.style.strokeDashoffset = String(RING_LENGTH * (1 - pct / 100));
    ringFg.classList.toggle("is-empty", pct === 0);
    ringPct.textContent = pct + "%";
  }

  function updateAll() {
    updateEstimate();
    updateProgress();
  }

  /* ---------- Openings stepper ---------- */
  function setOpenings(n) {
    const v = Math.min(DEMO_PRICING.maxOpenings, Math.max(1, n));
    openingsInput.value = v;
    openingsOut.textContent = v;
    $('[data-step="-1"]', form).disabled = v <= 1;
    $('[data-step="1"]', form).disabled = v >= DEMO_PRICING.maxOpenings;
    updateAll();
  }
  $$(".stepper-btn", form).forEach((btn) => {
    btn.addEventListener("click", () => {
      setOpenings((parseInt(openingsInput.value, 10) || 1) + parseInt(btn.dataset.step, 10));
    });
  });

  /* ---------- Errors ---------- */
  function showError(name, message) {
    const el = $('[data-error-for="' + name + '"]', form);
    if (el) el.textContent = message;
    const input = form.elements[name];
    if (input && !input.length) {
      input.closest(".field").classList.toggle("has-error", !!message);
      input.setAttribute("aria-invalid", message ? "true" : "false");
    }
  }

  form.addEventListener("change", (e) => {
    if (e.target.name === "product") showError("product", "");
    updateAll();
  });
  form.addEventListener("input", (e) => {
    const name = e.target.name;
    if (name === "phone" || name === "email") {
      // Typing in either box can fix the "phone or email" error shown on the phone box
      if (form.elements.phone.closest(".has-error")) {
        showError("phone", rules.phone(form.elements.phone.value) || (contactMissing() ? CONTACT_MSG : ""));
      }
      if (form.elements.email.closest(".has-error")) showError("email", rules.email(form.elements.email.value));
    } else if (rules[name] && e.target.closest(".has-error")) {
      showError(name, rules[name](e.target.value));
    }
    updateProgress();
  });

  /* ---------- Sending the request to /api/quote ---------- */
  const sendBtn = $("#send-btn");
  const sendLabel = $(".btn-label", sendBtn);
  const fail = $("#form-fail");
  let sending = false;

  function setLoading(on) {
    sending = on;
    sendBtn.disabled = on;
    sendBtn.classList.toggle("is-loading", on);
    sendLabel.textContent = on ? "Sending…" : "Send request";
    form.setAttribute("aria-busy", String(on));
  }

  function showFail(message) {
    fail.textContent = message ||
      "Sorry — something went wrong and your request wasn't sent. Please try again in a moment, or call us on +43 316 000 000.";
    fail.hidden = false;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();              // we send it ourselves with fetch, without reloading the page
    if (sending) return;             // ignore double-clicks
    success.hidden = true;
    fail.hidden = true;

    // 1. Check the fields in the browser first (the server checks again)
    let firstBad = null;
    Object.keys(rules).forEach((name) => {
      const msg = rules[name](form.elements[name].value);
      showError(name, msg);
      if (msg && !firstBad) firstBad = name;
    });
    if (contactMissing()) {
      showError("phone", CONTACT_MSG);
      if (!firstBad) firstBad = "phone";
    }

    if (firstBad) {
      const target = firstBad === "product" ? $('input[name="product"]', form) : form.elements[firstBad];
      if (firstBad === "product") $("#step-1").scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" });
      target.focus({ preventScroll: firstBad === "product" });
      return;
    }

    // 2. Collect everything into one object
    const s = getState();
    const r = computeRange(s);
    const payload = {
      product: s.product,
      material: s.material,
      openings: s.openings,
      size: s.size,
      glazing: s.glazing,
      estimate: r ? money(r.low) + " – " + money(r.high) : "",
      name: form.elements.name.value.trim(),
      phone: form.elements.phone.value.trim(),
      email: form.elements.email.value.trim(),
      message: form.elements.message.value.trim(),
      company: form.elements.company.value      // honeypot: always empty for real people
    };

    // 3. Send it, with a loading state and a 15-second time limit
    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      let body = null;
      try { body = await res.json(); } catch { /* not JSON, e.g. a 404 page */ }

      if (res.ok && body && body.ok) {
        // 4a. Success
        success.hidden = false;
        form.elements.message.value = "";
        success.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "nearest" });
      } else if (res.status === 400 && body && body.error) {
        // 4b. The server found a problem with the input
        showFail(body.error);
      } else {
        // 4c. Anything else (server or email service problem)
        showFail();
      }
    } catch (err) {
      // 4d. No connection, or it took too long
      showFail();
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  });

  /* ---------- Links elsewhere on the page that preselect a product ---------- */
  $$("[data-product]").forEach((link) => {
    link.addEventListener("click", () => {
      const radio = $('input[name="product"][value="' + link.dataset.product + '"]', form);
      if (radio) {
        radio.checked = true;
        showError("product", "");
        success.hidden = true;
        updateAll();
      }
    });
  });

  setOpenings(1);

  /* =========================================================
     BEFORE / AFTER SLIDER
     ========================================================= */
  const ba = $("#ba");
  const baRange = $("#ba-range");
  baRange.addEventListener("input", () => ba.style.setProperty("--pos", baRange.value + "%"));

  /* =========================================================
     MOBILE BAR — stays hidden while the hero buttons are on
     screen, so it never covers "Get your estimate".
     ========================================================= */
  const mobileBar = $("#mobile-bar");
  const heroActions = $(".hero .actions");
  function updateMobileBar() {
    const pastHeroCta = heroActions.getBoundingClientRect().bottom < 0;
    mobileBar.classList.toggle("is-visible", pastHeroCta);
  }
  window.addEventListener("scroll", updateMobileBar, { passive: true });
  window.addEventListener("resize", updateMobileBar);
  updateMobileBar();

  /* ---------- Footer year ---------- */
  $("#year").textContent = new Date().getFullYear();

  /* =========================================================
     MOTION (GSAP + ScrollTrigger)
     Only runs when GSAP loaded AND the visitor hasn't asked
     for reduced motion. Without it, the page is fully static.
     ========================================================= */
  if (!hasGsap) return;
  gsap.registerPlugin(ScrollTrigger);

  // Splits a heading into one masked line per visual line of text
  function splitLines(el) {
    const words = [];
    Array.from(el.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.split(/\s+/).filter(Boolean).forEach((w) => {
          const span = document.createElement("span");
          span.textContent = w;
          words.push(span);
        });
      } else {
        const span = document.createElement("span");
        span.appendChild(node.cloneNode(true));
        words.push(span);
      }
    });

    el.textContent = "";
    words.forEach((w, i) => {
      w.style.display = "inline-block";
      el.appendChild(w);
      if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    });

    // Group words by their vertical position
    const lines = [];
    let lastTop = null;
    words.forEach((w) => {
      const top = w.offsetTop;
      if (lastTop === null || Math.abs(top - lastTop) > 4) lines.push([]);
      lines[lines.length - 1].push(w);
      lastTop = top;
    });

    el.textContent = "";
    lines.forEach((lineWords) => {
      const line = document.createElement("span");
      line.className = "line";
      const inner = document.createElement("span");
      inner.className = "line-inner";
      lineWords.forEach((w, i) => {
        w.style.display = "";
        inner.appendChild(w);
        if (i < lineWords.length - 1) inner.appendChild(document.createTextNode(" "));
      });
      line.appendChild(inner);
      el.appendChild(line);
    });
    return $$(".line-inner", el);
  }

  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const title = $("#hero-title");
    const originalTitle = title.innerHTML;

    // Hide hero parts right away so they don't flash before animating
    gsap.set([title, ".hero .label", ".hero .lead", ".hero .actions", ".hero-photo", ".glass-pos", ".chips li"], { autoAlpha: 0 });

    // Wait for the web font (max ~1.2s) so line breaks are measured correctly
    const fontsReady = Promise.race([
      document.fonts ? document.fonts.ready : Promise.resolve(),
      new Promise((res) => setTimeout(res, 1200))
    ]);

    let heroTl;
    fontsReady.then(() => {
      const lines = splitLines(title);
      gsap.set(title, { autoAlpha: 1 });

      heroTl = gsap.timeline({ defaults: { ease: "power3.out" } })
        .fromTo(".hero .label", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 })
        .fromTo(lines, { yPercent: 115 }, {
          yPercent: 0, duration: 1, stagger: 0.12,
          onComplete: () => { title.innerHTML = originalTitle; } // restore normal text after the reveal
        }, "-=0.35")
        .fromTo(".hero-photo", { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration: 1.1 }, 0.1)
        .fromTo([".hero .lead", ".hero .actions"], { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1 }, "-=0.6")
        .fromTo(".glass-pos", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.15 }, "-=0.5")
        .fromTo(".chips li", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.04 }, "-=0.5");

      // Safety net: if the intro hasn't played (no frames drawn), jump to the end so nothing stays hidden
      setTimeout(() => { if (heroTl.progress() < 1) heroTl.progress(1); }, 4000);
    });

    // Glass cards float gently (on the inner element, so it doesn't clash with the intro)
    gsap.to(".glass-a .glass", { y: -10, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.to(".glass-b .glass", { y: 9, duration: 3.8, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0.6 });

    // Panels slide up as they enter the screen
    $$(".reveal").forEach((panel) => {
      gsap.fromTo(panel, { autoAlpha: 0, y: 56 }, {
        autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: panel, start: "top 90%", once: true }
      });
    });

    // Bento tiles stagger in
    gsap.fromTo(".bento-tile", { autoAlpha: 0, y: 40 }, {
      autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: ".bento", start: "top 85%", once: true }
    });

    // How-it-works steps stagger in
    gsap.fromTo("#process .steps li", { autoAlpha: 0, y: 32 }, {
      autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: "#process .steps", start: "top 85%", once: true }
    });

    // Cleanup if the visitor switches reduced motion on while the page is open
    return () => {
      if (heroTl) heroTl.kill();
      title.innerHTML = originalTitle;
    };
  });
})();
