// Pulls the app code out of index.html and makes sure it compiles.
import { readFileSync, writeFileSync } from "node:fs";
const html = readFileSync("index.html", "utf8");
const m = html.match(/<script type="text\/babel"[^>]*>([\s\S]*?)<\/script>/);
if (!m) { console.error("app script not found"); process.exit(1); }
writeFileSync("/tmp/app.jsx", m[1]);
console.log("extracted", m[1].length, "chars");
