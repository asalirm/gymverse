// Builds the installable app in docs/ from the single source page app/qawam.html.
// Usage: node scripts/build-pwa.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "app/qawam.html"), "utf8");
const out = join(root, "docs");
mkdirSync(out, { recursive: true });

const head = `<!doctype html>
<html lang="ar" dir="rtl" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#101B17" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#101B17" media="(prefers-color-scheme: dark)">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icons/icon-192.png" type="image/png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="قوام">
<style>:root{color-scheme:dark;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px/1.5 system-ui,sans-serif;background:#101B17}img{max-width:100%}[hidden]{display:none!important}</style>
</head>
<body>
`;
const tail = `
<script>
if ("serviceWorker" in navigator) addEventListener("load", () => { navigator.serviceWorker.register("sw.js").catch(() => {}); });
try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) {}
</script>
</body>
</html>
`;
const html = head + src + tail;
writeFileSync(join(out, "index.html"), html);

const version = createHash("sha256").update(html).digest("hex").slice(0, 10);
const sw = readFileSync(join(root, "scripts/sw.template.js"), "utf8").replace("__VERSION__", version);
writeFileSync(join(out, "sw.js"), sw);
console.log("docs/ built, cache version", version);
