import "../styles/Vinyls.css";

export default function VinylCard({ image, title, artist, price, stock }) {
  return (
    <div className="vinyl-card">
      <img src={image} alt={title} />

      <div className="vinyl-info">
        <h3>{title}</h3>
        <p>{artist}</p>

        <div className="vinyl-meta">
          <span>${price}</span>
          <span className="stock">Stock: {stock}</span>
        </div>

        <div className="vinyl-actions">
          <button className="btn-view">Ver</button>
          <button className="btn-edit">Editar</button>
        </div>
      </div>
    </div>
  );
}