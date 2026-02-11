import express from 'express';
import cors from 'cors';
import productRoutes from './routes/products.route.js';
import orderRoutes from './routes/orders.route.js';

const app = express();

// Middlewares 
app.use(cors()); 
app.use(express.json()); 

// Rutas

// Rutas para productos
app.use('/api/products', productRoutes);

// Rutas para órdenes
app.use('/api/orders', orderRoutes);

// Ruta de prueba para verificar que el servidor está vivo
app.get('/ping', (req, res) => res.send('pong'));

// Manejo de Errores 
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor', error: err.message });
});

export default app;