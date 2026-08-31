# bigLITTLE

A meditation app with an Expo / React Native client (`bigLITTLEapp/`) and a REST API backend (`backend/`) built on Express, PostgreSQL, and TypeScript, using JWT authentication with bcrypt password hashing.

This is a personal project in progress. The API runs locally against a local Postgres database. The client and the API are not yet connected.

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

Other behavior worth naming:

- **One error shape everywhere.** Every failure returns `{ "error": { "code", "message" } }`, including 404s for unmatched routes. Zod validation failures add a `details` object listing the invalid fields.
- **Environment validation at startup.** `src/config.ts` parses environment variables with Zod and exits on a bad or missing value, so a misconfigured process fails at boot rather than on its first request.
- **Structured logging.** Pino with a UUID per request, so every line emitted while handling a request carries the same `reqId`. Failed token checks log the reason (expired versus bad signature) at different levels while returning a single generic message to the client.
- **Parameterized queries.** All SQL uses `$1` placeholders through a single wrapper in `src/db.ts`.

## Setup

Requires Node 20+ and PostgreSQL.

```bash
createdb biglittle_dev
cd backend
psql -d biglittle_dev -f db/schema.sql
cp .env.example .env      # then set JWT_SECRET to a 32+ char random string
openssl rand -hex 32      # generates one
npm install
npm run dev               # starts on PORT, default 3000
```

Check it is up:

```bash
curl -i localhost:3000/health
```

Other scripts: `npm run typecheck`, `npm run build`, `npm start`.

## Client

```bash
cd bigLITTLEapp
npm install
npx expo start
```

Expo SDK 54 with expo-router for file-based routing and NativeWind for styling. Meditation content is currently bundled with the app rather than served by the API.
