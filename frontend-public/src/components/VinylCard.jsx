import { ShoppingCart } from "lucide-react";
import Swal from "sweetalert2";
import { useCart } from "../context/CartContext";
import VinylCover from "./VinylCover";
import "../styles/Cards.css";

export default function VinylCard({ vinyl, onOpen }) {
  const { addItem } = useCart();

  const isSoldOut = vinyl.status === "Agotado" || vinyl.stock === 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (isSoldOut) return;
    addItem(vinyl, 1);

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: `${vinyl.title} agregado al carrito`,
      showConfirmButton: false,
      timer: 1800,
      background: "#14162a",
      color: "#ffffff",
    });
  };

  return (
    <article className="vinyl-card" onClick={() => onOpen?.(vinyl)}>
      <div className="vinyl-card-cover">
        <VinylCover src={vinyl.coverUrl} alt={vinyl.title} />

        {isSoldOut && <span className="vinyl-card-soldout">Agotado</span>}

        <button
          className="vinyl-card-add"
          onClick={handleAdd}
          disabled={isSoldOut}
          title="Agregar al carrito"
        >
          <ShoppingCart size={16} />
        </button>
      </div>

      <div className="vinyl-card-body">
        <h4 title={vinyl.title}>{vinyl.title}</h4>
        <p>{vinyl.artist}</p>
        <span className="vinyl-card-price">
          ${Number(vinyl.price).toFixed(2)}
        </span>
      </div>
    </article>
  );
}
