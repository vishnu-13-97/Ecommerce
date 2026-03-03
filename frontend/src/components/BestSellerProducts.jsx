import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api-helper/Axioxinstance";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const StarRating = ({ rating = 4 }) => (
  <div className="d-flex align-items-center gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <i key={s}
        className={"fas fa-star"}
        style={{ fontSize: "0.65rem", color: s <= rating ? "#f59e0b" : "#e2e8f0" }}
      ></i>
    ))}
  </div>
);

export default function BestsellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [addingId, setAddingId] = useState(null);

  const navigate = useNavigate();
  const { user }           = useAuth();
  const { fetchCartCount } = useCart();

  /* ── Fetch top 6 products ── */
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await API.get("/product");
        const all = res.data.data || res.data || [];
        setProducts(all.slice(0, 6));
      } catch { toast.error("Failed to load products"); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  /* ── Add to cart ── */
  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    if (product.stock <= 0) { toast.error("Out of stock"); return; }
    if (!user) { navigate(`/login?redirect=/product/${product._id}`); return; }
    try {
      setAddingId(product._id);
      await API.post("/user/cart", { productId: product._id, quantity: 1 }, { withCredentials: true });
      fetchCartCount();
      toast.success("Added to cart!");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch { toast.error("Unable to add to cart"); }
    finally { setAddingId(null); }
  };

  /* ── Mock rating (replace with real data if available) ── */
  const getRating = (id) => ((id?.charCodeAt(id.length - 1) % 2) === 0 ? 4 : 5);

  /* ── Loading ── */
  if (loading) {
    return (
      <section className="py-5 bg-white">
        <div className="container text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status"
            style={{ width: "3rem", height: "3rem" }} />
          <p className="text-muted fw-medium">Loading bestsellers...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5 bg-white">
      <div className="container">

        {/* ── Section Header ── */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-end
                        justify-content-between gap-3 mb-5">
          <div>
            <p className="text-primary fw-semibold mb-1 small d-flex align-items-center gap-2">
              <i className="fas fa-crown" style={{ fontSize: "0.8rem" }}></i>
              TOP PICKS
            </p>
            <h2 className="fw-bold text-dark mb-1">Bestseller Products</h2>
            <p className="text-muted small mb-0" style={{ maxWidth: 420 }}>
              Our most loved items — rated highly by thousands of happy customers.
            </p>
          </div>
          <button
            className="btn btn-outline-primary rounded-pill px-4 fw-medium flex-shrink-0"
            onClick={() => navigate("/shop")}>
            View All <i className="fas fa-arrow-right ms-2" style={{ fontSize: "0.75rem" }}></i>
          </button>
        </div>

        {/* ── Product Cards ── */}
        {products.length === 0 ? (
          <div className="text-center py-5">
            <div className="d-inline-flex align-items-center justify-content-center
                            rounded-circle bg-primary bg-opacity-10 mb-3"
              style={{ width: 72, height: 72 }}>
              <i className="fas fa-box-open text-primary" style={{ fontSize: "1.8rem" }}></i>
            </div>
            <h6 className="fw-bold text-dark mb-1">No products yet</h6>
            <p className="text-muted small">Check back soon!</p>
          </div>
        ) : (
          <div className="row g-4">
            {products.map((product) => {
              const inStock  = product.stock > 0;
              const isLow    = product.stock > 0 && product.stock <= 5;
              const rating   = getRating(product._id);

              return (
                <div key={product._id} className="col-12 col-md-6 col-xl-4">
                  <div
                    className="card border-0 rounded-4 overflow-hidden h-100"
                    style={{
                      background: "#f8fafc",
                      cursor: "pointer",
                      transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                    onClick={() => navigate(`/product/${product._id}`)}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.boxShadow = "";
                    }}
                  >
                    <div className="card-body p-3">
                      <div className="row g-3 align-items-center">

                        {/* ── Image ── */}
                        <div className="col-5">
                          <div className="position-relative rounded-3 overflow-hidden bg-white"
                            style={{ aspectRatio: "1/1" }}>
                            <img
                              src={product.images?.[0]?.url || "https://via.placeholder.com/200"}
                              alt={product.name}
                              className="w-100 h-100"
                              style={{ objectFit: "cover" }}
                            />
                            {/* Out of stock overlay */}
                            {!inStock && (
                              <div className="position-absolute top-0 start-0 w-100 h-100
                                              d-flex align-items-center justify-content-center"
                                style={{ background: "rgba(0,0,0,0.4)", borderRadius: "0.75rem" }}>
                                <span className="badge bg-danger rounded-pill px-2 py-1"
                                  style={{ fontSize: "0.6rem" }}>Out of Stock</span>
                              </div>
                            )}
                            {/* Bestseller ribbon */}
                            <div className="position-absolute top-0 start-0">
                              <span className="badge bg-warning text-dark rounded-0 rounded-bottom-2 px-2"
                                style={{ fontSize: "0.6rem", borderRadius: "0 0 6px 0" }}>
                                <i className="fas fa-crown me-1" style={{ fontSize: "0.5rem" }}></i>
                                Best
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* ── Info ── */}
                        <div className="col-7 d-flex flex-column gap-2">

                          {/* Category + brand */}
                          <div className="d-flex flex-wrap gap-1">
                            {product.category?.name && (
                              <span className="badge bg-primary text-white rounded-pill"
                                style={{ fontSize: "0.6rem" }}>
                                {product.category.name}
                              </span>
                            )}
                            {product.brand?.name && (
                              <span className="badge bg-secondary text-white rounded-pill"
                                style={{ fontSize: "0.6rem" }}>
                                {product.brand.name}
                              </span>
                            )}
                          </div>

                          {/* Name */}
                          <h6 className="fw-bold text-dark mb-0 lh-sm"
                            style={{
                              fontSize: "0.88rem",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}>
                            {product.name}
                          </h6>

                          {/* Stars + count */}
                          <div className="d-flex align-items-center gap-2">
                            <StarRating rating={rating} />
                            <span className="text-muted" style={{ fontSize: "0.68rem" }}>
                              ({Math.floor(Math.random() * 200 + 50)})
                            </span>
                          </div>

                          {/* Stock indicator */}
                          {isLow ? (
                            <p className="text-warning fw-semibold mb-0"
                              style={{ fontSize: "0.7rem" }}>
                              <i className="fas fa-exclamation-circle me-1"></i>
                              Only {product.stock} left!
                            </p>
                          ) : inStock ? (
                            <p className="text-success fw-medium mb-0"
                              style={{ fontSize: "0.7rem" }}>
                              <i className="fas fa-check-circle me-1"></i>
                              In Stock
                            </p>
                          ) : null}

                          {/* Price */}
                          <p className="fw-bold text-primary mb-0" style={{ fontSize: "1.05rem" }}>
                            ₹{Number(product.price).toLocaleString()}
                          </p>

                          {/* Add to cart */}
                          <button
                            className={"btn btn-sm rounded-3 fw-medium w-100 d-flex align-items-center justify-content-center gap-2 "
                              + (inStock ? "btn-primary" : "btn-secondary")}
                            style={{ fontSize: "0.78rem" }}
                            onClick={(e) => handleAddToCart(e, product)}
                            disabled={!inStock || addingId === product._id}>
                            {addingId === product._id ? (
                              <span className="spinner-border spinner-border-sm" role="status"></span>
                            ) : (
                              <i className="fas fa-shopping-cart" style={{ fontSize: "0.7rem" }}></i>
                            )}
                            {inStock ? "Add to Cart" : "Out of Stock"}
                          </button>

                        </div>
                      </div>
                    </div>

                    {/* Bottom color accent */}
                    <div style={{ height: 3, background: "linear-gradient(90deg,#0d6efd,#6610f2)" }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Trust strip ── */}
        <div className="mt-5 pt-4" style={{ borderTop: "1px solid #f1f5f9" }}>
          <div className="row g-3 text-center">
            {[
              { icon: "fa-crown",         label: "Top Rated",       sub: "By 50K+ customers"  },
              { icon: "fa-shield-alt",    label: "Quality Assured", sub: "100% genuine items" },
              { icon: "fa-undo",          label: "Easy Returns",    sub: "7-day return policy" },
              { icon: "fa-shipping-fast", label: "Fast Delivery",   sub: "Same day dispatch"  },
            ].map(({ icon, label, sub }) => (
              <div key={label} className="col-6 col-md-3">
                <div className="d-flex flex-column align-items-center gap-2">
                  <div className="d-flex align-items-center justify-content-center rounded-3
                                  bg-primary bg-opacity-10"
                    style={{ width: 44, height: 44 }}>
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

      </div>
    </section>
  );
}