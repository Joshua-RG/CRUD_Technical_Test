import app from './app.js';
import pool from './config/db.js';

const PORT = process.env.PORT || 3000;

const main = async () => {
  try {
    // Verifica conexión antes de levantar
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