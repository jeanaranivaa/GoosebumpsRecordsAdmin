import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import VinylCard from "../components/VinylCard";

import album1 from "../assets/album1.jpg";
import album2 from "../assets/album2.png";
import album3 from "../assets/album3.jpg";
import album4 from "../assets/album4.png";
import album5 from "../assets/album5.png";
import album6 from "../assets/album6.jpg";

import "../styles/Vinyls.css";

const vinyls = [
  { image: album1, title: "Un Verano Sin Ti", artist: "Bad Bunny", price: 35, stock: 12 },
  { image: album2, title: "Justice", artist: "Justin Bieber", price: 28, stock: 8 },
  { image: album3, title: "Wings", artist: "BTS", price: 40, stock: 15 },
  { image: album4, title: "Debí Tirar Más Fotos", artist: "Bad Bunny", price: 30, stock: 10 },
  { image: album5, title: "Vice Versa", artist: "Rauw Alejandro", price: 32, stock: 6 },
  { image: album6, title: "Por Si Mañana No Estoy", artist: "Omar Courtz", price: 27, stock: 9 },
];

export default function VinylsPage() {
  return (
    <div className="vinyls-page">
      <div className="vinyls-wrapper">
        <Sidebar />

        <div className="vinyls-main">
          <Topbar />

          <div className="vinyls-content">
            <div className="vinyls-header">
              <div>
                <h1>Vinilos</h1>
                <p>Gestiona el catálogo de discos disponibles.</p>
              </div>

              <button className="btn-add">+ Agregar Vinilo</button>
            </div>

            <div className="vinyls-grid">
              {vinyls.map((vinyl) => (
                <VinylCard key={vinyl.title} {...vinyl} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}