import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();

  const redirectPath =
    new URLSearchParams(location.search).get("redirect") || "/";

  useEffect(() => {
    if (user) navigate(redirectPath);
  }, [user, navigate, redirectPath]);

  useEffect(() => {
    const handleGoogleResponse = async (response) => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: response.credential }),
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setMessage({ text: "Google login successful! Redirecting...", type: "success" });
          setTimeout(() => navigate(redirectPath), 1500);
        } else {
          setMessage({ text: data.message || "Google login failed.", type: "danger" });
        }
      } catch (err) {
        setMessage({ text: "Something went wrong during Google login.", type: "danger" });
      }
    };

    const initializeGoogleSignIn = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: "YOUR_GOOGLE_CLIENT_ID",
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById("googleLoginDiv"),
          { theme: "outline", size: "large", width: "100%" }
        );
      }
    };

    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
    } else {
      initializeGoogleSignIn();
    }
  }, [navigate, redirectPath]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await login(formData);
      setMessage({ text: res.message || "Logged in successfully!", type: "success" });
      setTimeout(() => navigate(redirectPath), 1500);
    } catch (error) {
      setMessage({ text: error.message || "Something went wrong. Try again.", type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: "fa-truck", text: "Free delivery on orders over $50" },
    { icon: "fa-undo-alt", text: "30-day hassle-free returns" },
    { icon: "fa-lock", text: "Secure checkout & data protection" },
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
        {/* Decorative blobs */}
        <div style={{
          position: "absolute", top: "-80px", left: "-80px",
          width: "300px", height: "300px", borderRadius: "50%",
          background: "rgba(255,255,255,0.06)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-100px", right: "-60px",
          width: "350px", height: "350px", borderRadius: "50%",
          background: "rgba(255,255,255,0.06)", pointerEvents: "none",
        }} />

        {/* Top section */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <Link
            to="/"
            className="text-decoration-none d-inline-flex align-items-center gap-2 mb-5"
            style={{ color: "#fff" }}
          >
            <div style={{
              width: 42, height: 42, borderRadius: 10,
              background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <i className="fas fa-store text-white"></i>
            </div>
            <span className="fs-4 fw-bold">Ecomm</span>
          </Link>

          <h2 className="fw-bold lh-sm mb-3" style={{ color: "#fff", fontSize: "2.1rem" }}>
            Shop smarter,<br />
            <span style={{ color: "#ffc107" }}>live better.</span>
          </h2>
          <p className="mb-5" style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.95rem", maxWidth: 300 }}>
            Sign in to access your orders, wishlist, and exclusive member deals.
          </p>

          <div className="d-flex flex-column gap-3">
            {features.map(({ icon, text }) => (
              <div key={text} className="d-flex align-items-center gap-3">
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: "rgba(255,255,255,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <i className={`fas ${icon} text-white`}></i>
                </div>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.87rem" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div style={{
          position: "relative", zIndex: 1,
          borderTop: "1px solid rgba(255,255,255,0.15)",
          paddingTop: "1.5rem",
        }}>
          <div className="d-flex gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <i key={i} className="fas fa-star" style={{ color: "#ffc107", fontSize: "0.75rem" }}></i>
            ))}
          </div>
          <p className="fst-italic mb-1" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.87rem" }}>
            "The best online shopping experience I've ever had."
          </p>
          <p className="fw-medium mb-0" style={{ color: "#fff", fontSize: "0.85rem" }}>
            — Sarah K., verified buyer
          </p>
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

          {/* Heading */}
          <div className="mb-4">
            <h3 className="fw-bold text-dark mb-1">Welcome back 👋</h3>
            <p className="text-muted mb-0 small">Enter your credentials to continue shopping</p>
          </div>

          {/* Alert */}
          {message.text && (
            <div
              className={`alert alert-${message.type} alert-dismissible d-flex align-items-center gap-2 rounded-3 py-2 small`}
              role="alert"
            >
              <i className={`fas ${message.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"} flex-shrink-0`}></i>
              <span>{message.text}</span>
              <button
                type="button"
                className="btn-close btn-sm ms-auto"
                onClick={() => setMessage({ text: "", type: "" })}
              ></button>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-medium text-dark small mb-1">
                Email Address
              </label>
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="fas fa-envelope" style={{ fontSize: "0.9rem" }}></i>
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control bg-light border-start-0"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label htmlFor="password" className="form-label fw-medium text-dark small mb-0">
                  Password
                </label>
                <Link to="/forgot-password" className="text-primary text-decoration-none" style={{ fontSize: "0.8rem" }}>
                  Forgot password?
                </Link>
              </div>
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="fas fa-lock" style={{ fontSize: "0.9rem" }}></i>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="form-control bg-light border-start-0 border-end-0"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="input-group-text bg-light border-start-0 text-muted"
                  onClick={() => setShowPassword((p) => !p)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} style={{ fontSize: "0.9rem" }}></i>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-100 fw-semibold rounded-3 d-flex align-items-center justify-content-center gap-2 shadow-sm"
              disabled={loading}
              style={{ paddingTop: "0.65rem", paddingBottom: "0.65rem", fontSize: "1rem" }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Logging in...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  Sign In
                </>
              )}
            </button>

            {/* Divider */}
            <div className="d-flex align-items-center gap-3 my-4">
              <hr className="flex-grow-1 m-0 opacity-25" />
              <span className="text-muted fw-medium text-uppercase" style={{ fontSize: "0.7rem", letterSpacing: "0.06em" }}>
                or continue with
              </span>
              <hr className="flex-grow-1 m-0 opacity-25" />
            </div>

            {/* Google */}
            <div id="googleLoginDiv" className="w-100 mb-4"></div>

            {/* Register link */}
            <p className="text-center text-muted small mb-0">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary fw-semibold text-decoration-none">
                Create one free →
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

export default Login;