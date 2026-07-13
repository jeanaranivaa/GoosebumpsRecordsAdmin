import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import Swal from "sweetalert2";
import StoreLayout from "../components/StoreLayout";
import CartItem from "../components/CartItem";
import CheckoutModal from "../components/CheckoutModal";
import VinylCard from "../components/VinylCard";
import VinylModal from "../components/VinylModal";
import { useCart } from "../context/CartContext";
import { useVinyls } from "../hooks/vinyls/useVinyls";
import "../styles/Cart.css";

const COUPONS = { GOOSE10: 0.1, VINILO20: 0.2 };

export default function CartPage() {
  const { items, subtotal, clearCart } = useCart();
  const { vinyls } = useVinyls();
  const navigate = useNavigate();

  const [checkout, setCheckout] = useState(false);
  const [selected, setSelected] = useState(null);
  const [coupon, setCoupon] = useState("");
  const [discountRate, setDiscountRate] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");

  const discount = subtotal * discountRate;
  const total = subtotal - discount;

  const recommendations = useMemo(() => {
    const inCart = new Set(items.map((i) => i.vinylId));
    return vinyls.filter((v) => !inCart.has(v._id)).slice(0, 6);
  }, [vinyls, items]);

  const applyCoupon = () => {
    const rate = COUPONS[coupon.trim().toUpperCase()];

    if (rate) {
      setDiscountRate(rate);
      setCouponMsg(`Cupón aplicado: ${rate * 100}% de descuento`);
    } else {
      setDiscountRate(0);
      setCouponMsg("Cupón inválido");
    }
  };

  const handleSuccess = () => {
    setCheckout(false);
    clearCart();

    Swal.fire({
      icon: "success",
      title: "¡Compra realizada!",
      text: "Tu pedido fue registrado correctamente.",
      background: "#14162a",
      color: "#ffffff",
      confirmButtonColor: "#ec4899",
    }).then(() => navigate("/home"));
  };

  return (
    <StoreLayout>
      <h1 className="cart-title">Carrito</h1>

      {items.length === 0 ? (
        <div className="cart-empty">
          <ShoppingCart size={48} />
          <p>Tu carrito está vacío.</p>
          <button onClick={() => navigate("/home")}>Explorar vinilos</button>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Lista de productos */}
          <div className="cart-items">
            {items.map((item) => (
              <CartItem key={item.vinylId} item={item} />
            ))}

            <div className="cart-items-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Resumen del pedido */}
          <aside className="cart-summary">
            <h3>Resumen del Pedido</h3>

            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="cart-summary-row">
              <span>Descuento</span>
              <span>-${discount.toFixed(2)}</span>
            </div>

            <div className="cart-summary-row">
              <span>Envío</span>
              <span className="cart-free">Gratis</span>
            </div>

            <div className="cart-summary-total">
              <span>Total <small>(IVA incluido)</small></span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="cart-coupon">
              <input
                type="text"
                placeholder="Ingrese el cupón"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button onClick={applyCoupon}>Aplicar</button>
            </div>

            {couponMsg && (
              <p
                className={`cart-coupon-msg ${
                  discountRate ? "ok" : "bad"
                }`}
              >
                {couponMsg}
              </p>
            )}

            <button
              className="cart-checkout-btn"
              onClick={() => setCheckout(true)}
            >
              Finalizar Compra
            </button>

            <p className="cart-payment-note">VISA · Mastercard · PayPal</p>
          </aside>
        </div>
      )}

      {/* Recomendaciones */}
      {recommendations.length > 0 && (
        <section className="cart-recommend">
          <h2>También te pueden interesar</h2>
          <div className="vinyl-grid">
            {recommendations.map((vinyl) => (
              <VinylCard key={vinyl._id} vinyl={vinyl} onOpen={setSelected} />
            ))}
          </div>
        </section>
      )}

      {checkout && (
        <CheckoutModal
          onClose={() => setCheckout(false)}
          onSuccess={handleSuccess}
        />
      )}

      {selected && (
        <VinylModal vinyl={selected} onClose={() => setSelected(null)} />
      )}
    </StoreLayout>
  );
}
