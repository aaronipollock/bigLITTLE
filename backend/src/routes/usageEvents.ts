import express from "express";
import { z } from "zod";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth } from "../middleware/requireAuth";
import { query } from "../db";
import { ConflictError } from "../errors";

const router = express.Router();

router.use(requireAuth);

const usageEventSchema = z.object({
    clientEventId: z.string().uuid(),
    meditationId: z.number().int().positive(),
    childProfileLabel: z.string().trim().max(100).optional(),
});

router.post("/", asyncHandler(async (req, res) => {
    const { clientEventId, meditationId, childProfileLabel } =
        usageEventSchema.parse(req.body);

    const caregiverId = req.caregiverId;

    const inserted = await query<{ id: string; played_at_utc: Date }>(
        `INSERT INTO usage_events
            (client_event_id, caregiver_id, meditation_id, child_profile_label)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (client_event_id) DO NOTHING
        RETURNING id, played_at_utc`,
        [clientEventId, caregiverId, meditationId, childProfileLabel ?? null]
    );

    if (inserted.rows.length > 0) {
        const row = inserted.rows[0];
        res.status(201).json({
            usageEvent: { id: Number(row.id), playedAtUtc: row.played_at_utc },
        });
        return;
    }

    // Already recorded. A retry must succeed, not fail.
    const existing = await query<{ id: string; played_at_utc: Date }>(
        `SELECT id, played_at_utc
        FROM usage_events
        WHERE client_event_id = $1 AND caregiver_id = $2`,
        [clientEventId, caregiverId]
    );

    if (existing.rows.length === 0) {
        throw new ConflictError("That event id is already in use.");
    }

    const row = existing.rows[0];
    res.status(200).json({
        usageEvent: { id: Number(row.id), playedAtUtc: row.played_at_utc },
    });
}));

export default router;
