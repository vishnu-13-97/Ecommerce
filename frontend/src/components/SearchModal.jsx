import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api-helper/Axioxinstance";

const SearchModal = () => {
  const [searchTerm,   setSearchTerm]   = useState("");
  const [products,     setProducts]     = useState([]);
  const [filtered,     setFiltered]     = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [recentSearch, setRecentSearch] = useState(
    () => JSON.parse(localStorage.getItem("recentSearches") || "[]")
  );

  const inputRef  = useRef(null);
  const navigate  = useNavigate();

  /* ── Fetch all products once ── */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await API.get("/product");
        setProducts(res.data.data || res.data || []);
      } catch { console.error("Failed to fetch products"); }
      finally { setLoading(false); }
    };
    fetchProducts();
  }, []);

  /* ── Filter on searchTerm change ── */
  useEffect(() => {
    if (!searchTerm.trim()) { setFiltered([]); return; }
    const lower = searchTerm.toLowerCase();
    const results = products.filter(
      (p) =>
        p.name?.toLowerCase().includes(lower) ||
        p.category?.name?.toLowerCase().includes(lower) ||
        p.brand?.name?.toLowerCase().includes(lower)
    );
    setFiltered(results.slice(0, 6));
  }, [searchTerm, products]);

  /* ── Focus input when modal opens ── */
  useEffect(() => {
    const el = document.getElementById("searchModal");
    if (!el) return;
    const handler = () => { setSearchTerm(""); setFiltered([]); setTimeout(() => inputRef.current?.focus(), 100); };
    el.addEventListener("shown.bs.modal", handler);
    return () => el.removeEventListener("shown.bs.modal", handler);
  }, []);

  /* ── Dismiss modal helper ── */
  const closeModal = () => {
    const modal = window.bootstrap?.Modal?.getInstance(document.getElementById("searchModal"));
    modal?.hide();
  };

  /* ── Navigate to product ── */
  const handleSelect = (product) => {
    saveRecent(product.name);
    closeModal();
    navigate(`/product/${product._id}`);
  };

  /* ── Full search → shop page ── */
  const handleFullSearch = () => {
    if (!searchTerm.trim()) return;
    saveRecent(searchTerm.trim());
    closeModal();
    navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  /* ── Save recent searches to localStorage ── */
  const saveRecent = (term) => {
    const prev  = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    const next  = [term, ...prev.filter((t) => t !== term)].slice(0, 5);
    localStorage.setItem("recentSearches", JSON.stringify(next));
    setRecentSearch(next);
  };

  const clearRecent = () => {
    localStorage.removeItem("recentSearches");
    setRecentSearch([]);
  };

  const popularTags = ["Smartphones", "Laptops", "Clothing", "Footwear", "Home Decor", "Groceries"];

  return (
    <div className="modal fade" id="searchModal" tabIndex="-1"
      aria-labelledby="searchModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-fullscreen">
        <div className="modal-content border-0" style={{ background: "rgba(15,23,42,0.97)" }}>

          {/* ── Header ── */}
          <div className="modal-header border-0 px-4 pt-4 pb-0">
            <div className="d-flex align-items-center gap-2">
              <i className="fas fa-search text-primary" style={{ fontSize: "1rem" }}></i>
              <h5 className="modal-title fw-bold text-white mb-0" id="searchModalLabel">
                Search Products
              </h5>
            </div>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" />
          </div>

          {/* ── Body ── */}
          <div className="modal-body d-flex flex-column px-4 py-4" style={{ overflowY: "auto" }}>
            <div className="mx-auto w-100" style={{ maxWidth: 720 }}>

              {/* ── Search Input ── */}
              <div className="input-group mb-4 shadow-sm rounded-4 overflow-hidden">
                <span className="input-group-text bg-white border-0 ps-4 text-muted">
                  {loading
                    ? <span className="spinner-border spinner-border-sm text-primary" role="status" />
                    : <i className="fas fa-search text-muted"></i>}
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  className="form-control border-0 py-3 bg-white"
                  style={{ fontSize: "1.05rem" }}
                  placeholder="Search products, brands, categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleFullSearch()}
                />
                {searchTerm && (
                  <button className="input-group-text bg-white border-0 pe-3 text-muted"
                    onClick={() => { setSearchTerm(""); setFiltered([]); inputRef.current?.focus(); }}>
                    <i className="fas fa-times"></i>
                  </button>
                )}
                <button
                  className="btn btn-primary px-4 fw-semibold border-0"
                  onClick={handleFullSearch}
                  disabled={!searchTerm.trim()}>
                  Search
                </button>
              </div>

              {/* ── Live Results ── */}
              {filtered.length > 0 && (
                <div className="card border-0 rounded-4 overflow-hidden mb-4 shadow">
                  <div className="card-header bg-white border-bottom px-4 py-2 d-flex align-items-center justify-content-between">
                    <span className="text-muted small fw-medium">
                      <i className="fas fa-bolt text-warning me-1" style={{ fontSize: "0.72rem" }}></i>
                      Quick Results
                    </span>
                    <span className="badge bg-primary rounded-pill" style={{ fontSize: "0.65rem" }}>
                      {filtered.length} found
                    </span>
                  </div>
                  {filtered.map((product, i) => (
                    <div key={product._id}
                      className="d-flex align-items-center gap-3 px-4 py-3 bg-white"
                      style={{
                        cursor: "pointer",
                        borderBottom: i < filtered.length - 1 ? "1px solid #f1f5f9" : "none",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                      onClick={() => handleSelect(product)}>
                      {/* Thumbnail */}
                      <div className="rounded-3 overflow-hidden flex-shrink-0 border bg-light"
                        style={{ width: 48, height: 48 }}>
                        <img
                          src={product.images?.[0]?.url || "https://via.placeholder.com/48"}
                          alt={product.name}
                          className="w-100 h-100"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      {/* Info */}
                      <div className="flex-grow-1 min-width-0">
                        <p className="fw-semibold text-dark mb-0 text-truncate small">{product.name}</p>
                        <div className="d-flex align-items-center gap-2">
                          {product.category?.name && (
                            <span className="badge bg-primary text-white rounded-pill"
                              style={{ fontSize: "0.6rem" }}>{product.category.name}</span>
                          )}
                          {product.brand?.name && (
                            <span className="badge bg-secondary text-white rounded-pill"
                              style={{ fontSize: "0.6rem" }}>{product.brand.name}</span>
                          )}
                        </div>
                      </div>
                      {/* Price */}
                      <div className="text-end flex-shrink-0">
                        <p className="fw-bold text-primary mb-0 small">
                          ₹{Number(product.price).toLocaleString()}
                        </p>
                        <span className={"badge rounded-pill " + (product.stock > 0 ? "bg-success" : "bg-danger")}
                          style={{ fontSize: "0.58rem" }}>
                          {product.stock > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                      <i className="fas fa-chevron-right text-muted flex-shrink-0"
                        style={{ fontSize: "0.7rem" }}></i>
                    </div>
                  ))}
                  {/* View all */}
                  <div className="bg-white px-4 py-2 border-top text-center">
                    <button className="btn btn-link text-primary text-decoration-none small fw-medium p-0"
                      onClick={handleFullSearch}>
                      View all results for "<strong>{searchTerm}</strong>"
                      <i className="fas fa-arrow-right ms-1" style={{ fontSize: "0.7rem" }}></i>
                    </button>
                  </div>
                </div>
              )}

              {/* ── No results ── */}
              {searchTerm && filtered.length === 0 && !loading && (
                <div className="text-center py-4 mb-4">
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{ width: 60, height: 60, background: "rgba(255,255,255,0.08)" }}>
                    <i className="fas fa-search text-white" style={{ fontSize: "1.4rem", opacity: 0.4 }}></i>
                  </div>
                  <p className="text-white fw-semibold mb-1">No results for "{searchTerm}"</p>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem" }}>
                    Try a different keyword or browse categories below.
                  </p>
                </div>
              )}

              {/* ── Recent Searches ── */}
              {!searchTerm && recentSearch.length > 0 && (
                <div className="mb-4">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <p className="fw-semibold mb-0 small d-flex align-items-center gap-2"
                      style={{ color: "rgba(255,255,255,0.6)" }}>
                      <i className="fas fa-history" style={{ fontSize: "0.75rem" }}></i>
                      Recent Searches
                    </p>
                    <button className="btn btn-link p-0 text-decoration-none"
                      style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem" }}
                      onClick={clearRecent}>
                      Clear all
                    </button>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {recentSearch.map((term) => (
                      <button key={term}
                        className="btn btn-sm rounded-pill d-flex align-items-center gap-2 fw-medium"
                        style={{
                          background: "rgba(255,255,255,0.08)",
                          color: "rgba(255,255,255,0.8)",
                          border: "1px solid rgba(255,255,255,0.15)",
                          fontSize: "0.78rem",
                        }}
                        onClick={() => setSearchTerm(term)}>
                        <i className="fas fa-history" style={{ fontSize: "0.6rem", opacity: 0.6 }}></i>
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Popular Searches ── */}
              {!searchTerm && (
                <div className="mb-4">
                  <p className="fw-semibold mb-2 small d-flex align-items-center gap-2"
                    style={{ color: "rgba(255,255,255,0.6)" }}>
                    <i className="fas fa-fire text-warning" style={{ fontSize: "0.75rem" }}></i>
                    Popular Searches
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <button key={tag}
                        className="btn btn-sm rounded-pill fw-medium"
                        style={{
                          background: "rgba(13,110,253,0.15)",
                          color: "#7dd3fc",
                          border: "1px solid rgba(13,110,253,0.3)",
                          fontSize: "0.78rem",
                        }}
                        onClick={() => setSearchTerm(tag)}>
                        <i className="fas fa-search me-1" style={{ fontSize: "0.6rem" }}></i>
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Tip ── */}
              {!searchTerm && (
                <p className="text-center mb-0" style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.72rem" }}>
                  <i className="fas fa-keyboard me-1"></i>
                  Press <kbd style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", border: "none", borderRadius: 4, padding: "1px 6px" }}>Enter</kbd> to search &nbsp;·&nbsp;
                  <kbd style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", border: "none", borderRadius: 4, padding: "1px 6px" }}>Esc</kbd> to close
                </p>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;