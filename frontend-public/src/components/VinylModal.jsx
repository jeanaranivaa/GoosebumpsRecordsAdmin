import { useState } from "react";
import { X, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useReviews } from "../hooks/reviews/useReviews";
import VinylCover from "./VinylCover";
import "../styles/Modal.css";

function Stars({ value, size = 14, onSelect }) {
  return (
    <span className="review-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= value ? "star filled" : "star"}
          onClick={onSelect ? () => onSelect(star) : undefined}
          style={onSelect ? { cursor: "pointer" } : undefined}
        />
      ))}
    </span>
  );
}

export default function VinylModal({ vinyl, onClose }) {
  const { addItem } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { reviews, average, total, saveReview } = useReviews(vinyl?._id);

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [reviewMsg, setReviewMsg] = useState(null);
  const [savingReview, setSavingReview] = useState(false);

  if (!vinyl) return null;

  const handleSaveReview = async (e) => {
    e.preventDefault();

    if (savingReview || myRating === 0) return;

    try {
      setSavingReview(true);
      setReviewMsg(null);

      await saveReview({
        userId: user.id,
        rating: myRating,
        comment: myComment,
      });

      setReviewMsg({ ok: true, text: "¡Gracias por tu reseña!" });
      setMyRating(0);
      setMyComment("");
    } catch (err) {
      setReviewMsg({
        ok: false,
        text:
          err.response?.data?.message || "No se pudo guardar la reseña",
      });
    } finally {
      setSavingReview(false);
    }
  };

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
            <VinylCover src={vinyl.coverUrl} alt={vinyl.title} />
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

            {/* Valoraciones */}
            <div className="modal-reviews">
              <div className="modal-reviews-head">
                <h3>Valoraciones</h3>
                <span className="modal-reviews-avg">
                  <Stars value={Math.round(average)} />
                  {total > 0
                    ? `${average} · ${total} ${total === 1 ? "reseña" : "reseñas"}`
                    : "Sin reseñas aún"}
                </span>
              </div>

              {reviews.length > 0 && (
                <ul className="modal-reviews-list">
                  {reviews.map((review) => (
                    <li key={review._id}>
                      <div className="modal-review-top">
                        <strong>
                          {review.userId?.fullName || "Cliente"}
                        </strong>
                        <Stars value={review.rating} size={12} />
                      </div>
                      {review.comment && <p>{review.comment}</p>}
                    </li>
                  ))}
                </ul>
              )}

              {isAuthenticated ? (
                <form className="modal-review-form" onSubmit={handleSaveReview}>
                  <div className="modal-review-top">
                    <span>Tu calificación:</span>
                    <Stars value={myRating} size={18} onSelect={setMyRating} />
                  </div>

                  <textarea
                    rows={2}
                    maxLength={500}
                    placeholder="Cuéntanos qué te pareció (opcional)"
                    value={myComment}
                    onChange={(e) => setMyComment(e.target.value)}
                  />

                  {reviewMsg && (
                    <p className={reviewMsg.ok ? "review-ok" : "review-bad"}>
                      {reviewMsg.text}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={savingReview || myRating === 0}
                  >
                    {savingReview ? "Guardando..." : "Enviar reseña"}
                  </button>
                </form>
              ) : (
                <p className="modal-reviews-login">
                  Inicia sesión y compra este vinilo para valorarlo.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
