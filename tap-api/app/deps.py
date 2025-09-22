from fastapi import Depends, HTTPException, Cookie
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.core.security import parse_session_token, COOKIE_NAME
from app import crud

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user_and_state(
    db: Session = Depends(get_db),
    session_token: str | None = Cookie(default=None, alias=COOKIE_NAME),
):
    if not session_token:
        raise HTTPException(status_code=401, detail="unauthorized")
    uid = parse_session_token(session_token)
    if not uid:
        raise HTTPException(status_code=401, detail="unauthorized")
    user = crud.get_user_by_id(db, uid)
    if not user:
        raise HTTPException(status_code=401, detail="unauthorized")
    st = crud.get_or_create_state(db, user.id)
    return user, st