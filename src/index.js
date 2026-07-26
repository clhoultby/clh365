import { files } from "./manifest.js";

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

function renderIndex() {
  const items = files
    .map(
      (f) =>
        `      <li><a href="/${f.path}">${escapeHtml(f.title)}</a><span class="path">/${f.path}</span></li>`
    )
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>clh365 -- Training Material</title>
<style>
  :root { color-scheme: light dark; }
  body { font: 16px/1.5 system-ui, -apple-system, sans-serif; max-width: 46rem; margin: 3rem auto; padding: 0 1.25rem; }
  h1 { font-size: 1.4rem; margin-bottom: .25rem; }
  p.sub { color: #888; margin-top: 0; }
  ul { list-style: none; padding: 0; }
  li { display: flex; align-items: baseline; gap: .5rem; padding: .6rem 0; border-bottom: 1px solid rgba(128,128,128,.2); }
  a { text-decoration: none; font-weight: 600; }
  a:hover { text-decoration: underline; }
  .path { color: #888; font-size: .85rem; }
  .empty { color: #888; }
</style>
</head>
<body>
  <h1>clh365 -- Training Material</h1>
  <p class="sub">${files.length} document${files.length === 1 ? "" : "s"}</p>
  ${
    files.length
      ? `<ul>\n${items}\n  </ul>`
      : `<p class="empty">No documents yet. Drop .html files into <code>public/</code>.</p>`
  }
</body>
</html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/" || url.pathname === "") {
      return new Response(renderIndex(), {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
    // Non-root requests that reached the Worker are asset misses;
    // hand them back to the assets layer so not_found_handling (404.html) applies.
    return env.ASSETS.fetch(request);
  },
};
