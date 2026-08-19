# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Financify is a personal finance tracker: a Django REST API backend (`finance_tracker/`) and a Create React App frontend (`frontend/`), deployed together to Vercel as a single project (`vercel.json` routes `/api/*` and `/admin/*` to the Django WSGI app, everything else to the React build).

## Commands

### Backend (Django, run from `finance_tracker/`)
```
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
python manage.py test                     # run all tests
python manage.py test tracker.tests.<TestClass>.<test_method>   # single test
```
Backend expects a `.env` file in `finance_tracker/` (loaded via `python-dotenv`) with at least `SECRET_KEY`, `DEBUG`, `DATABASE_URL` (or `POSTGRES_URL`), and `OPENAI_API_KEY` for AI insights.

### Frontend (CRA, run from `frontend/`)
```
npm install
npm start        # dev server on :3000
npm test         # jest/react-testing-library, interactive watch mode
npm run build    # production build (CI=false so warnings don't fail the build)
```
Frontend expects `REACT_APP_API_URL` in `.env.development` pointing at the Django API when developing against a non-relative backend.

## Architecture

**Backend** — single Django app `tracker` inside project `finance_tracker`:
- `models.py` — one model, `Transaction` (user FK, title, amount, category enum, `type` = "income"/"expense", date).
- `views.py` — DRF `generics`/`APIView` classes: `TransactionListCreateView` / `TransactionDetailView` (CRUD, scoped to `request.user`), `DashboardSummaryView` (aggregates income/expenses/balance), `register`/`activate` (custom JWT-adjacent signup flow with email activation via Django's token generator, not part of DRF's auth), `AIInsightsView` (sends transaction summary to OpenAI `gpt-3.5-turbo` and returns a short advice paragraph).
- Auth is JWT via `djangorestframework-simplejwt` (`/api/token/`, `/api/token/refresh/`), plus a custom `register`/`activate` pair for email-verified signup (accounts are created `is_active=False` until the emailed link is visited).
- Rate limiting: custom throttle classes cap auth endpoints (`10/min`/IP) and AI insights (`5/min`/user) to control cost/abuse.
- DB: Postgres via `dj-database-url`, resolved from `DATABASE_URL`, falling back to Vercel Postgres/Neon's `POSTGRES_URL` if `DATABASE_URL` isn't set.
- CORS is currently wide open (`CORS_ALLOW_ALL_ORIGINS = True`) — tighten before treating this as production-hardened.

**Frontend** — CRA + Tailwind, routed with `react-router-dom` (`/`, `/login`, `/register`, `/dashboard`, see `App.js`):
- `utils/axiosInstance.js` is the single Axios client all API calls should go through — it attaches the JWT access token from `localStorage` on every request and transparently refreshes it on a 401 (via `/api/token/refresh/`), redirecting to `/` if the refresh token is also invalid. Don't call `axios` directly for authenticated endpoints; use this instance.
- `pages/Dashboard.js` composes the authenticated app: `DashboardCards`, `TransactionForm`, `TransactionTable`, `Analytics` (Chart.js via `react-chartjs-2`), `AIInsights`.
- Auth UI (`Login`, `Register`, `AuthModal`) stores `access`/`refresh` tokens in `localStorage` under those exact keys — keep this consistent with `axiosInstance.js`.
- Styling is Tailwind; icons via `lucide-react`; animations via `framer-motion`.

## Notes
- There's a stray top-level `Finance-Tracker/` directory alongside `finance_tracker/` — check before assuming which one is live; `finance_tracker/` is the one wired into `vercel.json` and `manage.py`.
- Root `package.json`/`requirements.txt` are thin/duplicated stubs; the real dependency manifests are `frontend/package.json` and `finance_tracker/requirements.txt`.
