import React, { useEffect, useState } from "react";

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      onClick={scrollToTop}
      className="btn btn-primary d-flex align-items-center justify-content-center rounded-circle shadow"
      aria-label="Back to top"
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        width: "46px",
        height: "46px",
        zIndex: 1050,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(16px)",
        pointerEvents: isVisible ? "auto" : "none",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    >
      <i className="fas fa-arrow-up" style={{ fontSize: "0.9rem" }}></i>
    </button>
  );
};

export default BackToTopButton;