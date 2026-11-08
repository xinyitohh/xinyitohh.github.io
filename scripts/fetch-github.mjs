// Runs before every deploy: saves each account's last-year contribution calendar into
// src/data/github-activity.json using the official GitHub API (via the `gh` CLI login).
// It never fails the deploy: if anything goes wrong the previous file is kept.
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFileSync, writeFileSync } from "node:fs";

const run = promisify(execFile);
const ACCOUNTS = JSON.parse(readFileSync(new URL("../src/data/github-accounts.json", import.meta.url), "utf8"));
const OUT = new URL("../src/data/github-activity.json", import.meta.url);
const QUERY =
  "query($u:String!){user(login:$u){contributionsCollection{contributionCalendar{weeks{contributionDays{date contributionCount}}}}}}";

let result = {};
try { result = JSON.parse(readFileSync(OUT, "utf8")); } catch { /* first run */ }

// Accounts are fetched in parallel, and one failing keeps its previously saved copy.
await Promise.all(
  ACCOUNTS.map(async (user) => {
    try {
      const { stdout } = await run("gh", ["api", "graphql", "-f", `query=${QUERY}`, "-f", `u=${user}`], { timeout: 30000 });
      const weeks = JSON.parse(stdout).data.user.contributionsCollection.contributionCalendar.weeks;
      result[user] = weeks.flatMap((w) => w.contributionDays).map((d) => ({ date: d.date, count: d.contributionCount }));
      console.log(`github: ${user} saved (${result[user].length} days)`);
    } catch (err) {
      console.warn(`github: could not update ${user}, keeping the saved copy (${String(err.message).split("\n")[0]})`);
    }
  })
);

writeFileSync(OUT, JSON.stringify(result));
