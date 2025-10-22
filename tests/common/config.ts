// Common config (e.g., base URLs, test user credentials)
export const BASE_URL = process.env.BASE_URL || 'http://localhost:3001/';

export const DB_CONFIG = {
	user: process.env.DB_USER || 'sa',
	password: process.env.DB_PASSWORD || 'sa57843hFL^%*#',
	server: process.env.DB_SERVER || 'localhost',
	database: process.env.DB_NAME || 'HealthcareDB',
	options: {
		trustServerCertificate: true,
	},
};

export const DEFAULT_WORKERS = parseInt(process.env.PW_WORKERS || '4', 10);
