// GitHub contribution data for the heatmap.
//
// 1. A snapshot saved at deploy time (scripts/fetch-github.mjs, official GitHub API), so the
//    heatmap always has something to show immediately.
// 2. A live refresh from a free third-party API, which is flaky: when it works it fills in
//    days since the last deploy, when it doesn't nothing is lost.
// Per account, whichever copy has the most recent day wins.
import saved from "../data/github-activity.json";
import ACCOUNTS from "../data/github-accounts.json"; // shared with scripts/fetch-github.mjs
import { lsGet, lsSet } from "./storage";

export { ACCOUNTS };
const CACHE_KEY = "ghActivityCache";

const lastDate = (days) => days[days.length - 1].date;

const fetchAccount = async (name, tries = 3) => {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${name}?y=last`);
      if (res.ok) return (await res.json()).contributions;
    } catch { /* retry */ }
    await new Promise((resolve) => setTimeout(resolve, 800 * (i + 1)));
  }
  throw new Error(`could not load ${name}`);
};

// For each account, the source whose last day is the most recent.
const combine = (...sources) => {
  const out = {};
  for (const a of ACCOUNTS) {
    const copies = sources.map((s) => s?.[a]).filter((d) => d?.length);
    if (copies.length) out[a] = copies.reduce((x, y) => (lastDate(y) > lastDate(x) ? y : x));
  }
  return out;
};

// What can be shown right now, without any network.
export const initialActivity = () => combine(saved, lsGet(CACHE_KEY, {}));

// One live refresh per page load, shared by anyone who asks; resolves to the combined data.
let inflight = null;
export const loadActivity = () => {
  inflight ??= Promise.allSettled(ACCOUNTS.map((n) => fetchAccount(n).then((c) => [n, c]))).then((results) => {
    const live = Object.fromEntries(results.filter((r) => r.status === "fulfilled").map((r) => r.value));
    const cached = lsGet(CACHE_KEY, {});
    const merged = combine(saved, cached, live);
    if (JSON.stringify(merged) !== JSON.stringify(cached)) lsSet(CACHE_KEY, merged);
    return merged;
  });
  return inflight;
};
