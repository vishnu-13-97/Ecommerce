import React, { useEffect, useState } from "react";

const Spinner = () => {
  const [loading, setLoading] = useState(true);
  const [fade,    setFade]    = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFade(true),  800);
    const hideTimer = setTimeout(() => setLoading(false), 1200);
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
  }, []);

  if (!loading) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 vh-100 d-flex flex-column align-items-center justify-content-center"
      style={{
        zIndex: 9999,
        background: "linear-gradient(135deg,#0d6efd,#003db5)",
        transition: "opacity 0.4s ease",
        opacity: fade ? 0 : 1,
      }}
    >
      {/* Logo / Brand */}
      <div className="text-center mb-4">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-3 bg-white mb-3 shadow"
          style={{ width: 64, height: 64 }}>
          <i className="fas fa-shopping-bag text-primary" style={{ fontSize: "1.8rem" }}></i>
        </div>
        <h4 className="fw-bold text-white mb-0">Ecomm</h4>
        <p className="mb-0" style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.78rem" }}>
          Your Shopping Partner
        </p>
      </div>

      {/* Animated dots */}
      <div className="d-flex align-items-center gap-2 mb-4">
        {[0, 1, 2].map((i) => (
          <div key={i}
            className="rounded-circle bg-white"
            style={{
              width: 10, height: 10,
              animation: `bounce 1s ease-in-out ${i * 0.2}s infinite`,
              opacity: 0.85,
            }} />
        ))}
      </div>

      {/* Loading text */}
      <p className="fw-medium" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.82rem" }}>
        Loading your experience...
      </p>

      {/* CSS for bounce */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1.2); opacity: 1;   }
        }
      `}</style>
    </div>
  );
};

export default Spinner;