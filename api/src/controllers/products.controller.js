import { ProductModel } from '../models/products.model.js';

// Listar
export const getProducts = async (req, res) => {
  try {
    const products = await ProductModel.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};

// Crear
export const createProduct = async (req, res) => {
  try {
    const { name, unitPrice } = req.body;
    if (!name || !unitPrice) return res.status(400).json({ message: 'Datos incompletos' });
    
    const id = await ProductModel.create({ name, unitPrice });
    res.status(201).json({ message: 'Producto creado', id });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear producto' });
  }
};

// Editar
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, unitPrice } = req.body;
   
    const product = await ProductModel.findById(id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    await ProductModel.update(id, { name, unitPrice });
    res.json({ message: 'Producto actualizado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar producto' });
  }
};

// Eliminar
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await ProductModel.delete(id);
    
    if (result === 0) return res.status(404).json({ message: 'Producto no encontrado' });
    
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({ message: 'No se puede eliminar este producto porque está asociado a una o más órdenes. El producto no puede ser eliminado mientras esté siendo utilizado en una orden existente.' });
    }
    res.status(500).json({ message: 'Error al eliminar producto' });
  }
};