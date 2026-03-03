import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api-helper/Axioxinstance";
import { toast } from "react-toastify";

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchBrands(); }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await API.get("/brand");
      setBrands(res.data.data || []);
    } catch {
      toast.error("Failed to fetch brands");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await API.delete(`/brand/${id}`);
      setBrands((prev) => prev.filter((b) => b._id !== id));
      setConfirmDeleteId(null);
      toast.success("Brand deleted successfully");
    } catch {
      toast.error("Failed to delete brand");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "50vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }} />
          <p className="text-muted fw-medium">Loading brands...</p>
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
            <i className="fas fa-tag text-primary"></i> Brand Management
          </h4>
          <p className="text-muted small mb-0">
            {filteredBrands.length} brand{filteredBrands.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <button
          className="btn btn-primary rounded-3 fw-semibold px-4 d-flex align-items-center gap-2 shadow-sm"
          onClick={() => navigate("/admin/brand/new")}
        >
          <i className="fas fa-plus" style={{ fontSize: "0.8rem" }}></i> Add Brand
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
                placeholder="Search brand name..."
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
            <div className="d-flex align-items-center gap-2 ms-sm-auto">
              <span className="badge bg-success text-white rounded-pill px-3 py-2 small">
                <i className="fas fa-check-circle me-1" style={{ fontSize: "0.65rem" }}></i>
                {brands.filter((b) => b.isActive).length} Active
              </span>
              <span className="badge bg-secondary text-white rounded-pill px-3 py-2 small">
                <i className="fas fa-times-circle me-1" style={{ fontSize: "0.65rem" }}></i>
                {brands.filter((b) => !b.isActive).length} Inactive
              </span>
              <button className="btn btn-light btn-sm rounded-3 px-3 d-flex align-items-center gap-1" onClick={fetchBrands}>
                <i className="fas fa-sync-alt" style={{ fontSize: "0.8rem" }}></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Empty State ── */}
      {filteredBrands.length === 0 && (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body py-5 text-center">
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mb-3"
              style={{ width: 72, height: 72 }}>
              <i className="fas fa-tag text-primary" style={{ fontSize: "1.8rem" }}></i>
            </div>
            <h6 className="fw-bold text-dark mb-1">
              {searchTerm ? "No brands match your search" : "No brands yet"}
            </h6>
            <p className="text-muted small mb-3">
              {searchTerm ? "Try a different search term." : "Add your first brand to get started."}
            </p>
            {searchTerm
              ? <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setSearchTerm("")}>
                  <i className="fas fa-times me-2"></i>Clear Search
                </button>
              : <button className="btn btn-primary rounded-pill px-4" onClick={() => navigate("/admin/brand/new")}>
                  <i className="fas fa-plus me-2"></i>Add Brand
                </button>
            }
          </div>
        </div>
      )}

      {/* ── Table ── */}
      {filteredBrands.length > 0 && (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-borderless align-middle mb-0" style={{ fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #f1f5f9" }}>
                  {["#", "BRAND", "DESCRIPTION", "STATUS", "ACTIONS"].map((h) => (
                    <th key={h}
                      className={"py-3 text-muted fw-medium " + (h === "#" ? "px-4 " : "") + (h === "ACTIONS" ? "pe-4 text-end" : "")}
                      style={{ fontSize: "0.72rem", letterSpacing: "0.06em" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredBrands.map((brand, index) => (
                  <tr key={brand._id}
                    style={{ borderBottom: "1px solid #f8fafc", transition: "background 0.15s", opacity: deletingId === brand._id ? 0.5 : 1 }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fafbff"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}>

                    {/* # */}
                    <td className="px-4 text-muted" style={{ fontSize: "0.78rem" }}>{index + 1}</td>

                    {/* Brand logo + name */}
                    <td className="py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-3 overflow-hidden flex-shrink-0 border bg-light d-flex align-items-center justify-content-center"
                          style={{ width: 48, height: 48 }}>
                          {brand.logo?.url ? (
                            <img src={brand.logo.url} alt={brand.name}
                              style={{ width: "100%", height: "100%", objectFit: "contain", padding: "4px" }} />
                          ) : (
                            <i className="fas fa-tag text-muted" style={{ fontSize: "1.1rem" }}></i>
                          )}
                        </div>
                        <span className="fw-semibold text-dark">{brand.name}</span>
                      </div>
                    </td>

                    {/* Description */}
                    <td>
                      <span className="text-muted small" style={{ maxWidth: 280, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {brand.description || <span className="fst-italic text-muted" style={{ opacity: 0.5 }}>No description</span>}
                      </span>
                    </td>

                    {/* Status */}
                    <td>
                      <span className={"badge rounded-pill px-2 py-1 " + (brand.isActive ? "bg-success" : "bg-secondary")}
                        style={{ fontSize: "0.72rem" }}>
                        <i className={"fas me-1 " + (brand.isActive ? "fa-check-circle" : "fa-times-circle")} style={{ fontSize: "0.6rem" }}></i>
                        {brand.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="pe-4 text-end">
                      {confirmDeleteId !== brand._id ? (
                        <div className="d-flex align-items-center justify-content-end gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary rounded-3 px-3 fw-medium d-flex align-items-center gap-1"
                            onClick={() => navigate(`/admin/brand/edit/${brand._id}`)}>
                            <i className="fas fa-pen" style={{ fontSize: "0.7rem" }}></i> Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger rounded-3 px-3 fw-medium d-flex align-items-center gap-1"
                            onClick={() => setConfirmDeleteId(brand._id)}>
                            <i className="fas fa-trash-alt" style={{ fontSize: "0.7rem" }}></i> Delete
                          </button>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center justify-content-end gap-2">
                          <span className="text-danger small fw-medium">Sure?</span>
                          <button
                            className="btn btn-sm btn-danger rounded-3 px-2 d-flex align-items-center gap-1"
                            onClick={() => handleDelete(brand._id)}
                            disabled={deletingId === brand._id}>
                            {deletingId === brand._id
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

    </div>
  );
}