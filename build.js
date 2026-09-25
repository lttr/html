// Copies artifacts/<slug>/ to dist/<slug>/ and writes dist/index.html from each README.md frontmatter
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const repo = "https://github.com/lttr/html";
const esc = (s) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist");

const artifacts = readdirSync("artifacts").map((slug) => {
  const readme = `artifacts/${slug}/README.md`;
  if (!existsSync(readme)) throw new Error(`${readme} missing`);
  const front = readFileSync(readme, "utf8").match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  const meta = Object.fromEntries(front.split("\n").map((l) => l.match(/^(\w+):\s*(.*)$/)?.slice(1)).filter(Boolean));
  for (const key of ["name", "date", "description"]) if (!meta[key]) throw new Error(`${readme}: ${key} missing`);
  cpSync(`artifacts/${slug}`, `dist/${slug}`, { recursive: true, filter: (f) => !f.endsWith("README.md") });
  return { slug, ...meta };
});

artifacts.sort((a, b) => b.date.localeCompare(a.date));

const items = artifacts.map((a) => `<li><a href="/${a.slug}/">${esc(a.name)}</a> <small>${a.date} · <a href="${repo}/tree/main/artifacts/${a.slug}">readme</a></small><br>${esc(a.description)}</li>`);

writeFileSync("dist/index.html", `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>HTML artifacts</title>
<style>body { font: 16px/1.5 system-ui, sans-serif; max-width: 40rem; margin: 2rem auto; padding: 0 1rem; color-scheme: light dark; } li { margin-bottom: 1rem; } small { color: GrayText; }</style>
<h1>HTML artifacts</h1>
<ul>
${items.join("\n")}
</ul>
<p><small><a href="${repo}">Source</a></small></p>
`);

console.log(`Built ${artifacts.length} artifacts`);
