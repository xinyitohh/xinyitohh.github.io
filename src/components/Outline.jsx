import { useState, useEffect, useRef } from "react";

const STEP = 22; // px of finger travel per section while scrubbing

// Short vibration on supported phones (Android browsers). iOS Safari has no web haptics API.
const haptic = (ms) => {
  if (typeof navigator === "undefined" || !navigator.vibrate) return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  navigator.vibrate(ms);
};

const slug = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Reads every <h2> under <main>, so new sections show up here automatically.
const collect = () => {
  const items = [];
  document.querySelectorAll("main section").forEach((section) => {
    const h2 = section.querySelector("h2");
    if (!h2) return;
    if (!section.id) section.id = slug(h2.textContent);
    section.style.scrollMarginTop = "72px"; // clear the sticky navbar
    items.push({ id: section.id, label: h2.textContent });
  });
  return items;
};

const Outline = () => {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState("top");
  const [sheet, setSheet] = useState(false); // mobile outline card
  const [scrub, setScrub] = useState(null); // { label } while dragging along the tick rail
  const gesture = useRef({ down: false, active: false, startY: 0, startIdx: 0, lastIdx: 0, timer: 0 });

  useEffect(() => {
    const g = gesture.current;
    return () => clearTimeout(g.timer);
  }, []);

  // Sections like Visitors render after data loads, so watch for DOM changes.
  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    const update = () =>
      setItems((prev) => {
        const next = collect();
        const same =
          prev.length === next.length && prev.every((p, i) => p.id === next[i].id);
        return same ? prev : next;
      });
    update();
    const observer = new MutationObserver(update);
    observer.observe(main, { childList: true });
    return () => observer.disconnect();
  }, []);

  // Scroll spy: the active item is the last section whose top has passed the navbar.
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const atBottom =
          window.innerHeight + window.scrollY >= document.body.scrollHeight - 4;
        if (atBottom && items.length) return setActive(items[items.length - 1].id);
        let current = "top";
        for (const { id } of items) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= 120) current = id;
        }
        setActive(current);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  useEffect(() => {
    if (!sheet) return;
    const onKey = (e) => e.key === "Escape" && setSheet(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheet]);

  const go = (id) => (e) => {
    e.preventDefault();
    setSheet(false);
    if (id === "top") window.scrollTo({ top: 0, behavior: "smooth" });
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const all = [{ id: "top", label: "Top" }, ...items];

  // Jump straight to a section (no smooth scroll, so scrubbing keeps up with the finger).
  const jump = (idx) => {
    const item = all[idx];
    if (!item) return;
    if (item.id === "top") window.scrollTo({ top: 0, behavior: "instant" });
    else {
      const el = document.getElementById(item.id);
      if (el) {
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: "instant" });
      }
    }
    setActive(item.id);
  };

  const beginScrub = () => {
    const g = gesture.current;
    g.active = true;
    haptic(15);
    setScrub({ label: all[g.lastIdx]?.label ?? "" });
  };

  // Tap = open the outline. Press and hold, or just drag, = scrub through the sections.
  const onRailDown = (e) => {
    const g = gesture.current;
    e.currentTarget.setPointerCapture(e.pointerId);
    g.down = true;
    g.active = false;
    g.startY = e.clientY;
    g.startIdx = Math.max(0, all.findIndex((i) => i.id === active));
    g.lastIdx = g.startIdx;
    clearTimeout(g.timer);
    g.timer = setTimeout(beginScrub, 280);
  };

  const onRailMove = (e) => {
    const g = gesture.current;
    if (!g.down) return;
    const dy = e.clientY - g.startY;
    if (!g.active) {
      if (Math.abs(dy) < 8) return;
      clearTimeout(g.timer);
      beginScrub();
    }
    const idx = Math.min(all.length - 1, Math.max(0, g.startIdx + Math.round(dy / STEP)));
    if (idx !== g.lastIdx) {
      g.lastIdx = idx;
      jump(idx);
      haptic(8);
      setScrub({ label: all[idx].label });
    }
  };

  const onRailUp = (e) => {
    const g = gesture.current;
    clearTimeout(g.timer);
    const wasScrub = g.active;
    g.down = false;
    g.active = false;
    setScrub(null);
    if (!wasScrub && e.type === "pointerup") setSheet(true);
  };

  return (
    <>
    <nav
      aria-label="Page outline"
      className="hidden min-[1280px]:block fixed right-8 top-28 w-40 z-[999]"
    >
      <p className="text-xs font-semibold text-gray-900 mb-3 pl-4">Outline</p>
      <ul className="border-l border-gray-200">
        {all.map(({ id, label }) => {
          const on = id === active;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={go(id)}
                className={`block -ml-px pl-4 py-1.5 text-xs border-l-2 transition-colors ${
                  on
                    ? "border-indigo-500 text-gray-900 font-semibold"
                    : "border-transparent text-gray-400 hover:text-gray-700"
                }`}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>

    {/* Below 1280px there is no room for the labelled rail, so show a slim column of
        ticks (one per section) that opens the same outline when tapped. */}
    <div className="min-[1280px]:hidden">
      <button
        type="button"
        onPointerDown={onRailDown}
        onPointerMove={onRailMove}
        onPointerUp={onRailUp}
        onPointerCancel={onRailUp}
        onClick={(e) => { if (e.detail === 0) setSheet(true); }} // keyboard activation
        onContextMenu={(e) => e.preventDefault()}
        aria-label="Open page outline. Press and drag to scroll quickly."
        aria-expanded={sheet}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[999] flex flex-col items-end gap-[9px] py-4 pl-6 pr-2 touch-none select-none"
      >
        {all.map(({ id }) => (
          <span
            key={id}
            aria-hidden="true"
            className={`block h-[2px] rounded-full transition-all duration-150 ${
              id === active
                ? scrub ? "w-7 bg-indigo-500" : "w-5 bg-indigo-500"
                : scrub ? "w-3.5 bg-gray-300" : "w-2.5 bg-gray-300"
            }`}
          />
        ))}
      </button>

      {/* Label of the section you are scrubbing over */}
      {scrub && (
        <div
          aria-hidden="true"
          className="fixed right-12 top-1/2 -translate-y-1/2 z-[999] rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-md animate-fade-in"
        >
          {scrub.label}
        </div>
      )}

      {sheet && (
        <>
          {/* Invisible: only here so a tap outside the list closes it */}
          <div
            className="fixed inset-0 z-[998]"
            onClick={() => setSheet(false)}
            aria-hidden="true"
          />
          <nav
            aria-label="Page outline"
            className="fixed right-3 top-1/2 -translate-y-1/2 z-[999] w-44 max-h-[85vh] overflow-y-auto rounded-xl bg-white py-3 animate-fade-in"
          >
            <ul className="mx-3 border-l border-gray-200">
              {all.map(({ id, label }) => {
                const on = id === active;
                return (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      onClick={go(id)}
                      className={`block -ml-px pl-4 py-2 text-sm border-l-2 transition-colors ${
                        on
                          ? "border-indigo-500 text-gray-900 font-semibold"
                          : "border-transparent text-gray-400 active:text-gray-700"
                      }`}
                    >
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </>
      )}
    </div>
    </>
  );
};

export default Outline;
