"""Telegram price alerts.

Runs every few minutes on GitHub Actions:
  1. reads new messages sent to the bot (commands, or links tapped on the site)
  2. checks live prices and sends a Telegram message when a target is hit

Needs the repository secret TELEGRAM_TOKEN (from @BotFather). Without it, it does nothing.
State lives in alerts/state.json (owner chat id, alerts, last processed update).
"""
import json, os, re, sys, urllib.error, urllib.parse, urllib.request

ROOT = os.path.join(os.path.dirname(__file__), "..")
STATE = os.path.join(ROOT, "alerts", "state.json")
BOT_INFO = os.path.join(ROOT, "data", "bot.json")
TOKEN = os.environ.get("TELEGRAM_TOKEN", "").strip()
# Same free Finnhub key the site uses (stored reversed there too).
FH = "golsome8mq10rppdo4bd0olsome8mq10rppdo4bd"[::-1]
FH_KEYS = [FH[:20], FH[20:]]

HE = {"AAPL": "אפל", "NVDA": "אנבידיה", "TSLA": "טסלה", "MSFT": "מיקרוסופט", "GOOGL": "גוגל",
      "AMZN": "אמזון", "META": "מטא", "NFLX": "נטפליקס", "TEVA": "טבע", "CHKP": "צ'ק פוינט"}
name = lambda s: f"{HE[s]} ({s})" if s in HE else s

HELP = (
    "🔔 <b>בוט התראות מחיר</b>\n\n"
    "הכי פשוט: באתר, בדף של מניה, לחץ על 🔔 והקלד מחיר.\n\n"
    "או כתוב לי כאן:\n"
    "<code>/alert AAPL 250</code> — תודיע כשאפל מגיעה ל-250$\n"
    "<code>/list</code> — ההתראות שלי\n"
    "<code>/del 1</code> — מחק התראה מספר 1\n\n"
    "כל התראה נשלחת פעם אחת ואז נמחקת."
)


def tg(method, **params):
    url = f"https://api.telegram.org/bot{TOKEN}/{method}"
    data = urllib.parse.urlencode(params).encode()
    with urllib.request.urlopen(urllib.request.Request(url, data=data), timeout=30) as r:
        return json.load(r)


def send(chat, text):
    try:
        tg("sendMessage", chat_id=chat, text=text, parse_mode="HTML", disable_web_page_preview="true")
    except Exception as e:
        print("send failed:", e)


def quote(sym):
    for k in FH_KEYS:
        try:
            with urllib.request.urlopen(f"https://finnhub.io/api/v1/quote?symbol={urllib.parse.quote(sym)}&token={k}", timeout=20) as r:
                q = json.load(r)
            if q.get("c"):
                return q["c"]
        except Exception:
            continue
    return None


def load():
    try:
        with open(STATE) as f:
            return json.load(f)
    except Exception:
        return {"owner": None, "offset": 0, "alerts": []}


def add_alert(st, chat, sym, target):
    sym = sym.upper().strip()
    if not re.fullmatch(r"[A-Z][A-Z0-9.\-]{0,9}", sym) or not (target > 0):
        send(chat, "לא הבנתי 🤔 נסה למשל: <code>/alert AAPL 250</code>")
        return
    price = quote(sym)
    if price is None:
        send(chat, f"לא מצאתי מחיר למניה {sym}. בדוק את הסימול.")
        return
    if len([a for a in st["alerts"]]) >= 30:
        send(chat, "יש כבר 30 התראות. מחק כמה עם /del")
        return
    direction = "above" if target > price else "below"
    st["alerts"].append({"sym": sym, "target": round(target, 2), "dir": direction, "set_at": round(price, 2)})
    word = "תעלה ל" if direction == "above" else "תרד ל"
    send(chat, f"✅ סגור! אודיע לך כש<b>{name(sym)}</b> {word}-<b>${target:,.2f}</b>\n(עכשיו: ${price:,.2f})")


def handle(st, msg):
    chat = msg["chat"]["id"]
    text = (msg.get("text") or "").strip()
    if st["owner"] is None and text.startswith("/start"):
        st["owner"] = chat
    if chat != st["owner"]:
        send(chat, "הבוט הזה פרטי 🙂")
        return
    m = re.match(r"^/start\s+([A-Za-z0-9.\-]+)_(\d+(?:p\d+)?)$", text)
    if m:
        add_alert(st, chat, m.group(1).replace("-", "."), float(m.group(2).replace("p", ".")))
    elif text.startswith("/start") or text.startswith("/help"):
        send(chat, HELP)
    elif text.startswith("/alert"):
        parts = text.split()
        try:
            add_alert(st, chat, parts[1], float(parts[2].replace("$", "").replace(",", "")))
        except Exception:
            send(chat, "כתוב כך: <code>/alert AAPL 250</code>")
    elif text.startswith("/list"):
        if not st["alerts"]:
            send(chat, "אין התראות פעילות. הוסף אחת באתר או עם /alert")
        else:
            lines = [f"{i+1}. {name(a['sym'])} {'⬆️' if a['dir']=='above' else '⬇️'} ${a['target']:,.2f}" for i, a in enumerate(st["alerts"])]
            send(chat, "🔔 <b>ההתראות שלך</b>\n" + "\n".join(lines))
    elif text.startswith("/del"):
        try:
            a = st["alerts"].pop(int(text.split()[1]) - 1)
            send(chat, f"🗑️ מחקתי: {name(a['sym'])} ${a['target']:,.2f}")
        except Exception:
            send(chat, "כתוב את מספר ההתראה, למשל <code>/del 1</code> (רשימה: /list)")
    else:
        send(chat, HELP)


def main():
    if not TOKEN:
        print("TELEGRAM_TOKEN not set — skipping")
        return
    before = json.dumps(load(), sort_keys=True)
    st = load()

    me = tg("getMe")["result"]
    os.makedirs(os.path.dirname(BOT_INFO), exist_ok=True)
    info = {"username": me["username"]}
    try:
        old = json.load(open(BOT_INFO))
    except Exception:
        old = None
    if old != info:
        json.dump(info, open(BOT_INFO, "w"))

    upd = tg("getUpdates", offset=st["offset"] + 1 if st["offset"] else 0, timeout=0).get("result", [])
    for u in upd:
        st["offset"] = u["update_id"]
        if "message" in u:
            handle(st, u["message"])

    if st["owner"] and st["alerts"]:
        prices = {s: quote(s) for s in {a["sym"] for a in st["alerts"]}}
        keep = []
        for a in st["alerts"]:
            p = prices.get(a["sym"])
            hit = p is not None and ((a["dir"] == "above" and p >= a["target"]) or (a["dir"] == "below" and p <= a["target"]))
            if hit:
                arrow = "📈 עלתה" if a["dir"] == "above" else "📉 ירדה"
                send(st["owner"], f"🔔 <b>{name(a['sym'])}</b> {arrow} ל-<b>${p:,.2f}</b>\n(היעד שלך: ${a['target']:,.2f})")
            else:
                keep.append(a)
        st["alerts"] = keep

    if json.dumps(st, sort_keys=True) != before:
        os.makedirs(os.path.dirname(STATE), exist_ok=True)
        json.dump(st, open(STATE, "w"), ensure_ascii=False, indent=1)
    print(f"updates={len(upd)} alerts={len(st['alerts'])} owner={'yes' if st['owner'] else 'no'}")


if __name__ == "__main__":
    try:
        main()
    except urllib.error.HTTPError as e:
        print("telegram error:", e.code, e.read()[:200])
        sys.exit(1)
