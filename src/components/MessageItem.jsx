import { useState, useEffect, useRef } from "react";
import {
  collection, addDoc, getDocs, orderBy, query, serverTimestamp,
  doc, updateDoc, increment,
} from "firebase/firestore";
import { db } from "../firebase";

// Keys are plain words because Firestore field paths cannot contain emoji.
const REACTIONS = [
  { key: "like", emoji: "👍", label: "Like" },
  { key: "love", emoji: "❤️", label: "Love" },
  { key: "haha", emoji: "😂", label: "Haha" },
  { key: "party", emoji: "🎉", label: "Celebrate" },
];
const REACTED_KEY = "msgReacted";
const REPLY_COOLDOWN_KEY = "replyLastSubmit";
const REPLY_COOLDOWN_MS = 30 * 1000;
const MAX_LEN = 100;

const loadReacted = () => {
  try { return new Set(JSON.parse(localStorage.getItem(REACTED_KEY) ?? "[]")); }
  catch { return new Set(); }
};
const saveReacted = (set) => {
  try { localStorage.setItem(REACTED_KEY, JSON.stringify([...set])); } catch { /* ignore */ }
};
const replyReady = () => {
  try {
    const last = localStorage.getItem(REPLY_COOLDOWN_KEY);
    return !last || Date.now() - Number(last) > REPLY_COOLDOWN_MS;
  } catch { return true; }
};

