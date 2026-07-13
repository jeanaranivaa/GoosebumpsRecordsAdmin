import { Menu, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import userImg from "../assets/user.png";
import "../styles/Topbar.css";

export default function Topbar({ search = "", onSearch }) {
  const { user } = useAuth();

  const openSidebar = () => {
    document.body.classList.remove("sidebar-collapsed");
  };

  return (
    <header className="store-topbar">
      <div className="store-topbar-left">
        <button className="store-topbar-menu-btn" onClick={openSidebar}>
          <Menu size={24} />
        </button>

        <div className="store-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar"
            value={search}
            onChange={(e) => onSearch?.(e.target.value)}
            disabled={!onSearch}
          />
        </div>
      </div>

      <div className="store-topbar-right">
        <div className="store-topbar-user">
          <img src={user?.imageURL || userImg} alt="Usuario" />
          <span>{user?.fullName || "Invitado"}</span>
        </div>
      </div>
    </header>
  );
}
