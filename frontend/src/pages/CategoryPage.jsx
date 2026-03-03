import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api-helper/Axioxinstance";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const SORT_OPTIONS = [
  { value: "default",     label: "Default"         },
  { value: "price_asc",  label: "Price: Low → High"},
  { value: "price_desc", label: "Price: High → Low"},
  { value: "name_asc",   label: "Name: A → Z"      },
];

export default function CategoryPage() {
  const { name } = useParams();                 // /category/:name
  const navigate  = useNavigate();
  const { user }  = useAuth();
  const { fetchCartCount } = useCart();

  const [category,   setCategory]   = useState(null);
  const [products,   setProducts]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy,     setSortBy]     = useState("default");
  const [addingId,   setAddingId]   = useState(null);
  const [viewMode,   setViewMode]   = useState("grid"); // "grid" | "list"

  /* ── Fetch category + its products ── */
  useEffect(() => {
    if (!name) return;
   // Replace the load function inside useEffect in CategoryPage.jsx

const load = async () => {
  try {
    setLoading(true);

    // 1. Find the matching category
    const catRes = await API.get("/category");
    const cats   = catRes.data.data || catRes.data;
    const found  = cats.find(
      (c) => c.slug === name || c.name?.toLowerCase() === name.toLowerCase()
    );
    setCategory(found || null);

    if (!found) return;

    // 2. Fetch ALL products then filter client-side by category._id
    const prodRes = await API.get("/product");
    const all     = prodRes.data.data || prodRes.data || [];

    const filtered = all.filter(
      (p) => p.category?._id === found._id || p.category === found._id
    );

    setProducts(filtered);
  } catch {
    toast.error("Failed to load category");
  } finally {
    setLoading(false);
  }
};
    load();
  }, [name]);

  /* ── Add to cart ── */
  const handleAddToCart = async (product) => {
    if (product.stock <= 0) { toast.error("Out of stock"); return; }
    if (!user) { navigate(`/login?redirect=/category/${name}`); return; }
    try {
      setAddingId(product._id);
      await API.post("/user/cart", { productId: product._id, quantity: 1 }, { withCredentials: true });
      fetchCartCount();
      toast.success("Added to cart!");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch { toast.error("Unable to add to cart"); }
    finally { setAddingId(null); }
  };

  /* ── Filter + Sort ── */
  const displayed = products
    .filter((p) => p.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "price_asc")  return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "name_asc")   return a.name.localeCompare(b.name);
      return 0;
    });

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"
            style={{ width: "3rem", height: "3rem" }} />
          <p className="text-muted fw-medium">Loading category...</p>
        </div>
      </div>
    );
  }

  /* ── Category not found ── */
  if (!category) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-10 mb-3"
            style={{ width: 80, height: 80 }}>
            <i className="fas fa-folder-open text-danger" style={{ fontSize: "2rem" }}></i>
          </div>
          <h5 className="fw-bold text-dark mb-1">Category not found</h5>
          <p className="text-muted small mb-3">The category "<strong>{name}</strong>" doesn't exist.</p>
          <Link to="/" className="btn btn-primary rounded-pill px-4">
            <i className="fas fa-arrow-left me-2"></i>Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light" style={{ minHeight: "100vh" }}>

      {/* ── Category Banner ── */}
      <div className="position-relative overflow-hidden"
        style={{ height: 220, background: "linear-gradient(135deg,#0d6efd,#003db5)" }}>
        {category.image?.url && (
          <img src={category.image.url} alt={category.name}
            className="position-absolute w-100 h-100"
            style={{ objectFit: "cover", opacity: 0.18, top: 0, left: 0 }} />
        )}
        {/* Breadcrumb */}
        <div className="container position-relative h-100 d-flex flex-column justify-content-center">
          <nav aria-label="breadcrumb" className="mb-2">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/" className="text-white text-opacity-75 text-decoration-none small">Home</Link>
              </li>
              <li className="breadcrumb-item active small" style={{ color: "rgba(255,255,255,0.6)" }}>
                {category.name}
              </li>
            </ol>
          </nav>
          <h2 className="fw-bold text-white mb-1">{category.name}</h2>
          {category.description && (
            <p className="text-white mb-0 small" style={{ opacity: 0.75, maxWidth: 500 }}>
              {category.description}
            </p>
          )}
          <div className="mt-2">
            <span className="badge bg-white text-primary rounded-pill px-3 py-1 fw-semibold small">
              {products.length} product{products.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="container py-4">

        {/* ── Toolbar ── */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-3 p-md-4">
            <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center gap-3">

              {/* Search */}
              <div className="input-group" style={{ maxWidth: 340 }}>
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="fas fa-search" style={{ fontSize: "0.85rem" }}></i>
                </span>
                <input type="text" className="form-control bg-light border-start-0"
                  placeholder={"Search in " + category.name + "..."}
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                {searchTerm && (
                  <button className="input-group-text bg-light border-start-0 text-muted border"
                    onClick={() => setSearchTerm("")}>
                    <i className="fas fa-times" style={{ fontSize: "0.8rem" }}></i>
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="input-group" style={{ maxWidth: 220 }}>
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="fas fa-sort" style={{ fontSize: "0.85rem" }}></i>
                </span>
                <select className="form-select bg-light border-start-0"
                  value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Results count + view toggle */}
              <div className="d-flex align-items-center gap-2 ms-md-auto">
                <span className="text-muted small">
                  {displayed.length} result{displayed.length !== 1 ? "s" : ""}
                </span>
                <div className="btn-group rounded-3 overflow-hidden border ms-2" role="group">
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
          </div>
        </div>

        {/* ── Empty State ── */}
        {displayed.length === 0 && (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body py-5 text-center">
              <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mb-3"
                style={{ width: 72, height: 72 }}>
                <i className="fas fa-box-open text-primary" style={{ fontSize: "1.8rem" }}></i>
              </div>
              <h6 className="fw-bold text-dark mb-1">
                {searchTerm ? "No products match your search" : "No products in this category yet"}
              </h6>
              <p className="text-muted small mb-3">
                {searchTerm ? "Try a different keyword." : "Check back soon — we're adding products!"}
              </p>
              {searchTerm
                ? <button className="btn btn-outline-secondary rounded-pill px-4"
                    onClick={() => setSearchTerm("")}>
                    <i className="fas fa-times me-2"></i>Clear Search
                  </button>
                : <Link to="/" className="btn btn-primary rounded-pill px-4">
                    <i className="fas fa-home me-2"></i>Back to Home
                  </Link>
              }
            </div>
          </div>
        )}

        {/* ── GRID VIEW ── */}
        {displayed.length > 0 && viewMode === "grid" && (
          <div className="row g-3">
            {displayed.map((product) => {
              const inStock = product.stock > 0;
              const isLow   = product.stock > 0 && product.stock <= 5;
              return (
                <div key={product._id} className="col-6 col-md-4 col-xl-3">
                  <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden"
                    style={{ transition: "transform 0.2s, box-shadow 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>

                    {/* Image */}
                    <Link to={"/product/" + product._id} className="text-decoration-none">
                      <div className="position-relative bg-light" style={{ height: 180 }}>
                        <img src={product.images?.[0]?.url || "https://via.placeholder.com/300"}
                          alt={product.name} className="w-100 h-100"
                          style={{ objectFit: "contain", padding: "0.5rem" }} />
                        {/* Badges */}
                        {!inStock && (
                          <span className="position-absolute top-0 start-0 badge bg-danger m-2 rounded-pill"
                            style={{ fontSize: "0.65rem" }}>Out of Stock</span>
                        )}
                        {isLow && (
                          <span className="position-absolute top-0 start-0 badge bg-warning text-dark m-2 rounded-pill"
                            style={{ fontSize: "0.65rem" }}>Only {product.stock} left!</span>
                        )}
                      </div>
                    </Link>

                    <div className="card-body p-3 d-flex flex-column gap-2">
                      <Link to={"/product/" + product._id} className="text-decoration-none">
                        <h6 className="fw-semibold text-dark mb-0 text-truncate" style={{ fontSize: "0.88rem" }}>
                          {product.name}
                        </h6>
                      </Link>
                      {product.brand?.name && (
                        <p className="text-muted mb-0" style={{ fontSize: "0.72rem" }}>
                          {product.brand.name}
                        </p>
                      )}
                      <p className="fw-bold text-primary mb-0" style={{ fontSize: "1.05rem" }}>
                        ₹{Number(product.price).toLocaleString()}
                      </p>
                      <button
                        className={"btn btn-sm rounded-3 fw-medium w-100 d-flex align-items-center justify-content-center gap-2 " + (inStock ? "btn-primary" : "btn-secondary")}
                        onClick={() => handleAddToCart(product)}
                        disabled={!inStock || addingId === product._id}>
                        {addingId === product._id
                          ? <span className="spinner-border spinner-border-sm" role="status"></span>
                          : <i className="fas fa-shopping-cart" style={{ fontSize: "0.75rem" }}></i>
                        }
                        {inStock ? "Add to Cart" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── LIST VIEW ── */}
        {displayed.length > 0 && viewMode === "list" && (
          <div className="d-flex flex-column gap-3">
            {displayed.map((product) => {
              const inStock = product.stock > 0;
              const isLow   = product.stock > 0 && product.stock <= 5;
              return (
                <div key={product._id}
                  className="card border-0 shadow-sm rounded-4 overflow-hidden"
                  style={{ transition: "box-shadow 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = ""}>
                  <div className="card-body p-3 p-md-4">
                    <div className="d-flex gap-3 gap-md-4 align-items-center">

                      {/* Image */}
                      <Link to={"/product/" + product._id}
                        className="rounded-3 overflow-hidden border bg-light flex-shrink-0 text-decoration-none"
                        style={{ width: 90, height: 90 }}>
                        <img src={product.images?.[0]?.url || "https://via.placeholder.com/90"}
                          alt={product.name} className="w-100 h-100"
                          style={{ objectFit: "contain", padding: "6px" }} />
                      </Link>

                      {/* Details */}
                      <div className="flex-grow-1 min-width-0">
                        <div className="d-flex flex-wrap gap-2 mb-1">
                          {product.brand?.name && (
                            <span className="badge bg-secondary text-white rounded-pill"
                              style={{ fontSize: "0.65rem" }}>{product.brand.name}</span>
                          )}
                          {isLow && (
                            <span className="badge bg-warning text-dark rounded-pill"
                              style={{ fontSize: "0.65rem" }}>Only {product.stock} left!</span>
                          )}
                          {!inStock && (
                            <span className="badge bg-danger rounded-pill"
                              style={{ fontSize: "0.65rem" }}>Out of Stock</span>
                          )}
                        </div>
                        <Link to={"/product/" + product._id} className="text-decoration-none">
                          <h6 className="fw-semibold text-dark mb-1 text-truncate">{product.name}</h6>
                        </Link>
                        <p className="text-muted small mb-0 d-none d-md-block"
                          style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {product.description}
                        </p>
                      </div>

                      {/* Price + CTA */}
                      <div className="d-flex flex-column align-items-end gap-2 flex-shrink-0">
                        <p className="fw-bold text-primary mb-0" style={{ fontSize: "1.1rem" }}>
                          ₹{Number(product.price).toLocaleString()}
                        </p>
                        <div className="d-flex gap-2">
                          <button
                            className={"btn btn-sm rounded-3 fw-medium d-flex align-items-center gap-1 " + (inStock ? "btn-primary" : "btn-secondary")}
                            onClick={() => handleAddToCart(product)}
                            disabled={!inStock || addingId === product._id}
                            style={{ whiteSpace: "nowrap" }}>
                            {addingId === product._id
                              ? <span className="spinner-border spinner-border-sm" role="status"></span>
                              : <i className="fas fa-shopping-cart" style={{ fontSize: "0.7rem" }}></i>
                            }
                            {inStock ? "Add to Cart" : "Out of Stock"}
                          </button>
                          <Link to={"/product/" + product._id}
                            className="btn btn-sm btn-outline-secondary rounded-3 d-flex align-items-center gap-1"
                            style={{ whiteSpace: "nowrap" }}>
                            <i className="fas fa-eye" style={{ fontSize: "0.7rem" }}></i>
                            <span className="d-none d-sm-inline">View</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}