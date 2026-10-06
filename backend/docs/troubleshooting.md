# Troubleshooting log

Running record of issues found in this backend, their root causes, and how each was verified.

---

## 2026-08-07 — Bearer tokens written to logs in plain text

**Symptom.** Every request header was being written to the application log, including `Authorization`. Once auth routes exist, that means live bearer tokens are written to the log stream. This project currently logs to stdout in development, but anywhere logs are persisted or forwarded, a token in them is a working credential sitting wherever those logs end up.

**Scope.** No real credential was ever exposed. This was found and fixed on 2026-08-07; the authentication routes that issue tokens were not added until 2026-08-28. The only bearer token ever written to the log was the fake value in the reproduction below. Request bodies were never affected, since `pino-http` disables body logging by default, so signup and login passwords were never logged.

**Reproduction.**

```
curl -i -H "Authorization: Bearer notarealtoken123" localhost:3000/health
```

Server log showed `"authorization": "Bearer notarealtoken123"` in full under `req.headers`.

**Root cause.** Library defaults, not application code. `pino-http` 11.0.0 ships no `redact` configuration and falls back to the request serializer from `pino-std-serializers` 7.1.0, which assigns the request headers verbatim (`_req.headers = req.headers` in `lib/req.js`), so every header is serialized as-is.

This is documented, intentional behavior rather than a defect. Pino documents the `redact` option in `docs/api.md` and devotes a full page to it in `docs/redaction.md`, and the `pino-http` README reasons about this same class of risk when explaining why request body logging is disabled by default. The default is unsafe for an application that handles bearer tokens; it is not broken. The work here was recognizing that the default applied to this service and configuring the documented remedy before any real token existed.

**Fix.** Added `redact: ['req.headers.authorization', 'req.headers.cookie']` to the base pino options in `src/logger.ts`. Redaction is configured once on the root logger; the per-request child loggers created by `pino-http` inherit it.

**Verification.** Re-ran the identical curl command. Server log now shows `"authorization": "[Redacted]"`, with other headers unaffected.

**Note.** This is log hygiene only — the token is still present in memory and on the wire. Hyphenated header names need bracket notation in redact paths (e.g. `req.headers["set-cookie"]`).

---

## 2026-10-05 — Production build cannot find `tsc`

**Symptom.** The planned Render build command, `npm install && npm run build`, fails when `NODE_ENV=production` is set in the service's environment. The install step reports success; the build step then fails with:

```
sh: tsc: command not found
```

**Scope.** Caught before the first deploy by reproducing Render's build locally, so no deploy ever failed. The local build had always passed because `NODE_ENV` is unset in development.

**Reproduction.** In a clean copy of `backend/` (no `node_modules`):

```
NODE_ENV=production npm install
ls node_modules/.bin/tsc      # No such file or directory
NODE_ENV=production npm run build
```

`npm install` printed `added 117 packages` and gave no warning. The full install is 154 packages; the missing ones are the devDependencies.

**Root cause.** Two separate behaviors combine.

1. Render passes a service's environment variables to the build step as well as the running process. `NODE_ENV=production` is meant for runtime, but the build sees it too.
2. npm's `omit` config defaults to `dev` when `NODE_ENV=production`. With npm 10.9.2, `NODE_ENV=production npm config get omit` prints `dev`, and with `NODE_ENV` unset it prints nothing. So `npm install` silently skips devDependencies.

`typescript` is a devDependency, which is correct: it is only needed to compile, not to run `dist/`. But this build compiles on the server, so it needs devDependencies at build time. The failure shows up one step after its cause: install reports success, and the error appears in the build step.

**Fix.** Changed the Render build command to:

```
npm ci --include=dev && npm run build
```

`--include=dev` overrides the omit default. `npm ci` installs exactly what `package-lock.json` specifies, so the server builds the same dependency tree that was tested locally. `NODE_ENV=production` stays set, and it still applies at runtime.

**Verification.** Locally, the same clean copy with `NODE_ENV=production` set installed 154 packages, built, booted with `npm start`, and returned `{"status":"ok"}` from `/health`. On Render, the first deploy (commit `87bcbdc`) logged `npm ci --include=dev` adding 153 packages (one fewer than on macOS because `fsevents` is a macOS-only optional dependency), `tsc` completing, and `Build successful`. The live service then passed its health checks.

**Note.** Any server-side build step that depends on devDependencies (bundlers, type generators, etc.) hits the same issue on any host that applies runtime environment variables to builds. Where `NODE_ENV` is set matters as much as what it is set to.
