/* Source of the site. GitHub builds it into app.js automatically on every change. */
const { useState, useEffect, useRef } = React;
const { AreaChart, Area, BarChart, Bar, Cell, Tooltip, ResponsiveContainer, YAxis, XAxis, ReferenceLine, LineChart, Line } = Recharts;

/* ══════════════════════════════════════
   STYLES
══════════════════════════════════════ */
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700;800;900&display=swap');
    :root{--bg:#f0f2f5;--card:#ffffff;--ink:#111827;--fg:#111827;--fg2:#374151;--muted:#6b7280;--soft:#f3f4f6;--soft2:#f8f9fb;--line:#e5e7eb;--nav:rgba(255,255,255,.95);--warn:#fff7ed;--gbg:#dcfce7;--rbg:#fee2e2;color-scheme:light}
    @media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#0b0f17;--card:#151b26;--ink:#1e293b;--fg:#f1f5f9;--fg2:#cbd5e1;--muted:#94a3b8;--soft:#1e2532;--soft2:#1a212d;--line:#283041;--nav:rgba(21,27,38,.95);--warn:#3a2314;--gbg:rgba(34,197,94,.16);--rbg:rgba(239,68,68,.16);color-scheme:dark}}
    :root[data-theme="dark"]{--bg:#0b0f17;--card:#151b26;--ink:#1e293b;--fg:#f1f5f9;--fg2:#cbd5e1;--muted:#94a3b8;--soft:#1e2532;--soft2:#1a212d;--line:#283041;--nav:rgba(21,27,38,.95);--warn:#3a2314;--gbg:rgba(34,197,94,.16);--rbg:rgba(239,68,68,.16);color-scheme:dark}
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html,body,#root{min-height:100%;font-family:'Heebo',sans-serif;background:var(--bg);color:var(--fg);direction:rtl}
    ::-webkit-scrollbar{width:0;height:0}
    @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
    @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
    @keyframes flashG{0%{background:#dcfce7}100%{background:transparent}}
    @keyframes flashR{0%{background:#fee2e2}100%{background:transparent}}
    .fu{animation:fadeUp .4s cubic-bezier(.22,1,.36,1) both}
    .card{background:var(--card);border-radius:20px;box-shadow:0 2px 8px rgba(0,0,0,.06),0 0 0 1px rgba(0,0,0,.04)}
    .tap{cursor:pointer;transition:transform .18s}
    .tap:active{transform:scale(.975)}
    .spin{animation:spin .8s linear infinite;display:inline-block}
    .pdot{animation:pulse 1.6s infinite}
    .sk{background:linear-gradient(90deg,var(--soft) 25%,var(--line) 50%,var(--soft) 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:10px}
    .flashG{animation:flashG 1s ease}
    .flashR{animation:flashR 1s ease}
    input.si{width:100%;background:var(--card);border:1.5px solid var(--line);border-radius:16px;padding:14px 46px 14px 16px;font-size:15px;font-family:'Heebo',sans-serif;color:var(--fg);outline:none;transition:.2s;text-align:right;direction:rtl}
    input.si:focus{border-color:#22c55e;box-shadow:0 0 0 4px rgba(34,197,94,.1)}
    input.ki{width:100%;background:var(--soft2);border:1.5px solid var(--line);border-radius:14px;padding:13px 14px;font-size:14px;font-family:monospace;color:var(--fg);outline:none;direction:ltr;text-align:left}
    input.ki:focus{border-color:#22c55e}
    .btn{background:#22c55e;color:#fff;border:none;border-radius:14px;padding:14px;font-size:15px;font-weight:800;font-family:'Heebo',sans-serif;cursor:pointer;width:100%}
    .btn:disabled{opacity:.4}
    .btn2{background:var(--soft);color:var(--fg2);border:none;border-radius:12px;padding:8px 14px;font-size:13px;font-weight:700;font-family:'Heebo',sans-serif;cursor:pointer}
    .rb{padding:6px 13px;border-radius:10px;border:none;background:transparent;color:#9ca3af;font-size:13px;font-weight:700;cursor:pointer;font-family:'Heebo',sans-serif}
    .rb.on{background:var(--fg);color:var(--bg)}
    .gb{background:var(--gbg);color:#16a34a;border-radius:10px;padding:4px 10px;font-size:13px;font-weight:700}
    .rbd{background:var(--rbg);color:#dc2626;border-radius:10px;padding:4px 10px;font-size:13px;font-weight:700}
    .hd{font-size:17px;font-weight:800;color:var(--fg);margin-bottom:6px}
    .ex{font-size:12px;color:#9ca3af;margin-bottom:12px;line-height:1.5}
    .stat{background:var(--soft2);border-radius:14px;padding:12px}
    .stat .l{font-size:11px;font-weight:600;color:#9ca3af}
    .stat .v{font-size:15px;font-weight:800;color:var(--fg);margin-top:2px}
    .sug{position:absolute;top:calc(100% + 8px);left:0;right:0;background:var(--card);border-radius:18px;box-shadow:0 12px 40px rgba(0,0,0,.14);z-index:200;overflow:hidden}
    .sr{display:flex;align-items:center;justify-content:space-between;padding:13px 16px;cursor:pointer}
    .sr:hover{background:var(--soft)}
    .sr+.sr{border-top:1px solid var(--soft)}
    .bnav{position:fixed;bottom:0;left:0;right:0;background:var(--nav);backdrop-filter:blur(12px);border-top:1px solid var(--line);display:flex;justify-content:space-around;padding:10px 0 22px;z-index:100}
    .ni{display:flex;flex-direction:column;align-items:center;gap:2px;opacity:.35;min-width:56px;cursor:pointer;font-size:20px}
    .ni.on{opacity:1}
    .ni span{font-size:10px;font-weight:700;color:var(--fg2)}
    .sheet{position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:300;display:flex;align-items:flex-end}
    .sheet>div{background:var(--card);max-height:90vh;overflow-y:auto;width:100%;border-radius:24px 24px 0 0;padding:24px 20px 36px;max-width:640px;margin:0 auto}
  `}</style>
);

/* ══════════════════════════════════════
   STATIC HEBREW CONTENT
══════════════════════════════════════ */
const POPULAR = ["AAPL","NVDA","TSLA","MSFT","GOOGL","AMZN"];
const HE = {
  AAPL:{n:"אפל",d:"מייצרת אייפון, מק ושירותים דיגיטליים כמו App Store ו-iCloud."},
  NVDA:{n:"אנבידיה",d:"מייצרת שבבים שמריצים את רוב מערכות הבינה המלאכותית בעולם."},
  TSLA:{n:"טסלה",d:"מייצרת רכבים חשמליים ומערכות לאגירת אנרגיה."},
  MSFT:{n:"מיקרוסופט",d:"מפתחת את Windows ו-Office ומפעילה את שירות הענן Azure."},
  GOOGL:{n:"גוגל",d:"מפעילה את מנוע החיפוש ויוטיוב ומרוויחה בעיקר מפרסום."},
  AMZN:{n:"אמזון",d:"חנות האונליין הגדולה בעולם ובעלת שירות הענן AWS."},
  META:{n:"מטא",d:"הבעלים של פייסבוק, אינסטגרם ו-וואטסאפ, ומרוויחה מפרסום."},
  NFLX:{n:"נטפליקס",d:"שירות סטרימינג של סרטים וסדרות, מרוויחה ממנויים חודשיים."},
  AMD:{n:"AMD",d:"מייצרת מעבדים וכרטיסים גרפיים למחשבים, לקונסולות ולמרכזי נתונים."},
  INTC:{n:"אינטל",d:"מייצרת מעבדים למחשבים ולשרתים, ומפעילה מפעלי שבבים גם בישראל."},
  AVGO:{n:"ברודקום",d:"מייצרת שבבי תקשורת ורשתות ומוכרת תוכנה לחברות גדולות."},
  ORCL:{n:"אורקל",d:"מוכרת מסדי נתונים, תוכנה לעסקים ושירותי ענן."},
  CRM:{n:"סיילספורס",d:"מוכרת תוכנה בענן לניהול לקוחות ומכירות."},
  ADBE:{n:"אדובי",d:"מפתחת את פוטושופ, אקרובט ותוכנות עיצוב, ומרוויחה ממנויים."},
  PYPL:{n:"פייפאל",d:"שירות תשלומים אונליין והעברות כסף."},
  UBER:{n:"אובר",d:"אפליקציה להזמנת נסיעות ומשלוחי אוכל."},
  SHOP:{n:"שופיפיי",d:"פלטפורמה שמאפשרת לעסקים לפתוח חנות אונליין."},
  PLTR:{n:"פלנטיר",d:"תוכנה לניתוח נתונים ובינה מלאכותית לממשלות ולחברות."},
  COIN:{n:"קוינבייס",d:"בורסה לקנייה ומכירה של מטבעות קריפטו."},
  DIS:{n:"דיסני",d:"סרטים, פארקי שעשועים ושירות הסטרימינג דיסני+."},
  NKE:{n:"נייקי",d:"נעלי ספורט, בגדים וציוד ספורט."},
  KO:{n:"קוקה קולה",d:"משקאות קלים שנמכרים כמעט בכל מדינה בעולם."},
  PEP:{n:"פפסיקו",d:"משקאות וחטיפים כמו פפסי, דוריטוס ולייז."},
  MCD:{n:"מקדונלד׳ס",d:"רשת המזון המהיר הגדולה בעולם."},
  WMT:{n:"וולמארט",d:"רשת הסופרמרקטים והחנויות הגדולה בארה״ב."},
  COST:{n:"קוסטקו",d:"רשת חנויות ענק שמוכרת בכמויות גדולות למנויים."},
  JPM:{n:"ג׳יי פי מורגן",d:"הבנק הגדול בארה״ב."},
  V:{n:"ויזה",d:"רשת כרטיסי האשראי, מרוויחה עמלה קטנה על כל עסקה."},
  MA:{n:"מאסטרקארד",d:"רשת כרטיסי אשראי, מרוויחה עמלה על כל עסקה."},
  BAC:{n:"בנק אוף אמריקה",d:"אחד הבנקים הגדולים בארה״ב."},
  XOM:{n:"אקסון מוביל",d:"חברת הנפט והגז הגדולה בארה״ב."},
  JNJ:{n:"ג׳ונסון אנד ג׳ונסון",d:"תרופות ומכשור רפואי."},
  PFE:{n:"פייזר",d:"חברת תרופות וחיסונים."},
  LLY:{n:"אלי לילי",d:"חברת תרופות, ידועה בתרופות להרזיה ולסוכרת."},
  UNH:{n:"יונייטד הלת׳",d:"חברת ביטוח הבריאות הגדולה בארה״ב."},
  BA:{n:"בואינג",d:"מייצרת מטוסי נוסעים ומערכות ביטחוניות."},
  T:{n:"AT&T",d:"חברת תקשורת סלולרית ואינטרנט בארה״ב."},
  TEVA:{n:"טבע",d:"חברת תרופות ישראלית, מהגדולות בעולם בתרופות גנריות."},
  CHKP:{n:"צ׳ק פוינט",d:"חברת סייבר ישראלית שמגינה על רשתות של חברות."},
  WIX:{n:"וויקס",d:"חברה ישראלית שמאפשרת לבנות אתרים בקלות."},
  MBLY:{n:"מובילאיי",d:"חברה ישראלית שמפתחת מערכות לנהיגה אוטונומית."},
  CYBR:{n:"סייברארק",d:"חברת סייבר ישראלית שמגינה על סיסמאות והרשאות."},
  NVO:{n:"נובו נורדיסק",d:"חברת תרופות דנית, יצרנית אוזמפיק."},
  TSM:{n:"TSMC",d:"מפעל השבבים הגדול בעולם, מייצר לאפל, אנבידיה ועוד."},
  ASML:{n:"ASML",d:"מייצרת את המכונות שבעזרתן מייצרים שבבים."},
  SBUX:{n:"סטארבקס",d:"רשת בתי הקפה הגדולה בעולם."},
  SPOT:{n:"ספוטיפיי",d:"שירות סטרימינג של מוזיקה ופודקאסטים."},
  ABNB:{n:"Airbnb",d:"אתר להשכרת דירות ובתים לחופשות."},
  SNOW:{n:"סנואופלייק",d:"שירות ענן לאחסון וניתוח נתונים של חברות."},
  SMCI:{n:"סופר מיקרו",d:"מייצרת שרתים למרכזי נתונים ובינה מלאכותית."},
  ARM:{n:"ARM",d:"מתכננת את ארכיטקטורת השבבים שבכמעט כל טלפון."},
  RIVN:{n:"ריביאן",d:"מייצרת טנדרים ורכבי שטח חשמליים."},
  SOFI:{n:"סופיי",d:"בנק דיגיטלי והלוואות דרך אפליקציה."},
  HOOD:{n:"רובינהוד",d:"אפליקציה למסחר במניות ובקריפטו."},
  ESLT:{n:"אלביט מערכות",d:"חברה ישראלית למערכות ביטחוניות, רחפנים ואלקטרוניקה."},
  NICE:{n:"נייס",d:"חברה ישראלית לתוכנות שירות לקוחות ומוקדים, בענן."},
  MNDY:{n:"מאנדיי",d:"חברה ישראלית לתוכנה לניהול עבודה ופרויקטים."},
  GLBE:{n:"גלובל-אי",d:"חברה ישראלית שעוזרת לחנויות אונליין למכור לכל העולם."},
  ICL:{n:"כיל",d:"חברה ישראלית למינרלים ודשנים מים המלח."},
};
const IND = {Technology:"טכנולוגיה",Semiconductors:"שבבים",Automobiles:"רכב","Media":"מדיה",Retail:"קמעונאות",Banking:"בנקאות",Pharmaceuticals:"תרופות",Software:"תוכנה",Telecommunication:"תקשורת","Financial Services":"פיננסים",Insurance:"ביטוח",Energy:"אנרגיה",Biotechnology:"ביוטכנולוגיה","Hotels, Restaurants & Leisure":"מסעדות ופנאי",Beverages:"משקאות",Aerospace:"תעופה וחלל"};
const nameOf = (s,p) => HE[s]?.n || p?.name || s;
const indOf  = (p) => p?.finnhubIndustry ? (IND[p.finnhubIndustry] || p.finnhubIndustry) : "";

/* ══════════════════════════════════════
   STORAGE + CACHE
══════════════════════════════════════ */
const store = {
  get(k){ try{ return localStorage.getItem(k); }catch{ return null; } },
  set(k,v){ try{ v==null?localStorage.removeItem(k):localStorage.setItem(k,v); }catch{} },
};
const mem = {};
function cached(id, ttl, fn){
  const c = mem[id];
  if (c && "v" in c && Date.now()-c.t < ttl) return Promise.resolve(c.v);
  if (c?.p) return c.p;
  const p = fn()
    .then(v => { mem[id] = { v, t: Date.now() }; return v; })
    .catch(e => { if (c && "v" in c) mem[id] = { v:c.v, t:c.t }; else delete mem[id]; throw e; });
  mem[id] = { ...(c||{}), p };
  return p;
}

/* ══════════════════════════════════════
   DATA PROVIDERS
   Finnhub  — quotes, profile, metrics, analysts, news, financials (free key)
   Twelve Data — historical price chart (optional free key)
══════════════════════════════════════ */
async function fh(path, params, key){
  const r = await fetch(`https://finnhub.io/api/v1${path}?${new URLSearchParams({ ...params, token:key })}`);
  if (r.status===401 || r.status===403) throw new Error("auth");
  if (r.status===429) throw new Error("limit");
  if (!r.ok) throw new Error("http");
  return r.json();
}
const ymd = d => d.toISOString().slice(0,10);
const api = {
  quote:   (s,k) => cached(`q:${s}`,  8e3,   () => fh("/quote",{symbol:s},k)),
  profile: (s,k) => cached(`p:${s}`,  864e5, async () => {
    const saved = store.get(`p:${s}`); if (saved) return JSON.parse(saved);
    const p = await fh("/stock/profile2",{symbol:s},k); if (p?.name) store.set(`p:${s}`, JSON.stringify(p)); return p;
  }),
  metric:  (s,k) => cached(`m:${s}`,  216e5, () => fh("/stock/metric",{symbol:s,metric:"all"},k).then(r=>({ ...(r.metric||{}), _series: r.series||{} }))),
  earn:    (s,k) => cached(`e:${s}`,  216e5, () => fh("/stock/earnings",{symbol:s},k)),
  peers:   (s,k) => cached(`pr:${s}`, 864e5, () => fh("/stock/peers",{symbol:s},k).then(a => (a||[]).filter(x => x!==s && !/[.]/.test(x)).slice(0,5))),
  insider: (s,k) => cached(`in:${s}`, 216e5, () => fh("/stock/insider-transactions",{symbol:s,from:ymd(new Date(Date.now()-182*864e5))},k).then(r => r.data||[])),
  rec:     (s,k) => cached(`r:${s}`,  216e5, () => fh("/stock/recommendation",{symbol:s},k)),
  news:    (s,k) => cached(`n:${s}`,  9e5,   () => fh("/company-news",{symbol:s,from:ymd(new Date(Date.now()-7*864e5)),to:ymd(new Date())},k).then(a=>(a||[]).slice(0,5))),
  fin:     (s,k) => cached(`f:${s}`,  864e5, () => fh("/stock/financials-reported",{symbol:s,freq:"annual"},k).then(parseFin)),
  search:  (q,k) => cached(`s:${q}`,  36e5,  () => fh("/search",{q},k).then(r=>(r.result||[]).filter(x=>x.type==="Common Stock" && !x.symbol.includes(".")).slice(0,6))),
};

const RANGES = { "1D":["5min",78], "1W":["1h",45], "1M":["1day",22], "1Y":["1day",252], "5Y":["1week",260] };
const fmtDay = d => { const [y,m,dd] = d.split("-"); return `${+dd}/${+m}/${y.slice(2)}`; };
const fmtTime = t => new Date(t*1000).toLocaleString("he-IL",{timeZone:"America/New_York",weekday:"short",hour:"2-digit",minute:"2-digit"});
const repoHistory = (s) => cached(`h:${s}`, 6e5, async () => {
  const r = await fetch(`data/${s}.json?v=${Math.floor(Date.now()/6e5)}`);
  if (!r.ok) throw new Error("nohist");
  return r.json();
});
async function history(s, range, tdKey){
  if (tdKey) { try { return await series(s, range, tdKey); } catch(e) { if (e.message==="auth") throw e; } }
  const h = await repoHistory(s);
  if (range === "1D" || range === "1W") {
    let pts = h.i || [];
    if (range === "1D" && pts.length) {
      const day = t => new Date(t*1000).toLocaleDateString("en-US",{timeZone:"America/New_York"});
      const last = day(pts[pts.length-1][0]);
      pts = pts.filter(p => day(p[0]) === last);
    }
    return pts.map(([t,p]) => ({ t:fmtTime(t), p }));
  }
  const n = range==="1M" ? 22 : range==="1Y" ? 252 : Infinity;
  let pts = (h.d || []).slice(-n);
  if (range === "5Y") pts = pts.filter((_,i,a) => i % 5 === 0 || i === a.length-1);
  return pts.map(([d,p]) => ({ t:fmtDay(d), p }));
}
const series = (s, range, key) => cached(`ts:${s}:${range}`, range==="1D"?6e4:36e5, async () => {
  const [interval, outputsize] = RANGES[range];
  const r = await fetch(`https://api.twelvedata.com/time_series?${new URLSearchParams({symbol:s,interval,outputsize,apikey:key})}`);
  const j = await r.json();
  if (j.status==="error") throw new Error(j.code===401?"auth":"td");
  return (j.values||[]).map(v => ({ t:v.datetime, p:+v.close })).reverse();
});

/* Parse the annual reports companies file with the SEC (income statement, balance sheet, cash flow) */
const G_ = s => s.split(" ").map(x => "us-gaap_"+x);
const REV   = G_("Revenues RevenueFromContractWithCustomerExcludingAssessedTax SalesRevenueNet RevenueFromContractWithCustomerIncludingAssessedTax");
const NI    = G_("NetIncomeLoss ProfitLoss NetIncomeLossAvailableToCommonStockholdersBasic");
const GROSS = G_("GrossProfit");
const COGS  = G_("CostOfRevenue CostOfGoodsAndServicesSold CostOfGoodsSold CostOfServices");
const OPCF  = G_("NetCashProvidedByUsedInOperatingActivities NetCashProvidedByUsedInOperatingActivitiesContinuingOperations");
const CAPEX = G_("PaymentsToAcquirePropertyPlantAndEquipment PaymentsToAcquireProductiveAssets");
const CASH  = G_("CashAndCashEquivalentsAtCarryingValue CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents Cash");
const MKTS  = G_("MarketableSecuritiesCurrent ShortTermInvestments AvailableForSaleSecuritiesDebtSecuritiesCurrent");
const DEBT_PARTS = G_("LongTermDebtCurrent LongTermDebtNoncurrent CommercialPaper ShortTermBorrowings DebtCurrent LongTermDebtAndCapitalLeaseObligations");
const DEBT_TOTAL = G_("LongTermDebt DebtLongtermAndShorttermCombinedAmount");
const ACQ   = G_("PaymentsToAcquireBusinessesNetOfCashAcquired PaymentsToAcquireBusinessesGross");
const GW    = G_("Goodwill");
const pick = (rows,list) => { for (const c of list){ const f = rows.find(x=>x.concept===c); if (f && typeof f.value==="number") return f.value; } return null; };
function parseFin(d){
  const byYear = {};
  for (const r of d?.data||[]) {
    const ic = r.report?.ic || [], bs = r.report?.bs || [], cf = r.report?.cf || [];
    const rev = pick(ic,REV), ni = pick(ic,NI);
    if (byYear[r.year] || (rev==null && ni==null)) continue;
    const cogs = pick(ic,COGS);
    const gross = pick(ic,GROSS) ?? (rev!=null && cogs!=null ? rev - cogs : null);
    const opcf = pick(cf,OPCF), capex = pick(cf,CAPEX);
    const parts = DEBT_PARTS.map(c => pick(bs,[c])).filter(v => v!=null);
    const debt = parts.length ? parts.reduce((a,b)=>a+b,0) : pick(bs,DEBT_TOTAL);
    const cash0 = pick(bs,CASH), mkts = pick(bs,MKTS);
    byYear[r.year] = {
      y:String(r.year), rev, ni, gross,
      opcf, capex, fcf: opcf!=null ? opcf - Math.abs(capex||0) : null,
      cash: cash0!=null ? cash0 + (mkts||0) : null, debt: debt ?? 0,
      acq: Math.abs(pick(cf,ACQ) || 0), gw: pick(bs,GW),
    };
  }
  return Object.values(byYear).sort((a,b)=>a.y-b.y).slice(-5);
}

/* ══════════════════════════════════════
   HEBREW TRANSLATION for news headlines (free MyMemory service, cached on the device)
══════════════════════════════════════ */
const trMem = {};
function translateHe(text){
  if (!text) return Promise.resolve(null);
  const k = "tr:" + text.slice(0,140);
  if (trMem[k]) return trMem[k];
  const hit = store.get(k); if (hit) return (trMem[k] = Promise.resolve(hit));
  trMem[k] = fetch(`https://api.mymemory.translated.net/get?${new URLSearchParams({ q:text.slice(0,450), langpair:"en|he" })}`)
    .then(r => r.json())
    .then(j => {
      const t = j?.responseData?.translatedText;
      if (j?.responseStatus != 200 || !t || /MYMEMORY|QUERY LENGTH|INVALID/i.test(t)) return null;
      const clean = t.replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&amp;/g,"&");
      store.set(k, clean); return clean;
    })
    .catch(() => null);
  return trMem[k];
}
function NewsTitle({ text }){
  const [he, setHe] = useState(null);
  useEffect(() => { let a = true; translateHe(text).then(t => a && setHe(t)); return () => { a = false; }; }, [text]);
  return <>
    <div style={{fontWeight:700,fontSize:14,color:"var(--fg)",lineHeight:1.45}}>{he || text}</div>
    {he && <div dir="ltr" style={{fontSize:11,color:"#9ca3af",textAlign:"left",marginTop:3,lineHeight:1.4}}>{text}</div>}
  </>;
}

/* ══════════════════════════════════════
   FORMATTERS
══════════════════════════════════════ */
const B = v => (v/1e9).toFixed(1);
/* Display currency. App sets this each render; prices arrive in USD. */
const CUR = { code:"USD", rate:1 };
const cs = () => CUR.code==="ILS" ? "₪" : "$";
const cv = v => v * CUR.rate;
const cap = m => { if (!m) return "—"; const x = cv(m); return x>=1e6 ? `${cs()}${(x/1e6).toFixed(2)}T` : x>=1e3 ? `${cs()}${(x/1e3).toFixed(0)}B` : `${cs()}${x.toFixed(0)}M`; };
const usd = v => v==null||isNaN(v) ? "—" : `${cs()}${cv(+v).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const usdRaw = v => v==null||isNaN(v) ? "—" : `$${(+v).toFixed(2)}`;
async function loadFx(){
  try { const r = await fetch(`data/fx.json?v=${Math.floor(Date.now()/36e5)}`); if (r.ok) { const j = await r.json(); if (j.ILS) return j.ILS; } } catch {}
  try { const r = await fetch("https://api.frankfurter.app/latest?from=USD&to=ILS"); const j = await r.json(); return j?.rates?.ILS || null; } catch { return null; }
}
function ago(sec){
  const m = Math.floor((Date.now()/1000 - sec)/60);
  if (m < 60) return `לפני ${Math.max(1,m)} דק׳`;
  const h = Math.floor(m/60); if (h < 24) return `לפני ${h} שע׳`;
  const d = Math.floor(h/24); return d===1 ? "אתמול" : `לפני ${d} ימים`;
}
function marketStatus(){
  const ny = new Date(new Date().toLocaleString("en-US",{timeZone:"America/New_York"}));
  const mins = ny.getHours()*60 + ny.getMinutes(), day = ny.getDay();
  if (day===0 || day===6) return { open:false, label:"הבורסה סגורה (סוף שבוע)" };
  return mins>=570 && mins<960 ? { open:true, label:"הבורסה פתוחה" } : { open:false, label:"הבורסה סגורה" };
}
const errText = e => e?.message==="auth" ? "מפתח ה-API לא תקין — בדוק אותו בהגדרות"
  : e?.message==="limit" ? "יותר מדי בקשות — מנסה שוב בעוד רגע" : "בעיית חיבור — מנסה שוב";

/* ══════════════════════════════════════
   SMART SUMMARY — rule-based, from real numbers only
══════════════════════════════════════ */
function buildSummary({ fin, rec, metric, quote }){
  const pts = []; let growing = null, profitable = null;
  if (fin?.length >= 2) {
    const a = fin[fin.length-2].rev, b = fin[fin.length-1].rev;
    if (a && b) {
      const g = (b-a)/Math.abs(a)*100; growing = g > 0;
      pts.push(g>3 ? {i:"📈",t:`ההכנסות גדלו ב-${g.toFixed(0)}% בשנה האחרונה.`}
        : g<-3 ? {i:"📉",t:`ההכנסות ירדו ב-${Math.abs(g).toFixed(0)}% בשנה האחרונה.`}
        : {i:"➖",t:"ההכנסות כמעט לא השתנו בשנה האחרונה."});
    }
  }
  const ni = fin?.[fin.length-1]?.ni;
  if (ni != null) {
    profitable = ni > 0;
    pts.push(ni>0 ? {i:"💰",t:`החברה רווחית — נשארו לה $${B(ni)} מיליארד אחרי כל ההוצאות.`}
                  : {i:"⚠️",t:`החברה הפסידה $${B(Math.abs(ni))} מיליארד בשנה האחרונה.`});
  }
  const r = rec?.[0];
  if (r) {
    const tot = r.buy+r.hold+r.sell+r.strongBuy+r.strongSell;
    const buy = (r.buy+r.strongBuy)/tot, sell = (r.sell+r.strongSell)/tot;
    if (tot) pts.push(buy>=.6 ? {i:"👍",t:`${Math.round(buy*100)}% מהאנליסטים ממליצים לקנות.`}
      : sell>=.3 ? {i:"👎",t:`${Math.round(sell*100)}% מהאנליסטים ממליצים למכור.`}
      : {i:"🤔",t:"האנליסטים חלוקים — רובם ממליצים להחזיק."});
  }
  const hi = metric?.["52WeekHigh"], lo = metric?.["52WeekLow"], c = quote?.c;
  if (hi && lo && c && hi>lo) {
    const pos = (c-lo)/(hi-lo)*100;
    if (pos > 85) pts.push({i:"🔝",t:"המניה קרובה לשיא של השנה האחרונה."});
    else if (pos < 15) pts.push({i:"🔻",t:"המניה קרובה לשפל של השנה האחרונה."});
  }
  return { pts, growing, profitable };
}

/* ══════════════════════════════════════
   SMALL COMPONENTS
══════════════════════════════════════ */
const Sk = ({w="100%",h=16,mt=0,r=10}) => <div className="sk" style={{width:w,height:h,marginTop:mt,borderRadius:r}}/>;

function Logo({ sym, url, size=46 }){
  const [bad, setBad] = useState(false);
  return (
    <div style={{width:size,height:size,borderRadius:size*.3,background:"#ffffff",boxShadow:"0 1px 5px rgba(0,0,0,.12)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0}}>
      {url && !bad
        ? <img src={url} alt={sym} onError={()=>setBad(true)} style={{width:"78%",height:"78%",objectFit:"contain"}}/>
        : <span style={{fontWeight:900,fontSize:size*.36,color:"var(--fg2)"}}>{sym[0]}</span>}
    </div>
  );
}

/* Price that flashes green/red when it changes */
function LivePrice({ value, size=17 }){
  const prev = useRef(value); const [cls, setCls] = useState("");
  useEffect(() => {
    if (prev.current!=null && value!=null && value!==prev.current) {
      setCls(value>prev.current ? "flashG" : "flashR");
      const t = setTimeout(()=>setCls(""), 1000); prev.current = value; return () => clearTimeout(t);
    }
    prev.current = value;
  }, [value]);
  return <span className={cls} style={{fontWeight:900,fontSize:size,color:"var(--fg)",letterSpacing:"-.5px",borderRadius:6,padding:"0 2px"}}>{usd(value)}</span>;
}

const Pct = ({ v }) => v==null ? null : <span className={v>=0?"gb":"rbd"}>{v>=0?"▲":"▼"} {Math.abs(v).toFixed(2)}%</span>;

/* ══════════════════════════════════════
   SAVED LISTS (watchlist + portfolio) — kept in this browser, synced across screens
══════════════════════════════════════ */
const saved = {
  read(k, def){ try { const v = store.get(k); return v ? JSON.parse(v) : def; } catch { return def; } },
  write(k, v){ store.set(k, JSON.stringify(v)); window.dispatchEvent(new CustomEvent("saved:"+k, { detail:v })); },
};
function useSaved(k, def){
  const [v, setV] = useState(() => saved.read(k, def));
  useEffect(() => {
    const on = e => setV(e.detail);
    window.addEventListener("saved:"+k, on);
    return () => window.removeEventListener("saved:"+k, on);
  }, [k]);
  return [v, nv => saved.write(k, typeof nv === "function" ? nv(saved.read(k, def)) : nv)];
}
const useWatch = () => useSaved("watch", POPULAR);
const useHoldings = () => useSaved("holdings", []);

function CurrencyChip(){
  const [cur, setCur] = useSaved("cur","USD");
  return (
    <button className="btn2" onClick={()=>setCur(cur==="USD"?"ILS":"USD")} aria-label="החלף מטבע"
      style={{padding:"6px 10px",fontSize:13,display:"flex",gap:2,alignItems:"center"}}>
      <span style={{opacity:cur==="USD"?1:.35}}>$</span><span style={{opacity:.3}}>/</span><span style={{opacity:cur==="ILS"?1:.35}}>₪</span>
    </button>
  );
}

function BottomNav({ view, go, onSettings }){
  return (
    <div className="bnav">
      <div className={`ni ${view==="home"?"on":""}`} onClick={()=>go("home")}>⭐<span>המניות שלי</span></div>
      <div className={`ni ${view==="portfolio"?"on":""}`} onClick={()=>go("portfolio")}>💼<span>התיק שלי</span></div>
      <div className={`ni ${view==="compare"?"on":""}`} onClick={()=>go("compare")}>⚖️<span>השוואה</span></div>
      <div className="ni" onClick={onSettings}>⚙️<span>הגדרות</span></div>
    </div>
  );
}

/* Small 1-month trend line for list rows (only for stocks with saved history) */
function MiniSpark({ sym }){
  const [pts, setPts] = useState(null);
  useEffect(() => {
    let alive = true;
    repoHistory(sym).then(h => alive && setPts((h.d||[]).slice(-22).map(([,p]) => ({ p })))).catch(() => alive && setPts([]));
    return () => { alive = false; };
  }, [sym]);
  if (!pts || pts.length < 2) return <div style={{width:64}}/>;
  const up = pts[pts.length-1].p >= pts[0].p, c = up ? "#22c55e" : "#ef4444";
  return (
    <div style={{width:64,height:30,flexShrink:0}} title="מגמה בחודש האחרון">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={pts} margin={{top:2,right:0,bottom:2,left:0}}>
          <defs><linearGradient id={`sp-${sym}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c} stopOpacity={.25}/><stop offset="100%" stopColor={c} stopOpacity={0}/>
          </linearGradient></defs>
          <YAxis hide domain={["dataMin","dataMax"]}/>
          <Area type="monotone" dataKey="p" stroke={c} strokeWidth={1.8} fill={`url(#sp-${sym})`} dot={false} isAnimationActive={false}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* Live quotes + profiles for a list of symbols (polls every 30s to stay inside the free limit) */
const qcache = { read(){ try { return JSON.parse(store.get("qcache")||"{}"); } catch { return {}; } } };
function useQuotes(syms, keyFH){
  const [quotes, setQuotes] = useState(() => qcache.read());
  const [profiles, setProfiles] = useState({});
  const [err, setErr] = useState(null);
  const [updated, setUpdated] = useState(null);
  const keyList = syms.join(",");
  useEffect(() => {
    let alive = true;
    const list = keyList ? keyList.split(",") : [];
    list.forEach(s => api.profile(s,keyFH).then(p => alive && setProfiles(x=>({...x,[s]:p}))).catch(()=>{}));
    async function tick(){
      if (!list.length) return;
      const res = await Promise.allSettled(list.map(s => api.quote(s,keyFH)));
      if (!alive) return;
      const next = {}; let firstErr = null;
      res.forEach((r,i) => r.status==="fulfilled" ? next[list[i]] = r.value : firstErr = firstErr || r.reason);
      setQuotes(x=>({...x,...next})); setErr(Object.keys(next).length ? null : firstErr);
      if (Object.keys(next).length) store.set("qcache", JSON.stringify({ ...qcache.read(), ...next }));
      setUpdated(new Date().toLocaleTimeString("he-IL",{hour:"2-digit",minute:"2-digit",second:"2-digit"}));
    }
    tick(); const id = setInterval(tick, 30000);
    return () => { alive = false; clearInterval(id); };
  }, [keyList, keyFH]);
  return { quotes, profiles, err, updated };
}

/* ══════════════════════════════════════
   KEY HANDLING
   Finnhub keys are 20 chars. If two keys were pasted together, try each half.
══════════════════════════════════════ */
// Built-in Finnhub key (free plan). Stored reversed so simple bots scanning GitHub skip it.
const DEFAULT_FH = "golsome8mq10rppdo4bd0olsome8mq10rppdo4bd".split("").reverse().join("");
function candidates(raw){
  const k = (raw||"").replace(/\s+/g,"");
  if (!k) return [];
  return k.length === 40 ? [k, k.slice(0,20), k.slice(20)] : [k];
}
async function findWorkingKey(list){
  for (const k of list) {
    try { const q = await fh("/quote",{symbol:"AAPL"},k); if (q && q.c) return k; }
    catch(e){ if (e.message !== "auth") return k; } // network/limit issue — key may still be fine
  }
  return null;
}

/* ══════════════════════════════════════
   SETUP / SETTINGS
══════════════════════════════════════ */
function KeyForm({ keys, onSave, compact }){
  const [fk, setFk] = useState(keys.fh || "");
  const [tk, setTk] = useState(keys.td || "");
  const [testing, setTesting] = useState(false);
  const [err, setErr] = useState("");
  async function save(){
    setTesting(true); setErr("");
    const working = await findWorkingKey(candidates(fk));
    if (working) onSave({ fh:working, td:tk.trim() });
    else setErr("המפתח לא עבד — העתק שוב רק את שורת ה-API key מהדשבורד של Finnhub");
    setTesting(false);
  }
  return (
    <div>
      <div style={{fontWeight:800,fontSize:14,marginBottom:6}}>מפתח Finnhub <span style={{color:"#dc2626"}}>*</span></div>
      <p className="ex">מחירים חיים, חדשות, אנליסטים ודוחות. הרשמה חינמית ב-finnhub.io — המפתח מופיע מיד בדשבורד.</p>
      <input className="ki" value={fk} onChange={e=>setFk(e.target.value)} placeholder="paste Finnhub key"/>
      <div style={{fontWeight:800,fontSize:14,margin:"18px 0 6px"}}>מפתח Twelve Data <span style={{color:"#9ca3af",fontWeight:600}}>(לא חובה)</span></div>
      <p className="ex">גרף המחיר כבר עובד ל-40+ מניות מוכרות. המפתח הזה מוסיף גרף גם לכל שאר המניות. הרשמה חינמית ב-twelvedata.com.</p>
      <input className="ki" value={tk} onChange={e=>setTk(e.target.value)} placeholder="paste Twelve Data key"/>
      {err && <p style={{color:"#dc2626",fontSize:13,fontWeight:600,marginTop:12}}>{err}</p>}
      <button className="btn" style={{marginTop:20}} disabled={!fk.trim()||testing} onClick={save}>
        {testing ? <span className="spin">↻</span> : compact ? "שמור" : "התחבר והתחל"}
      </button>
      <p style={{fontSize:11,color:"#9ca3af",marginTop:12,lineHeight:1.5}}>המפתחות נשמרים רק בדפדפן שלך.</p>
    </div>
  );
}

function SetupScreen({ keys, onSave }){
  return (
    <div style={{minHeight:"100vh",padding:"48px 20px",maxWidth:520,margin:"0 auto"}}>
      <div className="fu" style={{fontSize:40,marginBottom:12}}>📡</div>
      <h1 className="fu" style={{fontSize:26,fontWeight:900,color:"var(--fg)",marginBottom:8}}>חיבור לנתונים חיים</h1>
      <p className="fu" style={{fontSize:14,color:"var(--muted)",marginBottom:28,lineHeight:1.6}}>האתר מושך נתונים ישירות מספקי נתוני בורסה — לא ניחושים ולא נתונים מומצאים.</p>
      <div className="card fu" style={{padding:20}}><KeyForm keys={keys} onSave={onSave}/></div>
    </div>
  );
}

/* ── Market today: the three big US indexes (tracked through their index funds) ── */
const INDEXES = [["SPY","S&P 500"],["QQQ","נאסד״ק"],["DIA","דאו ג׳ונס"]];
function MarketToday({ keyFH }){
  const { quotes } = useQuotes(INDEXES.map(x=>x[0]), keyFH);
  const vals = INDEXES.map(([s]) => quotes[s]?.dp).filter(v => v!=null);
  const avg = vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : null;
  const mood = avg==null ? null : avg>1 ? ["יום חזק בבורסה 🚀","#16a34a"] : avg>.2 ? ["יום חיובי בבורסה","#16a34a"]
    : avg<-1 ? ["יום קשה בבורסה","#dc2626"] : avg<-.2 ? ["יום שלילי בבורסה","#dc2626"] : ["יום שקט בבורסה","var(--muted)"];
  return (
    <div className="card fu" style={{padding:"14px 16px",margin:"8px 0 18px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:8}}>
        <div style={{fontWeight:800,fontSize:15,color:mood?.[1]||"var(--fg)"}}>{mood ? mood[0] : "השוק האמריקאי היום"}</div>
        <div style={{fontSize:11,color:"#9ca3af"}}>3 המדדים הגדולים</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginTop:10}}>
        {INDEXES.map(([s,n]) => { const v = quotes[s]?.dp; return (
          <div key={s} style={{background:"var(--soft2)",borderRadius:12,padding:"9px 10px"}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--muted)",whiteSpace:"nowrap"}}>{n}</div>
            {v==null ? <Sk h={16} mt={4}/> :
              <div style={{fontSize:15,fontWeight:900,color:v>=0?"#16a34a":"#dc2626",marginTop:2}}>{v>=0?"▲":"▼"} {Math.abs(v).toFixed(2)}%</div>}
          </div>); })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   HOME
══════════════════════════════════════ */
function HomePage({ keyFH, onSelect, onSettings, go }){
  const [watch, setWatch] = useWatch();
  const { quotes, profiles, err, updated } = useQuotes(watch, keyFH);
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const market = marketStatus();

  useEffect(() => {
    const term = q.trim();
    if (!term) { setResults([]); return; }
    const local = Object.entries(HE).filter(([s,v]) => s.includes(term.toUpperCase()) || v.n.includes(term)).map(([s]) => ({symbol:s, description:HE[s].n}));
    setResults(local);
    if (/[a-zA-Z]/.test(term)) {
      setSearching(true);
      const t = setTimeout(() => api.search(term,keyFH).then(r => {
        const seen = new Set(local.map(x=>x.symbol));
        setResults([...local, ...r.filter(x=>!seen.has(x.symbol))].slice(0,7));
      }).catch(()=>{}).finally(()=>setSearching(false)), 350);
      return () => clearTimeout(t);
    }
  }, [q, keyFH]);

  return (
    <div style={{minHeight:"100vh",paddingBottom:90}}>
      <div style={{background:"var(--card)",padding:"14px 20px",borderBottom:"1px solid var(--line)",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:50}}>
        <div>
          <div style={{fontSize:16,fontWeight:800,color:"var(--fg)"}}>ניתוח מניות</div>
          <div style={{fontSize:11,fontWeight:700,color:market.open?"#16a34a":"#dc2626"}}><span className="pdot">●</span> {market.label}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{fontSize:11,color:"#9ca3af",textAlign:"left"}}>
            <div style={{color:"#16a34a",fontWeight:700}}><span className="pdot">●</span> נתונים חיים</div>
            {updated && <div>עודכן {updated}</div>}
          </div>
          <CurrencyChip/>
        </div>
      </div>

      <div style={{padding:"22px 16px",maxWidth:640,margin:"0 auto"}}>
        <h1 className="fu" style={{fontSize:26,fontWeight:900,color:"var(--fg)",marginBottom:4}}>מה השוק עושה היום?</h1>
        <MarketToday keyFH={keyFH}/>

        <div className="fu" style={{position:"relative",marginBottom:24}}>
          <input className="si" placeholder="למשל: AAPL, Netflix, טסלה" value={q} onChange={e=>setQ(e.target.value)}/>
          <span style={{position:"absolute",left:15,top:"50%",transform:"translateY(-50%)",color:"#c0c8d4"}}>{searching ? <span className="spin">↻</span> : "🔍"}</span>
          {results.length>0 && (
            <div className="sug">
              {results.map(r => (
                <div key={r.symbol} className="sr" onClick={()=>{ onSelect(r.symbol); setQ(""); }}>
                  <div>
                    <div style={{fontWeight:800,fontSize:14,color:"var(--fg)"}}>{r.symbol}</div>
                    <div style={{fontSize:12,color:"#9ca3af"}}>{r.description}</div>
                  </div>
                  <span style={{color:"#22c55e",fontWeight:700,fontSize:13}}>פתח ←</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {err && (
          <div className="card" style={{padding:14,marginBottom:14,background:"var(--warn)",display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
            <span style={{fontSize:13,color:"#c2410c",fontWeight:600}}>{errText(err)}</span>
            {err.message==="auth" && <button className="btn2" onClick={onSettings}>הגדרות</button>}
          </div>
        )}

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:12}}>
          <div style={{fontSize:16,fontWeight:800,color:"var(--fg)"}}>⭐ המניות שלי</div>
          <div style={{fontSize:12,color:"#9ca3af"}}>הקו הקטן = המגמה בחודש האחרון</div>
        </div>
        {(() => {
          const moves = watch.map(s => [s, quotes[s]?.dp]).filter(([,v]) => v!=null);
          if (moves.length < 3) return null;
          moves.sort((a,b) => b[1]-a[1]);
          const [top, low] = [moves[0], moves[moves.length-1]];
          const ups = moves.filter(([,v]) => v>0).length;
          return (
            <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
              <span className="gb" style={{fontSize:12}}>🏆 {nameOf(top[0],profiles[top[0]])} {top[1]>=0?"+":""}{top[1].toFixed(1)}%</span>
              {low[1] < 0 && <span className="rbd" style={{fontSize:12}}>📉 {nameOf(low[0],profiles[low[0]])} {low[1].toFixed(1)}%</span>}
              <span style={{fontSize:12,color:"var(--muted)",fontWeight:600,alignSelf:"center"}}>{ups} מתוך {moves.length} עלו היום</span>
            </div>
          );
        })()}
        {watch.length===0 && (
          <div className="card" style={{padding:"22px 18px",textAlign:"center"}}>
            <div style={{fontSize:30}}>⭐</div>
            <div style={{fontWeight:800,fontSize:15,color:"var(--fg)",marginTop:6}}>הרשימה ריקה</div>
            <p className="ex" style={{marginTop:6,marginBottom:12}}>חפש מניה למעלה, היכנס אליה ולחץ על הכוכב כדי להוסיף אותה לכאן.</p>
            <button className="btn2" onClick={()=>setWatch(POPULAR)}>הוסף את המניות הפופולריות</button>
          </div>
        )}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {watch.map((s,i) => {
            const qt = quotes[s], p = profiles[s];
            return (
              <div key={s} className="card tap" onClick={()=>onSelect(s)}
                style={{padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",animation:`fadeUp .4s ${i*.05}s both`}}>
                <div style={{display:"flex",alignItems:"center",gap:12,minWidth:0,flex:1}}>
                  <Logo sym={s} url={p?.logo}/>
                  <div style={{minWidth:0}}>
                    <div style={{fontWeight:800,fontSize:15,color:"var(--fg)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{nameOf(s,p)}</div>
                    <div style={{fontSize:12,color:"#9ca3af"}}>{s}</div>
                  </div>
                </div>
                <MiniSpark sym={s}/>
                <div style={{textAlign:"left",minWidth:82,marginRight:10}}>
                  {qt?.c ? <><LivePrice value={qt.c}/><div style={{marginTop:3}}><Pct v={qt.dp}/></div></>
                         : <><Sk w={70} h={18}/><Sk w={50} h={14} mt={6}/></>}
                </div>
              </div>
            );
          })}
        </div>
        <p style={{textAlign:"center",fontSize:11,color:"#c0c8d4",marginTop:22}}>מקור: Finnhub · מתעדכן כל 30 שניות · לא המלצת השקעה</p>
      </div>
      <BottomNav view="home" go={go} onSettings={onSettings}/>
    </div>
  );
}

/* ══════════════════════════════════════
   STOCK PAGE
══════════════════════════════════════ */
function StockPage({ sym, keys, onBack, onSettings, go, view }){
  const [watch, setWatch] = useWatch();
  const starred = watch.includes(sym);
  const toggleStar = () => setWatch(w => w.includes(sym) ? w.filter(x=>x!==sym) : [...w, sym]);
  const [d, setD] = useState({});
  const [err, setErr] = useState(null);
  const [range, setRange] = useState("1M");
  const [chart, setChart] = useState({ data:null, err:null });

  useEffect(() => {
    let alive = true;
    const set = (k) => (v) => alive && setD(x => ({ ...x, [k]: v }));
    const fail = (k) => (e) => { if (!alive) return; setD(x => ({ ...x, [k]: null })); if (e.message==="auth") setErr(e); };
    ["profile","metric","rec","news","fin","earn","peers","insider"].forEach(k => api[k](sym,keys.fh).then(set(k)).catch(fail(k)));
    const tick = () => api.quote(sym,keys.fh).then(v => { set("quote")(v); alive && setErr(null); }).catch(e => alive && setErr(e));
    tick(); const id = setInterval(tick, 10000);
    return () => { alive = false; clearInterval(id); };
  }, [sym, keys.fh]);

  useEffect(() => {
    let alive = true; setChart(c => ({ data:c.data, err:null, loading:true }));
    history(sym, range, keys.td).then(data => alive && setChart({ data })).catch(e => alive && setChart({ data:null, err:e }));
    return () => { alive = false; };
  }, [sym, range, keys.td]);

  const { quote, profile, metric, rec, news, fin, earn, peers, insider } = d;
  const up = (quote?.dp ?? 0) >= 0;
  const peerM = usePeerMetrics(peers, keys.fh);
  const r = rec?.[0];
  const buy = r ? r.buy + r.strongBuy : 0, sell = r ? r.sell + r.strongSell : 0, hold = r?.hold || 0;
  const tot = buy + hold + sell;
  const hi = metric?.["52WeekHigh"], lo = metric?.["52WeekLow"];
  const pos52 = hi && lo && quote?.c ? Math.min(100, Math.max(0, (quote.c-lo)/(hi-lo)*100)) : null;
  const pe = metric?.peTTM ?? metric?.peBasicExclExtraTTM;
  const div = metric?.dividendYieldIndicatedAnnual;
  const col = up ? "#22c55e" : "#ef4444";
  const chartCol = chart.data?.length > 1 ? (chart.data[chart.data.length-1].p >= chart.data[0].p ? "#22c55e" : "#ef4444") : col;

  return (
    <div style={{minHeight:"100vh",paddingBottom:90}}>
      <div style={{background:"var(--nav)",backdropFilter:"blur(14px)",padding:"12px 16px",borderBottom:"1px solid var(--line)",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50}}>
        <button onClick={onBack} className="btn2" style={{width:38,height:38,padding:0,fontSize:16}}>→</button>
        <div style={{fontWeight:800,fontSize:16,color:"var(--fg)"}}>{nameOf(sym,profile)}</div>
        <button onClick={toggleStar} aria-label={starred?"הסר מהמניות שלי":"הוסף למניות שלי"} className="btn2"
          style={{width:38,height:38,padding:0,fontSize:18,background:starred?"#fef9c3":"#f3f4f6"}}>{starred?"⭐":"☆"}</button>
      </div>

      <div style={{padding:"16px",display:"flex",flexDirection:"column",gap:16,maxWidth:640,margin:"0 auto"}}>
        {err && (
          <div className="card" style={{padding:14,background:"var(--warn)",display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
            <span style={{fontSize:13,color:"#c2410c",fontWeight:600}}>{errText(err)}</span>
            {err.message==="auth" && <button className="btn2" onClick={onSettings}>הגדרות</button>}
          </div>
        )}

        {/* ── Overview ── */}
        <div className="card fu" style={{padding:20}}>
          <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"flex-start"}}>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <Logo sym={sym} url={profile?.logo} size={50}/>
              <div>
                <div style={{fontWeight:900,fontSize:20,color:"var(--fg)"}}>{nameOf(sym,profile)}</div>
                <div style={{fontSize:12,color:"#9ca3af"}}>{sym}{indOf(profile) && ` · ${indOf(profile)}`}</div>
              </div>
            </div>
            <div style={{textAlign:"left"}}>
              {quote?.c ? <><LivePrice value={quote.c} size={28}/><div style={{marginTop:4}}><Pct v={quote.dp}/></div>
                <div style={{fontSize:11,color:"#9ca3af",marginTop:4}}>{up?"+":"−"}${Math.abs(quote.d||0).toFixed(2)} היום</div></>
                : <><Sk w={100} h={30}/><Sk w={70} h={20} mt={6}/></>}
            </div>
          </div>
          <p style={{fontSize:14,color:"var(--muted)",lineHeight:1.6,marginTop:14}}>
            {HE[sym]?.d || (profile ? `${profile.name} פועלת בתחום ${indOf(profile) || "—"}.` : <Sk h={14}/>)}
          </p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginTop:14}}>
            <div className="stat"><div className="l">שווי החברה</div><div className="v">{profile===undefined ? <Sk h={14} mt={4}/> : cap(profile?.marketCapitalization)}</div></div>
            <div className="stat"><div className="l">דיבידנד בשנה</div><div className="v">{metric===undefined ? <Sk h={14} mt={4}/> : div ? `${div.toFixed(2)}%` : "לא משלמת"}</div></div>
          </div>
          <p className="ex" style={{marginTop:10,marginBottom:0}}>שווי החברה = כמה עולות כל המניות שלה ביחד. דיבידנד = כמה מהמחיר החברה מחלקת לבעלי המניות כל שנה.</p>
          <button className="btn2" style={{width:"100%",marginTop:12,padding:11}} onClick={()=>{
            const cur = saved.read("cmp", ["AAPL","MSFT"]); const other = cur.find(x => x!==sym) || "MSFT";
            saved.write("cmp", [sym, other===sym ? "AAPL" : other]); go("compare");
          }}>⚖️ השווה למניה אחרת</button>
          <AlertBox sym={sym} price={quote?.c}/>
        </div>

        {/* ── Chart ── */}
        <div className="card fu" style={{padding:"18px 16px"}}>
          <div className="hd">📈 איך המחיר זז?</div>
          {!(chart.err && chart.err.message==="nohist") ? <>
            {(() => {
              const pts = chart.data; if (!pts?.length) return <p className="ex">המחיר של המניה לאורך הזמן.</p>;
              const a = pts[0].p, b = pts[pts.length-1].p, ch = (b-a)/a*100;
              const words = {"1D":"היום","1W":"בשבוע האחרון","1M":"בחודש האחרון","1Y":"בשנה האחרונה","5Y":"ב-5 השנים האחרונות"}[range];
              return <p className="ex" style={{fontSize:14,fontWeight:700,color:ch>=0?"#16a34a":"#dc2626"}}>
                {ch>=0?"▲ המניה עלתה":"▼ המניה ירדה"} {Math.abs(ch).toFixed(1)}% {words}
                <span style={{color:"#9ca3af",fontWeight:500}}> ({usd(a)} ← {usd(b)})</span></p>;
            })()}
            {chart.data?.length ? (
              <ResponsiveContainer width="100%" height={170}>
                <AreaChart data={chart.data} margin={{top:4,right:0,bottom:0,left:0}}>
                  <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartCol} stopOpacity={.22}/><stop offset="100%" stopColor={chartCol} stopOpacity={0}/>
                  </linearGradient></defs>
                  <YAxis hide domain={["dataMin","dataMax"]}/>
                  <Area type="monotone" dataKey="p" stroke={chartCol} strokeWidth={2.5} fill="url(#cg)" dot={false} isAnimationActive={false}/>
                  <Tooltip content={({active,payload}) => active && payload?.length ? (
                    <div style={{background:"var(--ink)",borderRadius:10,padding:"7px 12px",color:"#fff",fontSize:13,fontWeight:700}}>
                      {usd(payload[0].value)}<div style={{color:"#9ca3af",fontSize:11,fontWeight:500}}>{payload[0].payload.t}</div>
                    </div>) : null}/>
                </AreaChart>
              </ResponsiveContainer>
            ) : chart.err ? <p style={{fontSize:13,color:"#c2410c",padding:"30px 0",textAlign:"center"}}>{chart.err.message==="auth"?"מפתח Twelve Data לא תקין":"לא הצלחתי לטעון את הגרף — נסה שוב בעוד רגע"}</p>
              : <Sk h={170} r={14}/>}
            <div style={{display:"flex",justifyContent:"center",gap:4,marginTop:12}}>
              {Object.keys(RANGES).map(k => <button key={k} className={`rb ${range===k?"on":""}`} onClick={()=>setRange(k)}>{k}</button>)}
            </div>
          </> : <>
            <p className="ex">עוד אין גרף היסטורי למניה הזו. בינתיים, טווח המחיר של היום:</p>
            {quote?.h ? <RangeBar lo={quote.l} hi={quote.h} cur={quote.c} loLabel="נמוך היום" hiLabel="גבוה היום"/> : <Sk h={40}/>}
          </>}
          {pos52!=null && <div style={{marginTop:18}}>
            <p className="ex" style={{marginBottom:8}}>איפה המניה ביחס לשנה האחרונה.</p>
            <RangeBar lo={lo} hi={hi} cur={quote.c} loLabel="שפל שנתי" hiLabel="שיא שנתי"/>
          </div>}
        </div>

        {/* ── The 8 questions to answer before investing ── */}
        <div style={{padding:"6px 2px 0"}}>
          <div style={{fontWeight:900,fontSize:19,color:"var(--fg)"}}>🔍 בדיקה לפני השקעה</div>
          <p className="ex" style={{marginTop:2,marginBottom:0}}>8 השאלות שכדאי לענות עליהן לפני שקונים מניה, לפי הסדר.</p>
        </div>
        <S1Business sym={sym} profile={profile}/>
        <S2Growth fin={fin} metric={metric}/>
        <S3Profit fin={fin} metric={metric}/>
        <S4Debt fin={fin} metric={metric}/>
        <S5Valuation metric={metric} peerM={peerM}/>
        <S6Moat sym={sym} metric={metric} peerM={peerM}/>
        <S7Management sym={sym} earn={earn} insider={insider}/>
        <S8Outlook sym={sym} rec={rec} metric={metric} fin={fin}/>
        <p className="ex" style={{textAlign:"center",margin:0}}>הצבעים הם כללי אצבע ולא המלצת השקעה. מה שנחשב "טוב" משתנה בין תעשיות.</p>

        {/* ── News ── */}
        {news !== null && (
          <div className="fu">
            <div className="hd">📰 חדשות אחרונות</div>
            <p className="ex">כותרות מהשבוע האחרון, מתורגמות אוטומטית לעברית. לחץ לקריאת הכתבה המלאה (באנגלית).</p>
            <div className="card" style={{padding:"4px 16px"}}>
              {news===undefined ? [1,2,3].map(i => <div key={i} style={{padding:"14px 0"}}><Sk h={14}/><Sk h={11} w="40%" mt={6}/></div>)
                : news.length ? news.map((n,i) => (
                  <a key={n.id||i} href={n.url} target="_blank" rel="noopener noreferrer"
                    style={{display:"block",padding:"14px 0",borderTop:i?"1px solid var(--soft)":"none",textDecoration:"none"}}>
                    <NewsTitle text={n.headline}/>
                    <div style={{fontSize:11,color:"#9ca3af",marginTop:4}}>{n.source} · {ago(n.datetime)}</div>
                  </a>
                )) : <p style={{fontSize:13,color:"#9ca3af",padding:"14px 0"}}>אין חדשות מהשבוע האחרון.</p>}
            </div>
          </div>
        )}

        <p style={{textAlign:"center",fontSize:11,color:"#c0c8d4"}}>מקור: Finnhub{keys.td ? " · Twelve Data" : ""} · לא המלצת השקעה</p>
      </div>
      <BottomNav view={view} go={v=>{ onBack(); go(v); }} onSettings={onSettings}/>
    </div>
  );
}

/* ══════════════════════════════════════
   WRITTEN COMPANY PROFILES (approximate, as of mid-2026)
   Free data has no product breakdown, executives or risks, so these are written by hand
   for the most-followed companies. Shares of revenue are rounded.
══════════════════════════════════════ */
const DEEP = {
  AAPL:{ ceo:"טים קוק (מנכ״ל מאז 2011)",
    money:[["אייפון","כחצי מההכנסות"],["שירותים (App Store, iCloud, Apple Music, תשלומים)","כרבע, והחלק הרווחי ביותר"],["מחשבי מק","כ-8%"],["אייפד","כ-7%"],["שעונים, אוזניות ואביזרים","כ-9%"]],
    customers:"מאות מיליוני צרכנים פרטיים בכל העולם. כ-40% מההכנסות מאמריקה, כרבע מאירופה ובערך 15% מסין.",
    moat:["מותג מהחזקים בעולם, שמאפשר לגבות מחירים גבוהים","מערכת סגורה: מי שיש לו אייפון, מק ושעון של אפל מתקשה לעזוב","יותר משני מיליארד מכשירים פעילים שמזינים את עסק השירותים"],
    risks:["תלות גדולה באייפון — שנה חלשה במכירות מורגשת מיד","תחרות והגבלות בסין","רגולציה על App Store והעמלות שאפל גובה","אפל נחשבת מאחרת בתחום הבינה המלאכותית"] },
  NVDA:{ ceo:"ג׳נסן הואנג (מייסד, מנכ״ל מאז 1993)",
    money:[["מרכזי נתונים (שבבי AI לענן)","כ-85%–90% מההכנסות"],["גיימינג (כרטיסי מסך)","כ-8%"],["רכב, רובוטיקה ותחנות עבודה","השאר"]],
    customers:"בעיקר חברות הענן הגדולות (מיקרוסופט, אמזון, גוגל, מטא) וחברות AI. מספר קטן של לקוחות אחראי לחלק גדול מהמכירות.",
    moat:["CUDA: התוכנה שכמעט כל מפתחי ה-AI רגילים אליה, וקשה לעבור ממנה","מובילה טכנולוגית בשבבי AI בפער גדול","רשת שלמה של שבבים, תקשורת ותוכנה שנמכרת כחבילה"],
    risks:["תלות בכמה לקוחות ענקיים שמפתחים גם שבבים משלהם","הגבלות ייצוא לסין","אם ההשקעות בבינה מלאכותית יאטו, ההכנסות עלולות לרדת חד","המחיר כבר מגלם ציפיות גבוהות מאוד"] },
  TSLA:{ ceo:"אילון מאסק (מנכ״ל מאז 2008)",
    money:[["מכירת רכבים חשמליים","כשלושה רבעים מההכנסות"],["אגירת אנרגיה (סוללות לבתים ולחברות חשמל)","כ-10%, וצומח מהר"],["שירות, טעינה ותוכנה (כולל נהיגה אוטונומית)","השאר"]],
    customers:"צרכנים פרטיים, בעיקר בארה״ב, סין ואירופה, וחברות חשמל שקונות מערכות אגירה.",
    moat:["מותג חזק ורשת טעינה גדולה","הרבה נתוני נהיגה לאימון מערכות אוטונומיות","ייצור יעיל של סוללות ורכבים"],
    risks:["תחרות חזקה מיצרניות סיניות כמו BYD","ירידה במחירי הרכבים פוגעת ברווח","חלק גדול מהשווי נשען על הבטחות לרובוטקסי ורובוטים","תלות רבה באילון מאסק"] },
  MSFT:{ ceo:"סאטיה נאדלה (מנכ״ל מאז 2014)",
    money:[["ענן Azure ושרתים","כ-40% מההכנסות, וצומח מהר"],["Office, Teams ולינקדאין","כשליש"],["Windows, Xbox וחיפוש Bing","השאר"]],
    customers:"בעיקר חברות וארגונים בכל העולם שמשלמים מנויים חודשיים, וגם צרכנים פרטיים.",
    moat:["כמעט כל ארגון בעולם עובד עם Office ו-Windows, וקשה לעבור","הכנסות קבועות ממנויים","שותפות עם OpenAI ומיקום מוביל בבינה מלאכותית לעסקים"],
    risks:["הוצאה עצומה על מרכזי נתונים ל-AI שעוד צריכה להחזיר את עצמה","תחרות בענן מאמזון וגוגל","רגולציה והגבלים עסקיים"] },
  GOOGL:{ ceo:"סונדאר פיצ׳אי (מנכ״ל מאז 2015)",
    money:[["פרסום בחיפוש גוגל","כ-55% מההכנסות"],["פרסום ביוטיוב","כ-10%"],["Google Cloud","כ-13%, וצומח מהר"],["מנויים, אנדרואיד ומכשירים","השאר"]],
    customers:"מפרסמים (מעסקים קטנים ועד ענקיים) שמשלמים כדי להופיע בחיפוש וביוטיוב, וחברות שקונות שירותי ענן.",
    moat:["מנוע החיפוש הנפוץ בעולם","יוטיוב, אנדרואיד וכרום — מיליארדי משתמשים","יכולות AI חזקות ושבבים משלה"],
    risks:["צ׳אטבוטים של AI עלולים לקחת חלק מהחיפוש","תביעות הגבלים עסקיים בארה״ב ובאירופה","תלות גדולה בפרסום, שנפגע כשהכלכלה מאטה"] },
  AMZN:{ ceo:"אנדי ג׳סי (מנכ״ל מאז 2021)",
    money:[["חנות אונליין","כ-40% מההכנסות"],["עמלות ממוכרים חיצוניים","כרבע"],["ענן AWS","פחות מחמישית מההכנסות, אבל רוב הרווח"],["פרסום","כ-9%, וצומח מהר"],["מנויי פריים","כ-7%"]],
    customers:"צרכנים פרטיים, מוכרים שמשתמשים בפלטפורמה, וחברות שקונות שירותי ענן.",
    moat:["רשת לוגיסטיקה ומשלוחים שקשה מאוד להעתיק","AWS — ספקית הענן הגדולה בעולם","פריים: מאות מיליוני מנויים נאמנים"],
    risks:["מרווחי רווח נמוכים בקמעונאות","תחרות בענן ממיקרוסופט וגוגל","הוצאות ענק על מרכזי נתונים","רגולציה ותביעות הגבלים עסקיים"] },
  META:{ ceo:"מארק צוקרברג (מייסד, מנכ״ל מאז 2004)",
    money:[["פרסום בפייסבוק, אינסטגרם ו-וואטסאפ","כ-97% מההכנסות"],["Reality Labs (משקפיים ומציאות מדומה)","קטן מאוד, ומפסיד מיליארדים"]],
    customers:"מפרסמים מכל הגדלים שרוצים להגיע לכ-3 מיליארד משתמשים יומיים.",
    moat:["אפקט רשת: כולם שם כי כולם שם","כמות עצומה של נתונים לטירגוט פרסומות","AI שמשפר את התאמת הפרסומות"],
    risks:["תלות כמעט מלאה בפרסום","הוצאות ענק על AI ועל מציאות מדומה","רגולציה על פרטיות ועל בני נוער","צוקרברג שולט בחברה לבד"] },
  NFLX:{ ceo:"טד סרנדוס וגרג פיטרס (מנכ״לים משותפים)",
    money:[["מנויים חודשיים","כמעט כל ההכנסות"],["פרסומות (במנוי הזול)","קטן, וצומח"]],
    customers:"מאות מיליוני מנויים בכמעט כל מדינה בעולם.",
    moat:["שירות הסטרימינג הגדול בעולם","תקציב תוכן ענק שמתחלק על הרבה מנויים","המלצות מותאמות אישית"],
    risks:["תחרות מדיסני+, אמזון, יוטיוב ואחרים","עלויות תוכן גבוהות","אם קצב הצטרפות המנויים יאט, המחיר עלול לרדת"] },
  AMD:{ ceo:"ליסה סו (מנכ״לית מאז 2014)",
    money:[["מרכזי נתונים (מעבדי שרתים ושבבי AI)","כמחצית מההכנסות"],["מעבדים למחשבים","כרבע"],["גיימינג וקונסולות","כ-10%"],["שבבים משובצים","כ-10%"]],
    customers:"יצרניות מחשבים ושרתים, חברות ענן, סוני ומיקרוסופט (קונסולות).",
    moat:["מעבדים תחרותיים מול אינטל","האלטרנטיבה המרכזית לאנבידיה בשבבי AI","עבודה עם TSMC, יצרנית השבבים המתקדמת בעולם"],
    risks:["תחרות קשה מאנבידיה ומאינטל","תלות ב-TSMC בטייוואן","שוק השבבים עולה ויורד חזק"] },
  INTC:{ ceo:"ליפ-בו טאן (מנכ״ל מאז 2025)",
    money:[["מעבדים למחשבים","כ-55% מההכנסות"],["מעבדים לשרתים ומרכזי נתונים","כ-30%"],["ייצור שבבים לחברות אחרות ותחומים נוספים","השאר"]],
    customers:"יצרניות מחשבים (דל, HP, לנובו), חברות ענן וממשלות.",
    moat:["מפעלי ייצור משלה בארה״ב, באירופה ובישראל","קשרים ארוכים עם יצרניות המחשבים"],
    risks:["איבדה נתח שוק ל-AMD ולשבבים של אפל","השקעה ענקית במפעלים שעוד לא החזירה את עצמה","מאחרת בשבבי AI"] },
  TEVA:{ ceo:"ריצ׳רד פרנסיס (מנכ״ל מאז 2023)",
    money:[["תרופות גנריות (חיקויים זולים)","כמחצית מההכנסות"],["תרופות מקוריות (אוסטדו, אג׳ובי, אוזדי)","צומחות מהר"],["קופקסון ותרופות ותיקות","בירידה"]],
    customers:"בתי מרקחת, קופות חולים, ביטוחי בריאות ובתי חולים. בערך מחצית מההכנסות מארה״ב.",
    moat:["אחת מיצרניות התרופות הגנריות הגדולות בעולם","מגוון ענק של תרופות ומפעלים"],
    risks:["חוב גדול שנשאר מרכישות עבר","תחרות מחירים חזקה בתרופות גנריות","פקיעת פטנטים על תרופות מקוריות"] },
  CHKP:{ ceo:"נדב צפריר (מנכ״ל מאז 2024)",
    money:[["מנויי אבטחה","כמחצית מההכנסות"],["תמיכה ותחזוקה","כשליש"],["מכירת מוצרים ורישיונות","השאר"]],
    customers:"חברות, בנקים וממשלות בכל העולם שצריכות להגן על הרשתות שלהן.",
    moat:["עשרות אלפי לקוחות ותיקים שקשה להם להחליף ספק","רווחיות מהגבוהות בתעשייה","הכנסות קבועות ממנויים"],
    risks:["צמיחה איטית יחסית למתחרות","תחרות מפאלו אלטו, פורטינט וקראודסטרייק","מעבר של לקוחות לאבטחה בענן"] },
};

/* ══════════════════════════════════════
   STOCK PAGE SECTIONS — the 8 questions to answer before investing
══════════════════════════════════════ */
const pctTxt = v => `${v>=0?"+":"−"}${Math.abs(v).toFixed(v!=null&&Math.abs(v)<10?1:0)}%`;
const B$ = v => v==null ? "—" : `${v<0?"−":""}$${Math.abs(v/1e9).toFixed(Math.abs(v)<1e10?1:0)}B`;
const median = a => { const x = a.filter(v => v!=null && isFinite(v) && v>0).sort((p,q)=>p-q); return x.length ? x[Math.floor(x.length/2)] : null; };
const VERD = { g:["#16a34a","var(--gbg)"], y:["#ca8a04","rgba(234,179,8,.15)"], r:["#dc2626","var(--rbg)"] };

function Section({ n, title, ask, verdict, children }){
  return (
    <div className="card fu" style={{padding:"16px 16px 18px"}}>
      <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
        <span style={{flexShrink:0,width:28,height:28,borderRadius:9,background:"var(--ink)",color:"#fff",fontWeight:900,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>{n}</span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:900,fontSize:17,color:"var(--fg)",lineHeight:1.3}}>{title}</div>
          <div style={{fontSize:12,color:"#9ca3af",marginTop:2,lineHeight:1.4}}>{ask}</div>
        </div>
      </div>
      {verdict && (
        <div style={{marginTop:12,background:VERD[verdict[0]][1],color:VERD[verdict[0]][0],borderRadius:12,padding:"9px 12px",fontWeight:800,fontSize:14,lineHeight:1.45}}>
          {verdict[1]}
        </div>
      )}
      <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:12}}>{children}</div>
    </div>
  );
}
const Line2 = ({ l, v, sub, color }) => (
  <div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"baseline",padding:"2px 0"}}>
    <span style={{fontSize:13,color:"var(--muted)",fontWeight:600}}>{l}{sub && <span style={{display:"block",fontSize:11,color:"#9ca3af",fontWeight:500}}>{sub}</span>}</span>
    <span style={{fontSize:14,fontWeight:800,color:color||"var(--fg)",whiteSpace:"nowrap"}}>{v}</span>
  </div>
);
const Bullets = ({ items, icon="•", color="var(--fg2)" }) => (
  <div style={{display:"flex",flexDirection:"column",gap:6}}>
    {items.map((t,i) => <div key={i} style={{display:"flex",gap:8,fontSize:13,color,lineHeight:1.5}}><span style={{flexShrink:0}}>{icon}</span><span>{t}</span></div>)}
  </div>
);
const Note = ({ children }) => <p style={{fontSize:12,color:"var(--fg2)",background:"var(--soft2)",borderRadius:10,padding:"8px 10px",lineHeight:1.5}}>{children}</p>;
const Loading = () => <><Sk h={14}/><Sk h={14} w="80%"/><Sk h={60}/></>;

function YearBars({ rows, series, height=130, fmt=B$ }){
  const data = rows.map(r => ({ label:r.y, ...Object.fromEntries(series.map(s => [s.k, r[s.k]!=null ? +(r[s.k]/1e9).toFixed(2) : null])) }));
  return <>
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{top:6,right:2,bottom:0,left:2}} barGap={2}>
        <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false}/>
        <YAxis hide domain={[d=>Math.min(0,d),"auto"]}/>
        <ReferenceLine y={0} stroke="#9ca3af" strokeOpacity={.4}/>
        <Tooltip cursor={{fill:"rgba(0,0,0,.04)"}} content={<ChartTip fmt={v=>`$${v}B`}/>}/>
        {series.map(s => <Bar key={s.k} dataKey={s.k} name={s.name} fill={s.c} radius={[4,4,0,0]} isAnimationActive={false}/>)}
      </BarChart>
    </ResponsiveContainer>
    {series.length>1 && <Legend2 items={series.map(s=>[s.c,s.name])}/>}
  </>;
}

/* 1 — the business */
function S1Business({ sym, profile }){
  const D = DEEP[sym];
  return (
    <Section n={1} title="הבנת העסק" ask="מה החברה עושה, איך היא מרוויחה כסף ומי הלקוחות שלה">
      <p style={{fontSize:14,color:"var(--fg)",lineHeight:1.6}}>{HE[sym]?.d || (profile?.name ? `${profile.name} פועלת בתחום ${indOf(profile) || "—"}.` : "")}</p>
      {D ? <>
        <div>
          <div style={{fontWeight:800,fontSize:14,color:"var(--fg)",marginBottom:6}}>💵 מאיפה מגיע הכסף</div>
          {D.money.map(([what,share]) => <Line2 key={what} l={what} v={share}/>)}
        </div>
        <div>
          <div style={{fontWeight:800,fontSize:14,color:"var(--fg)",marginBottom:4}}>👥 מי הלקוחות</div>
          <p style={{fontSize:13,color:"var(--fg2)",lineHeight:1.55}}>{D.customers}</p>
        </div>
      </> : <Note>פירוט מוצרים ולקוחות כתוב כרגע רק לחברות הגדולות. כאן מופיעים הפרטים הבסיסיים.</Note>}
      {profile && <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {[indOf(profile), profile.country && `מדינה: ${profile.country}`, profile.ipo && `בבורסה מאז ${profile.ipo.slice(0,4)}`, profile.exchange && profile.exchange.split(" ")[0]].filter(Boolean)
          .map(t => <span key={t} style={{fontSize:12,background:"var(--soft)",color:"var(--fg2)",borderRadius:8,padding:"4px 10px",fontWeight:600}}>{t}</span>)}
      </div>}
      {profile?.weburl && <a href={profile.weburl} target="_blank" rel="noopener noreferrer" style={{fontSize:13,color:"#16a34a",fontWeight:700}}>האתר של החברה ←</a>}
    </Section>
  );
}

/* 2 — revenue growth */
function S2Growth({ fin, metric }){
  if (fin === null) return null;
  const rows = (fin||[]).filter(r => r.rev!=null);
  let verdict = null, body = <Loading/>;
  if (fin) {
    if (rows.length < 2) return null;
    const first = rows[0], last = rows[rows.length-1], yrs = rows.length-1;
    const cagr = (Math.pow(last.rev/first.rev, 1/yrs) - 1) * 100;
    const yoy = rows.slice(1).map((r,i) => ({ y:r.y, g:(r.rev/rows[i].rev-1)*100 }));
    const acq = rows.slice(1).reduce((a,r) => a + (r.acq||0), 0);
    const added = last.rev - first.rev;
    const gw0 = rows.find(r => r.gw!=null)?.gw, gw1 = [...rows].reverse().find(r => r.gw!=null)?.gw;
    const bigAcq = (added > 0 && acq > added * 0.25) || (gw0!=null && gw1!=null && gw1 - gw0 > added * 0.25 && gw1 > gw0 * 1.3);
    const ttm = metric?.revenueGrowthTTMYoy;
    verdict = [cagr>=10?"g":cagr>=0?"y":"r",
      cagr>=0 ? `ההכנסות גדלו בממוצע ${cagr.toFixed(1)}% בשנה ב-${yrs} השנים האחרונות` : `ההכנסות ירדו בממוצע ${Math.abs(cagr).toFixed(1)}% בשנה ב-${yrs} השנים האחרונות`];
    body = <>
      <YearBars rows={rows} series={[{k:"rev",name:"הכנסות",c:"#22c55e"}]}/>
      <div>
        {yoy.map(x => <Line2 key={x.y} l={`שינוי ב-${x.y}`} v={pctTxt(x.g)} color={x.g>=0?"#16a34a":"#dc2626"}/>)}
        {ttm!=null && <Line2 l="12 החודשים האחרונים" sub="לעומת 12 החודשים שלפניהם" v={pctTxt(ttm)} color={ttm>=0?"#16a34a":"#dc2626"}/>}
      </div>
      <Note>{added<=0 ? "ההכנסות לא גדלו בתקופה הזו." : bigAcq
        ? `🔎 חלק ניכר מהצמיחה כנראה הגיע מרכישת חברות אחרות (החברה הוציאה בערך ${B$(acq)} על רכישות). צמיחה מרכישות פחות "בריאה" מצמיחה עצמית.`
        : `✅ הצמיחה הגיעה בעיקר מהפעילות של החברה עצמה, לא מרכישות גדולות${acq>0?` (על רכישות הוצאו רק ${B$(acq)})`:""}.`}</Note>
    </>;
  }
  return <Section n={2} title="צמיחת הכנסות" ask="כמה ההכנסות גדלו ב-3–5 השנים האחרונות, ומאיפה הצמיחה הגיעה" verdict={verdict}>{body}</Section>;
}

/* 3 — profitability and free cash flow */
function S3Profit({ fin, metric }){
  if (fin === null && metric === null) return null;
  let verdict = null, body = <Loading/>;
  if (fin !== undefined && metric !== undefined) {
    const rows = (fin||[]).filter(r => r.ni!=null || r.fcf!=null);
    const last = rows[rows.length-1] || {};
    const gm = metric?.grossMarginTTM, gm5 = metric?.grossMargin5Y, nm = metric?.netProfitMarginTTM, nm5 = metric?.netProfitMargin5Y;
    const fcf = last.fcf, ni = last.ni;
    const fcfM = fcf!=null && last.rev ? fcf/last.rev*100 : null;
    const conv = fcf!=null && ni>0 ? fcf/ni : null;
    verdict = fcf==null && nm==null ? null :
      fcf>0 && nm>=10 ? ["g", `כן, החברה מייצרת כסף אמיתי: ${B$(fcf)} תזרים חופשי בשנה האחרונה`] :
      fcf>0 ? ["y", `החברה מייצרת כסף (${B$(fcf)} תזרים חופשי), אבל הרווחיות לא גבוהה`] :
      ["r", fcf!=null ? `החברה שורפת כסף: תזרים חופשי שלילי של ${B$(fcf)}` : "החברה לא רווחית"];
    body = <>
      <div>
        {gm!=null && <Line2 l="רווח גולמי" sub="מכל $100 מכירות, כמה נשאר אחרי עלות המוצר" v={`$${gm.toFixed(0)}`}/>}
        {nm!=null && <Line2 l="רווח נקי" sub="מה שנשאר אחרי כל ההוצאות והמסים" v={nm<0?`הפסד $${Math.abs(nm).toFixed(0)}`:`$${nm.toFixed(0)}`} color={nm<0?"#dc2626":undefined}/>}
        {fcf!=null && <Line2 l={`תזרים מזומנים חופשי (${last.y})`} sub="הכסף שנכנס בפועל, אחרי השקעות בציוד ומפעלים" v={B$(fcf)} color={fcf<0?"#dc2626":"#16a34a"}/>}
        {fcfM!=null && <Line2 l="תזרים חופשי מכל $100 מכירות" v={`$${fcfM.toFixed(0)}`}/>}
      </div>
      {rows.length>1 && <YearBars rows={rows} series={[{k:"ni",name:"רווח נקי",c:"#94a3b8"},{k:"fcf",name:"תזרים חופשי",c:"#22c55e"}]}/>}
      {conv!=null && <Note>{conv>=0.9 ? "✅ הרווח מגובה בכסף אמיתי: התזרים החופשי דומה לרווח או גבוה ממנו." : conv>=0.5 ? "🟡 רק חלק מהרווח הופך לכסף בפועל — החברה משקיעה הרבה בציוד או שהכסף מתעכב אצל לקוחות." : "⚠️ הרווח בדוחות גבוה בהרבה מהכסף שנכנס בפועל. כדאי לבדוק למה."}</Note>}
      {gm5!=null && nm5!=null && <p className="ex" style={{margin:0}}>ממוצע 5 שנים: רווח גולמי ${gm5.toFixed(0)}, רווח נקי ${nm5.toFixed(0)} מכל $100.</p>}
    </>;
  }
  return <Section n={3} title="רווחיות ותזרים מזומנים" ask="האם החברה באמת מייצרת כסף, או רק רווח על הנייר" verdict={verdict}>{body}</Section>;
}

/* 4 — debt and financial position */
function S4Debt({ fin, metric }){
  if (fin === null) return null;
  let verdict = null, body = <Loading/>;
  if (fin !== undefined && metric !== undefined) {
    const rows = (fin||[]).filter(r => r.cash!=null);
    if (!rows.length) return null;
    const first = rows[0], last = rows[rows.length-1];
    const net = last.cash - (last.debt||0);
    const de = metric?.["totalDebt/totalEquityQuarterly"] ?? metric?.["totalDebt/totalEquityAnnual"];
    const cr = metric?.currentRatioQuarterly ?? metric?.currentRatioAnnual;
    const cov = metric?.netInterestCoverageTTM;
    const debtCh = first.debt>0 ? (last.debt/first.debt-1)*100 : null;
    verdict = net >= 0 ? ["g", `לחברה יש יותר מזומן מחוב: ${B$(net)} מזומן נטו`]
      : (de!=null && de<1.5 && (cr==null || cr>=1)) ? ["y", `לחברה יש חוב נטו של ${B$(-net)}, אבל ברמה סבירה`]
      : ["r", `לחברה חוב נטו גבוה: ${B$(-net)}`];
    body = <>
      <div>
        <Line2 l="מזומן והשקעות נזילות" v={B$(last.cash)} color="#16a34a"/>
        <Line2 l="חוב" v={B$(last.debt)} color={last.debt>last.cash?"#dc2626":undefined}/>
        {debtCh!=null && <Line2 l={`שינוי בחוב מאז ${first.y}`} v={pctTxt(debtCh)} color={debtCh>20?"#dc2626":debtCh<-5?"#16a34a":undefined}/>}
        {cr!=null && <Line2 l="יכולת לשלם חשבונות" sub="נכסים זמינים על כל $1 שצריך לשלם בשנה הקרובה" v={`$${cr.toFixed(2)}`} color={cr<1?"#dc2626":undefined}/>}
        {cov!=null && cov>0 && <Line2 l="כיסוי ריבית" sub="כמה פעמים הרווח התפעולי מכסה את הריבית" v={cov>100?"מעל פי 100":`פי ${cov.toFixed(1)}`} color={cov<3?"#dc2626":undefined}/>}
      </div>
      {rows.length>1 && <YearBars rows={rows} series={[{k:"cash",name:"מזומן",c:"#22c55e"},{k:"debt",name:"חוב",c:"#ef4444"}]}/>}
      <Note>{cr!=null && cr<1 ? "🟡 לחברה פחות נכסים זמינים ממה שהיא צריכה לשלם השנה. אצל חברות ענק עם תזרים חזק זה לא בהכרח מסוכן." :
        debtCh>30 ? "⚠️ החוב גדל משמעותית בשנים האחרונות." : "✅ אין סימנים לבעיה בעמידה בהתחייבויות."}</Note>
    </>;
  }
  return <Section n={4} title="חובות ומצב פיננסי" ask="כמה מזומן וכמה חוב יש לחברה, והאם היא יכולה לעמוד בהתחייבויות" verdict={verdict}>{body}</Section>;
}

/* 5 — valuation */
function usePeerMetrics(peers, keyFH){
  const [pm, setPm] = useState(null);
  const key = (peers||[]).join(",");
  useEffect(() => {
    if (!peers?.length) { setPm(peers ? [] : null); return; }
    let alive = true;
    Promise.allSettled(peers.slice(0,4).map(s => api.metric(s,keyFH).then(m => ({ s, m }))))
      .then(rs => alive && setPm(rs.filter(r => r.status==="fulfilled").map(r => r.value)));
    return () => { alive = false; };
  }, [key, keyFH]);
  return pm;
}
function S5Valuation({ metric, peerM }){
  if (metric === null) return null;
  let verdict = null, body = <Loading/>;
  if (metric) {
    const pe = metric.peTTM ?? metric.peBasicExclExtraTTM, fpe = metric.forwardPE, ps = metric.psTTM, ev = metric.evEbitdaTTM;
    const pfcf = metric.pfcfShareTTM, fcfy = pfcf>0 ? 100/pfcf : null, peg = metric.pegTTM;
    const pPE = median((peerM||[]).map(x => x.m.peTTM ?? x.m.peBasicExclExtraTTM));
    const pPS = median((peerM||[]).map(x => x.m.psTTM));
    const implied = pe>0 && fpe>0 ? (pe/fpe-1)*100 : null;
    if (!(pe>0)) verdict = ["r","אין לחברה רווח, אז קשה להעריך אם המחיר הגיוני"];
    else {
      const cheapVsPeers = pPE ? pe < pPE*0.9 : null, richVsPeers = pPE ? pe > pPE*1.3 : null;
      verdict = (pe<20 || (peg>0 && peg<1.2) || cheapVsPeers) && !(richVsPeers && peg>2) ? ["g", `המחיר נראה סביר: ${pe.toFixed(0)} שנות רווח${pPE?` (אצל המתחרות ${pPE.toFixed(0)})`:""}`]
        : (pe>40 && !(peg>0 && peg<1.5)) || (richVsPeers && peg>2) ? ["r", `המניה יקרה: ${pe.toFixed(0)} שנות רווח${pPE?` לעומת ${pPE.toFixed(0)} אצל המתחרות`:""}`]
        : ["y", `המחיר מלא אבל לא קיצוני: ${pe.toFixed(0)} שנות רווח${pPE?` (מתחרות: ${pPE.toFixed(0)})`:""}`];
    }
    const row = (l, sub, v, peer) => <Line2 l={l} sub={sub} v={<span>{v}{peer && <span style={{fontSize:11,color:"#9ca3af",fontWeight:600}}> · מתחרות {peer}</span>}</span>}/>;
    body = <>
      <div>
        {row("מכפיל רווח (P/E)", "כמה שנות רווח משלמים על המניה", pe>0?pe.toFixed(1):"אין רווח", pPE&&pPE.toFixed(1))}
        {fpe>0 && row("מכפיל רווח עתידי (Forward P/E)", "לפי הרווח הצפוי בשנה הבאה", fpe.toFixed(1))}
        {ps>0 && row("מכפיל מכירות (P/S)", "כמה שנות מכירות משלמים", ps.toFixed(1), pPS&&pPS.toFixed(1))}
        {ev>0 && row("EV/EBITDA", "שווי כולל חוב, ביחס לרווח התפעולי", ev.toFixed(1))}
        {fcfy!=null && row("תשואת תזרים חופשי", "כמה כסף החברה מייצרת ביחס למחיר", `${fcfy.toFixed(1)}%`)}
      </div>
      {implied!=null && <Note>📌 <b>מה מגולם במחיר:</b> {implied>0 ? `לפי המכפיל העתידי, השוק מצפה שהרווח יגדל בכ-${implied.toFixed(0)}% בשנה הבאה.` : "לפי המכפיל העתידי, השוק מצפה שהרווח לא יגדל בשנה הבאה, ואולי אפילו ירד."} {peg>0 && (peg<1 ? "ביחס לקצב הצמיחה, המחיר נמוך (PEG מתחת ל-1)." : peg<2 ? "ביחס לקצב הצמיחה, המחיר סביר." : "גם ביחס לקצב הצמיחה, המחיר גבוה.")}</Note>}
      {peerM?.length>0 && <p className="ex" style={{margin:0}}>מתחרות להשוואה: {peerM.map(x => nameOf(x.s)).join(", ")}</p>}
    </>;
  }
  return <Section n={5} title="שווי החברה והתמחור" ask="האם מחיר המניה הגיוני ביחס לרווחים, לצמיחה ולמתחרות" verdict={verdict}>{body}</Section>;
}

/* 6 — competitive advantage */
function S6Moat({ sym, metric, peerM }){
  const D = DEEP[sym];
  if (!D && !metric) return null;
  const gm5 = metric?.grossMargin5Y ?? metric?.grossMarginTTM, roi = metric?.roi5Y ?? metric?.roiTTM;
  const pGM = median((peerM||[]).map(x => x.m.grossMargin5Y ?? x.m.grossMarginTTM));
  const signals = [];
  if (gm5!=null) signals.push(gm5>=50 ? `רווח גולמי גבוה לאורך זמן ($${gm5.toFixed(0)} מכל $100) — סימן שהחברה יכולה לגבות מחיר גבוה ממה שזה עולה לה` : gm5>=30 ? `רווח גולמי בינוני ($${gm5.toFixed(0)} מכל $100)` : `רווח גולמי נמוך ($${gm5.toFixed(0)} מכל $100) — לרוב שוק תחרותי עם מלחמת מחירים`);
  if (gm5!=null && pGM) signals.push(gm5 > pGM*1.15 ? `הרווח הגולמי גבוה מהמתחרות (אצלן $${pGM.toFixed(0)}) — סימן ליתרון` : gm5 < pGM*0.85 ? `הרווח הגולמי נמוך מהמתחרות (אצלן $${pGM.toFixed(0)})` : `רווח גולמי דומה למתחרות`);
  if (roi!=null) signals.push(roi>=15 ? `תשואה גבוהה על ההשקעות (${roi.toFixed(0)}% בשנה) — החברה מרוויחה הרבה מכל שקל שהיא משקיעה` : `תשואה על ההשקעות: ${roi.toFixed(0)}% בשנה`);
  const verdict = gm5==null ? null : gm5>=50 && (!pGM || gm5>=pGM) ? ["g","יש סימנים ברורים ליתרון תחרותי"] : gm5>=30 ? ["y","יתרון תחרותי חלקי"] : ["r","אין סימנים ברורים ליתרון תחרותי במספרים"];
  return (
    <Section n={6} title="יתרון תחרותי" ask="מה מבדיל את החברה מהמתחרות: מותג, טכנולוגיה, לקוחות נאמנים, אפקט רשת או עלויות" verdict={verdict}>
      {D && <div><div style={{fontWeight:800,fontSize:14,color:"var(--fg)",marginBottom:6}}>🛡️ היתרונות של החברה</div><Bullets items={D.moat} icon="✓" /></div>}
      {signals.length>0 && <div><div style={{fontWeight:800,fontSize:14,color:"var(--fg)",marginBottom:6}}>📊 מה המספרים אומרים</div><Bullets items={signals}/></div>}
      {!D && <Note>תיאור מילולי של היתרונות כתוב כרגע רק לחברות הגדולות. המספרים למעלה הם רמז טוב: חברות עם יתרון אמיתי שומרות על רווח גולמי גבוה במשך שנים.</Note>}
    </Section>
  );
}

/* 7 — management and insiders */
function S7Management({ sym, earn, insider }){
  const D = DEEP[sym];
  if (earn === null && insider === null && !D) return null;
  const q = (earn||[]).filter(e => e.actual!=null && e.estimate!=null).slice(0,4);
  const beats = q.filter(e => e.actual >= e.estimate).length;
  const tx = (insider||[]).filter(t => !t.isDerivative && (t.transactionCode==="P" || t.transactionCode==="S") && t.change && t.transactionPrice);
  const buys = tx.filter(t => t.transactionCode==="P"), sells = tx.filter(t => t.transactionCode==="S");
  const val = a => a.reduce((s,t) => s + Math.abs(t.change*t.transactionPrice), 0);
  const fmtM = v => v>=1e9 ? `$${(v/1e9).toFixed(1)}B` : v>=1e6 ? `$${(v/1e6).toFixed(1)}M` : `$${Math.round(v/1e3)}K`;
  const verdict = !q.length ? null : beats>=3 ? ["g", `ההנהלה עמדה בציפיות ב-${beats} מתוך ${q.length} הרבעונים האחרונים`] : beats===2 ? ["y","ההנהלה עמדה בציפיות רק בחצי מהרבעונים"] : ["r",`ההנהלה פספסה את הציפיות ב-${q.length-beats} מתוך ${q.length} רבעונים`];
  const big = [...tx].sort((a,b) => Math.abs(b.change*b.transactionPrice) - Math.abs(a.change*a.transactionPrice)).slice(0,3);
  return (
    <Section n={7} title="הנהלה ובעלי עניין" ask="מי מנהל את החברה, האם ההנהלה עומדת בציפיות והאם המנהלים קונים או מוכרים מניות" verdict={verdict}>
      {D?.ceo && <Line2 l="מנכ״ל" v={D.ceo}/>}
      {earn===undefined ? <Sk h={100}/> : q.length>0 && <EarningsCard earn={earn} bare/>}
      <div>
        <div style={{fontWeight:800,fontSize:14,color:"var(--fg)",marginBottom:6}}>🕴️ קניות ומכירות של מנהלים (חצי שנה)</div>
        {insider===undefined ? <Sk h={40}/> : !tx.length ? <p style={{fontSize:13,color:"var(--muted)"}}>לא היו קניות או מכירות של מנהלים בחצי השנה האחרונה.</p> : <>
          <Line2 l={`קניות (${buys.length})`} v={buys.length?fmtM(val(buys)):"אין"} color={buys.length?"#16a34a":undefined}/>
          <Line2 l={`מכירות (${sells.length})`} v={sells.length?fmtM(val(sells)):"אין"} color={sells.length?"#dc2626":undefined}/>
          <div style={{marginTop:6}}>{big.map(t => <p key={t.id} style={{fontSize:12,color:"var(--muted)",lineHeight:1.6}}>
            {t.transactionCode==="P"?"🟢 קנה":"🔴 מכר"} · <span dir="ltr">{t.name}</span> · {fmtM(Math.abs(t.change*t.transactionPrice))} · {t.transactionDate}</p>)}</div>
        </>}
      </div>
      <Note>{buys.length && val(buys) > val(sells) ? "✅ מנהלים קנו מניות בכסף שלהם — בדרך כלל סימן שהם מאמינים בחברה." :
        "💡 מכירות של מנהלים נפוצות מאוד (הם מקבלים מניות כחלק מהשכר) ולא תמיד סימן רע. קניות הן סימן חזק יותר."}</Note>
      <p className="ex" style={{margin:0}}>אחוז המניות שבידי המנהלים לא זמין במקור הנתונים החינמי.</p>
    </Section>
  );
}

/* 8 — expectations and risks */
function S8Outlook({ sym, rec, metric, fin }){
  const D = DEEP[sym];
  const r = rec?.[0];
  const tot = r ? r.buy+r.strongBuy+r.hold+r.sell+r.strongSell : 0;
  const buyPct = tot ? (r.buy+r.strongBuy)/tot*100 : null;
  const pe = metric?.peTTM ?? metric?.peBasicExclExtraTTM, fpe = metric?.forwardPE;
  const implied = pe>0 && fpe>0 ? (pe/fpe-1)*100 : null;
  const auto = [];
  if (pe>40) auto.push("מחיר גבוה ביחס לרווח — אכזבה קטנה בדוחות עלולה להפיל את המניה חזק");
  const de = metric?.["totalDebt/totalEquityQuarterly"];
  if (de>1.5) auto.push("הרבה חובות — ריבית גבוהה או ירידה במכירות יכבידו על החברה");
  if (metric?.revenueGrowthTTMYoy<0) auto.push("ההכנסות ירדו בשנה האחרונה");
  if (metric?.beta>1.4) auto.push("מניה תנודתית — יכולה לרדת חזק בירידות בשוק");
  const lastFcf = fin?.[fin.length-1]?.fcf;
  if (lastFcf!=null && lastFcf<0) auto.push("החברה שורפת מזומן ועלולה להצטרך לגייס כסף או ללוות");
  if (metric && metric.netProfitMarginTTM<0) auto.push("החברה עדיין מפסידה כסף");
  const risks = [...(D?.risks||[]), ...auto.filter(a => !(D?.risks||[]).some(x => x.slice(0,10)===a.slice(0,10)))];
  const verdict = buyPct==null ? null : buyPct>=60 ? ["g",`רוב האנליסטים אופטימיים: ${buyPct.toFixed(0)}% ממליצים לקנות`] : buyPct>=40 ? ["y",`האנליסטים חלוקים: ${buyPct.toFixed(0)}% ממליצים לקנות`] : ["r",`רוב האנליסטים לא ממליצים לקנות (רק ${buyPct.toFixed(0)}%)`];
  return (
    <Section n={8} title="תחזיות, ציפיות וסיכונים" ask="מה האנליסטים צופים, מה כבר מגולם במחיר, ומה יכול להשתבש" verdict={verdict}>
      {rec===undefined ? <Sk h={120}/> : rec?.length>1 && <AnalystTrendCard rec={rec} bare/>}
      {implied!=null && <Note>📌 <b>מה מגולם במחיר:</b> {implied>0 ? `האנליסטים צופים שהרווח יגדל בכ-${implied.toFixed(0)}% בשנה הבאה, והמחיר הנוכחי כבר מניח שזה יקרה.` : "האנליסטים לא צופים גידול ברווח בשנה הבאה."} אם החברה תצמח פחות מזה, המניה עלולה לרדת גם אם התוצאות "טובות".</Note>}
      {risks.length>0 && <div>
        <div style={{fontWeight:800,fontSize:14,color:"var(--fg)",marginBottom:6}}>⚠️ סיכונים מרכזיים</div>
        <Bullets items={risks} icon="•" color="var(--fg2)"/>
      </div>}
      <p className="ex" style={{margin:0}}>מחיר יעד ותחזיות מספריות של אנליסטים זמינים רק בתוכנית בתשלום של מקור הנתונים.</p>
    </Section>
  );
}

/* ══════════════════════════════════════
   INVESTOR CHECKLIST — the numbers people usually check before buying a stock
   Thresholds are rough rules of thumb; they differ between industries.
══════════════════════════════════════ */
const n1 = v => Math.abs(v) >= 100 ? v.toFixed(0) : Math.abs(v) >= 10 ? v.toFixed(0) : v.toFixed(1);
function checks(m){
  const out = [];
  const add = (o) => out.push(o);
  const rg = m.revenueGrowthTTMYoy, rg5 = m.revenueGrowth5Y;
  if (rg != null) add({ k:"growth", q:"האם החברה גדלה?", light: rg>=10?"g":rg>=0?"y":"r", val:`${rg>=0?"+":""}${n1(rg)}%`,
    t: rg>=0 ? `ההכנסות גדלו ב-${n1(rg)}% בשנה האחרונה${rg5!=null?`, ובממוצע ${n1(rg5)}% בשנה ב-5 השנים האחרונות`:""}.` : `ההכנסות ירדו ב-${n1(-rg)}% בשנה האחרונה.`,
    why:"חברה שמוכרת יותר כל שנה בדרך כלל שווה יותר עם הזמן." });
  const nm = m.netProfitMarginTTM;
  if (nm != null) add({ k:"profit", q:"האם היא מרוויחה?", light: nm>=15?"g":nm>=5?"y":"r", val: nm<0?"הפסד":`$${n1(nm)} מ-$100`,
    t: nm>=0 ? `מכל $100 שהחברה מוכרת, נשארים לה $${n1(nm)} רווח נקי.` : `החברה מפסידה: על כל $100 מכירות היא מפסידה $${n1(-nm)}.`,
    why:"חברה רווחית לא צריכה ללוות או לגייס כסף כדי לשרוד." });
  const eg = m.epsGrowthTTMYoy;
  if (eg != null) add({ k:"eps", q:"האם הרווח גדל?", light: eg>=10?"g":eg>=0?"y":"r", val:`${eg>=0?"+":""}${n1(eg)}%`,
    t: eg>=0 ? `הרווח על כל מניה גדל ב-${n1(eg)}% בשנה האחרונה.` : `הרווח על כל מניה ירד ב-${n1(-eg)}% בשנה האחרונה.`,
    why:"לאורך זמן, מחיר מניה נוטה לזוז יחד עם הרווח שלה." });
  const pe = m.peTTM ?? m.peBasicExclExtraTTM, peg = m.pegTTM;
  if (pe != null) {
    const light = pe<=0 ? "r" : pe<20 ? "g" : pe<=35 ? "y" : (peg>0 && peg<1.5 ? "y" : "r");
    add({ k:"price", q:"האם המחיר סביר?", light, val: pe<=0 ? "אין רווח" : `מכפיל ${n1(pe)}`,
      t: pe<=0 ? "אין לחברה רווח, אז אי אפשר לבדוק אם המחיר סביר ביחס לרווחים." :
        `קונים את המניה במחיר של ${n1(pe)} שנות רווח. ${pe<20?"זה זול יחסית.":pe<=35?"זה מחיר בינוני-גבוה.":light==="y"?"יקר, אבל הרווח גדל מהר.":"זה יקר, והשוק מצפה לצמיחה גדולה."}`,
      why:"גם חברה מעולה יכולה להיות השקעה גרועה אם משלמים עליה יותר מדי." });
  }
  const de = m["totalDebt/totalEquityQuarterly"] ?? m["totalDebt/totalEquityAnnual"];
  if (de != null) add({ k:"debt", q:"כמה חובות יש לה?", light: de<0?"r":de<0.5?"g":de<=1.5?"y":"r", val: de<0?"גבוה מאוד":`$${de.toFixed(2)} חוב ל-$1`,
    t: de<0 ? "לחברה יש יותר חובות מנכסים." : `על כל $1 שבבעלות בעלי המניות, יש לחברה $${de.toFixed(2)} חוב. ${de<0.5?"מעט חובות.":de<=1.5?"כמות חוב סבירה.":"הרבה חובות."}`,
    why:"חוב גדול הופך את החברה לפגיעה כשהריבית עולה או כשהמכירות יורדות." });
  const cr = m.currentRatioQuarterly ?? m.currentRatioAnnual;
  if (cr != null) add({ k:"cash", q:"יש לה כסף לשלם חשבונות?", light: cr>=1.5?"g":cr>=1?"y":"r", val:`${cr.toFixed(2)}`,
    t: `על כל $1 שהחברה צריכה לשלם בשנה הקרובה, יש לה $${cr.toFixed(2)} בכסף ובנכסים שקל למכור. ${cr>=1.5?"מצב נוח.":cr>=1?"מספיק, בקושי.":"פחות ממה שהיא צריכה."}`,
    why:"חברה בלי מספיק כסף זמין עלולה להצטרך הלוואה או גיוס בתנאים גרועים." });
  const roe = m.roeTTM;
  if (roe != null) add({ k:"roe", q:"היא יודעת להרוויח מהכסף?", light: roe>=15?"g":roe>=5?"y":"r", val:`${n1(roe)}%`,
    t: roe>=0 ? `על כל $100 של בעלי המניות, החברה מרוויחה $${n1(roe)} בשנה.` : "החברה מפסידה את הכסף של בעלי המניות.",
    why:"זה מראה כמה טוב ההנהלה משתמשת בכסף שיש לה." });
  const vs = m["priceRelativeToS&P50052Week"];
  if (vs != null) add({ k:"market", q:"ביצעה טוב יותר מהשוק?", light: vs>=0?"g":vs>=-10?"y":"r", val:`${vs>=0?"+":""}${n1(vs)}%`,
    t: vs>=0 ? `בשנה האחרונה המניה עלתה ${n1(vs)}% יותר ממדד S&P 500.` : `בשנה האחרונה המניה הייתה חלשה מהשוק ב-${n1(-vs)}%.`,
    why:"אם מניה מפגרת אחרי השוק, היה עדיף פשוט לקנות קרן מחקה מדד." });
  const b = m.beta;
  if (b != null) add({ k:"beta", q:"כמה היא קופצנית?", light: b<0.8?"g":b<=1.3?"y":"r", val: b<0.8?"רגועה":b<=1.3?"כמו השוק":"קופצנית",
    t: `כשהשוק זז 10%, המניה הזו זזה בערך ${n1(Math.abs(b)*10)}%. ${b<0.8?"תנודות קטנות.":b<=1.3?"תנודות רגילות.":"עליות וירידות חדות, יותר סיכון."}`,
    why:"מניה קופצנית יכולה לרדת חזק דווקא כשצריך את הכסף." });
  return out;
}

const LIGHT = { g:["🟢","#16a34a"], y:["🟡","#ca8a04"], r:["🔴","#dc2626"] };
function HealthCheck({ metric }){
  const [openK, setOpenK] = useState(null);
  if (metric === null) return null;
  const list = metric ? checks(metric) : [];
  if (metric && !list.length) return null;
  const g = list.filter(c=>c.light==="g").length, r = list.filter(c=>c.light==="r").length;
  const verdict = !list.length ? null : g/list.length >= .7 ? ["החברה נראית חזקה ברוב הבדיקות","#16a34a"]
    : r/list.length >= .4 ? ["יש כמה נורות אדומות — כדאי לבדוק לעומק","#dc2626"] : ["תמונה מעורבת: יש נקודות חזקות וחלשות","#ca8a04"];
  return (
    <div className="fu">
      <div className="hd">🩺 בדיקה לפני השקעה</div>
      <p className="ex">הנתונים שמשקיעים בודקים בדרך כלל לפני שקונים מניה. לחץ על שורה כדי להבין למה זה חשוב.</p>
      <div className="card" style={{padding:"16px 16px 6px"}}>
        {!metric ? [1,2,3,4].map(i => <div key={i} style={{padding:"10px 0"}}><Sk h={14}/><Sk h={11} w="70%" mt={6}/></div>) : <>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,paddingBottom:12,borderBottom:"1px solid var(--soft)"}}>
            <div>
              <div style={{fontWeight:900,fontSize:16,color:verdict[1]}}>{verdict[0]}</div>
              <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>{g} ירוקות מתוך {list.length} בדיקות</div>
            </div>
            <div style={{display:"flex",gap:3,flexWrap:"wrap",justifyContent:"flex-end",maxWidth:120}}>
              {list.map(c => <span key={c.k} style={{width:10,height:10,borderRadius:99,background:LIGHT[c.light][1]}}/>)}
            </div>
          </div>
          {list.map((c,i) => (
            <div key={c.k} className="tap" onClick={()=>setOpenK(openK===c.k?null:c.k)}
              style={{padding:"12px 0",borderTop:i?"1px solid var(--soft)":"none"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                <span style={{fontSize:14,lineHeight:"22px"}}>{LIGHT[c.light][0]}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"baseline"}}>
                    <span style={{fontWeight:800,fontSize:14,color:"var(--fg)"}}>{c.q}</span>
                    <span style={{fontWeight:800,fontSize:13,color:LIGHT[c.light][1],whiteSpace:"nowrap"}}>{c.val}</span>
                  </div>
                  <p style={{fontSize:13,color:"var(--muted)",lineHeight:1.5,marginTop:3}}>{c.t}</p>
                  {openK===c.k && <p style={{fontSize:12,color:"var(--fg2)",background:"var(--soft2)",borderRadius:10,padding:"8px 10px",marginTop:8,lineHeight:1.5}}>💡 למה זה חשוב: {c.why}</p>}
                </div>
              </div>
            </div>
          ))}
        </>}
      </div>
      <p className="ex" style={{marginTop:8}}>הצבעים הם כללי אצבע כלליים. מה שנחשב "טוב" משתנה בין תעשיות (למשל, לבנקים יש תמיד הרבה חוב). זו לא המלצת השקעה.</p>
    </div>
  );
}

/* ══════════════════════════════════════
   EXTRA CHARTS — all from the free Finnhub key
══════════════════════════════════════ */
const axisTick = { fill:"#9ca3af", fontSize:11 };
const ChartTip = ({ active, payload, fmt }) => !active || !payload?.length ? null : (
  <div style={{background:"var(--ink)",borderRadius:10,padding:"7px 12px",color:"#fff",fontSize:12,fontWeight:600,direction:"rtl"}}>
    <div style={{color:"#9ca3af",marginBottom:2}}>{payload[0].payload.label}</div>
    {payload.map(p => <div key={p.dataKey}><span style={{color:p.color||p.fill}}>●</span> {p.name}: {fmt ? fmt(p.value) : p.value}</div>)}
  </div>
);
const Legend2 = ({ items }) => (
  <div style={{display:"flex",gap:14,justifyContent:"center",marginTop:8,flexWrap:"wrap"}}>
    {items.map(([c,l]) => <span key={l} style={{fontSize:12,color:"var(--muted)",fontWeight:600,display:"flex",alignItems:"center",gap:5}}>
      <span style={{width:10,height:10,borderRadius:3,background:c,display:"inline-block"}}/>{l}</span>)}
  </div>
);
const qLabel = (period) => { const d = new Date(period); return `Q${Math.floor(d.getUTCMonth()/3)+1} ${String(d.getUTCFullYear()).slice(2)}`; };

const ChartBox = ({ bare, small, title, sub, children }) => bare
  ? <div><div style={{fontWeight:800,fontSize:14,color:"var(--fg)",marginBottom:2}}>{small}</div><div>{children}</div></div>
  : <div className="fu"><div className="hd">{title}</div><p className="ex">{sub}</p><div className="card" style={{padding:"18px 12px 14px"}}>{children}</div></div>;

/* Earnings: actual vs expected, last 4 quarters */
function EarningsCard({ earn, bare }){
  if (earn === null) return null;
  const rows = (earn||[]).filter(e => e.actual!=null && e.estimate!=null).slice(0,4).reverse()
    .map(e => ({ label:qLabel(e.period), est:e.estimate, act:e.actual, beat:e.actual>=e.estimate }));
  if (earn && !rows.length) return null;
  const beats = rows.filter(r=>r.beat).length;
  return (
    <ChartBox bare={bare} small="🎯 רווח בפועל מול ציפיות (4 רבעונים)" title="🎯 האם החברה עמדה בציפיות?" sub="רווח למניה בכל רבעון: מה האנליסטים ציפו מול מה שהחברה הרוויחה בפועל.">
        {!earn ? <Sk h={160}/> : <>
          <div style={{fontSize:15,fontWeight:800,color:beats>=3?"#16a34a":beats<=1?"#dc2626":"#ca8a04",textAlign:"center",marginBottom:10}}>
            {beats===rows.length ? `עברה את הציפיות בכל ${rows.length} הרבעונים האחרונים` : `עברה את הציפיות ב-${beats} מתוך ${rows.length} רבעונים`}
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={rows} margin={{top:6,right:4,bottom:0,left:4}} barGap={3}>
              <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false}/>
              <YAxis hide/>
              <Tooltip cursor={{fill:"rgba(0,0,0,.04)"}} content={<ChartTip fmt={v=>`$${v.toFixed(2)}`}/>}/>
              <Bar dataKey="est" name="צפי" fill="#d1d5db" radius={[4,4,0,0]} isAnimationActive={false}/>
              <Bar dataKey="act" name="בפועל" radius={[4,4,0,0]} isAnimationActive={false}>
                {rows.map((r,i) => <Cell key={i} fill={r.beat?"#22c55e":"#ef4444"}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <Legend2 items={[["#d1d5db","צפי האנליסטים"],["#22c55e","בפועל (עברה)"],["#ef4444","בפועל (פספסה)"]]}/>
        </>}
    </ChartBox>
  );
}

/* Net profit margin over the years */
function MarginCard({ metric }){
  if (metric === null) return null;
  const raw = metric?._series?.annual?.netMargin || [];
  const rows = raw.slice(0,6).reverse().map(x => ({ label:String(new Date(x.period).getUTCFullYear()), v:+(x.v*100).toFixed(1) }));
  if (metric && rows.length < 2) return null;
  const last = rows[rows.length-1], first = rows[0];
  const col = (last?.v ?? 0) >= 0 ? "#22c55e" : "#ef4444";
  return (
    <div className="fu">
      <div className="hd">🧮 כמה מכל דולר נשאר רווח?</div>
      <p className="ex">שולי רווח: מכל 100 דולר שנכנסים לחברה, כמה נשארים אחרי כל ההוצאות.</p>
      <div className="card" style={{padding:"18px 12px 14px"}}>
        {!metric ? <Sk h={150}/> : <>
          <div style={{textAlign:"center",marginBottom:6}}>
            <span style={{fontSize:26,fontWeight:900,color:"var(--fg)"}}>${last.v.toFixed(0)}</span>
            <span style={{fontSize:13,color:"var(--muted)",fontWeight:600}}> רווח מכל $100 (שנת {last.label})</span>
          </div>
          <p style={{fontSize:12,textAlign:"center",fontWeight:700,marginBottom:6,color:last.v>=first.v?"#16a34a":"#dc2626"}}>
            {last.v>=first.v ? `החברה נהייתה רווחית יותר מאז ${first.label}` : `החברה נהייתה פחות רווחית מאז ${first.label}`}
          </p>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={rows} margin={{top:8,right:8,bottom:0,left:8}}>
              <defs><linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={col} stopOpacity={.25}/><stop offset="100%" stopColor={col} stopOpacity={0}/>
              </linearGradient></defs>
              <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false}/>
              <YAxis hide domain={[d=>Math.min(0,d), "dataMax"]}/>
              <ReferenceLine y={0} stroke="#e5e7eb"/>
              <Tooltip content={<ChartTip fmt={v=>`${v}%`}/>}/>
              <Area type="monotone" dataKey="v" name="שולי רווח" stroke={col} strokeWidth={2.5} fill="url(#mg)"
                dot={{r:3,fill:col,strokeWidth:0}} isAnimationActive={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </>}
      </div>
    </div>
  );
}

/* Analyst opinions month by month */
function AnalystTrendCard({ rec, bare }){
  if (rec === null) return null;
  const rows = (rec||[]).slice(0,6).reverse().map(r => {
    const d = new Date(r.period);
    return { label:`${d.getUTCMonth()+1}/${String(d.getUTCFullYear()).slice(2)}`, buy:r.buy+r.strongBuy, hold:r.hold, sell:r.sell+r.strongSell };
  });
  if (rec && rows.length < 2) return null;
  const pct = r => { const t = r.buy+r.hold+r.sell; return t ? Math.round(r.buy/t*100) : 0; };
  const a = rows[0] && pct(rows[0]), b = rows.length && pct(rows[rows.length-1]);
  const trend = b - a;
  return (
    <ChartBox bare={bare} small="📅 המלצות האנליסטים בכל חודש" title="📅 איך דעת האנליסטים השתנתה?" sub="כמה אנליסטים המליצו לקנות, להחזיק או למכור בכל חודש.">
        {!rec ? <Sk h={160}/> : <>
          <p style={{fontSize:14,textAlign:"center",fontWeight:800,marginBottom:8,color:trend>3?"#16a34a":trend<-3?"#dc2626":"#6b7280"}}>
            {trend>3 ? `יותר אנליסטים ממליצים לקנות (${a}% ← ${b}%)` : trend<-3 ? `פחות אנליסטים ממליצים לקנות (${a}% ← ${b}%)` : `הדעות כמעט לא השתנו (${b}% ממליצים לקנות)`}
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={rows} margin={{top:4,right:4,bottom:0,left:4}}>
              <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false}/>
              <YAxis hide/>
              <Tooltip cursor={{fill:"rgba(0,0,0,.04)"}} content={<ChartTip/>}/>
              <Bar dataKey="sell" name="מכירה" stackId="a" fill="#ef4444" isAnimationActive={false}/>
              <Bar dataKey="hold" name="החזקה" stackId="a" fill="#f59e0b" isAnimationActive={false}/>
              <Bar dataKey="buy"  name="קנייה" stackId="a" fill="#22c55e" radius={[4,4,0,0]} isAnimationActive={false}/>
            </BarChart>
          </ResponsiveContainer>
          <Legend2 items={[["#22c55e","קנייה"],["#f59e0b","החזקה"],["#ef4444","מכירה"]]}/>
        </>}
    </ChartBox>
  );
}

const Tag = ({ good, text }) => (
  <span style={{background:good?"rgba(34,197,94,.18)":"rgba(239,68,68,.15)",color:good?"#34d399":"#f87171",borderRadius:10,padding:"6px 14px",fontSize:13,fontWeight:700}}>{text}</span>
);

function RangeBar({ lo, hi, cur, loLabel, hiLabel }){
  const pct = hi>lo ? Math.min(100, Math.max(0, (cur-lo)/(hi-lo)*100)) : 50;
  return (
    <div>
      <div style={{position:"relative",height:8,background:"var(--line)",borderRadius:99}}>
        <div style={{position:"absolute",top:0,right:0,width:`${pct}%`,height:"100%",background:"linear-gradient(to left,#22c55e,#86efac)",borderRadius:99}}/>
        <div style={{position:"absolute",top:"50%",right:`${pct}%`,transform:"translate(50%,-50%)",width:16,height:16,borderRadius:"50%",background:"var(--card)",border:"3px solid #22c55e",boxShadow:"0 1px 4px rgba(0,0,0,.2)"}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:12}}>
        <span><span style={{color:"#9ca3af"}}>{loLabel} </span><b>{usd(lo)}</b></span>
        <span><span style={{color:"#9ca3af"}}>{hiLabel} </span><b>{usd(hi)}</b></span>
      </div>
    </div>
  );
}

function FinCard({ rows, k, label, note, dark }){
  const data = (rows||[]).filter(r => r[k]!=null).map(r => ({ y:r.y, v:+B(r[k]) }));
  const last = data[data.length-1], prev = data[data.length-2];
  const ch = last && prev && prev.v ? (last.v-prev.v)/Math.abs(prev.v)*100 : null;
  const fg = dark ? "#fff" : "#111827", sub = dark ? "rgba(255,255,255,.75)" : "#9ca3af";
  return (
    <div className="card" style={{padding:"16px 14px",background:dark?"#22c55e":"#fff"}}>
      <div style={{fontSize:12,fontWeight:700,color:sub}}>{label}</div>
      {rows===undefined ? <><Sk w={70} h={26} mt={4}/><Sk h={50} mt={10}/></>
        : !last ? <p style={{fontSize:12,color:sub,marginTop:8}}>אין נתונים</p> : <>
          <div style={{fontSize:24,fontWeight:900,color:fg,letterSpacing:"-.5px"}}>${last.v}B</div>
          {ch!=null && <div style={{fontSize:11,fontWeight:700,color:dark?"#fff":ch>=0?"#16a34a":"#dc2626"}}>{ch>=0?"▲":"▼"} {Math.abs(ch).toFixed(0)}% מהשנה הקודמת</div>}
          <ResponsiveContainer width="100%" height={52}>
            <BarChart data={data} margin={{top:8,right:0,bottom:0,left:0}}>
              <Bar dataKey="v" radius={[4,4,0,0]} isAnimationActive={false}>
                {data.map((_,i) => <Cell key={i} fill={dark ? (i===data.length-1?"#fff":"rgba(255,255,255,.35)") : (i===data.length-1?"#15803d":"#cbd5e1")}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:sub}}><span>{data[0]?.y}</span><span>{last.y}</span></div>
          <p style={{fontSize:11,color:sub,marginTop:6}}>{note}</p>
        </>}
    </div>
  );
}

/* ══════════════════════════════════════
   PORTFOLIO — what I own, what it's worth, how much I made
══════════════════════════════════════ */
const money = v => `${v<0?"−":""}${cs()}${Math.abs(cv(v)).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const signed = v => `${v>=0?"+":"−"}${cs()}${Math.abs(cv(v)).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const SLICE = ["#16a34a","#2563eb","#f59e0b","#db2777","#7c3aed","#0891b2","#ea580c","#65a30d"];

function PortfolioPage({ keyFH, onSelect, onSettings, go }){
  const [holdings, setHoldings] = useHoldings();
  const syms = [...new Set(holdings.map(h => h.sym))];
  const { quotes, profiles } = useQuotes(syms, keyFH);
  const [adding, setAdding] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);

  const rows = holdings.map(h => {
    const q = quotes[h.sym], price = q?.c;
    const value = price!=null ? price*h.qty : null, cost = h.cost*h.qty;
    return { ...h, price, value, costTotal:cost, pl: value!=null ? value-cost : null, today: q?.d!=null ? q.d*h.qty : null };
  });
  const ready = rows.length && rows.every(r => r.value!=null);
  const total = rows.reduce((a,r) => a + (r.value||0), 0);
  const cost  = rows.reduce((a,r) => a + r.costTotal, 0);
  const pl = total - cost, plPct = cost ? pl/cost*100 : 0;
  const today = rows.reduce((a,r) => a + (r.today||0), 0);
  const slices = ready ? rows.map((r,i) => ({ sym:r.sym, v:r.value, c:SLICE[i%SLICE.length] })).sort((a,b)=>b.v-a.v) : [];

  return (
    <div style={{minHeight:"100vh",paddingBottom:90}}>
      <div style={{background:"var(--card)",padding:"14px 20px",borderBottom:"1px solid var(--line)",position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:16,fontWeight:800,color:"var(--fg)"}}>💼 התיק שלי</div>
            <div style={{fontSize:11,color:"#9ca3af"}}>נשמר רק במכשיר הזה</div>
          </div>
          <CurrencyChip/>
        </div>
      </div>
      <div style={{padding:"18px 16px",maxWidth:640,margin:"0 auto",display:"flex",flexDirection:"column",gap:16}}>

        {holdings.length===0 ? (
          <div className="card fu" style={{padding:"28px 20px",textAlign:"center"}}>
            <div style={{fontSize:36}}>💼</div>
            <div style={{fontWeight:900,fontSize:18,color:"var(--fg)",marginTop:8}}>עוד לא הוספת מניות</div>
            <p className="ex" style={{marginTop:8}}>הוסף מניה שקנית, כמה יחידות ובאיזה מחיר, ותראה כמה התיק שווה עכשיו וכמה הרווחת.</p>
          </div>
        ) : (
          <div className="fu" style={{background:"var(--ink)",borderRadius:22,padding:"22px 20px",color:"#fff"}}>
            <div style={{fontSize:13,color:"#9ca3af",fontWeight:600}}>שווי התיק עכשיו</div>
            {ready ? <>
              <div style={{fontSize:34,fontWeight:900,letterSpacing:"-1px",marginTop:2}}>{money(total)}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:16}}>
                <div style={{background:"rgba(255,255,255,.07)",borderRadius:14,padding:"12px"}}>
                  <div style={{fontSize:11,color:"#9ca3af",fontWeight:600}}>רווח / הפסד כולל</div>
                  <div style={{fontSize:17,fontWeight:800,color:pl>=0?"#4ade80":"#f87171",marginTop:2}}>{signed(pl)}</div>
                  <div style={{fontSize:12,fontWeight:700,color:pl>=0?"#4ade80":"#f87171"}}>{pl>=0?"▲":"▼"} {Math.abs(plPct).toFixed(1)}%</div>
                </div>
                <div style={{background:"rgba(255,255,255,.07)",borderRadius:14,padding:"12px"}}>
                  <div style={{fontSize:11,color:"#9ca3af",fontWeight:600}}>שינוי היום</div>
                  <div style={{fontSize:17,fontWeight:800,color:today>=0?"#4ade80":"#f87171",marginTop:2}}>{signed(today)}</div>
                  <div style={{fontSize:12,color:"#9ca3af"}}>מאז הפתיחה</div>
                </div>
              </div>
              <p style={{fontSize:12,color:"#9ca3af",marginTop:12}}>שילמת בסך הכל {money(cost)}.</p>
            </> : <div className="sk" style={{height:90,marginTop:8,opacity:.15}}/>}
          </div>
        )}

        {slices.length>1 && (
          <div className="fu">
            <div className="hd">🥧 איך הכסף מחולק</div>
            <p className="ex">כמה מהתיק נמצא בכל מניה. פיזור בין כמה מניות מקטין סיכון.</p>
            <div className="card" style={{padding:16}}>
              <div style={{display:"flex",height:14,borderRadius:99,overflow:"hidden",gap:2}}>
                {slices.map(x => <div key={x.sym} style={{flex:x.v,background:x.c}}/>)}
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:"8px 14px",marginTop:12}}>
                {slices.map(x => <span key={x.sym} style={{fontSize:12,fontWeight:700,color:"var(--fg2)",display:"flex",alignItems:"center",gap:5}}>
                  <span style={{width:9,height:9,borderRadius:3,background:x.c}}/>{nameOf(x.sym,profiles[x.sym])} {Math.round(x.v/total*100)}%</span>)}
              </div>
            </div>
          </div>
        )}

        {rows.length>0 && (
          <div className="fu">
            <div className="hd">📋 המניות בתיק</div>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:8}}>
              {rows.map(r => (
                <div key={r.id} className="card" style={{padding:"14px 16px"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
                    <div className="tap" onClick={()=>onSelect(r.sym)} style={{display:"flex",alignItems:"center",gap:12,minWidth:0}}>
                      <Logo sym={r.sym} url={profiles[r.sym]?.logo} size={42}/>
                      <div style={{minWidth:0}}>
                        <div style={{fontWeight:800,fontSize:15,color:"var(--fg)"}}>{nameOf(r.sym,profiles[r.sym])}</div>
                        <div style={{fontSize:12,color:"#9ca3af"}}>{r.qty} מניות · קנית ב-{usd(r.cost)}</div>
                      </div>
                    </div>
                    <div style={{textAlign:"left",flexShrink:0}}>
                      {r.value!=null ? <>
                        <div style={{fontWeight:900,fontSize:16,color:"var(--fg)"}}>{money(r.value)}</div>
                        <div style={{fontSize:12,fontWeight:700,color:r.pl>=0?"#16a34a":"#dc2626"}}>{signed(r.pl)} ({r.pl>=0?"+":"−"}{Math.abs(r.pl/r.costTotal*100).toFixed(1)}%)</div>
                      </> : <><Sk w={70} h={16}/><Sk w={60} h={12} mt={5}/></>}
                    </div>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10,paddingTop:10,borderTop:"1px solid var(--soft)"}}>
                    <span style={{fontSize:12,color:"var(--muted)"}}>מחיר עכשיו: <b>{usd(r.price)}</b></span>
                    {confirmDel===r.id
                      ? <span style={{display:"flex",gap:6}}>
                          <button className="btn2" style={{background:"#fee2e2",color:"#dc2626"}} onClick={()=>{ setHoldings(h=>h.filter(x=>x.id!==r.id)); setConfirmDel(null); }}>כן, הסר</button>
                          <button className="btn2" onClick={()=>setConfirmDel(null)}>ביטול</button>
                        </span>
                      : <button className="btn2" style={{fontSize:12,padding:"6px 12px"}} onClick={()=>setConfirmDel(r.id)}>הסר</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {adding
          ? <AddHolding keyFH={keyFH} onDone={h => { if (h) setHoldings(x => [...x, h]); setAdding(false); }}/>
          : <button className="btn" onClick={()=>setAdding(true)}>➕ הוסף מניה לתיק</button>}

        <p style={{textAlign:"center",fontSize:11,color:"#c0c8d4"}}>הנתונים נשמרים רק במכשיר הזה · לא המלצת השקעה</p>
      </div>
      <BottomNav view="portfolio" go={go} onSettings={onSettings}/>
    </div>
  );
}

function AddHolding({ keyFH, onDone }){
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [sym, setSym] = useState(null);
  const [price, setPrice] = useState(null);
  const [qty, setQty] = useState("");
  const [cost, setCost] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const term = q.trim(); if (!term || sym) { setResults([]); return; }
    const local = Object.entries(HE).filter(([s,v]) => s.includes(term.toUpperCase()) || v.n.includes(term)).map(([s]) => ({symbol:s, description:HE[s].n}));
    setResults(local);
    if (/[a-zA-Z]/.test(term)) {
      const t = setTimeout(() => api.search(term,keyFH).then(r => {
        const seen = new Set(local.map(x=>x.symbol));
        setResults([...local, ...r.filter(x=>!seen.has(x.symbol))].slice(0,6));
      }).catch(()=>{}), 350);
      return () => clearTimeout(t);
    }
  }, [q, sym, keyFH]);

  function choose(s){
    setSym(s); setQ(s); setResults([]); setErr("");
    api.quote(s,keyFH).then(r => { if (r?.c) { setPrice(r.c); setCost(c => c || String(r.c)); } }).catch(()=>{});
  }
  function save(){
    const n = parseFloat(qty), c = parseFloat(cost);
    if (!sym) return setErr("בחר מניה מהרשימה");
    if (!(n > 0)) return setErr("כמה מניות קנית? הכנס מספר גדול מ-0");
    if (!(c > 0)) return setErr("באיזה מחיר קנית? הכנס מחיר בדולרים");
    onDone({ id: Date.now().toString(36), sym, qty:n, cost:c });
  }
  const lbl = { fontSize:13, fontWeight:800, color:"var(--fg)", marginBottom:6, display:"block" };
  const inp = { width:"100%", background:"var(--soft2)", border:"1.5px solid var(--line)", borderRadius:14, padding:"13px 14px", fontSize:16, fontFamily:"'Heebo',sans-serif", outline:"none" };

  return (
    <div className="card fu" style={{padding:18,display:"flex",flexDirection:"column",gap:14}}>
      <div style={{fontWeight:900,fontSize:17,color:"var(--fg)"}}>➕ מניה חדשה בתיק</div>
      <div style={{position:"relative"}}>
        <label style={lbl} htmlFor="h-sym">איזו מניה?</label>
        <input id="h-sym" style={inp} placeholder="למשל: אפל או AAPL" value={q} onChange={e=>{ setQ(e.target.value); setSym(null); setPrice(null); }}/>
        {results.length>0 && (
          <div className="sug">
            {results.map(r => (
              <div key={r.symbol} className="sr" onClick={()=>choose(r.symbol)}>
                <div><div style={{fontWeight:800,fontSize:14}}>{r.symbol}</div><div style={{fontSize:12,color:"#9ca3af"}}>{r.description}</div></div>
                <span style={{color:"#22c55e",fontWeight:700,fontSize:13}}>בחר</span>
              </div>
            ))}
          </div>
        )}
        {sym && <div style={{fontSize:12,color:"#16a34a",fontWeight:700,marginTop:6}}>✓ {nameOf(sym)}{price ? ` · מחיר עכשיו ${usdRaw(price)}` : ""}</div>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div><label style={lbl} htmlFor="h-qty">כמה מניות?</label>
          <input id="h-qty" style={inp} type="number" inputMode="decimal" min="0" step="any" placeholder="10" value={qty} onChange={e=>setQty(e.target.value)}/></div>
        <div><label style={lbl} htmlFor="h-cost">מחיר קנייה ($)</label>
          <input id="h-cost" style={inp} type="number" inputMode="decimal" min="0" step="any" placeholder="150" value={cost} onChange={e=>setCost(e.target.value)}/></div>
      </div>
      {qty>0 && cost>0 && <p className="ex" style={{margin:0}}>סך הכל שילמת: <b>{usdRaw(qty*cost)}</b></p>}
      {err && <p style={{color:"#dc2626",fontSize:13,fontWeight:700,margin:0}}>{err}</p>}
      <div style={{display:"flex",gap:10}}>
        <button className="btn" style={{flex:2}} onClick={save}>שמור בתיק</button>
        <button className="btn2" style={{flex:1}} onClick={()=>onDone(null)}>ביטול</button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   COMPARE TWO STOCKS
══════════════════════════════════════ */
function SymbolPicker({ value, onPick, keyFH, color }){
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);
  useEffect(() => {
    const term = q.trim(); if (!term) { setResults([]); return; }
    const local = Object.entries(HE).filter(([s,v]) => s.includes(term.toUpperCase()) || v.n.includes(term)).map(([s]) => ({symbol:s, description:HE[s].n}));
    setResults(local);
    if (/[a-zA-Z]/.test(term)) {
      const t = setTimeout(() => api.search(term,keyFH).then(r => {
        const seen = new Set(local.map(x=>x.symbol));
        setResults([...local, ...r.filter(x=>!seen.has(x.symbol))].slice(0,6));
      }).catch(()=>{}), 350);
      return () => clearTimeout(t);
    }
  }, [q, keyFH]);
  return (
    <div style={{position:"relative",flex:1,minWidth:0}}>
      {!open ? (
        <button className="btn2" onClick={()=>setOpen(true)} style={{width:"100%",padding:"12px 10px",background:"var(--card)",border:`2px solid ${color}`,borderRadius:14}}>
          <div style={{fontWeight:900,fontSize:15,color:"var(--fg)"}}>{nameOf(value)}</div>
          <div style={{fontSize:11,color:"#9ca3af"}}>{value} · החלף</div>
        </button>
      ) : (
        <input autoFocus className="si" style={{padding:"12px",fontSize:14,border:`2px solid ${color}`}} placeholder="חפש מניה"
          value={q} onChange={e=>setQ(e.target.value)} onBlur={()=>setTimeout(()=>{ setOpen(false); setQ(""); }, 200)}/>
      )}
      {open && results.length>0 && (
        <div className="sug">
          {results.map(r => (
            <div key={r.symbol} className="sr" onMouseDown={e=>e.preventDefault()} onClick={()=>{ onPick(r.symbol); setOpen(false); setQ(""); }}>
              <div><div style={{fontWeight:800,fontSize:14}}>{r.symbol}</div><div style={{fontSize:12,color:"#9ca3af"}}>{r.description}</div></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function useStockFacts(sym, keyFH){
  const [f, setF] = useState({});
  useEffect(() => {
    let alive = true; setF({});
    const set = k => v => alive && setF(x => ({ ...x, [k]: v }));
    const none = k => () => alive && setF(x => ({ ...x, [k]: null }));
    api.quote(sym,keyFH).then(set("quote")).catch(none("quote"));
    api.profile(sym,keyFH).then(set("profile")).catch(none("profile"));
    api.metric(sym,keyFH).then(set("metric")).catch(none("metric"));
    api.rec(sym,keyFH).then(set("rec")).catch(none("rec"));
    repoHistory(sym).then(h => set("hist")((h.d||[]).slice(-252))).catch(none("hist"));
    return () => { alive = false; };
  }, [sym, keyFH]);
  const m = f.metric, r = f.rec?.[0];
  const hist = f.hist;
  const yr = hist?.length > 20 ? (hist[hist.length-1][1]-hist[0][1])/hist[0][1]*100 : null;
  const margin = m?.netProfitMarginTTM ?? (m?._series?.annual?.netMargin?.[0]?.v != null ? m._series.annual.netMargin[0].v*100 : null);
  const tot = r ? r.buy+r.strongBuy+r.hold+r.sell+r.strongSell : 0;
  return {
    ...f, yr, margin,
    pe: m?.peTTM ?? m?.peBasicExclExtraTTM ?? null,
    buyPct: tot ? (r.buy+r.strongBuy)/tot*100 : null,
    cap: f.profile?.marketCapitalization ?? null,
  };
}

const CA = "#2563eb", CB = "#db2777";
function ComparePage({ keyFH, onSelect, onSettings, go }){
  const [pair, setPair] = useSaved("cmp", ["AAPL","MSFT"]);
  const [a, b] = pair;
  const A = useStockFacts(a, keyFH), B = useStockFacts(b, keyFH);
  const nA = nameOf(a, A.profile), nB = nameOf(b, B.profile);

  const rows = [
    { l:"מחיר", fa:usd(A.quote?.c), fb:usd(B.quote?.c) },
    { l:"היום", va:A.quote?.dp, vb:B.quote?.dp, f:v=>`${v>=0?"▲":"▼"} ${Math.abs(v).toFixed(2)}%`, better:"high", color:true },
    { l:"בשנה האחרונה", va:A.yr, vb:B.yr, f:v=>`${v>=0?"▲":"▼"} ${Math.abs(v).toFixed(0)}%`, better:"high", color:true },
    { l:"שווי החברה", fa:cap(A.cap), fb:cap(B.cap), va:A.cap, vb:B.cap, better:"high", note:"גדולה יותר" },
    { l:"רווח מכל $100", va:A.margin, vb:B.margin, f:v=>`$${v.toFixed(0)}`, better:"high" },
    { l:"מכפיל רווח", va:A.pe, vb:B.pe, f:v=>v>0?v.toFixed(1):"—", better:"low", hint:"נמוך = זולה יותר" },
    { l:"ממליצים לקנות", va:A.buyPct, vb:B.buyPct, f:v=>`${v.toFixed(0)}%`, better:"high" },
  ];
  const win = (r) => {
    if (r.va==null || r.vb==null || r.va===r.vb) return null;
    if (r.better==="low") { if (!(r.va>0) || !(r.vb>0)) return null; return r.va < r.vb ? "a" : "b"; }
    return r.va > r.vb ? "a" : "b";
  };

  const verdict = [];
  if (A.yr!=null && B.yr!=null) { const w = A.yr>B.yr; verdict.push(`📈 ${w?nA:nB} עלתה יותר בשנה האחרונה (${Math.abs((w?A.yr:B.yr)).toFixed(0)}% לעומת ${Math.abs((w?B.yr:A.yr)).toFixed(0)}%${(w?B.yr:A.yr)<0?" ירידה":""}).`); }
  if (A.margin!=null && B.margin!=null) { const w = A.margin>B.margin; verdict.push(`💰 ${w?nA:nB} רווחית יותר: נשארים לה $${(w?A.margin:B.margin).toFixed(0)} מכל $100, לעומת $${(w?B.margin:A.margin).toFixed(0)}.`); }
  if (A.pe>0 && B.pe>0) { const w = A.pe<B.pe; verdict.push(`🏷️ ${w?nA:nB} זולה יותר ביחס לרווחים שלה.`); }
  if (A.buyPct!=null && B.buyPct!=null && Math.abs(A.buyPct-B.buyPct)>=5) { const w = A.buyPct>B.buyPct; verdict.push(`👍 האנליסטים אוהבים יותר את ${w?nA:nB} (${(w?A.buyPct:B.buyPct).toFixed(0)}% ממליצים לקנות).`); }

  // both lines start at 0% a year ago, so they're comparable
  let chart = null;
  if (A.hist?.length > 20 && B.hist?.length > 20) {
    const mb = new Map(B.hist.map(([d,p]) => [d,p]));
    const a0 = A.hist[0][1], b0 = B.hist.find(([d]) => mb.has(d))?.[1] ?? B.hist[0][1];
    chart = A.hist.filter(([d]) => mb.has(d)).filter((_,i,arr) => i%3===0 || i===arr.length-1)
      .map(([d,p]) => ({ label:fmtDay(d), a:+((p/a0-1)*100).toFixed(1), b:+((mb.get(d)/b0-1)*100).toFixed(1) }));
  }

  return (
    <div style={{minHeight:"100vh",paddingBottom:90}}>
      <div style={{background:"var(--card)",padding:"14px 20px",borderBottom:"1px solid var(--line)",position:"sticky",top:0,zIndex:50,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:16,fontWeight:800,color:"var(--fg)"}}>⚖️ השוואה</div>
          <div style={{fontSize:11,color:"#9ca3af"}}>שתי מניות, אחת ליד השנייה</div>
        </div>
        <CurrencyChip/>
      </div>
      <div style={{padding:"18px 16px",maxWidth:640,margin:"0 auto",display:"flex",flexDirection:"column",gap:16}}>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <SymbolPicker value={a} color={CA} keyFH={keyFH} onPick={s => setPair([s, b===s ? a : b])}/>
          <button className="btn2" aria-label="החלף צדדים" onClick={()=>setPair([b,a])} style={{padding:"8px",flexShrink:0}}>⇄</button>
          <SymbolPicker value={b} color={CB} keyFH={keyFH} onPick={s => setPair([a===s ? b : a, s])}/>
        </div>

        {verdict.length>0 && (
          <div className="fu" style={{background:"var(--ink)",borderRadius:20,padding:"18px"}}>
            <div style={{fontWeight:800,fontSize:15,color:"#fff",marginBottom:10}}>🤖 בקצרה</div>
            {verdict.map((v,i) => <p key={i} style={{fontSize:14,color:"#d1d5db",lineHeight:1.55,marginTop:i?8:0}}>{v}</p>)}
          </div>
        )}

        {chart && (
          <div className="card fu" style={{padding:"16px 12px 12px"}}>
            <div className="hd" style={{padding:"0 4px"}}>📈 מי עלתה יותר בשנה האחרונה?</div>
            <p className="ex" style={{padding:"0 4px"}}>שני הקווים מתחילים מ-0% לפני שנה, כדי שיהיה אפשר להשוות.</p>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chart} margin={{top:6,right:6,bottom:0,left:6}}>
                <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} interval="preserveStartEnd" minTickGap={40}/>
                <YAxis hide/>
                <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="3 3"/>
                <Tooltip content={<ChartTip fmt={v=>`${v>0?"+":""}${v}%`}/>}/>
                <Line type="monotone" dataKey="a" name={nA} stroke={CA} strokeWidth={2.3} dot={false} isAnimationActive={false}/>
                <Line type="monotone" dataKey="b" name={nB} stroke={CB} strokeWidth={2.3} dot={false} isAnimationActive={false}/>
              </LineChart>
            </ResponsiveContainer>
            <Legend2 items={[[CA,nA],[CB,nB]]}/>
          </div>
        )}

        <div className="card fu" style={{padding:"6px 16px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,padding:"10px 0",borderBottom:"1px solid var(--soft)"}}>
            <span/><span style={{fontWeight:800,fontSize:13,color:CA,textAlign:"center"}}>{nA}</span><span style={{fontWeight:800,fontSize:13,color:CB,textAlign:"center"}}>{nB}</span>
          </div>
          {rows.map((r,i) => {
            const w = win(r);
            const show = (v, f) => v!=null ? (r.f ? r.f(v) : v) : null;
            const ta = r.fa ?? show(r.va), tb = r.fb ?? show(r.vb);
            const cell = (txt, v, mine) => (
              <span style={{textAlign:"center",fontWeight:800,fontSize:14,padding:"4px 0",borderRadius:10,
                background:w===mine?"var(--gbg)":"transparent",
                color:r.color&&v!=null ? (v>=0?"#16a34a":"#dc2626") : "var(--fg)"}}>
                {txt==null||txt==="—" ? (A.quote===undefined ? "…" : "—") : txt}{w===mine && " ✓"}
              </span>);
            return (
              <div key={r.l} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,alignItems:"center",padding:"10px 0",borderTop:i?"1px solid var(--soft)":"none"}}>
                <span style={{fontSize:13,color:"var(--muted)",fontWeight:600}}>{r.l}{r.hint && <div style={{fontSize:10,color:"#9ca3af"}}>{r.hint}</div>}</span>
                {cell(ta, r.va, "a")}{cell(tb, r.vb, "b")}
              </div>
            );
          })}
        </div>
        <p className="ex" style={{textAlign:"center"}}>✓ מסמן את המניה שטובה יותר בכל שורה. זה לא אומר שכדאי לקנות אותה.</p>
        <div style={{display:"flex",gap:10}}>
          <button className="btn2" style={{flex:1,padding:12}} onClick={()=>onSelect(a)}>לדף של {nA}</button>
          <button className="btn2" style={{flex:1,padding:12}} onClick={()=>onSelect(b)}>לדף של {nB}</button>
        </div>
      </div>
      <BottomNav view="compare" go={go} onSettings={onSettings}/>
    </div>
  );
}

/* ══════════════════════════════════════
   TELEGRAM PRICE ALERT (works once the bot is set up)
══════════════════════════════════════ */
let botInfo;
const loadBot = () => botInfo || (botInfo = fetch(`data/bot.json?v=${Math.floor(Date.now()/6e5)}`).then(r => r.ok ? r.json() : null).catch(() => null));
function AlertBox({ sym, price }){
  const [bot, setBot] = useState(undefined);
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState("");
  useEffect(() => { loadBot().then(setBot); }, []);
  if (bot === undefined) return null;
  if (!bot?.username) return (
    <p className="ex" style={{marginTop:10,marginBottom:0,textAlign:"center"}}>🔔 התראות מחיר לטלגרם יופעלו אחרי שתחבר את הבוט.</p>
  );
  const t = parseFloat(target);
  const valid = t > 0;
  const link = valid ? `https://t.me/${bot.username}?start=${sym.replace(/\./g,"-")}_${String(Math.round(t*100)/100).replace(".","p")}` : null;
  const dir = valid && price ? (t > price ? "תעלה" : "תרד") : null;
  return !open ? (
    <button className="btn2" style={{width:"100%",marginTop:8,padding:11}} onClick={()=>{ setOpen(true); if (price) setTarget(String(Math.round(price*1.05))); }}>🔔 התראת מחיר בטלגרם</button>
  ) : (
    <div style={{marginTop:10,background:"var(--soft2)",borderRadius:14,padding:14}}>
      <label htmlFor="alert-price" style={{fontSize:13,fontWeight:800,color:"var(--fg)"}}>תודיע לי כשהמחיר מגיע ל- ($)</label>
      <input id="alert-price" type="number" inputMode="decimal" step="any" min="0" value={target} onChange={e=>setTarget(e.target.value)}
        style={{width:"100%",marginTop:8,background:"var(--card)",border:"1.5px solid var(--line)",borderRadius:12,padding:"12px",fontSize:16,color:"var(--fg)",fontFamily:"'Heebo',sans-serif"}}/>
      {dir && <p className="ex" style={{marginTop:6,marginBottom:0}}>תקבל הודעה כשהמניה {dir} ל-${t.toFixed(2)} (עכשיו {usdRaw(price)}).</p>}
      <div style={{display:"flex",gap:8,marginTop:10}}>
        <a className="btn" href={link||undefined} target="_blank" rel="noopener noreferrer"
          style={{flex:2,textAlign:"center",textDecoration:"none",opacity:valid?1:.4,pointerEvents:valid?"auto":"none"}}>פתח בטלגרם ושלח</a>
        <button className="btn2" style={{flex:1}} onClick={()=>setOpen(false)}>ביטול</button>
      </div>
      <p className="ex" style={{marginTop:8,marginBottom:0}}>בטלגרם לחץ "התחל" (Start). אישור יגיע תוך כ-10 דקות.</p>
    </div>
  );
}

/* ══════════════════════════════════════
   APP
══════════════════════════════════════ */
function ThemePicker(){
  const [theme, setTheme] = useState(() => store.get("theme") || "auto");
  const pick = t => {
    setTheme(t); store.set("theme", t==="auto" ? null : t);
    if (t==="auto") document.documentElement.removeAttribute("data-theme"); else document.documentElement.setAttribute("data-theme", t);
  };
  return (
    <div>
      <div style={{fontWeight:800,fontSize:14,marginBottom:8}}>מראה</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
        {[["auto","📱 לפי הטלפון"],["light","☀️ בהיר"],["dark","🌙 כהה"]].map(([k,l]) => (
          <button key={k} className="btn2" onClick={()=>pick(k)}
            style={{padding:"11px 6px",background:theme===k?"#22c55e":"var(--soft)",color:theme===k?"#fff":"var(--fg2)"}}>{l}</button>
        ))}
      </div>
    </div>
  );
}

function App(){
  const [keys, setKeys] = useState(() => ({ fh: store.get("fhKey") || "", td: store.get("tdKey") || "" }));
  const [sym, setSym] = useState(null);
  const [view, setView] = useState("home");
  const [cur] = useSaved("cur","USD");
  const [fx, setFx] = useState(null);
  useEffect(() => { if (cur==="ILS" && !fx) loadFx().then(setFx); }, [cur]);
  CUR.code = cur==="ILS" && fx ? "ILS" : "USD"; CUR.rate = CUR.code==="ILS" ? fx : 1;
  const [settings, setSettings] = useState(false);
  const go = (v) => { setView(v); setSym(null); window.scrollTo(0,0); };
  const open = (s) => { setSym(s); window.scrollTo(0,0); };
  const [booting, setBooting] = useState(() => !store.get("fhKey"));

  const save = (k) => {
    store.set("fhKey", k.fh); store.set("tdKey", k.td || null);
    Object.keys(mem).forEach(id => delete mem[id]);
    setKeys(k); setSettings(false);
  };

  // First run: connect automatically with the built-in key
  useEffect(() => {
    if (!booting) return;
    findWorkingKey(candidates(DEFAULT_FH)).then(k => {
      if (k) save({ fh:k, td:keys.td });
      setBooting(false);
    });
  }, []);

  if (booting) return (
    <><G/><div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12}}>
      <span className="spin" style={{fontSize:28,color:"#22c55e"}}>↻</span>
      <span style={{fontSize:14,fontWeight:700,color:"var(--muted)"}}>מתחבר לנתוני הבורסה...</span>
    </div></>
  );

  if (!keys.fh) return <><G/><SetupScreen keys={keys} onSave={save}/></>;

  return (
    <>
      <G/>
      {sym
        ? <StockPage key={sym} sym={sym} keys={keys} view={view} go={go} onBack={()=>setSym(null)} onSettings={()=>setSettings(true)}/>
        : view==="portfolio"
          ? <PortfolioPage keyFH={keys.fh} onSelect={open} go={go} onSettings={()=>setSettings(true)}/>
        : view==="compare"
          ? <ComparePage keyFH={keys.fh} onSelect={open} go={go} onSettings={()=>setSettings(true)}/>
          : <HomePage keyFH={keys.fh} onSelect={open} go={go} onSettings={()=>setSettings(true)}/>}
      {settings && (
        <div className="sheet" onClick={()=>setSettings(false)}>
          <div onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:18,fontWeight:900,marginBottom:16}}>⚙️ הגדרות</div>
            <ThemePicker/>
            <div style={{height:1,background:"var(--line)",margin:"18px 0"}}/>
            <KeyForm keys={keys} onSave={save} compact/>
          </div>
        </div>
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
