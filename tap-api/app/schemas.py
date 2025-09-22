from pydantic import BaseModel

class LoginIn(BaseModel):
    username: str

class MeOut(BaseModel):
    id: int
    username: str
    energy: int
    multiplier: int
    earned: int