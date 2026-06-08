import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/Orders.css";

const API_URL = "http://localhost:4000/api/orders";
const USERS_URL = "http://localhost:4000/api/users";
const VINYLS_URL = "http://localhost:4000/api/vinyls";

const initialForm = {
  userId: "",
  vinylId: "",
  quantity: "",
  shippingAddress: "",
  status: "pending",
};

const statusOptions = [
  { value: "pending", label: "Pendiente" },
  { value: "processing", label: "En proceso" },
  { value: "shipped", label: "Enviado" },
  { value: "delivered", label: "Entregado" },
  { value: "cancelled", label: "Cancelado" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [vinyls, setVinyls] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [modalMode, setModalMode] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  const isAddMode = modalMode === "add";
  const isEditMode = modalMode === "edit";

  const showSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Correcto",
      text: message,
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#8c9cff",
      background: "#ffffff",
      color: "#111111",
    });
  };

  const showError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: message,
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#ef5da8",
      background: "#ffffff",
      color: "#111111",
    });
  };

  const getOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al cargar órdenes");
      }

      setOrders(data);
    } catch (error) {
      console.log("Error al cargar órdenes:", error);
      setError("No se pudieron cargar las órdenes");
    } finally {
      setLoading(false);
    }
  };

  const getUsers = async () => {
    try {
      const response = await fetch(USERS_URL);
      const data = await response.json();

      if (response.ok) {
        setUsers(data);
      }
    } catch (error) {
      console.log("Error al cargar usuarios:", error);
    }
  };

  const getVinyls = async () => {
    try {
      const response = await fetch(VINYLS_URL);
      const data = await response.json();

      if (response.ok) {
        setVinyls(data);
      }
    } catch (error) {
      console.log("Error al cargar vinilos:", error);
    }
  };

  useEffect(() => {
    getOrders();
    getUsers();
    getVinyls();
  }, []);

  const filteredOrders = useMemo(() => {
    const text = search.toLowerCase();

    return orders.filter((order) => {
      const userText = getUserText(order).toLowerCase();
      const productText = getProductsText(order).toLowerCase();
      const statusText = formatStatus(order.status).toLowerCase();
      const addressText = order.shippingAddress?.toLowerCase() || "";

      return (
        userText.includes(text) ||
        productText.includes(text) ||
        statusText.includes(text) ||
        addressText.includes(text)
      );
    });
  }, [orders, search]);

  const totalIncome = orders.reduce((total, order) => {
    return total + Number(order.total || 0);
  }, 0);

  const pendingOrders = orders.filter((order) => order.status === "pending").length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered"
  ).length;

  const openAddModal = () => {
    setModalMode("add");
    setSelectedOrder(null);
    setFormData(initialForm);
  };

  const openEditModal = (order) => {
    setModalMode("edit");
    setSelectedOrder(order);

    setFormData({
      userId: getUserId(order),
      vinylId: "",
      quantity: "",
      shippingAddress: order.shippingAddress || "",
      status: order.status || "pending",
    });
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedOrder(null);
    setFormData(initialForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateAddForm = () => {
    const quantity = Number(formData.quantity);
    const shippingAddress = formData.shippingAddress.trim();

    if (!formData.userId) {
      showError("Seleccioná un usuario");
      return false;
    }

    if (!formData.vinylId) {
      showError("Seleccioná un vinilo");
      return false;
    }

    if (formData.quantity === "" || Number.isNaN(quantity)) {
      showError("La cantidad es obligatoria");
      return false;
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      showError("La cantidad debe ser un número entero mayor a 0");
      return false;
    }

    if (!shippingAddress) {
      showError("La dirección de envío es obligatoria");
      return false;
    }

    if (shippingAddress.length < 5 || shippingAddress.length > 150) {
      showError("La dirección debe tener entre 5 y 150 caracteres");
      return false;
    }

    if (!statusOptions.some((status) => status.value === formData.status)) {
      showError("Seleccioná un estado válido");
      return false;
    }

    return true;
  };

  const validateEditForm = () => {
    const shippingAddress = formData.shippingAddress.trim();

    if (!shippingAddress) {
      showError("La dirección de envío es obligatoria");
      return false;
    }

    if (shippingAddress.length < 5 || shippingAddress.length > 150) {
      showError("La dirección debe tener entre 5 y 150 caracteres");
      return false;
    }

    if (!statusOptions.some((status) => status.value === formData.status)) {
      showError("Seleccioná un estado válido");
      return false;
    }

    return true;
  };

  const createOrder = async (e) => {
    e.preventDefault();

    if (!validateAddForm()) return;

    try {
      setSaving(true);

      const body = {
        userId: formData.userId,
        products: [
          {
            vinylId: formData.vinylId,
            quantity: Number(formData.quantity),
          },
        ],
        shippingAddress: formData.shippingAddress.trim(),
        status: formData.status,
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.message || "No se pudo crear la orden");
        return;
      }

      showSuccess(data.message || "Orden creada correctamente");
      closeModal();
      getOrders();
    } catch (error) {
      console.log("Error al crear orden:", error);
      showError("Error al conectar con el servidor");
    } finally {
      setSaving(false);
    }
  };

  const updateOrder = async (e) => {
    e.preventDefault();

    if (!selectedOrder?._id) {
      showError("No se encontró la orden seleccionada");
      return;
    }

    if (!validateEditForm()) return;

    try {
      setSaving(true);

      const body = {
        status: formData.status,
        shippingAddress: formData.shippingAddress.trim(),
      };

      const response = await fetch(`${API_URL}/${selectedOrder._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.message || "No se pudo actualizar la orden");
        return;
      }

      showSuccess(data.message || "Orden actualizada correctamente");
      closeModal();
      getOrders();
    } catch (error) {
      console.log("Error al actualizar orden:", error);
      showError("Error al conectar con el servidor");
    } finally {
      setSaving(false);
    }
  };

  const deleteOrder = async (order) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar orden?",
      text: `Se eliminará esta orden permanentemente.`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ef5da8",
      cancelButtonColor: "#6b7280",
      background: "#ffffff",
      color: "#111111",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`${API_URL}/${order._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.message || "No se pudo eliminar la orden");
        return;
      }

      showSuccess(data.message || "Orden eliminada correctamente");
      getOrders();
    } catch (error) {
      console.log("Error al eliminar orden:", error);
      showError("Error al conectar con el servidor");
    }
  };

  function getUserId(order) {
    if (order.userId && typeof order.userId === "object") {
      return order.userId._id || "";
    }

    return order.userId || "";
  }

  function getUserText(order) {
    if (order.userId && typeof order.userId === "object") {
      return order.userId.fullName || order.userId._id || "Usuario";
    }

    if (order.userId) {
      return `Usuario ${String(order.userId).slice(-6).toUpperCase()}`;
    }

    return "Usuario no registrado";
  }

  function getProductsText(order) {
    if (!Array.isArray(order.products) || order.products.length === 0) {
      return "Sin productos";
    }

    return order.products.map((product) => product.title || "Vinilo").join(", ");
  }

  function getTotalQuantity(order) {
    if (!Array.isArray(order.products)) return 0;

    return order.products.reduce((total, product) => {
      return total + Number(product.quantity || 0);
    }, 0);
  }

  function formatStatus(status) {
    const statusFound = statusOptions.find((item) => item.value === status);
    return statusFound ? statusFound.label : "Sin estado";
  }

  function getStatusClass(status) {
    if (status === "pending") return "pending";
    if (status === "processing") return "processing";
    if (status === "shipped") return "shipped";
    if (status === "delivered") return "delivered";
    if (status === "cancelled") return "cancelled";
    return "unknown";
  }

  function formatDate(date) {
    if (!date) return "Sin fecha";

    return new Date(date).toLocaleDateString("es-SV", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function formatMoney(value) {
    return `$${Number(value || 0).toFixed(2)}`;
  }

  return (
    <main className="orders-page">
      <div className="orders-wrapper">
        <Sidebar />

        <section className="orders-main">
          <Topbar />

          <div className="orders-content">
            <div className="orders-header">
              <div>
                <h1>Órdenes</h1>
                <p>Controla las ventas, pedidos y estados de entrega.</p>
              </div>

              <div className="orders-header-actions">
                <input
                  type="text"
                  placeholder="Buscar orden..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <button className="orders-add-btn" onClick={openAddModal}>
                  + Nueva Orden
                </button>
              </div>
            </div>

            <div className="orders-summary">
              <div className="orders-summary-card">
                <span>Total órdenes</span>
                <h2>{orders.length}</h2>
              </div>

              <div className="orders-summary-card">
                <span>Ingresos</span>
                <h2>{formatMoney(totalIncome)}</h2>
              </div>

              <div className="orders-summary-card">
                <span>Pendientes</span>
                <h2>{pendingOrders}</h2>
              </div>

              <div className="orders-summary-card">
                <span>Entregadas</span>
                <h2>{deliveredOrders}</h2>
              </div>
            </div>

            <div className="orders-table-card">
              <div className="orders-table-header">
                <h2>Listado de órdenes</h2>
              </div>

              {loading && <p className="orders-message">Cargando órdenes...</p>}

              {error && <p className="orders-error">{error}</p>}

              {!loading && !error && (
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Productos</th>
                      <th>Cant.</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Dirección</th>
                      <th>Fecha</th>
                      <th>Acción</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <tr key={order._id}>
                          <td>
                            <div className="order-customer-cell">
                              <strong>{getUserText(order)}</strong>
                            </div>
                          </td>

                          <td>{getProductsText(order)}</td>
                          <td>{getTotalQuantity(order)}</td>
                          <td>{formatMoney(order.total)}</td>

                          <td>
                            <span
                              className={`order-status ${getStatusClass(
                                order.status
                              )}`}
                            >
                              {formatStatus(order.status)}
                            </span>
                          </td>

                          <td className="order-address">
                            {order.shippingAddress}
                          </td>

                          <td>{formatDate(order.orderDate || order.createdAt)}</td>

                          <td>
                            <div className="orders-actions">
                              <button
                                className="orders-edit-btn"
                                onClick={() => openEditModal(order)}
                              >
                                Editar
                              </button>

                              <button
                                className="orders-delete-btn"
                                onClick={() => deleteOrder(order)}
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8">No hay órdenes para mostrar</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
      </div>

      {(isAddMode || isEditMode) && (
        <div className="orders-modal-overlay">
          <div className="orders-modal">
            <div className="orders-modal-header">
              <div>
                <h2>{isAddMode ? "Nueva Orden" : "Editar Orden"}</h2>
                <p>
                  {isAddMode
                    ? "Registra una orden usando usuarios y vinilos existentes."
                    : "Actualiza la dirección y el estado de la orden."}
                </p>
              </div>

              <button className="orders-modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <form
              className="orders-form"
              onSubmit={isAddMode ? createOrder : updateOrder}
            >
              <div className="orders-form-grid">
                {isAddMode && (
                  <>
                    <div className="orders-form-group">
                      <label>Usuario</label>
                      <select
                        name="userId"
                        value={formData.userId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccionar usuario</option>
                        {users.map((user) => (
                          <option key={user._id} value={user._id}>
                            {user.fullName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="orders-form-group">
                      <label>Vinilo</label>
                      <select
                        name="vinylId"
                        value={formData.vinylId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccionar vinilo</option>
                        {vinyls.map((vinyl) => (
                          <option key={vinyl._id} value={vinyl._id}>
                            {vinyl.title} - {vinyl.artist}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="orders-form-group">
                      <label>Cantidad</label>
                      <input
                        type="number"
                        name="quantity"
                        placeholder="Ej: 1"
                        min="1"
                        step="1"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </>
                )}

                <div className="orders-form-group">
                  <label>Estado</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="orders-form-group orders-form-full">
                  <label>Dirección de envío</label>
                  <textarea
                    name="shippingAddress"
                    placeholder="Ej: San Marcos, El Salvador"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="orders-modal-actions">
                <button
                  type="button"
                  className="orders-cancel-btn"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="orders-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Guardando..."
                    : isAddMode
                    ? "Guardar Orden"
                    : "Actualizar Orden"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}