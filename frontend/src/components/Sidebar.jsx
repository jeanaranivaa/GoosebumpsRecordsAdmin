import {
  LayoutDashboard,
  Disc3,
  Mic2,
  ShoppingCart,
  Users,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import userImg from "../assets/user.png";
import "../styles/Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
    },
    {
      name: "Vinilos",
      icon: <Disc3 size={20} />,
      path: "/vinyls",
    },
    {
      name: "Artistas",
      icon: <Mic2 size={20} />,
      path: "/artists",
    },
    {
      name: "Órdenes",
      icon: <ShoppingCart size={20} />,
      path: "/orders",
    },
    {
      name: "Usuarios",
      icon: <Users size={20} />,
      path: "/users",
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-user">
        <img src={userImg} alt="Usuario" />
        <h3>Jeancarlo Araniva</h3>
        <p>Administrador</p>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`sidebar-item ${isActive ? "active" : ""}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}