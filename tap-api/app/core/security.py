import hmac, hashlib, base64, json
from datetime import datetime, timedelta, timezone
from app.core.config import settings

COOKIE_NAME = "session"

def _b64u(b: bytes) -> str:
    return base64.urlsafe_b64encode(b).rstrip(b"=").decode("ascii")

def _b64u_json(obj: dict) -> str:
    return _b64u(json.dumps(obj, separators=(",", ":"), ensure_ascii=False).encode("utf-8"))

def _sign(msg: str) -> str:
    sig = hmac.new(settings.SECRET_KEY.encode("utf-8"), msg.encode("utf-8"), hashlib.sha256).digest()
    return _b64u(sig)

def make_session_token(user_id: int, ttl_days: int = 30) -> str:
    header = {"alg": "HS256", "typ": "JWT-lite"}
    payload = {"uid": user_id, "exp": int((datetime.now(timezone.utc) + timedelta(days=ttl_days)).timestamp())}
    h = _b64u_json(header); p = _b64u_json(payload); s = _sign(f"{h}.{p}")
    return f"{h}.{p}.{s}"

def parse_session_token(token: str) -> int | None:
    try:
        h, p, s = token.split(".")
        if _sign(f"{h}.{p}") != s:
            return None
        pad = "=" * (-len(p) % 4)
        payload = json.loads(base64.urlsafe_b64decode((p + pad).encode("ascii")))
        if int(payload.get("exp", 0)) < int(datetime.now(timezone.utc).timestamp()):
            return None
        return int(payload["uid"])
    except Exception:
        return None
