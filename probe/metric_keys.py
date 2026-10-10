# One-off: check the Finnhub key and record which fundamentals the free plan returns.
import json, urllib.request, urllib.error
FH = "golsome8mq10rppdo4bd0olsome8mq10rppdo4bd"[::-1]
out = {}
for label, key in (("first20", FH[:20]), ("last20", FH[20:]), ("full40", FH)):
    for ep in ("quote?symbol=AAPL", "stock/metric?symbol=AAPL&metric=all"):
        try:
            with urllib.request.urlopen(f"https://finnhub.io/api/v1/{ep}&token={key}", timeout=30) as r:
                j = json.load(r)
            out[f"{label} {ep[:5]}"] = "OK"
            if ep.startswith("stock") and "metric" not in out:
                out["metric"] = j.get("metric", {})
                out["series_annual_keys"] = sorted((j.get("series") or {}).get("annual", {}).keys())
        except urllib.error.HTTPError as e:
            out[f"{label} {ep[:5]}"] = f"HTTP {e.code} {e.read()[:120]!r}"
        except Exception as e:
            out[f"{label} {ep[:5]}"] = str(e)
json.dump(out, open("probe/metric_keys.json", "w"), indent=0, sort_keys=True)
