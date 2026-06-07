import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/Users.css";

const API_URL = "http://localhost:4000/api/users";

const initialForm = {
  fullName: "",
  email: "",
  password: "",
  role: "customer",
  phone: "",
  imageURL: "",
  status: "active",
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialForm);

  const getUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al cargar usuarios");
      }

      setUsers(data);
    } catch (error) {
      console.log("Error al cargar usuarios:", error);
      setError("No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const text = search.toLowerCase();

      return (
        user.fullName?.toLowerCase().includes(text) ||
        user.email?.toLowerCase().includes(text) ||
        user.phone?.toLowerCase().includes(text) ||
        user.role?.toLowerCase().includes(text) ||
        user.status?.toLowerCase().includes(text)
      );
    });
  }, [users, search]);

  const activeUsers = users.filter((user) => user.status === "active").length;

  const inactiveUsers = users.filter(
    (user) => user.status === "inactive"
  ).length;

  const adminUsers = users.filter((user) => user.role === "admin").length;

  const customerUsers = users.filter((user) => user.role === "customer").length;

  const openAddModal = () => {
    setFormData(initialForm);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setFormData(initialForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const createUser = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "No se pudo crear el usuario");
        return;
      }

      alert(data.message || "Usuario creado correctamente");
      closeAddModal();
      getUsers();
    } catch (error) {
      console.log("Error al crear usuario:", error);
      alert("Error al conectar con el servidor");
    } finally {
      setSaving(false);
    }
  };

  const formatStatus = (status) => {
    if (status === "active") return "Activo";
    if (status === "inactive") return "Inactivo";
    return "Sin estado";
  };

  const getStatusClass = (status) => {
    if (status === "active") return "active";
    if (status === "inactive") return "inactive";
    return "unknown";
  };

  const formatRole = (role) => {
    if (role === "admin") return "Administrador";
    if (role === "customer") return "Usuario";
    return "Sin rol";
  };

  const formatDate = (date) => {
    if (!date) return "Sin fecha";

    return new Date(date).toLocaleDateString("es-SV", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <main className="users-page">
      <div className="users-wrapper">
        <Sidebar />

        <section className="users-main">
          <Topbar />

          <div className="users-content">
            <div className="users-header">
              <div>
                <h1>Usuarios</h1>
                <p>Administra la información y estado de tus usuarios.</p>
              </div>

              <button className="users-add-btn" onClick={openAddModal}>
                + Agregar Usuario
              </button>
            </div>

            <div className="users-summary">
              <div className="users-summary-card">
                <span>Total usuarios</span>
                <h2>{users.length}</h2>
              </div>

              <div className="users-summary-card">
                <span>Usuarios activos</span>
                <h2>{activeUsers}</h2>
              </div>

              <div className="users-summary-card">
                <span>Administradores</span>
                <h2>{adminUsers}</h2>
              </div>

              <div className="users-summary-card">
                <span>Usuarios customer</span>
                <h2>{customerUsers}</h2>
              </div>
            </div>

            <div className="users-table-card">
              <div className="users-table-header">
                <h2>Listado de usuarios</h2>

                <input
                  type="text"
                  placeholder="Buscar usuario..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {loading && <p className="users-message">Cargando usuarios...</p>}

              {error && <p className="users-error">{error}</p>}

              {!loading && !error && (
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Usuario</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                      <th>Rol</th>
                      <th>Fecha registro</th>
                      <th>Estado</th>
                      <th>Acción</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user._id}>
                          <td>US-{user._id?.slice(-5).toUpperCase()}</td>

                          <td>
                            <div className="user-name-cell">
                              <div className="user-avatar">
                                {user.imageURL ? (
                                  <img src={user.imageURL} alt={user.fullName} />
                                ) : (
                                  user.fullName?.charAt(0).toUpperCase()
                                )}
                              </div>

                              <span>{user.fullName}</span>
                            </div>
                          </td>

                          <td>{user.email}</td>
                          <td>{user.phone}</td>
                          <td>{formatRole(user.role)}</td>
                          <td>
                            {formatDate(user.registrationDate || user.createdAt)}
                          </td>

                          <td>
                            <span
                              className={`user-status ${getStatusClass(
                                user.status
                              )}`}
                            >
                              {formatStatus(user.status)}
                            </span>
                          </td>

                          <td>
                            <div className="users-actions">
                              <button className="users-view-btn">Ver</button>
                              <button className="users-edit-btn">Editar</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8">No hay usuarios para mostrar</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
      </div>

      {isAddModalOpen && (
        <div className="users-modal-overlay">
          <div className="users-modal">
            <div className="users-modal-header">
              <div>
                <h2>Agregar Usuario</h2>
                <p>Completa la información para registrar un nuevo usuario.</p>
              </div>

              <button className="users-modal-close" onClick={closeAddModal}>
                ×
              </button>
            </div>

            <form className="users-form" onSubmit={createUser}>
              <div className="users-form-grid">
                <div className="users-form-group">
                  <label>Nombre completo</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Ej: Andrea López"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="users-form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="correo@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="users-form-group">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="users-form-group">
                  <label>Teléfono</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="+503 7000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="users-form-group">
                  <label>Rol</label>
                  <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="customer">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                <div className="users-form-group">
                  <label>Estado</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>

                <div className="users-form-group users-form-full">
                  <label>URL de imagen</label>
                  <input
                    type="text"
                    name="imageURL"
                    placeholder="https://res.cloudinary.com/..."
                    value={formData.imageURL}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="users-modal-actions">
                <button
                  type="button"
                  className="users-cancel-btn"
                  onClick={closeAddModal}
                  disabled={saving}
                >
                  Cancelar
                </button>

                <button type="submit" className="users-save-btn" disabled={saving}>
                  {saving ? "Guardando..." : "Guardar Usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}