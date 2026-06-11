-- bigLITTLE schema
-- Run with: psql -d biglittle_dev -f db/schema.sql

BEGIN;

CREATE TABLE IF NOT EXISTS caregivers (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role          TEXT NOT NULL DEFAULT 'caregiver',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS meditations (
    id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title            TEXT NOT NULL,
    description      TEXT,
    category         TEXT NOT NULL,
    duration_seconds INTEGER NOT NULL CHECK (duration_seconds > 0),
    audio_key        TEXT NOT NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS usage_events (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    -- client-generated UUID so retried requests can't create duplicates
    client_event_id     UUID NOT NULL UNIQUE,
    caregiver_id        BIGINT NOT NULL REFERENCES caregivers(id) ON DELETE CASCADE,
    meditation_id       BIGINT NOT NULL REFERENCES meditations(id) ON DELETE CASCADE,
    child_profile_label TEXT,
    played_at_utc       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- speeds up "this caregiver's history, newest first"
CREATE INDEX IF NOT EXISTS idx_usage_events_caregiver_played
    ON usage_events (caregiver_id, played_at_utc DESC);

COMMIT;
