CREATE TYPE "public"."jenis_kasus" AS ENUM('NARAPIDANA', 'TAHANAN');--> statement-breakpoint
CREATE TYPE "public"."jenis_lembaga" AS ENUM('RUTAN', 'LAPAS', 'LEMAS');--> statement-breakpoint
CREATE TYPE "public"."jenis_mutasi" AS ENUM('ANTAR_LEMBAGA', 'PENGELOLAAN');--> statement-breakpoint
CREATE TYPE "public"."status_mutasi" AS ENUM('PERMINTAAN', 'DALAM_PERJALANAN', 'SELESAI');--> statement-breakpoint
CREATE TYPE "public"."status_wbp" AS ENUM('TAHANAN', 'NARAPIDANA', 'BEBAS');--> statement-breakpoint
CREATE TABLE "lembaga" (
	"ID" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"KODE" text NOT NULL,
	"NAMA" text NOT NULL,
	"JENIS" "jenis_lembaga",
	"ALAMAT" text,
	"IS_ACTIVE" boolean DEFAULT true,
	"CREATED" timestamp,
	"CREATED_BY" text,
	"UPDATED" timestamp,
	"UPDATED_BY" text,
	CONSTRAINT "lembaga_KODE_unique" UNIQUE("KODE")
);
--> statement-breakpoint
CREATE TABLE "mutasi" (
	"ID" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"NOMOR_INDUK" text NOT NULL,
	"ID_PERKARA" uuid,
	"JENIS_MUTASI" "jenis_mutasi",
	"LEMBAGA_ASAL_ID" uuid,
	"LEMBAGA_TUJUAN_ID" uuid,
	"TANGGAL_MUTASI" date,
	"NOMOR_SURAT" text,
	"ALASAN" text,
	"STATUS_MUTASI" "status_mutasi",
	"CREATED" timestamp,
	"CREATED_BY" text,
	"UPDATED" timestamp,
	"UPDATED_BY" text
);
--> statement-breakpoint
CREATE TABLE "perkara" (
	"ID" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"NOMOR_INDUK" text NOT NULL,
	"NOMOR_PERKARA" text,
	"TANGGAL_MASUK" date,
	"JENIS_KASUS" "jenis_kasus",
	"PASAL" text,
	"NAMA_PENANGANAN" text,
	"NAMA_POLRES" text,
	"NAMA_KEJAKSAAN" text,
	"NAMA_PENGADILAN" text,
	"TANGGAL_PUTUSAN" date,
	"STATUS_WBP" "status_wbp",
	"ID_LEMBAGA_ASAL" uuid,
	"CREATED" timestamp,
	"CREATED_BY" text,
	"UPDATED" timestamp,
	"UPDATED_BY" text
);
--> statement-breakpoint
CREATE TABLE "tahapan_perkara" (
	"ID" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ID_PERKARA" uuid NOT NULL,
	"NOMOR_REGISTRASI" text,
	"KODE_TAHAPAN" text,
	"NAMA_TAHAPAN" text,
	"TANGGAL_MULAI" date,
	"TANGGAL_SELESAI" date,
	"LEMBAGA_ID" uuid,
	"CATATAN" text,
	"CREATED" timestamp,
	"CREATED_BY" text,
	"UPDATED" timestamp,
	"UPDATED_BY" text
);
--> statement-breakpoint
ALTER TABLE "mutasi" ADD CONSTRAINT "mutasi_NOMOR_INDUK_identitas_NOMOR_INDUK_fk" FOREIGN KEY ("NOMOR_INDUK") REFERENCES "public"."identitas"("NOMOR_INDUK") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mutasi" ADD CONSTRAINT "mutasi_ID_PERKARA_perkara_ID_fk" FOREIGN KEY ("ID_PERKARA") REFERENCES "public"."perkara"("ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mutasi" ADD CONSTRAINT "mutasi_LEMBAGA_ASAL_ID_lembaga_ID_fk" FOREIGN KEY ("LEMBAGA_ASAL_ID") REFERENCES "public"."lembaga"("ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mutasi" ADD CONSTRAINT "mutasi_LEMBAGA_TUJUAN_ID_lembaga_ID_fk" FOREIGN KEY ("LEMBAGA_TUJUAN_ID") REFERENCES "public"."lembaga"("ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "perkara" ADD CONSTRAINT "perkara_NOMOR_INDUK_identitas_NOMOR_INDUK_fk" FOREIGN KEY ("NOMOR_INDUK") REFERENCES "public"."identitas"("NOMOR_INDUK") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "perkara" ADD CONSTRAINT "perkara_ID_LEMBAGA_ASAL_lembaga_ID_fk" FOREIGN KEY ("ID_LEMBAGA_ASAL") REFERENCES "public"."lembaga"("ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tahapan_perkara" ADD CONSTRAINT "tahapan_perkara_ID_PERKARA_perkara_ID_fk" FOREIGN KEY ("ID_PERKARA") REFERENCES "public"."perkara"("ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tahapan_perkara" ADD CONSTRAINT "tahapan_perkara_LEMBAGA_ID_lembaga_ID_fk" FOREIGN KEY ("LEMBAGA_ID") REFERENCES "public"."lembaga"("ID") ON DELETE no action ON UPDATE no action;