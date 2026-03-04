import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  const quickLinks = [
    { icon: "fa-home",         label: "Home",       to: "/"          },
    { icon: "fa-store",        label: "Shop",       to: "/shop"      },
    { icon: "fa-list-ul",      label: "My Orders",  to: "/my-orders" },
    { icon: "fa-envelope",     label: "Contact",    to: "/contact"   },
  ];

  return (
    <div className="bg-light d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 text-center">

            {/* ── Illustration ── */}
            <div className="position-relative d-inline-flex align-items-center justify-content-center mb-4">
              {/* Outer glow ring */}
              <div className="rounded-circle position-absolute"
                style={{
                  width: 200, height: 200,
                  background: "rgba(13,110,253,0.06)",
                  border: "2px dashed rgba(13,110,253,0.2)",
                }} />
              {/* Inner circle */}
              <div className="d-flex align-items-center justify-content-center rounded-circle bg-white shadow-sm"
                style={{ width: 140, height: 140, position: "relative" }}>
                <i className="fas fa-map-signs text-primary" style={{ fontSize: "3.5rem", opacity: 0.7 }}></i>
              </div>
            </div>

            {/* ── 404 number ── */}
            <h1 className="fw-bold mb-0 lh-1"
              style={{
                fontSize: "clamp(5rem,18vw,9rem)",
                background: "linear-gradient(135deg,#0d6efd,#6610f2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
              404
            </h1>

            <h4 className="fw-bold text-dark mb-2">Page Not Found</h4>
            <p className="text-muted mb-4 mx-auto" style={{ maxWidth: 380, fontSize: "0.92rem", lineHeight: 1.7 }}>
              Oops! The page you're looking for doesn't exist or may have been moved.
              Try searching for what you need or head back home.
            </p>

            {/* ── Search bar ── */}
            <form onSubmit={handleSearch} className="mb-4 mx-auto" style={{ maxWidth: 420 }}>
              <div className="input-group shadow-sm rounded-pill overflow-hidden">
                <span className="input-group-text bg-white border-0 ps-4 text-muted">
                  <i className="fas fa-search" style={{ fontSize: "0.85rem" }}></i>
                </span>
                <input
                  type="text"
                  className="form-control border-0 py-3"
                  placeholder="Search for products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit"
                  className="btn btn-primary px-4 fw-semibold border-0"
                  style={{ borderRadius: "0 50px 50px 0" }}>
                  Search
                </button>
              </div>
            </form>

            {/* ── Primary CTA ── */}
            <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
              <Link to="/"
                className="btn btn-primary rounded-pill fw-semibold px-5 py-2 shadow-sm d-flex align-items-center gap-2">
                <i className="fas fa-home"></i>
                Go Back Home
              </Link>
              <Link to="/shop"
                className="btn btn-outline-primary rounded-pill fw-semibold px-4 py-2 d-flex align-items-center gap-2">
                <i className="fas fa-store"></i>
                Browse Shop
              </Link>
            </div>

            {/* ── Quick links ── */}
            <div className="card border-0 shadow-sm rounded-4 mx-auto" style={{ maxWidth: 420 }}>
              <div className="card-body p-4">
                <p className="text-muted small fw-medium mb-3 d-flex align-items-center justify-content-center gap-2">
                  <i className="fas fa-compass text-primary" style={{ fontSize: "0.8rem" }}></i>
                  Quick Navigation
                </p>
                <div className="row g-2">
                  {quickLinks.map(({ icon, label, to }) => (
                    <div key={label} className="col-6">
                      <Link to={to}
                        className="btn btn-light rounded-3 w-100 d-flex align-items-center gap-2 fw-medium border"
                        style={{ fontSize: "0.82rem" }}>
                        <div className="d-flex align-items-center justify-content-center rounded-2 bg-primary bg-opacity-10 flex-shrink-0"
                          style={{ width: 28, height: 28 }}>
                          <i className={"fas " + icon + " text-white"} style={{ fontSize: "0.72rem" }}></i>
                        </div>
                        {label}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Support note ── */}
            <p className="text-muted mt-4 mb-0" style={{ fontSize: "0.78rem" }}>
              Still lost?&nbsp;
              <Link to="/contact" className="text-primary fw-medium text-decoration-none">
                Contact Support
              </Link>
              &nbsp;and we'll help you out.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;