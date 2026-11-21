/**
 * Cloudflare Pages Function – POST /api/contact
 * Nhận form liên hệ + newsletter, chống spam, gửi email qua Resend (https://resend.com).
 *
 * Biến môi trường (Pages > Settings > Variables and Secrets):
 *   RESEND_API_KEY   (Secret)  – API key Resend
 *   CONTACT_TO       (Text)    – email nhận, có thể nhiều email cách nhau bằng dấu phẩy
 *   CONTACT_FROM     (Text)    – vd: "IEPVN Website <no-reply@iepvn.com>" (domain đã verify trên Resend)
 *   TURNSTILE_SECRET (Secret)  – tuỳ chọn, bật Cloudflare Turnstile chống bot
 */
const MAX = { name: 120, email: 160, company: 160, position: 120, phone: 40, message: 5000, audience: 40 };

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);

export async function onRequestPost({ request, env }) {
  // Chỉ nhận từ chính website
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return json({ error: "Forbidden" }, 403);
  }

  let form;
  try { form = await request.formData(); } catch { return json({ error: "Invalid form data." }, 400); }

  // Honeypot: bot điền vào ô ẩn -> giả vờ thành công
  if ((form.get("website") || "").toString().trim()) return json({ ok: true });

  const type = form.get("type") === "newsletter" ? "newsletter" : "contact";
  const data = {};
  for (const k of Object.keys(MAX)) data[k] = (form.get(k) || "").toString().trim().slice(0, MAX[k]);

  if (!isEmail(data.email)) return json({ error: "Please enter a valid email address." }, 400);
  if (type === "contact") {
    for (const k of ["name", "company", "phone", "message"]) {
      if (!data[k]) return json({ error: "Please fill in all required fields." }, 400);
    }
  }

  // Cloudflare Turnstile (nếu đã cấu hình)
  if (env.TURNSTILE_SECRET) {
    const token = form.get("cf-turnstile-response");
    const v = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token || "", remoteip: request.headers.get("CF-Connecting-IP") || "" }),
    }).then((r) => r.json()).catch(() => ({ success: false }));
    if (!v.success) return json({ error: "Verification failed. Please try again." }, 400);
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
    return json({ error: "The contact form is not configured yet. Please try again later." }, 503);
  }

  const rows = type === "newsletter"
    ? [["Email", data.email]]
    : [["I am", data.audience], ["Name", data.name], ["Email", data.email], ["Company", data.company],
       ["Position", data.position], ["Phone", data.phone], ["Message", data.message]];
  const htmlBody = `<h2>${type === "newsletter" ? "New newsletter signup" : "New contact request"} – iepvn.com</h2>
<table cellpadding="6" style="border-collapse:collapse">${rows.map(([k, v]) =>
    `<tr><td style="border:1px solid #ddd"><b>${esc(k)}</b></td><td style="border:1px solid #ddd;white-space:pre-wrap">${esc(v || "-")}</td></tr>`).join("")}</table>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: env.CONTACT_TO.split(",").map((s) => s.trim()).filter(Boolean),
      reply_to: data.email,
      subject: type === "newsletter"
        ? `[IEPVN] Newsletter signup: ${data.email}`
        : `[IEPVN] ${data.audience || "Contact"} – ${data.name} (${data.company})`,
      html: htmlBody,
    }),
  });
  if (!res.ok) return json({ error: "Could not send your message. Please try again later." }, 502);
  return json({ ok: true });
}

export function onRequest() {
  return json({ error: "Method not allowed" }, 405);
}
