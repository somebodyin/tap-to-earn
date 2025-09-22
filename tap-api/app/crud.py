from sqlalchemy.orm import Session
from sqlalchemy import select, desc
from app.models import User, MiningState

def get_user_by_username(db: Session, username: str) -> User | None:
    return db.execute(select(User).where(User.username == username)).scalar_one_or_none()

def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.execute(select(User).where(User.id == user_id)).scalar_one_or_none()

def create_user(db: Session, username: str) -> User:
    u = User(username=username)
    db.add(u); db.commit(); db.refresh(u)
    return u

def get_or_create_state(db: Session, user_id: int) -> MiningState:
    st = db.execute(select(MiningState).where(MiningState.user_id == user_id)).scalar_one_or_none()
    if not st:
        st = MiningState(user_id=user_id, energy=10, multiplier=1, earned=0)
        db.add(st); db.commit(); db.refresh(st)
    return st

def mine_once(db: Session, st: MiningState) -> MiningState:
    if st.energy <= 0:
        return st
    st.energy -= 1
    st.earned += st.multiplier
    db.add(st); db.commit(); db.refresh(st)
    return st

def toggle_boost(db: Session, st: MiningState) -> MiningState:
    st.multiplier = 1 if st.multiplier == 16 else 16
    db.add(st); db.commit(); db.refresh(st)
    return st

def top_leaderboard(db: Session, limit: int = 20) -> list[tuple[User, MiningState]]:
    return (
        db.query(User, MiningState)
        .join(MiningState, MiningState.user_id == User.id)
        .order_by(desc(MiningState.earned))
        .limit(limit)
        .all()
    )
