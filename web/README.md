# Split the Bill — live demo

Unified Next.js rework of the HackUPC 2025 project. Scan a receipt, assign items
to friends manually or by voice, and see who owes what.

Originally a Vite frontend + FastAPI/Postgres/Whisper/Tesseract backend; now a
single Next.js app deployable on Vercel:

- `POST /api/image` — receipt photo → items + prices, via a TensorX vision model
  (replaces Tesseract OCR + Gemini).
- `POST /api/voice` — audio → transcript (TensorX Whisper) → item/person
  assignments (replaces local Whisper + Gemini).
- `GET /api/friends` — static demo friends list (replaces the Postgres seed DB).
  The demo acts as user "Marco".

## Run locally

```bash
cd web
cp .env.example .env.local   # add your TensorX API key
npm install
npm run dev
```

## Deploy

Deployed on Vercel with root directory `web` and the `TENSORX_API_KEY`
environment variable set.
