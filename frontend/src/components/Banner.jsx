import React from "react";
import { Link } from "react-router-dom";

const Banner = () => {
  const features = [
    { icon: "fa-shipping-fast", text: "Free Delivery above ₹499" },
    { icon: "fa-undo",          text: "7-Day Easy Returns"        },
    { icon: "fa-shield-alt",    text: "100% Secure Payments"      },
  ];

  const deals = [
    { label: "Electronics",  discount: "Up to 40% OFF", icon: "fa-bolt",   color: "#dc3545", bg: "rgba(220,53,69,0.12)"   },
    { label: "Fashion",      discount: "Buy 2 Get 1",   icon: "fa-tshirt", color: "#0d6efd", bg: "rgba(13,110,253,0.12)"  },
    { label: "Home & Living",discount: "From ₹299",     icon: "fa-couch",  color: "#198754", bg: "rgba(25,135,84,0.12)"   },
  ];

  return (
    <section className="py-5" style={{ background: "linear-gradient(135deg,#0d6efd 0%,#003db5 100%)" }}>
      <div className="container">
        <div className="row g-4 g-lg-5 align-items-center">

          {/* ── LEFT: Text + CTA ── */}
          <div className="col-12 col-lg-6">

            {/* Badge */}
            <div className="d-inline-flex align-items-center gap-2 rounded-pill px-3 py-1 mb-3 fw-medium small"
              style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>
              <i className="fas fa-bolt" style={{ fontSize: "0.75rem", color: "#fbbf24" }}></i>
              Limited Time Offer — Don't Miss Out!
            </div>

            <h1 className="fw-bold text-white lh-sm mb-2"
              style={{ fontSize: "clamp(2rem,5vw,3.2rem)" }}>
              Shop Smarter,
              <span className="d-block" style={{ color: "#fbbf24" }}>
                Save Bigger 🎉
              </span>
            </h1>
            <p className="mb-4" style={{ color: "rgba(255,255,255,0.8)", fontSize: "1rem", maxWidth: 440 }}>
              Explore thousands of genuine products across every category —
              with unbeatable prices, fast delivery, and easy returns.
            </p>

            {/* Feature pills */}
            <div className="d-flex flex-wrap gap-2 mb-4">
              {features.map(({ icon, text }) => (
                <div key={text}
                  className="d-flex align-items-center gap-2 rounded-pill px-3 py-1"
                  style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
                  <i className={"fas " + icon} style={{ color: "#86efac", fontSize: "0.75rem" }}></i>
                  <span className="text-white small fw-medium">{text}</span>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="d-flex flex-wrap gap-3 mb-4">
              <Link to="/shop"
                className="btn rounded-pill fw-bold px-5 py-3 shadow"
                style={{ background: "#fbbf24", color: "#1a1a2e", fontSize: "0.95rem" }}>
                <i className="fas fa-shopping-bag me-2"></i>
                Shop Now
              </Link>
              <Link to="/category/electronics"
                className="btn btn-outline-light rounded-pill fw-semibold px-4 py-3">
                <i className="fas fa-tag me-2"></i>
                View Deals
              </Link>
            </div>

            {/* Promo code box */}
            <div className="d-inline-flex align-items-center gap-3 rounded-3 px-4 py-2"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px dashed rgba(255,255,255,0.4)" }}>
              <div>
                <p className="text-white mb-0 small fw-medium">Use code at checkout:</p>
                <p className="mb-0 fw-bold" style={{ color: "#fbbf24", fontSize: "1.1rem", letterSpacing: "0.1em" }}>
                  FIRST10
                </p>
              </div>
              <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.3)" }}></div>
              <p className="text-white mb-0 small">
                Get <strong>10% OFF</strong><br />your first order
              </p>
            </div>
          </div>

          {/* ── RIGHT: Deal cards + Stats ── */}
          <div className="col-12 col-lg-6 d-flex flex-column gap-4">

            {/* Deal cards */}
            <div className="row g-3">
              {deals.map(({ label, discount, icon, color, bg }) => (
                <div key={label} className="col-12 col-sm-4">
                  <Link to={`/category/${label.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-decoration-none">
                    <div className="card border-0 rounded-4 h-100 text-center p-3"
                      style={{ background: "rgba(255,255,255,0.95)", transition: "transform 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                      onMouseLeave={e => e.currentTarget.style.transform = ""}>
                      <div className="d-flex align-items-center justify-content-center rounded-3 mx-auto mb-2"
                        style={{ width: 48, height: 48, background: bg }}>
                        <i className={"fas " + icon} style={{ color, fontSize: "1.2rem" }}></i>
                      </div>
                      <p className="fw-bold text-dark mb-0 small">{label}</p>
                      <p className="fw-bold mb-0" style={{ color, fontSize: "0.78rem" }}>{discount}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Big promo card */}
            <div className="card border-0 rounded-4 overflow-hidden shadow-lg">
              <div className="card-body p-4"
                style={{ background: "linear-gradient(135deg,#fff8e1,#fffde7)" }}>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                  <div>
                    <span className="badge bg-danger rounded-pill px-3 py-1 mb-2 fw-medium"
                      style={{ fontSize: "0.7rem" }}>
                      🔥 Flash Sale — Ends Tonight
                    </span>
                    <h4 className="fw-bold text-dark mb-1">Weekend Special</h4>
                    <p className="text-muted small mb-0">
                      Flat 25% OFF on all orders above ₹999
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="rounded-3 px-4 py-2"
                      style={{ background: "linear-gradient(135deg,#dc3545,#c82333)" }}>
                      <p className="text-white mb-0 fw-bold" style={{ fontSize: "1.6rem" }}>25%</p>
                      <p className="text-white mb-0" style={{ fontSize: "0.7rem", opacity: 0.85 }}>OFF</p>
                    </div>
                  </div>
                </div>

                {/* Countdown strip */}
                <div className="d-flex align-items-center gap-2 mt-3 pt-3"
                  style={{ borderTop: "1px dashed #f0c040" }}>
                  <i className="fas fa-clock text-danger" style={{ fontSize: "0.8rem" }}></i>
                  <span className="text-muted small fw-medium">Hurry! Offer ends in:</span>
                  {["08h", "45m", "30s"].map((t) => (
                    <span key={t} className="badge bg-dark text-white rounded-2 px-2 py-1"
                      style={{ fontSize: "0.75rem", fontFamily: "monospace" }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Mini stat strip */}
            <div className="row g-2">
              {[
                { value: "50K+",  label: "Customers",  icon: "fa-users"    },
                { value: "10K+",  label: "Products",   icon: "fa-box-open" },
                { value: "4.8★",  label: "Rating",     icon: "fa-star"     },
                { value: "500+",  label: "Brands",     icon: "fa-tag"      },
              ].map(({ value, label, icon }) => (
                <div key={label} className="col-3">
                  <div className="text-center rounded-3 py-2"
                    style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)" }}>
                    <i className={"fas " + icon + " text-white mb-1"} style={{ fontSize: "0.85rem" }}></i>
                    <p className="fw-bold text-white mb-0" style={{ fontSize: "0.88rem" }}>{value}</p>
                    <p className="mb-0" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.65rem" }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;