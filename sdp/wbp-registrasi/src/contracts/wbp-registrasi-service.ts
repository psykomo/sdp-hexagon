import { RequestContext } from '@sdp/shared';
import {
  RegistrasiDTO,
  CreateRegistrasiDTO,
  UpdateRegistrasiDTO,
  RegistrasiListParams,
  RegistrasiListResponse,
} from './types';

/**
 * Primary (Driving) Port: Defines how the outside world (API, CLI, tests)
 * interacts with the core business logic.
 */
export interface WbpRegistrasiService {
  getRegistrasiList(ctx: RequestContext, params?: RegistrasiListParams): Promise<RegistrasiListResponse>;
  getRegistrasiById(ctx: RequestContext, id: string): Promise<RegistrasiDTO | null>;
  createRegistrasi(ctx: RequestContext, data: CreateRegistrasiDTO): Promise<RegistrasiDTO>;
  updateRegistrasi(ctx: RequestContext, id: string, data: UpdateRegistrasiDTO): Promise<RegistrasiDTO>;
  deleteRegistrasi(ctx: RequestContext, id: string): Promise<void>;
}


