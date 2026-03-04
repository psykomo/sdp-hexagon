export interface RegistrasiDTO {
  id: string;
  nomorInduk: string;
  tanggalRegistrasi: Date;
  keterangan?: string;
}

export interface CreateRegistrasiDTO {
  nomorInduk: string;
  tanggalRegistrasi?: Date;
  keterangan?: string;
}

export interface UpdateRegistrasiDTO {
  tanggalRegistrasi?: Date;
  keterangan?: string;
}

export interface RegistrasiListParams {
  nomorInduk?: string;
  limit?: number;
  offset?: number;
}

export interface RegistrasiListResponse {
  data: RegistrasiDTO[];
  total: number;
}
