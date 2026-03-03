import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import API from "../../api-helper/Axioxinstance";
import { toast } from "react-toastify";

export default function BrandForm() {
  const [brand, setBrand] = useState({ name: "", description: "" });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const navigate = useNavigate();
  const { brandId } = useParams();
  const isEdit = Boolean(brandId);

  /* ── Fetch brand in edit mode ── */
  useEffect(() => {
    if (!brandId) return;
    const fetchBrand = async () => {
      try {
        setFetching(true);
        const res = await API.get(`/brand/${brandId}`);
        const data = res.data.data || res.data;
        setBrand({
          name: data.name || "",
          description: data.description || "",
        });
        setPreview(data.logo?.url || data.image || null);
      } catch {
        toast.error("Failed to load brand details.");
      } finally {
        setFetching(false);
      }
    };
    fetchBrand();
  }, [brandId]);

  /* ── Handlers ── */
  const handleChange = (e) => {
    setBrand((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB"); return;
    }
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
  };

  const removeImage = () => {
    setImageFile(null);
    setPreview(null);
  };

  /* ── Validation ── */
  const validate = () => {
    const e = {};
    if (!brand.name.trim() || brand.name.length < 2)
      e.name = "Brand name must be at least 2 characters.";
    if (brand.description && brand.description.length > 300)
      e.description = "Description must be under 300 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", brand.name);
      fd.append("description", brand.description);
      if (imageFile instanceof File) fd.append("image", imageFile);

      const headers = { "Content-Type": "multipart/form-data" };
      if (isEdit) {
        await API.put(`/brand/${brandId}`, fd, { headers });
        toast.success("Brand updated successfully!");
      } else {
        await API.post("/brand", fd, { headers });
        toast.success("Brand added successfully!");
      }
      navigate("/admin/brand");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Fetching state ── */
  if (fetching) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "50vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"
            style={{ width: "3rem", height: "3rem" }} />
          <p className="text-muted fw-medium">Loading brand...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Page Header ── */}
      <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-2 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <i className={"fas " + (isEdit ? "fa-pen" : "fa-plus-circle") + " text-primary"}></i>
            {isEdit ? "Edit Brand" : "Add New Brand"}
          </h4>
          <p className="text-muted small mb-0">
            {isEdit ? "Update brand details below" : "Fill in the details to create a new brand"}
          </p>
        </div>
        <Link to="/admin/brand"
          className="btn btn-light btn-sm rounded-3 px-3 fw-medium d-flex align-items-center gap-2">
          <i className="fas fa-arrow-left" style={{ fontSize: "0.8rem" }}></i> Back to Brands
        </Link>
      </div>

      <form onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
        <div className="row g-4">

          {/* ── LEFT COLUMN ── */}
          <div className="col-12 col-lg-8 d-flex flex-column gap-4">

            {/* Brand Info */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h6 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                  <i className="fas fa-info-circle text-primary"></i> Brand Information
                </h6>
                <div className="d-flex flex-column gap-3">

                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="form-label fw-medium text-dark small mb-1">
                      Brand Name <span className="text-danger">*</span>
                    </label>
                    <div className="input-group input-group-lg">
                      <span className={"input-group-text bg-light border-end-0 " + (errors.name ? "border-danger" : "text-muted")}>
                        <i className={"fas fa-tag " + (errors.name ? "text-danger" : "")} style={{ fontSize: "0.9rem" }}></i>
                      </span>
                      <input id="name" type="text" name="name" value={brand.name}
                        onChange={handleChange} placeholder="e.g. Nike, Apple, Samsung"
                        className={"form-control bg-light border-start-0 " + (errors.name ? "border-danger is-invalid" : "")} />
                    </div>
                    {errors.name && (
                      <div className="d-flex align-items-center gap-1 mt-1">
                        <i className="fas fa-exclamation-circle text-danger" style={{ fontSize: "0.72rem" }}></i>
                        <small className="text-danger">{errors.name}</small>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="form-label fw-medium text-dark small mb-1">
                      Description
                      <span className="text-muted ms-1" style={{ fontSize: "0.72rem" }}>(optional)</span>
                    </label>
                    <div className="input-group input-group-lg">
                      <span className={"input-group-text bg-light border-end-0 align-items-start pt-3 " + (errors.description ? "border-danger" : "text-muted")}>
                        <i className={"fas fa-align-left " + (errors.description ? "text-danger" : "")} style={{ fontSize: "0.9rem" }}></i>
                      </span>
                      <textarea id="description" name="description" value={brand.description}
                        onChange={handleChange} rows={4}
                        placeholder="Short description about the brand..."
                        className={"form-control bg-light border-start-0 " + (errors.description ? "border-danger is-invalid" : "")} />
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-1">
                      {errors.description ? (
                        <div className="d-flex align-items-center gap-1">
                          <i className="fas fa-exclamation-circle text-danger" style={{ fontSize: "0.72rem" }}></i>
                          <small className="text-danger">{errors.description}</small>
                        </div>
                      ) : <span />}
                      <small className={"ms-auto " + (brand.description.length > 280 ? "text-danger" : "text-muted")}>
                        {brand.description.length}/300
                      </small>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Logo Upload */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h6 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                  <i className="fas fa-image text-primary"></i> Brand Logo
                </h6>
                <p className="text-muted small mb-3">PNG, JPG · Max 5MB · Recommended 200×200px</p>

                {!preview ? (
                  /* Upload zone */
                  <label htmlFor="logoInput"
                    className="d-flex flex-column align-items-center justify-content-center rounded-4 border border-2 p-4 text-center"
                    style={{ borderStyle: "dashed", borderColor: "#c7d3e8", background: "#f8fafc", cursor: "pointer", transition: "border-color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "#0d6efd"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "#c7d3e8"}>
                    <div className="d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mb-2"
                      style={{ width: 52, height: 52 }}>
                      <i className="fas fa-cloud-upload-alt text-primary" style={{ fontSize: "1.3rem" }}></i>
                    </div>
                    <p className="fw-semibold text-dark small mb-1">Click to upload logo</p>
                    <p className="text-muted mb-0" style={{ fontSize: "0.75rem" }}>or drag and drop here</p>
                    <input id="logoInput" type="file" accept="image/*"
                      className="d-none" onChange={handleImageChange} />
                  </label>
                ) : (
                  /* Preview */
                  <div className="d-flex align-items-center gap-4 p-3 rounded-4 border bg-light">
                    <div className="rounded-3 overflow-hidden border bg-white flex-shrink-0 d-flex align-items-center justify-content-center"
                      style={{ width: 90, height: 90 }}>
                      <img src={preview} alt="Logo preview"
                        style={{ width: "100%", height: "100%", objectFit: "contain", padding: "6px" }} />
                    </div>
                    <div className="flex-grow-1">
                      <p className="fw-semibold text-dark mb-1 small">
                        {imageFile ? imageFile.name : "Current logo"}
                      </p>
                      <p className="text-muted mb-2" style={{ fontSize: "0.75rem" }}>
                        {imageFile ? (imageFile.size / 1024).toFixed(1) + " KB" : "Existing image"}
                      </p>
                      <div className="d-flex gap-2">
                        <label htmlFor="logoInput"
                          className="btn btn-outline-primary btn-sm rounded-3 fw-medium d-flex align-items-center gap-1"
                          style={{ cursor: "pointer" }}>
                          <i className="fas fa-redo" style={{ fontSize: "0.7rem" }}></i> Change
                          <input id="logoInput" type="file" accept="image/*"
                            className="d-none" onChange={handleImageChange} />
                        </label>
                        <button type="button"
                          className="btn btn-outline-danger btn-sm rounded-3 fw-medium d-flex align-items-center gap-1"
                          onClick={removeImage}>
                          <i className="fas fa-trash-alt" style={{ fontSize: "0.7rem" }}></i> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="col-12 col-lg-4 d-flex flex-column gap-4">

            {/* Live Preview Card */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-header border-0 py-3 px-4"
                style={{ background: "linear-gradient(135deg,#0d6efd,#003db5)" }}>
                <h6 className="fw-bold text-white mb-0 d-flex align-items-center gap-2">
                  <i className="fas fa-eye"></i> Live Preview
                </h6>
              </div>
              <div className="card-body p-4 text-center">
                {/* Logo preview */}
                <div className="d-flex align-items-center justify-content-center rounded-3 border bg-light mx-auto mb-3"
                  style={{ width: 80, height: 80 }}>
                  {preview ? (
                    <img src={preview} alt="Brand logo"
                      style={{ width: "100%", height: "100%", objectFit: "contain", padding: "8px" }} />
                  ) : (
                    <i className="fas fa-tag text-muted" style={{ fontSize: "1.8rem", opacity: 0.3 }}></i>
                  )}
                </div>
                <h6 className="fw-bold text-dark mb-1">
                  {brand.name || <span className="text-muted fst-italic" style={{ opacity: 0.5 }}>Brand name</span>}
                </h6>
                <p className="text-muted small mb-0" style={{
                  display: "-webkit-box", WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical", overflow: "hidden"
                }}>
                  {brand.description || <span className="fst-italic" style={{ opacity: 0.5 }}>No description</span>}
                </p>
              </div>
            </div>

            {/* Summary */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                  <i className="fas fa-clipboard-check text-primary"></i> Summary
                </h6>
                <div className="d-flex flex-column gap-2">
                  {[
                    { label: "Name",        value: brand.name        || "—" },
                    { label: "Description", value: brand.description ? brand.description.slice(0, 40) + (brand.description.length > 40 ? "…" : "") : "—" },
                    { label: "Logo",        value: preview ? "✓ Uploaded" : "No logo" },
                    { label: "Mode",        value: isEdit ? "Editing" : "Creating new" },
                  ].map(({ label, value }) => (
                    <div key={label} className="d-flex justify-content-between align-items-center py-1"
                      style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <span className="text-muted small fw-medium">{label}</span>
                      <span className={"fw-semibold small text-truncate ms-3 " + (label === "Logo" && preview ? "text-success" : "text-dark")}
                        style={{ maxWidth: 130 }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4 d-flex flex-column gap-3">
                <button type="submit" disabled={loading}
                  className="btn btn-primary rounded-3 fw-semibold py-2 d-flex align-items-center justify-content-center gap-2 shadow-sm w-100">
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      {isEdit ? "Updating..." : "Saving..."}
                    </>
                  ) : (
                    <>
                      <i className={"fas " + (isEdit ? "fa-save" : "fa-plus")}></i>
                      {isEdit ? "Update Brand" : "Add Brand"}
                    </>
                  )}
                </button>
                <Link to="/admin/brand"
                  className="btn btn-outline-secondary rounded-3 fw-semibold py-2 d-flex align-items-center justify-content-center gap-2 w-100">
                  <i className="fas fa-times"></i> Cancel
                </Link>
              </div>
            </div>

          </div>
        </div>
      </form>
    </>
  );
}