import { authStore } from '@/stores/AuthStore';

class HttpClient {
  private isRefreshing = false;
  private pendingRequests: Array<() => void> = [];

  async request(url: string, options: RequestInit = {}): Promise<Response> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (authStore.accessToken) {
      headers.Authorization = `Bearer ${authStore.accessToken}`;
    }

    const requestOptions: RequestInit = {
      ...options,
      headers,
      credentials: 'include',
    };

    let response = await fetch(url, requestOptions);

    if (response.status === 401 && authStore.isAuthenticated) {
      const refreshSuccess = await this.handleTokenRefresh();

      if (refreshSuccess) {
        const newHeaders = {
          ...headers,
          Authorization: `Bearer ${authStore.accessToken}`,
        };

        response = await fetch(url, {
          ...requestOptions,
          headers: newHeaders,
        });
      }
    }

    return response;
  }

  private async handleTokenRefresh(): Promise<boolean> {
    if (this.isRefreshing) {
      return new Promise(resolve => {
        this.pendingRequests.push(() => resolve(authStore.isAuthenticated));
      });
    }

    this.isRefreshing = true;

    try {
      const success = await authStore.refreshToken();

      this.pendingRequests.forEach(callback => callback());
      this.pendingRequests = [];

      return success;
    } finally {
      this.isRefreshing = false;
    }
  }

  async get(url: string, options?: RequestInit): Promise<Response> {
    return this.request(url, { ...options, method: 'GET' });
  }

  async post(url: string, body?: any, options?: RequestInit): Promise<Response> {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put(url: string, body?: any, options?: RequestInit): Promise<Response> {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete(url: string, options?: RequestInit): Promise<Response> {
    return this.request(url, { ...options, method: 'DELETE' });
  }
}

export const httpClient = new HttpClient();
