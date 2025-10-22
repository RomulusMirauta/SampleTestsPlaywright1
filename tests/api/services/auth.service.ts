import type { APIRequestContext, APIResponse } from '@playwright/test';

export class AuthService {
  constructor(private apiContext: APIRequestContext, private baseUrl = 'http://localhost:3001/') {}

  async login(username: string, password: string) {
    return this.apiContext.post(`${this.baseUrl}api/login`, {
      data: JSON.stringify({ username, password }),
      headers: { 'content-type': 'application/json' },
    });
  }

  async jsonOrThrow(response: APIResponse) {
    if (!response.ok()) {
      const body = await response.text();
      throw new Error(`Request failed ${response.status()}: ${body}`);
    }
    return response.json();
  }
}
