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
 * @example
 * import { IdentitasHttpClient } from '@sdp/wbp-identitas';
 * 
 * const client = new IdentitasHttpClient({
 *   baseUrl: process.env.IDENTITAS_SERVICE_URL || 'http://localhost:3001',
 * });
 * 
 * const identitas = await client.getById('12345');
 */
export class IdentitasHttpClient implements IdentitasPort {
  private baseUrl: string;
  private timeout: number;
  private headers: Record<string, string>;

  constructor(config: ClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.timeout = config.timeout ?? 30000;
    this.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  async getById(nomorInduk: string): Promise<IdentitasDTO | null> {
    return this.request<IdentitasDTO | null>(
      `/api/identitas/${encodeURIComponent(nomorInduk)}`,
      { method: 'GET' }
    );
  }

  async getAll(limit: number = 10, offset: number = 0): Promise<IdentitasListResponse> {
    const params = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
    });
    
    return this.request<IdentitasListResponse>(
      `/api/identitas?${params}`,
      { method: 'GET' }
    );
  }

  async search(query: string, limit: number = 10): Promise<IdentitasDTO[]> {
    const params = new URLSearchParams({
      q: query,
      limit: String(limit),
    });
    
    const response = await this.request<{ data: IdentitasDTO[] }>(
      `/api/identitas/search?${params}`,
      { method: 'GET' }
    );
    
    return response?.data ?? [];
  }

  async exists(nomorInduk: string): Promise<boolean> {
    const response = await this.request<{ exists: boolean }>(
      `/api/identitas/${encodeURIComponent(nomorInduk)}/exists`,
      { method: 'GET' }
    );
    
    return response?.exists ?? false;
  }

  async count(): Promise<number> {
    const response = await this.request<{ count: number }>(
      '/api/identitas/count',
      { method: 'GET' }
    );
    
    return response?.count ?? 0;
  }

  async create(data: CreateIdentitasDTO): Promise<IdentitasDTO> {
    return this.request<IdentitasDTO>('/api/identitas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async update(nomorInduk: string, data: UpdateIdentitasDTO): Promise<IdentitasDTO | null> {
    return this.request<IdentitasDTO | null>(
      `/api/identitas/${encodeURIComponent(nomorInduk)}`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    );
  }

  async delete(nomorInduk: string): Promise<boolean> {
    try {
      await this.request<void>(`/api/identitas/${encodeURIComponent(nomorInduk)}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  private async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout ?? this.timeout);
    
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        ...options,
        signal: controller.signal,
        headers: {
          ...this.headers,
          ...options.headers,
        },
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
