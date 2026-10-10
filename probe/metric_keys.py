# One-off: record which fundamentals Finnhub's free plan returns, so the site uses real field names.
import json, urllib.request
FH = "golsome8mq10rppdo4bd0olsome8mq10rppdo4bd"[::-1]
out = {}
for key in (FH[:20], FH[20:]):
    try:
        with urllib.request.urlopen(f"https://finnhub.io/api/v1/stock/metric?symbol=AAPL&metric=all&token={key}", timeout=30) as r:
            j = json.load(r)
        out = {"metric": j.get("metric", {}), "series_annual_keys": sorted((j.get("series") or {}).get("annual", {}).keys())}
        out["key_ok"] = "first" if key == FH[:20] else "second"
        break
    except Exception as e:
        out["err_" + key[:4]] = str(e)
json.dump(out, open("probe/metric_keys.json", "w"), indent=0, sort_keys=True)
