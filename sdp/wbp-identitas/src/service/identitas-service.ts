import { identitasRepository } from '../repository/identitas-repo';
import type { IdentitasPort } from '../port/identitas-port';
import type { 
  IdentitasDTO, 
  CreateIdentitasDTO, 
  UpdateIdentitasDTO,
  IdentitasListResponse 
} from '../types/identitas';

/**
 * IdentitasService - Business logic layer (local/library mode)
 * 
 * Implements IdentitasPort for direct function calls.
 * Use this when embedding the package in your app (monolith).
 */
export class IdentitasService implements IdentitasPort {
  async getById(nomorInduk: string): Promise<IdentitasDTO | null> {
    if (!nomorInduk) {
      throw new Error('nomorInduk is required');
    }
    
    const result = await identitasRepository.findById(nomorInduk);
    
    if (!result || result.isDeleted) {
      return null;
    }
    
    return this.toDTO(result);
  }

  async getAll(limit: number = 10, offset: number = 0): Promise<IdentitasListResponse> {
    const [data, total] = await Promise.all([
      identitasRepository.findAll(limit, offset),
      identitasRepository.count(),
    ]);
    
    return {
      data: data.map(this.toDTO),
      total,
      limit,
      offset,
    };
  }

  async search(query: string, limit: number = 10): Promise<IdentitasDTO[]> {
    const results = await identitasRepository.search(query, limit);
    return results.map(this.toDTO);
  }

  async count(): Promise<number> {
    return identitasRepository.count();
  }

  async exists(nomorInduk: string): Promise<boolean> {
    return identitasRepository.exists(nomorInduk);
  }

  async create(data: CreateIdentitasDTO): Promise<IdentitasDTO> {
    this.validateCreateData(data);
    
    // Check for duplicates
    const exists = await identitasRepository.exists(data.nomorInduk);
    if (exists) {
      throw new Error(`Identitas with nomorInduk ${data.nomorInduk} already exists`);
    }
    
    const result = await identitasRepository.create(data);
    return this.toDTO(result);
  }

  async update(nomorInduk: string, data: UpdateIdentitasDTO): Promise<IdentitasDTO | null> {
    if (!nomorInduk) {
      throw new Error('nomorInduk is required');
    }
    
    const exists = await identitasRepository.exists(nomorInduk);
    if (!exists) {
      return null;
    }
    
    const result = await identitasRepository.update(nomorInduk, data);
    return result ? this.toDTO(result) : null;
  }

  async delete(nomorInduk: string): Promise<boolean> {
    if (!nomorInduk) {
      throw new Error('nomorInduk is required');
    }
    
    return identitasRepository.delete(nomorInduk);
  }

  // Validation
  private validateCreateData(data: CreateIdentitasDTO): void {
    const errors: string[] = [];
    
    if (!data.nomorInduk) {
      errors.push('nomorInduk is required');
    }
    if (!data.namaLengkap) {
      errors.push('namaLengkap is required');
    }
    if (!data.idJenisKelamin) {
      errors.push('idJenisKelamin is required');
    }
    if (!data.tanggalLahir) {
      errors.push('tanggalLahir is required');
    }
    if (!data.alamat) {
      errors.push('alamat is required');
    }
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }

  // Mapping
  private toDTO(record: Awaited<ReturnType<typeof identitasRepository.findById>>): IdentitasDTO {
    if (!record) {
      throw new Error('Record is null');
    }
    
    return record as unknown as IdentitasDTO;
  }
}

// Singleton instance
export const identitasService = new IdentitasService();
