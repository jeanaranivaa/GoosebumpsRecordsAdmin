import "../styles/Vinyls.css";

export default function VinylCard({ vinyl, onEdit, onDelete }) {
  const getStatusClass = (status) => {
    if (status === "Disponible") return "available";
    if (status === "Agotado") return "sold-out";
    return "unknown";
  };

  return (
    <div className="vinyl-card">
      <div className="vinyl-card-image">
        {vinyl.coverUrl ? (
          <img src={vinyl.coverUrl} alt={vinyl.title} />
        ) : (
          <span>V</span>
        )}
      </div>

      <div className="vinyl-info">
        <div className="vinyl-title-row">
          <h3>{vinyl.title}</h3>

          <span className={`vinyl-card-status ${getStatusClass(vinyl.status)}`}>
            {vinyl.status}
          </span>
        </div>

        <p>{vinyl.artist}</p>

        <div className="vinyl-card-details">
          <span>Género: {vinyl.genre}</span>
          <span>Stock: {vinyl.stock}</span>
        </div>

        <p className="vinyl-description">{vinyl.description}</p>

        <div className="vinyl-meta">
          <span>${Number(vinyl.price).toFixed(2)}</span>
        </div>

        <div className="vinyl-actions">
          <button className="vinyls-edit-btn" onClick={() => onEdit(vinyl)}>
            Editar
          </button>

          <button className="vinyls-delete-btn" onClick={() => onDelete(vinyl)}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}