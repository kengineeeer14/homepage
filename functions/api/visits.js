export async function onRequestGet(context) {
  const kv = context.env.VISITS_KV;

  if (!kv) {
    return new Response(JSON.stringify({ today: null, total: null }), {
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }

  const today = new Date().toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\//g, "-"); // JST の YYYY-MM-DD
  const todayKey = `day:${today}`;

  const [todayStr, totalStr] = await Promise.all([
    kv.get(todayKey),
    kv.get("total"),
  ]);

  const todayCount = parseInt(todayStr ?? "0") + 1;
  const totalCount = parseInt(totalStr ?? "0") + 1;

  await Promise.all([
    kv.put(todayKey, String(todayCount), { expirationTtl: 7 * 86400 }),
    kv.put("total", String(totalCount)),
  ]);

  return new Response(JSON.stringify({ today: todayCount, total: totalCount }), {
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
