import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/Customers.css";

const customers = [
  {
    id: "CL-001",
    name: "Carlos Méndez",
    email: "carlos@gmail.com",
    phone: "+503 7123-4567",
    orders: 8,
    spent: 420,
    status: "Activo",
  },
  {
    id: "CL-002",
    name: "María López",
    email: "maria@gmail.com",
    phone: "+503 7456-9821",
    orders: 5,
    spent: 280,
    status: "Activo",
  },
  {
    id: "CL-003",
    name: "Andrea Ruiz",
    email: "andrea@gmail.com",
    phone: "+503 7988-1122",
    orders: 2,
    spent: 95,
    status: "Nuevo",
  },
  {
    id: "CL-004",
    name: "Diego Ramos",
    email: "diego@gmail.com",
    phone: "+503 7666-3344",
    orders: 0,
    spent: 0,
    status: "Inactivo",
  },
];

export default function CustomersPage() {
  return (
    <main className="customers-page">
      <div className="customers-wrapper">
        <Sidebar />

        <section className="customers-main">
          <Topbar />

          <div className="customers-content">
            <div className="customers-header">
              <div>
                <h1>Clientes</h1>
                <p>Administra la información y actividad de tus clientes.</p>
              </div>

              <button className="customers-add-btn">+ Agregar Cliente</button>
            </div>

            <div className="customers-summary">
              <div className="customers-summary-card">
                <span>Total clientes</span>
                <h2>248</h2>
              </div>

              <div className="customers-summary-card">
                <span>Clientes activos</span>
                <h2>190</h2>
              </div>

              <div className="customers-summary-card">
                <span>Nuevos este mes</span>
                <h2>34</h2>
              </div>

              <div className="customers-summary-card">
                <span>Compra promedio</span>
                <h2>$48</h2>
              </div>
            </div>

            <div className="customers-table-card">
              <div className="customers-table-header">
                <h2>Listado de clientes</h2>
                <input type="text" placeholder="Buscar cliente..." />
              </div>

              <table className="customers-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Cliente</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Órdenes</th>
                    <th>Total gastado</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id}>
                      <td>{customer.id}</td>
                      <td>
                        <div className="customer-name-cell">
                          <div className="customer-avatar">
                            {customer.name.charAt(0)}
                          </div>
                          <span>{customer.name}</span>
                        </div>
                      </td>
                      <td>{customer.email}</td>
                      <td>{customer.phone}</td>
                      <td>{customer.orders}</td>
                      <td>${customer.spent}</td>
                      <td>
                        <span
                          className={`customer-status ${customer.status.toLowerCase()}`}
                        >
                          {customer.status}
                        </span>
                      </td>
                      <td>
                        <div className="customers-actions">
                          <button className="customers-view-btn">Ver</button>
                          <button className="customers-edit-btn">Editar</button>
                        </div>
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