import "../styles/Cards.css";

export default function DashboardCard({
  title,
  value,
  subtitle,
  range,
  onRangeChange,
  children,
}) {
  return (
    <div className="dashboard-card">
      <div className="card-header">
        <div>
          <p>{title}</p>
          <h2>{value}</h2>
          <span>{subtitle}</span>
        </div>

        {onRangeChange && (
          <select
            value={range}
            onChange={(e) => onRangeChange(e.target.value)}
          >
            <option value="all">Todo</option>
            <option value="month">Último mes</option>
            <option value="week">Última semana</option>
          </select>
        )}
      </div>

      <div className="card-content">{children}</div>
    </div>
  );
}