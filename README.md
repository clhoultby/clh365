# clh365

Cloudflare Worker serving static HTML training material.

## How it works

- HTML files live in `public/` and are served directly by [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/) at their `.html` path (e.g. `public/lesson-1.html` is served at `/lesson-1.html`).
- The Worker (`src/index.js`) renders an auto-generated index at `/` listing every document.
- `build-index.js` scans `public/` and regenerates `src/manifest.js` on each build/deploy, pulling each file's `<title>` to use as the index label.

## Develop

```
npm install
npm run dev        # local preview, usually http://localhost:8787
```

## Deploy

```
npm run deploy     # runs build-index.js via wrangler, then deploys
```

You'll need a Cloudflare account and to be logged in (`npx wrangler login`) the first time.

## Add material

Drop a new `.html` file into `public/` (give it a `<title>`), then deploy. It appears on the index automatically. No code changes needed.
