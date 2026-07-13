import { useState } from "react";
import { X, CreditCard } from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useCreateOrder } from "../hooks/orders/useCreateOrder";
import "../styles/Modal.css";
import "../styles/Checkout.css";

export default function CheckoutModal({ onClose, onSuccess }) {
  const { user } = useAuth();
  const { items, subtotal } = useCart();
  const { createOrder, loading } = useCreateOrder();

  const [address, setAddress] = useState("");
  const [method, setMethod] = useState("card");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (address.trim().length < 5) {
      setError("Ingresa una dirección de envío válida (mín. 5 caracteres).");
      return;
    }

    try {
      setError("");

      const products = items.map((item) => ({
        vinylId: item.vinylId,
        quantity: item.quantity,
      }));

      await createOrder({
        userId: user.id,
        products,
        shippingAddress: address.trim(),
      });

      onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.message || "Error al procesar la orden"
      );

      Swal.fire({
        icon: "error",
        title: "No se pudo completar la compra",
        text: err.response?.data?.message || "Intenta de nuevo.",
        background: "#14162a",
        color: "#ffffff",
        confirmButtonColor: "#ec4899",
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card checkout-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="checkout-body">
          <h2>Finalizar Compra</h2>
          <p className="checkout-sub">
            Revisa tus datos de envío y confirma el pedido.
          </p>

          <form onSubmit={handleSubmit} className="checkout-form">
            <label>Nombre</label>
            <input value={user?.fullName || ""} disabled />

            <label>Correo</label>
            <input value={user?.email || ""} disabled />

            <label>Dirección de envío</label>
            <textarea
              rows={3}
              placeholder="Calle, número, ciudad, referencia..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <label>Método de pago</label>
            <select value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="card">Tarjeta de crédito/débito</option>
              <option value="transfer">Transferencia bancaria</option>
              <option value="cash">Contra entrega (efectivo)</option>
            </select>

            {error && <p className="checkout-error">{error}</p>}

            <div className="checkout-total-row">
              <span>Total a pagar</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>

            <button
              type="submit"
              className="modal-add-btn"
              disabled={loading}
            >
              <CreditCard size={18} />
              {loading ? "Procesando..." : "Confirmar Pedido"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
