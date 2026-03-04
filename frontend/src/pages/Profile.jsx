import React, { useEffect, useState } from "react";
import API from "../api-helper/Axioxinstance";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/profile");
        setUser({
          id: res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email,
          phone: res.data.user.phone || "Not provided",
          avatar: res.data.user.avatar || "/img/team-1.jpg",
          addresses: res.data.user.addresses || [],
          joinedOn: new Date(res.data.user.createdAt).toLocaleDateString("en-IN", {
            day: "numeric", month: "long", year: "numeric",
          }),
        });
      } catch (error) {
        console.error("Profile Fetch Error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ── Loading ──
  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted fw-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (!user) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div className="text-center px-4">
          <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-10 mb-3" style={{ width: 72, height: 72 }}>
            <i className="fas fa-exclamation-circle text-danger fs-3"></i>
          </div>
          <h5 className="fw-bold text-dark mb-2">Failed to load profile</h5>
          <p className="text-muted small mb-4">Something went wrong. Please try again.</p>
          <button className="btn btn-primary rounded-pill px-4" onClick={() => window.location.reload()}>
            <i className="fas fa-redo me-2"></i>Retry
          </button>
        </div>
      </div>
    );
  }

  const initials = user.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <>
      {/* ── Page Header ── */}
      <div
        className="py-4 py-md-5"
        style={{ background: "linear-gradient(135deg, #0d6efd 0%, #003db5 100%)" }}
      >
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-4">
              {/* Avatar */}
              <div className="position-relative flex-shrink-0">
                {user.avatar && user.avatar !== "/img/team-1.jpg" ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="rounded-circle border border-3 border-white shadow"
                    style={{ width: 80, height: 80, objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="rounded-circle border border-3 border-white shadow d-flex align-items-center justify-content-center bg-primary"
                    style={{ width: 80, height: 80, fontSize: "1.6rem", color: "rgba(255,255,255,0.9)", background: "rgba(255,255,255,0.2)" }}
                  >
                    {initials}
                  </div>
                )}
                <span
                  className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-2 border-white"
                  style={{ width: 16, height: 16 }}
                ></span>
              </div>

              {/* Name + meta */}
              <div>
                <h4 className="text-white fw-bold mb-1">{user.name}</h4>
                <p className="text-white-50 small mb-1">
                  <i className="fas fa-envelope me-2"></i>{user.email}
                </p>
                <p className="text-white-50 small mb-0">
                  <i className="fas fa-calendar-alt me-2"></i>Member since {user.joinedOn}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="d-flex gap-2 flex-wrap justify-content-center justify-content-md-end">
              <button
                className="btn btn-white btn-sm rounded-pill px-4 fw-semibold d-flex align-items-center gap-2"
                style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}
                onClick={() => navigate("/profile/edit-profile")}
              >
                <i className="fas fa-pen"></i> Edit Profile
              </button>
              <button
                className="btn btn-sm rounded-pill px-4 fw-semibold d-flex align-items-center gap-2"
                style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.2)" }}
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4 py-lg-5">
        <div className="row g-4 justify-content-center">

          {/* ── Left: Info Cards ── */}
          <div className="col-12 col-lg-4 d-flex flex-column gap-4">

            {/* Personal Info */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                  <i className="fas fa-user text-primary"></i> Personal Info
                </h6>
                <div className="d-flex flex-column gap-3">
                  {[
                    { icon: "fa-user-circle", label: "Full Name", value: user.name },
                    { icon: "fa-envelope", label: "Email", value: user.email },
                    { icon: "fa-phone-alt", label: "Phone", value: user.phone },
                  ].map(({ icon, label, value }) => (
                    <div key={label} className="d-flex align-items-center gap-3">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-3 bg-primary bg-opacity-10 flex-shrink-0"
                        style={{ width: 38, height: 38 }}
                      >
                        <i className={`fas ${icon} text-white`} style={{ fontSize: "0.85rem" }}></i>
                      </div>
                      <div className="min-width-0">
                        <p className="text-muted mb-0" style={{ fontSize: "0.72rem" }}>{label}</p>
                        <p className="fw-medium text-dark mb-0 small text-truncate">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                  <i className="fas fa-link text-primary"></i> Quick Links
                </h6>
                <div className="d-flex flex-column gap-2">
                  {[
                    { icon: "fa-box-open", label: "My Orders", to: "/my-orders", color: "text-primary" },
                    { icon: "fa-map-marker-alt", label: "Manage Addresses", to: "/profile/addresses", color: "text-success" },
                    { icon: "fa-pen", label: "Edit Profile", to: "/profile/edit-profile", color: "text-warning" },
                  ].map(({ icon, label, to, color }) => (
                    <Link
                      key={label}
                      to={to}
                      className="d-flex align-items-center gap-3 p-2 rounded-3 text-decoration-none"
                      style={{ transition: "background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f0f5ff"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <i className={`fas ${icon} ${color}`} style={{ width: 18, textAlign: "center" }}></i>
                      <span className="text-dark small fw-medium">{label}</span>
                      <i className="fas fa-chevron-right text-muted ms-auto" style={{ fontSize: "0.65rem" }}></i>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* ── Right: Addresses ── */}
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-white border-0 px-4 pt-4 pb-2 d-flex align-items-center justify-content-between">
                <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                  <i className="fas fa-map-marker-alt text-primary"></i>
                  Saved Addresses
                  <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill ms-1" style={{ fontSize: "0.7rem" }}>
                    {user.addresses.length}
                  </span>
                </h6>
                <Link
                  to="/profile/addresses"
                  className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-semibold d-flex align-items-center gap-1"
                >
                  <i className="fas fa-plus" style={{ fontSize: "0.7rem" }}></i>
                  Manage
                </Link>
              </div>

              <div className="card-body px-4 pb-4 pt-2">
                {user.addresses.length === 0 ? (
                  <div className="text-center py-5">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mb-3"
                      style={{ width: 64, height: 64 }}
                    >
                      <i className="fas fa-map-marker-alt text-primary fs-4"></i>
                    </div>
                    <h6 className="fw-bold text-dark mb-1">No addresses saved</h6>
                    <p className="text-muted small mb-3">Add a delivery address to speed up checkout.</p>
                    <Link to="/profile/addresses" className="btn btn-primary rounded-pill px-4 fw-semibold">
                      <i className="fas fa-plus me-2"></i>Add Address
                    </Link>
                  </div>
                ) : (
                  <div className="row g-3 mt-1">
                    {user.addresses.map((address, i) => (
                      <div key={i} className="col-12 col-md-6">
                        <div className={`h-100 rounded-3 p-3 border ${address.isDefault ? "border-primary bg-primary bg-opacity-10" : "border-light bg-light"}`}>

                          {/* Address header */}
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <div className="d-flex align-items-center gap-2">
                              <div
                                className={`d-flex align-items-center justify-content-center rounded-2 ${address.isDefault ? "bg-primary" : "bg-secondary bg-opacity-25"}`}
                                style={{ width: 28, height: 28 }}
                              >
                                <i className="fas fa-home text-white" style={{ fontSize: "0.7rem" }}></i>
                              </div>
                              <span className="small fw-semibold text-dark">
                                Address {i + 1}
                              </span>
                            </div>
                            {address.isDefault && (
                              <span className="badge bg-primary rounded-pill" style={{ fontSize: "0.65rem" }}>
                                <i className="fas fa-check me-1" style={{ fontSize: "0.6rem" }}></i>Default
                              </span>
                            )}
                          </div>

                          {/* Address body */}
                          <p className="fw-semibold text-dark small mb-1">{address.fullName}</p>
                          <p className="text-muted small mb-1">{address.addressLine}</p>
                          {address.landmark && (
                            <p className="text-muted small mb-1">
                              <i className="fas fa-map-pin me-1 text-primary" style={{ fontSize: "0.65rem" }}></i>
                              {address.landmark}
                            </p>
                          )}
                          <p className="text-muted small mb-1">{address.city}, {address.state}</p>
                          <p className="text-muted small mb-2">{address.country} — {address.pincode}</p>
                          <div className="d-flex align-items-center gap-1 text-muted small">
                            <i className="fas fa-phone-alt text-primary" style={{ fontSize: "0.65rem" }}></i>
                            {address.mobile}
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
      </div>
    </>
  );
};

export default Profile;