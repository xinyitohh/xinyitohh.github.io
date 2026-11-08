import { useState, useEffect } from "react";
import TypingChallenge from "./TypingChallenge";

const USERNAME = "xinyitoh";
const TIME_MODES = ["15", "30", "60", "120"];
const WORD_MODES = ["10", "25", "50", "100"];

// A mode can hold several entries (language, punctuation...); show the fastest.
const best = (entries) =>
  entries?.length ? entries.reduce((a, b) => (b.wpm > a.wpm ? b : a)) : null;

const PbCard = ({ label, pb }) => (
  <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    {pb ? (
      <>
        <p className="text-2xl font-bold text-gray-900 leading-none">
          {Math.round(pb.wpm)}
          <span className="text-xs font-medium text-gray-400 ml-1">wpm</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">{Math.round(pb.acc)}% acc</p>
      </>
    ) : (
      <p className="text-sm text-gray-300">–</p>
    )}
  </div>
);

const Typing = () => {
  const [profile, setProfile] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`https://api.monkeytype.com/users/${USERNAME}/profile`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((json) => setProfile(json.data))
      .catch((err) => {
        if (err?.name !== "AbortError") setFailed(true);
      });
    return () => controller.abort();
  }, []);

  const pbs = profile?.personalBests;
  const stats = profile?.typingStats;

  return (
    <section className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-100">
      <div className="flex items-baseline justify-between mb-2">
        <h2 className="text-2xl font-bold text-gray-900">Typing</h2>
        <a
          href={`https://monkeytype.com/profile/${USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-400 hover:text-indigo-500 transition-colors"
        >
          Monkeytype ↗
        </a>
      </div>
      <p className="text-sm text-gray-400 mb-8">
        Personal bests, pulled live from my Monkeytype profile.
      </p>

      {!profile ? (
        !failed && <p className="text-sm text-gray-300">Loading…</p>
      ) : (
        <>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Time</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {TIME_MODES.map((m) => (
              <PbCard key={m} label={`${m} seconds`} pb={best(pbs?.time?.[m])} />
            ))}
          </div>

          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Words</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {WORD_MODES.map((m) => (
              <PbCard key={m} label={`${m} words`} pb={best(pbs?.words?.[m])} />
            ))}
          </div>

          {stats && (
            <p className="text-xs text-gray-400">
              {stats.completedTests} tests completed · {Math.round(stats.timeTyping / 60)} min typed
              {profile.streak > 0 && ` · ${profile.streak} day streak`}
            </p>
          )}
        </>
      )}

      {/* Still available if the Monkeytype profile can't be loaded */}
      {(profile || failed) && <TypingChallenge pbs={pbs?.time} />}
    </section>
  );
};

export default Typing;
