import { useState, useEffect, useRef } from "react";
import { LANGUAGE_ICONS } from "../constants/skillIcons";
import { iconFor } from "../constants/wakaIcons";

// Public WakaTime "Embeddable Charts" JSON links (no API key involved).
// A link's date range is fixed when you create it on wakatime.com, so each range has
// its own pair of links. Anything whose id is null is hidden automatically.
const BASE = "https://wakatime.com/share/@4d5e5356-50da-4018-a0d9-00fe9a25f909";
// Optional live source: a Cloudflare Worker that holds the API key (see worker/). When set it is
// tried first, because the share links below only update once a night. If it is missing or
// fails, everything falls back to the share links.
const PROXY = (import.meta.env.VITE_WAKA_PROXY ?? "").replace(/\/$/, "");
const urlOf = (id) => `${BASE}/${id}.json`;

const RANGES = [
  {
    key: "7d", label: "7 days", long: "Last 7 days",
    activity: "739f412d-f612-43ef-9809-066c0bdeff7a",
    languages: "0cc039e2-f82c-4c21-b8e8-0eb7fa44b4b9",
  },
  {
    key: "30d", label: "30 days", long: "Last 30 days",
    activity: "f9de2397-97eb-4504-b114-b399b765780e",
    languages: "997fd181-bf97-4049-ab7a-004b170670d0",
  },
  {
    key: "1y", label: "Year", long: "Last year",
    activity: "f3d40754-2770-4d99-9761-3b05698857fa",
    languages: "53c515fe-1074-4b2d-8b00-a4a6bdbe0c57",
  },
  {
    // "All time" is a single summary object, not one entry per day.
    key: "all", label: "All time", long: "All time", summary: true,
    activity: "8a02a087-3202-495d-abe9-358d32849127",
    languages: "2cebbd20-e5ca-46c3-9a8a-2c2441a414af",
  },
];

// Extra breakdown charts, one link per date range (same order as RANGES above).
// They are loaded only when that range is selected.
const EXTRAS = [
  {
    key: "categories", title: "Categories",
    ids: {
      "7d": "971562a4-673a-4bd8-b664-a24c2bbc500d",
      "30d": "5b1400af-fa5f-4a72-aaf1-65164a7577ea",
      "1y": "c680d89a-4fc4-4744-ba0e-e9836b24e20d",
      all: "2930c3e0-b65b-4f05-bb7a-7424a962608b",
    },
  },
  {
    key: "editors", title: "Editors",
    ids: {
      "7d": "50d97f1c-dc23-4dc4-98a0-d24b4aeabe9e",
      "30d": "e7fa1cd0-096c-4412-aa72-edff0fee2d4f",
      "1y": "adad91ec-e51e-4f3f-bb60-c49ffd699bce",
      all: "c70b6bd3-9fcf-4808-a503-397b424b6014",
    },
  },
  {
    key: "os", title: "Operating systems",
    ids: {
      "7d": "9c267383-cc06-47a5-a5a1-640cc384551b",
      "30d": "89bc4e0a-6154-4d8a-ad57-30fd05e3367b",
      "1y": "2c0885d4-2e8e-4b82-8f58-82354736aacc",
      all: "8e7e5abe-afcf-45c1-b431-d202ba494360",
    },
  },
];

const BAR_MAX_PX = 104; // height of the tallest bar
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ---------- local-only preview ----------
// Open the site as http://127.0.0.1:5173/?wakademo to see this section with sample
// data in every range. `import.meta.env.DEV` is false in the production build, so none
// of this ships.
const DEMO =
  import.meta.env.DEV && new URLSearchParams(window.location.search).has("wakademo");

