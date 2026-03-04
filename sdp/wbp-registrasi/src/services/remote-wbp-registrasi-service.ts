import { RequestContext } from '@sdp/shared';
import {
  RegistrasiDTO,
  CreateRegistrasiDTO,
  UpdateRegistrasiDTO,
  RegistrasiListParams,
  RegistrasiListResponse,
} from '../contracts/types';
import { WbpRegistrasiService } from '@/contracts/wbp-registrasi-service';

export interface ClientConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

interface RequestOptions extends RequestInit {
  timeout?: number;
}

export class RemoteWbpRegistrasiService implements WbpRegistrasiService {
  private baseUrl: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor(config: ClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.timeout = config.timeout ?? 30000;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  private buildHeaders(ctx: RequestContext, extraHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      'x-request-id': ctx.requestId,
      ...extraHeaders,
    };
    
    if (ctx.userId) headers['x-user-id'] = ctx.userId;
    if (ctx.userRoles.length > 0) headers['x-user-roles'] = ctx.userRoles.join(',');
    if (ctx.permissions.length > 0) headers['x-user-permissions'] = ctx.permissions.join(',');
    if (ctx.ip) headers['x-forwarded-for'] = ctx.ip;
    if (ctx.userAgent) headers['user-agent'] = ctx.userAgent;
    
    return headers;
  }

  async getRegistrasiList(ctx: RequestContext, params?: RegistrasiListParams): Promise<RegistrasiListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.nomorInduk) queryParams.append('nomorInduk', params.nomorInduk);
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.offset) queryParams.append('offset', String(params.offset));

    const path = `/api/registrasi${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    return this.request<RegistrasiListResponse>(ctx, path, { method: 'GET' });
  }

  async getRegistrasiById(ctx: RequestContext, id: string): Promise<RegistrasiDTO | null> {
    return this.request<RegistrasiDTO | null>(
      ctx,
      `/api/registrasi/${encodeURIComponent(id)}`,
      { method: 'GET' }
    );
  }

  async createRegistrasi(ctx: RequestContext, data: CreateRegistrasiDTO): Promise<RegistrasiDTO> {
    return this.request<RegistrasiDTO>(ctx, '/api/registrasi', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRegistrasi(ctx: RequestContext, id: string, data: UpdateRegistrasiDTO): Promise<RegistrasiDTO> {
    return this.request<RegistrasiDTO>(
      ctx,
      `/api/registrasi/${encodeURIComponent(id)}`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    );
  }

  async deleteRegistrasi(ctx: RequestContext, id: string): Promise<void> {
    await this.request<void>(ctx, `/api/registrasi/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }

  private async request<T>(ctx: RequestContext, path: string, options: RequestOptions = {}): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout ?? this.timeout);
    
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        ...options,
        signal: controller.signal,
        headers: this.buildHeaders(ctx, options.headers as Record<string, string> | undefined),
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return null as T;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      if (response.status === 204) {
        return null as T;
      }
      
      const text = await response.text();
      if (!text) {
        return null as T;
      }
      return JSON.parse(text) as T;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

export function createRegistrasiClient(config: ClientConfig) {
  return new RemoteWbpRegistrasiService(config);
}
