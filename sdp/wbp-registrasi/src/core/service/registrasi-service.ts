import type { RequestContext } from '@sdp/shared/context';
import type { RegistrasiServicePort } from '../ports/registrasi-service-port';
import type {
  RegistrasiDTO,
  CreateRegistrasiDTO,
  UpdateRegistrasiDTO,
  RegistrasiListParams,
  RegistrasiListResponse,
} from '../types/registrasi';

/**
 * Interface for the repository dependency.
 * We define it here or import it to keep the service decoupled from the specific implementation.
 */
export interface RegistrasiRepositoryDependency {
  findAll(params?: RegistrasiListParams): Promise<{ data: RegistrasiDTO[]; total: number }>;
  findById(id: string): Promise<RegistrasiDTO | null>;
  create(data: CreateRegistrasiDTO): Promise<RegistrasiDTO>;
  update(id: string, data: UpdateRegistrasiDTO): Promise<RegistrasiDTO>;
  delete(id: string): Promise<void>;
}

/**
 * RegistrasiService - Business logic layer (Core)
 * 
 * Uses Dependency Injection for its repository.
 */
export class RegistrasiService implements RegistrasiServicePort {
  constructor(private readonly repo: RegistrasiRepositoryDependency) {}

  private log(ctx: RequestContext, message: string, meta?: Record<string, unknown>): void {
    console.log(JSON.stringify({
      message: `RegistrasiService:${message}`,
      requestId: ctx.requestId,
      userId: ctx.userId,
      ...meta,
    }));
  }

  async getRegistrasiList(ctx: RequestContext, params?: RegistrasiListParams): Promise<RegistrasiListResponse> {
    this.log(ctx, 'getRegistrasiList', { params });
    return this.repo.findAll(params);
  }

  async getRegistrasiById(ctx: RequestContext, id: string): Promise<RegistrasiDTO | null> {
    this.log(ctx, 'getRegistrasiById', { id });
    return this.repo.findById(id);
  }

  async createRegistrasi(ctx: RequestContext, data: CreateRegistrasiDTO): Promise<RegistrasiDTO> {
    this.log(ctx, 'createRegistrasi', { nomorInduk: data.nomorInduk });
    return this.repo.create(data);
  }

  async updateRegistrasi(ctx: RequestContext, id: string, data: UpdateRegistrasiDTO): Promise<RegistrasiDTO> {
    this.log(ctx, 'updateRegistrasi', { id });
    return this.repo.update(id, data);
  }

  async deleteRegistrasi(ctx: RequestContext, id: string): Promise<void> {
    this.log(ctx, 'deleteRegistrasi', { id });
    await this.repo.delete(id);
  }
}
