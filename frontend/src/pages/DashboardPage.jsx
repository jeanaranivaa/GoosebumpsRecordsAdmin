import { useEffect, useMemo, useState } from "react";
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

import "../styles/Dashboard.css";

const POPULAR_URL = "http://localhost:4000/api/vinyls/popular?limit=6";
const STATS_URL = "http://localhost:4000/api/orders/stats";

const GENRE_COLORS = [
  "#7b8cff",
  "#ef5da8",
  "#b45cff",
  "#5ad1e6",
  "#ffb84d",
  "#6ee7a8",
];

const formatMoney = (value) =>
  `$${Number(value || 0).toLocaleString("es-SV", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function DashboardPage() {
  const [popular, setPopular] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [popularError, setPopularError] = useState("");

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState("");
  const [range, setRange] = useState("all");

  useEffect(() => {
    const getStats = async () => {
      try {
        setLoadingStats(true);
        setStatsError("");

        const response = await fetch(`${STATS_URL}?range=${range}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Error al cargar estadísticas");
        }

        setStats(data);
      } catch (error) {
        console.log("Error al cargar estadísticas:", error);
        setStatsError("No se pudieron cargar las estadísticas");
      } finally {
        setLoadingStats(false);
      }
    };

    getStats();
  }, [range]);

  useEffect(() => {
    const getPopular = async () => {
      try {
        setLoadingPopular(true);
        setPopularError("");

        const response = await fetch(POPULAR_URL);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Error al cargar vinilos populares");
        }

        setPopular(data);
      } catch (error) {
        console.log("Error al cargar vinilos populares:", error);
        setPopularError("No se pudieron cargar los vinilos más populares");
      } finally {
        setLoadingPopular(false);
      }
    };

    getPopular();
  }, []);

  const genreData = useMemo(
    () =>
      (stats?.byGenre || []).map((item) => ({
        name: item.genre,
        value: item.unitsSold,
      })),
    [stats]
  );

  const monthData = useMemo(
    () =>
      (stats?.byMonth || []).map((item) => ({
        name: item.label,
        value: item.revenue,
      })),
    [stats]
  );

  const monthlyRevenue = useMemo(
    () =>
      (stats?.byMonth || []).reduce((total, item) => total + item.revenue, 0),
    [stats]
  );

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
              <DashboardCard
                title="VENTAS POR GÉNERO"
                value={formatMoney(stats?.totalRevenue)}
                subtitle={`${stats?.totalOrders || 0} ${
                  stats?.totalOrders === 1 ? "orden" : "órdenes"
                }`}
                range={range}
                onRangeChange={setRange}
              >
                {loadingStats && <p>Cargando...</p>}

                {statsError && <p className="dashboard-error">{statsError}</p>}

                {!loadingStats && !statsError && (
                  genreData.length === 0 ? (
                    <p>Sin ventas en este período.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={genreData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={42}
                          outerRadius={70}
                        >
                          {genreData.map((genre, index) => (
                            <Cell
                              key={genre.name}
                              fill={GENRE_COLORS[index % GENRE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [
                            `${value} ${value === 1 ? "unidad" : "unidades"}`,
                            name,
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )
                )}
              </DashboardCard>

              <DashboardCard
                title="INGRESOS POR MES"
                value={formatMoney(monthlyRevenue)}
                subtitle="Últimos 6 meses"
              >
                {loadingStats && <p>Cargando...</p>}

                {statsError && <p className="dashboard-error">{statsError}</p>}

                {!loadingStats && !statsError && (
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={monthData}>
                      <XAxis dataKey="name" stroke="#9ca3ff" />
                      <YAxis stroke="#9ca3ff" />
                      <Tooltip
                        formatter={(value) => [formatMoney(value), "Ingresos"]}
                      />
                      <Bar
                        dataKey="value"
                        fill="#8c9cff"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </DashboardCard>
            </div>

            <section className="albums-section">
              <h2>Vinilos Más Populares</h2>
              <p>Vinilos más vendidos según las órdenes registradas</p>

              {loadingPopular && <p>Cargando vinilos populares...</p>}

              {popularError && <p className="dashboard-error">{popularError}</p>}

              {!loadingPopular && !popularError && (
                popular.length === 0 ? (
                  <p>Aún no hay ventas para calcular los más populares.</p>
                ) : (
                  <div className="albums-grid">
                    {popular.map((vinyl) => (
                      <AlbumCard
                        key={vinyl._id}
                        image={vinyl.coverUrl}
                        title={vinyl.title}
                        artist={vinyl.artist}
                        unitsSold={vinyl.unitsSold}
                      />
                    ))}
                  </div>
                )
              )}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}