import { Menu, Search, Bell } from "lucide-react";
import userImg from "../assets/user.png";
import "../styles/Topbar.css";

export default function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-btn">
          <Menu size={26} />
        </button>

        <div className="search-box">
          <Search size={16} />
          <input type="text" placeholder="Buscar" />
        </div>
      </div>

      <div className="topbar-right">
        <Bell size={22} />
        <div className="topbar-user">
          <img src={userImg} alt="Usuario" />
          <span>Jeancarlo Araniva</span>
        </div>
      </div>
    </header>
  );
}