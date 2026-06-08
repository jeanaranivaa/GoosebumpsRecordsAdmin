import { Menu, Bell } from "lucide-react";
import userImg from "../assets/user.png";
import "../styles/Topbar.css";

export default function Topbar() {
  const openSidebar = () => {
    document.body.classList.remove("sidebar-collapsed");
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="topbar-menu-btn" onClick={openSidebar}>
          <Menu size={26} />
        </button>

      
      </div>

      <div className="topbar-right">
        <button className="topbar-icon-btn">
          <Bell size={21} />
        </button>

        <div className="topbar-user">
          <img src={userImg} alt="Usuario" />
          <span>Jeancarlo Araniva</span>
        </div>
      </div>
    </header>
  );
}