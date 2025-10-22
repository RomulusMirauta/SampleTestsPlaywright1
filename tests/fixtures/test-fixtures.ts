import { test as base, Browser, BrowserContext, Page, APIRequestContext, request } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { PatientsPage } from '../page-objects/PatientsPage';
import { DrugsPage } from '../page-objects/DrugsPage';
import { BASE_URL } from '../common/config';

type TestFixtures = {
  loginPage: LoginPage;
  patientsPage: PatientsPage;
  drugsPage: DrugsPage;
  apiContext: APIRequestContext;
};

export const test = base.extend<TestFixtures>({
  apiContext: async ({}, use) => {
    const ctx = await request.newContext();
    await use(ctx);
    await ctx.dispose();
  },

  loginPage: async ({ page }, use) => {
    await page.goto(BASE_URL);
    await use(new LoginPage(page));
  },

  patientsPage: async ({ page }, use) => {
    await use(new PatientsPage(page));
  },

  drugsPage: async ({ page }, use) => {
    await use(new DrugsPage(page));
  },
});

export const expect = test.expect;