const demoData = () => {
  const per = (list) => ({ "7d": list, "30d": list, "1y": list, all: list });
  const make = (n) =>
    Array.from({ length: n }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (n - 1 - i));
      const date = d.toLocaleDateString("en-CA");
      const h = i % 6 === 3 ? 0 : ((i * 37) % 11) / 11 * 6 + 0.4;
      const lines = Math.round(h * 90);
      return {
        range: { date, text: date },
        grand_total: {
          total_seconds: h * 3600,
          human_additions: Math.round(lines * 0.62),
          ai_additions: Math.round(lines * 0.38),
          ai_sessions: h > 0 ? 1 + (i % 3) : 0,
          ai_model_total_cost: h * 0.35,
        },
      };
    });
  const langs = [
    { name: "JavaScript", percent: 46.2 },
    { name: "Dart", percent: 27.5 },
    { name: "Python", percent: 14.1 },
    { name: "CSS", percent: 8.0 },
    { name: "JSON", percent: 4.2 },
  ];
  return {
    "7d": { days: make(7), langs },
    "30d": { days: make(30), langs },
    "1y": { days: make(365), langs },
    all: {
      summary: {
        best_day: { date: "2026-11-03", total_seconds: 6.1 * 3600, text: "6 hrs 6 mins" },
        grand_total: { total_seconds: 412 * 3600, daily_average: 2.4 * 3600 },
        range: { range: "all_time", days_minus_holidays: 171 },
      },
      langs,
    },
    extras: {
      categories: per([
        { name: "Coding", percent: 78, total_seconds: 321 * 3600 },
        { name: "AI Coding", percent: 14, total_seconds: 58 * 3600 },
        { name: "Debugging", percent: 8, total_seconds: 33 * 3600 },
      ]),
      editors: per([
        { name: "Antigravity IDE", percent: 61 },
        { name: "VS Code", percent: 27 },
        { name: "Claude Code", percent: 12 },
      ]),
      os: per([
        { name: "Windows", percent: 64 },
        { name: "Mac", percent: 24 },
        { name: "Linux", percent: 12 },
      ]),
    },
  };
};

// ---------- helpers ----------
const getJson = (url, signal) =>
  fetch(url, { signal }).then((res) => (res.ok ? res.json() : Promise.reject()));

const hoursText = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

// Compact label above a bar: "5.6h" / "45m" / "".
const shortLabel = (seconds) => {
  if (seconds <= 0) return "";
  if (seconds < 3600) return `${Math.max(1, Math.round(seconds / 60))}m`;
  return `${(seconds / 3600).toFixed(1).replace(/\.0$/, "")}h`;
};

const parse = (iso) => new Date(iso + "T00:00:00");
const fmt = (iso, opts) => parse(iso).toLocaleDateString("en-US", opts);
const secondsOf = (d) => d.grand_total?.total_seconds ?? 0;
const num = (n) => Math.round(n).toLocaleString("en-US");

// Turn daily data into the bars to draw. A year is grouped by week so it stays readable.
const buildBars = (rangeKey, days, todayIso) => {
  if (rangeKey === "all") {
    // "All time" has no daily data of its own, so show the last 12 months by month.
    const months = new Map();
    for (const d of days) {
      const key = d.range.date.slice(0, 7);
      months.set(key, (months.get(key) ?? 0) + secondsOf(d));
    }
    return [...months.entries()].map(([key, seconds]) => ({
      key, seconds,
      tick: fmt(`${key}-01`, { month: "short" }),
      isToday: key === todayIso.slice(0, 7), // highlight the current month
      tip: fmt(`${key}-01`, { month: "long", year: "numeric" }),
    }));
  }
  if (rangeKey === "1y") {
    const weeks = new Map();
    for (const d of days) {
      const dt = parse(d.range.date);
      dt.setDate(dt.getDate() - ((dt.getDay() + 6) % 7)); // back to Monday
      const key = dt.toLocaleDateString("en-CA");
      weeks.set(key, (weeks.get(key) ?? 0) + secondsOf(d));
    }
    let lastMonth = -1;
    return [...weeks.entries()].map(([start, seconds]) => {
      const month = parse(start).getMonth();
      const tick = month !== lastMonth ? fmt(start, { month: "short" }) : "";
      lastMonth = month;
      return {
        key: start, seconds, tick,
        tip: `Week of ${fmt(start, { month: "short", day: "numeric" })}`,
      };
    });
  }
  const n = days.length;
  return days.map((d, i) => {
    const iso = d.range.date;
    const isToday = iso === todayIso;
    let tick = "";
    if (rangeKey === "7d") tick = isToday ? "Today" : fmt(iso, { weekday: "short" });
    else if ((n - 1 - i) % 5 === 0) tick = isToday ? "Today" : fmt(iso, { month: "short", day: "numeric" });
    return {
      key: iso, seconds: secondsOf(d), tick, isToday,
      tip: fmt(iso, { weekday: "short", month: "short", day: "numeric" }),
    };
  });
};

