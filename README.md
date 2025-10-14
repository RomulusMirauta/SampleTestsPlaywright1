# Proximo1 Playwright + SQL Test Automation

## Prerequisites

- Node.js (v16+ recommended)
- npm
- A running SQL database (e.g., MySQL)

## Setup

1. Install dependencies:

   ```sh
   npm install
   ```

2. Configure your database connection in `tests/db-utils.ts`.

## Running Tests

- Run all tests:

  ```sh
  npx playwright test
  ```

- Run a specific test:

  ```sh
  npx playwright test tests/example.spec.ts
  ```

## Notes

- Use `tests/db-utils.ts` to query your SQL database in tests.
- Add more `.spec.ts` files in the `tests/` folder for additional test cases.
