import { pgTable, text, uuid, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const jenisLembagaEnum = pgEnum('jenis_lembaga', ['RUTAN', 'LAPAS', 'LEMAS']);

export const lembaga = pgTable('lembaga', {
  id: uuid('ID').primaryKey().defaultRandom(),
  kode: text('KODE').notNull().unique(),
  nama: text('NAMA').notNull(),
  jenis: jenisLembagaEnum('JENIS'),
  alamat: text('ALAMAT'),
  isActive: boolean('IS_ACTIVE').default(true),
  created: timestamp('CREATED', { mode: 'string' }),
  createdBy: text('CREATED_BY'),
  updated: timestamp('UPDATED', { mode: 'string' }),
  updatedBy: text('UPDATED_BY'),
});

export type Lembaga = typeof lembaga.$inferSelect;
export type NewLembaga = typeof lembaga.$inferInsert;
