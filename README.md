# clh365

Cloudflare Worker serving static HTML training material.

## How it works

- Training material is organized into **paths** — distinct topic tracks, each a folder under `public/` (e.g. `public/core-javascript/`). Each path is a sequence of small, self-contained lessons.
- HTML files are served directly by [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/) at their path (e.g. `public/core-javascript/01-es-modules-vs-namespaces.html` is served at `/core-javascript/01-es-modules-vs-namespaces.html`).
- The Worker (`src/index.js`) renders an auto-generated index at `/`, grouped by path.
- `build-index.js` scans `public/` and regenerates `src/manifest.js` on each build/deploy: every subdirectory becomes a path, every `.html` file inside it becomes a lesson (ordered alphabetically — hence the `01-`, `02-` filename prefixes), and each lesson's `<title>` becomes its index label.

## Paths

- **Core JavaScript** (`public/core-javascript/`) — modern ES Modules and functional patterns, aimed at developers coming from namespace- and class-driven TypeScript.

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

- **New lesson in an existing path:** drop a new `.html` file into that path's folder (give it a `<title>`; a numeric filename prefix like `10-` controls its order), then deploy. It appears on the index automatically.
- **New path:** create a new folder under `public/`, add an optional `_meta.json` with `{ "title": "...", "description": "...", "order": N }` (otherwise the title falls back to a title-cased folder name), then add `.html` lessons inside it.

No code changes needed either way — `build-index.js` regenerates the index on every build/deploy.
