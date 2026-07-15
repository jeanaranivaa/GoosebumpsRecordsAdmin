import { Minus, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";
import VinylCover from "./VinylCover";

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="cart-item">
      <div className="cart-item-cover">
        <VinylCover src={item.coverUrl} alt={item.title} />
      </div>

      <div className="cart-item-info">
        <h4>{item.title}</h4>
        <p>{item.artist}</p>
        <button
          className="cart-item-remove"
          onClick={() => removeItem(item.vinylId)}
        >
          Eliminar
        </button>
      </div>

      <div className="cart-item-qty">
        <button onClick={() => updateQuantity(item.vinylId, item.quantity - 1)}>
          <Minus size={14} />
        </button>
        <span>{item.quantity}</span>
        <button onClick={() => updateQuantity(item.vinylId, item.quantity + 1)}>
          <Plus size={14} />
        </button>
      </div>

      <div className="cart-item-price">
        ${(item.price * item.quantity).toFixed(2)}
      </div>
    </div>
  );
}
