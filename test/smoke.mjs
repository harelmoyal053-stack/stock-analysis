// Renders the stock-page sections with real data to catch runtime errors before they reach the site.
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
const require = createRequire(import.meta.url);
globalThis.React = require("react");
globalThis.ReactDOM = require("react-dom");
globalThis.PropTypes = require("prop-types");
globalThis.Recharts = require("recharts");
const RDS = require("react-dom/server");
const mem = {};
globalThis.localStorage = { getItem:k=>mem[k]??null, setItem:(k,v)=>{mem[k]=String(v)}, removeItem:k=>{delete mem[k]} };
globalThis.window = globalThis; window.addEventListener = () => {}; window.removeEventListener = () => {}; window.dispatchEvent = () => {};
globalThis.document = { getElementById: () => ({}), documentElement: { setAttribute(){}, removeAttribute(){} } };
const realFetch = globalThis.fetch;

let src = readFileSync("src/app.jsx", "utf8").replace(/ReactDOM\.createRoot[\s\S]*$/, "");
src += `
;globalThis.__T = { S1Business, S2Growth, S3Profit, S4Debt, S5Valuation, S6Moat, S7Management, S8Outlook, api, parseFin, DEFAULT_FH, HomePage, PortfolioPage, ComparePage };`;
writeFileSync("/tmp/t.jsx", src);
execSync("npx --yes esbuild@0.24.0 /tmp/t.jsx --loader:.jsx=jsx --jsx-factory=React.createElement --jsx-fragment=React.Fragment --outfile=/tmp/t.js --log-level=warning");
(0, eval)(readFileSync("/tmp/t.js", "utf8"));
const T = globalThis.__T, key = T.DEFAULT_FH;
const sym = "AAPL";
const got = {};
for (const k of ["profile","metric","rec","fin","earn","peers","insider"]) {
  try { got[k] = await T.api[k](sym, key); } catch (e) { console.log("fetch failed", k, e.message); got[k] = null; }
}
const peerM = [];
for (const p of (got.peers||[]).slice(0,3)) { try { peerM.push({ s:p, m: await T.api.metric(p, key) }); } catch {} }
console.log("fin years:", (got.fin||[]).map(r => `${r.y} rev=${r.rev} fcf=${r.fcf} cash=${r.cash} debt=${r.debt}`).join(" | "));
const E = React.createElement;
const cases = {
  S1: E(T.S1Business, { sym, profile: got.profile }),
  S2: E(T.S2Growth, { fin: got.fin, metric: got.metric }),
  S3: E(T.S3Profit, { fin: got.fin, metric: got.metric }),
  S4: E(T.S4Debt, { fin: got.fin, metric: got.metric }),
  S5: E(T.S5Valuation, { metric: got.metric, peerM }),
  S6: E(T.S6Moat, { sym, metric: got.metric, peerM }),
  S7: E(T.S7Management, { sym, earn: got.earn, insider: got.insider }),
  S8: E(T.S8Outlook, { sym, rec: got.rec, metric: got.metric, fin: got.fin }),
  S2_loading: E(T.S2Growth, { fin: undefined, metric: undefined }),
  S5_unknown: E(T.S6Moat, { sym: "XYZ", metric: got.metric, peerM: [] }),
  Home: E(T.HomePage, { keyFH: key, onSelect(){}, onSettings(){}, go(){} }),
  Portfolio: E(T.PortfolioPage, { keyFH: key, onSelect(){}, onSettings(){}, go(){} }),
  Compare: E(T.ComparePage, { keyFH: key, onSelect(){}, onSettings(){}, go(){} }),
};
let failed = 0;
for (const [name, el] of Object.entries(cases)) {
  try {
    const html = RDS.renderToString(el);
    const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    console.log(`OK ${name}: ${text.slice(0, 160)}`);
  } catch (e) { failed++; console.log(`FAIL ${name}: ${e.stack.split("\n").slice(0,3).join(" | ")}`); }
}
writeFileSync("test/last-run.txt", `${new Date().toISOString()} failed=${failed}\n`);
if (failed) process.exit(1);
