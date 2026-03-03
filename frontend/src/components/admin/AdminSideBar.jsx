import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard",   path: "/admin/dashboard", icon: "fa-chart-line" },
  { name: "Products",    path: "/admin/product",   icon: "fa-box-open" },
  { name: "Orders",      path: "/admin/orders",    icon: "fa-receipt" },
  { name: "Brands",      path: "/admin/brand",     icon: "fa-tag" },
  { name: "Categories",  path: "/admin/category",  icon: "fa-layer-group" },
  { name: "Users",       path: "/admin/user",      icon: "fa-users" },
];

export default function AdminSidebar({ open, onClose }) {
  return (
    <aside
      className={`d-flex flex-column flex-shrink-0 position-sticky position-lg-relative ${open ? "translate-x-0" : ""}`}
      style={{
        width: 260,
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
        zIndex: 1045,
        transform: open ? "translateX(0)" : undefined,
        transition: "transform 0.3s ease",
        // On desktop always visible; on mobile slide in
      }}
    >
      {/* Logo area */}
      <div
        className="d-flex align-items-center justify-content-between px-4 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-3"
            style={{
              width: 38, height: 38,
              background: "linear-gradient(135deg, #0d6efd, #6610f2)",
            }}
          >
            <i className="fas fa-store text-white" style={{ fontSize: "0.9rem" }}></i>
          </div>
          <div>
            <p className="fw-bold text-white mb-0 lh-1" style={{ fontSize: "0.95rem" }}>Ecomm</p>
            <p className="mb-0 lh-1" style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>
              ADMIN PANEL
            </p>
          </div>
        </div>
        {/* Close on mobile */}
        <button
          className="btn btn-link d-lg-none p-0 text-white opacity-50"
          onClick={onClose}
          style={{ fontSize: "1.1rem" }}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Nav section */}
      <div className="flex-grow-1 px-3 py-3 overflow-auto">
        <p
          className="px-2 mb-2 text-uppercase fw-semibold"
          style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em" }}
        >
          Main Menu
        </p>

        <nav className="d-flex flex-column gap-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none fw-medium ${
                  isActive
                    ? "text-white"
                    : "text-white"
                }`
              }
              style={({ isActive }) => ({
                fontSize: "0.88rem",
                background: isActive
                  ? "linear-gradient(135deg, rgba(13,110,253,0.7), rgba(102,16,242,0.5))"
                  : "transparent",
                color: isActive ? "#fff" : "rgba(255,255,255,0.55)",
                transition: "all 0.15s",
              })}
              onMouseEnter={(e) => {
                if (!e.currentTarget.classList.contains("active"))
                  e.currentTarget.style.background = "rgba(255,255,255,0.07)";
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.style.background.includes("gradient"))
                  e.currentTarget.style.background = "transparent";
              }}
            >
              {({ isActive }) => (
                <>
                  <div
                    className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                    style={{
                      width: 30, height: 30,
                      background: isActive ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)",
                    }}
                  >
                    <i
                      className={`fas ${item.icon}`}
                      style={{
                        fontSize: "0.78rem",
                        color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
                      }}
                    ></i>
                  </div>
                  <span style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.6)" }}>
                    {item.name}
                  </span>
                  {isActive && (
                    <span
                      className="ms-auto rounded-circle bg-white"
                      style={{ width: 6, height: 6, opacity: 0.7 }}
                    ></span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Divider */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", margin: "1rem 0.5rem" }}></div>

        <p
          className="px-2 mb-2 text-uppercase fw-semibold"
          style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em" }}
        >
          Store
        </p>

        <NavLink
          to="/"
          className="d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none fw-medium"
          style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.55)", transition: "all 0.15s" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          <div
            className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
            style={{ width: 30, height: 30, background: "rgba(255,255,255,0.06)" }}
          >
            <i className="fas fa-external-link-alt" style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)" }}></i>
          </div>
          <span>View Store</span>
        </NavLink>
      </div>

      {/* Bottom user strip */}
      <div
        className="px-4 py-3 d-flex align-items-center gap-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div
          className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
          style={{ width: 32, height: 32, background: "linear-gradient(135deg,#0d6efd,#6610f2)", fontSize: "0.75rem", color: "#fff" }}
        >
          A
        </div>
        <div className="min-width-0">
          <p className="mb-0 fw-semibold text-white text-truncate" style={{ fontSize: "0.8rem" }}>Admin</p>
          <p className="mb-0 text-truncate" style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)" }}>admin@ecomm.com</p>
        </div>
      </div>
    </aside>
  );
}