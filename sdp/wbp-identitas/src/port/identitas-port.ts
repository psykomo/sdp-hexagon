import type { 
  IdentitasDTO,
  CreateIdentitasDTO,
  UpdateIdentitasDTO,
  IdentitasListResponse,
} from '../types/identitas';

/**
 * IdentitasPort - Abstraction interface for Identitas operations
 * 
 * This defines the contract. Implementations can be:
 * - IdentitasService: Direct function calls (library mode)
 * - IdentitasHttpClient: HTTP calls (microservice mode)
 */
export interface IdentitasPort {
  getById(nomorInduk: string): Promise<IdentitasDTO | null>;
  getAll(limit?: number, offset?: number): Promise<IdentitasListResponse>;
  search(query: string, limit?: number): Promise<IdentitasDTO[]>;
  count(): Promise<number>;
  exists(nomorInduk: string): Promise<boolean>;
  create(data: CreateIdentitasDTO): Promise<IdentitasDTO>;
  update(nomorInduk: string, data: UpdateIdentitasDTO): Promise<IdentitasDTO | null>;
  delete(nomorInduk: string): Promise<boolean>;
}
