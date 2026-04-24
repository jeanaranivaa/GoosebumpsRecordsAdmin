import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/Orders.css";

const orders = [
  {
    id: "ORD-001",
    customer: "Carlos Méndez",
    vinyl: "Un Verano Sin Ti",
    artist: "Bad Bunny",
    quantity: 2,
    total: 70,
    status: "Completada",
    date: "24/04/2026",
  },
  {
    id: "ORD-002",
    customer: "María López",
    vinyl: "Justice",
    artist: "Justin Bieber",
    quantity: 1,
    total: 28,
    status: "Pendiente",
    date: "23/04/2026",
  },
  {
    id: "ORD-003",
    customer: "Andrea Ruiz",
    vinyl: "Wings",
    artist: "BTS",
    quantity: 3,
    total: 120,
    status: "En proceso",
    date: "22/04/2026",
  },
  {
    id: "ORD-004",
    customer: "Diego Ramos",
    vinyl: "Vice Versa",
    artist: "Rauw Alejandro",
    quantity: 1,
    total: 32,
    status: "Cancelada",
    date: "21/04/2026",
  },
];

export default function OrdersPage() {
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

              <button className="orders-add-btn">+ Nueva Orden</button>
            </div>

            <div className="orders-summary">
              <div className="orders-summary-card">
                <span>Total órdenes</span>
                <h2>128</h2>
              </div>

              <div className="orders-summary-card">
                <span>Ingresos</span>
                <h2>$4,850</h2>
              </div>

              <div className="orders-summary-card">
                <span>Pendientes</span>
                <h2>14</h2>
              </div>

              <div className="orders-summary-card">
                <span>Completadas</span>
                <h2>96</h2>
              </div>
            </div>

            <div className="orders-table-card">
              <div className="orders-table-header">
                <h2>Listado de órdenes</h2>
                <input type="text" placeholder="Buscar orden..." />
              </div>

              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Cliente</th>
                    <th>Vinilo</th>
                    <th>Artista</th>
                    <th>Cant.</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.vinyl}</td>
                      <td>{order.artist}</td>
                      <td>{order.quantity}</td>
                      <td>${order.total}</td>
                      <td>
                        <span
                          className={`order-status ${order.status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>{order.date}</td>
                      <td>
                        <button className="orders-action-btn">Ver</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}