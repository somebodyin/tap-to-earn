from sqlalchemy import Column, Integer, String, BigInteger, ForeignKey, Numeric, DateTime, func
from sqlalchemy.orm import relationship
from app.db import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String(128), unique=True, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class MiningState(Base):
    __tablename__ = "mining_state"
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    energy = Column(Integer, nullable=False, default=10)
    multiplier = Column(Integer, nullable=False, default=1)
    earned = Column(Integer, nullable=False, default=0)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    user = relationship("User", backref="mining")

class SessionToken(Base):
    __tablename__ = "sessions"
    # зберігай не raw токен, а хеш (безпека)
    token_hash = Column(String(64), primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=False)
    revoked_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User")