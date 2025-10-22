// Simple environment validation script for local/CI checks
// Usage: node ./scripts/validate-env.js

const required = [
  'TEST_ADMIN_USERNAME',
  'TEST_ADMIN_PASSWORD',
  'TEST_USER_DRUGS_USERNAME',
  'TEST_USER_DRUGS_PASSWORD',
  'TEST_USER_PATIENTS_USERNAME',
  'TEST_USER_PATIENTS_PASSWORD',
  'DB_USER',
  'DB_PASSWORD',
  'DB_SERVER',
  'DB_NAME'
];

// Load dotenv if present (local dev convenience)
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config();
} catch (e) {
  // dotenv is optional; script will still check process.env
}

const missing = required.filter((name) => {
  if (process.env[name]) return false;
  if (process.env[`${name}_B64`]) return false;
  return true;
});

if (missing.length === 0) {
  console.log('ENV VALIDATION: PASS — all required environment variables are set.');
  process.exit(0);
} else {
  console.error('ENV VALIDATION: FAIL — missing environment variables:');
  missing.forEach((m) => console.error(' - ' + m));
  console.error('\nSet them in your shell or CI secrets before running tests.');
  process.exit(2);
}
