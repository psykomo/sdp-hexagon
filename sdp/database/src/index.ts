import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index';
import * as dotenv from 'dotenv';

// Attempt to load .env from workspace root if not already set
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: '../../.env' });
}

// This is a placeholder connection string.
// In a real application, you should use an environment variable.
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/hexagon';

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });

export * from './schema/index';
export * from 'drizzle-orm';
