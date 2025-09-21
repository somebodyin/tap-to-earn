from fastapi import FastAPI, Depends, HTTPException, Response, Cookie
from pydantic import BaseModel
from typing import Dict
import uuid
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Tap2Earn API")

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- In-memory "DB"
class User(BaseModel):
    id: str
    username: str
    energy: int = 100
    multiplier: int = 1  # 1 or 16
    earned: int = 0

SESSIONS: Dict[str, str] = {}          # token -> user_id
USERS: Dict[str, User] = {}            # id -> User

# ---- Schemas
class LoginIn(BaseModel):
    username: str

class MeOut(BaseModel):
    id: str
    username: str
    energy: int
    multiplier: int
    earned: int

def current_user(session: str | None = Cookie(default=None)) -> User:
    if not session or session not in SESSIONS:
        raise HTTPException(status_code=401, detail="unauthorized")
    uid = SESSIONS[session]
    return USERS[uid]

# ---- Endpoints
@app.get("/health")
def health(): return {"ok": True}

@app.post("/session/login", response_model=MeOut)
def login(body: LoginIn, response: Response):
    # create or get user
    existing = next((u for u in USERS.values() if u.username == body.username), None)
    user = existing or User(id=str(uuid.uuid4()), username=body.username)
    USERS[user.id] = user
    token = str(uuid.uuid4())
    SESSIONS[token] = user.id
    # httpOnly cookie for simplicity (same-origin dev)
    response.set_cookie("session", token, httponly=True)
    return MeOut(**user.model_dump())

@app.get("/me", response_model=MeOut)
def me(u: User = Depends(current_user)): return MeOut(**u.model_dump())

@app.post("/mine", response_model=MeOut)
def mine(u: User = Depends(current_user)):
    if u.energy <= 0:
        raise HTTPException(400, "no energy")
    u.energy -= 1
    u.earned += u.multiplier
    USERS[u.id] = u
    return MeOut(**u.model_dump())

@app.post("/boost/toggle", response_model=MeOut)
def boost_toggle(u: User = Depends(current_user)):
    u.multiplier = 1 if u.multiplier == 16 else 16
    USERS[u.id] = u
    return MeOut(**u.model_dump())

@app.get("/leaderboard")
def leaderboard():
    top = sorted(USERS.values(), key=lambda x: x.earned, reverse=True)[:20]
    return [MeOut(**u.model_dump()) for u in top]
