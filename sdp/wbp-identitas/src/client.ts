import type { RequestContext } from '@sdp/shared/context';
import type { IdentitasPort } from './port/identitas-port';
import type {
  IdentitasDTO,
  CreateIdentitasDTO,
  UpdateIdentitasDTO,
  IdentitasListResponse,
} from './types/identitas';

export interface ClientConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

interface RequestOptions extends RequestInit {
  timeout?: number;
}

/**
 * IdentitasHttpClient - HTTP client for Identitas microservice
 * 
 * Implements IdentitasPort for remote HTTP calls.
 * Use this when calling the microservice from other packages.
 * 
 * Context is passed explicitly and used to extract authorization headers, requestId, etc.
 * 
 * @example
 * import { IdentitasHttpClient } from '@sdp/wbp-identitas';
 * 
 * const client = new IdentitasHttpClient({
 *   baseUrl: process.env.IDENTITAS_SERVICE_URL || 'http://localhost:3001',
 * });
 * 
 * const identitas = await client.getById(context, '12345');
 */
export class IdentitasHttpClient implements IdentitasPort {
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
    
    // Pass user info via headers if available
    if (ctx.userId) {
      headers['x-user-id'] = ctx.userId;
    }
    if (ctx.userRoles.length > 0) {
      headers['x-user-roles'] = ctx.userRoles.join(',');
    }
    if (ctx.permissions.length > 0) {
      headers['x-user-permissions'] = ctx.permissions.join(',');
    }
    if (ctx.ip) {
      headers['x-forwarded-for'] = ctx.ip;
    }
    if (ctx.userAgent) {
      headers['user-agent'] = ctx.userAgent;
    }
    
    return headers;
  }

  async getById(ctx: RequestContext, nomorInduk: string): Promise<IdentitasDTO | null> {
    return this.request<IdentitasDTO | null>(
      ctx,
      `/api/identitas/${encodeURIComponent(nomorInduk)}`,
      { method: 'GET' }
    );
  }

  async getAll(ctx: RequestContext, limit: number = 10, offset: number = 0): Promise<IdentitasListResponse> {
    const params = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
    });
    
    return this.request<IdentitasListResponse>(
      ctx,
      `/api/identitas?${params}`,
      { method: 'GET' }
    );
  }

  async search(ctx: RequestContext, query: string, limit: number = 10): Promise<IdentitasDTO[]> {
    const params = new URLSearchParams({
      q: query,
      limit: String(limit),
    });
    
    const response = await this.request<{ data: IdentitasDTO[] }>(
      ctx,
      `/api/identitas/search?${params}`,
      { method: 'GET' }
    );
    
    return response?.data ?? [];
  }

  async exists(ctx: RequestContext, nomorInduk: string): Promise<boolean> {
    const response = await this.request<{ exists: boolean }>(
      ctx,
      `/api/identitas/${encodeURIComponent(nomorInduk)}/exists`,
      { method: 'GET' }
    );
    
    return response?.exists ?? false;
  }

  async count(ctx: RequestContext): Promise<number> {
    const response = await this.request<{ count: number }>(
      ctx,
      '/api/identitas/count',
      { method: 'GET' }
    );
    
    return response?.count ?? 0;
  }

  async create(ctx: RequestContext, data: CreateIdentitasDTO): Promise<IdentitasDTO> {
    return this.request<IdentitasDTO>(ctx, '/api/identitas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async update(ctx: RequestContext, nomorInduk: string, data: UpdateIdentitasDTO): Promise<IdentitasDTO | null> {
    return this.request<IdentitasDTO | null>(
      ctx,
      `/api/identitas/${encodeURIComponent(nomorInduk)}`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    );
  }

  async delete(ctx: RequestContext, nomorInduk: string): Promise<boolean> {
    try {
      await this.request<void>(ctx, `/api/identitas/${encodeURIComponent(nomorInduk)}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      return false;
    }
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

/**
 * Create an IdentitasHttpClient with configuration from environment
 */
export function createIdentitasClient(baseUrl?: string): IdentitasHttpClient {
  return new IdentitasHttpClient({
    baseUrl: baseUrl ?? process.env.IDENTITAS_SERVICE_URL ?? 'http://localhost:3001',
    timeout: parseInt(process.env.IDENTITAS_SERVICE_TIMEOUT ?? '30000', 10),
  });
}

// Alias for backward compatibility
export { IdentitasHttpClient as IdentitasClient };

export default IdentitasHttpClient;
