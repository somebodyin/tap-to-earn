from fastapi import Cookie, FastAPI, Depends, HTTPException, Response
import uuid
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import issue_session, COOKIE_NAME, revoke_session
from app.schemas import LoginIn, MeOut
from app import crud
from app.deps import get_db, get_current_user_and_state


app = FastAPI(title="Tap2Earn API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def to_meout(user, st) -> MeOut:
    return MeOut(id=user.id, username=user.username, energy=st.energy, multiplier=st.multiplier, earned=st.earned)

@app.get("/health")
def health(): return {"ok": True}

@app.post("/session/login", response_model=MeOut)
def login(body: LoginIn, response: Response, db: Session = Depends(get_db)):
    username = body.username.strip()
    if not username:
        raise HTTPException(status_code=422, detail="username required")
    user = crud.get_user_by_username(db, username) or crud.create_user(db, username)
    st = crud.get_or_create_state(db, user.id)

    raw = issue_session(db, user.id, ttl_days=30)

    IS_PROD = settings.ENV == "production"
    COOKIE_SAMESITE = "none" if IS_PROD else "lax"
    COOKIE_SECURE   = True if IS_PROD else False
    
    response.set_cookie(
        COOKIE_NAME, raw,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        max_age=60*60*24*30,
        path="/",
    )
    return to_meout(user, st)

@app.post("/session/logout")
def logout(response: Response, session: str | None = Cookie(default=None), db: Session = Depends(get_db)):
    if session:
        revoke_session(db, session)

    response.delete_cookie(COOKIE_NAME, path="/")
    return {"ok": True}

@app.get("/me", response_model=MeOut)
def me(current=Depends(get_current_user_and_state)):
    user, st = current
    return to_meout(user, st)

@app.post("/mine", response_model=MeOut)
def mine(current=Depends(get_current_user_and_state), db: Session = Depends(get_db)):
    user, st = current
    if st.energy <= 0:
        raise HTTPException(status_code=409, detail={"code": "NO_ENERGY"})
    st = crud.mine_once(db, st)
    return to_meout(user, st)

@app.post("/boost/toggle", response_model=MeOut)
def boost_toggle(current=Depends(get_current_user_and_state), db: Session = Depends(get_db)):
    user, st = current
    st = crud.toggle_boost(db, st)
    return to_meout(user, st)

@app.get("/leaderboard", response_model=list[MeOut])
def leaderboard(db: Session = Depends(get_db)):
    rows = crud.top_leaderboard(db, limit=20)
    return [to_meout(u, s) for (u, s) in rows]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.PORT)