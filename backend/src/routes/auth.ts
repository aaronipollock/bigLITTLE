import express from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { z } from "zod";
import { hashPassword, signToken, verifyPassword } from "../auth";
import { query } from "../db";
import { UnauthorizedError } from "../errors";

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

const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string(),
});

router.post("/login", asyncHandler(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);

    const result = await query<{ id: string; password_hash: string }>(
        `SELECT id, password_hash FROM caregivers WHERE email = $1`,
        [email]
    );

    const caregiver = result.rows[0];

    if (!caregiver || !(await verifyPassword(password, caregiver.password_hash))) {
        req.log.info({ email }, "login failed");
        throw new UnauthorizedError("Invalid email or password");
    }

    const token = signToken(Number(caregiver.id));

    res.status(200).json({
        token,
        caregiver: { id: Number(caregiver.id), email },
    })
}))

export default router;
