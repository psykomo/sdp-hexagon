import { 
  RegistrasiDTO, 
  CreateRegistrasiDTO, 
  UpdateRegistrasiDTO, 
  RegistrasiListParams 
} from '../../core/types/registrasi';

/**
 * Interface for the repository to allow dependency injection.
 * While the Service defines the "Port", the Repository implementation 
 * resides in infra.
 */
export interface IRegistrasiRepository {
  findAll(params?: RegistrasiListParams): Promise<{ data: RegistrasiDTO[]; total: number }>;
  findById(id: string): Promise<RegistrasiDTO | null>;
  create(data: CreateRegistrasiDTO): Promise<RegistrasiDTO>;
  update(id: string, data: UpdateRegistrasiDTO): Promise<RegistrasiDTO>;
  delete(id: string): Promise<void>;
}

export class RegistrasiRepository implements IRegistrasiRepository {
  async findAll(params?: RegistrasiListParams) {
    // TODO: Implement with Drizzle
    return { data: [], total: 0 };
  }

  async findById(id: string) {
    return null;
  }

  async create(data: CreateRegistrasiDTO) {
    return {
      id: 'placeholder',
      nomorInduk: data.nomorInduk,
      tanggalRegistrasi: data.tanggalRegistrasi || new Date(),
      keterangan: data.keterangan,
    };
  }

  async update(id: string, data: UpdateRegistrasiDTO) {
    return {
      id,
      nomorInduk: 'placeholder',
      tanggalRegistrasi: data.tanggalRegistrasi || new Date(),
    };
  }

  async delete(id: string) {
    // Implement
  }
}

export const registrasiRepository = new RegistrasiRepository();
