import "../styles/Artists.css";

export default function ArtistCard({ image, name, genre, albums, country }) {
  return (
    <article className="artist-card">
      <img src={image} alt={name} />

      <div className="artist-info">
        <h3>{name}</h3>
        <p>{genre}</p>

        <div className="artist-meta">
          <span>{albums} álbumes</span>
          <span>{country}</span>
        </div>

        <div className="artist-actions">
          <button className="btn-view">Ver</button>
          <button className="btn-edit">Editar</button>
        </div>
      </div>
    </article>
  );
}