import "../styles/Cards.css";

export default function AlbumCard({ image, title, artist, unitsSold }) {
  return (
    <article className="album-card">
      <img src={image} alt={title} />
      <h4>{title}</h4>
      <p>{artist}</p>
      {unitsSold !== undefined && (
        <span className="album-card-sold">
          {unitsSold} {unitsSold === 1 ? "vendido" : "vendidos"}
        </span>
      )}
    </article>
  );
}