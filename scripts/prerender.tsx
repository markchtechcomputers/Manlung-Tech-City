import React from "react";
import { renderToString } from "react-dom/server";
import fs from "node:fs/promises";
import path from "node:path";
import App from "../client/src/App";
import { siteRoutes, routeMetadata } from "../client/src/data/siteRoutes";

const output = path.resolve("dist/public");
const template = await fs.readFile(path.join(output, "index.html"), "utf8");
const escape = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
function updateMeta(
  html: string,
  attribute: "name" | "property",
  key: string,
  value: string
) {
  const pattern = new RegExp(
    `<meta\\s+${attribute}="${key}"\\s+content="[^"]*"\\s*\\/?\\s*>`
  );
  if (!pattern.test(html)) throw new Error(`Missing expected metadata: ${key}`);
  return html.replace(
    pattern,
    `<meta ${attribute}="${key}" content="${escape(value)}" />`
  );
}
for (const route of [...siteRoutes, routeMetadata("/404")]) {
  const markup = renderToString(<App path={route.path} />);
  let html = template.replace(
    '<div id="root"></div>',
    `<div id="root">${markup}</div>`
  );
  if (!html.includes("<h1"))
    throw new Error(`Missing prerendered body: ${route.path}`);
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${escape(route.title)}</title>`
  );
  html = updateMeta(html, "name", "description", route.description);
  if (route.keywords?.length)
    html = updateMeta(html, "name", "keywords", route.keywords.join(", "));
  html = updateMeta(html, "property", "og:title", route.title);
  html = updateMeta(html, "property", "og:description", route.description);
  html = updateMeta(html, "name", "twitter:title", route.title);
  html = updateMeta(html, "name", "twitter:description", route.description);
  if (route.path === "/404")
    html = html.replace(
      "</head>",
      '<meta name="robots" content="noindex, nofollow" /></head>'
    );
  const directory =
    route.path === "/" ? output : path.join(output, route.path.slice(1));
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(path.join(directory, "index.html"), html);
}
const manifest =
  JSON.stringify(
    { routes: siteRoutes.map(({ path, title }) => ({ path, title })) },
    null,
    2
  ) + "\n";
await fs.writeFile("client/public/manus-routes.json", manifest);
await fs.writeFile(path.join(output, "manus-routes.json"), manifest);
console.log(`Prerendered ${siteRoutes.length} public pages and the 404 page.`);
