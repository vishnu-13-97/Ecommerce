import React from "react";
import { Link } from "react-router-dom";
import payment from "../assets/img/payment.png";

const Footer = () => {
  const shopLinks = [
    { label: "About Us", to: "/about" },
    { label: "Contact Us", to: "/contact" },
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms & Conditions", to: "/terms" },
    { label: "Return Policy", to: "/returns" },
    { label: "FAQs & Help", to: "/faq" },
  ];

  const accountLinks = [
    { label: "My Account", to: "/profile" },
    { label: "Shop", to: "/shop" },
    { label: "Shopping Cart", to: "/cart" },
    { label: "Wishlist", to: "/wishlist" },
    { label: "Order History", to: "/my-orders" },
    { label: "International Orders", to: "/international" },
  ];

  const socialLinks = [
    { icon: "fa-facebook-f", href: "#", label: "Facebook" },
    { icon: "fa-twitter", href: "#", label: "Twitter" },
    { icon: "fa-youtube", href: "#", label: "YouTube" },
    { icon: "fa-linkedin-in", href: "#", label: "LinkedIn" },
    { icon: "fa-instagram", href: "#", label: "Instagram" },
  ];

  const contactItems = [
    { icon: "fa-map-marker-alt", text: "1429 Netus Rd, New York, NY 48247" },
    { icon: "fa-envelope", text: "support@ecomm.com", href: "mailto:support@ecomm.com" },
    { icon: "fa-phone-alt", text: "+01 234 567 8910", href: "tel:+012345678910" },
  ];

  return (
    <footer className="bg-dark text-white-50">

      {/* ── Top Bar: Brand + Newsletter + Social ── */}
      <div className="border-bottom border-secondary border-opacity-25 py-4">
        <div className="container">
          <div className="row g-4 align-items-center">

            {/* Brand */}
            <div className="col-12 col-lg-3 text-center text-lg-start">
              <Link to="/" className="text-decoration-none">
                <h3 className="text-primary fw-bold mb-0 d-flex align-items-center justify-content-center justify-content-lg-start gap-2">
                  <i className="fas fa-store"></i> Ecomm
                </h3>
                <small className="text-warning" style={{ fontSize: "0.8rem", letterSpacing: "0.08em" }}>
                  YOUR SHOPPING PARTNER
                </small>
              </Link>
            </div>

            {/* Newsletter */}
            <div className="col-12 col-lg-6">
              <p className="text-white-50 small text-center mb-2">
                <i className="fas fa-bell me-1 text-warning"></i>
                Subscribe for exclusive deals & new arrivals
              </p>
              <div className="input-group rounded-pill overflow-hidden shadow-sm">
                <span className="input-group-text bg-secondary border-0 text-white-50 ps-3">
                  <i className="fas fa-envelope"></i>
                </span>
                <input
                  className="form-control bg-secondary border-0 text-white py-2"
                  type="email"
                  placeholder="Enter your email address"
                  style={{ outline: "none", boxShadow: "none" }}
                />
                <button
                  type="button"
                  className="btn btn-primary fw-semibold px-4 border-0"
                  style={{ borderRadius: "0 50px 50px 0" }}
                >
                  Subscribe
                </button>
              </div>
            </div>

            {/* Social */}
            <div className="col-12 col-lg-3">
              <div className="d-flex justify-content-center justify-content-lg-end gap-2 flex-wrap">
                {socialLinks.map(({ icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center text-white-50"
                    style={{ width: 36, height: 36 }}
                  >
                    <i className={`fab ${icon}`} style={{ fontSize: "0.8rem" }}></i>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Main Footer Links ── */}
      <div className="container py-5">
        <div className="row g-5">

          {/* About blurb */}
          <div className="col-12 col-sm-6 col-lg-3">
            <h6 className="text-white fw-semibold text-uppercase mb-3 d-flex align-items-center gap-2">
              <span className="bg-primary rounded-2 d-inline-block" style={{ width: 4, height: 16 }}></span>
              Why Choose Us
            </h6>
            <p className="small lh-lg mb-3">
              We offer premium quality products with fast delivery, easy returns, and 24/7 customer support. Trusted by over 50,000 happy customers worldwide.
            </p>
            <div className="d-flex flex-column gap-2">
              {[
                { icon: "fa-truck", text: "Free delivery over $50" },
                { icon: "fa-undo", text: "30-day easy returns" },
                { icon: "fa-headset", text: "24/7 support" },
              ].map(({ icon, text }) => (
                <div key={text} className="d-flex align-items-center gap-2">
                  <i className={`fas ${icon} text-primary`} style={{ fontSize: "0.75rem", width: 14 }}></i>
                  <span className="small">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shop Info */}
          <div className="col-12 col-sm-6 col-lg-3">
            <h6 className="text-white fw-semibold text-uppercase mb-3 d-flex align-items-center gap-2">
              <span className="bg-primary rounded-2 d-inline-block" style={{ width: 4, height: 16 }}></span>
              Shop Info
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              {shopLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-white-50 text-decoration-none small d-flex align-items-center gap-2"
                    style={{ transition: "color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.classList.replace("text-white-50", "text-primary")}
                    onMouseLeave={e => e.currentTarget.classList.replace("text-primary", "text-white-50")}
                  >
                    <i className="fas fa-chevron-right text-primary" style={{ fontSize: "0.6rem" }}></i>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div className="col-12 col-sm-6 col-lg-3">
            <h6 className="text-white fw-semibold text-uppercase mb-3 d-flex align-items-center gap-2">
              <span className="bg-primary rounded-2 d-inline-block" style={{ width: 4, height: 16 }}></span>
              My Account
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              {accountLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-white-50 text-decoration-none small d-flex align-items-center gap-2"
                    onMouseEnter={e => e.currentTarget.classList.replace("text-white-50", "text-primary")}
                    onMouseLeave={e => e.currentTarget.classList.replace("text-primary", "text-white-50")}
                  >
                    <i className="fas fa-chevron-right text-primary" style={{ fontSize: "0.6rem" }}></i>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-12 col-sm-6 col-lg-3">
            <h6 className="text-white fw-semibold text-uppercase mb-3 d-flex align-items-center gap-2">
              <span className="bg-primary rounded-2 d-inline-block" style={{ width: 4, height: 16 }}></span>
              Contact Us
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-3 mb-4">
              {contactItems.map(({ icon, text, href }) => (
                <li key={text} className="d-flex align-items-start gap-3">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-2 bg-white bg-opacity-10 flex-shrink-0"
                    style={{ width: 32, height: 32 }}
                  >
                    <i className={`fas ${icon} text-primary`} style={{ fontSize: "0.8rem" }}></i>
                  </div>
                  {href ? (
                    <a href={href} className="text-white-50 text-decoration-none small lh-sm pt-1">{text}</a>
                  ) : (
                    <span className="small lh-sm pt-1">{text}</span>
                  )}
                </li>
              ))}
            </ul>

            {/* Payment */}
            <div>
              <p className="small text-white mb-2 fw-medium">
                <i className="fas fa-credit-card me-2 text-primary"></i>
                Accepted Payments
              </p>
              <img
                src={payment}
                className="img-fluid"
                alt="Accepted payment methods"
                style={{ maxWidth: "220px", opacity: 0.85 }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* ── Copyright Bar ── */}
      <div className="bg-black bg-opacity-50 py-3">
        <div className="container">
          <div className="row align-items-center g-2">
            <div className="col-12 col-md-6 text-center text-md-start">
              <p className="mb-0 small text-white-50">
                © {new Date().getFullYear()}{" "}
                <Link to="/" className="text-primary text-decoration-none fw-medium">Ecomm</Link>.
                {" "}All rights reserved.
              </p>
            </div>
            <div className="col-12 col-md-6 text-center text-md-end">
              <p className="mb-0 small text-white-50">
                Designed with <i className="fas fa-heart text-danger mx-1" style={{ fontSize: "0.7rem" }}></i> for great shopping experiences
              </p>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;