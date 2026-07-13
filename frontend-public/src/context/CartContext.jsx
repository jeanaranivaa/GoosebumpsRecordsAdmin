import { createContext, useContext, useState, useEffect, useCallback } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((vinyl, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.vinylId === vinyl._id);

      if (existing) {
        return prev.map((item) =>
          item.vinylId === vinyl._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...prev,
        {
          vinylId: vinyl._id,
          title: vinyl.title,
          artist: vinyl.artist,
          price: Number(vinyl.price),
          coverUrl: vinyl.coverUrl,
          quantity,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((vinylId) => {
    setItems((prev) => prev.filter((item) => item.vinylId !== vinylId));
  }, []);

  const updateQuantity = useCallback((vinylId, quantity) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.vinylId === vinylId ? { ...item, quantity } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        totalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }

  return context;
};
