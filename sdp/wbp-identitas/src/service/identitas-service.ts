import { identitasRepository } from '../repository/identitas-repo';
import type { RequestContext } from '@sdp/shared/context';
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
 * Context is passed explicitly to each method for authorization and logging.
 */
export class IdentitasService implements IdentitasPort {
  // Helper to require specific permissions
  private requirePermissions(ctx: RequestContext, ...required: string[]): void {
    const missing = required.filter(p => !ctx.permissions.includes(p));
    if (missing.length > 0) {
      throw new Error(`Forbidden: missing permissions: ${missing.join(', ')}`);
    }
  }

  // Helper to require specific roles
  private requireRoles(ctx: RequestContext, ...required: string[]): void {
    const hasRole = required.some(r => ctx.userRoles.includes(r));
    if (!hasRole) {
      throw new Error(`Forbidden: requires one of roles: ${required.join(', ')}`);
    }
  }

  // Log with context info
  private log(ctx: RequestContext, message: string, meta?: Record<string, unknown>): void {
    console.log(JSON.stringify({
      message,
      requestId: ctx.requestId,
      userId: ctx.userId,
      ...meta,
    }));
  }

  async getById(ctx: RequestContext, nomorInduk: string): Promise<IdentitasDTO | null> {
    if (!nomorInduk) {
      throw new Error('nomorInduk is required');
    }
    
    this.log(ctx, 'getById', { nomorInduk });
    
    const result = await identitasRepository.findById(nomorInduk);
    
    if (!result || result.isDeleted) {
      return null;
    }
    
    return this.toDTO(result);
  }

  async getAll(ctx: RequestContext, limit: number = 10, offset: number = 0): Promise<IdentitasListResponse> {
    this.log(ctx, 'getAll', { limit, offset });
    
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

  async search(ctx: RequestContext, query: string, limit: number = 10): Promise<IdentitasDTO[]> {
    this.log(ctx, 'search', { query, limit });
    
    const results = await identitasRepository.search(query, limit);
    return results.map(this.toDTO);
  }

  async count(ctx: RequestContext): Promise<number> {
    this.log(ctx, 'count');
    return identitasRepository.count();
  }

  async exists(ctx: RequestContext, nomorInduk: string): Promise<boolean> {
    this.log(ctx, 'exists', { nomorInduk });
    return identitasRepository.exists(nomorInduk);
  }

  async create(ctx: RequestContext, data: CreateIdentitasDTO): Promise<IdentitasDTO> {
    // Require write permission for create
    this.requirePermissions(ctx, 'identitas:write');
    
    this.log(ctx, 'create', { nomorInduk: data.nomorInduk });
    
    this.validateCreateData(data);
    
    // Check for duplicates
    const exists = await identitasRepository.exists(data.nomorInduk);
    if (exists) {
      throw new Error(`Identitas with nomorInduk ${data.nomorInduk} already exists`);
    }
    
    const result = await identitasRepository.create(data);
    return this.toDTO(result);
  }

  async update(ctx: RequestContext, nomorInduk: string, data: UpdateIdentitasDTO): Promise<IdentitasDTO | null> {
    // Require write permission for update
    this.requirePermissions(ctx, 'identitas:write');
    
    this.log(ctx, 'update', { nomorInduk });
    
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

  async delete(ctx: RequestContext, nomorInduk: string): Promise<boolean> {
    // Require delete permission for delete
    this.requirePermissions(ctx, 'identitas:delete');
    
    this.log(ctx, 'delete', { nomorInduk });
    
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
