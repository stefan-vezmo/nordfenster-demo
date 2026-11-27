# Nordfenster demo site

A one-page website for **Nordfenster**, a *fictional* ALU & PVC window and door company in Graz, Austria.
It is a portfolio demo: there is no real company, no real customers, no real prices.

## Stack
- Plain HTML, CSS and JavaScript. No framework, no build step, no npm packages.
- `index.html`: the single page (English copy is the no-JavaScript fallback).
- `styles.css`: all styles. `script.js`: configurator, price estimate, form, animations.
- `i18n.js`: EN/DE translations and the language switch.
- `api/quote.js`: Vercel serverless function (`POST /api/quote`). It validates the form, emails the lead
  via the **Resend** API, and optionally adds an AI reply draft from **OpenAI** for staff to check.
  Uses Node 18+ built-in `fetch`. If the AI fails or times out (8 s), the lead email still goes out.

## Environment variables (set in Vercel; never commit values, never put them in code)
- `RESEND_API_KEY`: sends the lead email through Resend. Required.
- `QUOTE_TO_EMAIL`: the inbox that receives quote requests. Required.
- `OPENAI_API_KEY`: enables the AI reply draft. Optional.
- `OPENAI_MODEL`: the OpenAI model name for the draft. Optional; without both OpenAI vars, no draft.
- `OWNER_LANG`: language of the owner notification email, `de` (default) or `en`. Optional.
Local secrets go in `.env*`, which is git-ignored.

## EN / DE translations
- One `index.html`, no duplicate pages. All texts live in the `TRANSLATIONS` object in `i18n.js` (`en` and `de`).
- Markup uses `data-i18n="key"` (text), `data-i18n-html="key"` (HTML, for accent spans) and
  `data-i18n-attr="alt:key; aria-label:key2"` (attributes). `script.js` uses `i18n.t("key")` for texts it creates.
- Choice is saved in localStorage (`nordfenster-lang`); otherwise the browser language decides (German → DE).
- The form's hidden `lang` field follows the chosen language, so the AI draft is written in that language.
- Changing a text: edit both languages in `i18n.js`, and the English copy in `index.html` too.
- Every new visible text (incl. alt, aria-label, placeholders, error messages) needs an EN and a DE key.

## Honesty rules
- Demo data is always labelled as demo (e.g. "Demo pricing", "Demo data", "Nordfenster is a fictional company").
- Never invent reviews, testimonials, customer counts, ratings, years in business or other stats.
- AI drafts must never contain invented dates, weekdays, times or relative times. They use the placeholders
  `[Tag, Uhrzeit 1]` / `[Tag, Uhrzeit 2]` (EN: `[Day, time 1]` / `[Day, time 2]`); `checkDraft()` rejects violations.
- AI drafts use only the submitted facts: no invented prices, discounts, delivery times or guarantees.
- Greeting and sign-off are built in code, not by the AI. Quantities are whole units, never sashes ("Flügel").

## German wording rules
- Austrian-friendly German, always the formal **Sie** form.
- Say **Kunststoff**, not PVC (e.g. "Kunststoff/Alu"). German AI drafts get the site's words from `LABELS.de`
  in `api/quote.js` (Kunststoff, Alu, Fenster, Türen, Schiebesysteme); `checkDraft()` rejects "PVC". Also: *Stück*, *2-fach/3-fach*, *kostenloses Ausmessen*.
- Prices in Austrian style: `€ 1.480 – € 2.170`.
- Email greeting is always "Guten Tag [Name]," (never Herr/Frau). The sentence after it starts **lowercase**
  unless it is a noun or a formal pronoun (Sie, Ihr, Ihre, Ihnen): "Guten Tag Anna, vielen Dank …".
  `germanFirstWord()` in `api/quote.js` enforces this.
- Sign-off: "Freundliche Grüße / Ihr Nordfenster-Team".
