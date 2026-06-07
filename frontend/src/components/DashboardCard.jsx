import "../styles/Cards.css";

export default function DashboardCard({ title, value, subtitle, children }) {
  return (
    <div className="dashboard-card">
      <div className="card-header">
        <div>
          <p>{title}</p>
          <h2>{value}</h2>
          <span>{subtitle}</span>
        </div>

        <select>
          <option>This Week</option>
          <option>This Month</option>
        </select>
      </div>

      <div className="card-content">{children}</div>
    </div>
  );
}