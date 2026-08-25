# Troubleshooting log

Running record of issues found in this backend, their root causes, and how each was verified.

---

## 2026-08-07 — Bearer tokens written to logs in plain text

**Symptom.** Every request header was being written to the application log, including `Authorization`. Once auth routes exist, that means live bearer tokens land in log files, which are shipped to aggregators and retained for months.

**Reproduction.**

```
curl -i -H "Authorization: Bearer notarealtoken123" localhost:3000/health
```

Server log showed `"authorization": "Bearer notarealtoken123"` in full under `req.headers`.

**Root cause.** Library defaults, not application code. `pino-http` ships no `redact` configuration, and `pino-std-serializers` assigns the request headers verbatim (`_req.headers = req.headers`), so every header is serialized as-is.

**Fix.** Added `redact: ['req.headers.authorization', 'req.headers.cookie']` to the base pino options in `src/logger.ts`. Redaction is configured once on the root logger; the per-request child loggers created by `pino-http` inherit it.

**Verification.** Re-ran the identical curl command. Server log now shows `"authorization": "[Redacted]"`, with other headers unaffected.

**Note.** This is log hygiene only — the token is still present in memory and on the wire. Hyphenated header names need bracket notation in redact paths (e.g. `req.headers["set-cookie"]`).
