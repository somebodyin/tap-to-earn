from fastapi import Depends, HTTPException, Cookie
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.core.security import get_user_by_session
from app import crud

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user_and_state(
    session: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
):
    if not session:
        raise HTTPException(status_code=401)
    user = get_user_by_session(db, session)
    if not user:
        raise HTTPException(status_code=401)
    st = crud.get_or_create_state(db, user.id)
    return user, st