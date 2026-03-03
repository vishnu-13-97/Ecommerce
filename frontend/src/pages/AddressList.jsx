import React, { useEffect, useState } from "react";
import API from "../api-helper/Axioxinstance";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function AddressesList() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [defaultingId, setDefaultingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const navigate = useNavigate();

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await API.get("/user/address");
      setAddresses(res.data.addresses || res.data || []);
    } catch (err) {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAddresses(); }, []);

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await API.delete(`/user/address/${id}`);
      toast.success("Address deleted");
      setConfirmDeleteId(null);
      fetchAddresses();
    } catch {
      toast.error("Failed to delete address");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      setDefaultingId(id);
      await API.put(`/user/address/${id}`, { isDefault: true });
      toast.success("Set as default address");
      fetchAddresses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to set default");
    } finally {
      setDefaultingId(null);
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted fw-medium">Loading your addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Page Header ── */}
      <div
        className="py-4 py-md-5"
        style={{ background: "linear-gradient(135deg, #0d6efd 0%, #003db5 100%)" }}
      >
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
            <div>
              <h2 className="text-white fw-bold mb-1 d-flex align-items-center gap-2">
                <i className="fas fa-map-marker-alt"></i> My Addresses
              </h2>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/" className="text-white-50 text-decoration-none">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/profile" className="text-white-50 text-decoration-none">Profile</Link>
                  </li>
                  <li className="breadcrumb-item active text-white">Addresses</li>
                </ol>
              </nav>
            </div>

            <div className="d-flex gap-2 flex-wrap">
              <button
                className="btn btn-sm rounded-pill px-4 fw-semibold d-flex align-items-center gap-2"
                style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}
                onClick={() => navigate("/profile/addresses/add")}
              >
                <i className="fas fa-plus"></i> Add New
              </button>
              <button
                className="btn btn-sm rounded-pill px-4 fw-semibold d-flex align-items-center gap-2"
                style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.2)" }}
                onClick={() => navigate("/profile")}
              >
                <i className="fas fa-arrow-left"></i> Back
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4 py-lg-5">

        {/* ── Empty State ── */}
        {addresses.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body py-5 text-center">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mb-4"
                style={{ width: 80, height: 80 }}
              >
                <i className="fas fa-map-marker-alt text-primary" style={{ fontSize: "2rem" }}></i>
              </div>
              <h5 className="fw-bold text-dark mb-2">No addresses saved</h5>
              <p className="text-muted small mb-4">
                Add a delivery address to make checkout faster and easier.
              </p>
              <button
                className="btn btn-primary rounded-pill px-5 fw-semibold shadow-sm d-inline-flex align-items-center gap-2"
                onClick={() => navigate("/profile/addresses/add")}
              >
                <i className="fas fa-plus"></i> Add Your First Address
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Count badge */}
            <div className="d-flex align-items-center justify-content-between mb-3">
              <p className="text-muted small mb-0">
                <i className="fas fa-map-marker-alt text-primary me-1"></i>
                {addresses.length} saved address{addresses.length !== 1 ? "es" : ""}
              </p>
              <button
                className="btn btn-primary btn-sm rounded-pill px-3 fw-semibold d-flex align-items-center gap-1"
                onClick={() => navigate("/profile/addresses/add")}
              >
                <i className="fas fa-plus" style={{ fontSize: "0.7rem" }}></i>
                Add New
              </button>
            </div>

            <div className="row g-3">
              {addresses.map((addr) => (
                <div key={addr._id} className="col-12 col-md-6">
                  <div
                    className={`card h-100 border-0 shadow-sm rounded-4 overflow-hidden ${addr.isDefault ? "border border-primary border-2" : ""}`}
                    style={{ transition: "box-shadow 0.2s" }}
                  >
                    {/* Default ribbon */}
                    {addr.isDefault && (
                      <div
                        className="bg-primary text-white text-center py-1"
                        style={{ fontSize: "0.72rem", letterSpacing: "0.05em" }}
                      >
                        <i className="fas fa-check-circle me-1"></i>
                        DEFAULT ADDRESS
                      </div>
                    )}

                    <div className="card-body p-4">
                      {/* Header row */}
                      <div className="d-flex align-items-start gap-3 mb-3">
                        <div
                          className={`d-flex align-items-center justify-content-center rounded-3 flex-shrink-0 ${addr.isDefault ? "bg-primary" : "bg-secondary bg-opacity-10"}`}
                          style={{ width: 42, height: 42 }}
                        >
                          <i className={`fas fa-home ${addr.isDefault ? "text-white" : "text-secondary"}`}></i>
                        </div>
                        <div className="flex-grow-1">
                          <p className="fw-bold text-dark mb-0">{addr.fullName}</p>
                          <p className="text-muted mb-0 d-flex align-items-center gap-1" style={{ fontSize: "0.8rem" }}>
                            <i className="fas fa-phone-alt text-primary" style={{ fontSize: "0.65rem" }}></i>
                            {addr.mobile}
                          </p>
                        </div>
                      </div>

                      {/* Address details */}
                      <div className="d-flex flex-column gap-1 mb-3 ps-1">
                        <p className="text-muted small mb-0">{addr.addressLine}</p>
                        {addr.landmark && (
                          <p className="text-muted small mb-0">
                            <i className="fas fa-map-pin text-primary me-1" style={{ fontSize: "0.65rem" }}></i>
                            {addr.landmark}
                          </p>
                        )}
                        <p className="text-muted small mb-0">{addr.city}, {addr.state}</p>
                        <p className="text-muted small mb-0">{addr.country} — {addr.pincode}</p>
                      </div>

                      {/* Confirm delete inline panel */}
                      {confirmDeleteId === addr._id && (
                        <div className="border border-danger rounded-3 p-3 bg-danger bg-opacity-10 mb-3">
                          <p className="text-danger fw-semibold small mb-1">
                            <i className="fas fa-exclamation-triangle me-1"></i>
                            Delete this address?
                          </p>
                          <p className="text-muted small mb-3">This cannot be undone.</p>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-danger btn-sm rounded-3 fw-semibold flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                              onClick={() => handleDelete(addr._id)}
                              disabled={deletingId === addr._id}
                            >
                              {deletingId === addr._id
                                ? <span className="spinner-border spinner-border-sm" role="status"></span>
                                : <i className="fas fa-trash-alt" style={{ fontSize: "0.75rem" }}></i>
                              }
                              Yes, Delete
                            </button>
                            <button
                              className="btn btn-outline-secondary btn-sm rounded-3 fw-semibold flex-grow-1"
                              onClick={() => setConfirmDeleteId(null)}
                              disabled={deletingId === addr._id}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="d-flex flex-wrap gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-semibold d-flex align-items-center gap-1"
                          onClick={() => navigate(`/profile/addresses/edit/${addr._id}`)}
                        >
                          <i className="fas fa-pen" style={{ fontSize: "0.7rem" }}></i>
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-semibold d-flex align-items-center gap-1"
                          onClick={() => setConfirmDeleteId(confirmDeleteId === addr._id ? null : addr._id)}
                        >
                          <i className="fas fa-trash-alt" style={{ fontSize: "0.7rem" }}></i>
                          Delete
                        </button>

                        {!addr.isDefault && (
                          <button
                            className="btn btn-sm btn-primary rounded-pill px-3 fw-semibold d-flex align-items-center gap-1 ms-auto"
                            onClick={() => handleSetDefault(addr._id)}
                            disabled={defaultingId === addr._id}
                          >
                            {defaultingId === addr._id ? (
                              <span className="spinner-border spinner-border-sm" role="status"></span>
                            ) : (
                              <i className="fas fa-star" style={{ fontSize: "0.7rem" }}></i>
                            )}
                            Set Default
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}