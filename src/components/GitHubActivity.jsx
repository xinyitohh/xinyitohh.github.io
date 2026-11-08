import { useState, useEffect, useMemo } from "react";
import { ACCOUNTS, initialActivity, loadActivity } from "../lib/github";

const LEVEL_COLORS = [
  "bg-gray-100",
  "bg-green-200",
  "bg-green-300",
  "bg-green-500",
  "bg-green-700",
];

const formatDate = (iso) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

// Sum several accounts' days by date, then recompute levels from the combined counts.
const merge = (lists) => {
  const byDate = new Map();
  for (const list of lists)
    for (const d of list) byDate.set(d.date, (byDate.get(d.date) ?? 0) + d.count);
  const days = [...byDate.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, count]) => ({ date, count }));
  const max = Math.max(1, ...days.map((d) => d.count));
  return days.map((d) => ({
    ...d,
    level: d.count === 0 ? 0 : Math.min(4, Math.ceil((d.count / max) * 4)),
  }));
};

// Group days into columns of 7 (Sunday first), padding the first week.
const toWeeks = (days) => {
  const weeks = [];
  let week = new Array(new Date(days[0].date + "T00:00:00Z").getUTCDay()).fill(null);
  for (const d of days) {
    week.push(d);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) weeks.push(week);
  return weeks;
};

const GitHubActivity = () => {
  const [data, setData] = useState(initialActivity); // { [account]: contributions[] }
  const [view, setView] = useState("all");
  const [tip, setTip] = useState(null); // { day, x, y }

  useEffect(() => {
    let alive = true;
    loadActivity().then((fresh) => alive && setData(fresh));
    return () => { alive = false; };
  }, []);

  const available = ACCOUNTS.filter((a) => data?.[a]);
  const effView = view !== "all" && data?.[view] ? view : "all";

  const days = useMemo(() => {
    if (!data || available.length === 0) return null;
    return effView !== "all" ? merge([data[effView]]) : merge(available.map((a) => data[a]));
  }, [data, effView]); // eslint-disable-line react-hooks/exhaustive-deps

  const total = days?.reduce((sum, d) => sum + d.count, 0) ?? 0;
  const weeks = useMemo(() => (days ? toWeeks(days) : []), [days]);

  // Put a month label over the first week that starts a new month. Skip one that
  // would sit closer than 3 weeks to the previous label (a partial first month).
  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = -1;
    let lastCol = -10;
    weeks.forEach((week, i) => {
      const first = week.find(Boolean);
      if (!first) return;
      const month = new Date(first.date + "T00:00:00Z").getUTCMonth();
      if (month === lastMonth) return;
      lastMonth = month;
      if (i - lastCol < 3) return;
      lastCol = i;
      labels.push({
        col: i,
        text: new Date(first.date + "T00:00:00Z").toLocaleDateString("en-US", {
          month: "short",
          timeZone: "UTC",
        }),
      });
    });
    return labels;
  }, [weeks]);


  const show = (day) => (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTip({ day, x: r.left + r.width / 2, y: r.top });
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">GitHub activity</h2>
      <p className="text-sm text-gray-400 mb-4">
        {days ? `${total} contributions in the last year.` : "No activity to show yet."}
        {days && available.length < ACCOUNTS.length && (
          <span className="text-amber-500">
            {" "}Showing {available.map((a) => `@${a}`).join(", ")} only; the other account couldn&apos;t load.
          </span>
        )}
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        {[["all", "Combined"], ...available.map((a) => [a, `@${a}`])].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setView(key)}
            className={`px-3 py-1 rounded-full text-xs border transition-colors ${
              effView === key
                ? "bg-indigo-600 border-indigo-600 text-white"
                : "border-gray-200 text-gray-500 hover:border-indigo-300"
            }`}
          >
            {label}
          </button>
        ))}
        {effView !== "all" && (
          <a
            href={`https://github.com/${effView}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-1 py-1 text-xs text-gray-400 hover:text-indigo-500 transition-colors"
          >
            Open profile ↗
          </a>
        )}
      </div>

      {days && (
        <>
          <div className="overflow-x-auto pb-2" onScroll={() => setTip(null)}>
            <div className="flex gap-2 w-max">
              {/* Weekday labels: rows are 11px + 3px gap, below the 16px month row */}
              <div className="flex flex-col gap-[3px] pt-5 text-[10px] leading-[11px] text-gray-400">
                {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
                  <div key={i} className="h-[11px] w-6">{d}</div>
                ))}
              </div>

              <div>
                <div className="relative h-4 mb-1 text-[10px] text-gray-400">
                  {monthLabels.map(({ col, text }) => (
                    <span key={col} className="absolute" style={{ left: col * 14 }}>
                      {text}
                    </span>
                  ))}
                </div>
                <div className="flex gap-[3px] w-max" onMouseLeave={() => setTip(null)}>
                  {weeks.map((week, i) => (
                    <div key={i} className="flex flex-col gap-[3px]">
                      {week.map((day, j) =>
                        day ? (
                          <div
                            key={j}
                            onMouseEnter={show(day)}
                            className={`w-[11px] h-[11px] rounded-sm hover:ring-1 hover:ring-gray-500 ${LEVEL_COLORS[day.level]}`}
                          />
                        ) : (
                          <div key={j} className="w-[11px] h-[11px]" />
                        )
                      )}
                    </div>
                  ))}
                </div>

                {/* Inside the grid column, so it lines up with the heatmap's right edge */}
                <div className="flex items-center justify-end gap-1.5 mt-3 text-[10px] text-gray-400">
                  Less
                  {LEVEL_COLORS.map((c) => (
                    <span key={c} className={`w-[11px] h-[11px] rounded-sm ${c}`} />
                  ))}
                  More
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {tip && (
        <div
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full -mt-2 px-2.5 py-1.5 rounded-md bg-gray-900 text-white text-xs whitespace-nowrap shadow-lg"
          style={{ left: tip.x, top: tip.y }}
        >
          <span className="font-semibold">
            {tip.day.count === 0
              ? "No contributions"
              : `${tip.day.count} contribution${tip.day.count === 1 ? "" : "s"}`}
          </span>{" "}
          <span className="text-gray-400">on {formatDate(tip.day.date)}</span>
        </div>
      )}
    </section>
  );
};

export default GitHubActivity;
