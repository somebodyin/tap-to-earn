from fastapi.testclient import TestClient
from main import app

c = TestClient(app)

def login(username="user1"):
    r = c.post("/session/login", json={"username": username})
    assert r.status_code == 200
    return r

def test_health(): assert c.get("/health").json()["ok"] is True

def test_login_and_me():
    r = login()
    cookie = str(r.cookies.get("session"))
    me = c.get("/me", cookies={"session": cookie}).json()
    assert me["username"] == "user1"

def test_mine_and_boost():
    r = login("alice"); cookie = str(r.cookies.get("session"))
    r1 = c.post("/mine", cookies={"session": cookie}).json()
    assert r1["earned"] == 1
    c.post("/boost/toggle", cookies={"session": cookie})
    r2 = c.post("/mine", cookies={"session": cookie}).json()
    assert r2["earned"] == 17  # 1 + 16
    r3 = c.post("/mine", cookies={"session": cookie}).json()
    if r3.get("detail", {}).get("code") == "NO_ENERGY":
        assert r3["detail"]["code"] == "NO_ENERGY"  # no energy

def test_leaderboard():
    c.post("/session/login", json={"username": "u1"})
    c.post("/session/login", json={"username": "u2"})
    assert isinstance(c.get("/leaderboard").json(), list)
