import React, { useEffect, useRef, useState } from "react";

const facts = [
  {
    icon: "fa-users",
    title: "Happy Customers",
    value: 50000,
    suffix: "+",
    sub: "And growing every day",
    color: "#0d6efd",
    bg: "rgba(13,110,253,0.08)",
  },
  {
    icon: "fa-star",
    title: "Positive Reviews",
    value: 96,
    suffix: "%",
    sub: "Average satisfaction rate",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
  },
  {
    icon: "fa-award",
    title: "Quality Certificates",
    value: 33,
    suffix: "+",
    sub: "Certified & verified products",
    color: "#6610f2",
    bg: "rgba(102,16,242,0.08)",
  },
  {
    icon: "fa-box-open",
    title: "Products Available",
    value: 10000,
    suffix: "+",
    sub: "Across all categories",
    color: "#198754",
    bg: "rgba(25,135,84,0.08)",
  },
];

/* ── Animated counter hook ── */
const useCounter = (target, duration = 1800, started = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);
  return count;
};

const StatCard = ({ icon, title, value, suffix, sub, color, bg, started }) => {
  const count = useCounter(value, 1800, started);
  const display = value >= 1000
    ? (count >= 1000 ? (count / 1000).toFixed(count % 1000 === 0 ? 0 : 1) + "K" : count)
    : count;

  return (
    <div className="col-6 col-lg-3">
      <div className="card border-0 rounded-4 h-100 text-center overflow-hidden shadow-sm"
        style={{ transition: "transform 0.2s, box-shadow 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.12)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>

        <div className="card-body p-4 d-flex flex-column align-items-center gap-3">

          {/* Icon circle */}
          <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
            style={{ width: 64, height: 64, background: bg }}>
            <i className={"fas " + icon} style={{ fontSize: "1.5rem", color }}></i>
          </div>

          {/* Animated number */}
          <div>
            <h2 className="fw-bold mb-0 lh-1" style={{ color, fontSize: "2.2rem" }}>
              {display}{suffix}
            </h2>
            <p className="fw-bold text-dark mb-0 mt-1 small">{title}</p>
            <p className="text-muted mb-0" style={{ fontSize: "0.72rem" }}>{sub}</p>
          </div>

        </div>

        {/* Bottom accent */}
        <div style={{ height: 4, background: color, opacity: 0.7 }}></div>
      </div>
    </div>
  );
};

const FactsSection = () => {
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  /* ── Start counters when section enters viewport ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref}
      style={{ background: "linear-gradient(135deg,#0d6efd 0%,#003db5 100%)" }}
      className="py-5 overflow-hidden">
      <div className="container py-3">

        {/* ── Header ── */}
        <div className="text-center mb-5">
          <p className="fw-semibold mb-1 small d-flex align-items-center justify-content-center gap-2"
            style={{ color: "rgba(255,255,255,0.7)" }}>
            <i className="fas fa-chart-bar" style={{ fontSize: "0.8rem" }}></i>
            BY THE NUMBERS
          </p>
          <h2 className="fw-bold text-white mb-2">Why Customers Choose Us</h2>
          <p className="mb-0" style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.92rem", maxWidth: 400, margin: "0 auto" }}>
            Trusted by thousands of shoppers across India — here's what makes us stand out.
          </p>
        </div>

        {/* ── Stat cards ── */}
        <div className="row g-3 g-md-4 mb-5">
          {facts.map((f) => (
            <StatCard key={f.title} {...f} started={started} />
          ))}
        </div>

        {/* ── Bottom feature strip ── */}
        <div className="rounded-4 p-4"
          style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}>
          <div className="row g-3 text-center text-md-start">
            {[
              { icon: "fa-shipping-fast", title: "Free Delivery",    sub: "On orders above ₹499",       color: "#7dd3fc" },
              { icon: "fa-undo",          title: "Easy Returns",     sub: "7-day hassle-free returns",   color: "#86efac" },
              { icon: "fa-lock",          title: "Secure Payments",  sub: "100% encrypted & safe",       color: "#c4b5fd" },
              { icon: "fa-headset",       title: "24/7 Support",     sub: "Always here to help you",     color: "#fca5a5" },
            ].map(({ icon, title, sub, color }) => (
              <div key={title} className="col-6 col-md-3">
                <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-3">
                  <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                    style={{ width: 42, height: 42, background: "rgba(255,255,255,0.12)" }}>
                    <i className={"fas " + icon} style={{ color, fontSize: "1rem" }}></i>
                  </div>
                  <div>
                    <p className="fw-bold text-white mb-0 small">{title}</p>
                    <p className="mb-0" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.72rem" }}>{sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default FactsSection;