import {
  RegistrasiDTO,
  CreateRegistrasiDTO,
  UpdateRegistrasiDTO,
  RegistrasiListParams,
} from './types';

/**
 * Secondary (Driven) Port: Defines how the core business logic
 * interacts with the persistence layer (Database).
 */
export interface WbpRegistrasiRepository {
  findAll(params?: RegistrasiListParams): Promise<{ data: RegistrasiDTO[]; total: number }>;
  findById(id: string): Promise<RegistrasiDTO | null>;
  create(data: CreateRegistrasiDTO): Promise<RegistrasiDTO>;
  update(id: string, data: UpdateRegistrasiDTO): Promise<RegistrasiDTO>;
  delete(id: string): Promise<void>;
}