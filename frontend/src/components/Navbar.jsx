import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const { cartCount } = useCart();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleUserMenu = () => setOpenUserMenu((prev) => !prev);

  const handleLogout = async () => {
    try {
      await logout();
      setOpenUserMenu(false);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const UserDropdownMenu = () => (
    <div
      className="dropdown-menu show shadow border-0 rounded-3 mt-2"
      style={{ right: 0, left: "auto", minWidth: "210px" }}
    >
      {user ? (
        <>
          <div className="px-3 py-2 border-bottom bg-light rounded-top-3">
            <p className="mb-0 fw-semibold text-dark small">👋 {user.name}</p>
            <p className="mb-0 text-muted" style={{ fontSize: "12px" }}>{user.email}</p>
          </div>

          {user.role === "user" && (
            <>
              <Link className="dropdown-item d-flex align-items-center gap-2 py-2" to="/profile" onClick={() => setOpenUserMenu(false)}>
                <i className="fas fa-user-circle text-primary"></i> Profile
              </Link>
              <Link className="dropdown-item d-flex align-items-center gap-2 py-2" to="/my-orders" onClick={() => setOpenUserMenu(false)}>
                <i className="fas fa-box text-primary"></i> My Orders
              </Link>
            </>
          )}

          {user.role === "admin" && (
            <Link className="dropdown-item d-flex align-items-center gap-2 py-2 text-warning fw-medium" to="/admin" onClick={() => setOpenUserMenu(false)}>
              <i className="fas fa-cog"></i> Admin Panel
            </Link>
          )}

          <div className="dropdown-divider my-1"></div>
          <button className="dropdown-item d-flex align-items-center gap-2 py-2 text-danger" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </>
      ) : (
        <>
          <Link className="dropdown-item d-flex align-items-center gap-2 py-2" to="/login" onClick={() => setOpenUserMenu(false)}>
            <i className="fas fa-sign-in-alt text-primary"></i> Login
          </Link>
          <Link className="dropdown-item d-flex align-items-center gap-2 py-2" to="/signup" onClick={() => setOpenUserMenu(false)}>
            <i className="fas fa-user-plus text-success"></i> Register
          </Link>
        </>
      )}
    </div>
  );

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary d-none d-lg-block">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center py-1">
            <div className="d-flex gap-3">
              <small className="d-flex align-items-center gap-1">
                <i className="fas fa-map-marker-alt text-warning"></i>
                <a href="#" className="text-white text-decoration-none">123 Street, New York</a>
              </small>
              <small className="d-flex align-items-center gap-1">
                <i className="fas fa-envelope text-warning"></i>
                <a href="#" className="text-white text-decoration-none">Email@Example.com</a>
              </small>
            </div>
            <div className="d-flex align-items-center gap-2">
              {["Privacy Policy", "Terms of Use", "Sales & Refunds"].map((item, i, arr) => (
                <span key={item} className="d-flex align-items-center gap-2">
                  <a href="#" className="text-white text-decoration-none"><small>{item}</small></a>
                  {i < arr.length - 1 && <span className="text-white-50">·</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar navbar-expand-xl navbar-light bg-white shadow-sm sticky-top">
        <div className="container">

          {/* Brand */}
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2 text-primary fw-bold fs-4">
            <i className="fas fa-store"></i>
            <span>Ecomm</span>
          </Link>

          {/* Mobile right-side icons (visible before toggler) */}
          <div className="d-flex d-xl-none align-items-center gap-3 ms-auto me-2">
            <Link to="/cart" className="position-relative text-primary">
              <i className="fa fa-shopping-bag fa-lg"></i>
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark" style={{ fontSize: "10px" }}>
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="position-relative" ref={dropdownRef}>
              <button className="btn btn-link p-0 text-primary border-0 shadow-none" onClick={toggleUserMenu}>
                {user ? (
                  <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: "32px", height: "32px", fontSize: "13px" }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <i className="fas fa-user fa-lg"></i>
                )}
              </button>
              {openUserMenu && (
                <div style={{ position: "absolute", top: "42px", right: 0, zIndex: 1055 }}>
                  <UserDropdownMenu />
                </div>
              )}
            </div>
          </div>

          {/* Toggler */}
          <button
            className="navbar-toggler border-0 shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Collapsible */}
          <div className="collapse navbar-collapse" id="navbarCollapse">

            {/* Nav Links */}
            <ul className="navbar-nav mx-auto mb-2 mb-xl-0">
              <li className="nav-item">
                <Link to="/" className="nav-link px-3 rounded-pill fw-medium active">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/shop" className="nav-link px-3 rounded-pill fw-medium">Shop</Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className="nav-link px-3 rounded-pill fw-medium">Contact</Link>
              </li>
            </ul>

            {/* Desktop: Search + Cart + User */}
            <div className="d-none d-xl-flex align-items-center gap-3">
              <button
                className="btn btn-outline-primary rounded-circle p-0 d-flex align-items-center justify-content-center"
                style={{ width: "40px", height: "40px" }}
                data-bs-toggle="modal"
                data-bs-target="#searchModal"
              >
                <i className="fas fa-search"></i>
              </button>

              <Link to="/cart" className="position-relative text-primary">
                <i className="fa fa-shopping-bag fa-2x"></i>
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark" style={{ fontSize: "11px" }}>
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="dropdown" ref={dropdownRef}>
                <button className="btn btn-link p-0 text-primary border-0 shadow-none d-flex align-items-center gap-2" onClick={toggleUserMenu}>
                  {user ? (
                    <>
                      <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: "36px", height: "36px", fontSize: "14px" }}>
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <i className={`fas fa-chevron-${openUserMenu ? "up" : "down"} small text-muted`}></i>
                    </>
                  ) : (
                    <i className="fas fa-user fa-2x"></i>
                  )}
                </button>

                {openUserMenu && <UserDropdownMenu />}
              </div>
            </div>

            {/* Mobile: Search button (in collapsed menu) */}
            <div className="d-xl-none mt-2">
              <button
                className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2"
                data-bs-toggle="modal"
                data-bs-target="#searchModal"
              >
                <i className="fas fa-search"></i> Search
              </button>
            </div>
          </div>
        </div>
      </nav>

      <style>{`
        .navbar .nav-link {
          transition: background-color 0.2s, color 0.2s;
          color: #333;
        }
        .navbar .nav-link:hover,
        .navbar .nav-link.active {
          background-color: rgba(13, 110, 253, 0.09);
          color: #0d6efd !important;
        }
        .navbar .nav-link.active {
          font-weight: 600;
        }
        .dropdown-item {
          font-size: 0.9rem;
          transition: background-color 0.15s;
        }
        .dropdown-item:hover {
          background-color: #eef3ff;
        }
        .dropdown-menu {
          animation: dropIn 0.15s ease-out;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}