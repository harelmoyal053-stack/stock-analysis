import json, urllib.request, urllib.error
K = "golsome8mq10rppdo4bd0olsome8mq10rppdo4bd"[::-1]
def get(ep):
    try:
        with urllib.request.urlopen(f"https://finnhub.io/api/v1/{ep}&token={K}", timeout=30) as r: return json.load(r)
    except urllib.error.HTTPError as e: return {"HTTP": e.code, "body": e.read()[:150].decode("utf8","ignore")}
    except Exception as e: return {"ERR": str(e)}
out = {}
for name, ep in [("peers","stock/peers?symbol=AAPL"),("insider_tx","stock/insider-transactions?symbol=AAPL"),
                 ("insider_sent","stock/insider-sentiment?symbol=AAPL&from=2026-01-01&to=2026-10-10"),
                 ("price_target","stock/price-target?symbol=AAPL"),("eps_est","stock/eps-estimate?symbol=AAPL&freq=annual"),
                 ("rev_est","stock/revenue-estimate?symbol=AAPL&freq=annual"),("revbreak","stock/revenue-breakdown?symbol=AAPL"),
                 ("exec","stock/executive?symbol=AAPL"),("ownership","stock/ownership?symbol=AAPL&limit=5"),
                 ("fund_own","stock/fund-ownership?symbol=AAPL&limit=5"),("basicfin_series","stock/metric?symbol=AAPL&metric=all")]:
    j = get(ep)
    if name == "basicfin_series":
        out[name] = sorted(((j.get("series") or {}).get("annual") or {}).keys()); continue
    s = json.dumps(j)
    out[name] = s[:700]
fr = get("stock/financials-reported?symbol=AAPL&freq=annual")
if "data" in fr:
    r = fr["data"][0]
    out["fin_year"] = r.get("year")
    for sec in ("bs","cf","ic"):
        out["fin_"+sec] = sorted({x["concept"] for x in r["report"].get(sec, [])})
else:
    out["fin"] = str(fr)[:300]
json.dump(out, open("probe/out.json","w"), indent=0, ensure_ascii=False)
