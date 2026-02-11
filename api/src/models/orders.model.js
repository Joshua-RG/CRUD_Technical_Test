import pool from '../config/db.js';

export const OrderModel = {

  // Crear una nueva orden con sus productos 
  async create(orderData) {
    const { orderNumber, items } = orderData; 
    const connection = await pool.getConnection(); 

    // Inicio de la transaccion
    try {
      await connection.beginTransaction(); 

      // Insertar la cabecera de la orden
      const [orderResult] = await connection.query(
        'INSERT INTO orders (order_number) VALUES (?)',
        [orderNumber]
      );
      const orderId = orderResult.insertId;

      // Insertar los productos de la orden
      for (const item of items) {
        await connection.query(
          'INSERT INTO order_items (order_id, product_id, quantity, unit_price_at_time) VALUES (?, ?, ?, ?)',
          [orderId, item.productId, item.quantity, item.price]
        );
      }

      await connection.commit(); 
      return orderId;

    } catch (error) {
      await connection.rollback(); 
      throw error;
    } finally {
      connection.release(); 
    }
  },

  // Actualizar una orden 
  async update(id, orderData) {
    const { orderNumber, status, items } = orderData;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Actualizar datos de cabecera 
      await connection.query(
        'UPDATE orders SET order_number = ?, status = ? WHERE id = ?',
        [orderNumber, status || 'Pending', id]
      );

      // Eliminar todos los items existentes de esta orden
      await connection.query('DELETE FROM order_items WHERE order_id = ?', [id]);

      // Insertar los items nuevos 
      for (const item of items) {
        await connection.query(
          'INSERT INTO order_items (order_id, product_id, quantity, unit_price_at_time) VALUES (?, ?, ?, ?)',
          [id, item.productId, item.quantity, item.price]
        );
      }

      await connection.commit();
      return true; 

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Listar órdenes con precios calculados 
  async findAll() {

    const sql = `
      SELECT 
        o.id, 
        o.order_number, 
        o.order_date, 
        o.status,
        COUNT(oi.id) as total_products,
        COALESCE(SUM(oi.quantity * oi.unit_price_at_time), 0) as final_price
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.order_date DESC
    `;
    const [rows] = await pool.query(sql);
    return rows;
  },
  
  // Obtener una orden específica 
  async findById(id) {
     const [orderRows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
     if (orderRows.length === 0) return null;

     const [itemRows] = await pool.query(`
        SELECT oi.*, p.name as product_name 
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
     `, [id]);

     return { ...orderRows[0], items: itemRows };
  },

  // Eliminar Orden 
  async delete(id) {
    const [result] = await pool.query('DELETE FROM orders WHERE id = ?', [id]);
    return result.affectedRows;
  }
};