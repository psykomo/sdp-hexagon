import { pgTable, text, uuid, date, timestamp } from 'drizzle-orm/pg-core';
import { perkara } from './perkara';
import { lembaga } from './lembaga';

export const tahapanPerkara = pgTable('tahapan_perkara', {
  id: uuid('ID').primaryKey().defaultRandom(),
  idPerkara: uuid('ID_PERKARA').notNull().references(() => perkara.id),
  nomorRegistrasi: text('NOMOR_REGISTRASI'),
  kodeTahapan: text('KODE_TAHAPAN'),
  namaTahapan: text('NAMA_TAHAPAN'),
  tanggalMulai: date('TANGGAL_MULAI', { mode: 'string' }),
  tanggalSelesai: date('TANGGAL_SELESAI', { mode: 'string' }),
  lembagaId: uuid('LEMBAGA_ID').references(() => lembaga.id),
  catatan: text('CATATAN'),
  created: timestamp('CREATED', { mode: 'string' }),
  createdBy: text('CREATED_BY'),
  updated: timestamp('UPDATED', { mode: 'string' }),
  updatedBy: text('UPDATED_BY'),
});

export type TahapanPerkara = typeof tahapanPerkara.$inferSelect;
export type NewTahapanPerkara = typeof tahapanPerkara.$inferInsert;
