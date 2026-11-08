# WakaTime live proxy (Cloudflare Worker)

Holds a WakaTime OAuth token server-side and serves the website the same data as the share links,
but live. If this is not set up, the site keeps using the share links.

## One-time setup (run in this `worker/` folder)

1. `npx wrangler login`  – opens the browser to sign in to Cloudflare (free account).
2. Open `wrangler.toml` and set `TZ` to the timezone of your WakaTime account.
3. Get a personal token at https://wakatime.com/oauth (WakaTime's plain API key does not work for reading data), then
   `npx wrangler secret put WAKATIME_TOKEN` and paste it when asked. Optional cleanup: `npx wrangler secret delete WAKATIME_API_KEY`.
4. `npx wrangler deploy`  – prints the Worker address, like https://wakatime-proxy.<you>.workers.dev
5. In the project root, copy `.env.example` to `.env` and put that address in `VITE_WAKA_PROXY`.
6. `npm run deploy`

Check it: open `<worker address>/?range=7d` in a browser; you should see JSON.
