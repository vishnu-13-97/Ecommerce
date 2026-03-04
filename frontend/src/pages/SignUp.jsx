import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import API from "../api-helper/Axioxinstance";
const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { user, register,loginWithGoogle } = useAuth();

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

useEffect(() => {
  const handleGoogleResponse = async (response) => {
    try {
      setLoading(true);
      setMessage({ text: "", type: "" });

      const res = await API.post("/auth/google", {
        token: response.credential,
      });

      await loginWithGoogle(res.data);
      setMessage({ text: "Google signup successful! Redirecting...", type: "success" });
      setTimeout(() => navigate("/"), 1500);

    } catch (err) {
      const errMsg = err?.response?.data?.message || "Google signup failed.";
      setMessage({ text: errMsg, type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  const initializeGoogleSignUp = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // ← env var
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleSignupDiv"),
        { theme: "outline", size: "large" } // ← removed invalid width: "100%"
      );
    }
  };

  if (!window.google) {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleSignUp;
    document.body.appendChild(script);
  } else {
    initializeGoogleSignUp();
  }

  return () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.cancel();
    }
  };
}, [navigate, loginWithGoogle]);

  const getPasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["", "danger", "warning", "info", "success"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "password") setPasswordStrength(getPasswordStrength(value));
  };

  // ── Manual validation ──
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run validation first
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Stop — don't call backend
    }

    setLoading(true);
    setMessage({ text: "", type: "" });
    setErrors({});

    try {
      const res = await register(formData);
      setMessage({ text: res.message || "OTP sent to your email!", type: "success" });
      localStorage.setItem("registerEmail", formData.email);
      setTimeout(() => navigate("/verify-otp"), 1500);
    } catch (error) {
      // Show the real backend error message
      setMessage({
        text: error.message || "Registration failed. Please try again.",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    { icon: "fa-tag", text: "Exclusive deals & member discounts" },
    { icon: "fa-box-open", text: "Track orders in real time" },
    { icon: "fa-heart", text: "Save items to your wishlist" },
    { icon: "fa-headset", text: "Priority customer support" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* ── Left Hero Panel ── */}
      <div
        className="d-none d-md-flex flex-column justify-content-between p-5"
        style={{
          width: "45%",
          flexShrink: 0,
          background: "linear-gradient(155deg, #0d6efd 0%, #003db5 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: "-80px", left: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-100px", right: "-60px", width: "350px", height: "350px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <Link to="/" className="text-decoration-none d-inline-flex align-items-center gap-2 mb-5" style={{ color: "#fff" }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className="fas fa-store text-white"></i>
            </div>
            <span className="fs-4 fw-bold">Ecomm</span>
          </Link>

          <h2 className="fw-bold lh-sm mb-3" style={{ color: "#fff", fontSize: "2.1rem" }}>
            Join thousands of<br />
            <span style={{ color: "#ffc107" }}>happy shoppers.</span>
          </h2>
          <p className="mb-5" style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.95rem", maxWidth: 300 }}>
            Create your free account and unlock a world of deals, fast shipping, and easy returns.
          </p>

          <div className="d-flex flex-column gap-3">
            {perks.map(({ icon, text }) => (
              <div key={text} className="d-flex align-items-center gap-3">
                <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className={`fas ${icon} text-white`}></i>
                </div>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.87rem" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "1.5rem" }}>
          <div className="d-flex gap-4">
            {[
              { value: "50K+", label: "Happy Customers" },
              { value: "10K+", label: "Products" },
              { value: "4.9★", label: "Avg Rating" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="fw-bold mb-0" style={{ color: "#ffc107", fontSize: "1.15rem" }}>{value}</p>
                <p className="mb-0" style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.75rem" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div
        className="d-flex align-items-center justify-content-center bg-white p-4 p-sm-5"
        style={{ flex: 1, minHeight: "100vh" }}
      >
        <div className="w-100" style={{ maxWidth: 420 }}>

          {/* Mobile brand */}
          <Link to="/" className="d-flex d-md-none align-items-center gap-2 text-primary text-decoration-none mb-4">
            <i className="fas fa-store fs-5"></i>
            <span className="fs-5 fw-bold">Ecomm</span>
          </Link>

          <div className="mb-4">
            <h3 className="fw-bold text-dark mb-1">Create your account ✨</h3>
            <p className="text-muted mb-0 small">It's free and only takes a minute</p>
          </div>

          {/* Alert */}
          {message.text && (
            <div
              className={`alert alert-${message.type} alert-dismissible d-flex align-items-center gap-2 rounded-3 py-2 small`}
              role="alert"
            >
              <i className={`fas ${message.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"} flex-shrink-0`}></i>
              <span>{message.text}</span>
              <button type="button" className="btn-close btn-sm ms-auto" onClick={() => setMessage({ text: "", type: "" })}></button>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* Full Name */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label fw-medium text-dark small mb-1">
                Full Name
              </label>
              <div className={`input-group input-group-lg ${errors.name ? "is-invalid-group" : ""}`}>
                <span className={`input-group-text bg-light border-end-0 ${errors.name ? "border-danger" : "text-muted"}`}>
                  <i className={`fas fa-user ${errors.name ? "text-danger" : ""}`} style={{ fontSize: "0.9rem" }}></i>
                </span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`form-control bg-light border-start-0 ${errors.name ? "border-danger is-invalid" : ""}`}
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>
              {errors.name && (
                <div className="d-flex align-items-center gap-1 mt-1">
                  <i className="fas fa-circle-exclamation text-danger" style={{ fontSize: "0.72rem" }}></i>
                  <small className="text-danger">{errors.name}</small>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-medium text-dark small mb-1">
                Email Address
              </label>
              <div className="input-group input-group-lg">
                <span className={`input-group-text bg-light border-end-0 ${errors.email ? "border-danger" : "text-muted"}`}>
                  <i className={`fas fa-envelope ${errors.email ? "text-danger" : ""}`} style={{ fontSize: "0.9rem" }}></i>
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control bg-light border-start-0 ${errors.email ? "border-danger is-invalid" : ""}`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <div className="d-flex align-items-center gap-1 mt-1">
                  <i className="fas fa-circle-exclamation text-danger" style={{ fontSize: "0.72rem" }}></i>
                  <small className="text-danger">{errors.email}</small>
                </div>
              )}
            </div>

            {/* Password */}
            <div className="mb-2">
              <label htmlFor="password" className="form-label fw-medium text-dark small mb-1">
                Password
              </label>
              <div className="input-group input-group-lg">
                <span className={`input-group-text bg-light border-end-0 ${errors.password ? "border-danger" : "text-muted"}`}>
                  <i className={`fas fa-lock ${errors.password ? "text-danger" : ""}`} style={{ fontSize: "0.9rem" }}></i>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className={`form-control bg-light border-start-0 border-end-0 ${errors.password ? "border-danger is-invalid" : ""}`}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={`input-group-text bg-light border-start-0 ${errors.password ? "border-danger" : "text-muted"}`}
                  onClick={() => setShowPassword((p) => !p)}
                  tabIndex={-1}
                >
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} style={{ fontSize: "0.9rem" }}></i>
                </button>
              </div>
              {errors.password && (
                <div className="d-flex align-items-center gap-1 mt-1">
                  <i className="fas fa-circle-exclamation text-danger" style={{ fontSize: "0.72rem" }}></i>
                  <small className="text-danger">{errors.password}</small>
                </div>
              )}
            </div>

            {/* Password strength */}
            {formData.password.length > 0 && (
              <div className="mb-3 mt-2">
                <div className="d-flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`flex-grow-1 rounded-pill bg-${level <= passwordStrength ? strengthColors[passwordStrength] : "secondary"} bg-opacity-${level <= passwordStrength ? "100" : "25"}`}
                      style={{ height: "4px", transition: "background-color 0.3s" }}
                    />
                  ))}
                </div>
                <span className={`text-${strengthColors[passwordStrength]} small fw-medium`} style={{ fontSize: "0.75rem" }}>
                  {strengthLabels[passwordStrength]} password
                </span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-100 fw-semibold rounded-3 d-flex align-items-center justify-content-center gap-2 shadow-sm mt-3"
              disabled={loading}
              style={{ paddingTop: "0.65rem", paddingBottom: "0.65rem", fontSize: "1rem" }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Sending OTP...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus"></i>
                  Create Account
                </>
              )}
            </button>

            {/* Terms */}
            <p className="text-center text-muted mt-2 mb-0" style={{ fontSize: "0.72rem" }}>
              By signing up, you agree to our{" "}
              <a href="#" className="text-primary text-decoration-none">Terms</a> &{" "}
              <a href="#" className="text-primary text-decoration-none">Privacy Policy</a>
            </p>

            {/* Divider */}
            <div className="d-flex align-items-center gap-3 my-4">
              <hr className="flex-grow-1 m-0 opacity-25" />
              <span className="text-muted fw-medium text-uppercase" style={{ fontSize: "0.7rem", letterSpacing: "0.06em" }}>or sign up with</span>
              <hr className="flex-grow-1 m-0 opacity-25" />
            </div>

            {/* Google */}
            <div id="googleSignupDiv" className="w-100 mb-4"></div>

            {/* Login link */}
            <p className="text-center text-muted small mb-0">
              Already have an account?{" "}
              <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                Sign in →
              </Link>
            </p>

          </form>

          {/* Trust badges */}
          <div className="d-flex justify-content-center gap-4 mt-4 pt-3 border-top">
            {[
              { icon: "fa-shield-alt", color: "#198754", label: "Secure" },
              { icon: "fa-lock", color: "#0d6efd", label: "Private" },
              { icon: "fa-user-shield", color: "#ffc107", label: "Protected" },
            ].map(({ icon, color, label }) => (
              <div key={label} className="d-flex align-items-center gap-1">
                <i className={`fas ${icon}`} style={{ fontSize: "0.72rem", color }}></i>
                <span className="text-muted" style={{ fontSize: "0.72rem" }}>{label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Signup;