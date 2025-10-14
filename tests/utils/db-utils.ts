import sql from 'mssql';

const config = {
  user: 'your_user', // update as needed
  password: 'your_password', // update as needed
  server: 'localhost', // update as needed
  database: 'your_database', // update as needed
  options: {
    encrypt: false, // set to true for Azure
    trustServerCertificate: true, // change to false for production
  },
};

export async function queryDatabase(query: string, params: any[] = []) {
  let pool;
  try {
    pool = await sql.connect(config);
    const request = pool.request();
    // Add parameters if provided
    params.forEach((param, idx) => {
      request.input(`param${idx + 1}`, param);
    });
    const result = await request.query(query);
    return result.recordset;
  } finally {
    if (pool) await pool.close();
  }
}
