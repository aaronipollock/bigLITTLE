import { Pool } from 'pg';
import { config } from './config';

// A pool keeps a handful of database connections open and lends them out
// per query. Opening a fresh TCP connection per request would be far too slow.
// TLS is controlled by the connection string, not by code. `pg` parses an
// `sslmode` query parameter out of DATABASE_URL, so a managed database uses
// e.g. `...?sslmode=no-verify` while local Postgres omits it entirely.
// Keeping this in the environment means the same build runs everywhere.
export const pool = new Pool({
  connectionString: config.DATABASE_URL,
});

// Thin wrapper so the rest of the app never touches the pool directly.
// $1, $2... placeholders are filled by the driver — this is what makes
// queries immune to SQL injection. Never build SQL with string concatenation.
export const query = <Row extends object = Record<string, unknown>>(
  text: string,
  params?: unknown[]
) => pool.query<Row>(text, params as any[]);
