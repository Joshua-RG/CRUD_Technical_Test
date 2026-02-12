import { createPool } from 'mysql2/promise'; 
import dotenv from 'dotenv';

dotenv.config();

const pool = createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'adminadmin',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'fractal_test',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
});

// Verificación de conexión
pool.getConnection()
  .then(connection => {
    console.log('Base de datos conectada');
    connection.release();
  })
  .catch(error => {
    console.error('Error conectando a la base de datos:', error);
  });

export default pool;