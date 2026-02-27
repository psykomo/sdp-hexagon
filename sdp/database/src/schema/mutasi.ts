import { pgTable, text, uuid, date, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { identitas } from './identitas';
import { perkara } from './perkara';
import { lembaga } from './lembaga';

export const jenisMutasiEnum = pgEnum('jenis_mutasi', ['ANTAR_LEMBAGA', 'PENGELOLAAN']);
export const statusMutasiEnum = pgEnum('status_mutasi', ['PERMINTAAN', 'DALAM_PERJALANAN', 'SELESAI']);

export const mutasi = pgTable('mutasi', {
  id: uuid('ID').primaryKey().defaultRandom(),
  nomorInduk: text('NOMOR_INDUK').notNull().references(() => identitas.nomorInduk),
  idPerkara: uuid('ID_PERKARA').references(() => perkara.id),
  jenisMutasi: jenisMutasiEnum('JENIS_MUTASI'),
  lembagaAsalId: uuid('LEMBAGA_ASAL_ID').references(() => lembaga.id),
  lembagaTujuanId: uuid('LEMBAGA_TUJUAN_ID').references(() => lembaga.id),
  tanggalMutasi: date('TANGGAL_MUTASI', { mode: 'string' }),
  nomorSurat: text('NOMOR_SURAT'),
  alasan: text('ALASAN'),
  statusMutasi: statusMutasiEnum('STATUS_MUTASI'),
  created: timestamp('CREATED', { mode: 'string' }),
  createdBy: text('CREATED_BY'),
  updated: timestamp('UPDATED', { mode: 'string' }),
  updatedBy: text('UPDATED_BY'),
});

export type Mutasi = typeof mutasi.$inferSelect;
export type NewMutasi = typeof mutasi.$inferInsert;
