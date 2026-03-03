import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api-helper/Axioxinstance";

const VerifyOtp = () => {
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const email = localStorage.getItem("registerEmail");
  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + "*".repeat(b.length) + c)
    : null;

  // ── Handle individual digit input ──
  const handleDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // numbers only
    const updated = [...otpDigits];
    updated[index] = value.slice(-1); // one digit max
    setOtpDigits(updated);
    // Auto-focus next
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const updated = [...otpDigits];
    pasted.split("").forEach((char, i) => { updated[i] = char; });
    setOtpDigits(updated);
    // Focus last filled or next empty
    const nextEmpty = updated.findIndex((d) => !d);
    const focusIdx = nextEmpty === -1 ? 5 : nextEmpty;
    inputRefs.current[focusIdx]?.focus();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otp = otpDigits.join("");

    if (otp.length < 6) {
      setMessage({ text: "Please enter the complete 6-digit OTP.", type: "danger" });
      return;
    }

    if (!email) {
      setMessage({ text: "No email found. Please register again.", type: "danger" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await API.post("/auth/verify-otp", { email, otp });
      setMessage({ text: response.data.message || "Email verified successfully!", type: "success" });
      localStorage.removeItem("registerEmail");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Invalid OTP. Please try again.",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

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
            Almost there!<br />
            <span style={{ color: "#ffc107" }}>Verify your email.</span>
          </h2>
          <p className="mb-5" style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.95rem", maxWidth: 300 }}>
            We sent a one-time password to your email. Enter it to confirm your identity and activate your account.
          </p>

          {/* Steps */}
          <div className="d-flex flex-column gap-3">
            {[
              { icon: "fa-user-plus", text: "Account created", done: true },
              { icon: "fa-envelope", text: "OTP sent to your email", done: true },
              { icon: "fa-shield-alt", text: "Verify OTP", done: false, active: true },
              { icon: "fa-check-circle", text: "Account activated", done: false },
            ].map(({ icon, text, done, active }) => (
              <div key={text} className="d-flex align-items-center gap-3">
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: done ? "rgba(25,135,84,0.5)" : active ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: active ? "2px solid rgba(255,255,255,0.6)" : "none",
                }}>
                  <i className={`fas ${done ? "fa-check" : icon} text-white`} style={{ fontSize: "0.85rem" }}></i>
                </div>
                <span style={{
                  color: done ? "rgba(255,255,255,0.9)" : active ? "#fff" : "rgba(255,255,255,0.45)",
                  fontSize: "0.87rem",
                  fontWeight: active ? 600 : 400,
                }}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <div style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "1.5rem" }}>
          <div className="d-flex align-items-center gap-2">
            <i className="fas fa-clock text-warning"></i>
            <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.85rem" }}>
              OTP expires in <strong className="text-white">10 minutes</strong>
            </span>
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

          {/* Icon + Heading */}
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
              style={{ width: 72, height: 72, background: "rgba(13,110,253,0.1)" }}
            >
              <i className="fas fa-envelope-open-text text-primary" style={{ fontSize: "1.8rem" }}></i>
            </div>
            <h3 className="fw-bold text-dark mb-1">Check your email</h3>
            <p className="text-muted small mb-0">
              We sent a 6-digit OTP to
            </p>
            {maskedEmail && (
              <p className="fw-semibold text-dark small mb-0">{maskedEmail}</p>
            )}
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

          <form onSubmit={handleVerifyOtp} noValidate>

            {/* OTP Digit Boxes */}
            <div className="mb-4">
              <label className="form-label fw-medium text-dark small d-block text-center mb-3">
                Enter the 6-digit code
              </label>
              <div className="d-flex justify-content-center gap-2" onPaste={handlePaste}>
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className={`form-control text-center fw-bold p-0 ${
                      message.type === "danger" && !loading ? "border-danger" : ""
                    }`}
                    style={{
                      width: "52px",
                      height: "58px",
                      fontSize: "1.4rem",
                      borderRadius: "10px",
                      caretColor: "transparent",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-100 fw-semibold rounded-3 d-flex align-items-center justify-content-center gap-2 shadow-sm"
              disabled={loading || otpDigits.join("").length < 6}
              style={{ paddingTop: "0.65rem", paddingBottom: "0.65rem", fontSize: "1rem" }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Verifying...
                </>
              ) : (
                <>
                  <i className="fas fa-shield-alt"></i>
                  Verify OTP
                </>
              )}
            </button>

            {/* Resend */}
            <p className="text-center text-muted small mt-3 mb-0">
              Didn't receive it?{" "}
              <Link to="/signup" className="text-primary fw-semibold text-decoration-none">
                Resend OTP →
              </Link>
            </p>

            {/* Back to login */}
            <p className="text-center mt-2 mb-0">
              <Link to="/login" className="text-muted text-decoration-none small d-inline-flex align-items-center gap-1">
                <i className="fas fa-arrow-left" style={{ fontSize: "0.7rem" }}></i>
                Back to Login
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

export default VerifyOtp;