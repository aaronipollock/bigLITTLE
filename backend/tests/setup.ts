import { readFileSync } from 'node:fs';
import path from 'node:path';
import { beforeAll, beforeEach, afterAll } from 'vitest';
import { pool } from '../src/db';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
}

const databaseName = new URL(databaseUrl).pathname;

if (!databaseName.endsWith("_test")) {
    throw new Error(`Refusing to run tests: database '${databaseName}' does not end in _test`);
}

beforeAll(async () => {
    const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
    const schemaSql = readFileSync(schemaPath, 'utf8');

    const seedPath = path.join(__dirname, '..', 'db', 'seed.sql');
    const seedSql = readFileSync(seedPath, 'utf8');

    await pool.query(schemaSql);

    await pool.query(seedSql);
});

beforeEach(async () => {
    await pool.query('TRUNCATE caregivers RESTART IDENTITY CASCADE');
});

afterAll(async () => {
    await pool.end();
});
