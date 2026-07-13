import { useState, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import StoreLayout from "../components/StoreLayout";
import CategoryCard from "../components/CategoryCard";
import VinylCard from "../components/VinylCard";
import VinylModal from "../components/VinylModal";
import { useVinyls } from "../hooks/vinyls/useVinyls";
import "../styles/Categories.css";

export default function CategoriesPage() {
  const { vinyls, loading } = useVinyls();
  const [active, setActive] = useState(null);
  const [selected, setSelected] = useState(null);

  // Agrupa los vinilos por género para armar las categorías dinámicamente
  const categories = useMemo(() => {
    const map = new Map();

    vinyls.forEach((v) => {
      const genre = v.genre?.trim() || "Otros";
      map.set(genre, (map.get(genre) || 0) + 1);
    });

    return Array.from(map, ([name, count]) => ({ name, count }));
  }, [vinyls]);

  const vinylsInCategory = useMemo(
    () =>
      active
        ? vinyls.filter(
            (v) => (v.genre?.trim() || "Otros") === active
          )
        : [],
    [vinyls, active]
  );

  return (
    <StoreLayout>
      {!active ? (
        <>
          <div className="categories-head">
            <h1>Categorías</h1>
          </div>

          {loading ? (
            <p className="home-empty">Cargando categorías...</p>
          ) : categories.length === 0 ? (
            <p className="home-empty">Aún no hay categorías disponibles.</p>
          ) : (
            <div className="categories-grid">
              {categories.map((cat, i) => (
                <CategoryCard
                  key={cat.name}
                  name={cat.name}
                  count={cat.count}
                  index={i}
                  onSelect={setActive}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="categories-head">
            <button
              className="categories-back"
              onClick={() => setActive(null)}
            >
              <ArrowLeft size={18} /> Categorías
            </button>
            <h1>{active}</h1>
          </div>

          {vinylsInCategory.length === 0 ? (
            <p className="home-empty">No hay vinilos en esta categoría.</p>
          ) : (
            <div className="vinyl-grid">
              {vinylsInCategory.map((vinyl) => (
                <VinylCard
                  key={vinyl._id}
                  vinyl={vinyl}
                  onOpen={setSelected}
                />
              ))}
            </div>
          )}
        </>
      )}

      {selected && (
        <VinylModal vinyl={selected} onClose={() => setSelected(null)} />
      )}
    </StoreLayout>
  );
}
