# bigLITTLE

A meditation app with an Expo / React Native client (`bigLITTLEapp/`) and a REST API backend (`backend/`) built on Express, PostgreSQL, and TypeScript, using JWT authentication with bcrypt password hashing.

This is a personal project in progress. The API runs locally against a local Postgres database. The app signs up and logs in against the API, keeps the returned token in the device keychain so sessions survive a restart, and loads its meditation list from `GET /meditations`. The usage-event endpoints are built and tested but the client does not post to them yet.

## Troubleshooting write-ups

Issues found while building this, each written up with the symptom, a reproduction command, the root cause, the fix, and how the fix was verified.

Full write-ups: [backend/docs/troubleshooting.md](backend/docs/troubleshooting.md)

- **Bearer tokens written to logs in plain text.** `pino-http` ships no redaction defaults and its underlying `pino-std-serializers` request serializer copies every header verbatim, so `Authorization` headers were logged in full. Fixed by configuring `redact` on the base pino logger, which the per-request child loggers inherit.

## What the API does

| Endpoint | Auth | Behavior |
| --- | --- | --- |
| `GET /health` | none | Liveness check. Deliberately does not touch the database, so a slow database cannot fail the check. |
| `POST /auth/signup` | none | Validates and normalizes input with Zod, hashes the password with bcrypt (cost 12), inserts the caregiver, returns a JWT. |
| `POST /auth/login` | none | Verifies the password against the stored hash and returns a JWT. Returns one identical response for a wrong password and an unknown email. |
| `GET /auth/me` | Bearer token | Returns the caregiver identified by the token. |
| `GET /meditations` | Bearer token | Returns the meditation catalog. Audio and images ship with the app; the API stores the metadata and an `audioKey` that the client joins against its bundled assets. |
| `POST /usage-events` | Bearer token | Records a completed session. Idempotent: the client supplies a UUID, so a retried request returns the existing row with 200 instead of failing with a conflict. |
| `GET /usage-events` | Bearer token | The caller's own history, newest first, with a bounded `?limit`. |

Other behavior worth naming:

- **One error shape everywhere.** Every failure returns `{ "error": { "code", "message" } }`, including 404s for unmatched routes. Zod validation failures add a `details` object listing the invalid fields. Postgres constraint violations are mapped rather than leaked: a unique violation becomes 409, a foreign key violation becomes 400.
- **Identity comes from the token, never from the request.** The caller's id is read from the verified JWT and never accepted from a body or query string, so an authenticated user cannot read or write another caregiver's rows.
- **Retry-safe writes.** `usage_events` carries a client-generated UUID with a unique constraint, and the insert uses `ON CONFLICT DO NOTHING`, so a client retrying after a lost response cannot create duplicates.
- **Environment validation at startup.** `src/config.ts` parses environment variables with Zod and exits on a bad or missing value, so a misconfigured process fails at boot rather than on its first request.
- **Structured logging.** Pino with a UUID per request, so every line emitted while handling a request carries the same `reqId`. Failed token checks log the reason (expired versus bad signature) at different levels while returning a single generic message to the client.
- **Authenticated responses are not cacheable.** `requireAuth` sets `Cache-Control: no-store`, so every protected route inherits it rather than relying on each one to remember.
- **Parameterized queries.** All SQL uses `$1` placeholders through a single wrapper in `src/db.ts`.

## Setup

Requires Node 22 and PostgreSQL.

```bash
createdb biglittle_dev
cd backend
psql -d biglittle_dev -f db/schema.sql
psql -d biglittle_dev -f db/seed.sql    # six meditations; safe to re-run
cp .env.example .env                    # then set JWT_SECRET to a 32+ char random string
openssl rand -hex 32                    # generates one
npm install
npm run dev                             # starts on PORT, default 3000
```

Check it is up:

```bash
curl -i localhost:3000/health
```

Hosted Postgres requires TLS. `pg` reads it from the connection string, so append `?sslmode=no-verify` to `DATABASE_URL` in that case. Local Postgres needs nothing.

Other scripts: `npm run typecheck`, `npm run build`, `npm start`.

## Client

```bash
cd bigLITTLEapp
npm install
npx expo start
```

Run `npm` and `expo` commands from inside `bigLITTLEapp/`. There is no package.json at the repo root, and npm resolves one by searching upward, so running them from the root installs into whatever project it finds above this directory.

Expo SDK 54 with expo-router for file-based routing and NativeWind for styling. In development the API base URL is derived at runtime in `constants/api.ts` from the Expo dev server host, so the app reaches the API from a physical device rather than assuming `localhost`. A production build falls back to a deployed URL set in the same file.

The meditation screen layout and imagery started from a tutorial. The API, the authentication, and the client's auth flow, token handling, and API integration are my own work.
