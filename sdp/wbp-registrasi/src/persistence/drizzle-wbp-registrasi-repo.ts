import { WbpRegistrasiRepository } from '@/contracts/wbp-registrasi-repository';
import { 
  CreateRegistrasiDTO, 
  UpdateRegistrasiDTO, 
  RegistrasiListParams 
} from '../contracts/types';

import { perkara, getDb } from '@sdp/database';

/**
 * Concrete implementation of the RegistrasiRepositoryPort using Drizzle ORM.
 * This lives in the "Infrastructure" layer in a clean architecture.
 */
export class DrizzleWbpRegistrasiRepository implements WbpRegistrasiRepository {
  async findAll(params?: RegistrasiListParams) {
    const db = getDb();
    const results = await db.select().from(perkara);
    const list = results.map((item) => ({
      id: item.id,
      nomorInduk: item.nomorInduk,
      tanggalRegistrasi: new Date(),
    }));
    return { data: list, total: 0 };
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

export const registrasiRepository = new DrizzleWbpRegistrasiRepository();
