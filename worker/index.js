// Cloudflare Worker: keeps the WakaTime OAuth token on the server and gives the website the same
// shapes as the Embeddable Charts JSON, but live instead of once a night.
//
//   GET /?range=7d | 30d | 1y | all
//   -> { days, languages, categories, editors, os, summary }   (summary only for "all")
//
// Secret:  WAKATIME_TOKEN     (npx wrangler secret put WAKATIME_TOKEN)
//          A personal OAuth token from wakatime.com/oauth. WakaTime's plain API key only works
//          for editor plugins ("API Keys are only for plugins"), so it is rejected here.
// Var:     TZ                 (wrangler.toml, the timezone your WakaTime account uses)

const API = "https://wakatime.com/api/v1/users/current";
const DAYS = { "7d": 7, "30d": 30, "1y": 365 };

const json = (body, status = 200, extra = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*", // the data is public on the website anyway
      ...extra,
    },
  });

const wakaGet = async (path, token) => {
  const res = await fetch(`${API}${path}`, { headers: { authorization: `Bearer ${token}` } });
  if (!res.ok) {
    // WakaTime's own explanation (never contains the key) tells a bad key from a plan limit
    const why = (await res.text().catch(() => "")).replace(/\s+/g, " ").slice(0, 200);
    throw new Error(`WakaTime ${res.status} for ${path.split("?")[0]}: ${why}`);
  }
  return res.json();
};

// YYYY-MM-DD for "n days ago" in the given timezone.
const dateAgo = (n, tz) => {
  const d = new Date(Date.now() - n * 86400000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(d);
};

// Add up a per-day breakdown (languages, editors, ...) into one list with percentages.
const roll = (days, field) => {
  const total = new Map();
  for (const d of days) for (const item of d[field] ?? []) total.set(item.name, (total.get(item.name) ?? 0) + item.total_seconds);
  const sum = [...total.values()].reduce((a, b) => a + b, 0);
  return [...total.entries()]
    .map(([name, total_seconds]) => ({ name, total_seconds, percent: sum ? (total_seconds / sum) * 100 : 0 }))
    .sort((a, b) => b.percent - a.percent);
};

const fromAllTime = (data) => {
  const list = (items) => (items ?? []).map((i) => ({ name: i.name, percent: i.percent, total_seconds: i.total_seconds }));
  return {
    // WakaTime computes all-time stats on the first request; until then they come back empty
    pending: data.is_up_to_date === false || !data.total_seconds,
    summary: {
      best_day: data.best_day,
      grand_total: { total_seconds: data.total_seconds, daily_average: data.daily_average },
      range: { range: "all_time", days_minus_holidays: data.days_minus_holidays },
    },
    days: [],
    languages: list(data.languages),
    categories: list(data.categories),
    editors: list(data.editors),
    os: list(data.operating_systems),
  };
};

// How much of everyone's coding time is AI-assisted, from WakaTime's aggregated stats over all
// users. (Its per-language AI fields come back as 0, so the "AI Coding" vs "Coding" categories are used.)
const everyone = async (token) => {
  const { data } = await wakaGet("/../../stats/last_7_days", token); // resolves to /api/v1/stats/last_7_days
  const sum = (name) => data.categories?.find((c) => c.name === name)?.sum?.seconds ?? 0;
  const ai = sum("AI Coding");
  const manual = sum("Coding");
  return { ai_share: ai + manual ? (ai / (ai + manual)) * 100 : null, people: data.total?.count?.text ?? null };
};

const build = async (range, token, tz) => {
  if (range === "avg") return everyone(token);
  if (range === "all") {
    const { data } = await wakaGet("/stats/all_time", token);
    const out = fromAllTime(data);
    if (out.pending) {
      // WakaTime is still computing all-time stats. Meanwhile build the same summary from the
      // last year of daily data, which is everything there is for an account this young.
      const year = await build("1y", token, tz);
      const worked = year.days.filter((d) => d.grand_total.total_seconds > 0);
      const total = worked.reduce((sum, d) => sum + d.grand_total.total_seconds, 0);
      const best = worked.reduce((top, d) => (d.grand_total.total_seconds > (top?.grand_total.total_seconds ?? 0) ? d : top), null);
      return {
        ...year,
        pending: true,
        days: [],
        summary: {
          best_day: best && { date: best.range.date, total_seconds: best.grand_total.total_seconds, text: best.grand_total.text },
          grand_total: { total_seconds: total, daily_average: worked.length ? total / worked.length : 0 },
          range: { range: "all_time", days_minus_holidays: worked.length },
        },
      };
    }
    return out;
  }
  const n = DAYS[range];
  const { data } = await wakaGet(`/summaries?start=${dateAgo(n - 1, tz)}&end=${dateAgo(0, tz)}&timezone=${encodeURIComponent(tz)}`, token);
  return {
    // grand_total is passed through whole, so the AI fields (ai_additions, ...) arrive when WakaTime has them
    days: data.map((d) => ({ range: { date: d.range.date }, grand_total: d.grand_total })),
    languages: roll(data, "languages"),
    categories: roll(data, "categories"),
    editors: roll(data, "editors"),
    os: roll(data, "operating_systems"),
  };
};

export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") return json({}, 204, { "access-control-allow-methods": "GET" });
    const range = new URL(request.url).searchParams.get("range");

    if (!range || !(range === "all" || range === "avg" || range in DAYS)) return json({ error: "range must be 7d, 30d, 1y, all or avg" }, 400);
    if (!env.WAKATIME_TOKEN) return json({ error: "WAKATIME_TOKEN is not set" }, 500);

    // A few minutes of caching: fresh enough, and a busy day can't use up the API's rate limit.
    const cache = caches.default;
    const cacheKey = new Request(new URL(request.url).toString());
    const hit = await cache.match(cacheKey);
    if (hit) return hit;

    try {
      const body = await build(range, env.WAKATIME_TOKEN, env.TZ || "UTC");
      // an estimate (all-time still computing) is cached only briefly, so the real numbers appear soon
      const res = json(body, 200, { "cache-control": `public, max-age=${range === "avg" ? 3600 : body.pending ? 60 : 300}` });
      ctx.waitUntil(cache.put(cacheKey, res.clone()));
      return res;
    } catch (err) {
      return json({ error: String(err.message) }, 502); // the website falls back to the share links
    }
  },
};
