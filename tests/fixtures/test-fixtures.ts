import { test as base, Browser, BrowserContext, Page, APIRequestContext, request } from '@playwright/test';
// Load local .env for developer convenience if present and not running in CI
if (!process.env.CI) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('dotenv').config();
  } catch (e) {
    // dotenv is optional; ignore if not installed
  }
}
import { LoginPage, PatientsPage, DrugsPage } from '../page-objects/';
import { BASE_URL } from '../common/config';

type TestFixtures = {
  loginPage: LoginPage;
  patientsPage: PatientsPage;
  drugsPage: DrugsPage;
  apiContext: APIRequestContext;
};

export const test = base.extend<TestFixtures>({
  apiContext: async ({}, use: (ctx: APIRequestContext) => Promise<void>) => {
    const ctx = await request.newContext();
    await use(ctx);
    await ctx.dispose();
  },

  loginPage: async ({ page }: { page: Page }, use: (lp: LoginPage) => Promise<void>) => {
    await page.goto(BASE_URL);
    await use(new LoginPage(page));
  },

  patientsPage: async ({ page }: { page: Page }, use: (pp: PatientsPage) => Promise<void>) => {
    await use(new PatientsPage(page));
  },

  drugsPage: async ({ page }: { page: Page }, use: (dp: DrugsPage) => Promise<void>) => {
    await use(new DrugsPage(page));
  },
});

export const expect = test.expect;
