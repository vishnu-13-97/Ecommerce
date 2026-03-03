import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api-helper/Axioxinstance";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const ProductSection = () => {
  const [categories, setCategories] = useState([]);
  const [products,   setProducts]   = useState([]);
  const [activeTab,  setActiveTab]  = useState("all");
  const [loading,    setLoading]    = useState(true);
  const [addingId,   setAddingId]   = useState(null);
  const [viewMode,   setViewMode]   = useState("grid");

  const navigate = useNavigate();
  const { user }         = useAuth();
  const { fetchCartCount } = useCart();

  /* ── Fetch categories ── */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/category");
        if (res.data && Array.isArray(res.data.data)) setCategories(res.data.data);
      } catch { console.error("Error fetching categories"); }
    };
    fetchCategories();
  }, []);

  /* ── Fetch products ── */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await API.get("/product");
        if (res.data && Array.isArray(res.data.data)) setProducts(res.data.data);
      } catch { console.error("Error fetching products"); }
      finally { setLoading(false); }
    };
    fetchProducts();
  }, []);

  /* ── Filter ── */
  const filteredProducts = activeTab === "all"
    ? products
    : products.filter((p) => p.category?._id === activeTab);

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

  const inStock = (p) => p.stock > 0;
  const isLow   = (p) => p.stock > 0 && p.stock <= 5;

  return (
    <section className="bg-light py-5">
      <div className="container">

        {/* ── Section Header ── */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <p className="text-primary fw-semibold mb-1 small d-flex align-items-center gap-2">
              <i className="fas fa-store" style={{ fontSize: "0.8rem" }}></i>
              FEATURED COLLECTION
            </p>
            <h2 className="fw-bold text-dark mb-0">Our Products</h2>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Link to="/shop" className="btn btn-outline-primary btn-sm rounded-pill px-4 fw-medium">
              View All <i className="fas fa-arrow-right ms-1" style={{ fontSize: "0.75rem" }}></i>
            </Link>
            <div className="btn-group rounded-3 overflow-hidden border" role="group">
              <button className={"btn btn-sm px-3 " + (viewMode === "grid" ? "btn-primary" : "btn-light")}
                onClick={() => setViewMode("grid")} title="Grid view">
                <i className="fas fa-th" style={{ fontSize: "0.85rem" }}></i>
              </button>
              <button className={"btn btn-sm px-3 " + (viewMode === "list" ? "btn-primary" : "btn-light")}
                onClick={() => setViewMode("list")} title="List view">
                <i className="fas fa-list" style={{ fontSize: "0.85rem" }}></i>
              </button>
            </div>
          </div>
        </div>

        {/* ── Category Tabs ── */}
        <div className="d-flex gap-2 flex-wrap mb-4 overflow-auto pb-1"
          style={{ scrollbarWidth: "none" }}>
          <button
            className={"btn btn-sm rounded-pill px-4 fw-medium " + (activeTab === "all" ? "btn-primary" : "btn-light border")}
            onClick={() => setActiveTab("all")}>
            <i className="fas fa-th-large me-2" style={{ fontSize: "0.72rem" }}></i>
            All
            <span className={"badge rounded-pill ms-2 " + (activeTab === "all" ? "bg-white text-primary" : "bg-secondary text-white")}
              style={{ fontSize: "0.65rem" }}>
              {products.length}
            </span>
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.category?._id === cat._id).length;
            return (
              <button key={cat._id}
                className={"btn btn-sm rounded-pill px-4 fw-medium " + (activeTab === cat._id ? "btn-primary" : "btn-light border")}
                onClick={() => setActiveTab(cat._id)}>
                {cat.image?.url && (
                  <img src={cat.image.url} alt={cat.name}
                    className="rounded-circle me-2"
                    style={{ width: 18, height: 18, objectFit: "cover" }} />
                )}
                {cat.name}
                <span className={"badge rounded-pill ms-2 " + (activeTab === cat._id ? "bg-white text-primary" : "bg-secondary text-white")}
                  style={{ fontSize: "0.65rem" }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Results count ── */}
        <p className="text-muted small mb-3">
          Showing <strong>{filteredProducts.length}</strong> product{filteredProducts.length !== 1 ? "s" : ""}
          {activeTab !== "all" && (
            <> in <strong>{categories.find((c) => c._id === activeTab)?.name}</strong></>
          )}
        </p>

        {/* ── Loading ── */}
        {loading && (
          <div className="d-flex align-items-center justify-content-center py-5">
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" role="status"
                style={{ width: "3rem", height: "3rem" }} />
              <p className="text-muted fw-medium">Loading products...</p>
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && filteredProducts.length === 0 && (
          <div className="card border-0 shadow-sm rounded-4 py-5 text-center">
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mb-3 mx-auto"
              style={{ width: 72, height: 72 }}>
              <i className="fas fa-box-open text-primary" style={{ fontSize: "1.8rem" }}></i>
            </div>
            <h6 className="fw-bold text-dark mb-1">No products found</h6>
            <p className="text-muted small mb-3">No products in this category yet.</p>
            <button className="btn btn-outline-secondary rounded-pill px-4 mx-auto"
              style={{ width: "fit-content" }} onClick={() => setActiveTab("all")}>
              <i className="fas fa-times me-2"></i>Show All Products
            </button>
          </div>
        )}

        {/* ── GRID VIEW ── */}
        {!loading && filteredProducts.length > 0 && viewMode === "grid" && (
          <div className="row g-3 g-md-4">
            {filteredProducts.map((product) => (
              <div key={product._id} className="col-6 col-md-4 col-xl-3">
                <div
                  className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden"
                  style={{ cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
                  onClick={() => navigate(`/product/${product._id}`)}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.12)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>

                  {/* Image */}
                  <div className="position-relative bg-light" style={{ height: 200 }}>
                    <img
                      src={product.images?.[0]?.url || "https://via.placeholder.com/300"}
                      alt={product.name}
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                    />
                    {/* Category pill */}
                    <span className="position-absolute top-0 start-0 badge bg-primary text-white rounded-pill m-2 px-2 py-1"
                      style={{ fontSize: "0.65rem" }}>
                      {categories.find((c) => c._id === product.category?._id)?.name || "General"}
                    </span>
                    {/* Stock badge */}
                    {!inStock(product) && (
                      <div className="position-absolute top-0 end-0 bottom-0 start-0 d-flex align-items-center justify-content-center rounded-top-4"
                        style={{ background: "rgba(0,0,0,0.45)" }}>
                        <span className="badge bg-danger px-3 py-2 rounded-pill fw-semibold">Out of Stock</span>
                      </div>
                    )}
                    {isLow(product) && (
                      <span className="position-absolute bottom-0 end-0 badge bg-warning text-dark m-2 rounded-pill"
                        style={{ fontSize: "0.65rem" }}>
                        Only {product.stock} left!
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="card-body p-3 d-flex flex-column gap-2">
                    {product.brand?.name && (
                      <p className="text-muted mb-0" style={{ fontSize: "0.7rem" }}>
                        <i className="fas fa-tag me-1" style={{ fontSize: "0.6rem" }}></i>
                        {product.brand.name}
                      </p>
                    )}
                    <h6 className="fw-bold text-dark mb-0 text-truncate" style={{ fontSize: "0.9rem" }}>
                      {product.name}
                    </h6>
                    <p className="text-muted mb-0" style={{
                      fontSize: "0.75rem", lineHeight: 1.4,
                      display: "-webkit-box", WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>
                      {product.description || "No description available."}
                    </p>

                    {/* Price + Cart */}
                    <div className="d-flex align-items-center justify-content-between mt-auto pt-1"
                      style={{ borderTop: "1px solid #f1f5f9" }}>
                      <p className="fw-bold text-primary mb-0" style={{ fontSize: "1.05rem" }}>
                        ₹{Number(product.price).toLocaleString()}
                      </p>
                      <button
                        className={"btn btn-sm rounded-3 d-flex align-items-center gap-1 " + (inStock(product) ? "btn-primary" : "btn-secondary")}
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={!inStock(product) || addingId === product._id}
                        style={{ fontSize: "0.75rem" }}>
                        {addingId === product._id
                          ? <span className="spinner-border spinner-border-sm" role="status"></span>
                          : <i className="fas fa-shopping-cart" style={{ fontSize: "0.7rem" }}></i>
                        }
                        <span className="d-none d-sm-inline">
                          {inStock(product) ? "Add" : "N/A"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── LIST VIEW ── */}
        {!loading && filteredProducts.length > 0 && viewMode === "list" && (
          <div className="d-flex flex-column gap-3">
            {filteredProducts.map((product) => (
              <div key={product._id}
                className="card border-0 shadow-sm rounded-4 overflow-hidden"
                style={{ cursor: "pointer", transition: "box-shadow 0.2s" }}
                onClick={() => navigate(`/product/${product._id}`)}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = ""}>
                <div className="card-body p-3 p-md-4">
                  <div className="d-flex gap-3 align-items-center">

                    {/* Image */}
                    <div className="rounded-3 overflow-hidden flex-shrink-0 bg-light"
                      style={{ width: 90, height: 90 }}>
                      <img src={product.images?.[0]?.url || "https://via.placeholder.com/90"}
                        alt={product.name} className="w-100 h-100"
                        style={{ objectFit: "cover" }} />
                    </div>

                    {/* Info */}
                    <div className="flex-grow-1 min-width-0">
                      <div className="d-flex flex-wrap gap-1 mb-1">
                        <span className="badge bg-primary text-white rounded-pill" style={{ fontSize: "0.65rem" }}>
                          {categories.find((c) => c._id === product.category?._id)?.name || "General"}
                        </span>
                        {!inStock(product) && (
                          <span className="badge bg-danger rounded-pill" style={{ fontSize: "0.65rem" }}>Out of Stock</span>
                        )}
                        {isLow(product) && (
                          <span className="badge bg-warning text-dark rounded-pill" style={{ fontSize: "0.65rem" }}>
                            Only {product.stock} left!
                          </span>
                        )}
                      </div>
                      <h6 className="fw-bold text-dark mb-1 text-truncate">{product.name}</h6>
                      <p className="text-muted small mb-0 d-none d-md-block"
                        style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {product.description || "No description available."}
                      </p>
                    </div>

                    {/* Price + CTA */}
                    <div className="d-flex flex-column align-items-end gap-2 flex-shrink-0">
                      <p className="fw-bold text-primary mb-0" style={{ fontSize: "1.1rem" }}>
                        ₹{Number(product.price).toLocaleString()}
                      </p>
                      <button
                        className={"btn btn-sm rounded-3 fw-medium d-flex align-items-center gap-1 " + (inStock(product) ? "btn-primary" : "btn-secondary")}
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={!inStock(product) || addingId === product._id}
                        style={{ whiteSpace: "nowrap", fontSize: "0.78rem" }}>
                        {addingId === product._id
                          ? <span className="spinner-border spinner-border-sm" role="status"></span>
                          : <i className="fas fa-shopping-cart" style={{ fontSize: "0.7rem" }}></i>
                        }
                        {inStock(product) ? "Add to Cart" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── View All CTA ── */}
        {!loading && products.length > 8 && (
          <div className="text-center mt-5">
            <Link to="/shop"
              className="btn btn-outline-primary rounded-pill px-5 py-2 fw-semibold">
              View All Products
              <i className="fas fa-arrow-right ms-2" style={{ fontSize: "0.8rem" }}></i>
            </Link>
          </div>
        )}

      </div>
    </section>
  );
};

export default ProductSection;