// Average coding time for each weekday (Mon..Sun) across the days in the range.
const weekdayAverages = (days) => {
  const sum = Array(7).fill(0);
  const count = Array(7).fill(0);
  for (const d of days) {
    const w = (parse(d.range.date).getDay() + 6) % 7;
    sum[w] += secondsOf(d);
    count[w] += 1;
  }
  return sum.map((s, i) => (count[i] ? s / count[i] : 0));
};

// AI vs hand-written lines and AI usage, from the per-day fields WakaTime already includes.
const aiStats = (days) => {
  let ai = 0, human = 0, sessions = 0, cost = 0, tokensIn = 0, tokensOut = 0, prompts = 0, promptChars = 0;
  const models = new Map();
  for (const d of days) {
    const g = d.grand_total ?? {};
    ai += g.ai_additions ?? 0;
    human += g.human_additions ?? 0;
    sessions += g.ai_sessions ?? 0;
    cost += g.ai_model_total_cost ?? 0;
    tokensIn += (g.ai_input_tokens ?? 0) + (g.ai_cached_input_tokens ?? 0);
    tokensOut += g.ai_output_tokens ?? 0;
    prompts += g.ai_prompt_events_total ?? 0;
    promptChars += g.ai_prompt_length_sum ?? 0;
    for (const m of g.ai_model_breakdown ?? []) {
      const cur = models.get(m.name) ?? { name: m.name, lines: 0, cost: 0 };
      cur.lines += m.lines ?? 0;
      cur.cost += m.cost ?? 0;
      models.set(m.name, cur);
    }
  }
  return {
    ai, human, sessions, cost, lines: ai + human,
    tokens: tokensIn + tokensOut, tokensIn, tokensOut, prompts,
    avgPrompt: prompts ? promptChars / prompts : 0,
    models: [...models.values()].sort((x, y) => y.lines - x.lines),
  };
};

// 1234 -> "1.2K", 50600000 -> "50.6M"
const compact = (n) =>
  n >= 1e6 ? `${(n / 1e6).toFixed(1).replace(/\.0$/, "")}M`
  : n >= 1e3 ? `${(n / 1e3).toFixed(1).replace(/\.0$/, "")}K`
  : String(Math.round(n));

