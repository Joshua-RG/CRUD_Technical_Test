import pool from '../config/db.js';

export const ProductModel = {
  
  // Listar Productos
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY name ASC');
    return rows;
  },

  // Crear Producto
  async create({ name, unitPrice }) {
    const [result] = await pool.query(
      'INSERT INTO products (name, unit_price) VALUES (?, ?)',
      [name, unitPrice]
    );
    return result.insertId;
  },

  // Buscar por ID 
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0];
  },

  // Editar Producto
  async update(id, { name, unitPrice }) {
    await pool.query(
      'UPDATE products SET name = ?, unit_price = ? WHERE id = ?',
      [name, unitPrice, id]
    );
    return true;
  },

  // Eliminar Producto
  async delete(id) {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows;
  }
};