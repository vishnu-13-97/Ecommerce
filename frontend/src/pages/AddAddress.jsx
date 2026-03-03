import React, { useState, useEffect } from "react";
import API from "../api-helper/Axioxinstance";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import indianStates from "../api-helper/States";

export default function AddAddress() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    pincode: "",
    addressLine: "",
    landmark: "",
    country: "India",
    state: "",
    city: "",
    isDefault: false,
  });

  useEffect(() => {
    if (!isEditMode) return;
    const fetchAddress = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/user/address/${id}`);
        const data = res.data.address || res.data;
        setForm({
          fullName:    data.fullName    || "",
          mobile:      data.mobile      || "",
          pincode:     data.pincode     || "",
          addressLine: data.addressLine || "",
          landmark:    data.landmark    || "",
          country:     data.country     || "India",
          state:       data.state       || "",
          city:        data.city        || "",
          isDefault:   data.isDefault   || false,
        });
      } catch {
        toast.error("Failed to load address");
        navigate("/profile/addresses");
      } finally {
        setLoading(false);
      }
    };
    fetchAddress();
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "state" ? { city: "" } : {}),
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName || form.fullName.length < 3)
      newErrors.fullName = "Full name must be at least 3 characters.";
    if (!/^[6-9]\d{9}$/.test(form.mobile))
      newErrors.mobile = "Enter a valid 10-digit Indian mobile number.";
    if (!/^\d{6}$/.test(form.pincode))
      newErrors.pincode = "Pincode must be 6 digits.";
    if (!form.addressLine || form.addressLine.length < 5)
      newErrors.addressLine = "Address must be at least 5 characters.";
    if (!form.state) newErrors.state = "Please select a state.";
    if (!form.city)  newErrors.city  = "Please select a city.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setBtnLoading(true);
    try {
      if (isEditMode) {
        await API.put(`/user/address/${id}`, form);
        toast.success("Address updated successfully");
      } else {
        await API.post("/user/address", form);
        toast.success("Address added successfully");
      }
      navigate("/profile/addresses");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setBtnLoading(false);
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
          <p className="text-muted fw-medium">Loading address...</p>
        </div>
      </div>
    );
  }

  const fields = [
    { name: "fullName",    label: "Full Name",    icon: "fa-user",        type: "text",  col: "col-12 col-md-6", required: true,  placeholder: "John Doe" },
    { name: "mobile",      label: "Mobile",       icon: "fa-phone-alt",   type: "text",  col: "col-12 col-md-6", required: true,  placeholder: "9876543210" },
    { name: "addressLine", label: "Address Line", icon: "fa-home",        type: "text",  col: "col-12",          required: true,  placeholder: "House No., Street, Area" },
    { name: "landmark",    label: "Landmark",     icon: "fa-map-pin",     type: "text",  col: "col-12 col-md-6", required: false, placeholder: "Near landmark (optional)" },
    { name: "pincode",     label: "Pincode",      icon: "fa-map-marker-alt", type: "text", col: "col-12 col-md-6", required: true, placeholder: "6-digit pincode" },
  ];

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
                <i className={`fas ${isEditMode ? "fa-pen" : "fa-plus-circle"}`}></i>
                {isEditMode ? "Edit Address" : "Add New Address"}
              </h2>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/" className="text-white-50 text-decoration-none">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/profile" className="text-white-50 text-decoration-none">Profile</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/profile/addresses" className="text-white-50 text-decoration-none">Addresses</Link>
                  </li>
                  <li className="breadcrumb-item active text-white">
                    {isEditMode ? "Edit" : "Add"}
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4 py-lg-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <form onSubmit={handleSubmit} noValidate>
              <div className="d-flex flex-column gap-4">

                {/* ── Contact Details Card ── */}
                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-body p-4">
                    <h6 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                      <i className="fas fa-address-card text-primary"></i>
                      Contact Details
                    </h6>

                    <div className="row g-3">
                      {fields.slice(0, 2).map(({ name, label, icon, type, col, required, placeholder }) => (
                        <div key={name} className={col}>
                          <label htmlFor={name} className="form-label fw-medium text-dark small mb-1">
                            {label} {required && <span className="text-danger">*</span>}
                          </label>
                          <div className="input-group input-group-lg">
                            <span className={`input-group-text bg-light border-end-0 ${errors[name] ? "border-danger" : "text-muted"}`}>
                              <i className={`fas ${icon} ${errors[name] ? "text-danger" : ""}`} style={{ fontSize: "0.9rem" }}></i>
                            </span>
                            <input
                              id={name}
                              type={type}
                              name={name}
                              value={form[name]}
                              onChange={handleChange}
                              placeholder={placeholder}
                              className={`form-control bg-light border-start-0 ${errors[name] ? "border-danger is-invalid" : ""}`}
                              autoComplete="off"
                            />
                          </div>
                          {errors[name] && (
                            <div className="d-flex align-items-center gap-1 mt-1">
                              <i className="fas fa-exclamation-circle text-danger" style={{ fontSize: "0.72rem" }}></i>
                              <small className="text-danger">{errors[name]}</small>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── Address Details Card ── */}
                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-body p-4">
                    <h6 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                      <i className="fas fa-map-marker-alt text-primary"></i>
                      Address Details
                    </h6>

                    <div className="row g-3">

                      {/* Address Line + Landmark + Pincode */}
                      {fields.slice(2).map(({ name, label, icon, type, col, required, placeholder }) => (
                        <div key={name} className={col}>
                          <label htmlFor={name} className="form-label fw-medium text-dark small mb-1">
                            {label} {required && <span className="text-danger">*</span>}
                          </label>
                          <div className="input-group input-group-lg">
                            <span className={`input-group-text bg-light border-end-0 ${errors[name] ? "border-danger" : "text-muted"}`}>
                              <i className={`fas ${icon} ${errors[name] ? "text-danger" : ""}`} style={{ fontSize: "0.9rem" }}></i>
                            </span>
                            <input
                              id={name}
                              type={type}
                              name={name}
                              value={form[name]}
                              onChange={handleChange}
                              placeholder={placeholder}
                              className={`form-control bg-light border-start-0 ${errors[name] ? "border-danger is-invalid" : ""}`}
                              autoComplete="off"
                            />
                          </div>
                          {errors[name] && (
                            <div className="d-flex align-items-center gap-1 mt-1">
                              <i className="fas fa-exclamation-circle text-danger" style={{ fontSize: "0.72rem" }}></i>
                              <small className="text-danger">{errors[name]}</small>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Country */}
                      <div className="col-12 col-md-4">
                        <label htmlFor="country" className="form-label fw-medium text-dark small mb-1">
                          Country
                        </label>
                        <div className="input-group input-group-lg">
                          <span className="input-group-text bg-light border-end-0 text-muted">
                            <i className="fas fa-globe" style={{ fontSize: "0.9rem" }}></i>
                          </span>
                          <select
                            id="country"
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            className="form-select bg-light border-start-0"
                          >
                            <option value="India">India</option>
                          </select>
                        </div>
                      </div>

                      {/* State */}
                      <div className="col-12 col-md-4">
                        <label htmlFor="state" className="form-label fw-medium text-dark small mb-1">
                          State <span className="text-danger">*</span>
                        </label>
                        <div className="input-group input-group-lg">
                          <span className={`input-group-text bg-light border-end-0 ${errors.state ? "border-danger" : "text-muted"}`}>
                            <i className={`fas fa-map ${errors.state ? "text-danger" : ""}`} style={{ fontSize: "0.9rem" }}></i>
                          </span>
                          <select
                            id="state"
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                            className={`form-select bg-light border-start-0 ${errors.state ? "border-danger is-invalid" : ""}`}
                          >
                            <option value="">Select State</option>
                            {Object.keys(indianStates).map((st) => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </div>
                        {errors.state && (
                          <div className="d-flex align-items-center gap-1 mt-1">
                            <i className="fas fa-exclamation-circle text-danger" style={{ fontSize: "0.72rem" }}></i>
                            <small className="text-danger">{errors.state}</small>
                          </div>
                        )}
                      </div>

                      {/* City */}
                      <div className="col-12 col-md-4">
                        <label htmlFor="city" className="form-label fw-medium text-dark small mb-1">
                          City <span className="text-danger">*</span>
                        </label>
                        <div className="input-group input-group-lg">
                          <span className={`input-group-text bg-light border-end-0 ${errors.city ? "border-danger" : "text-muted"}`}>
                            <i className={`fas fa-city ${errors.city ? "text-danger" : ""}`} style={{ fontSize: "0.9rem" }}></i>
                          </span>
                          <select
                            id="city"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            disabled={!form.state}
                            className={`form-select bg-light border-start-0 ${errors.city ? "border-danger is-invalid" : ""}`}
                          >
                            <option value="">{form.state ? "Select City" : "Select state first"}</option>
                            {form.state && indianStates[form.state]?.map((ct) => (
                              <option key={ct} value={ct}>{ct}</option>
                            ))}
                          </select>
                        </div>
                        {errors.city && (
                          <div className="d-flex align-items-center gap-1 mt-1">
                            <i className="fas fa-exclamation-circle text-danger" style={{ fontSize: "0.72rem" }}></i>
                            <small className="text-danger">{errors.city}</small>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>

                {/* ── Preferences Card ── */}
                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-body p-4">
                    <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                      <i className="fas fa-star text-primary"></i>
                      Preferences
                    </h6>
                    <div
                      className={`d-flex align-items-start gap-3 p-3 rounded-3 border ${form.isDefault ? "border-primary bg-primary bg-opacity-10" : "border-light bg-light"}`}
                      style={{ cursor: "pointer", transition: "all 0.2s" }}
                      onClick={() => setForm((prev) => ({ ...prev, isDefault: !prev.isDefault }))}
                    >
                      <div className="form-check mb-0 mt-1">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="isDefault"
                          id="isDefault"
                          checked={form.isDefault}
                          onChange={handleChange}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div>
                        <label htmlFor="isDefault" className="fw-semibold text-dark small mb-0" style={{ cursor: "pointer" }}>
                          Set as default address
                        </label>
                        <p className="text-muted mb-0" style={{ fontSize: "0.78rem" }}>
                          This address will be pre-selected at checkout.
                        </p>
                      </div>
                      {form.isDefault && (
                        <span className="badge bg-primary rounded-pill ms-auto">
                          <i className="fas fa-check me-1" style={{ fontSize: "0.65rem" }}></i>Default
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Action Buttons ── */}
                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-body p-4">
                    <div className="d-flex flex-column flex-sm-row gap-3 justify-content-end">
                      <Link
                        to="/profile/addresses"
                        className="btn btn-outline-secondary rounded-3 fw-semibold px-4 d-flex align-items-center justify-content-center gap-2"
                      >
                        <i className="fas fa-times"></i> Cancel
                      </Link>
                      <button
                        type="submit"
                        className="btn btn-primary rounded-3 fw-semibold px-5 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                        disabled={btnLoading}
                        style={{ minWidth: 180 }}
                      >
                        {btnLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            {isEditMode ? "Updating..." : "Saving..."}
                          </>
                        ) : (
                          <>
                            <i className={`fas ${isEditMode ? "fa-pen" : "fa-plus"}`}></i>
                            {isEditMode ? "Update Address" : "Add Address"}
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