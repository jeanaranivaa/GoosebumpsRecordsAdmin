import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ArtistCard from "../components/OrdersCard";

import badbunny from "../assets/artist1.png";
import justin from "../assets/artist2.png";
import bts from "../assets/artist3.png";
import rauw from "../assets/artist4.png";
import omar from "../assets/artist5.png";

import "../styles/Artists.css";

const artists = [
  {
    image: badbunny,
    name: "Bad Bunny",
    genre: "Trap / Reggaetón",
    albums: 6,
    country: "Puerto Rico",
  },
  {
    image: justin,
    name: "Justin Bieber",
    genre: "Pop",
    albums: 5,
    country: "Canadá",
  },
  {
    image: bts,
    name: "BTS",
    genre: "K-Pop",
    albums: 7,
    country: "Corea del Sur",
  },
  {
    image: rauw,
    name: "Rauw Alejandro",
    genre: "Reggaetón",
    albums: 4,
    country: "Puerto Rico",
  },
  {
    image: omar,
    name: "Omar Courtz",
    genre: "Urbano Latino",
    albums: 2,
    country: "Puerto Rico",
  },
];

export default function ArtistsPage() {
  return (
    <main className="artists-page">
      <div className="artists-wrapper">
        <Sidebar />

        <section className="artists-main">
          <Topbar />

          <div className="artists-content">
            <div className="artists-header">
              <div>
                <h1>Artistas</h1>
                <p>Administra los artistas registrados en Goosebumps Records.</p>
              </div>

              <button className="btn-add">+ Agregar Artista</button>
            </div>

            <div className="artists-grid">
              {artists.map((artist) => (
                <ArtistCard key={artist.name} {...artist} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}