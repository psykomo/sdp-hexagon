import { AsyncLocalStorage } from 'node:async_hooks';
import { db } from './db'; // Your initialized drizzle instance

// Type helper to extract the transaction type from your db
export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

// Union type for functions that accept either
export type DbOrTx = typeof db | Transaction;

const txStorage = new AsyncLocalStorage<DbOrTx>();

// Helper function to get the current DB (either active Tx or main DB)
export function getDb(): DbOrTx {
    return txStorage.getStore() ?? db;
}

export function txManager() {
    return {
        start: async (fn: () => Promise<void>) => {
            const _db = getDb();
            await _db.transaction(async (tx) => {
                txStorage.run(tx, fn);
            });
        }
    }
}