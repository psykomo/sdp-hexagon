import { pgTable, text, uuid, date, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { identitas } from './identitas';
import { lembaga } from './lembaga';

export const jenisKasusEnum = pgEnum('jenis_kasus', ['NARAPIDANA', 'TAHANAN']);
export const statusWbpEnum = pgEnum('status_wbp', ['TAHANAN', 'NARAPIDANA', 'BEBAS']);

export const perkara = pgTable('perkara', {
  id: uuid('ID').primaryKey().defaultRandom(),
  nomorInduk: text('NOMOR_INDUK').notNull().references(() => identitas.nomorInduk),
  nomorPerkara: text('NOMOR_PERKARA'),
  tanggalMasuk: date('TANGGAL_MASUK', { mode: 'string' }),
  jenisKasus: jenisKasusEnum('JENIS_KASUS'),
  Pasal: text('PASAL'),
  namaPenanganan: text('NAMA_PENANGANAN'),
  namaPolres: text('NAMA_POLRES'),
  namaKejaksaan: text('NAMA_KEJAKSAAN'),
  namaPengadilan: text('NAMA_PENGADILAN'),
  tanggalPutusan: date('TANGGAL_PUTUSAN', { mode: 'string' }),
  statusWbp: statusWbpEnum('STATUS_WBP'),
  idLembagaAsal: uuid('ID_LEMBAGA_ASAL').references(() => lembaga.id),
  created: timestamp('CREATED', { mode: 'string' }),
  createdBy: text('CREATED_BY'),
  updated: timestamp('UPDATED', { mode: 'string' }),
  updatedBy: text('UPDATED_BY'),
});

export type Perkara = typeof perkara.$inferSelect;
export type NewPerkara = typeof perkara.$inferInsert;
