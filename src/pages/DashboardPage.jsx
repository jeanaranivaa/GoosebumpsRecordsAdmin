import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import DashboardCard from "../components/DashboardCard";
import AlbumCard from "../components/AlbumCard";

import album1 from "../assets/album1.jpg";
import album2 from "../assets/album2.png";
import album3 from "../assets/album3.jpg";
import album4 from "../assets/album4.png";
import album5 from "../assets/album5.png";
import album6 from "../assets/album6.jpg";

import "../styles/Dashboard.css";

const pieData = [
  { name: "Pop", value: 50 },
  { name: "Trap", value: 35 },
  { name: "Rock", value: 15 },
];

const barData = [
  { name: "Q1", value: 20 },
  { name: "Q2", value: 45 },
  { name: "Q3", value: 60 },
  { name: "Q4", value: 35 },
  { name: "Q5", value: 55 },
  { name: "Q6", value: 30 },
  { name: "Q7", value: 48 },
  { name: "Q8", value: 70 },
];

const albums = [
  { image: album4, title: "Debí Tirar Más Fotos", artist: "Bad Bunny" },
  { image: album6, title: "Por Si Mañana No Estoy", artist: "Omar Courtz" },
  { image: album5, title: "Vice Versa", artist: "Rauw Alejandro" },
  { image: album2, title: "Justice", artist: "Justin Bieber" },
  { image: album3, title: "Wings", artist: "BTS" },
  { image: album1, title: "Un Verano Sin Ti", artist: "Bad Bunny" },
];

export default function DashboardPage() {
  return (
    <main className="dashboard-page">
      <div className="dashboard-wrapper">
        <Sidebar />

        <section className="dashboard-main">
          <Topbar />

          <div className="dashboard-content">
            <div className="dashboard-welcome">
              <h1>¡Bienvenido a Goosebumps Records!</h1>
              <p>Hola Jeancarlo, gracias por volver.</p>
            </div>

            <div className="charts-grid">
              <DashboardCard title="CHART TITLE" value="5.000,00" subtitle="50 Orders">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={70}
                    >
                      <Cell fill="#7b8cff" />
                      <Cell fill="#ef5da8" />
                      <Cell fill="#b45cff" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </DashboardCard>

              <DashboardCard title="CHART TITLE" value="5.000,00" subtitle="50 Orders">
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={barData}>
                    <XAxis dataKey="name" stroke="#9ca3ff" />
                    <YAxis stroke="#9ca3ff" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8c9cff" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </DashboardCard>
            </div>

            <section className="albums-section">
              <h2>Vinilos Más Populares</h2>
              <p>Vinilos más vendidos de la semana</p>

              <div className="albums-grid">
                {albums.map((album) => (
                  <AlbumCard
                    key={album.title}
                    image={album.image}
                    title={album.title}
                    artist={album.artist}
                  />
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}