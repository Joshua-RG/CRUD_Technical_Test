import { OrderModel } from '../models/orders.model.js';

// Listar todas las órdenes 
export const getOrders = async (req, res) => {
  try {
    const orders = await OrderModel.findAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener órdenes' });
  }
};

// Obtener una orden por ID 
export const getOrderById = async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Orden no encontrada' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar la orden' });
  }
};

// Crear nueva orden
export const createOrder = async (req, res) => {
  try {
    const { orderNumber, items } = req.body;

    // Debe haber número y al menos 1 producto
    if (!orderNumber || !items || items.length === 0) {
      return res.status(400).json({ message: 'Faltan datos requeridos o productos' });
    }

    const id = await OrderModel.create({ orderNumber, items });
    res.status(201).json({ message: 'Orden creada', id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Editar orden existente
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderNumber, items, status } = req.body;

    if (!orderNumber || !items?.length) {
      return res.status(400).json({ message: 'Datos inválidos' });
    }

    // Verificar existencia y estado actual
    const currentOrder = await OrderModel.findById(id);
    if (!currentOrder) return res.status(404).json({ message: 'Orden no encontrada' });

    // No editar si está completada 
    if (currentOrder.status === 'Completed') {
      return res.status(400).json({ message: 'No se puede editar una orden completada' });
    }

    await OrderModel.update(id, { orderNumber, items, status });
    res.json({ message: 'Orden actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar orden
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar estado antes de borrar 
    const currentOrder = await OrderModel.findById(id);
    if (!currentOrder) return res.status(404).json({ message: 'Orden no encontrada' });

    if (currentOrder.status === 'Completed') {
      return res.status(400).json({ message: 'No se puede eliminar una orden completada' });
    }

    await OrderModel.delete(id);
    res.json({ message: 'Orden eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar orden' });
  }
};