import type { APIRequestContext, APIResponse } from '@playwright/test';

export class PatientsService {
  constructor(private apiContext: APIRequestContext, private baseUrl = 'http://localhost:3001/') {}

  async addPatient(patient: Record<string, any>, creds: { username: string; password: string }) {
    return this.apiContext.post(`${this.baseUrl}api/patients`, {
      data: JSON.stringify({ ...patient, username: creds.username, password: creds.password }),
      headers: { 'content-type': 'application/json' },
    });
  }

  async getAllPatients(creds: { username: string; password: string }) {
    const q = `?username=${encodeURIComponent(creds.username)}&password=${encodeURIComponent(creds.password)}`;
    return this.apiContext.get(`${this.baseUrl}api/patients${q}`);
  }

  async deletePatient(id: number | string, creds: { username: string; password: string }) {
    const q = `?username=${encodeURIComponent(creds.username)}&password=${encodeURIComponent(creds.password)}`;
    return this.apiContext.delete(`${this.baseUrl}api/patients/${id}${q}`);
  }

  async jsonOrThrow(response: APIResponse) {
    if (!response.ok()) {
      const body = await response.text();
      throw new Error(`Request failed ${response.status()}: ${body}`);
    }
    return response.json();
  }
}
