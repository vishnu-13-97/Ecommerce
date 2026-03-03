import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import heroImg1 from "../assets/img/hero-img-1.png";
import heroImg2 from "../assets/img/hero-img-2.jpg";
import API from "../api-helper/Axioxinstance";

const Hero = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/category");
        if (res.data && Array.isArray(res.data.data)) setCategories(res.data.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const fallbackCategories = [
    { name: "Fruits",     image: { url: heroImg1 } },
    { name: "Vegetables", image: { url: heroImg2 } },
  ];
  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  const trustBadges = [
    { icon: "fa-shield-alt",    label: "100% Secure",   sub: "Encrypted payments"   },
    { icon: "fa-undo-alt",      label: "Easy Returns",  sub: "30-day return policy" },
    { icon: "fa-shipping-fast", label: "Fast Delivery", sub: "Same day dispatch"    },
    { icon: "fa-headset",       label: "24/7 Support",  sub: "Always here to help"  },
  ];

  const quickCategories = displayCategories.slice(0, 6);

  return (
    <>
      {/* ── Announcement Bar ── */}
      <div className="text-white text-center py-2 small fw-medium"
        style={{ background: "linear-gradient(90deg,#0d6efd,#6610f2)" }}>
        <i className="fas fa-tag me-2"></i>
        🎉 Free shipping on orders above ₹499 &nbsp;|&nbsp;
        Use code <strong>FIRST10</strong> for 10% off your first order!
      </div>

      {/* ── Main Hero ── */}
      <section style={{ background: "linear-gradient(135deg,#f0f4ff 0%,#e8f5e9 100%)", overflow: "hidden" }}>
        <div className="container py-5">
          <div className="row g-4 g-lg-5 align-items-center">

            {/* ── LEFT: Text + Search ── */}
            <div className="col-12 col-lg-6">

              {/* Trust pill */}
              <div className="d-inline-flex align-items-center gap-2 rounded-pill px-3 py-1 mb-3 fw-medium small"
                style={{ background: "rgba(13,110,253,0.1)", color: "#0d6efd" }}>
                <i className="fas fa-check-circle" style={{ fontSize: "0.75rem" }}></i>
                100% Trustable · 50,000+ Happy Customers
              </div>

              <h1 className="fw-bold lh-sm mb-2" style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}>
                Your Complete
                <span className="d-block" style={{ color: "#0d6efd" }}>Shopping Partner</span>
              </h1>
              <p className="text-muted mb-4" style={{ fontSize: "1rem", maxWidth: 480 }}>
                Discover thousands of products across all categories — from fresh produce
                to electronics, fashion, and more. Shop smarter, live better.
              </p>

              {/* Search bar */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="input-group shadow-sm rounded-pill overflow-hidden"
                  style={{ maxWidth: 520 }}>
                  <span className="input-group-text bg-white border-0 ps-4 text-muted">
                    <i className="fas fa-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 py-3"
                    placeholder="Search for products, brands, categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit"
                    className="btn btn-primary px-4 fw-semibold border-0"
                    style={{ borderRadius: "0 50px 50px 0" }}>
                    Search
                  </button>
                </div>
                <p className="text-muted mt-2 mb-0" style={{ fontSize: "0.75rem" }}>
                  <span className="me-2">Popular:</span>
                  {["Smartphones", "Fruits", "Clothing", "Footwear"].map((t) => (
                    <button key={t} type="button"
                      className="btn btn-link p-0 me-2 text-muted text-decoration-none"
                      style={{ fontSize: "0.75rem" }}
                      onClick={() => { setSearchTerm(t); navigate(`/shop?search=${t}`); }}>
                      {t}
                    </button>
                  ))}
                </p>
              </form>

              {/* Stats row */}
              <div className="d-flex flex-wrap gap-4">
                {[
                  { value: "50K+", label: "Happy Customers" },
                  { value: "10K+", label: "Products"        },
                  { value: "500+", label: "Brands"          },
                  { value: "4.8★", label: "Avg Rating"      },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <p className="fw-bold mb-0 text-dark" style={{ fontSize: "1.3rem" }}>{value}</p>
                    <p className="text-muted mb-0" style={{ fontSize: "0.72rem" }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: Carousel ── */}
            <div className="col-12 col-lg-6">
              <div className="position-relative">

                {/* Decorative blob */}
                <div className="position-absolute rounded-circle"
                  style={{
                    width: 420, height: 420, top: "50%", left: "50%",
                    transform: "translate(-50%,-50%)",
                    background: "radial-gradient(circle,rgba(13,110,253,0.1) 0%,transparent 70%)",
                    pointerEvents: "none",
                  }} />

                <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">

                  {/* Dot indicators */}
                  <div className="carousel-indicators mb-0" style={{ bottom: -36 }}>
                    {displayCategories.map((_, i) => (
                      <button key={i} type="button"
                        data-bs-target="#heroCarousel" data-bs-slide-to={i}
                        className={i === 0 ? "active bg-primary" : "bg-secondary"}
                        style={{ width: 8, height: 8, borderRadius: "50%", border: "none" }}
                        aria-current={i === 0 ? "true" : undefined} />
                    ))}
                  </div>

                  {/* Slides */}
                  {/* Slides */}
<div className="carousel-inner rounded-4 overflow-hidden shadow-lg">
  {loading ? (
    <div className="carousel-item active">
      <div
        className="d-flex align-items-center justify-content-center bg-light"
        style={{ height: 380 }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary mb-2" role="status" />
          <p className="text-muted small mb-0">Loading categories...</p>
        </div>
      </div>
    </div>
  ) : (
    displayCategories.map((cat, index) => (
      <div
        key={cat._id || index}
        className={`carousel-item ${index === 0 ? "active" : ""}`}
      >
        <div className="position-relative" style={{ height: 380 }}>
          
          {/* Slide image */}
          <img
            src={cat.image?.url || heroImg1}
            alt={cat.name}
            className="w-100 h-100"
            style={{ objectFit: "cover" }}
          />

          {/* Gradient overlay */}
          <div
            className="position-absolute bottom-0 start-0 end-0"
            style={{
              background:
                "linear-gradient(to top,rgba(0,0,0,0.75) 0%,transparent 100%)",
              height: "65%",
           
            }}
          />

          {/* Caption */}
          <div className="position-absolute bottom-0 start-0 p-4" style={{marginLeft:"7%"}}> 
            <Link
              to={`/category/${cat.slug || cat.name?.toLowerCase()}`}
              className="text-decoration-none"
            >
              <span className="badge bg-white text-dark rounded-pill px-3 py-2 mb-2 fw-semibold small d-inline-block">
                <i
                  className="fas fa-layer-group me-1 text-primary"
                  style={{ fontSize: "0.65rem" }}
                ></i>
                {cat.name}
              </span>

            </Link>
          </div>
        </div>
      </div>
    ))
  )}
</div>

                  {/* Prev control */}
                  <button className="carousel-control-prev" type="button"
                    data-bs-target="#heroCarousel" data-bs-slide="prev"
                    style={{ width: 52 }}>
                    <div className="d-flex align-items-center justify-content-center rounded-circle bg-white shadow-sm"
                      style={{ width: 38, height: 38 }}>
                      <i className="fas fa-chevron-left text-dark" style={{ fontSize: "0.8rem" }}></i>
                    </div>
                    <span className="visually-hidden">Previous</span>
                  </button>

                  {/* Next control */}
                  <button className="carousel-control-next" type="button"
                    data-bs-target="#heroCarousel" data-bs-slide="next"
                    style={{ width: 52 }}>
                    <div className="d-flex align-items-center justify-content-center rounded-circle bg-white shadow-sm"
                      style={{ width: 38, height: 38 }}>
                      <i className="fas fa-chevron-right text-dark" style={{ fontSize: "0.8rem" }}></i>
                    </div>
                    <span className="visually-hidden">Next</span>
                  </button>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Trust Badges ── */}
      <section className="bg-white border-bottom border-top">
        <div className="container py-4">
          <div className="row g-3">
            {trustBadges.map(({ icon, label, sub }) => (
              <div key={label} className="col-6 col-md-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center justify-content-center rounded-3 bg-primary bg-opacity-10 flex-shrink-0"
                    style={{ width: 44, height: 44 }}>
                    {/* ✅ Fixed: text-primary instead of text-white on bg-opacity-10 */}
                    <i className={"fas " + icon + " text-white"} style={{ fontSize: "1.1rem" }}></i>
                  </div>
                  <div>
                    <p className="fw-bold text-dark mb-0 small">{label}</p>
                    <p className="text-muted mb-0" style={{ fontSize: "0.72rem" }}>{sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick Category Chips ── */}
      {!loading && quickCategories.length > 0 && (
        <section className="bg-light border-bottom py-3">
          <div className="container">
            <div className="d-flex align-items-center gap-3 overflow-auto pb-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              <span className="text-muted small fw-medium flex-shrink-0">Browse:</span>
              <Link to="/shop"
                className="btn btn-primary btn-sm rounded-pill px-3 flex-shrink-0 fw-medium"
                style={{ fontSize: "0.78rem" }}>
                All Products
              </Link>
              {quickCategories.map((cat, i) => (
                <Link
                  key={cat._id || i}
                  to={`/category/${cat.slug || cat.name?.toLowerCase()}`}
                  className="btn btn-light btn-sm rounded-pill px-3 flex-shrink-0 border fw-medium text-dark text-decoration-none d-flex align-items-center gap-2"
                  style={{ fontSize: "0.78rem", whiteSpace: "nowrap" }}>
                  {cat.image?.url && (
                    <img src={cat.image.url} alt={cat.name}
                      className="rounded-circle"
                      style={{ width: 20, height: 20, objectFit: "cover" }} />
                  )}
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Hero;