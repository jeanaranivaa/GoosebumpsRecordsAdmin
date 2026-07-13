import { useState } from "react";
import { X, Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import "../styles/Modal.css";

export default function VinylModal({ vinyl, onClose }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!vinyl) return null;

  const isSoldOut = vinyl.status === "Agotado" || vinyl.stock === 0;
  const maxStock = vinyl.stock || 99;

  const decrease = () => setQuantity((q) => Math.max(1, q - 1));
  const increase = () => setQuantity((q) => Math.min(maxStock, q + 1));

  const handleAdd = () => {
    if (isSoldOut) return;
    addItem(vinyl, quantity);
    setAdded(true);
    setTimeout(onClose, 700);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-body">
          <div className="modal-cover">
            {vinyl.coverUrl ? (
              <img src={vinyl.coverUrl} alt={vinyl.title} />
            ) : (
              <span className="vinyl-card-placeholder">♪</span>
            )}
          </div>

          <div className="modal-info">
            <span className="modal-genre">{vinyl.genre}</span>
            <h2>{vinyl.title}</h2>
            <p className="modal-artist">{vinyl.artist}</p>

            <p className="modal-description">{vinyl.description}</p>

            <div className="modal-meta">
              <span className="modal-price">
                ${Number(vinyl.price).toFixed(2)}
              </span>
              <span
                className={`modal-stock ${isSoldOut ? "out" : ""}`}
              >
                {isSoldOut ? "Agotado" : `${vinyl.stock} en stock`}
              </span>
            </div>

            {!isSoldOut && (
              <div className="modal-quantity">
                <button onClick={decrease}>
                  <Minus size={16} />
                </button>
                <span>{quantity}</span>
                <button onClick={increase}>
                  <Plus size={16} />
                </button>
              </div>
            )}

            <button
              className="modal-add-btn"
              onClick={handleAdd}
              disabled={isSoldOut || added}
            >
              <ShoppingCart size={18} />
              {added
                ? "¡Agregado!"
                : isSoldOut
                ? "No disponible"
                : "Agregar al carrito"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
