import app from './app.js';
import pool from './config/db.js';
import cors from 'cors';

const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:3001',
  process.env.FRONTEND_URL 
];

app.use(cors({
  origin: function (origin, callback) {
  
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(null, true); 
      // var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      // return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

const main = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión a Base de Datos establecida');
    connection.release();

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar la aplicación:', error);
  }
};

main();