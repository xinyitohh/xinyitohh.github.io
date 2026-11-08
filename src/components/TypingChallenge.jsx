import { Fragment, memo, useState, useEffect, useRef } from "react";
import { makeWords, score, bestOf } from "../lib/typing";
import { lsGet, lsSet } from "../lib/storage";
import { fetchRank, postScore, NAME_RE, MAX_WPM, MIN_ACC } from "../lib/leaderboard";
import TypingLeaderboard from "./TypingLeaderboard";

const MODES = [15, 30, 60];
const LINE_H = 44; // px; every word box is one line tall so scrolling snaps to whole lines
const BATCH = 120; // words generated at a time
const STATS_KEY = "typingChallengeStats"; // { "30": { best, attempts } }
const NAME_KEY = "typingChallengeName";

// ---------- the words ----------
// Zero-width, so moving it never shifts the text around.
const Caret = ({ still }) => (
  <span className="relative inline-block w-0 align-top" style={{ height: LINE_H }} aria-hidden="true">
    <span className={`absolute -left-px top-1/2 -translate-y-1/2 h-7 w-0.5 rounded bg-indigo-500 ${still ? "" : "animate-blink"}`} />
  </span>
);

const WORD_STYLE = { height: LINE_H, lineHeight: `${LINE_H}px` };

// memo: while typing, only the current word's props change, so the other words are skipped
// entirely. Words are also kept as light as possible: a word that has not been reached yet,
// or was typed correctly, is a single element. Only the current word and mistyped words
// are split into one element per letter.
const Word = memo(function Word({ word, typed, current }) {
  if (typed === undefined) {
    return <span className="inline-block mr-[1.1ch] text-gray-400" style={WORD_STYLE}>{word}</span>;
  }
  if (!current && typed === word) {
    return <span className="inline-block mr-[1.1ch] text-gray-900" style={WORD_STYLE}>{word}</span>;
  }
  const committed = !current;
  const caretBefore = current && typed.length < word.length ? typed.length : -1;
  const caretAfter = current && typed.length >= word.length;
  return (
    <span data-current={current ? "true" : undefined} className="inline-block mr-[1.1ch]" style={WORD_STYLE}>
      {word.split("").map((ch, k) => {
        let cls = "text-gray-400";
        if (k < typed.length) cls = typed[k] === ch ? "text-gray-900" : "text-red-500";
        else if (committed) cls = "text-red-300"; // letters skipped by pressing space early
        return (
          <Fragment key={k}>
            {k === caretBefore && <Caret still={typed.length > 0} />}
            <span className={cls}>{ch}</span>
          </Fragment>
        );
      })}
      {typed.length > word.length && <span className="text-red-500">{typed.slice(word.length)}</span>}
      {caretAfter && <Caret still />}
    </span>
  );
});

// Words per second over the run, as a small area chart.
const Sparkline = ({ samples }) => {
  if (samples.length < 2) return null;
  const max = Math.max(...samples, 1);
  const pts = samples.map((v, i) => `${(i / (samples.length - 1)) * 100},${30 - (v / max) * 28}`);
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-16" role="img" aria-label="Speed over time">
      <polygon points={`0,30 ${pts.join(" ")} 100,30`} className="fill-indigo-100" />
      <polyline points={pts.join(" ")} fill="none" className="stroke-indigo-500" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
};

const Metric = ({ label, children, tone = "text-gray-900" }) => (
  <div className="rounded-lg bg-white border border-gray-100 px-4 py-3">
    <p className="text-xs text-gray-400">{label}</p>
    <p className={`text-2xl sm:text-3xl font-bold leading-tight tabular-nums ${tone}`}>{children}</p>
  </div>
);

