import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api-helper/Axioxinstance";
import { toast } from "react-toastify";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // "table" | "grid"
  const navigate = useNavigate();

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get("/product");
      const data = res.data.data || res.data;
      setProducts(data.map((p) => ({
        id: p._id, name: p.name,
        category: p.category?.name || "N/A",
        brand: p.brand?.name || "N/A",
        price: p.price, stock: p.stock,
        status: p.isActive ? "Active" : "Inactive",
        image: p.images?.[0]?.url || "https://via.placeholder.com/60?text=No+Image",
      })));
    } catch { toast.error("Failed to load products."); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await API.delete(`/product/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setConfirmDeleteId(null);
      toast.success("Product deleted");
    } catch { toast.error("Failed to delete product."); }
    finally { setDeletingId(null); }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stockBadge = (stock) => {
    if (stock === 0) return { label: "Out of Stock", bg: "danger" };
    if (stock <= 5)  return { label: "Low Stock",    bg: "warning" };
    return                  { label: "In Stock",     bg: "success" };
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "50vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }} />
          <p className="text-muted fw-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-4">

      {/* Page Header */}
      <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3">
        <div>
          <h4 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <i className="fas fa-box-open text-primary"></i> Products
          </h4>
          <p className="text-muted small mb-0">{filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found</p>
        </div>
        <button className="btn btn-primary rounded-3 fw-semibold px-4 d-flex align-items-center gap-2 shadow-sm"
          onClick={() => navigate("/admin/product/new")}>
          <i className="fas fa-plus" style={{ fontSize: "0.8rem" }}></i> Add Product
        </button>
      </div>

      {/* Toolbar */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-3 p-md-4">
          <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center gap-3">
            <div className="input-group flex-grow-1" style={{ maxWidth: 380 }}>
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="fas fa-search" style={{ fontSize: "0.85rem" }}></i>
              </span>
              <input type="text" className="form-control bg-light border-start-0"
                placeholder="Search by product name..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} />
              {searchTerm && (
                <button className="input-group-text bg-light border-start-0 text-muted border"
                  onClick={() => setSearchTerm("")}>
                  <i className="fas fa-times" style={{ fontSize: "0.8rem" }}></i>
                </button>
              )}
            </div>
            <div className="d-flex align-items-center gap-2 ms-md-auto flex-wrap">
              <span className="badge bg-success text-white rounded-pill px-3 py-2 small">
                <i className="fas fa-check-circle me-1" style={{ fontSize: "0.65rem" }}></i>
                {products.filter((p) => p.status === "Active").length} Active
              </span>
              <span className="badge bg-warning text-dark rounded-pill px-3 py-2 small">
                <i className="fas fa-exclamation-circle me-1" style={{ fontSize: "0.65rem" }}></i>
                {products.filter((p) => p.stock <= 5).length} Low Stock
              </span>
              <div className="btn-group rounded-3 overflow-hidden border ms-1" role="group">
                <button className={"btn btn-sm px-3 " + (viewMode === "table" ? "btn-primary" : "btn-light")}
                  onClick={() => setViewMode("table")}>
                  <i className="fas fa-list" style={{ fontSize: "0.85rem" }}></i>
                </button>
                <button className={"btn btn-sm px-3 " + (viewMode === "grid" ? "btn-primary" : "btn-light")}
                  onClick={() => setViewMode("grid")}>
                  <i className="fas fa-th" style={{ fontSize: "0.85rem" }}></i>
                </button>
              </div>
              <button className="btn btn-light btn-sm rounded-3 px-3" onClick={fetchProducts}>
                <i className="fas fa-sync-alt" style={{ fontSize: "0.8rem" }}></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body py-5 text-center">
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mb-3"
              style={{ width: 72, height: 72 }}>
              <i className="fas fa-box-open text-primary" style={{ fontSize: "1.8rem" }}></i>
            </div>
            <h6 className="fw-bold text-dark mb-1">{searchTerm ? "No products match your search" : "No products yet"}</h6>
            <p className="text-muted small mb-3">{searchTerm ? "Try a different search term." : "Add your first product to get started."}</p>
            {searchTerm
              ? <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setSearchTerm("")}>
                  <i className="fas fa-times me-2"></i>Clear Search
                </button>
              : <button className="btn btn-primary rounded-pill px-4" onClick={() => navigate("/admin/product/new")}>
                  <i className="fas fa-plus me-2"></i>Add Product
                </button>
            }
          </div>
        </div>
      )}

      {/* TABLE VIEW */}
      {filteredProducts.length > 0 && viewMode === "table" && (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-borderless align-middle mb-0" style={{ fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #f1f5f9" }}>
                  {["#","PRODUCT","CATEGORY","BRAND","PRICE","STOCK","STATUS","ACTIONS"].map((h) => (
                    <th key={h} className={"py-3 text-muted fw-medium " + (h === "#" ? "px-4 " : "") + (h === "ACTIONS" ? "pe-4 text-end" : "")}
                      style={{ fontSize: "0.72rem", letterSpacing: "0.06em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => {
                  const stock = stockBadge(product.stock);
                  return (
                    <tr key={product.id} style={{ borderBottom: "1px solid #f8fafc", transition: "background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fafbff"}
                      onMouseLeave={e => e.currentTarget.style.background = ""}>
                      <td className="px-4 text-muted" style={{ fontSize: "0.78rem" }}>{index + 1}</td>
                      <td className="py-3">
                        <div className="d-flex align-items-center gap-3">
                          <img src={product.image} alt={product.name} className="rounded-3 flex-shrink-0"
                            style={{ width: 46, height: 46, objectFit: "cover" }} />
                          <span className="fw-semibold text-dark">{product.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-primary text-white rounded-pill px-2 py-1" style={{ fontSize: "0.72rem" }}>
                          {product.category}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-secondary text-white rounded-pill px-2 py-1" style={{ fontSize: "0.72rem" }}>
                          {product.brand}
                        </span>
                      </td>
                      <td className="fw-semibold text-dark">₹{product.price?.toLocaleString()}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span className={"badge bg-" + stock.bg + " rounded-pill"} style={{ fontSize: "0.68rem" }}>{stock.label}</span>
                          <span className="text-muted small">{product.stock}</span>
                        </div>
                      </td>
                      <td>
                        <span className={"badge rounded-pill px-2 py-1 " + (product.status === "Active" ? "bg-success" : "bg-secondary")}
                          style={{ fontSize: "0.72rem" }}>
                          <i className={"fas me-1 " + (product.status === "Active" ? "fa-check-circle" : "fa-times-circle")} style={{ fontSize: "0.6rem" }}></i>
                          {product.status}
                        </span>
                      </td>
                      <td className="pe-4 text-end">
                        {confirmDeleteId !== product.id ? (
                          <div className="d-flex align-items-center justify-content-end gap-2">
                            <button className="btn btn-sm btn-outline-primary rounded-3 px-3 fw-medium d-flex align-items-center gap-1"
                              onClick={() => navigate("/admin/product/edit/" + product.id)}>
                              <i className="fas fa-pen" style={{ fontSize: "0.7rem" }}></i> Edit
                            </button>
                            <button className="btn btn-sm btn-outline-danger rounded-3 px-3 fw-medium d-flex align-items-center gap-1"
                              onClick={() => setConfirmDeleteId(product.id)}>
                              <i className="fas fa-trash-alt" style={{ fontSize: "0.7rem" }}></i> Delete
                            </button>
                          </div>
                        ) : (
                          <div className="d-flex align-items-center justify-content-end gap-2">
                            <span className="text-danger small fw-medium">Sure?</span>
                            <button className="btn btn-sm btn-danger rounded-3 px-2"
                              onClick={() => handleDelete(product.id)} disabled={deletingId === product.id}>
                              {deletingId === product.id
                                ? <span className="spinner-border spinner-border-sm" role="status"></span>
                                : <i className="fas fa-check" style={{ fontSize: "0.7rem" }}></i>}
                            </button>
                            <button className="btn btn-sm btn-light rounded-3 px-2" onClick={() => setConfirmDeleteId(null)}>
                              <i className="fas fa-times text-muted" style={{ fontSize: "0.7rem" }}></i>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* GRID VIEW */}
      {filteredProducts.length > 0 && viewMode === "grid" && (
        <div className="row g-3">
          {filteredProducts.map((product) => {
            const stock = stockBadge(product.stock);
            return (
              <div key={product.id} className="col-12 col-sm-6 col-xl-4">
                <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                  <div className="position-relative" style={{ height: 160, background: "#f8fafc" }}>
                    <img src={product.image} alt={product.name} className="w-100 h-100"
                      style={{ objectFit: "contain", padding: "0.75rem" }} />
                    <span className={"position-absolute top-0 end-0 badge bg-" + stock.bg + " m-2 rounded-pill"}
                      style={{ fontSize: "0.68rem" }}>{stock.label}</span>
                  </div>
                  <div className="card-body p-3">
                    <h6 className="fw-bold text-dark mb-1 text-truncate">{product.name}</h6>
                    <div className="d-flex gap-2 mb-2 flex-wrap">
                      <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill" style={{ fontSize: "0.68rem" }}>{product.category}</span>
                      <span className="badge bg-secondary bg-opacity-10 text-secondary rounded-pill" style={{ fontSize: "0.68rem" }}>{product.brand}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="fw-bold text-primary fs-6">₹{product.price?.toLocaleString()}</span>
                      <span className={"badge rounded-pill " + (product.status === "Active" ? "bg-success" : "bg-secondary")}
                        style={{ fontSize: "0.68rem" }}>{product.status}</span>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-primary rounded-3 flex-grow-1 fw-medium d-flex align-items-center justify-content-center gap-1"
                        onClick={() => navigate("/admin/product/edit/" + product.id)}>
                        <i className="fas fa-pen" style={{ fontSize: "0.7rem" }}></i> Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger rounded-3 px-3 d-flex align-items-center justify-content-center"
                        onClick={() => setConfirmDeleteId(product.id === confirmDeleteId ? null : product.id)}
                        disabled={deletingId === product.id}>
                        {deletingId === product.id
                          ? <span className="spinner-border spinner-border-sm" role="status"></span>
                          : <i className="fas fa-trash-alt" style={{ fontSize: "0.7rem" }}></i>}
                      </button>
                    </div>
                    {confirmDeleteId === product.id && (
                      <div className="mt-2 p-2 rounded-3 bg-danger bg-opacity-10 border border-danger d-flex align-items-center justify-content-between gap-2">
                        <span className="text-danger small fw-medium">Delete?</span>
                        <div className="d-flex gap-1">
                          <button className="btn btn-danger btn-sm rounded-2 px-2"
                            onClick={() => handleDelete(product.id)} disabled={deletingId === product.id}>Yes</button>
                          <button className="btn btn-light btn-sm rounded-2 px-2" onClick={() => setConfirmDeleteId(null)}>No</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}