const timeAgo = (date) => {
  if (!date) return "";
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

const when = (createdAt) =>
  createdAt?.toDate ? timeAgo(createdAt.toDate()) : "just now";

const MessageItem = ({ msg }) => {
  const [reactions, setReactions] = useState(msg.reactions ?? {});
  const [reacted, setReacted] = useState(loadReacted);
  const [popped, setPopped] = useState(null);
  const [picker, setPicker] = useState(false);
  const pickerRef = useRef(null);

  // Close the emoji picker when clicking anywhere outside it.
  useEffect(() => {
    if (!picker) return;
    const onDown = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) setPicker(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [picker]);

  const [replyCount, setReplyCount] = useState(msg.replyCount ?? 0);
  const [replies, setReplies] = useState(null); // null = not loaded yet
  const [open, setOpen] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | cooldown | error

  const bump = (key, by) =>
    setReactions((prev) => ({ ...prev, [key]: Math.max(0, (prev[key] ?? 0) + by) }));

  // Clicking a reaction you already gave takes it back.
  const react = async (key) => {
    const tag = `${msg.id}:${key}`;
    const mine = reacted.has(tag);
    const by = mine ? -1 : 1;
    const next = new Set(reacted);
    if (mine) next.delete(tag); else next.add(tag);
    setReacted(next);
    saveReacted(next);
    bump(key, by);
    if (!mine) {
      setPopped(key);
      setTimeout(() => setPopped((p) => (p === key ? null : p)), 400);
    }
    try {
      await updateDoc(doc(db, "messages", msg.id), { [`reactions.${key}`]: increment(by) });
    } catch {
      // roll back if Firestore rejected it (e.g. rules not updated)
      setReacted(reacted);
      saveReacted(reacted);
      bump(key, -by);
    }
  };

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next && replies === null) {
      if (replyCount === 0) { setReplies([]); return; }
      setLoadingReplies(true);
      try {
        const q = query(collection(db, "messages", msg.id, "replies"), orderBy("createdAt", "asc"));
        const snap = await getDocs(q);
        setReplies(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch {
        setReplies([]);
      }
      setLoadingReplies(false);
    }
  };

  const sendReply = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || text.length > MAX_LEN) return;
    if (!replyReady()) {
      setStatus("cooldown");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }
    setStatus("sending");
    try {
      const ref = await addDoc(collection(db, "messages", msg.id, "replies"), {
        text,
        createdAt: serverTimestamp(),
      });
      setReplies((prev) => [
        ...(prev ?? []),
        { id: ref.id, text, createdAt: { toDate: () => new Date() } },
      ]);
      setReplyCount((c) => c + 1);
      setInput("");
      setStatus("idle");
      try { localStorage.setItem(REPLY_COOLDOWN_KEY, String(Date.now())); } catch { /* ignore */ }
      // The reply is saved either way; the count on the parent is best-effort.
      updateDoc(doc(db, "messages", msg.id), { replyCount: increment(1) }).catch(() => {});
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="px-4 py-3 bg-gray-50 rounded-xl">
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-xs text-indigo-500 font-semibold select-none">
          👤
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-700 break-words">{msg.text}</p>

          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {/* Only reactions someone has used are shown, like Slack / Discord */}
            {REACTIONS.filter(({ key }) => (reactions[key] ?? 0) > 0).map(({ key, emoji, label }) => {
              const mine = reacted.has(`${msg.id}:${key}`);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => react(key)}
                  title={mine ? `${label} (click to undo)` : label}
                  className={`flex items-center gap-1 h-6 px-2 rounded-full text-xs transition-all active:scale-95 ${
                    mine
                      ? "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300"
                      : "bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-indigo-300"
                  }`}
                >
                  <span className={`text-[13px] leading-none ${popped === key ? "animate-pop" : ""}`}>
                    {emoji}
                  </span>
                  <span className="tabular-nums font-medium">{reactions[key]}</span>
                </button>
              );
            })}

            {/* Add-reaction button + popover */}
            <div className="relative" ref={pickerRef}>
              <button
                type="button"
                onClick={() => setPicker((v) => !v)}
                aria-label="Add reaction"
                title="Add reaction"
                className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors ${
                  picker
                    ? "bg-white text-indigo-500 ring-1 ring-indigo-300"
                    : "text-gray-400 hover:text-indigo-500 hover:bg-white hover:ring-1 hover:ring-gray-200"
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20.5 12.5a8.5 8.5 0 1 1-8.5-8.5" />
                  <path d="M8.5 14a4 4 0 0 0 7 0" />
                  <path d="M9 9.5h.01M15 9.5h.01" />
                  <path d="M19 3v5M16.5 5.5h5" />
                </svg>
              </button>

              {picker && (
                <div className="absolute bottom-full left-0 mb-2 z-20 flex gap-0.5 p-1 rounded-full bg-white shadow-lg ring-1 ring-gray-200 animate-pop-in">
                  {REACTIONS.map(({ key, emoji, label }) => {
                    const mine = reacted.has(`${msg.id}:${key}`);
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => { react(key); setPicker(false); }}
                        title={label}
                        aria-label={label}
                        className={`w-9 h-9 rounded-full text-xl leading-none transition-transform hover:scale-125 ${
                          mine ? "bg-indigo-50" : "hover:bg-gray-50"
                        }`}
                      >
                        {emoji}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={toggle}
              className={`ml-1 text-xs transition-colors ${
                open ? "text-indigo-600 font-medium" : "text-gray-400 hover:text-indigo-600"
              }`}
            >
              {open
                ? "Hide replies"
                : replyCount > 0
                  ? `${replyCount} ${replyCount === 1 ? "reply" : "replies"}`
                  : "Reply"}
            </button>
          </div>
        </div>
        <span className="text-xs text-gray-300 flex-shrink-0 pt-0.5">{when(msg.createdAt)}</span>
      </div>

      {open && (
        <div className="mt-3 ml-10 pl-4 border-l-2 border-indigo-100 space-y-2">
          {loadingReplies && <p className="text-xs text-gray-400">Loading…</p>}

          {(replies ?? []).map((r) => (
            <div key={r.id} className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 text-[10px] select-none">
                👤
              </div>
              <p className="flex-1 min-w-0 text-sm text-gray-600 break-words">{r.text}</p>
              <span className="text-[10px] text-gray-300 flex-shrink-0 pt-1">{when(r.createdAt)}</span>
            </div>
          ))}

          <form onSubmit={sendReply} className="flex gap-2 pt-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={MAX_LEN}
              placeholder="Write a reply…"
              disabled={status === "sending"}
              className="flex-1 min-w-0 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || status === "sending"}
              className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {status === "sending" ? "…" : "Reply"}
            </button>
          </form>
          {status === "cooldown" && (
            <p className="text-xs text-amber-600">Slow down a little — try again in a few seconds.</p>
          )}
          {status === "error" && (
            <p className="text-xs text-red-500">Couldn&apos;t send the reply. Try again.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageItem;
