# tap-to-earn

Mono-repo: FastAPI (`tap-api`) + Next.js (`tap-web`).

## Dev

### API

```bash
cd tap-api
python -m venv .venv && .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
pytest -q
```

### WEB

```bash
cd tap-web
npm i
npm run dev
npm test
```
