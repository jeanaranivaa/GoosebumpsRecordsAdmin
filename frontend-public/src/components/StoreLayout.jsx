import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../styles/Layout.css";

export default function StoreLayout({ children, search, onSearch }) {
  return (
    <main className="store-page">
      <div className="store-wrapper">
        <Sidebar />

        <section className="store-main">
          <Topbar search={search} onSearch={onSearch} />

          <div className="store-content">{children}</div>
        </section>
      </div>
    </main>
  );
}
