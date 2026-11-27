/* =========================================================
   i18n.js — English / German translations for the whole page
   ---------------------------------------------------------
   How it works:
   - Elements in index.html carry a key:
       data-i18n="key"          → replaces the element's text
       data-i18n-html="key"     → replaces its HTML (for the green accent words)
       data-i18n-attr="alt:key; aria-label:key2"  → translates attributes
   - script.js uses i18n.t("key") for texts it creates itself
     (validation messages, "Sending…", price hints, …).
   - The choice is remembered in localStorage. Without a saved choice,
     the browser's preferred language decides (German → DE, else EN).
   - The form's hidden "lang" field always follows the chosen language,
     so the AI reply draft is written in that language.
   To change a text: edit it here (and the English one in index.html,
   which is what people see if JavaScript is off).
   ========================================================= */

const TRANSLATIONS = {
  en: {
    "meta.title": "Nordfenster — ALU & PVC Windows and Doors, Graz",
    "meta.description": "Nordfenster makes and installs ALU and PVC windows, doors and sliding systems in Graz, Austria. Get an instant online estimate and book a free measuring visit.",

    "lang.group": "Language",
    "nav.home": "Nordfenster, back to top",
    "nav.main": "Main",
    "nav.products": "Products",
    "nav.estimate": "Estimate",
    "nav.process": "How it works",
    "nav.faq": "FAQ",
    "nav.cta": "Get your estimate",
    "nav.menu": "Menu",
    "nav.close": "Close",

    "hero.label": "ALU & PVC · Graz",
    "hero.title": "Windows that keep the <span class=\"accent\">weather</span> out.",
    "hero.lead": "Made to measure and installed by our own team — so your home stays warm, quiet and dry.",
    "hero.cta": "Get your estimate",
    "hero.how": "How it works",
    "hero.alt": "Modern house with large dark-framed corner windows",
    "glass.measure": "Free measuring visit",
    "glass.offer": "Written offer in 48h",

    "chips.aria": "Services",
    "chips.1": "PVC windows",
    "chips.2": "ALU windows",
    "chips.3": "Entrance doors",
    "chips.4": "Balcony doors",
    "chips.5": "Sliding systems",
    "chips.6": "Window replacement",
    "chips.7": "Measuring & installation",

    "products.label": "Products",
    "products.title": "Made for every <span class=\"accent\">opening</span>.",
    "product.windows": "Windows",
    "product.doors": "Doors",
    "product.sliding": "Sliding systems",
    "tile.replacement": "Window replacement",
    "tile.windowsSub": "PVC & ALU · double or triple glazed",
    "tile.doorsSub": "Entrance & balcony",
    "tile.slidingSub": "Wide openings, slim frames",
    "tile.replacementSub": "Old frames out, new ones in — one visit from our team",
    "alt.windows": "White modern house with a tall dark-framed window",
    "alt.doors": "Grey modern double entrance door with glass inserts",
    "alt.sliding": "Bright room with a large sliding glass door to a balcony",
    "alt.replacement": "House extension with new white windows and patio doors",

    "estimate.label": "Instant estimate",
    "estimate.title": "Your <span class=\"accent\">estimate</span>, live.",
    "estimate.lead": "We have filled in a typical starting point. Change any option and the range updates instantly.",
    "step1.title": "Choose a product",
    "alt.choiceWindows": "Windows: modern white house with a tall, dark-framed corner window",
    "alt.choiceDoors": "Doors: grey modern double entrance door with frosted glass inserts",
    "alt.choiceSliding": "Sliding systems: large sliding glass door opening onto a balcony",
    "step2.title": "Tell us a little more",
    "opt.material": "Material",
    "material.pvc": "PVC",
    "material.alu": "ALU",
    "opt.openings": "Number of openings",
    "openings.fewer": "Fewer openings",
    "openings.more": "More openings",
    "opt.size": "Size of each opening",
    "size.small": "Small",
    "size.medium": "Medium",
    "size.large": "Large",
    "size.smallPill": "Small <small>up to 1 m²</small>",
    "size.mediumPill": "Medium <small>1–2 m²</small>",
    "size.largePill": "Large <small>over 2 m²</small>",
    "opt.glazing": "Glazing",
    "glazing.double": "Double",
    "glazing.triple": "Triple",
    "opt.hint": "Not sure? Keep the defaults — we'll advise at the free measuring visit.",

    "summary.aria": "Your estimate",
    "summary.complete": "complete",
    "summary.label": "Estimated range",
    "summary.hintChoose": "Choose a product to see a range.",
    "summary.hintDone": "Based on your choices.",
    "summary.hintMissing": "Pick the remaining {n} option(s) to narrow the range.",
    "sum.product": "Product",
    "sum.material": "Material",
    "sum.openings": "Openings",
    "sum.size": "Size",
    "sum.glazing": "Glazing",
    "summary.demo": "Demo pricing. Final offer after free measuring.",

    "step3.title": "Where should we send it?",
    "field.name": "Name",
    "field.phone": "Phone",
    "field.email": "Email",
    "field.hint": "A phone number or an email is enough — whichever you prefer.",
    "field.message": "Message <span class=\"optional\">(optional)</span>",
    "field.messagePlaceholder": "Anything we should know — timing, access, questions…",
    "form.send": "Send request",
    "form.sending": "Sending…",
    "form.success": "Thanks! We'll contact you within 48h.",
    "form.fail": "Sorry — something went wrong and your request wasn't sent. Please try again in a moment, or call us on +43 316 000 000.",
    "err.product": "Please choose a product.",
    "err.name": "Please enter your name.",
    "err.phone": "Please enter a valid phone number.",
    "err.email": "Please enter a valid email address.",
    "err.contact": "Please enter a phone number or an email address.",

    "ba.label": "Before & after",
    "ba.title": "Old out, <span class=\"accent\">new</span> in.",
    "ba.lead": "Drag the handle to compare a worn-out window with a new one.",
    "ba.altAfter": "After: a clean new white window in a plastered wall",
    "ba.altBefore": "Before: an old window with peeling paint and worn shutters",
    "ba.before": "Before",
    "ba.after": "After",
    "ba.aria": "Drag to compare before and after",
    "ba.caption": "Example photos of two different buildings, for illustration only.",

    "process.label": "How it works",
    "process.title": "Four steps, <span class=\"accent\">one</span> team.",
    "s1.title": "Request",
    "s1.text": "Use the estimate above or call us. A rough idea is enough.",
    "s2.title": "Measuring",
    "s2.text": "We visit, measure every opening and help you choose. Free.",
    "s3.title": "Offer",
    "s3.text": "A clear, written offer within 48 hours. No obligation.",
    "s4.title": "Installation",
    "s4.text": "Our own team fits, seals and cleans up after itself.",

    "faq.label": "FAQ",
    "faq.title": "Good to <span class=\"accent\">know</span>.",
    "faq.q1": "Is the measuring visit really free?",
    "faq.a1": "Yes. We come to you, measure every opening and talk through the options. There is no obligation to order.",
    "faq.q2": "How soon will I get an offer?",
    "faq.a2": "You get a written offer within 48 hours of the measuring visit.",
    "faq.q3": "PVC or aluminium — which should I choose?",
    "faq.a3": "PVC insulates well and usually costs less. Aluminium allows slimmer frames and larger panes, which is why it's often chosen for sliding systems and big glazing. We'll help you decide at the visit.",
    "faq.q4": "Do you remove the old windows?",
    "faq.a4": "Yes — removing the old frames can be included in your offer, and our team does it as part of the installation.",
    "faq.q5": "Is the online estimate the final price?",
    "faq.a5": "No. It's a rough demo range to give you an idea. The final price comes in the written offer after the free measuring visit.",

    "footer.cta": "Get your estimate",
    "footer.contact": "Contact",
    "footer.demo": "Demo data",
    "footer.phone": "Phone",
    "footer.email": "Email",
    "footer.address": "Address",
    "footer.note": "Placeholder details — Nordfenster is a fictional company.",
    "footer.explore": "Explore",
    "footer.estimate": "Instant estimate",
    "footer.photos": "Photos",
    "credits.from": "From",
    "credits.by": ", by",
    "credits.and": "and",
    "footer.demoSite": "Demo website",

    "mobile.aria": "Quick actions",
    "mobile.call": "Call",
    "mobile.cta": "Get estimate"
  },

  de: {
    "meta.title": "Nordfenster — Alu- & Kunststofffenster und Türen in Graz",
    "meta.description": "Nordfenster fertigt und montiert Alu- und Kunststofffenster, Türen und Schiebesysteme in Graz. Berechnen Sie online einen Richtpreis und vereinbaren Sie ein kostenloses Ausmessen vor Ort.",

    "lang.group": "Sprache",
    "nav.home": "Nordfenster, zum Seitenanfang",
    "nav.main": "Hauptmenü",
    "nav.products": "Produkte",
    "nav.estimate": "Richtpreis",
    "nav.process": "Ablauf",
    "nav.faq": "FAQ",
    "nav.cta": "Richtpreis berechnen",
    "nav.menu": "Menü",
    "nav.close": "Schließen",

    "hero.label": "Alu & Kunststoff · Graz",
    "hero.title": "Fenster für jedes <span class=\"accent\">Wetter</span>.",
    "hero.lead": "Maßgefertigt und von unserem eigenen Team montiert – damit es bei Ihnen zuhause warm, ruhig und trocken bleibt.",
    "hero.cta": "Richtpreis berechnen",
    "hero.how": "So funktioniert's",
    "hero.alt": "Modernes Haus mit großen, dunkel gerahmten Eckfenstern",
    "glass.measure": "Kostenloses Ausmessen",
    "glass.offer": "Angebot in 48 Stunden",

    "chips.aria": "Leistungen",
    "chips.1": "Kunststofffenster",
    "chips.2": "Alufenster",
    "chips.3": "Haustüren",
    "chips.4": "Balkontüren",
    "chips.5": "Schiebesysteme",
    "chips.6": "Fenstertausch",
    "chips.7": "Ausmessen & Montage",

    "products.label": "Produkte",
    "products.title": "Passend für jede <span class=\"accent\">Öffnung</span>.",
    "product.windows": "Fenster",
    "product.doors": "Türen",
    "product.sliding": "Schiebesysteme",
    "tile.replacement": "Fenstertausch",
    "tile.windowsSub": "Kunststoff & Alu · 2- oder 3-fach verglast",
    "tile.doorsSub": "Haus- & Balkontüren",
    "tile.slidingSub": "Große Öffnungen, schlanke Rahmen",
    "tile.replacementSub": "Alt raus, neu rein – unser Team erledigt alles an einem Termin",
    "alt.windows": "Weißes modernes Haus mit hohem, dunkel gerahmtem Fenster",
    "alt.doors": "Graue moderne Doppel-Haustür mit Glaseinsätzen",
    "alt.sliding": "Heller Raum mit großer Glas-Schiebetür zum Balkon",
    "alt.replacement": "Hauszubau mit neuen weißen Fenstern und Terrassentüren",

    "estimate.label": "Sofort-Richtpreis",
    "estimate.title": "Ihr <span class=\"accent\">Richtpreis</span>, live.",
    "estimate.lead": "Wir haben typische Werte vorausgewählt. Ändern Sie eine Option – der Preisrahmen passt sich sofort an.",
    "step1.title": "Produkt wählen",
    "alt.choiceWindows": "Fenster: modernes weißes Haus mit hohem, dunkel gerahmtem Eckfenster",
    "alt.choiceDoors": "Türen: graue moderne Doppel-Haustür mit Milchglaseinsätzen",
    "alt.choiceSliding": "Schiebesysteme: große Glas-Schiebetür zum Balkon",
    "step2.title": "Ein paar Details",
    "opt.material": "Material",
    "material.pvc": "Kunststoff",
    "material.alu": "Alu",
    "opt.openings": "Anzahl (Stück)",
    "openings.fewer": "Ein Stück weniger",
    "openings.more": "Ein Stück mehr",
    "opt.size": "Größe pro Stück",
    "size.small": "Klein",
    "size.medium": "Mittel",
    "size.large": "Groß",
    "size.smallPill": "Klein <small>bis 1 m²</small>",
    "size.mediumPill": "Mittel <small>1–2 m²</small>",
    "size.largePill": "Groß <small>über 2 m²</small>",
    "opt.glazing": "Verglasung",
    "glazing.double": "2-fach",
    "glazing.triple": "3-fach",
    "opt.hint": "Nicht sicher? Lassen Sie einfach die Vorauswahl – wir beraten Sie beim kostenlosen Ausmessen.",

    "summary.aria": "Ihr Richtpreis",
    "summary.complete": "vollständig",
    "summary.label": "Geschätzter Preisrahmen",
    "summary.hintChoose": "Wählen Sie ein Produkt, um einen Preisrahmen zu sehen.",
    "summary.hintDone": "Basierend auf Ihrer Auswahl.",
    "summary.hintMissing": "Wählen Sie noch {n} Option(en), um den Rahmen einzugrenzen.",
    "sum.product": "Produkt",
    "sum.material": "Material",
    "sum.openings": "Stück",
    "sum.size": "Größe",
    "sum.glazing": "Verglasung",
    "summary.demo": "Demo-Preise. Das verbindliche Angebot erhalten Sie nach dem kostenlosen Ausmessen.",

    "step3.title": "Wohin dürfen wir es schicken?",
    "field.name": "Name",
    "field.phone": "Telefon",
    "field.email": "E-Mail",
    "field.hint": "Telefonnummer oder E-Mail genügt – ganz wie es Ihnen lieber ist.",
    "field.message": "Nachricht <span class=\"optional\">(optional)</span>",
    "field.messagePlaceholder": "Was sollten wir wissen? Zeitrahmen, Zufahrt, Fragen …",
    "form.send": "Anfrage senden",
    "form.sending": "Wird gesendet …",
    "form.success": "Danke! Wir melden uns innerhalb von 48 Stunden bei Ihnen.",
    "form.fail": "Leider ist etwas schiefgelaufen – Ihre Anfrage wurde nicht gesendet. Bitte versuchen Sie es gleich noch einmal oder rufen Sie uns an: +43 316 000 000.",
    "err.product": "Bitte wählen Sie ein Produkt.",
    "err.name": "Bitte geben Sie Ihren Namen ein.",
    "err.phone": "Bitte geben Sie eine gültige Telefonnummer ein.",
    "err.email": "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    "err.contact": "Bitte geben Sie eine Telefonnummer oder E-Mail-Adresse an.",

    "ba.label": "Vorher & nachher",
    "ba.title": "Alt raus, <span class=\"accent\">neu</span> rein.",
    "ba.lead": "Ziehen Sie den Regler, um ein altes Fenster mit einem neuen zu vergleichen.",
    "ba.altAfter": "Nachher: sauberes neues weißes Fenster in einer verputzten Wand",
    "ba.altBefore": "Vorher: altes Fenster mit abblätternder Farbe und verwitterten Fensterläden",
    "ba.before": "Vorher",
    "ba.after": "Nachher",
    "ba.aria": "Ziehen, um vorher und nachher zu vergleichen",
    "ba.caption": "Beispielfotos von zwei verschiedenen Gebäuden, nur zur Veranschaulichung.",

    "process.label": "Ablauf",
    "process.title": "Vier Schritte, <span class=\"accent\">ein</span> Team.",
    "s1.title": "Anfrage",
    "s1.text": "Nutzen Sie den Richtpreis-Rechner oben oder rufen Sie uns an. Eine grobe Vorstellung reicht.",
    "s2.title": "Ausmessen",
    "s2.text": "Wir kommen vorbei, messen alles genau aus und beraten Sie. Kostenlos.",
    "s3.title": "Angebot",
    "s3.text": "Ein klares, schriftliches Angebot innerhalb von 48 Stunden. Unverbindlich.",
    "s4.title": "Montage",
    "s4.text": "Unser eigenes Team montiert, dichtet ab und räumt danach wieder auf.",

    "faq.label": "FAQ",
    "faq.title": "Gut zu <span class=\"accent\">wissen</span>.",
    "faq.q1": "Ist das Ausmessen wirklich kostenlos?",
    "faq.a1": "Ja. Wir kommen zu Ihnen, messen jedes Fenster und jede Tür aus und besprechen die Möglichkeiten. Sie gehen dabei keinerlei Verpflichtung ein.",
    "faq.q2": "Wann bekomme ich ein Angebot?",
    "faq.a2": "Ihr schriftliches Angebot erhalten Sie innerhalb von 48 Stunden nach dem Ausmessen.",
    "faq.q3": "Kunststoff oder Alu – was passt besser?",
    "faq.a3": "Kunststoff dämmt gut und ist meist günstiger. Alu ermöglicht schlankere Rahmen und größere Glasflächen – deshalb wird es oft für Schiebesysteme und große Verglasungen gewählt. Beim Termin helfen wir Ihnen bei der Entscheidung.",
    "faq.q4": "Bauen Sie die alten Fenster auch aus?",
    "faq.a4": "Ja – der Ausbau der alten Rahmen kann Teil Ihres Angebots sein, und unser Team erledigt das im Zuge der Montage.",
    "faq.q5": "Ist der Online-Richtpreis der Endpreis?",
    "faq.a5": "Nein. Es ist ein grober Demo-Preisrahmen zur Orientierung. Den verbindlichen Preis finden Sie im schriftlichen Angebot nach dem kostenlosen Ausmessen.",

    "footer.cta": "Richtpreis berechnen",
    "footer.contact": "Kontakt",
    "footer.demo": "Demo-Daten",
    "footer.phone": "Telefon",
    "footer.email": "E-Mail",
    "footer.address": "Adresse",
    "footer.note": "Platzhalterdaten – Nordfenster ist ein fiktives Unternehmen.",
    "footer.explore": "Navigation",
    "footer.estimate": "Sofort-Richtpreis",
    "footer.photos": "Fotos",
    "credits.from": "Auf",
    "credits.by": ", fotografiert von",
    "credits.and": "und",
    "footer.demoSite": "Demo-Website",

    "mobile.aria": "Schnellzugriff",
    "mobile.call": "Anrufen",
    "mobile.cta": "Richtpreis"
  }
};

