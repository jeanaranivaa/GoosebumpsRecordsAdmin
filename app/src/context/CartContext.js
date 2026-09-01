import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "cart";

/**
 * Carrito de compras persistente. Guarda una copia local de cada vinilo
 * (título, artista, precio y portada) para poder mostrarlo sin volver
 * a consultar la API.
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);

  useEffect(() => {
    const restoreCart = async () => {
      try {
        const stored = await AsyncStorage.getItem(CART_STORAGE_KEY);

        if (stored) {
          setItems(JSON.parse(stored));
        }
      } catch (error) {
        console.log("No se pudo restaurar el carrito:", error);
      } finally {
        setLoadingCart(false);
      }
    };

    restoreCart();
  }, []);

  // Se guarda hasta terminar de restaurar, para no sobrescribir con []
  useEffect(() => {
    if (loadingCart) return;

    AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, loadingCart]);

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
          stock: vinyl.stock,
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

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const totalCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

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

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }

  return context;
};
