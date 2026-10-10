"""Fetch price history for the site's stock list and save it as small JSON files.

Runs on GitHub Actions (server side, so no browser CORS limits and no API key).
Output: data/<SYMBOL>.json  ->  {"updated": ts, "d": [[date, close], ...], "i": [[unix, close], ...]}
  d = daily closes, last 5 years
  i = 15-minute closes, last 5 trading days
"""
import json, os, sys, time, urllib.request, urllib.error

SYMBOLS = [
    "AAPL", "NVDA", "TSLA", "MSFT", "GOOGL", "AMZN", "META", "NFLX", "AMD", "INTC",
    "AVGO", "ORCL", "CRM", "ADBE", "PYPL", "UBER", "SHOP", "PLTR", "COIN", "DIS",
    "NKE", "KO", "PEP", "MCD", "WMT", "COST", "JPM", "V", "MA", "BAC",
    "XOM", "JNJ", "PFE", "LLY", "UNH", "BA", "T", "TEVA", "CHKP", "WIX",
    "MBLY", "CYBR", "SPY", "QQQ",
]
UA = {"User-Agent": "Mozilla/5.0 (compatible; stock-analysis-site/1.0)"}
OUT = os.path.join(os.path.dirname(__file__), "..", "data")


def get_json(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def yahoo(sym, rng, interval):
    for host in ("query1", "query2"):
        try:
            j = get_json(f"https://{host}.finance.yahoo.com/v8/finance/chart/{sym}?range={rng}&interval={interval}")
            res = j["chart"]["result"][0]
            ts = res.get("timestamp") or []
            closes = res["indicators"]["quote"][0].get("close") or []
            return [(t, round(c, 2)) for t, c in zip(ts, closes) if c is not None]
        except Exception as e:  # try the other host
            err = e
    raise err


def main():
    os.makedirs(OUT, exist_ok=True)
    ok, failed = 0, []
    for sym in SYMBOLS:
        try:
            daily = yahoo(sym, "5y", "1d")
            intra = yahoo(sym, "5d", "15m")
            data = {
                "updated": int(time.time()),
                "d": [[time.strftime("%Y-%m-%d", time.gmtime(t)), c] for t, c in daily],
                "i": [[t, c] for t, c in intra],
            }
            if len(data["d"]) < 20:
                raise ValueError("too few points")
            with open(os.path.join(OUT, f"{sym}.json"), "w") as f:
                json.dump(data, f, separators=(",", ":"))
            ok += 1
        except Exception as e:
            failed.append(f"{sym}: {e}")
        time.sleep(0.4)
    print(f"saved {ok}/{len(SYMBOLS)}")
    for line in failed:
        print("FAILED", line)
    if ok == 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
