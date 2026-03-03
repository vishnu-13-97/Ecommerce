import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation, Link } from "react-router-dom";

// Map paths to page titles
const pageTitles = {
  "/admin/dashboard": { title: "Dashboard",  icon: "fa-chart-line" },
  "/admin/product":   { title: "Products",   icon: "fa-box-open" },
  "/admin/orders":    { title: "Orders",     icon: "fa-receipt" },
  "/admin/brand":     { title: "Brands",     icon: "fa-tag" },
  "/admin/category":  { title: "Categories", icon: "fa-layer-group" },
  "/admin/user":      { title: "Users",      icon: "fa-users" },
};

export default function AdminTopbar({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const location = useLocation();

  const page = pageTitles[location.pathname] || { title: "Admin", icon: "fa-home" };
  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "A";

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header
      className="d-flex align-items-center justify-content-between px-3 px-lg-4 bg-white"
      style={{
        height: 64,
        borderBottom: "1px solid #e9ecef",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        position: "sticky",
        top: 0,
        zIndex: 1030,
        flexShrink: 0,
      }}
    >
      {/* Left: hamburger + page title */}
      <div className="d-flex align-items-center gap-3">
        {/* Mobile hamburger */}
        <button
          className="btn btn-light btn-sm d-lg-none rounded-3 p-2"
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
        >
          <i className="fas fa-bars" style={{ fontSize: "0.9rem" }}></i>
        </button>

        {/* Page title */}
        <div className="d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center rounded-3"
            style={{
              width: 34, height: 34,
              background: "linear-gradient(135deg, #0d6efd22, #6610f222)",
            }}
          >
            <i className={`fas ${page.icon} text-primary`} style={{ fontSize: "0.85rem" }}></i>
          </div>
          <div>
            <h6 className="fw-bold text-dark mb-0 lh-1" style={{ fontSize: "0.95rem" }}>
              {page.title}
            </h6>
            <p className="text-muted mb-0 lh-1 d-none d-sm-block" style={{ fontSize: "0.68rem" }}>
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* Right: actions + user */}
      <div className="d-flex align-items-center gap-2 gap-md-3">

        {/* Notifications */}
        <button className="btn btn-light btn-sm rounded-3 p-2 position-relative" aria-label="Notifications">
          <i className="fas fa-bell" style={{ fontSize: "0.9rem" }}></i>
          <span
            className="position-absolute bg-danger rounded-circle border border-white"
            style={{ width: 8, height: 8, top: 6, right: 6 }}
          ></span>
        </button>

        {/* View store */}
        <Link
          to="/"
          className="btn btn-light btn-sm rounded-3 px-3 fw-medium d-none d-md-flex align-items-center gap-2 text-decoration-none text-dark"
          style={{ fontSize: "0.82rem" }}
        >
          <i className="fas fa-external-link-alt" style={{ fontSize: "0.75rem" }}></i>
          Store
        </Link>

        {/* User dropdown */}
        <div className="position-relative" ref={dropdownRef}>
          <button
            className="btn p-0 border-0 d-flex align-items-center gap-2"
            onClick={() => setOpen((p) => !p)}
          >
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
              style={{
                width: 36, height: 36, fontSize: "0.8rem",
                background: "linear-gradient(135deg, #0d6efd, #6610f2)",
              }}
            >
              {initials}
            </div>
            <div className="text-start d-none d-md-block">
              <p className="mb-0 fw-semibold text-dark lh-1" style={{ fontSize: "0.82rem" }}>
                {user?.name || "Admin"}
              </p>
              <p className="mb-0 text-muted lh-1" style={{ fontSize: "0.68rem" }}>Administrator</p>
            </div>
            <i className={`fas fa-chevron-${open ? "up" : "down"} text-muted d-none d-md-block`} style={{ fontSize: "0.65rem" }}></i>
          </button>

          {/* Dropdown menu */}
          {open && (
            <div
              className="position-absolute bg-white rounded-4 shadow border-0 py-1 mt-2"
              style={{ right: 0, top: "100%", minWidth: 200, zIndex: 1050 }}
            >
              {/* User info header */}
              <div className="px-3 py-2 border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                    style={{ width: 34, height: 34, fontSize: "0.75rem", background: "linear-gradient(135deg, #0d6efd, #6610f2)" }}
                  >
                    {initials}
                  </div>
                  <div>
                    <p className="mb-0 fw-semibold text-dark small">{user?.name || "Admin"}</p>
                    <p className="mb-0 text-muted" style={{ fontSize: "0.72rem" }}>{user?.email || "admin@ecomm.com"}</p>
                  </div>
                </div>
              </div>

              <div className="py-1">
                <Link
                  to="/profile"
                  className="dropdown-item d-flex align-items-center gap-2 py-2 small"
                  onClick={() => setOpen(false)}
                >
                  <i className="fas fa-user-circle text-primary" style={{ width: 16 }}></i>
                  My Profile
                </Link>
                <Link
                  to="/admin/dashboard"
                  className="dropdown-item d-flex align-items-center gap-2 py-2 small"
                  onClick={() => setOpen(false)}
                >
                  <i className="fas fa-chart-line text-primary" style={{ width: 16 }}></i>
                  Dashboard
                </Link>
              </div>

              <div className="border-top pt-1 pb-1">
                <button
                  onClick={() => { logout(); setOpen(false); }}
                  className="dropdown-item d-flex align-items-center gap-2 py-2 small text-danger"
                >
                  <i className="fas fa-sign-out-alt" style={{ width: 16 }}></i>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}