import type { APIRequestContext, APIResponse } from '@playwright/test';

export class DrugsService {
  constructor(private apiContext: APIRequestContext, private baseUrl = 'http://localhost:3001/') {}

  async addDrug(drug: Record<string, any>, creds: { username: string; password: string }) {
    // Send JSON payload as string and set Content-Type header explicitly
    return this.apiContext.post(`${this.baseUrl}api/drugs`, {
      data: JSON.stringify({ ...drug, username: creds.username, password: creds.password }),
      headers: { 'content-type': 'application/json' },
    });
  }

  async getAllDrugs(creds: { username: string; password: string }) {
    const q = `?username=${encodeURIComponent(creds.username)}&password=${encodeURIComponent(creds.password)}`;
    return this.apiContext.get(`${this.baseUrl}api/drugs${q}`);
  }

  async deleteDrug(id: number | string, creds: { username: string; password: string }) {
    const q = `?username=${encodeURIComponent(creds.username)}&password=${encodeURIComponent(creds.password)}`;
    return this.apiContext.delete(`${this.baseUrl}api/drugs/${id}${q}`);
  }

  async jsonOrThrow(response: APIResponse) {
    if (!response.ok()) {
      const body = await response.text();
      throw new Error(`Request failed ${response.status()}: ${body}`);
    }
    return response.json();
  }
}
