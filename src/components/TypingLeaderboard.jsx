import { useState, useEffect } from "react";
import { fetchTop } from "../lib/leaderboard";

const RANK_COLOR = ["text-amber-500", "text-gray-400", "text-orange-500"];

const ago = (date) => {
  if (!date) return "just now";
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

// Best score per name, plus the site owner's Monkeytype best as a pinned "boss" row.
const buildRows = (raw, ownerName, ownerPb) => {
  const best = new Map();
  for (const r of raw) {
    const key = r.name.toLowerCase();
    if (!best.has(key) || r.wpm > best.get(key).wpm) best.set(key, r);
  }
  const rows = [...best.values()];
  if (ownerPb != null) rows.push({ id: "owner", name: ownerName, wpm: ownerPb, owner: true });
  return rows.sort((a, b) => b.wpm - a.wpm).slice(0, 10);
};

const TypingLeaderboard = ({ mode, ownerName, ownerPb, myName, reloadKey }) => {
  const [raw, setRaw] = useState(null); // null while loading
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setRaw(null);
    setFailed(false);
    fetchTop(mode)
      .then((list) => !cancelled && setRaw(list))
      .catch(() => !cancelled && setFailed(true));
    return () => { cancelled = true; };
  }, [mode, reloadKey]);

  if (failed && ownerPb == null) {
    return <p className="text-sm text-gray-400 py-6 text-center">The leaderboard is unavailable right now.</p>;
  }

  const rows = raw ? buildRows(raw, ownerName, ownerPb) : [];
  const me = myName?.trim().toLowerCase();

  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <p className="text-sm font-semibold text-gray-900">Top {mode}s scores</p>
        {failed && <p className="text-xs text-amber-600">Showing my score only: could not load the others.</p>}
      </div>

      {raw === null && !failed ? (
        <div className="space-y-2" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <ol className="space-y-1.5">
          {rows.map((r, i) => {
            const mine = !r.owner && me && r.name.toLowerCase() === me;
            return (
              <li
                key={r.id}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${
                  mine ? "bg-indigo-50 ring-1 ring-indigo-200" : "bg-white border border-gray-100"
                }`}
              >
                <span className={`w-6 text-center text-sm font-bold tabular-nums ${RANK_COLOR[i] ?? "text-gray-300"}`}>
                  {i + 1}
                </span>
                <span className="flex-1 min-w-0 truncate text-sm font-medium text-gray-800">
                  {r.name}
                  {r.owner && (
                    <span className="ml-2 align-middle text-[10px] font-semibold uppercase tracking-wide text-indigo-600 bg-indigo-50 rounded px-1.5 py-0.5">
                      host
                    </span>
                  )}
                  {mine && <span className="ml-2 text-xs font-normal text-indigo-500">you</span>}
                </span>
                <span className="text-xs text-gray-400 tabular-nums hidden sm:block w-16 text-right">
                  {r.acc != null ? `${Math.round(r.acc)}%` : ""}
                </span>
                <span className="text-xs text-gray-300 hidden sm:block w-16 text-right">
                  {r.owner ? "Monkeytype" : ago(r.at)}
                </span>
                <span className="w-16 text-right text-sm font-bold text-gray-900 tabular-nums">
                  {Math.round(r.wpm)}
                  <span className="text-[10px] font-medium text-gray-400 ml-0.5">wpm</span>
                </span>
              </li>
            );
          })}
          {rows.length <= 1 && !failed && (
            <li className="text-sm text-gray-400 px-1 pt-2">No scores yet. Take the test and be the first on the board!</li>
          )}
        </ol>
      )}
    </div>
  );
};

export default TypingLeaderboard;
