import base64, json
from datetime import datetime, timedelta, timezone
from app.core.config import settings
import secrets, hashlib
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.models import SessionToken

COOKIE_NAME = "session"

def _hash(raw: str) -> str:
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()

def issue_session(db: Session, user_id: int, ttl_days: int = 30) -> str:
    raw = secrets.token_urlsafe(32)
    db.add(SessionToken(
        token_hash=_hash(raw),
        user_id=user_id,
        expires_at=datetime.now(timezone.utc) + timedelta(days=ttl_days),
    ))
    db.commit()
    return raw

def get_user_by_session(db: Session, raw: str):
    h = _hash(raw)
    s = (db.query(SessionToken)
           .filter(SessionToken.token_hash == h,
                   SessionToken.revoked_at.is_(None),
                   SessionToken.expires_at > datetime.now(timezone.utc))
           .first())
    return s.user if s else None

def revoke_session(db: Session, raw: str):
    h = _hash(raw)
    db.query(SessionToken)\
      .filter(SessionToken.token_hash == h)\
      .update({SessionToken.revoked_at: datetime.now(timezone.utc)})
    db.commit()