// =========================================================
// api/quote.js — Vercel serverless function
// ---------------------------------------------------------
// Receives the estimate/quote form as JSON (POST /api/quote),
// checks it, and emails it to the company via the Resend API.
//
// Needs two environment variables, set in the Vercel dashboard
// (Project → Settings → Environment Variables). Never put the
// real values in this file or anywhere in the repo:
//   RESEND_API_KEY   your Resend API key (starts with "re_")
//   QUOTE_TO_EMAIL   the inbox that should receive requests
//
// No npm packages: Node 18+ has fetch built in.
// =========================================================

const RESEND_URL = "https://api.resend.com/emails";
const FROM = "Nordfenster Website <onboarding@resend.dev>";

// Only these values are accepted for the option fields.
// Anything else is rejected, so nobody can inject odd text.
const ALLOWED = {
  product: { windows: "Windows", doors: "Doors", sliding: "Sliding systems" },
  material: { pvc: "PVC", alu: "ALU" },
  size: { small: "Small (up to 1 m²)", medium: "Medium (1–2 m²)", large: "Large (over 2 m²)" },
  glazing: { double: "Double", triple: "Triple" }
};

// Turn any value into a trimmed string with a maximum length
function clean(value, max) {
  return String(value == null ? "" : value).replace(/\s+/g, " ").trim().slice(0, max);
}

// The message may keep its line breaks, but nothing else unusual
function cleanMultiline(value, max) {
  return String(value == null ? "" : value).replace(/\r\n?/g, "\n").trim().slice(0, max);
}

// Make text safe to place inside HTML (stops "<script>" etc. in the email)
function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const isPhone = (s) => /^[\d\s+\-()/]+$/.test(s) && s.replace(/\D/g, "").length >= 6;

// Small helper so every response has the same JSON shape
function reply(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

module.exports = async function handler(req, res) {
  // 1. Only accept POST requests
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return reply(res, 405, { ok: false, error: "Method not allowed." });
  }

  // 2. Read the body (Vercel parses JSON automatically; fall back if it arrives as text)
  let data = req.body;
  if (typeof data === "string") {
    try { data = JSON.parse(data); } catch { data = null; }
  }
  if (!data || typeof data !== "object") {
    return reply(res, 400, { ok: false, error: "Invalid request." });
  }

  // 3. Honeypot: a hidden field real people never see or fill in.
  //    Bots fill every field, so if it has a value we quietly pretend
  //    everything worked and send nothing.
  if (clean(data.company, 200) !== "") {
    return reply(res, 200, { ok: true });
  }

  // 4. Clean and validate every field
  const name = clean(data.name, 100);
  const phone = clean(data.phone, 40);
  const email = clean(data.email, 200);
  const message = cleanMultiline(data.message, 2000);
  const estimate = clean(data.estimate, 60);
  const openings = parseInt(data.openings, 10);

  const errors = [];
  if (name.length < 2) errors.push("Please enter your name.");
  if (!phone && !email) errors.push("Please enter a phone number or an email address.");
  if (phone && !isPhone(phone)) errors.push("Please enter a valid phone number.");
  if (email && !isEmail(email)) errors.push("Please enter a valid email address.");
  if (!ALLOWED.product[data.product]) errors.push("Please choose a product.");
  ["material", "size", "glazing"].forEach((key) => {
    if (!ALLOWED[key][data[key]]) errors.push("Please choose a " + key + ".");
  });
  if (!Number.isInteger(openings) || openings < 1 || openings > 30) errors.push("Number of openings must be 1–30.");

  if (errors.length) {
    return reply(res, 400, { ok: false, error: errors.join(" ") });
  }

  // 5. Check the server is configured (secrets come ONLY from environment variables)
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.QUOTE_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("Missing RESEND_API_KEY or QUOTE_TO_EMAIL environment variable.");
    return reply(res, 500, { ok: false, error: "The form isn't set up yet. Please call us instead." });
  }

  // 6. Build the email
  const time = new Date().toLocaleString("en-GB", {
    timeZone: "Europe/Vienna",
    dateStyle: "full",
    timeStyle: "short"
  });

  const rows = [
    ["Product", ALLOWED.product[data.product]],
    ["Material", ALLOWED.material[data.material]],
    ["Openings", String(openings)],
    ["Size", ALLOWED.size[data.size]],
    ["Glazing", ALLOWED.glazing[data.glazing]],
    ["Estimated range shown", estimate || "—"],
    ["Name", name],
    ["Phone", phone || "—"],
    ["Email", email || "—"],
    ["Message", message || "—"],
    ["Received", time + " (Vienna time)"]
  ];

  const text =
    "New quote request from the website\n\n" +
    rows.map(([k, v]) => k + ": " + v).join("\n") +
    "\n\nThe estimate is the demo range shown on the website, not a final price.";

  const html =
    '<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#121412;max-width:560px">' +
    '<h2 style="margin:0 0 16px;font-size:20px;color:#0F5C4A">New quote request</h2>' +
    '<table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%">' +
    rows.map(([k, v]) =>
      '<tr><td style="border-bottom:1px solid #e5e5e0;color:#5a5f5b;width:170px;vertical-align:top">' + escapeHtml(k) +
      '</td><td style="border-bottom:1px solid #e5e5e0;white-space:pre-wrap">' + escapeHtml(v) + "</td></tr>"
    ).join("") +
    "</table>" +
    '<p style="margin-top:16px;font-size:13px;color:#5a5f5b">The estimate is the demo range shown on the website, not a final price.</p>' +
    "</div>";

  const payload = {
    from: FROM,
    to: [to],
    subject: "Quote request: " + ALLOWED.product[data.product] + " — " + name,
    text,
    html
  };
  // Hitting "Reply" in your inbox answers the customer directly
  if (email) payload.reply_to = email;

  // 7. Ask Resend to send it
  try {
    const r = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!r.ok) {
      const detail = await r.text();
      console.error("Resend error", r.status, detail);   // visible in Vercel logs, not to visitors
      return reply(res, 502, { ok: false, error: "We couldn't send your request right now." });
    }

    return reply(res, 200, { ok: true });
  } catch (err) {
    console.error("Network error calling Resend", err);
    return reply(res, 502, { ok: false, error: "We couldn't send your request right now." });
  }
};
