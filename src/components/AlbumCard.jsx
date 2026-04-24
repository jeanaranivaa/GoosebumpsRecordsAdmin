import "../styles/Cards.css";

export default function AlbumCard({ image, title, artist }) {
  return (
    <article className="album-card">
      <img src={image} alt={title} />
      <h4>{title}</h4>
      <p>{artist}</p>
    </article>
  );
}