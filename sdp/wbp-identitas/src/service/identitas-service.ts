import { identitasRepository } from '../repository/identitas-repo';
import { requestContext, type RequestContext } from '@sdp/shared/context';
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
 * 
 * Context-aware: automatically accesses request context via AsyncLocalStorage
 */
export class IdentitasService implements IdentitasPort {
  // Get context from AsyncLocalStorage (undefined if not in a request)
  private get ctx(): RequestContext | undefined {
    return requestContext.get();
  }

  // Helper to require specific permissions
  private requirePermissions(...required: string[]): void {
    const ctx = this.ctx;
    if (!ctx) {
      throw new Error('No request context - wrap with requestContext.run()');
    }
    
    const missing = required.filter(p => !ctx.permissions.includes(p));
    if (missing.length > 0) {
      throw new Error(`Forbidden: missing permissions: ${missing.join(', ')}`);
    }
  }

  // Helper to require specific roles
  private requireRoles(...required: string[]): void {
    const ctx = this.ctx;
    if (!ctx) {
      throw new Error('No request context - wrap with requestContext.run()');
    }
    
    const hasRole = required.some(r => ctx.userRoles.includes(r));
    if (!hasRole) {
      throw new Error(`Forbidden: requires one of roles: ${required.join(', ')}`);
    }
  }

  // Log with context info
  private log(message: string, meta?: Record<string, unknown>): void {
    const ctx = this.ctx;
    console.log(JSON.stringify({
      message,
      requestId: ctx?.requestId,
      userId: ctx?.userId,
      ...meta,
    }));
  }

  async getById(nomorInduk: string): Promise<IdentitasDTO | null> {
    if (!nomorInduk) {
      throw new Error('nomorInduk is required');
    }
    
    this.log('getById', { nomorInduk });
    
    const result = await identitasRepository.findById(nomorInduk);
    
    if (!result || result.isDeleted) {
      return null;
    }
    
    return this.toDTO(result);
  }

  async getAll(limit: number = 10, offset: number = 0): Promise<IdentitasListResponse> {
    this.log('getAll', { limit, offset });
    
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
    this.log('search', { query, limit });
    
    const results = await identitasRepository.search(query, limit);
    return results.map(this.toDTO);
  }

  async count(): Promise<number> {
    this.log('count');
    return identitasRepository.count();
  }

  async exists(nomorInduk: string): Promise<boolean> {
    this.log('exists', { nomorInduk });
    return identitasRepository.exists(nomorInduk);
  }

  async create(data: CreateIdentitasDTO): Promise<IdentitasDTO> {
    // Require write permission for create
    this.requirePermissions('identitas:write');
    
    this.log('create', { nomorInduk: data.nomorInduk });
    
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
    // Require write permission for update
    this.requirePermissions('identitas:write');
    
    this.log('update', { nomorInduk });
    
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
    // Require delete permission for delete
    this.requirePermissions('identitas:delete');
    
    this.log('delete', { nomorInduk });
    
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
