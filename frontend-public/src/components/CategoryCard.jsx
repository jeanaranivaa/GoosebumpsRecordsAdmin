import "../styles/Categories.css";

// Paleta de degradados por índice para las tarjetas de categoría
const gradients = [
  "linear-gradient(135deg, #7c3aed, #db2777)",
  "linear-gradient(135deg, #2563eb, #7c3aed)",
  "linear-gradient(135deg, #d97706, #dc2626)",
  "linear-gradient(135deg, #0891b2, #7c3aed)",
  "linear-gradient(135deg, #db2777, #f59e0b)",
  "linear-gradient(135deg, #4f46e5, #06b6d4)",
];

export default function CategoryCard({ name, count, index = 0, onSelect }) {
  return (
    <button
      className="category-card"
      style={{ background: gradients[index % gradients.length] }}
      onClick={() => onSelect?.(name)}
    >
      <div className="category-card-overlay" />
      <div className="category-card-content">
        <h3>{name}</h3>
        <span>{count} {count === 1 ? "vinilo" : "vinilos"}</span>
      </div>
    </button>
  );
}
