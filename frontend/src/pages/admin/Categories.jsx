import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api-helper/Axioxinstance";
import { toast } from "react-toastify";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const navigate = useNavigate();

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await API.get("/category");
      const data = res.data.data || res.data;
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await API.delete(`/category/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      setConfirmDeleteId(null);
      toast.success("Category deleted successfully");
    } catch {
      toast.error("Failed to delete category.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "50vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }} />
          <p className="text-muted fw-medium">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-4">

      {/* ── Page Header ── */}
      <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3">
        <div>
          <h4 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <i className="fas fa-layer-group text-primary"></i> Category Management
          </h4>
          <p className="text-muted small mb-0">
            {filteredCategories.length} categor{filteredCategories.length !== 1 ? "ies" : "y"} found
          </p>
        </div>
        <button
          className="btn btn-primary rounded-3 fw-semibold px-4 d-flex align-items-center gap-2 shadow-sm"
          onClick={() => navigate("/admin/category/new")}
        >
          <i className="fas fa-plus" style={{ fontSize: "0.8rem" }}></i> Add Category
        </button>
      </div>

      {/* ── Toolbar ── */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-3 p-md-4">
          <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-3">
            <div className="input-group" style={{ maxWidth: 360 }}>
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="fas fa-search" style={{ fontSize: "0.85rem" }}></i>
              </span>
              <input
                type="text"
                className="form-control bg-light border-start-0"
                placeholder="Search category name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="input-group-text bg-light border-start-0 text-muted border"
                  onClick={() => setSearchTerm("")}>
                  <i className="fas fa-times" style={{ fontSize: "0.8rem" }}></i>
                </button>
              )}
            </div>

            <div className="d-flex align-items-center gap-2 ms-sm-auto flex-wrap">
              <span className="badge bg-success text-white rounded-pill px-3 py-2 small">
                <i className="fas fa-check-circle me-1" style={{ fontSize: "0.65rem" }}></i>
                {categories.filter((c) => c.isActive).length} Active
              </span>
              <span className="badge bg-secondary text-white rounded-pill px-3 py-2 small">
                <i className="fas fa-times-circle me-1" style={{ fontSize: "0.65rem" }}></i>
                {categories.filter((c) => !c.isActive).length} Inactive
              </span>

              <div className="btn-group rounded-3 overflow-hidden border ms-1" role="group">
                <button className={"btn btn-sm px-3 " + (viewMode === "table" ? "btn-primary" : "btn-light")}
                  onClick={() => setViewMode("table")} title="Table view">
                  <i className="fas fa-list" style={{ fontSize: "0.85rem" }}></i>
                </button>
                <button className={"btn btn-sm px-3 " + (viewMode === "grid" ? "btn-primary" : "btn-light")}
                  onClick={() => setViewMode("grid")} title="Grid view">
                  <i className="fas fa-th" style={{ fontSize: "0.85rem" }}></i>
                </button>
              </div>

              <button className="btn btn-light btn-sm rounded-3 px-3 d-flex align-items-center gap-1" onClick={fetchCategories}>
                <i className="fas fa-sync-alt" style={{ fontSize: "0.8rem" }}></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Empty State ── */}
      {filteredCategories.length === 0 && (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body py-5 text-center">
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mb-3"
              style={{ width: 72, height: 72 }}>
              <i className="fas fa-layer-group text-primary" style={{ fontSize: "1.8rem" }}></i>
            </div>
            <h6 className="fw-bold text-dark mb-1">
              {searchTerm ? "No categories match your search" : "No categories yet"}
            </h6>
            <p className="text-muted small mb-3">
              {searchTerm ? "Try a different search term." : "Add your first category to get started."}
            </p>
            {searchTerm
              ? <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setSearchTerm("")}>
                  <i className="fas fa-times me-2"></i>Clear Search
                </button>
              : <button className="btn btn-primary rounded-pill px-4" onClick={() => navigate("/admin/category/new")}>
                  <i className="fas fa-plus me-2"></i>Add Category
                </button>
            }
          </div>
        </div>
      )}

      {/* ── TABLE VIEW ── */}
      {filteredCategories.length > 0 && viewMode === "table" && (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-borderless align-middle mb-0" style={{ fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #f1f5f9" }}>
                  {["#", "CATEGORY", "DESCRIPTION", "STATUS", "ACTIONS"].map((h) => (
                    <th key={h}
                      className={"py-3 text-muted fw-medium " + (h === "#" ? "px-4 " : "") + (h === "ACTIONS" ? "pe-4 text-end" : "")}
                      style={{ fontSize: "0.72rem", letterSpacing: "0.06em" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((cat, index) => (
                  <tr key={cat._id || cat.id}
                    style={{ borderBottom: "1px solid #f8fafc", transition: "background 0.15s", opacity: deletingId === cat._id ? 0.5 : 1 }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fafbff"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}>

                    {/* # */}
                    <td className="px-4 text-muted" style={{ fontSize: "0.78rem" }}>{index + 1}</td>

                    {/* Category image + name */}
                    <td className="py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-3 overflow-hidden flex-shrink-0 border bg-light d-flex align-items-center justify-content-center"
                          style={{ width: 48, height: 48 }}>
                          {cat.image?.url || cat.image ? (
                            <img
                              src={cat.image?.url || cat.image}
                              alt={cat.name}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : (
                            <i className="fas fa-layer-group text-muted" style={{ fontSize: "1.1rem" }}></i>
                          )}
                        </div>
                        <span className="fw-semibold text-dark">{cat.name}</span>
                      </div>
                    </td>

                    {/* Description */}
                    <td>
                      <span className="text-muted small" style={{ maxWidth: 300, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {cat.description || <em className="opacity-50">No description</em>}
                      </span>
                    </td>

                    {/* Status */}
                    <td>
                      <span className={"badge rounded-pill px-2 py-1 " + (cat.isActive ? "bg-success" : "bg-secondary")}
                        style={{ fontSize: "0.72rem" }}>
                        <i className={"fas me-1 " + (cat.isActive ? "fa-check-circle" : "fa-times-circle")} style={{ fontSize: "0.6rem" }}></i>
                        {cat.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="pe-4 text-end">
                      {confirmDeleteId !== cat._id ? (
                        <div className="d-flex align-items-center justify-content-end gap-2">
                          <button className="btn btn-sm btn-outline-primary rounded-3 px-3 fw-medium d-flex align-items-center gap-1"
                            onClick={() => navigate(`/admin/category/edit/${cat._id}`)}>
                            <i className="fas fa-pen" style={{ fontSize: "0.7rem" }}></i> Edit
                          </button>
                          <button className="btn btn-sm btn-outline-danger rounded-3 px-3 fw-medium d-flex align-items-center gap-1"
                            onClick={() => setConfirmDeleteId(cat._id)}>
                            <i className="fas fa-trash-alt" style={{ fontSize: "0.7rem" }}></i> Delete
                          </button>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center justify-content-end gap-2">
                          <span className="text-danger small fw-medium">Sure?</span>
                          <button className="btn btn-sm btn-danger rounded-3 px-2 d-flex align-items-center gap-1"
                            onClick={() => handleDelete(cat._id)} disabled={deletingId === cat._id}>
                            {deletingId === cat._id
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── GRID VIEW ── */}
      {filteredCategories.length > 0 && viewMode === "grid" && (
        <div className="row g-3">
          {filteredCategories.map((cat) => (
            <div key={cat._id || cat.id} className="col-12 col-sm-6 col-xl-4">
              <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">

                {/* Category image */}
                <div className="d-flex align-items-center justify-content-center bg-light"
                  style={{ height: 140 }}>
                  {cat.image?.url || cat.image ? (
                    <img src={cat.image?.url || cat.image} alt={cat.name}
                      className="w-100 h-100" style={{ objectFit: "cover" }} />
                  ) : (
                    <div className="d-flex flex-column align-items-center gap-2 text-muted">
                      <i className="fas fa-layer-group" style={{ fontSize: "2rem", opacity: 0.3 }}></i>
                      <span style={{ fontSize: "0.72rem" }}>No image</span>
                    </div>
                  )}
                  <span
                    className={"position-absolute top-0 end-0 badge m-2 rounded-pill " + (cat.isActive ? "bg-success" : "bg-secondary")}
                    style={{ fontSize: "0.68rem" }}>
                    {cat.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="card-body p-3">
                  <h6 className="fw-bold text-dark mb-1 text-truncate">{cat.name}</h6>
                  <p className="text-muted small mb-3" style={{ overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {cat.description || <em className="opacity-50">No description</em>}
                  </p>

                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-primary rounded-3 flex-grow-1 fw-medium d-flex align-items-center justify-content-center gap-1"
                      onClick={() => navigate(`/admin/category/edit/${cat._id}`)}>
                      <i className="fas fa-pen" style={{ fontSize: "0.7rem" }}></i> Edit
                    </button>
                    <button className="btn btn-sm btn-outline-danger rounded-3 px-3 d-flex align-items-center justify-content-center"
                      onClick={() => setConfirmDeleteId(cat._id === confirmDeleteId ? null : cat._id)}
                      disabled={deletingId === cat._id}>
                      {deletingId === cat._id
                        ? <span className="spinner-border spinner-border-sm" role="status"></span>
                        : <i className="fas fa-trash-alt" style={{ fontSize: "0.7rem" }}></i>}
                    </button>
                  </div>

                  {confirmDeleteId === cat._id && (
                    <div className="mt-2 p-2 rounded-3 bg-danger bg-opacity-10 border border-danger d-flex align-items-center justify-content-between gap-2">
                      <span className="text-danger small fw-medium">Delete?</span>
                      <div className="d-flex gap-1">
                        <button className="btn btn-danger btn-sm rounded-2 px-2"
                          onClick={() => handleDelete(cat._id)} disabled={deletingId === cat._id}>Yes</button>
                        <button className="btn btn-light btn-sm rounded-2 px-2"
                          onClick={() => setConfirmDeleteId(null)}>No</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}