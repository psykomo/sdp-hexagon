/**
 * Identitas DTOs - Data Transfer Objects
 * 
 * These types are shared between server and client.
 */
export interface IdentitasDTO {
  nomorInduk: string;
  idJenisSuku?: string | null;
  idJenisSukuLain?: string | null;
  idJenisRambut?: string | null;
  idJenisMuka?: string | null;
  idJenisPendidikan?: string | null;
  idJenisTangan?: string | null;
  idJenisAgama?: string | null;
  idJenisAgamaLain?: string | null;
  idJenisPekerjaan?: string | null;
  idJenisPekerjaanLain?: string | null;
  idUser?: string | null;
  idBentukMata?: string | null;
  idWarnaMata?: string | null;
  idJenisKeahlian1?: string | null;
  idJenisKeahlian1Lain?: string | null;
  idJenisKeahlian2?: string | null;
  idJenisKeahlian2Lain?: string | null;
  idJenisHidung?: string | null;
  idJenisLevel1?: string | null;
  idJenisMulut?: string | null;
  idJenisLevel2?: string | null;
  idJenisWarganegara?: string | null;
  idNegaraAsing?: string | null;
  idPropinsi?: string | null;
  idPropinsiLain?: string | null;
  idJenisStatusPerkawinan?: string | null;
  idJenisKelamin: string;
  idJenisKaki?: string | null;
  idTempatLahir?: string | null;
  idTempatLahirLain?: string | null;
  idKota?: string | null;
  idKotaLain?: string | null;
  idTempatAsal?: string | null;
  idTempatAsalLain?: string | null;
  residivis: string;
  residivisCounter?: number | null;
  namaLengkap: string;
  nik?: string | null;
  namaAlias1?: string | null;
  namaAlias2?: string | null;
  namaAlias3?: string | null;
  namaKecil1?: string | null;
  namaKecil2?: string | null;
  namaKecil3?: string | null;
  tanggalLahir: string;
  isWbpBeresikoTinggi?: number | null;
  isPengaruhTerhadapMasyarakat?: number | null;
  alamat: string;
  alamatAlternatif?: string | null;
  kodepos?: string | null;
  telepon?: string | null;
  alamatPekerjaan?: string | null;
  keteranganPekerjaan?: string | null;
  minat?: string | null;
  nmAyah?: string | null;
  tmpTglAyah?: string | null;
  nmIbu?: string | null;
  tmpTglIbu?: string | null;
  nmSaudara?: string | null;
  anakke?: number | null;
  jmlSaudara?: number | null;
  jmlIstriSuami?: number | null;
  nmIstriSuami?: string | null;
  tmpTglIstriSuami?: string | null;
  jmlAnak?: number | null;
  nmAnak?: string | null;
  telephoneKeluarga?: string | null;
  tinggi?: number | null;
  berat?: number | null;
  cacat?: string | null;
  ciri?: string | null;
  fotoDepan?: string | null;
  fotoKanan?: string | null;
  fotoKiri?: string | null;
  fotoCiri1?: string | null;
  fotoCiri2?: string | null;
  fotoCiri3?: string | null;
  konsolidasi?: number | null;
  konsolidasiImage?: number | null;
  idKacamata?: string | null;
  idTelinga?: string | null;
  idWarnakulit?: string | null;
  idBentukrambut?: string | null;
  idBentukbibir?: string | null;
  idLengan?: string | null;
  nomorIndukNasional?: string | null;
  isVerifikasi?: number | null;
  isDeleted?: number | null;
  created?: string | null;
  createdBy?: string | null;
  updated?: string | null;
  updatedBy?: string | null;
}

export interface CreateIdentitasDTO {
  nomorInduk: string;
  idJenisKelamin: string;
  namaLengkap: string;
  tanggalLahir: string;
  alamat: string;
  residivis?: string;
  nik?: string;
  [key: string]: unknown;
}

export interface UpdateIdentitasDTO {
  namaLengkap?: string;
  alamat?: string;
  nik?: string;
  [key: string]: unknown;
}

export interface IdentitasListParams {
  limit?: number;
  offset?: number;
  search?: string;
}

export interface IdentitasListResponse {
  data: IdentitasDTO[];
  total: number;
  limit: number;
  offset: number;
}
