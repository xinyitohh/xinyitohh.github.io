import { useState, useEffect, useMemo } from "react";
import { doc, getDoc, setDoc, increment } from "firebase/firestore";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import worldData from "world-atlas/countries-110m.json";
import iso from "i18n-iso-countries";
import { db } from "../firebase";

const COUNTED_KEY = "visitCounted";
const statsRef = () => doc(db, "visits", "stats");

const flag = (cc) =>
  String.fromCodePoint(...[...cc.toUpperCase()].map((c) => 127397 + c.charCodeAt(0)));

const names = new Intl.DisplayNames(["en"], { type: "region" });
const countryName = (cc) => {
  try {
    return names.of(cc) ?? cc;
  } catch {
    return cc;
  }
};

const W = 960;
const H = 480;
const pad3 = (n) => String(n).padStart(3, "0");

const MAP_COUNTRIES = feature(worldData, worldData.objects.countries).features.filter(
  (f) => String(f.id) !== "010" // drop Antarctica
);
// Fiji straddles the antimeridian, so its slivers sit at both map edges and inflate
// the bounds. Leave it out when fitting, then crop the viewBox to what is drawn.
const FIT = {
  type: "FeatureCollection",
  features: MAP_COUNTRIES.filter((f) => String(f.id) !== "242"),
};
const projection = geoNaturalEarth1().fitSize([W, H], FIT);
const toPath = geoPath(projection);
const [[bx0, by0], [bx1, by1]] = toPath.bounds(FIT);
const VIEW_BOX = `${bx0 - 4} ${by0 - 4} ${bx1 - bx0 + 8} ${by1 - by0 + 8}`;
const SHAPES = MAP_COUNTRIES.map((f) => ({
  // A few territories (e.g. Kosovo) have no ISO numeric id in the map data.
  id: f.id == null ? null : pad3(f.id),
  name: f.properties.name,
  d: toPath(f),
}));

// Ad blockers sometimes block individual geo-IP services, so try several in order.
const LOOKUPS = [
  async () => {
    const text = await (await fetch("https://www.cloudflare.com/cdn-cgi/trace")).text();
    return text.match(/^loc=([A-Z]{2})$/m)?.[1];
  },
  async () => (await (await fetch("https://get.geojs.io/v1/ip/country.json")).json()).country,
  async () => (await (await fetch("https://api.country.is/")).json()).country,
];

const lookupCountry = async () => {
  for (const lookup of LOOKUPS) {
    try {
      const cc = await lookup();
      if (/^[A-Z]{2}$/.test(cc ?? "")) return cc;
    } catch {
      // blocked or failed: try the next one
    }
  }
  return null;
};

const Visitors = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        // Count each browser once, so refreshing doesn't inflate the numbers.
        let counted = false;
        try { counted = !!localStorage.getItem(COUNTED_KEY); } catch { /* storage blocked */ }

        if (!counted) {
          const country = await lookupCountry();
          if (country) {
            await setDoc(
              statsRef(),
              { total: increment(1), countries: { [country]: increment(1) } },
              { merge: true }
            );
            try { localStorage.setItem(COUNTED_KEY, "1"); } catch { /* ignore */ }
          }
        }

        const snap = await getDoc(statsRef());
        if (!cancelled && snap.exists()) setStats(snap.data());
      } catch (err) {
        // Firebase rules not set up, country lookup blocked, or offline: hide the section.
        console.warn("[Visitors] could not count or load visits:", err);
      }
    };

    run();
    return () => { cancelled = true; };
  }, []);

  const [tip, setTip] = useState(null); // { x, y, label }

  const byNumeric = useMemo(() => {
    const m = new Map();
    for (const [cc, n] of Object.entries(stats?.countries ?? {})) {
      const num = iso.alpha2ToNumeric(cc);
      if (num) m.set(pad3(num), { cc, n });
    }
    return m;
  }, [stats]);

  if (!stats) return null;

  const rows = Object.entries(stats.countries ?? {}).sort((a, b) => b[1] - a[1]);
  const max = rows[0]?.[1] ?? 1;

  const move = (label) => (e) => setTip({ x: e.clientX, y: e.clientY, label });

  return (
    <section className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Visitors</h2>
      <p className="text-sm text-gray-400 mb-6">
        {stats.total} visitor{stats.total === 1 ? "" : "s"} from {rows.length}{" "}
        {rows.length === 1 ? "country" : "countries"}.
      </p>

      <svg
        viewBox={VIEW_BOX}
        role="img"
        aria-label="World map of visitor countries"
        className="w-full h-auto"
        onMouseLeave={() => setTip(null)}
      >
        {SHAPES.map(({ id, name, d }, i) => {
          const hit = id ? byNumeric.get(id) : undefined;
          return (
            <path
              key={id ?? `${name}-${i}`}
              d={d}
              fill={hit ? "#6366f1" : "#e5e7eb"}
              fillOpacity={hit ? 0.4 + 0.6 * (hit.n / max) : 1}
              stroke="#fff"
              strokeWidth={0.6}
              className={hit ? "cursor-pointer hover:brightness-90" : ""}
              onMouseMove={
                hit
                  ? move(`${flag(hit.cc)} ${countryName(hit.cc)} · ${hit.n} visitor${hit.n === 1 ? "" : "s"}`)
                  : move(name)
              }
            />
          );
        })}
      </svg>

      {tip && (
        <div
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full -mt-3 px-2.5 py-1.5 rounded-md bg-gray-900 text-white text-xs whitespace-nowrap shadow-lg"
          style={{ left: tip.x, top: tip.y }}
        >
          {tip.label}
        </div>
      )}
    </section>
  );
};

export default Visitors;