// ---------- small components ----------
const Card = ({ className = "", children }) => (
  <div className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ${className}`}>{children}</div>
);

const CardTitle = ({ children, sub }) => (
  <div className="flex items-baseline justify-between mb-4">
    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{children}</p>
    {sub && <p className="text-[11px] text-gray-300">{sub}</p>}
  </div>
);

const Stat = ({ label, value, sub }) => (
  <div className="min-w-0">
    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 truncate">{label}</p>
    <p className="text-xl font-bold text-gray-900 leading-tight mt-0.5">{value}</p>
    <p className="text-xs text-gray-400 h-4 truncate">{sub}</p>
  </div>
);

const MiniStat = ({ label, value, sub }) => (
  <div className="min-w-0">
    <p className="text-[11px] uppercase tracking-wider text-gray-400">{label}</p>
    <p className="text-base font-semibold text-gray-900 leading-tight tabular-nums break-words">{value}</p>
    {sub && <p className="text-[11px] leading-snug text-gray-400 break-words">{sub}</p>}
  </div>
);

// One row of a breakdown list (languages, editors, categories, OS).
const BreakdownRow = ({ item, Icon, iconClass = "text-gray-500" }) => {
  const time = item.total_seconds > 0 ? hoursText(item.total_seconds) : null;
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <span className={`w-5 h-5 flex items-center justify-center flex-shrink-0 ${iconClass}`}>
          {Icon ? <Icon size={18} /> : <span className="w-2 h-2 rounded-full bg-gray-300" />}
        </span>
        <span className="text-sm font-medium text-gray-700 truncate">{item.name}</span>
        <span className="ml-auto text-xs text-gray-400 tabular-nums">
          {time && <span className="mr-2">{time}</span>}
          <span className="font-semibold text-gray-600">{Math.round(item.percent)}%</span>
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-violet-500 animate-grow-x"
          style={{ width: `${Math.max(2, item.percent)}%` }}
        />
      </div>
    </div>
  );
};

const topItems = (list, n = 6) =>
  [...(list ?? [])].filter((l) => l.name && l.percent > 0).sort((a, b) => b.percent - a.percent).slice(0, n);

// Greyed-out rows shown instead of a blank card while there is nothing to show yet.
const EmptyRows = ({ n = 3, note = "No data yet" }) => (
  <div>
    <div className="space-y-3.5" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <div key={i}>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-gray-200" />
            </span>
            <span className="h-3 rounded bg-gray-100" style={{ width: `${58 - i * 12}%` }} />
            <span className="ml-auto text-xs text-gray-300">–</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100" />
        </div>
      ))}
    </div>
    <p className="text-xs text-gray-400 mt-4">{note}</p>
  </div>
);

// ---------- main ----------
const WakaTime = () => {
  const [data, setData] = useState({}); // { [rangeKey]: { days | summary, langs }, extras: {} }
  const [picked, setPicked] = useState(null);
  const [tip, setTip] = useState(null); // { x, y, text }
  const requested = useRef(new Set());
  const [everyone, setEveryone] = useState(null); // { ai_share, people } across all WakaTime users

  useEffect(() => {
    if (!PROXY || DEMO) return;
    const controller = new AbortController();
    getJson(`${PROXY}/?range=avg`, controller.signal).then(setEveryone).catch(() => {});
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (DEMO) {
      setData(demoData());
      return;
    }
    const controller = new AbortController();
    const { signal } = controller;
    const put = (key, patch) =>
      setData((prev) => ({ ...prev, [key]: { days: [], langs: [], ...prev[key], ...patch } }));

    // Share-link fallback. Every chart is fetched separately so one failing doesn't hide the others.
    const fromShareLinks = (r) => {
      if (r.activity)
        getJson(urlOf(r.activity), signal)
          .then((j) => {
            if (r.summary) put(r.key, { summary: j.data && !Array.isArray(j.data) ? j.data : null });
            else put(r.key, { days: Array.isArray(j.data) ? j.data : [] });
          })
          .catch(() => {});
      if (r.languages)
        getJson(urlOf(r.languages), signal)
          .then((j) => put(r.key, { langs: Array.isArray(j.data) ? j.data : [] }))
          .catch(() => {});
    };

    RANGES.forEach((r) => {
      if (!PROXY) return fromShareLinks(r);
      getJson(`${PROXY}/?range=${r.key}`, signal)
        .then((j) => {
          put(r.key, r.summary ? { summary: j.summary, langs: j.languages } : { days: j.days, langs: j.languages });
          setData((prev) => ({
            ...prev,
            extras: Object.fromEntries(
              EXTRAS.map((x) => [x.key, { ...prev.extras?.[x.key], [r.key]: j[x.key] ?? [] }])
            ),
          }));
          EXTRAS.forEach((x) => requested.current.add(`${x.key}:${r.key}`)); // no share-link fetch needed
        })
        .catch(() => {
          if (signal.aborted) return;
          fromShareLinks(r);
          loadExtras(r.key);
        });
    });
    return () => controller.abort();
  }, []);

  const tabs = RANGES.filter((r) => r.activity);
  const totalOf = (r) =>
    r.summary
      ? data[r.key]?.summary?.grand_total?.total_seconds ?? 0
      : (data[r.key]?.days ?? []).reduce((a, d) => a + secondsOf(d), 0);

  // Until the visitor picks one, open the first range that has something to show.
  const range = picked ?? RANGES.find((r) => totalOf(r) > 0)?.key ?? "7d";

  // Load the extra breakdown charts for one range from the share links, once per range. These
  // are not aborted on unmount: React StrictMode runs effects twice in dev, and an
  // aborted first run would never be retried.
  const loadExtras = (rangeKey) => {
    EXTRAS.forEach((x) => {
      const id = x.ids[rangeKey];
      const tag = `${x.key}:${rangeKey}`;
      if (!id || requested.current.has(tag)) return;
      requested.current.add(tag);
      getJson(urlOf(id))
        .then((j) => {
          const list = Array.isArray(j.data) ? j.data : [];
          setData((prev) => ({
            ...prev,
            extras: { ...prev.extras, [x.key]: { ...prev.extras?.[x.key], [rangeKey]: list } },
          }));
        })
        .catch(() => requested.current.delete(tag)); // allow a retry next time
    });
  };

  // With the live proxy the extras arrive with each range; without it, load them as ranges are picked.
  useEffect(() => {
    if (DEMO || PROXY) return; // sample data already includes these; the proxy supplies its own
    loadExtras(range);
  }, [range]);

  // Nothing tracked in any range yet: hide the whole section.
  if (!RANGES.some((r) => totalOf(r) > 0)) return null;
  const cfg = RANGES.find((r) => r.key === range) ?? RANGES[0];
  const days = data[range]?.days ?? [];
  const summary = data[range]?.summary;
  const todayIso = new Date().toLocaleDateString("en-CA");

  const seconds = days.map(secondsOf);
  const total = cfg.summary ? summary?.grand_total?.total_seconds ?? 0 : seconds.reduce((a, b) => a + b, 0);
  const bestSeconds = Math.max(0, ...seconds);
  const bestDay = days[seconds.indexOf(bestSeconds)]?.range?.date;

  const bars = buildBars(range, cfg.summary ? data["1y"]?.days ?? [] : days, todayIso);
  const maxBar = Math.max(1, ...bars.map((b) => b.seconds));
  const chartTotal = bars.reduce((a, b) => a + b.seconds, 0);
  const dense = range === "30d" || range === "1y";
  const gap = range === "1y" ? "gap-px" : range === "30d" ? "gap-[3px]" : "gap-2";

  const topLangs = topItems(data[range]?.langs);

  // Derived cards need per-day data. "All time" has none, so it borrows the last
  // 12 months from the year link.
  const derivedDays = cfg.summary ? data["1y"]?.days ?? [] : days;
  const derivedLabel = cfg.summary ? "last year" : cfg.long.toLowerCase();
  const showDerived = derivedDays.some((d) => secondsOf(d) > 0);
  const wd = showDerived ? weekdayAverages(derivedDays) : Array(7).fill(0);
  const wdMax = Math.max(...wd);
  const ai = aiStats(derivedDays); // all zeros when there are no days yet

  // Share of coding time spent with AI: me vs. everyone on WakaTime. This is by time, not by
  // lines, so it is not the same number as WakaTime's own "vs. average user" card.
  const cats = data.extras?.categories?.[range] ?? [];
  const catValue = (name) => {
    const c = cats.find((x) => x.name === name);
    return c ? c.total_seconds ?? c.percent ?? 0 : 0;
  };
  const myAiShare = catValue("AI Coding") + catValue("Coding") > 0
    ? (catValue("AI Coding") / (catValue("AI Coding") + catValue("Coding"))) * 100
    : null;

  const show = (text) => (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTip({ x: r.left + r.width / 2, y: r.top, text });
  };

  // "All time" best_day shape is not documented; read it defensively.
  const best = summary?.best_day;
  const allBestValue = best?.text ?? (best?.total_seconds ? hoursText(best.total_seconds) : "–");
  const allBestSub = best?.date ? fmt(best.date, { month: "short", day: "numeric", year: "numeric" }) : "";

  return (
    <section className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-100">
      <div className="flex items-baseline justify-between mb-2">
        <h2 className="text-2xl font-bold text-gray-900">Coding time</h2>
        <a
          href="https://wakatime.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-400 hover:text-indigo-500 transition-colors"
        >
          WakaTime ↗
        </a>
      </div>
      <p className="text-sm text-gray-400 mb-4">
        Tracked automatically while I code. {PROXY ? "Updates every few minutes." : "Updates daily."}
      </p>

      {tabs.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {tabs.map((r) => (
            <button
              key={r.key}
              onClick={() => { setPicked(r.key); setTip(null); }}
              className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                range === r.key
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "border-gray-200 text-gray-500 hover:border-indigo-300"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-5">
        {/* Activity */}
        <Card className="md:col-span-3">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {cfg.summary ? (
              <>
                <Stat
                  label="All time"
                  value={hoursText(total)}
                  sub={summary?.range?.days_minus_holidays ? `${summary.range.days_minus_holidays} days tracked` : ""}
                />
                <Stat label="Daily average" value={hoursText(summary?.grand_total?.daily_average ?? 0)} />
                <Stat label="Best day" value={allBestValue} sub={allBestSub} />
              </>
            ) : (
              <>
                <Stat label={cfg.long} value={hoursText(total)} sub={`${days.length} days tracked`} />
                <Stat label="Daily average" value={hoursText(days.length ? total / days.length : 0)} />
                <Stat
                  label="Best day"
                  value={hoursText(bestSeconds)}
                  sub={
                    bestDay
                      ? fmt(bestDay, range === "7d" ? { weekday: "long" } : { month: "short", day: "numeric" })
                      : ""
                  }
                />
              </>
            )}
          </div>

          {chartTotal === 0 ? (
            <p className="text-sm text-gray-400 py-10 text-center">
              {cfg.summary ? "A monthly chart will appear once there is some coding history." : "No coding tracked in this period."}
            </p>
          ) : (
            <>
              {cfg.summary && (
                <p className="text-[11px] text-gray-300 mb-2 text-right">by month · last year</p>
              )}
              <div className="relative" style={{ height: BAR_MAX_PX + 20 }}>
                {/* faint gridlines at the top and middle of the bar area */}
                <div className="absolute inset-x-0 border-t border-dashed border-gray-100" style={{ bottom: BAR_MAX_PX }} />
                <div className="absolute inset-x-0 border-t border-dashed border-gray-100" style={{ bottom: BAR_MAX_PX / 2 }} />

                {/* key={range} replays the grow-in animation when switching ranges */}
                <div
                  key={range}
                  className={`relative flex items-end h-full ${gap}`}
                  onMouseLeave={() => setTip(null)}
                >
                  {bars.map((b, i) => {
                    const px = b.seconds > 0 ? Math.max(range === "1y" ? 2 : 6, (b.seconds / maxBar) * BAR_MAX_PX) : 2;
                    return (
                      <div
                        key={b.key}
                        onMouseEnter={show(`${b.tip}: ${b.seconds > 0 ? hoursText(b.seconds) : "no coding"}`)}
                        className="group flex-1 flex flex-col items-center justify-end h-full"
                      >
                        {!dense && (
                          <span className="text-[10px] font-medium text-gray-400 mb-1 h-3.5 tabular-nums group-hover:text-indigo-600 transition-colors">
                            {shortLabel(b.seconds)}
                          </span>
                        )}
                        <div
                          className={`w-full ${dense ? "" : "max-w-[44px]"} rounded-t-md animate-grow-y transition-[filter] ${
                            b.seconds === 0
                              ? "bg-gray-200"
                              : b.isToday
                                ? "bg-gradient-to-t from-indigo-600 to-violet-500 shadow-[0_1px_6px_rgba(124,58,237,0.2)]"
                                : "bg-gradient-to-t from-indigo-300 to-indigo-400 group-hover:from-indigo-500 group-hover:to-violet-500"
                          }`}
                          style={{ height: px, animationDelay: `${Math.min(i * (dense ? 8 : 40), 500)}ms` }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* axis labels, positioned over each bar so wide labels can overlap neighbours */}
              <div className="relative h-5 mt-2 border-t border-gray-100 pt-2">
                {bars.map((b, i) =>
                  b.tick ? (
                    <span
                      key={b.key}
                      className={`absolute text-[11px] whitespace-nowrap -translate-x-1/2 ${
                        b.isToday ? "font-semibold text-indigo-600" : "text-gray-400"
                      }`}
                      style={{ left: `${((i + 0.5) / bars.length) * 100}%` }}
                    >
                      {b.tick}
                    </span>
                  ) : null
                )}
              </div>
            </>
          )}
        </Card>

        {/* Languages */}
        <Card className="md:col-span-2">
          <CardTitle>Top languages</CardTitle>
          {topLangs.length > 0 ? (
            <div className="space-y-4" key={range}>
              {topLangs.map((l) => (
                <BreakdownRow key={l.name} item={l} Icon={LANGUAGE_ICONS[l.name]} />
              ))}
            </div>
          ) : (
            <EmptyRows n={4} note="No language data yet." />
          )}
        </Card>
      </div>

      {/* Second row: every card is always shown; empty ones get a placeholder */}
      <div className="grid gap-4 md:grid-cols-3 mt-4">
        {/* Tall on purpose: it spans two rows so the cards beside it form a tidy grid */}
        <Card className="md:row-span-2">
          <CardTitle sub={derivedLabel}>AI vs. me</CardTitle>
          {ai.lines > 0 ? (
            <div>
              <div>
              <p className="text-xl font-bold text-gray-900 leading-tight">
                {Math.round((ai.ai / ai.lines) * 100)}%
                <span className="text-sm font-medium text-gray-400"> of lines by AI</span>
              </p>
              <div className="flex h-2 rounded-full overflow-hidden bg-gray-100 mt-3 mb-3">
                <div className="bg-indigo-400 animate-grow-x" style={{ width: `${(ai.human / ai.lines) * 100}%`, transformOrigin: "left" }} />
                <div className="bg-violet-500 animate-grow-x" style={{ width: `${(ai.ai / ai.lines) * 100}%`, transformOrigin: "left" }} />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-400" />{num(ai.human)} by me</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-violet-500" />{num(ai.ai)} by AI</span>
              </div>
              {myAiShare != null && everyone?.ai_share != null && (
                <div className="mt-5 space-y-2">
                  <p className="text-[11px] uppercase tracking-wider text-gray-400">Time spent with AI</p>
                  {[["Me", myAiShare, "bg-violet-500"], ["Everyone", everyone.ai_share, "bg-gray-300"]].map(([label, pct, bar]) => (
                    <div key={label} className="flex items-center gap-2 text-xs">
                      <span className="w-14 text-gray-500">{label}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className={`h-full rounded-full ${bar}`} style={{ width: `${Math.max(2, pct)}%` }} />
                      </div>
                      <span className="w-9 text-right font-semibold text-gray-600 tabular-nums">{Math.round(pct)}%</span>
                    </div>
                  ))}
                  <p className="text-[11px] text-gray-400 leading-snug">
                    By time, not lines. Everyone: {everyone.people ?? "all WakaTime users"}.
                  </p>
                </div>
              )}
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-4 mt-5">
                {ai.tokens > 0 && <MiniStat label="Tokens" value={compact(ai.tokens)} sub={<><span className="block">{compact(ai.tokensIn)} in</span><span className="block">{compact(ai.tokensOut)} out</span></>} />}
                {ai.cost > 0 && <MiniStat label="AI spend" value={`$${ai.cost.toFixed(2)}`} />}
                {ai.prompts > 0 && <MiniStat label="Prompts" value={num(ai.prompts)} sub={`${num(ai.avgPrompt)} chars on average`} />}
                <MiniStat label="Sessions" value={num(ai.sessions)} />
              </div>
              {ai.models.length > 0 && (
                <div className="space-y-1.5 mt-5 pt-4 border-t border-gray-100">
                  {ai.models.slice(0, 4).map((m) => (
                    <p key={m.name} className="flex justify-between text-xs text-gray-500">
                      <span className="font-medium text-gray-700">{m.name}</span>
                      <span className="tabular-nums">{num(m.lines)} lines{m.cost > 0 && ` · $${m.cost.toFixed(2)}`}</span>
                    </p>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              <p className="text-xl font-bold text-gray-300 leading-tight">
                –<span className="text-sm font-medium text-gray-300"> of lines by AI</span>
              </p>
              <div className="h-2 rounded-full bg-gray-100 mt-3 mb-3" aria-hidden="true" />
              <p className="text-xs text-gray-400">No lines recorded yet.</p>
            </>
          )}
          {ai.lines === 0 && (
            <p className="text-xs text-gray-400 mt-3">
              {num(ai.sessions)} AI session{ai.sessions === 1 ? "" : "s"}
              {ai.cost > 0 && ` · $${ai.cost.toFixed(2)} spent`}
            </p>
          )}
        </Card>

        {EXTRAS.map((x) => {
          const list = data.extras?.[x.key]?.[range];
          const items = topItems(list, 4);
          return (
            <Card key={x.key}>
              <CardTitle sub={cfg.long.toLowerCase()}>{x.title}</CardTitle>
              {items.length > 0 ? (
                <div className="space-y-3.5">
                  {items.map((item) => (
                    <BreakdownRow
                      key={item.name}
                      item={item}
                      Icon={iconFor(x.key, item.name)}
                      iconClass={x.key === "categories" ? "text-indigo-500" : "text-gray-600"}
                    />
                  ))}
                </div>
              ) : (
                <EmptyRows note={list === undefined ? "Loading…" : "No data yet."} />
              )}
            </Card>
          );
        })}

        {/* One week has just one of each weekday, so this only makes sense for longer ranges */}
        {range !== "7d" && (
          <Card>
            <CardTitle sub="average per day">Busiest weekday</CardTitle>
            <div className="flex items-end gap-1.5 h-24" key={range}>
              {wd.map((s, i) => {
                const top = s > 0 && s === wdMax;
                return (
                  <div
                    key={WEEKDAYS[i]}
                    className="flex-1 flex flex-col items-center justify-end h-full"
                    onMouseEnter={show(`${WEEKDAYS[i]}: ${s > 0 ? hoursText(s) : "no coding"} on average`)}
                    onMouseLeave={() => setTip(null)}
                  >
                    <div
                      className={`w-full rounded-t animate-grow-y ${
                        top ? "bg-gradient-to-t from-indigo-600 to-violet-500" : "bg-gradient-to-t from-indigo-200 to-indigo-300"
                      }`}
                      style={{ height: wdMax ? Math.max(2, (s / wdMax) * 80) : 2, animationDelay: `${i * 40}ms` }}
                    />
                    <span className={`text-[10px] mt-1.5 ${top ? "font-semibold text-indigo-600" : "text-gray-400"}`}>
                      {WEEKDAYS[i][0]}
                    </span>
                  </div>
                );
              })}
            </div>
            {!showDerived && <p className="text-xs text-gray-400 mt-3">No data yet.</p>}
          </Card>
        )}
      </div>

      {tip && (
        <div
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full -mt-2 px-2.5 py-1.5 rounded-md bg-gray-900 text-white text-xs whitespace-nowrap shadow-lg"
          style={{ left: tip.x, top: tip.y }}
        >
          {tip.text}
        </div>
      )}
    </section>
  );
};

export default WakaTime;
