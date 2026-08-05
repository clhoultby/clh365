# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```
npm install
npm run dev          # wrangler dev, http://localhost:8787 (plus a public/ watcher that rebuilds the index)
npm run deploy       # wrangler deploy (Cloudflare login required first time)
npm run build-index  # regenerate src/manifest.js only
```

There are no tests, linter, or build step beyond `build-index.js`. Verification is loading pages in `npm run dev`.

Pushing to `main` deploys via `.github/workflows/deploy.yml` (wrangler-action + `CLOUDFLARE_API_TOKEN` secret), so a merged change goes live without running `npm run deploy` locally.

## Architecture

A Cloudflare Worker serving hand-written static HTML training material. Content lives in `public/`, one folder per **path** (topic track), each containing numbered `.html` **lessons**.

Request flow: `run_worker_first = true` in `wrangler.toml` sends *every* request through `src/index.js` first. It renders the generated index for `/`, otherwise proxies to `env.ASSETS` and re-renders that index with a 404 status when an asset is missing. `html_handling = "none"` keeps `.html` in lesson URLs — links between lessons must include the extension.

`build-index.js` runs from `[build]` in `wrangler.toml` before every dev/deploy. It scans `public/`, reads each folder's optional `_meta.json` (`title`, `description`, `order`), sorts lessons alphabetically by filename (hence `01-`, `02-` prefixes), and extracts each lesson's `<title>` as its index label. Output is `src/manifest.js` — **auto-generated, never edit by hand**; change the source HTML or `_meta.json` instead.

`npm run dev` also starts `build-index.js --watch` alongside `wrangler dev`. It rescans `public/` on any change and rewrites the manifest only when the result differs, so adding, renaming, or retitling a lesson reloads the Worker while an edit to lesson prose does not.

## Working with lessons

Each lesson is a complete standalone HTML document with the same inline `<style>` block copy-pasted into it. Start a new lesson by copying an existing one (e.g. `public/core-javascript/01-module-scope.html`) — that duplication is deliberate, there is no shared stylesheet.

Two things in each lesson are **hand-maintained and not generated**, and both must be updated in sibling files when adding, removing, or reordering a lesson:

- `<p class="crumb">Path Name &middot; N of TOTAL</p>` — every lesson in the path carries the total, so inserting one means editing all of them.
- `<nav class="pager">` prev/next links at the bottom, including the neighbour's title text. First lesson uses `<span class="empty">&nbsp;</span>` in place of the prev link; last lesson does the same for next.

Only the `<title>` and file ordering feed the index; nothing else about the file is introspected.

## Code examples

`useEffect` always gets a block body with an explicit `return` statement, and the cleanup function gets a block body too. Never the inline `useEffect(() => () => cleanup(), [])` form, and not `return () => cleanup();` either:

```js
useEffect(() => {
  const id = setTimeout(fn, 1000);

  return () => {
    clearTimeout(id);
  };
}, []);
```

Terse arrows are fine elsewhere in an example — the rule is about the effect body and its cleanup.

## Prose style

Lessons target developers coming from namespace- and class-driven TypeScript. Keep prose lean — no padding, no restating a point already made, no summary paragraphs. Core JavaScript lessons follow a house structure: a short framing paragraph, then `<h2>The old way</h2>` with a TypeScript/class example, then `<h2>The new way</h2>` with the module/functional equivalent, then a brief paragraph on why it holds.
