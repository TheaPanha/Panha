// Cloudflare Worker: ទទួលការកម្មង់ពីគេហទំព័រ ហើយផ្ញើទៅ Telegram Bot
// Settings > Variables: BOT_TOKEN (Secret), CHAT_ID, ALLOWED_ORIGIN (ជម្រើស)

export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: cors });

    let d;
    try { d = await request.json(); } catch { return new Response("Bad JSON", { status: 400, headers: cors }); }

    const clean = (v, n) => String(v || "").slice(0, n);
    const text =
      "🛒 ការកម្មង់ថ្មី\n" +
      `ទំនិញ: ${clean(d.product, 100)}\n` +
      `តម្លៃ: ${clean(d.price, 30)}\n` +
      `ឈ្មោះ: ${clean(d.name, 60)}\n` +
      `ទូរស័ព្ទ: ${clean(d.phone, 30)}`;

    const tg = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: env.CHAT_ID, text }),
    });

    return new Response(tg.ok ? "ok" : "telegram error", { status: tg.ok ? 200 : 502, headers: cors });
  },
};
