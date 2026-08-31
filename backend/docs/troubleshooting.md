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
