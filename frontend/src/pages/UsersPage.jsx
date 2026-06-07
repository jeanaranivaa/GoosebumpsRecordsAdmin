import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
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
  status: "active",
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [modalMode, setModalMode] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

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
  const adminUsers = users.filter((user) => user.role === "admin").length;

  const newThisMonth = users.filter((user) => {
    const date = new Date(user.registrationDate || user.createdAt);
    const now = new Date();

    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }).length;

  const openAddModal = () => {
    setModalMode("add");
    setSelectedUser(null);
    setFormData(initialForm);
    setImageFile(null);
    setImagePreview("");
  };

  const openEditModal = (user) => {
    setModalMode("edit");
    setSelectedUser(user);
    setImageFile(null);
    setImagePreview(user.imageURL || "");

    setFormData({
      fullName: user.fullName || "",
      email: user.email || "",
      password: "",
      role: user.role || "customer",
      phone: user.phone || "",
      status: user.status || "active",
    });
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedUser(null);
    setFormData(initialForm);
    setImageFile(null);
    setImagePreview("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setImageFile(null);
      setImagePreview(isEditMode ? selectedUser?.imageURL || "" : "");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 3 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      showError("Solo se permiten imágenes JPG, PNG o WEBP");
      e.target.value = "";
      setImageFile(null);
      return;
    }

    if (file.size > maxSize) {
      showError("La imagen no debe pesar más de 3 MB");
      e.target.value = "";
      setImageFile(null);
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    const fullName = formData.fullName.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password.trim();
    const phone = formData.phone.trim();

    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const phoneRegex = /^[0-9+\-\s]{7,15}$/;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]]/.test(password);
    const hasSpaces = /\s/.test(password);

    if (!fullName) {
      showError("El nombre completo es obligatorio");
      return false;
    }

    if (fullName.length < 3 || fullName.length > 60) {
      showError("El nombre completo debe tener entre 3 y 60 caracteres");
      return false;
    }

    if (!nameRegex.test(fullName)) {
      showError("El nombre solo debe contener letras y espacios");
      return false;
    }

    if (!email) {
      showError("El correo electrónico es obligatorio");
      return false;
    }

    if (!emailRegex.test(email)) {
      showError("Ingresá un correo electrónico válido. Ejemplo: usuario@correo.com");
      return false;
    }

    if (isAddMode && !password) {
      showError("La contraseña es obligatoria al agregar un usuario");
      return false;
    }

    if (password) {
      if (password.length < 8 || password.length > 20) {
        showError("La contraseña debe tener entre 8 y 20 caracteres");
        return false;
      }

      if (hasSpaces) {
        showError("La contraseña no debe contener espacios");
        return false;
      }

      if (!hasUpperCase) {
        showError("La contraseña debe incluir al menos una letra mayúscula");
        return false;
      }

      if (!hasLowerCase) {
        showError("La contraseña debe incluir al menos una letra minúscula");
        return false;
      }

      if (!hasNumber) {
        showError("La contraseña debe incluir al menos un número");
        return false;
      }

      if (!hasSpecialChar) {
        showError("La contraseña debe incluir al menos un carácter especial. Ejemplo: @, #, $, %, *");
        return false;
      }
    }

    if (!phone) {
      showError("El teléfono es obligatorio");
      return false;
    }

    if (!phoneRegex.test(phone)) {
      showError("Ingresá un número de teléfono válido. Ejemplo: 7123-4567");
      return false;
    }

    if (!["admin", "customer"].includes(formData.role)) {
      showError("Seleccioná un rol válido");
      return false;
    }

    if (isEditMode && !["active", "inactive"].includes(formData.status)) {
      showError("Seleccioná un estado válido");
      return false;
    }

    return true;
  };

  const buildFormData = () => {
    const dataToSend = new FormData();

    dataToSend.append("fullName", formData.fullName.trim());
    dataToSend.append("email", formData.email.trim().toLowerCase());
    dataToSend.append("role", formData.role);
    dataToSend.append("phone", formData.phone.trim());

    if (isAddMode) {
      dataToSend.append("status", "active");
    } else {
      dataToSend.append("status", formData.status);
    }

    if (isAddMode || formData.password.trim() !== "") {
      dataToSend.append("password", formData.password.trim());
    }

    if (imageFile) {
      dataToSend.append("image", imageFile);
    }

    return dataToSend;
  };

  const saveUser = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (isEditMode && !selectedUser?._id) {
      showError("No se encontró el usuario seleccionado");
      return;
    }

    try {
      setSaving(true);

      const url = isEditMode ? `${API_URL}/${selectedUser._id}` : API_URL;
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: buildFormData(),
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.message || "No se pudo guardar el usuario");
        return;
      }

      showSuccess(data.message || "Usuario guardado correctamente");
      closeModal();
      getUsers();
    } catch (error) {
      console.log("Error al guardar usuario:", error);
      showError("Error al conectar con el servidor");
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (user) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar usuario?",
      text: `Se eliminará a ${user.fullName} y también su imagen de Cloudinary.`,
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
      const response = await fetch(`${API_URL}/${user._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.message || "No se pudo eliminar el usuario");
        return;
      }

      showSuccess(data.message || "Usuario eliminado correctamente");
      getUsers();
    } catch (error) {
      console.log("Error al eliminar usuario:", error);
      showError("Error al conectar con el servidor");
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
                <span>Nuevos este mes</span>
                <h2>{newThisMonth}</h2>
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
                      <th></th>
                      <th>Nombre completo</th>
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
                          <td>
                            <div className="user-avatar">
                              {user.imageURL ? (
                                <img src={user.imageURL} alt={user.fullName} />
                              ) : (
                                user.fullName?.charAt(0).toUpperCase()
                              )}
                            </div>
                          </td>

                          <td>{user.fullName}</td>
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
                              <button
                                className="users-edit-btn"
                                onClick={() => openEditModal(user)}
                              >
                                Editar
                              </button>

                              <button
                                className="users-delete-btn"
                                onClick={() => deleteUser(user)}
                              >
                                Eliminar
                              </button>
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

      {(isAddMode || isEditMode) && (
        <div className="users-modal-overlay">
          <div className="users-modal">
            <div className="users-modal-header">
              <div>
                <h2>{isAddMode ? "Agregar Usuario" : "Editar Usuario"}</h2>
                <p>
                  {isAddMode
                    ? "Registra un nuevo usuario en el sistema."
                    : "Actualiza los datos del usuario seleccionado."}
                </p>
              </div>

              <button className="users-modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <form className="users-form" onSubmit={saveUser}>
              <div className="users-image-section">
                <div className="users-image-preview">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Usuario" />
                  ) : (
                    <span>
                      {formData.fullName
                        ? formData.fullName.charAt(0).toUpperCase()
                        : "U"}
                    </span>
                  )}
                </div>

                <input
                  id="userImageInput"
                  className="users-file-input"
                  type="file"
                  name="image"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                />

                <label htmlFor="userImageInput" className="users-photo-btn">
                  {isEditMode ? "Cambiar foto" : "Agregar foto de perfil"}
                </label>

                {imageFile && (
                  <small className="users-file-name">
                    Foto seleccionada correctamente
                  </small>
                )}

                {isAddMode && (
                  <small className="users-file-name">
                    El usuario se registrará como activo automáticamente
                  </small>
                )}

                {isEditMode && selectedUser?.imageURL && !imageFile && (
                  <small className="users-file-name">Foto actual</small>
                )}
              </div>

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
                    placeholder="usuario@correo.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="users-form-group">
                  <label>Contraseña {isEditMode && "(opcional)"}</label>
                  <input
                    type="password"
                    name="password"
                    placeholder={
                      isAddMode
                        ? "Ej: Usuario@123"
                        : "Dejar vacío para no cambiar"
                    }
                    value={formData.password}
                    onChange={handleChange}
                    required={isAddMode}
                  />
                </div>

                <div className="users-form-group">
                  <label>Rol</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="customer">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
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

                {isEditMode && (
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
                )}
              </div>

              <div className="users-modal-actions">
                <button
                  type="button"
                  className="users-cancel-btn"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="users-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Guardando..."
                    : isAddMode
                    ? "Guardar Usuario"
                    : "Actualizar Usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}