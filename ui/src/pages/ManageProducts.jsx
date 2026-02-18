import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/apiClient';
import '../styles/pages.css';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', unitPrice: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar productos: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingId(product.id);
      setFormData({ name: product.name, unitPrice: product.unit_price });
    } else {
      setEditingId(null);
      setFormData({ name: '', unitPrice: '' });
    }
    setModal(true);
  };

  const handleCloseModal = () => {
    setModal(false);
    setEditingId(null);
    setFormData({ name: '', unitPrice: '' });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('El nombre del producto es requerido');
      return;
    }
    if (!formData.unitPrice || parseFloat(formData.unitPrice) <= 0) {
      setError('El precio debe ser mayor a 0');
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        unitPrice: parseFloat(formData.unitPrice),
      };

      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }

      await fetchProducts();
      handleCloseModal();
      setError(null);
    } catch (err) {
      const errorMessage = err.message || 'Error desconocido';
      // Detectar si es el error de producto asociado a orden
      if (errorMessage.includes('asociado') || errorMessage.includes('siendo utilizado')) {
        setError(errorMessage);
      } else if (editingId) {
        setError('Error al actualizar producto: ' + errorMessage);
      } else {
        setError('Error al guardar producto: ' + errorMessage);
      }
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter((product) => product.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      const errorMessage = err.message || 'Error desconocido';
      // Detectar si es el error de producto asociado a orden
      if (errorMessage.includes('asociado') || errorMessage.includes('siendo utilizado')) {
        setError(errorMessage);
      } else {
        setError('Error al eliminar producto: ' + errorMessage);
      }
      console.error(err);
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
        <h1 className="page-header__title">Gestión de Productos</h1>
        <button className="btn btn--primary" onClick={() => handleOpenModal()}>
          ➕ Nuevo Producto
        </button>
      </div>

      {error && (
        <div className="toast toast--error" style={{ position: 'static', margin: '0 0 16px 0' }}>
          {error}
        </div>
      )}

      <div className="table-wrapper">
        {products.length === 0 ? (
          <div className="table__empty">No hay productos registrados</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio Unitario</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="table__id">{product.id}</td>
                  <td className="table__number">{product.name}</td>
                  <td className="table__price">{formatPrice(product.unit_price)}</td>
                  <td className="table__actions">
                    <button
                      className="btn btn--sm btn--ghost"
                      onClick={() => handleOpenModal(product)}
                      title="Editar producto"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn--sm btn--danger"
                      onClick={() => setDeleteConfirm(product.id)}
                      title="Eliminar producto"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal__title">
              {editingId ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
            </h3>
            <div className="form-group" style={{ marginTop: '16px' }}>
              <label className="form-label">Nombre del Producto *</label>
              <input
                className="form-input"
                type="text"
                placeholder="ej: Laptop Pro"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Precio Unitario (S/.) *</label>
              <input
                className="form-input"
                type="number"
                step="0.01"
                min="0"
                placeholder="ej: 1500.00"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
              />
            </div>
            <div className="modal__actions">
              <button className="btn btn--secondary" onClick={handleCloseModal}>
                Cancelar
              </button>
              <button className="btn btn--primary" onClick={handleSave}>
                {editingId ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm !== null && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal__title">Confirmar eliminación</h3>
            <p className="modal__subtitle">
              ¿Está seguro que desea eliminar este producto? Esta acción no se puede deshacer.
            </p>
            <div className="modal__actions">
              <button className="btn btn--secondary" onClick={() => setDeleteConfirm(null)}>
                Cancelar
              </button>
              <button
                className="btn btn--danger"
                onClick={() => handleDelete(deleteConfirm)}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
