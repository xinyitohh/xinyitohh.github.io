import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { BOOKS } from "../constants/index";

const COOLDOWN_KEY = "msgWallLastSubmit";
const COOLDOWN_MS = 60 * 60 * 1000; // 1 hour

const canSubmit = () => {
  const last = localStorage.getItem(COOLDOWN_KEY);
  return !last || Date.now() - Number(last) > COOLDOWN_MS;
};

const timeAgo = (date) => {
  if (!date) return "";
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

const STATUS_CONFIG = {
  reading: { label: "Reading", dot: "bg-indigo-400", text: "text-indigo-500", border: "border-indigo-200", bg: "bg-indigo-50" },
  read:    { label: "Read",    dot: "bg-green-400",  text: "text-green-600",  border: "border-green-200",  bg: "bg-green-50"  },
  queued:  { label: "Up next", dot: "bg-gray-300",   text: "text-gray-400",  border: "border-gray-200",   bg: "bg-gray-50"   },
};

const BookCard = ({ book }) => {
  const cfg = STATUS_CONFIG[book.status] ?? STATUS_CONFIG.queued;
  return (
    <div className="flex flex-col group">
      {/* Cover */}
      <div className="relative rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50 mb-3"
           style={{ aspectRatio: "2/3" }}>
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Status badge */}
        <span className={`absolute top-2 left-2 flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cfg.text} ${cfg.border} ${cfg.bg} backdrop-blur-sm`}>
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </span>
      </div>
      {/* Info */}
      <p className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2">{book.title}</p>
      <p className="text-xs text-gray-400 mt-0.5">{book.author}</p>
    </div>
  );
};

const BookWall = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success | cooldown | error

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch {
        // silently fail if Firebase isn't configured yet
      }
    };
    fetch();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || text.length > 100) return;
    if (!canSubmit()) { setStatus("cooldown"); return; }

    setStatus("submitting");
    try {
      const ref = await addDoc(collection(db, "messages"), { text, createdAt: serverTimestamp() });
      setMessages(prev => [{ id: ref.id, text, createdAt: { toDate: () => new Date() } }, ...prev]);
      localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
      setInput("");
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-100">

      {/* Reading list */}
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Books</h2>
      <p className="text-sm text-gray-400 mb-10">What I'm reading, what I've read, and what's on the list.</p>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-16">
        {BOOKS.map(book => (
          <BookCard key={book.title} book={book} />
        ))}
      </div>

      {/* Message wall */}
      <div className="border-t border-gray-100 pt-12">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Leave a message</h3>
        <p className="text-sm text-gray-400 mb-6">Say hi, suggest a book, leave a note — anything goes.</p>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            maxLength={100}
            placeholder="Leave a message, suggest a book, say hi..."
            disabled={status === "submitting"}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || status === "submitting"}
            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {status === "submitting" ? "..." : "Send"}
          </button>
        </form>

        {status === "success" && (
          <p className="text-sm text-green-600 mb-4">Message sent!</p>
        )}
        {status === "cooldown" && (
          <p className="text-sm text-amber-600 mb-4">You already left a message recently — come back in an hour!</p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-500 mb-4">Something went wrong. Try again.</p>
        )}

        <div className="space-y-3">
          {messages.length === 0 ? (
            <p className="text-sm text-gray-400">Nothing here yet — leave the first message!</p>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className="flex items-start gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-xs text-indigo-500 font-semibold select-none">
                  👤
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 break-words">{msg.text}</p>
                </div>
                <span className="text-xs text-gray-300 flex-shrink-0 pt-0.5">
                  {msg.createdAt?.toDate ? timeAgo(msg.createdAt.toDate()) : "just now"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

    </section>
  );
};

export default BookWall;
