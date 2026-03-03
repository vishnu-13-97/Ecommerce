import React, { useEffect, useState } from "react";
import API from "../api-helper/Axioxinstance";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function EditProfile() {
  const [user, setUser] = useState({ name: "", phone: "", avatar: "" });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await API.get("/auth/profile");
        setUser({
          name: res.data.user.name || "",
          phone: res.data.user.phone || "",
          avatar: res.data.user.avatar || "",
        });
        setPreview(res.data.user.avatar || null);
      } catch (err) {
        console.error("Fetch profile failed:", err);
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB.");
      return;
    }
    setUser({ ...user, avatar: file });
    setPreview(URL.createObjectURL(file));
  };

  const removeAvatar = () => {
    setUser({ ...user, avatar: "" });
    setPreview(null);
  };

  const validate = () => {
    const errs = {};
    if (!user.name.trim()) errs.name = "Full name is required.";
    else if (user.name.trim().length < 2) errs.name = "Name must be at least 2 characters.";
    if (user.phone && !/^\+?[\d\s\-]{7,15}$/.test(user.phone))
      errs.phone = "Enter a valid phone number.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setBtnLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("phone", user.phone);
      if (user.avatar instanceof File) formData.append("image", user.avatar);

      await API.put("/auth/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setBtnLoading(false);
    }
  };

  const initials = user.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

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

  return (
    <>
      {/* ── Page Header ── */}
      <div
        className="py-4 py-md-5"
        style={{ background: "linear-gradient(135deg, #0d6efd 0%, #003db5 100%)" }}
      >
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2">
            <div>
              <h2 className="text-white fw-bold mb-1 d-flex align-items-center gap-2">
                <i className="fas fa-pen"></i> Edit Profile
              </h2>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/" className="text-white-50 text-decoration-none">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/profile" className="text-white-50 text-decoration-none">Profile</Link>
                  </li>
                  <li className="breadcrumb-item active text-white">Edit</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4 py-lg-5">
        <div className="row justify-content-center g-4">
          <div className="col-12 col-lg-8">
            <form onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
              <div className="d-flex flex-column gap-4">

                {/* ── Avatar Card ── */}
                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-body p-4 text-center">
                    <h6 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2 justify-content-center">
                      <i className="fas fa-camera text-primary"></i> Profile Photo
                    </h6>

                    {/* Avatar preview */}
                    <div className="position-relative d-inline-block mb-3">
                      {preview ? (
                        <img
                          src={preview}
                          alt="Avatar Preview"
                          className="rounded-circle border border-3 border-primary shadow"
                          style={{ width: 110, height: 110, objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          className="rounded-circle border border-3 border-primary shadow d-flex align-items-center justify-content-center bg-primary"
                          style={{ width: 110, height: 110, fontSize: "2rem", background: "rgba(13,110,253,0.15)", color: "#0d6efd" }}
                        >
                          {initials || <i className="fas fa-user"></i>}
                        </div>
                      )}

                      {/* Camera overlay */}
                      <label
                        htmlFor="avatarInput"
                        className="position-absolute bottom-0 end-0 btn btn-primary rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm"
                        style={{ width: 32, height: 32, cursor: "pointer" }}
                      >
                        <i className="fas fa-camera" style={{ fontSize: "0.75rem" }}></i>
                      </label>
                      <input
                        id="avatarInput"
                        type="file"
                        accept="image/*"
                        className="d-none"
                        onChange={handleAvatar}
                      />
                    </div>

                    <p className="text-muted small mb-3">
                      Click the camera icon to upload a new photo.<br />
                      <span className="text-muted" style={{ fontSize: "0.75rem" }}>JPG, PNG or GIF · Max 5MB</span>
                    </p>

                    {preview && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger rounded-pill px-3 d-inline-flex align-items-center gap-1"
                        onClick={removeAvatar}
                      >
                        <i className="fas fa-trash-alt" style={{ fontSize: "0.7rem" }}></i>
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>

                {/* ── Personal Info Card ── */}
                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-body p-4">
                    <h6 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                      <i className="fas fa-user text-primary"></i> Personal Information
                    </h6>

                    <div className="row g-3">

                      {/* Full Name */}
                      <div className="col-12 col-md-6">
                        <label htmlFor="name" className="form-label fw-medium text-dark small mb-1">
                          Full Name <span className="text-danger">*</span>
                        </label>
                        <div className="input-group input-group-lg">
                          <span className={`input-group-text bg-light border-end-0 ${errors.name ? "border-danger" : "text-muted"}`}>
                            <i className={`fas fa-user ${errors.name ? "text-danger" : ""}`} style={{ fontSize: "0.9rem" }}></i>
                          </span>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            className={`form-control bg-light border-start-0 ${errors.name ? "border-danger is-invalid" : ""}`}
                            placeholder="John Doe"
                            value={user.name}
                            onChange={handleChange}
                            autoComplete="name"
                          />
                        </div>
                        {errors.name && (
                          <div className="d-flex align-items-center gap-1 mt-1">
                            <i className="fas fa-exclamation-circle text-danger" style={{ fontSize: "0.72rem" }}></i>
                            <small className="text-danger">{errors.name}</small>
                          </div>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="col-12 col-md-6">
                        <label htmlFor="phone" className="form-label fw-medium text-dark small mb-1">
                          Phone Number
                          <span className="text-muted ms-1" style={{ fontSize: "0.72rem" }}>(optional)</span>
                        </label>
                        <div className="input-group input-group-lg">
                          <span className={`input-group-text bg-light border-end-0 ${errors.phone ? "border-danger" : "text-muted"}`}>
                            <i className={`fas fa-phone-alt ${errors.phone ? "text-danger" : ""}`} style={{ fontSize: "0.9rem" }}></i>
                          </span>
                          <input
                            type="text"
                            id="phone"
                            name="phone"
                            className={`form-control bg-light border-start-0 ${errors.phone ? "border-danger is-invalid" : ""}`}
                            placeholder="+91 98765 43210"
                            value={user.phone}
                            onChange={handleChange}
                            autoComplete="tel"
                          />
                        </div>
                        {errors.phone && (
                          <div className="d-flex align-items-center gap-1 mt-1">
                            <i className="fas fa-exclamation-circle text-danger" style={{ fontSize: "0.72rem" }}></i>
                            <small className="text-danger">{errors.phone}</small>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>

                {/* ── Action Buttons ── */}
                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-body p-4">
                    <div className="d-flex flex-column flex-sm-row gap-3 justify-content-end">
                      <Link
                        to="/profile"
                        className="btn btn-outline-secondary rounded-3 fw-semibold px-4 d-flex align-items-center justify-content-center gap-2"
                      >
                        <i className="fas fa-times"></i> Cancel
                      </Link>
                      <button
                        type="submit"
                        className="btn btn-primary rounded-3 fw-semibold px-5 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                        disabled={btnLoading}
                        style={{ minWidth: 160 }}
                      >
                        {btnLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-check"></i>
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}