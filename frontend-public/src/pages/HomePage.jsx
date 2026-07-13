import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Tag } from "lucide-react";
import StoreLayout from "../components/StoreLayout";
import VinylCard from "../components/VinylCard";
import VinylModal from "../components/VinylModal";
import { useVinyls } from "../hooks/vinyls/useVinyls";
import heroImg from "../assets/hero.png";
import "../styles/Home.css";

export default function HomePage() {
  const { vinyls, loading } = useVinyls();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return vinyls;

    return vinyls.filter(
      (v) =>
        v.title?.toLowerCase().includes(query) ||
        v.artist?.toLowerCase().includes(query) ||
        v.genre?.toLowerCase().includes(query)
    );
  }, [vinyls, search]);

  return (
    <StoreLayout search={search} onSearch={setSearch}>
      {/* Hero */}
      <section
        className="home-hero"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="home-hero-overlay" />

        <div className="home-hero-content">
          <h1>
            Descubre el sonido <br /> auténtico del vinilo
          </h1>
          <p>
            Haz que tus discos favoritos se presenten como deben sonar con la{" "}
            <span>calidez</span> que sólo el <span>vinilo</span> ofrece.
          </p>

          <div className="home-hero-actions">
            <button
              className="home-btn-primary"
              onClick={() =>
                document
                  .getElementById("popular")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explorar Vinilos <ArrowRight size={18} />
            </button>

            <button
              className="home-btn-ghost"
              onClick={() => navigate("/categories")}
            >
              <Tag size={18} /> Ver Categorías
            </button>
          </div>
        </div>
      </section>

      {/* Populares */}
      <section id="popular" className="home-section">
        <div className="home-section-head">
          <h2>
            Vinilos <span>Más Populares</span>
          </h2>
          <button
            className="home-see-more"
            onClick={() => navigate("/categories")}
          >
            Ver más <ArrowRight size={16} />
          </button>
        </div>

        {loading ? (
          <p className="home-empty">Cargando vinilos...</p>
        ) : filtered.length === 0 ? (
          <p className="home-empty">
            No se encontraron vinilos{search ? ` para "${search}"` : ""}.
          </p>
        ) : (
          <div className="vinyl-grid">
            {filtered.map((vinyl) => (
              <VinylCard
                key={vinyl._id}
                vinyl={vinyl}
                onOpen={setSelected}
              />
            ))}
          </div>
        )}
      </section>

      {selected && (
        <VinylModal vinyl={selected} onClose={() => setSelected(null)} />
      )}
    </StoreLayout>
  );
}
