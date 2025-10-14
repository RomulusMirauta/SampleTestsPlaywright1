<h1 align="center">
Sample Test Automation<br>Playwright + JavaScript/TypeScript + SQL
</h1>


<p align="center">
A sample healthcare test automation project using Playwright for End-to-End, API and multi-browser Compatibility testing, with SQL Server integration.<br>This project demonstrates automated UI and API tests for a healthcare platform with user authentication, role-based access, and management of patients and drugs.
</p>

<br>

<h2 align="left">
Table of Contents
</h2>

- [Project Overview](#project-overview)
- [Main Features](#main-features)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Running Tests](#running-tests)
- [Notes](#notes)
- [CI Integration](#ci-integration)
- [Technologies Used](#technologies-used)
- [About](#about)
- [Screenshots](#screenshots)
  - [Playwright in Visual Studio Code](#playwright-in-visual-studio-code)
  - [Playwright HTML Report](#playwright-html-report)
  - [GitHub Actions - CI Integration - Workflow Example](#github-actions---ci-integration---workflow-example)

<br>

## Project Overview

This repository contains Playwright-based test automation for a sample healthcare platform. The platform includes:

- User authentication (login/logout)
- Role-based dashboards (admin, patients, drugs)
- Patients and drugs management (CRUD)
- Modern, responsive UI
- REST API endpoints for all main entities

The tests cover both UI and API functionality, and include database validation using direct SQL queries.

The Test Object is available here: [SampleTestObject1](https://github.com/RomulusMirauta/SampleTestObject1).

## Main Features

- **End-to-End Testing:** Automated UI tests for login, dashboard, patients, and drugs pages, simulating real user interactions.
- **API Testing:** Automated tests for all main API endpoints (patients, drugs) to ensure backend reliability.
- **Compatibility Testing:** Tests can be run across multiple browsers and browser engines (Chromium, Firefox, WebKit) for maximum compatibility. Playwright supports running the same tests on different browsers to ensure cross-browser reliability.
- **Database Validation:** Direct SQL Server queries to validate data integrity after UI/API actions.
- **Role-Based Access Checks:** Ensures users only see and interact with features allowed by their role.
- **Parallel Execution:** Playwright can run tests in parallel using multiple workers, significantly speeding up test execution. The number of workers can be configured in `playwright.config.ts` (e.g., `workers: 4`).
- **Modern Test Structure:** Uses Playwright fixtures and page objects for maintainable, scalable tests.
- **CI Integration:** Automated test runs with GitHub Actions.


## Prerequisites

- Node.js (v16+ recommended)
- npm
- Microsoft SQL Server (or compatible)


## Setup

1. Install dependencies:

   ```sh
   npm install
   ```

2. Configure your database connection in `tests/db-utils.ts` (update user, password, server, and database as needed).

<br>

## Running Tests

- Run all tests:

  ```sh
  npx playwright test
  ```

- Run a specific test:

  ```sh
  npx playwright test tests/end-to-end/e2e-drugs.spec.ts
  ```

<br>

## Notes

- Use `tests/db-utils.ts` to query your SQL database in tests.
- Add more `.spec.ts` files in the `tests/` folder for additional test cases.
- Test data and credentials are for demonstration only. Do not use in production!

<br>

## CI Integration

This project includes GitHub Actions integration for automated test runs. See the `.github/workflows/playwright.yml` file for details.

<br>

## Technologies Used

- Playwright (test runner)
- Node.js
- TypeScript
- Microsoft SQL Server

<br>

## About

This project was developed as a sample for healthcare platform test automation and as a test object for Playwright E2E and API testing. Inspired by full-stack healthcare platform projects and built with the help of GitHub Copilot.

## Screenshots

### Playwright in Visual Studio Code

![Azure](screenshots/Playwright-VS-Code.png)

### Playwright HTML Report

![Azure](screenshots/Playwright-HTML-Report.png)

### GitHub Actions - CI Integration - Workflow Example

![Azure](screenshots/GitHub-Actions.png)