// pbs: Monkeytype "time" personal bests, e.g. { "30": [{ wpm, acc, ... }] }
const TypingChallenge = ({ pbs, ownerName = "Xin Yi" }) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(15);
  const [view, setView] = useState("test"); // test | board
  const [phase, setPhase] = useState("idle"); // idle | running | done
  const [words, setWords] = useState(() => makeWords(BATCH * 2));
  const [done, setDone] = useState([]); // words committed with space
  const [cur, setCur] = useState(""); // the word being typed
  const [left, setLeft] = useState(15); // whole seconds, updated once a second
  const [liveWpm, setLiveWpm] = useState(0);
  const [result, setResult] = useState(null);
  const [rank, setRank] = useState(null); // { rank, total } | "error" | null
  const [stats, setStats] = useState(() => lsGet(STATS_KEY, {}));
  const [name, setName] = useState(() => lsGet(NAME_KEY, ""));
  const [post, setPost] = useState("idle"); // idle | sending | done | error
  const [boardKey, setBoardKey] = useState(0);

  const inputRef = useRef(null);
  const startRef = useRef(0);
  const secRef = useRef(15);
  const innerRef = useRef(null);
  const samplesRef = useRef([]);
  const liveRef = useRef({ words, done: [], cur: "" }); // latest typing, read by the timer
  const statsRef = useRef(stats);
  const resetRef = useRef(() => {});

  const pbWpm = bestOf(pbs?.[String(mode)]);
  const focusInput = () => setTimeout(() => inputRef.current?.focus(), 0);

  const reset = (nextMode = mode, keepView = false) => {
    const fresh = makeWords(BATCH * 2);
    liveRef.current = { words: fresh, done: [], cur: "" };
    samplesRef.current = [];
    setWords(fresh);
    setDone([]);
    setCur("");
    setResult(null);
    setRank(null);
    setPost("idle");
    setPhase("idle");
    setLeft(nextMode);
    setLiveWpm(0);
    if (!keepView) setView("test");
    focusInput();
  };
  useEffect(() => { resetRef.current = reset; });

  const pickMode = (m) => {
    setMode(m);
    reset(m, true);
  };

  // Countdown. The timer ticks every 100ms for an accurate finish, but only touches React
  // state once per second.
  useEffect(() => {
    if (phase !== "running") return;
    secRef.current = mode;
    const finish = () => {
      const { words: w, done: d, cur: c } = liveRef.current;
      const r = score(w, d, c, mode);
      const wpm = Math.round(r.wpm * 10) / 10;
      const acc = Math.round(r.acc * 10) / 10;
      const raw = Math.round(r.raw);
      const prev = statsRef.current[mode] ?? { best: 0, attempts: 0 };
      const nextStats = { ...statsRef.current, [mode]: { best: Math.max(prev.best, wpm), attempts: prev.attempts + 1 } };
      statsRef.current = nextStats;
      setStats(nextStats);
      lsSet(STATS_KEY, nextStats);
      setResult({
        wpm, acc, raw, mode,
        samples: [...samplesRef.current, Math.round(r.wpm)],
        newBest: prev.attempts > 0 && wpm > prev.best,
      });
      setLeft(0);
      setPhase("done");
      fetchRank(mode, wpm).then(setRank).catch(() => setRank("error"));
    };
    const id = setInterval(() => {
      const elapsed = (Date.now() - startRef.current) / 1000;
      if (elapsed >= mode) {
        clearInterval(id);
        finish();
        return;
      }
      const secs = Math.ceil(mode - elapsed);
      if (secs !== secRef.current) {
        secRef.current = secs;
        const { words: w, done: d, cur: c } = liveRef.current;
        const wpm = Math.round(score(w, d, c, Math.max(1, elapsed)).wpm);
        samplesRef.current.push(wpm);
        setLeft(secs);
        setLiveWpm(wpm);
      }
    }, 100);
    return () => clearInterval(id);
  }, [phase, mode]);

  // Keep the current word on the second line. The words slide up with a transform
  // (cheap, and smooth like Monkeytype) instead of jumping with scrollTop.
  useEffect(() => {
    const inner = innerRef.current;
    const el = inner?.querySelector('[data-current="true"]');
    if (!inner || !el) return;
    const y = Math.max(0, el.offsetTop - LINE_H);
    inner.style.transition = done.length === 0 ? "none" : "transform 160ms cubic-bezier(.3,.7,.3,1)";
    inner.style.transform = `translateY(${-y}px)`;
  }, [done.length, words, open, view, phase]);

  // Like Monkeytype: typing anywhere on the page goes straight into the test.
  useEffect(() => {
    if (!open || view !== "test" || phase === "done") return;
    const onKey = (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key.length === 1 && e.key !== " ") inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, view, phase]);

  // After a run, Enter or Tab starts the next one.
  useEffect(() => {
    if (!open || phase !== "done" || view !== "test") return;
    const onKey = (e) => {
      if (e.target instanceof HTMLInputElement) return; // don't hijack the name field
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        resetRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, phase, view]);

  const onChange = (e) => {
    if (phase === "done") return;
    const v = e.target.value;
    if (phase === "idle" && v.trim()) {
      startRef.current = Date.now();
      setPhase("running");
    }
    if (v.endsWith(" ")) {
      const typed = v.trim();
      if (!typed) return; // ignore leading spaces
      const nextDone = [...liveRef.current.done, typed];
      let nextWords = liveRef.current.words;
      if (nextDone.length + 60 > nextWords.length) {
        nextWords = [...nextWords, ...makeWords(BATCH)]; // never run out of words
        setWords(nextWords);
      }
      liveRef.current = { words: nextWords, done: nextDone, cur: "" };
      setDone(nextDone);
      setCur("");
    } else {
      liveRef.current = { ...liveRef.current, cur: v };
      setCur(v);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Tab" || e.key === "Escape") {
      e.preventDefault();
      reset();
    }
  };

  const nameOk = NAME_RE.test(name.trim());
  const canPost =
    result && result.acc >= MIN_ACC && result.wpm > 0 && result.wpm <= MAX_WPM && nameOk && post === "idle";

  const submitScore = async (e) => {
    e.preventDefault();
    if (!canPost) return;
    setPost("sending");
    try {
      await postScore(result.mode, { name: name.trim(), wpm: result.wpm, acc: result.acc });
      lsSet(NAME_KEY, name.trim());
      setPost("done");
      setBoardKey((k) => k + 1);
      setView("board");
    } catch {
      setPost("error");
    }
  };

  const diff = result && pbWpm != null ? result.wpm - pbWpm : null;
  const mine = stats[mode];

  // ---------- closed ----------
  if (!open) {
    return (
      <div className="mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 p-5">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {pbWpm != null ? `Think you can beat my ${Math.round(pbWpm)} wpm?` : "Think you can type fast?"}
          </p>
          <p className="text-sm text-gray-400 mt-0.5">
            A quick typing test, right here. Post your score to the public leaderboard.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setOpen(true); focusInput(); }}
          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors flex-shrink-0"
        >
          Challenge me
        </button>
      </div>
    );
  }

  // ---------- open ----------
  return (
    <div className="mt-10 rounded-xl border border-gray-100 bg-gray-50 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          {MODES.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => pickMode(m)}
              disabled={phase === "running"}
              className={`px-3 py-1 rounded-full text-xs border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                mode === m
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "bg-white border-gray-200 text-gray-500 hover:border-indigo-300"
              }`}
            >
              {m}s
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {[["test", "Test"], ["board", "Leaderboard"]].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              disabled={phase === "running"}
              className={`px-3 py-1 rounded-full text-xs transition-colors disabled:opacity-40 ${
                view === key ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close the typing challenge"
            className="ml-1 w-7 h-7 text-gray-300 hover:text-gray-500 transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>
      </div>

      {view === "board" ? (
        <TypingLeaderboard
          mode={mode}
          ownerName={ownerName}
          ownerPb={pbWpm}
          myName={name}
          reloadKey={boardKey}
        />
      ) : phase !== "done" ? (
        <>
          {/* Live numbers: big and quiet, like Monkeytype */}
          <div className="flex items-end justify-between mb-3 tabular-nums h-10">
            <span className={`text-3xl font-semibold leading-none transition-colors ${phase === "running" ? "text-indigo-600" : "text-gray-300"}`}>
              {left}
            </span>
            <span className="text-sm text-gray-400 pb-0.5">
              {phase === "running" ? `${liveWpm} wpm` : pbWpm != null ? `my best ${Math.round(pbWpm)} wpm` : " "}
            </span>
          </div>

          {/* Time bar: shrinks as the seconds run out */}
          <div className="h-0.5 rounded-full bg-gray-200 overflow-hidden mb-4" aria-hidden="true">
            <div
              className="h-full bg-indigo-500 ease-linear"
              style={{
                width: `${phase === "running" ? ((left - 1) / mode) * 100 : 100}%`,
                transition: phase === "running" ? "width 1s linear" : "none",
              }}
            />
          </div>

          {/* The real input is invisible and covers the words, so a click anywhere focuses it */}
          <div className="group relative cursor-text" onClick={() => inputRef.current?.focus()}>
            <input
              ref={inputRef}
              value={cur}
              onChange={onChange}
              onKeyDown={onKeyDown}
              aria-label="Type the words shown above"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className="absolute inset-0 w-full h-full opacity-0 cursor-text"
            />
            <div
              className="relative overflow-hidden font-mono text-[22px] select-none transition-[filter,opacity] duration-200 blur-[3px] opacity-60 group-focus-within:blur-0 group-focus-within:opacity-100"
              style={{ height: LINE_H * 3, contain: "layout paint style" }}
            >
              <div ref={innerRef}>
                {words.map((w, i) => (
                  <Word
                    key={i}
                    word={w}
                    typed={i < done.length ? done[i] : i === done.length ? cur : undefined}
                    current={i === done.length}
                  />
                ))}
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500 pointer-events-none group-focus-within:hidden">
              Click here or just start typing
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 mt-4">
            <button
              type="button"
              onClick={() => reset()}
              aria-label="Restart the test"
              title="Restart (Tab)"
              className="group flex items-center gap-2 px-4 py-1.5 rounded-full text-gray-400 hover:text-gray-800 hover:bg-white transition-colors"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:-rotate-180" aria-hidden="true">
                <path d="M3 12a9 9 0 1 0 3-6.7" />
                <path d="M3 4v5h5" />
              </svg>
              <span className="text-xs">Restart</span>
            </button>
            <p className="text-xs text-gray-400 text-center">
              <kbd className="px-1 rounded border border-gray-200 bg-white text-[10px]">Tab</kbd> restart
              {mine?.attempts > 0 && (
                <span className="ml-2 text-gray-300">
                  · your best {Math.round(mine.best)} wpm · {mine.attempts} attempt{mine.attempts === 1 ? "" : "s"}
                </span>
              )}
            </p>
          </div>
        </>
      ) : (
        <div>
          {result.newBest && (
            <p className="mb-3 inline-block rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1">
              New personal best on this device!
            </p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Metric label="Speed">
              {Math.round(result.wpm)}<span className="text-xs font-medium text-gray-400 ml-1">wpm</span>
            </Metric>
            <Metric label="Accuracy">
              {Math.round(result.acc)}<span className="text-xs font-medium text-gray-400 ml-0.5">%</span>
            </Metric>
            <Metric label="Raw speed">
              {result.raw}<span className="text-xs font-medium text-gray-400 ml-1">wpm</span>
            </Metric>
            <Metric label="vs. my best" tone={diff == null ? "text-gray-300" : diff > 0 ? "text-emerald-600" : "text-gray-900"}>
              {diff == null ? "–" : `${diff > 0 ? "+" : ""}${Math.round(diff)}`}
            </Metric>
          </div>

          <div className="mt-4 rounded-lg bg-white border border-gray-100 px-4 pt-3 pb-2">
            <p className="text-xs text-gray-400 mb-1">Speed over time</p>
            <Sparkline samples={result.samples} />
          </div>

          <p className="text-sm text-gray-600 mt-4">
            {diff == null
              ? "Nice run!"
              : diff > 0
                ? `You beat me by ${Math.round(diff)} wpm. Respect!`
                : `${Math.abs(Math.round(diff))} wpm short of my ${mode}s best. Try again?`}
            {rank && rank !== "error" && (
              <span className="text-gray-400">
                {" "}On the public board this would be <strong className="text-gray-700">#{rank.rank}</strong>
                {rank.total > 0 ? ` of ${rank.total}` : ""}.
              </span>
            )}
          </p>

          {/* Post to the public leaderboard */}
          {post === "done" ? (
            <p className="mt-4 text-sm text-emerald-600">Posted to the leaderboard!</p>
          ) : result.acc < MIN_ACC ? (
            <p className="mt-4 text-xs text-gray-400">Scores need at least {MIN_ACC}% accuracy to go on the leaderboard.</p>
          ) : result.wpm > MAX_WPM ? (
            <p className="mt-4 text-xs text-gray-400">That score is above what the leaderboard accepts ({MAX_WPM} wpm).</p>
          ) : (
            <form onSubmit={submitScore} className="mt-4 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={16}
                placeholder="Your name for the leaderboard"
                aria-label="Your name for the leaderboard"
                disabled={post === "sending"}
                className="flex-1 min-w-0 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              />
              <button
                type="submit"
                disabled={!canPost}
                className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {post === "sending" ? "Posting…" : "Post score"}
              </button>
            </form>
          )}
          {name.trim() && !nameOk && post !== "done" && (
            <p className="mt-2 text-xs text-amber-600">Use letters, numbers, spaces, dots, dashes or underscores (up to 16).</p>
          )}
          {post === "error" && (
            <p className="mt-2 text-xs text-red-500">Couldn&apos;t post the score. Try again in a moment.</p>
          )}

          <div className="flex items-center gap-3 mt-5">
            <button
              type="button"
              onClick={() => reset()}
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try again
            </button>
            <span className="text-xs text-gray-400">
              or press <kbd className="px-1 rounded border border-gray-200 bg-white text-[10px]">Enter</kbd>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TypingChallenge;
