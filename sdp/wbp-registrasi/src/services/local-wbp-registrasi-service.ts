import type { RequestContext } from '@sdp/shared/context';
import type {
  RegistrasiDTO,
  CreateRegistrasiDTO,
  UpdateRegistrasiDTO,
  RegistrasiListParams,
  RegistrasiListResponse,
} from '../contracts/types';
import { WbpRegistrasiService } from '@/contracts/wbp-registrasi-service';
import { WbpRegistrasiRepository } from '@/contracts/wbp-registrasi-repository';

/**
 * RegistrasiService - Business logic layer (Core)
 * 
 * Uses Dependency Injection for its repository through a secondary Port.
 */
export class LocalWbpRegistrasiService implements WbpRegistrasiService {
  constructor(private readonly repo: WbpRegistrasiRepository) {}

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
