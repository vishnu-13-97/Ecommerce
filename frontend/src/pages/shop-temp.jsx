import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import API from "../api-helper/Axioxinstance";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const SORT_OPTIONS = [
  { value: "default",    label: "Default"          },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc",label: "Price: High → Low" },
  { value: "name_asc",  label: "Name: A → Z"       },
];

export default function Shop() {
  const [products,    setProducts]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [brands,      setBrands]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [addingId,    setAddingId]    = useState(null);
  const [activeTab,   setActiveTab]   = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [sortBy,      setSortBy]      = useState("default");
  const [searchTerm,  setSearchTerm]  = useState("");
  const [viewMode,    setViewMode]    = useState("grid");
  const [priceRange,  setPriceRange]  = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { fetchCartCount } = useCart();

  /* ── Read ?search= from Hero search bar ── */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search");
    if (q) setSearchTerm(q);
  }, [location.search]);

  /* ── Fetch all data ── */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes, brandRes] = await Promise.all([
          API.get("/product"),
          API.get("/category"),
          API.get("/brand"),
        ]);
        setProducts(  prodRes.data.data   || prodRes.data   || []);
        setCategories(catRes.data.data    || catRes.data    || []);
        setBrands(    brandRes.data.data  || brandRes.data  || []);
      } catch { toast.error("Failed to load products"); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  /* ── Add to cart ── */
  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    if (product.stock <= 0) { toast.error("Out of stock"); return; }
    if (!user) { navigate(`/login?redirect=/shop`); return; }
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
    .filter((p) => {
      const matchCat   = activeTab    === "all" || p.category?._id === activeTab;
      const matchBrand = brandFilter  === "all" || p.brand?._id    === brandFilter;
      const matchSearch =
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchPrice =
        priceRange === "all"      ? true :
        priceRange === "0-500"    ? p.price <= 500 :
        priceRange === "500-2000" ? p.price >  500 && p.price <= 2000 :
        priceRange === "2000+"    ? p.price > 2000 : true;
      return matchCat && matchBrand && matchSearch && matchPrice;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc")  return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "name_asc")   return a.name.localeCompare(b.name);
      return 0;
    });

  const hasFilters = activeTab !== "all" || brandFilter !== "all" ||
                     searchTerm || priceRange !== "all" || sortBy !== "default";

  const clearFilters = () => {
    setActiveTab("all"); setBrandFilter("all");
    setSearchTerm(""); setPriceRange("all"); setSortBy("default");
  };

  const inStock = (p) => p.stock > 0;
  const isLow   = (p) => p.stock > 0 && p.stock <= 5;

  /* ── Sidebar content (shared between desktop + mobile) ── */
  const SidebarContent = () => (
    <div className="d-flex flex-column gap-3">

      {/* Search */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-3">
          <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
            <i className="fas fa-search text-primary" style={{ fontSize: "0.85rem" }}></i>
            Search
          </h6>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0 text-muted">
              <i className="fas fa-search" style={{ fontSize: "0.8rem" }}></i>
            </span>
            <input type="text" className="form-control bg-light border-start-0"
              placeholder="Search products..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            {searchTerm && (
              <button className="input-group-text bg-light border text-muted"
                onClick={() => setSearchTerm("")}>
                <i className="fas fa-times" style={{ fontSize: "0.75rem" }}></i>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-3">
          <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
            <i className="fas fa-layer-group text-primary" style={{ fontSize: "0.85rem" }}></i>
            Categories
          </h6>
          <div className="d-flex flex-column gap-1">
            <button
              className={"btn btn-sm text-start rounded-3 d-flex align-items-center justify-content-between px-3 py-2 " + (activeTab === "all" ? "btn-primary" : "btn-light")}
              onClick={() => setActiveTab("all")}>
              <span className="d-flex align-items-center gap-2">
                <i className="fas fa-th-large" style={{ fontSize: "0.72rem" }}></i>
                All Categories
              </span>
              <span className={"badge rounded-pill " + (activeTab === "all" ? "bg-white text-primary" : "bg-secondary text-white")}
                style={{ fontSize: "0.6rem" }}>{products.length}</span>
            </button>
            {categories.map((cat) => {
              const count = products.filter((p) => p.category?._id === cat._id).length;
              return (
                <button key={cat._id}
                  className={"btn btn-sm text-start rounded-3 d-flex align-items-center justify-content-between px-3 py-2 " + (activeTab === cat._id ? "btn-primary" : "btn-light")}
                  onClick={() => setActiveTab(cat._id)}>
                  <span className="d-flex align-items-center gap-2">
                    {cat.image?.url && (
                      <img src={cat.image.url} alt={cat.name} className="rounded-circle"
                        style={{ width: 16, height: 16, objectFit: "cover" }} />
                    )}
                    <span style={{ fontSize: "0.82rem" }}>{cat.name}</span>
                  </span>
                  <span className={"badge rounded-pill " + (activeTab === cat._id ? "bg-white text-primary" : "bg-secondary text-white")}
                    style={{ fontSize: "0.6rem" }}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Brands */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-3">
          <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
            <i className="fas fa-tag text-primary" style={{ fontSize: "0.85rem" }}></i>
            Brands
          </h6>
          <div className="d-flex flex-column gap-1">
            <button
              className={"btn btn-sm text-start rounded-3 d-flex align-items-center justify-content-between px-3 py-2 " + (brandFilter === "all" ? "btn-primary" : "btn-light")}
              onClick={() => setBrandFilter("all")}>
              <span className="d-flex align-items-center gap-2">
                <i className="fas fa-th-large" style={{ fontSize: "0.72rem" }}></i>
                All Brands
              </span>
              <span className={"badge rounded-pill " + (brandFilter === "all" ? "bg-white text-primary" : "bg-secondary text-white")}
                style={{ fontSize: "0.6rem" }}>{products.length}</span>
            </button>
            {brands.map((brand) => {
              const count = products.filter((p) => p.brand?._id === brand._id).length;
              return (
                <button key={brand._id}
                  className={"btn btn-sm text-start rounded-3 d-flex align-items-center justify-content-between px-3 py-2 " + (brandFilter === brand._id ? "btn-primary" : "btn-light")}
                  onClick={() => setBrandFilter(brand._id)}>
                  <span className="d-flex align-items-center gap-2">
                    {brand.logo?.url ? (
                      <img src={brand.logo.url} alt={brand.name} className="rounded-circle"
                        style={{ width: 16, height: 16, objectFit: "contain" }} />
                    ) : (
                      <i className="fas fa-tag" style={{ fontSize: "0.7rem" }}></i>
                    )}
                    <span style={{ fontSize: "0.82rem" }}>{brand.name}</span>
                  </span>
                  <span className={"badge rounded-pill " + (brandFilter === brand._id ? "bg-white text-primary" : "bg-secondary text-white")}
                    style={{ fontSize: "0.6rem" }}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Price Range */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-3">
          <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
            <i className="fas fa-rupee-sign text-primary" style={{ fontSize: "0.85rem" }}></i>
            Price Range
          </h6>
          <div className="d-flex flex-column gap-1">
            {[
              { value: "all",      label: "All Prices"    },
              { value: "0-500",    label: "Under ₹500"    },
              { value: "500-2000", label: "₹500 – ₹2,000" },
              { value: "2000+",    label: "Above ₹2,000"  },
            ].map((opt) => (
              <button key={opt.value}
                className={"btn btn-sm text-start rounded-3 px-3 py-2 " + (priceRange === opt.value ? "btn-primary" : "btn-light")}
                onClick={() => setPriceRange(opt.value)}
                style={{ fontSize: "0.82rem" }}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <button className="btn btn-outline-danger rounded-3 btn-sm fw-medium"
          onClick={clearFilters}>
          <i className="fas fa-times me-2"></i>Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-light" style={{ minHeight: "100vh" }}>

      {/* ── Page Banner ── */}
      <div style={{ background: "linear-gradient(135deg,#0d6efd,#003db5)", minHeight: 160 }}
        className="d-flex align-items-center">
        <div className="container py-4">
          <nav aria-label="breadcrumb" className="mb-2">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/" className="text-white text-opacity-75 text-decoration-none small">Home</Link>
              </li>
              <li className="breadcrumb-item active small"
                style={{ color: "rgba(255,255,255,0.55)" }}>Shop</li>
            </ol>
          </nav>
          <h2 className="fw-bold text-white mb-1">All Products</h2>
          <p className="mb-0 small" style={{ color: "rgba(255,255,255,0.75)" }}>
            {products.length} products · {categories.length} categories · {brands.length} brands
          </p>
        </div>
      </div>

      <div className="container py-4">

        {/* ── Mobile filter button ── */}
        <div className="d-lg-none mb-3">
          <button className="btn btn-primary rounded-3 fw-medium d-flex align-items-center gap-2"
            onClick={() => setSidebarOpen(true)}>
            <i className="fas fa-filter"></i>
            Filters
            {hasFilters && (
              <span className="badge bg-white text-primary rounded-pill" style={{ fontSize: "0.65rem" }}>
                ON
              </span>
            )}
          </button>
        </div>

        {/* ── Mobile sidebar overlay ── */}
        {sidebarOpen && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-lg-none"
            style={{ zIndex: 1050, background: "rgba(0,0,0,0.5)" }}
            onClick={() => setSidebarOpen(false)}>
            <div className="position-absolute top-0 start-0 h-100 bg-light p-3 overflow-auto"
              style={{ width: 300 }}
              onClick={(e) => e.stopPropagation()}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold text-dark mb-0">Filters</h6>
                <button className="btn btn-sm btn-light rounded-circle"
                  onClick={() => setSidebarOpen(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <SidebarContent />
            </div>
          </div>
        )}

        <div className="row g-4">

          {/* ── Desktop Sidebar ── */}
          <div className="col-lg-3 d-none d-lg-block">
            <SidebarContent />
          </div>

          {/* ── Products ── */}
          <div className="col-12 col-lg-9">

            {/* Toolbar */}
            <div className="card border-0 shadow-sm rounded-4 mb-3">
              <div className="card-body p-3 d-flex flex-wrap align-items-center gap-3">
                <p className="text-muted small mb-0 me-auto">
                  Showing <strong>{displayed.length}</strong> of <strong>{products.length}</strong> products
                  {activeTab !== "all" && (
                    <> in <strong className="text-primary">
                      {categories.find((c) => c._id === activeTab)?.name}
                    </strong></>
                  )}
                  {brandFilter !== "all" && (
                    <> · <strong className="text-primary">
                      {brands.find((b) => b._id === brandFilter)?.name}
                    </strong></>
                  )}
                </p>

                {/* Active filter pills */}
                <div className="d-flex flex-wrap gap-1">
                  {priceRange !== "all" && (
                    <span className="badge bg-primary rounded-pill d-flex align-items-center gap-1 px-2 py-1"
                      style={{ fontSize: "0.68rem" }}>
                      {priceRange === "0-500" ? "Under ₹500" : priceRange === "500-2000" ? "₹500–₹2K" : "₹2K+"}
                      <i className="fas fa-times" style={{ cursor: "pointer", fontSize: "0.6rem" }}
                        onClick={() => setPriceRange("all")}></i>
                    </span>
                  )}
                </div>

                {/* Sort */}
                <div className="input-group" style={{ maxWidth: 200 }}>
                  <span className="input-group-text bg-light border-end-0 text-muted">
                    <i className="fas fa-sort" style={{ fontSize: "0.8rem" }}></i>
                  </span>
                  <select className="form-select bg-light border-start-0 small"
                    value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                {/* View toggle */}
                <div className="btn-group rounded-3 overflow-hidden border">
                  <button className={"btn btn-sm px-3 " + (viewMode === "grid" ? "btn-primary" : "btn-light")}
                    onClick={() => setViewMode("grid")}>
                    <i className="fas fa-th" style={{ fontSize: "0.85rem" }}></i>
                  </button>
                  <button className={"btn btn-sm px-3 " + (viewMode === "list" ? "btn-primary" : "btn-light")}
                    onClick={() => setViewMode("list")}>
                    <i className="fas fa-list" style={{ fontSize: "0.85rem" }}></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status"
                  style={{ width: "3rem", height: "3rem" }} />
                <p className="text-muted fw-medium">Loading products...</p>
              </div>
            )}

            {/* Empty state */}
            {!loading && displayed.length === 0 && (
              <div className="card border-0 shadow-sm rounded-4 py-5 text-center">
                <div className="d-inline-flex align-items-center justify-content-center
                                rounded-circle bg-primary bg-opacity-10 mb-3 mx-auto"
                  style={{ width: 72, height: 72 }}>
                  <i className="fas fa-box-open text-primary" style={{ fontSize: "1.8rem" }}></i>
                </div>
                <h6 className="fw-bold text-dark mb-1">No products found</h6>
                <p className="text-muted small mb-3">Try adjusting your filters or search term.</p>
                <button className="btn btn-outline-secondary rounded-pill px-4 mx-auto"
                  style={{ width: "fit-content" }} onClick={clearFilters}>
                  <i className="fas fa-times me-2"></i>Clear Filters
                </button>
              </div>
            )}

            {/* ── GRID VIEW ── */}
            {!loading && displayed.length > 0 && viewMode === "grid" && (
              <div className="row g-3">
                {displayed.map((product) => (
                  <div key={product._id} className="col-6 col-md-4 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden"
                      style={{ cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
                      onClick={() => navigate(`/product/${product._id}`)}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.12)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>

                      {/* Image */}
                      <div className="position-relative bg-light" style={{ height: 180 }}>
                        <img src={product.images?.[0]?.url || "https://via.placeholder.com/300"}
                          alt={product.name} className="w-100 h-100"
                          style={{ objectFit: "cover" }} />
                        {product.category?.name && (
                          <span className="position-absolute top-0 start-0 badge bg-primary rounded-pill m-2"
                            style={{ fontSize: "0.6rem" }}>
                            {product.category.name}
                          </span>
                        )}
                        {!inStock(product) && (
                          <div className="position-absolute top-0 start-0 w-100 h-100
                                          d-flex align-items-center justify-content-center"
                            style={{ background: "rgba(0,0,0,0.45)" }}>
                            <span className="badge bg-danger rounded-pill px-3">Out of Stock</span>
                          </div>
                        )}
                        {isLow(product) && (
                          <span className="position-absolute bottom-0 end-0 badge bg-warning text-dark m-2 rounded-pill"
                            style={{ fontSize: "0.6rem" }}>
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
                        <h6 className="fw-bold text-dark mb-0 text-truncate" style={{ fontSize: "0.88rem" }}>
                          {product.name}
                        </h6>
                        <p className="text-muted mb-0" style={{
                          fontSize: "0.75rem", lineHeight: 1.4,
                          display: "-webkit-box", WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical", overflow: "hidden",
                        }}>
                          {product.description || "No description available."}
                        </p>
                        <div className="d-flex align-items-center justify-content-between mt-auto pt-1"
                          style={{ borderTop: "1px solid #f1f5f9" }}>
                          <p className="fw-bold text-primary mb-0">
                            ₹{Number(product.price).toLocaleString()}
                          </p>
                          <button
                            className={"btn btn-sm rounded-3 d-flex align-items-center gap-1 " + (inStock(product) ? "btn-primary" : "btn-secondary")}
                            onClick={(e) => handleAddToCart(e, product)}
                            disabled={!inStock(product) || addingId === product._id}
                            style={{ fontSize: "0.72rem" }}>
                            {addingId === product._id
                              ? <span className="spinner-border spinner-border-sm" role="status"></span>
                              : <i className="fas fa-shopping-cart"></i>}
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
            {!loading && displayed.length > 0 && viewMode === "list" && (
              <div className="d-flex flex-column gap-3">
                {displayed.map((product) => (
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
                            {product.category?.name && (
                              <span className="badge bg-primary text-white rounded-pill"
                                style={{ fontSize: "0.6rem" }}>{product.category.name}</span>
                            )}
                            {product.brand?.name && (
                              <span className="badge bg-secondary text-white rounded-pill"
                                style={{ fontSize: "0.6rem" }}>{product.brand.name}</span>
                            )}
                            {!inStock(product) && (
                              <span className="badge bg-danger rounded-pill"
                                style={{ fontSize: "0.6rem" }}>Out of Stock</span>
                            )}
                            {isLow(product) && (
                              <span className="badge bg-warning text-dark rounded-pill"
                                style={{ fontSize: "0.6rem" }}>Only {product.stock} left!</span>
                            )}
                          </div>
                          <h6 className="fw-bold text-dark mb-1 text-truncate">{product.name}</h6>
                          <p className="text-muted small mb-0 d-none d-md-block"
                            style={{ display: "-webkit-box", WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {product.description || "No description available."}
                          </p>
                        </div>

                        {/* Price + CTA */}
                        <div className="d-flex flex-column align-items-end gap-2 flex-shrink-0">
                          <p className="fw-bold text-primary mb-0" style={{ fontSize: "1.1rem" }}>
                            ₹{Number(product.price).toLocaleString()}
                          </p>
                          <div className="d-flex gap-2">
                            <button
                              className={"btn btn-sm rounded-3 fw-medium d-flex align-items-center gap-1 " + (inStock(product) ? "btn-primary" : "btn-secondary")}
                              onClick={(e) => handleAddToCart(e, product)}
                              disabled={!inStock(product) || addingId === product._id}
                              style={{ whiteSpace: "nowrap", fontSize: "0.78rem" }}>
                              {addingId === product._id
                                ? <span className="spinner-border spinner-border-sm" role="status"></span>
                                : <i className="fas fa-shopping-cart" style={{ fontSize: "0.7rem" }}></i>}
                              {inStock(product) ? "Add to Cart" : "Out of Stock"}
                            </button>
                            <button
                              className="btn btn-sm btn-outline-secondary rounded-3 d-flex align-items-center gap-1"
                              onClick={(e) => { e.stopPropagation(); navigate(`/product/${product._id}`); }}
                              style={{ fontSize: "0.78rem" }}>
                              <i className="fas fa-eye" style={{ fontSize: "0.7rem" }}></i>
                              <span className="d-none d-sm-inline">View</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}