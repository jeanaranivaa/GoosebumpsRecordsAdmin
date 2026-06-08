import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import VinylCard from "../components/VinylCard";
import "../styles/Vinyls.css";

const API_URL = "http://localhost:4000/api/vinyls";

const initialForm = {
  title: "",
  artist: "",
  genre: "",
  price: "",
  stock: "",
  description: "",
  status: "Disponible",
};

export default function VinylsPage() {
  const [vinyls, setVinyls] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [modalMode, setModalMode] = useState(null);
  const [selectedVinyl, setSelectedVinyl] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");

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

  const getVinyls = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al cargar vinilos");
      }

      setVinyls(data);
    } catch (error) {
      console.log("Error al cargar vinilos:", error);
      setError("No se pudieron cargar los vinilos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVinyls();
  }, []);

  const filteredVinyls = useMemo(() => {
    const text = search.toLowerCase();

    return vinyls.filter((vinyl) => {
      return (
        vinyl.title?.toLowerCase().includes(text) ||
        vinyl.artist?.toLowerCase().includes(text) ||
        vinyl.genre?.toLowerCase().includes(text) ||
        vinyl.status?.toLowerCase().includes(text)
      );
    });
  }, [vinyls, search]);

  const availableVinyls = vinyls.filter(
    (vinyl) => vinyl.status === "Disponible"
  ).length;

  const soldOutVinyls = vinyls.filter(
    (vinyl) => vinyl.status === "Agotado"
  ).length;

  const totalStock = vinyls.reduce((total, vinyl) => {
    return total + Number(vinyl.stock || 0);
  }, 0);

  const openAddModal = () => {
    setModalMode("add");
    setSelectedVinyl(null);
    setFormData(initialForm);
    setCoverFile(null);
    setCoverPreview("");
  };

  const openEditModal = (vinyl) => {
    setModalMode("edit");
    setSelectedVinyl(vinyl);
    setCoverFile(null);
    setCoverPreview(vinyl.coverUrl || "");

    setFormData({
      title: vinyl.title || "",
      artist: vinyl.artist || "",
      genre: vinyl.genre || "",
      price: vinyl.price ?? "",
      stock: vinyl.stock ?? "",
      description: vinyl.description || "",
      status: vinyl.status || "Disponible",
    });
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedVinyl(null);
    setFormData(initialForm);
    setCoverFile(null);
    setCoverPreview("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setCoverFile(null);
      setCoverPreview(isEditMode ? selectedVinyl?.coverUrl || "" : "");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 3 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      showError("Solo se permiten imágenes JPG, PNG o WEBP");
      e.target.value = "";
      setCoverFile(null);
      return;
    }

    if (file.size > maxSize) {
      showError("La imagen no debe pesar más de 3 MB");
      e.target.value = "";
      setCoverFile(null);
      return;
    }

    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    const title = formData.title.trim();
    const artist = formData.artist.trim();
    const genre = formData.genre.trim();
    const price = Number(formData.price);
    const stock = Number(formData.stock);
    const description = formData.description.trim();

    if (!title) {
      showError("El nombre del vinilo es obligatorio");
      return false;
    }

    if (title.length < 2 || title.length > 80) {
      showError("El nombre del vinilo debe tener entre 2 y 80 caracteres");
      return false;
    }

    if (!artist) {
      showError("El artista es obligatorio");
      return false;
    }

    if (artist.length < 2 || artist.length > 80) {
      showError("El artista debe tener entre 2 y 80 caracteres");
      return false;
    }

    if (!genre) {
      showError("El género es obligatorio");
      return false;
    }

    if (genre.length < 2 || genre.length > 40) {
      showError("El género debe tener entre 2 y 40 caracteres");
      return false;
    }

    if (formData.price === "" || Number.isNaN(price) || price < 0) {
      showError("El precio debe ser un número válido mayor o igual a 0");
      return false;
    }

    if (
      formData.stock === "" ||
      Number.isNaN(stock) ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      showError("El stock debe ser un número entero mayor o igual a 0");
      return false;
    }

    if (!description) {
      showError("La descripción es obligatoria");
      return false;
    }

    if (description.length < 5 || description.length > 500) {
      showError("La descripción debe tener entre 5 y 500 caracteres");
      return false;
    }

    if (isAddMode && !coverFile) {
      showError("La portada del vinilo es obligatoria");
      return false;
    }

    if (!["Disponible", "Agotado"].includes(formData.status)) {
      showError("Seleccioná un estado válido");
      return false;
    }

    return true;
  };

  const buildFormData = () => {
    const dataToSend = new FormData();

    dataToSend.append("title", formData.title.trim());
    dataToSend.append("artist", formData.artist.trim());
    dataToSend.append("genre", formData.genre.trim());
    dataToSend.append("price", Number(formData.price));
    dataToSend.append("stock", Number(formData.stock));
    dataToSend.append("description", formData.description.trim());
    dataToSend.append("status", formData.status);

    if (coverFile) {
      dataToSend.append("cover", coverFile);
    }

    return dataToSend;
  };

  const saveVinyl = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (isEditMode && !selectedVinyl?._id) {
      showError("No se encontró el vinilo seleccionado");
      return;
    }

    try {
      setSaving(true);

      const url = isEditMode ? `${API_URL}/${selectedVinyl._id}` : API_URL;
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: buildFormData(),
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.message || "No se pudo guardar el vinilo");
        return;
      }

      showSuccess(data.message || "Vinilo guardado correctamente");
      closeModal();
      getVinyls();
    } catch (error) {
      console.log("Error al guardar vinilo:", error);
      showError("Error al conectar con el servidor");
    } finally {
      setSaving(false);
    }
  };

  const deleteVinyl = async (vinyl) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar vinilo?",
      text: `Se eliminará "${vinyl.title}" y también su portada de Cloudinary.`,
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
      const response = await fetch(`${API_URL}/${vinyl._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.message || "No se pudo eliminar el vinilo");
        return;
      }

      showSuccess(data.message || "Vinilo eliminado correctamente");
      getVinyls();
    } catch (error) {
      console.log("Error al eliminar vinilo:", error);
      showError("Error al conectar con el servidor");
    }
  };

  return (
    <div className="vinyls-page">
      <div className="vinyls-wrapper">
        <Sidebar />

        <div className="vinyls-main">
          <Topbar />

          <div className="vinyls-content">
            <div className="vinyls-header">
              <div>
                <h1>Vinilos</h1>
                <p>Gestiona el catálogo de discos disponibles.</p>
              </div>

              <div className="vinyls-header-actions">
                <input
                  type="text"
                  placeholder="Buscar vinilo..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <button className="btn-add" onClick={openAddModal}>
                  + Agregar Vinilo
                </button>
              </div>
            </div>

            <div className="vinyls-summary">
              <div className="vinyls-summary-card">
                <span>Total vinilos</span>
                <h2>{vinyls.length}</h2>
              </div>

              <div className="vinyls-summary-card">
                <span>Disponibles</span>
                <h2>{availableVinyls}</h2>
              </div>

              <div className="vinyls-summary-card">
                <span>Agotados</span>
                <h2>{soldOutVinyls}</h2>
              </div>

              <div className="vinyls-summary-card">
                <span>Stock total</span>
                <h2>{totalStock}</h2>
              </div>
            </div>

            {loading && <p className="vinyls-message">Cargando vinilos...</p>}

            {error && <p className="vinyls-error">{error}</p>}

            {!loading && !error && (
              <div className="vinyls-grid">
                {filteredVinyls.length > 0 ? (
                  filteredVinyls.map((vinyl) => (
                    <VinylCard
                      key={vinyl._id}
                      vinyl={vinyl}
                      onEdit={openEditModal}
                      onDelete={deleteVinyl}
                    />
                  ))
                ) : (
                  <p className="vinyls-message">No hay vinilos para mostrar</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {(isAddMode || isEditMode) && (
        <div className="vinyls-modal-overlay">
          <div className="vinyls-modal">
            <div className="vinyls-modal-header">
              <div>
                <h2>{isAddMode ? "Agregar Vinilo" : "Editar Vinilo"}</h2>
                <p>
                  {isAddMode
                    ? "Registra un nuevo vinilo en el catálogo."
                    : "Actualiza los datos del vinilo seleccionado."}
                </p>
              </div>

              <button className="vinyls-modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <form className="vinyls-form" onSubmit={saveVinyl}>
              <div className="vinyls-image-section">
                <div className="vinyls-image-preview">
                  {coverPreview ? (
                    <img src={coverPreview} alt="Vinilo" />
                  ) : (
                    <span>V</span>
                  )}
                </div>

                <input
                  id="vinylCoverInput"
                  className="vinyls-file-input"
                  type="file"
                  name="cover"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleCoverChange}
                />

                <label htmlFor="vinylCoverInput" className="vinyls-photo-btn">
                  {isEditMode ? "Cambiar portada" : "Agregar portada"}
                </label>

                {coverFile && (
                  <small className="vinyls-file-name">
                    Portada seleccionada correctamente
                  </small>
                )}

                {isEditMode && selectedVinyl?.coverUrl && !coverFile && (
                  <small className="vinyls-file-name">Portada actual</small>
                )}
              </div>

              <div className="vinyls-form-grid">
                <div className="vinyls-form-group">
                  <label>Nombre del vinilo</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Ej: Thriller"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="vinyls-form-group">
                  <label>Artista</label>
                  <input
                    type="text"
                    name="artist"
                    placeholder="Ej: Michael Jackson"
                    value={formData.artist}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="vinyls-form-group">
                  <label>Género</label>
                  <input
                    type="text"
                    name="genre"
                    placeholder="Ej: Pop"
                    value={formData.genre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="vinyls-form-group">
                  <label>Precio</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Ej: 25.99"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="vinyls-form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    name="stock"
                    placeholder="Ej: 10"
                    min="0"
                    step="1"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="vinyls-form-group">
                  <label>Estado</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Agotado">Agotado</option>
                  </select>
                </div>

                <div className="vinyls-form-group vinyls-form-full">
                  <label>Descripción</label>
                  <textarea
                    name="description"
                    placeholder="Descripción del vinilo"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="vinyls-modal-actions">
                <button
                  type="button"
                  className="vinyls-cancel-btn"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="vinyls-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Guardando..."
                    : isAddMode
                    ? "Guardar Vinilo"
                    : "Actualizar Vinilo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}