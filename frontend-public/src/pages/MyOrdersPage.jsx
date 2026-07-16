import { Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StoreLayout from "../components/StoreLayout";
import VinylCover from "../components/VinylCover";
import { useMyOrders } from "../hooks/orders/useMyOrders";
import "../styles/MyOrders.css";

const STATUS_LABELS = {
  pending: "Pendiente",
  processing: "En proceso",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

const formatDate = (date) => {
  if (!date) return "Sin fecha";

  return new Date(date).toLocaleDateString("es-SV", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export default function MyOrdersPage() {
  const { orders, loading, error } = useMyOrders();
  const navigate = useNavigate();

  return (
    <StoreLayout>
      <h1 className="my-orders-title">Mis Pedidos</h1>

      {loading && <p className="my-orders-empty">Cargando pedidos...</p>}

      {error && (
        <p className="my-orders-empty">No se pudieron cargar tus pedidos.</p>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="my-orders-none">
          <Package size={48} />
          <p>Aún no has realizado ningún pedido.</p>
          <button onClick={() => navigate("/home")}>Explorar vinilos</button>
        </div>
      )}

      <div className="my-orders-list">
        {orders.map((order) => (
          <article key={order._id} className="my-order-card">
            <header>
              <div>
                <h3>Pedido #{order._id.slice(-6).toUpperCase()}</h3>
                <p>{formatDate(order.orderDate || order.createdAt)}</p>
              </div>

              <span className={`my-order-status ${order.status}`}>
                {STATUS_LABELS[order.status] || order.status}
              </span>
            </header>

            <ul>
              {order.products.map((product, index) => (
                <li key={`${order._id}-${index}`}>
                  <div className="my-order-cover">
                    <VinylCover
                      src={product.vinylId?.coverUrl}
                      alt={product.title}
                    />
                  </div>

                  <div className="my-order-product">
                    <strong>{product.title}</strong>
                    <span>
                      {product.vinylId?.artist || ""}
                    </span>
                  </div>

                  <span className="my-order-qty">
                    {product.quantity} × ${Number(product.price).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            <footer>
              <span>Enviado a: {order.shippingAddress}</span>
              <strong>Total: ${Number(order.total).toFixed(2)}</strong>
            </footer>
          </article>
        ))}
      </div>
    </StoreLayout>
  );
}
