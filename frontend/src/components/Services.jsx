import React from "react";
import { Link } from "react-router-dom";

const offersData = [
  {
    id: 1,
    icon: "fa-bolt",
    tag: "Flash Sale",
    tagColor: "bg-danger",
    title: "Electronics",
    subtitle: "Smartphones, Laptops & More",
    offer: "Up to 40% OFF",
    offerColor: "#dc3545",
    description: "Limited time deals on top brands. Grab before stock runs out!",
    cta: "Shop Now",
    ctaStyle: "btn-danger",
    bg: "linear-gradient(135deg,#fff5f5,#ffe0e0)",
    border: "#ffb3b3",
    link: "/category/electronics",
    badge: "🔥 Hot Deal",
    badgeBg: "bg-danger",
  },
  {
    id: 2,
    icon: "fa-tshirt",
    tag: "New Arrival",
    tagColor: "bg-primary",
    title: "Fashion",
    subtitle: "Men, Women & Kids",
    offer: "Buy 2 Get 1 FREE",
    offerColor: "#0d6efd",
    description: "Trendy styles for every occasion. Free delivery on orders ₹499+",
    cta: "Explore",
    ctaStyle: "btn-primary",
    bg: "linear-gradient(135deg,#f0f4ff,#dce8ff)",
    border: "#b3ccff",
    link: "/category/fashion",
    badge: "✨ New",
    badgeBg: "bg-primary",
  },
  {
    id: 3,
    icon: "fa-couch",
    tag: "Best Value",
    tagColor: "bg-success",
    title: "Home & Living",
    subtitle: "Furniture, Decor & Kitchen",
    offer: "Starting ₹299",
    offerColor: "#198754",
    description: "Transform your space with our handpicked home essentials.",
    cta: "Discover",
    ctaStyle: "btn-success",
    bg: "linear-gradient(135deg,#f0fff4,#d4edda)",
    border: "#a8d5b5",
    link: "/category/home",
    badge: "💚 Value",
    badgeBg: "bg-success",
  },
];

const Services = () => {
  return (
    <section className="py-5" style={{ background: "#f8fafc" }}>
      <div className="container">

        {/* ── Section Header ── */}
        <div className="text-center mb-5">
          <p className="text-primary fw-semibold mb-1 small d-flex align-items-center justify-content-center gap-2">
            <i className="fas fa-star" style={{ fontSize: "0.8rem" }}></i>
            EXCLUSIVE OFFERS
          </p>
          <h2 className="fw-bold text-dark mb-2">Deals You Can't Miss</h2>
          <p className="text-muted small mx-auto" style={{ maxWidth: 420 }}>
            Hand-picked offers across top categories — updated every week just for you.
          </p>
        </div>

        {/* ── Offer Cards ── */}
        <div className="row g-4">
          {offersData.map((item) => (
            <div key={item.id} className="col-12 col-md-6 col-lg-4">
              <Link to={item.link} className="text-decoration-none">
                <div
                  className="card border-0 rounded-4 h-100 overflow-hidden"
                  style={{
                    background: item.bg,
                    border: `2px solid ${item.border}`,
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  <div className="card-body p-4 d-flex flex-column gap-3">

                    {/* Top row: icon + badges */}
                    <div className="d-flex align-items-start justify-content-between">
                      {/* Icon circle */}
                      <div
                        className="d-flex align-items-center justify-content-center rounded-3"
                        style={{
                          width: 52, height: 52,
                          background: "rgba(255,255,255,0.8)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        }}
                      >
                        <i className={"fas " + item.icon}
                          style={{ fontSize: "1.3rem", color: item.offerColor }}></i>
                      </div>

                      {/* Badges */}
                      <div className="d-flex flex-column align-items-end gap-1">
                        <span className={"badge rounded-pill text-white px-2 py-1 " + item.tagColor}
                          style={{ fontSize: "0.65rem" }}>
                          {item.tag}
                        </span>
                        <span className={"badge rounded-pill text-white px-2 py-1 " + item.badgeBg}
                          style={{ fontSize: "0.65rem", opacity: 0.85 }}>
                          {item.badge}
                        </span>
                      </div>
                    </div>

                    {/* Title + subtitle */}
                    <div>
                      <h4 className="fw-bold text-dark mb-0">{item.title}</h4>
                      <p className="text-muted mb-0 small">{item.subtitle}</p>
                    </div>

                    {/* Offer highlight */}
                    <div
                      className="rounded-3 px-3 py-2 d-inline-flex align-items-center gap-2"
                      style={{ background: "rgba(255,255,255,0.7)" }}
                    >
                      <i className="fas fa-tag" style={{ color: item.offerColor, fontSize: "0.8rem" }}></i>
                      <span className="fw-bold" style={{ color: item.offerColor, fontSize: "1.1rem" }}>
                        {item.offer}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-muted small mb-0" style={{ lineHeight: 1.6 }}>
                      {item.description}
                    </p>

                    {/* Divider */}
                    <div style={{ borderTop: "1px dashed rgba(0,0,0,0.1)" }}></div>

                    {/* CTA row */}
                    <div className="d-flex align-items-center justify-content-between">
                      <span
                        className={"btn btn-sm rounded-pill px-4 fw-semibold " + item.ctaStyle}
                        style={{ fontSize: "0.82rem" }}
                      >
                        {item.cta}
                        <i className="fas fa-arrow-right ms-2" style={{ fontSize: "0.7rem" }}></i>
                      </span>
                      <span className="text-muted d-flex align-items-center gap-1"
                        style={{ fontSize: "0.72rem" }}>
                        <i className="fas fa-clock" style={{ fontSize: "0.65rem" }}></i>
                        Limited time
                      </span>
                    </div>

                  </div>

                  {/* Bottom accent bar */}
                  <div style={{ height: 4, background: item.offerColor, opacity: 0.7 }}></div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* ── Bottom banner ── */}
        <div className="mt-4 rounded-4 overflow-hidden"
          style={{ background: "linear-gradient(135deg,#0d6efd,#6610f2)" }}>
          <div className="p-4 p-md-5 d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
            <div>
              <h5 className="fw-bold text-white mb-1 d-flex align-items-center gap-2">
                <i className="fas fa-shipping-fast"></i>
                Free Delivery on Your First Order!
              </h5>
              <p className="text-white mb-0 small" style={{ opacity: 0.8 }}>
                Use code <strong>FIRST10</strong> at checkout · Valid on orders above ₹499
              </p>
            </div>
            <Link to="/shop"
              className="btn btn-white rounded-pill px-5 fw-bold flex-shrink-0"
              style={{ background: "#fff", color: "#0d6efd", whiteSpace: "nowrap" }}>
              Shop Now <i className="fas fa-arrow-right ms-2" style={{ fontSize: "0.8rem" }}></i>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Services;