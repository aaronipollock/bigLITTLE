import express from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { z } from "zod";
import { hashPassword, signToken } from "../auth";
import { query } from "../db";

const router = express.Router();

const signupSchema = z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(8),
});

router.post("/signup", asyncHandler(async (req, res) => {
    const { email, password } = signupSchema.parse(req.body)

    const passwordHash = await hashPassword(password);

    const result = await query<{ id: string; email: string }>(
        `INSERT INTO caregivers (email, password_hash)
        VALUES ($1, $2)
        RETURNING id, email`,
        [email, passwordHash]
    )

    const caregiver = result.rows[0];
    const token = signToken(Number(caregiver.id));

    res.status(201).json({
        token,
        caregiver: { id: Number(caregiver.id), email: caregiver.email },
    });
}));

export default router;
