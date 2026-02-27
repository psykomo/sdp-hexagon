import type { RequestContext } from '@sdp/shared/context';
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
 * 
 * Context is passed explicitly to each method for authorization and logging.
 */
export interface IdentitasPort {
  getById(ctx: RequestContext, nomorInduk: string): Promise<IdentitasDTO | null>;
  getAll(ctx: RequestContext, limit?: number, offset?: number): Promise<IdentitasListResponse>;
  search(ctx: RequestContext, query: string, limit?: number): Promise<IdentitasDTO[]>;
  count(ctx: RequestContext): Promise<number>;
  exists(ctx: RequestContext, nomorInduk: string): Promise<boolean>;
  create(ctx: RequestContext, data: CreateIdentitasDTO): Promise<IdentitasDTO>;
  update(ctx: RequestContext, nomorInduk: string, data: UpdateIdentitasDTO): Promise<IdentitasDTO | null>;
  delete(ctx: RequestContext, nomorInduk: string): Promise<boolean>;
}
