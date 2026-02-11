import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, deleteOrder } from '../services/apiClient';
import '../styles/pages.css';

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar órdenes: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/orders/edit/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      setOrders(orders.filter(order => order.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNew = () => {
    navigate('/orders/new');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(price);
  };

  const getStatusClass = (status) => {
    return `badge--${status.toLowerCase().replace(/\s+/g, '')}`;
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
        <h1 className="page-header__title">Mis Órdenes</h1>
        <button className="btn btn--primary" onClick={handleAddNew}>
          ➕ Nueva Orden
        </button>
      </div>

      {error && (
        <div className="toast toast--error" style={{ position: 'static', margin: '0 0 16px 0' }}>
          {error}
        </div>
      )}

      <div className="table-wrapper">
        {orders.length === 0 ? (
          <div className="table__empty">No hay órdenes registradas</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Número de Orden</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Cantidad de Productos</th>
                <th>Precio Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="table__id">{order.id}</td>
                  <td className="table__number">{order.order_number}</td>
                  <td>{formatDate(order.order_date)}</td>
                  <td>
                    <span className={`badge ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{order.total_products}</td>
                  <td className="table__price">{formatPrice(order.final_price)}</td>
                  <td className="table__actions">
                    <button
                      className="btn btn--sm btn--ghost"
                      onClick={() => handleEdit(order.id)}
                      title="Editar orden"
                      disabled={order.status === 'Completed'}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn--sm btn--danger"
                      onClick={() => setDeleteConfirm(order.id)}
                      disabled={order.status === 'Completed'}
                      title={order.status === 'Completed' ? 'No se pueden eliminar órdenes completadas' : 'Eliminar orden'}
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

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal__title">Confirmar eliminación</h3>
            <p className="modal__subtitle">
              ¿Está seguro que desea eliminar esta orden? Esta acción no se puede deshacer.
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

export default MyOrders;
