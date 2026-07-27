import { paths } from "./manifest.js";

const HTML_ENTITIES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => HTML_ENTITIES[c]);
}

function renderIndex() {
  const lessonCount = paths.reduce((n, p) => n + p.lessons.length, 0);

  const sections = paths
    .map((p) => {
      const items = p.lessons
        .map(
          (l) =>
            `        <li><a href="/${l.path}">${escapeHtml(l.title)}</a></li>`
        )
        .join("\n");

      return `    <section>
      <h2>${escapeHtml(p.title)}</h2>
      ${p.description ? `<p class="desc">${escapeHtml(p.description)}</p>` : ""}
      <ol>
${items}
      </ol>
    </section>`;
    })
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
  section { margin-top: 2rem; }
  h2 { font-size: 1.1rem; margin-bottom: .15rem; }
  p.desc { color: #888; margin-top: 0; font-size: .9rem; }
  ol { list-style: none; padding: 0; counter-reset: lesson; }
  li { display: flex; align-items: baseline; gap: .5rem; padding: .6rem 0; border-bottom: 1px solid rgba(128,128,128,.2); counter-increment: lesson; }
  li::before { content: counter(lesson) "."; color: #888; font-size: .85rem; }
  a { text-decoration: none; font-weight: 600; }
  a:hover { text-decoration: underline; }
  .empty { color: #888; }
</style>
</head>
<body>
  <h1>Targeted Fundamentals</h1>
  <p class="sub">${paths.length} path${paths.length === 1 ? "" : "s"}, ${lessonCount} lesson${lessonCount === 1 ? "" : "s"}</p>
  ${
    paths.length
      ? sections
      : `<p class="empty">No paths yet. Add a folder of .html files to <code>public/</code>.</p>`
  }
</body>
</html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/") {
      return new Response(renderIndex(), {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
        },
      });
    }
    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status === 404) {
      return new Response(renderIndex(), {
        status: 404,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
        },
      });
    }
    return assetResponse;
  },
};