(function () {
  "use strict";

  const STORAGE_KEY = "nordfenster-lang";
  const SUPPORTED = ["en", "de"];
  let current = "en";

  // Saved choice first; otherwise the browser's preferred language
  function detectLanguage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (SUPPORTED.includes(saved)) return saved;
    } catch (e) { /* storage blocked: ignore */ }
    const preferred = (navigator.languages && navigator.languages[0]) || navigator.language || "en";
    return preferred.toLowerCase().startsWith("de") ? "de" : "en";
  }

  // Look up a text; falls back to English, then to the key itself.
  // "{n}" style placeholders are filled from vars.
  function t(key, vars) {
    let s = (TRANSLATIONS[current] && TRANSLATIONS[current][key]) ?? TRANSLATIONS.en[key] ?? key;
    if (vars) Object.keys(vars).forEach((k) => { s = s.split("{" + k + "}").join(vars[k]); });
    return s;
  }

  function apply(lang) {
    current = SUPPORTED.includes(lang) ? lang : "en";
    const root = document.documentElement;
    root.lang = current === "de" ? "de-AT" : "en";

    document.title = t("meta.title");
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", t("meta.description"));

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      el.innerHTML = t(el.getAttribute("data-i18n-html"));   // only our own trusted strings
    });
    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      el.getAttribute("data-i18n-attr").split(";").forEach((pair) => {
        const [attr, key] = pair.split(":").map((s) => s.trim());
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });

    // The form's hidden language field follows the chosen language
    const langField = document.getElementById("lang");
    if (langField) langField.value = current;

    // Switch buttons show which language is active
    document.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang") === current));
    });

    // Let script.js re-render the texts it creates itself
    document.dispatchEvent(new CustomEvent("i18n:change", { detail: { lang: current } }));
  }

  function setLanguage(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
    apply(lang);
  }

  window.i18n = {
    t,
    set: setLanguage,
    get lang() { return current; },
    locale() { return current === "de" ? "de-AT" : "en-US"; }
  };

  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => setLanguage(btn.getAttribute("data-lang")));
  });

  apply(detectLanguage());
})();
