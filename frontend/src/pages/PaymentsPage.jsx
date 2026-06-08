import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/Payments.css";

const API_URL = "http://localhost:4000/api/payments";
const ORDERS_URL = "http://localhost:4000/api/orders";

const initialForm = {
  orderId: "",
  userId: "",
  paymentMethod: "card",
  amount: "",
  status: "pending",
};

const methodOptions = [
  { value: "cash", label: "Efectivo" },
  { value: "card", label: "Tarjeta" },
  { value: "transfer", label: "Transferencia" },
];

const statusOptions = [
  { value: "pending", label: "Pendiente" },
  { value: "paid", label: "Pagado" },
  { value: "failed", label: "Fallido" },
  { value: "refunded", label: "Reembolsado" },
];

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [modalMode, setModalMode] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
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

  const getPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al cargar pagos");
      }

      setPayments(data);
    } catch (error) {
      console.log("Error al cargar pagos:", error);
      setError("No se pudieron cargar los pagos");
    } finally {
      setLoading(false);
    }
  };

  const getOrders = async () => {
    try {
      const response = await fetch(ORDERS_URL);
      const data = await response.json();

      if (response.ok) {
        setOrders(data);
      }
    } catch (error) {
      console.log("Error al cargar órdenes:", error);
    }
  };

  useEffect(() => {
    getPayments();
    getOrders();
  }, []);

  const filteredPayments = useMemo(() => {
    const text = search.toLowerCase();

    return payments.filter((payment) => {
      const orderText = getOrderText(payment).toLowerCase();
      const userText = getUserText(payment).toLowerCase();
      const methodText = formatMethod(payment.paymentMethod).toLowerCase();
      const statusText = formatStatus(payment.status).toLowerCase();

      return (
        orderText.includes(text) ||
        userText.includes(text) ||
        methodText.includes(text) ||
        statusText.includes(text)
      );
    });
  }, [payments, search]);

  const totalPaid = payments
    .filter((payment) => payment.status === "paid")
    .reduce((total, payment) => total + Number(payment.amount || 0), 0);

  const pendingPayments = payments.filter(
    (payment) => payment.status === "pending"
  ).length;

  const failedPayments = payments.filter(
    (payment) => payment.status === "failed"
  ).length;

  const openAddModal = () => {
    setModalMode("add");
    setSelectedPayment(null);
    setFormData(initialForm);
  };

  const openEditModal = (payment) => {
    setModalMode("edit");
    setSelectedPayment(payment);

    setFormData({
      orderId: getOrderId(payment),
      userId: getUserId(payment),
      paymentMethod: payment.paymentMethod || "card",
      amount: payment.amount ?? "",
      status: payment.status || "pending",
    });
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedPayment(null);
    setFormData(initialForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleOrderChange = (e) => {
    const orderId = e.target.value;
    const orderSelected = orders.find((order) => order._id === orderId);

    if (!orderSelected) {
      setFormData({
        ...formData,
        orderId: "",
        userId: "",
        amount: "",
      });
      return;
    }

    setFormData({
      ...formData,
      orderId,
      userId: getOrderUserId(orderSelected),
      amount: orderSelected.total ?? "",
    });
  };

  const validateForm = () => {
    const amount = Number(formData.amount);

    if (!formData.orderId) {
      showError("Seleccioná una orden");
      return false;
    }

    if (!formData.userId) {
      showError("La orden seleccionada no tiene usuario asignado");
      return false;
    }

    if (!methodOptions.some((method) => method.value === formData.paymentMethod)) {
      showError("Seleccioná un método de pago válido");
      return false;
    }

    if (formData.amount === "" || Number.isNaN(amount) || amount <= 0) {
      showError("El monto debe ser un número mayor a 0");
      return false;
    }

    if (!statusOptions.some((status) => status.value === formData.status)) {
      showError("Seleccioná un estado válido");
      return false;
    }

    return true;
  };

  const savePayment = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (isEditMode && !selectedPayment?._id) {
      showError("No se encontró el pago seleccionado");
      return;
    }

    try {
      setSaving(true);

      const url = isEditMode ? `${API_URL}/${selectedPayment._id}` : API_URL;
      const method = isEditMode ? "PUT" : "POST";

      const body = {
        orderId: formData.orderId,
        userId: formData.userId,
        paymentMethod: formData.paymentMethod,
        amount: Number(formData.amount),
        status: formData.status,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.message || "No se pudo guardar el pago");
        return;
      }

      showSuccess(data.message || "Pago guardado correctamente");
      closeModal();
      getPayments();
    } catch (error) {
      console.log("Error al guardar pago:", error);
      showError("Error al conectar con el servidor");
    } finally {
      setSaving(false);
    }
  };

  const deletePayment = async (payment) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar pago?",
      text: "Se eliminará este pago permanentemente.",
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
      const response = await fetch(`${API_URL}/${payment._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.message || "No se pudo eliminar el pago");
        return;
      }

      showSuccess(data.message || "Pago eliminado correctamente");
      getPayments();
    } catch (error) {
      console.log("Error al eliminar pago:", error);
      showError("Error al conectar con el servidor");
    }
  };

  function getOrderId(payment) {
    if (payment.orderId && typeof payment.orderId === "object") {
      return payment.orderId._id || "";
    }

    return payment.orderId || "";
  }

  function getUserId(payment) {
    if (payment.userId && typeof payment.userId === "object") {
      return payment.userId._id || "";
    }

    return payment.userId || "";
  }

  function getOrderUserId(order) {
    if (order.userId && typeof order.userId === "object") {
      return order.userId._id || "";
    }

    return order.userId || "";
  }

  function getOrderText(payment) {
    const orderId = getOrderId(payment);

    if (!orderId) return "Orden no registrada";

    return `ORD-${String(orderId).slice(-6).toUpperCase()}`;
  }

  function getUserText(payment) {
    if (payment.userId && typeof payment.userId === "object") {
      return payment.userId.fullName || "Usuario";
    }

    if (payment.userId) {
      return `Usuario ${String(payment.userId).slice(-6).toUpperCase()}`;
    }

    return "Usuario no registrado";
  }

  function getOrderOptionText(order) {
    const code = `ORD-${String(order._id).slice(-6).toUpperCase()}`;
    const userName =
      order.userId && typeof order.userId === "object"
        ? order.userId.fullName || "Usuario"
        : "Usuario";

    return `${code} - ${userName} - ${formatMoney(order.total)}`;
  }

  function formatMethod(method) {
    const methodFound = methodOptions.find((item) => item.value === method);
    return methodFound ? methodFound.label : "Sin método";
  }

  function formatStatus(status) {
    const statusFound = statusOptions.find((item) => item.value === status);
    return statusFound ? statusFound.label : "Sin estado";
  }

  function getStatusClass(status) {
    if (status === "pending") return "pending";
    if (status === "paid") return "paid";
    if (status === "failed") return "failed";
    if (status === "refunded") return "refunded";
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
    <main className="payments-page">
      <div className="payments-wrapper">
        <Sidebar />

        <section className="payments-main">
          <Topbar />

          <div className="payments-content">
            <div className="payments-header">
              <div>
                <h1>Pagos</h1>
                <p>Administra los pagos relacionados con las órdenes.</p>
              </div>

              <div className="payments-header-actions">
                <input
                  type="text"
                  placeholder="Buscar pago..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <button className="payments-add-btn" onClick={openAddModal}>
                  + Nuevo Pago
                </button>
              </div>
            </div>

            <div className="payments-summary">
              <div className="payments-summary-card">
                <span>Total pagos</span>
                <h2>{payments.length}</h2>
              </div>

              <div className="payments-summary-card">
                <span>Total pagado</span>
                <h2>{formatMoney(totalPaid)}</h2>
              </div>

              <div className="payments-summary-card">
                <span>Pendientes</span>
                <h2>{pendingPayments}</h2>
              </div>

              <div className="payments-summary-card">
                <span>Fallidos</span>
                <h2>{failedPayments}</h2>
              </div>
            </div>

            <div className="payments-table-card">
              <div className="payments-table-header">
                <h2>Listado de pagos</h2>
              </div>

              {loading && <p className="payments-message">Cargando pagos...</p>}

              {error && <p className="payments-error">{error}</p>}

              {!loading && !error && (
                <table className="payments-table">
                  <thead>
                    <tr>
                      <th>Orden</th>
                      <th>Usuario</th>
                      <th>Método</th>
                      <th>Monto</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                      <th>Acción</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredPayments.length > 0 ? (
                      filteredPayments.map((payment) => (
                        <tr key={payment._id}>
                          <td>{getOrderText(payment)}</td>
                          <td>{getUserText(payment)}</td>
                          <td>{formatMethod(payment.paymentMethod)}</td>
                          <td>{formatMoney(payment.amount)}</td>

                          <td>
                            <span
                              className={`payment-status ${getStatusClass(
                                payment.status
                              )}`}
                            >
                              {formatStatus(payment.status)}
                            </span>
                          </td>

                          <td>
                            {formatDate(payment.paymentDate || payment.createdAt)}
                          </td>

                          <td>
                            <div className="payments-actions">
                              <button
                                className="payments-edit-btn"
                                onClick={() => openEditModal(payment)}
                              >
                                Editar
                              </button>

                              <button
                                className="payments-delete-btn"
                                onClick={() => deletePayment(payment)}
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7">No hay pagos para mostrar</td>
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
        <div className="payments-modal-overlay">
          <div className="payments-modal">
            <div className="payments-modal-header">
              <div>
                <h2>{isAddMode ? "Nuevo Pago" : "Editar Pago"}</h2>
                <p>
                  {isAddMode
                    ? "Registra un pago usando una orden existente."
                    : "Actualiza la información del pago seleccionado."}
                </p>
              </div>

              <button className="payments-modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <form className="payments-form" onSubmit={savePayment}>
              <div className="payments-form-grid">
                <div className="payments-form-group payments-form-full">
                  <label>Orden</label>
                  <select
                    name="orderId"
                    value={formData.orderId}
                    onChange={handleOrderChange}
                    required
                  >
                    <option value="">Seleccionar orden</option>
                    {orders.map((order) => (
                      <option key={order._id} value={order._id}>
                        {getOrderOptionText(order)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="payments-form-group">
                  <label>Método de pago</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    required
                  >
                    {methodOptions.map((method) => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="payments-form-group">
                  <label>Monto</label>
                  <input
                    type="number"
                    name="amount"
                    placeholder="Ej: 55"
                    min="0.01"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="payments-form-group">
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
              </div>

              <div className="payments-modal-actions">
                <button
                  type="button"
                  className="payments-cancel-btn"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="payments-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Guardando..."
                    : isAddMode
                    ? "Guardar Pago"
                    : "Actualizar Pago"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}