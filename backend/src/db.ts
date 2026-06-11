import { Pool } from 'pg';
import { config } from './config';

// A pool keeps a handful of database connections open and lends them out
// per query. Opening a fresh TCP connection per request would be far too slow.
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
