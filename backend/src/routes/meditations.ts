import express from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth } from "../middleware/requireAuth";
import { query } from "../db";

const router = express.Router();

// Everything below this line requires a valid token
router.use(requireAuth);

router.get("/", asyncHandler(async (_req, res) => {
    const result = await query<{
        id: string;
        title: string;
        description: string | null;
        category: string;
        duration_seconds: number;
        audio_key: string;
    }>(
        `SELECT id, title, description, category, duration_seconds, audio_key
        FROM meditations
        ORDER BY id`
    );

    res.status(200).json({
        meditations: result.rows.map((row) => ({
            id: Number(row.id),
            title: row.title,
            description: row.description,
            category: row.category,
            durationSeconds: row.duration_seconds,
            audioKey: row.audio_key,
        })),
    });
}));

export default router;
