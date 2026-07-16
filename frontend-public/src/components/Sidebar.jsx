import { Disc3, LayoutGrid, ShoppingCart, Package, X, LogOut, LogIn } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import userImg from "../assets/user.png";
import "../styles/Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalCount } = useCart();

  const closeSidebar = () => {
    document.body.classList.add("sidebar-collapsed");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { name: "Inicio", icon: <Disc3 size={20} />, path: "/home" },
    { name: "Categorías", icon: <LayoutGrid size={20} />, path: "/categories" },
    { name: "Carrito", icon: <ShoppingCart size={20} />, path: "/cart" },
    { name: "Mis Pedidos", icon: <Package size={20} />, path: "/my-orders" },
  ];

  return (
    <aside className="store-sidebar">
      <div className="store-sidebar-top">
        <button className="store-sidebar-close-btn" onClick={closeSidebar}>
          <X size={22} />
        </button>

        <div className="store-sidebar-user">
          <img src={user?.imageURL || userImg} alt="Usuario" />
          <h3>{user?.fullName || "Invitado"}</h3>
          <p>{isAuthenticated ? "Usuario" : "Sin sesión"}</p>
        </div>
      </div>

      <nav className="store-sidebar-menu">
        <span className="store-sidebar-label">Dashboard</span>

        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`store-sidebar-item ${isActive ? "active" : ""}`}
              title={item.name}
            >
              {item.icon}
              <span>{item.name}</span>

              {item.name === "Carrito" && totalCount > 0 && (
                <span className="store-cart-badge">{totalCount}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="store-sidebar-footer">
        {isAuthenticated ? (
          <button
            className="store-sidebar-logout-btn"
            onClick={handleLogout}
            title="Cerrar sesión"
          >
            <LogOut size={20} />
            <span>Cerrar sesión</span>
          </button>
        ) : (
          <button
            className="store-sidebar-login-btn"
            onClick={() => navigate("/login")}
            title="Iniciar sesión"
          >
            <LogIn size={20} />
            <span>Iniciar sesión</span>
          </button>
        )}
      </div>
    </aside>
  );
}
