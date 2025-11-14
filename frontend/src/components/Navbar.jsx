import { Link ,useNavigate} from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const dropdownRef = useRef(null);

  const toggleUserMenu = () => setOpenUserMenu((prev) => !prev);
const navigate = useNavigate();



const handleLogout = async () => {
  try {
    await logout();
    setOpenUserMenu(false); // close dropdown
    navigate("/"); // redirect to home
  } catch (err) {
    console.error("Logout failed:", err.message);
  }
};

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="container-fluid fixed-top">
      {/* Top Bar */}
      <div className="container topbar bg-primary d-none d-lg-block py-1">
        <div className="d-flex justify-content-between align-items-center">
          <div className="top-info ps-2">
            <small className="me-3">
              <i className="fas fa-map-marker-alt me-2 text-secondary"></i>
              <a href="#" className="text-white">123 Street, New York</a>
            </small>
            <small className="me-3">
              <i className="fas fa-envelope me-2 text-secondary"></i>
              <a href="#" className="text-white">Email@Example.com</a>
            </small>
          </div>
          <div className="top-link pe-2">
            <a href="#" className="text-white">
              <small className="mx-2">Privacy Policy</small>/
            </a>
            <a href="#" className="text-white">
              <small className="mx-2">Terms of Use</small>/
            </a>
            <a href="#" className="text-white">
              <small className="ms-2">Sales and Refunds</small>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container px-0">
        <nav className="navbar navbar-light bg-white navbar-expand-xl py-2 shadow-sm">
          <Link to="/" className="navbar-brand">
            <h1 className="text-primary display-6 m-0">Ecomm</h1>
          </Link>

          <button
            className="navbar-toggler py-2 px-3"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
          >
            <span className="fa fa-bars text-primary"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarCollapse">
            {/* Navigation Links */}
            <div className="navbar-nav mx-auto">
              <Link to="/" className="nav-item nav-link active">Home</Link>
              <Link to="/shop" className="nav-item nav-link">Shop</Link>
              <Link to="/contact" className="nav-item nav-link">Contact</Link>
            </div>

            {/* Right Side: Search, Cart, User */}
            <div className="d-flex align-items-center">
              {/* Search */}
              <button
                className="btn-search btn border border-secondary btn-md-square rounded-circle bg-white me-4"
                data-bs-toggle="modal"
                data-bs-target="#searchModal"
              >
                <i className="fas fa-search text-primary"></i>
              </button>

              {/* Cart */}
              <Link to="/cart" className="position-relative me-4">
                <i className="fa fa-shopping-bag fa-2x text-primary"></i>
                <span
                  className="position-absolute bg-secondary rounded-circle d-flex align-items-center justify-content-center text-dark px-1"
                  style={{ top: "-5px", left: "15px", height: "20px", minWidth: "20px", fontSize: "12px" }}
                >
                  3
                </span>
              </Link>

              {/* User Dropdown */}
              <div className="dropdown" ref={dropdownRef}>
                <i
                  className="fas fa-user fa-2x text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={toggleUserMenu}
                ></i>

                {openUserMenu && (
                  <div
                    className="dropdown-menu show mt-3 shadow-sm"
                    style={{
                      right: 0,
                      left: "auto",
                      borderRadius: "8px",
                      minWidth: "180px",
                      padding: "0.5rem 0",
                    }}
                  >
                    {user ? (
                      <>
                        <span className="dropdown-item-text fw-bold ps-3">
                          👋 Hello, {user.name}
                        </span>
                        <Link className="dropdown-item" to="/profile">Profile</Link>
                        <Link className="dropdown-item" to="/orders">My Orders</Link>

                        {/* Admin Panel */}
                        {user.role === "admin" && (
                          <Link className="dropdown-item text-warning" to="/admin">
                            Admin Panel
                          </Link>
                        )}

                       <button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button>

                      </>
                    ) : (
                      <>
                        <Link className="dropdown-item" to="/login">Login</Link>
                        <Link className="dropdown-item" to="/signup">Register</Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Inline CSS for dropdown animation */}
      <style>
        {`
          .dropdown-menu {
            transition: all 0.2s ease-in-out;
            opacity: 0;
            transform: translateY(-5px);
          }
          .dropdown-menu.show {
            opacity: 1;
            transform: translateY(0);
          }
          .topbar a:hover {
            text-decoration: underline;
          }
          .navbar-nav .nav-link.active {
            font-weight: 600;
            color: #0d6efd !important;
          }
        `}
      </style>
    </div>
  );
}
