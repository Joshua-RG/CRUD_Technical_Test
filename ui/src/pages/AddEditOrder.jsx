import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProducts, getOrderById, createOrder, updateOrder } from '../services/apiClient';
import '../styles/pages.css';

const AddEditOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [orderNumber, setOrderNumber] = useState('');
  const [status, setStatus] = useState('Pending');
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Modal states
  const [productModal, setProductModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('1');
  const [removeConfirm, setRemoveConfirm] = useState(null);

  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  // Función para generar número de orden automático
  const generateOrderNumber = useCallback(() => {
    const currentYear = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 9000) + 1000; // Número aleatorio entre 1000-9999
    return `ORD-${currentYear}-${randomNum}`;
  }, []);

  const totalProducts = items.length;
  const finalPrice = items.reduce((sum, item) => sum + parseFloat(item.price) * parseInt(item.quantity), 0);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const prods = await getProducts();
      setProducts(prods);

      if (isEdit) {
        const order = await getOrderById(id);
        setOrderNumber(order.order_number);
        setStatus(order.status);
        setItems(
          (order.items || []).map((item) => ({
            productId: item.product_id,
            product_name: item.product_name,
            quantity: item.quantity.toString(),
            price: item.unit_price_at_time,
          }))
        );
      } else {
        // Si es una nueva orden, generar automáticamente el número
        setOrderNumber(generateOrderNumber());
      }
    } catch (err) {
      setError('Error al cargar datos: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, isEdit, generateOrderNumber]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddProduct = () => {
    if (!selectedProduct || !quantity || parseInt(quantity) <= 0) {
      alert('Selecciona un producto y una cantidad válida');
      return;
    }

    const product = products.find((p) => p.id === parseInt(selectedProduct));
    if (!product) return;

    const newItem = {
      productId: product.id,
      product_name: product.name,
      quantity: quantity,
      price: product.unit_price,
    };

    if (editingIndex !== null) {
      const updated = [...items];
      updated[editingIndex] = newItem;
      setItems(updated);
      setEditingIndex(null);
    } else {
      const existingIdx = items.findIndex((i) => i.productId === product.id);
      if (existingIdx >= 0) {
        const updated = [...items];
        updated[existingIdx].quantity = (
          parseInt(updated[existingIdx].quantity) + parseInt(quantity)
        ).toString();
        setItems(updated);
      } else {
        setItems([...items, newItem]);
      }
    }

    setProductModal(false);
    setSelectedProduct(null);
    setQuantity('1');
  };

  const handleEditProduct = (index) => {
    const item = items[index];
    setSelectedProduct(item.productId.toString());
    setQuantity(item.quantity);
    setEditingIndex(index);
    setProductModal(true);
  };

  const handleRemoveProduct = () => {
    if (removeConfirm !== null) {
      setItems(items.filter((_, i) => i !== removeConfirm));
      setRemoveConfirm(null);
    }
  };

  const handleSave = async () => {
    if (items.length === 0) {
      setError('Agrega al menos un producto');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        orderNumber: orderNumber,
        status: status,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price),
        })),
      };

      if (isEdit) {
        await updateOrder(id, payload);
      } else {
        await createOrder(payload);
      }

      setTimeout(() => navigate('/'), 500);
    } catch (err) {
      setError('Error al guardar: ' + err.message);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="app-main">
        <div className="loader">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-main">
      <div className="page-header">
        <h1 className="page-header__title">
          {isEdit ? '✏️ Editar Orden' : '➕ Nueva Orden'}
        </h1>
        <button className="btn btn--secondary" onClick={() => navigate('/')}>
          ← Volver
        </button>
      </div>

      {error && (
        <div className="toast toast--error" style={{ position: 'static', margin: '0 0 16px 0' }}>
          {error}
        </div>
      )}

      {/* Order Form */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Número de Orden</label>
            <input
              className="form-input"
              type="text"
              value={orderNumber}
              disabled
            />
          </div>
          <div className="form-group">
            <label className="form-label">Fecha</label>
            <input className="form-input" type="text" value={currentDate} disabled />
          </div>
          <div className="form-group">
            <label className="form-label">Cantidad de Productos</label>
            <input className="form-input" type="number" value={totalProducts} disabled />
          </div>
          <div className="form-group">
            <label className="form-label">Precio Total</label>
            <input className="form-input" type="text" value={formatPrice(finalPrice)} disabled />
          </div>
          {isEdit && (
            <div className="form-group">
              <label className="form-label">Estado</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={status === 'Completed'}
              >
                <option value="Pending">Pending</option>
                <option value="InProgress">InProgress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div className="card">
        <div className="card__header">
          <h2 className="card__title">Productos</h2>
          <button
            className="btn btn--primary btn--sm"
            onClick={() => {
              setEditingIndex(null);
              setSelectedProduct(null);
              setQuantity('1');
              setProductModal(true);
            }}
            disabled={isEdit && status === 'Completed'}
          >
            ➕ Agregar Producto
          </button>
        </div>

        {items.length === 0 ? (
          <div className="table__empty" style={{ padding: '32px 16px' }}>
            No hay productos agregados
          </div>
        ) : (
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Precio Unitario</th>
                  <th>Cantidad</th>
                  <th>Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={`${item.productId}-${idx}`}>
                    <td className="table__id">{item.productId}</td>
                    <td className="table__number">{item.product_name}</td>
                    <td className="table__price">{formatPrice(item.price)}</td>
                    <td>{item.quantity}</td>
                    <td className="table__price">
                      {formatPrice(parseFloat(item.price) * parseInt(item.quantity))}
                    </td>
                    <td className="table__actions">
                      <button
                        className="btn btn--sm btn--ghost"
                        onClick={() => handleEditProduct(idx)}
                        disabled={isEdit && status === 'Completed'}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn--sm btn--danger"
                        onClick={() => setRemoveConfirm(idx)}
                        disabled={isEdit && status === 'Completed'}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button className="btn btn--secondary" onClick={() => navigate('/')}>
          Cancelar
        </button>
        <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear Orden'}
        </button>
      </div>

      {/* Product Modal */}
      {productModal && (
        <div className="modal-overlay" onClick={() => setProductModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal__title">
              {editingIndex !== null ? 'Editar Producto' : 'Agregar Producto'}
            </h3>
            <div className="form-group" style={{ marginTop: '16px' }}>
              <label className="form-label">Producto *</label>
              <select
                className="form-select"
                value={selectedProduct || ''}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option value="">Selecciona un producto</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {formatPrice(product.unit_price)}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Cantidad *</label>
              <input
                className="form-input"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => {
                  setProductModal(false);
                  setEditingIndex(null);
                }}
              >
                Cancelar
              </button>
              <button className="btn btn--primary" onClick={handleAddProduct}>
                {editingIndex !== null ? 'Actualizar' : 'Agregar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Confirm */}
      {removeConfirm !== null && (
        <div className="modal-overlay" onClick={() => setRemoveConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal__title">Confirmar eliminación</h3>
            <p className="modal__subtitle">
              ¿Deseas eliminar "{items[removeConfirm]?.product_name}" de esta orden?
            </p>
            <div className="modal__actions">
              <button className="btn btn--secondary" onClick={() => setRemoveConfirm(null)}>
                Cancelar
              </button>
              <button className="btn btn--danger" onClick={handleRemoveProduct}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddEditOrder;
