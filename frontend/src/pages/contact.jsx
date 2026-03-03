import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Contact = () => {
  const [form, setForm]       = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()    || form.name.length    < 2)  e.name    = "Name must be at least 2 characters.";
    if (!form.email.trim()   || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.subject.trim())                              e.subject = "Please enter a subject.";
    if (!form.message.trim() || form.message.length < 10) e.message = "Message must be at least 10 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200)); // simulate API
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", subject: "", message: "" });
    setLoading(false);
  };

  const contactInfo = [
    {
      icon: "fa-map-marker-alt",
      label: "Our Address",
      value: "123 Street, New York, USA",
      sub: "Visit us anytime",
      color: "#0d6efd",
      bg: "rgba(13,110,253,0.08)",
    },
    {
      icon: "fa-envelope",
      label: "Email Us",
      value: "info@ecomm.com",
      sub: "We reply within 24 hours",
      color: "#198754",
      bg: "rgba(25,135,84,0.08)",
    },
    {
      icon: "fa-phone-alt",
      label: "Call Us",
      value: "(+012) 3456 7890",
      sub: "Mon–Sat, 9am – 6pm",
      color: "#6610f2",
      bg: "rgba(102,16,242,0.08)",
    },
    {
      icon: "fa-headset",
      label: "Live Support",
      value: "Chat with us",
      sub: "Available 24/7 online",
      color: "#dc3545",
      bg: "rgba(220,53,69,0.08)",
    },
  ];

  const faqs = [
    { q: "How long does delivery take?",       a: "Standard delivery takes 3–5 business days. Express delivery is available at checkout." },
    { q: "What is your return policy?",        a: "We offer a 7-day hassle-free return policy on all products. Just raise a request from your orders page." },
    { q: "How do I track my order?",           a: "Once your order is shipped, you'll receive a tracking link via email and SMS." },
    { q: "Are the products genuine?",          a: "Yes, 100%. All products are sourced directly from verified brands and suppliers." },
  ];

  return (
    <div className="bg-light" style={{ minHeight: "100vh" }}>

      {/* ── Page Banner ── */}
      <div style={{ background: "linear-gradient(135deg,#0d6efd,#003db5)", minHeight: 160 }}
        className="d-flex align-items-center">
        <div className="container py-4">
          <nav aria-label="breadcrumb" className="mb-2">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/" className="text-white text-opacity-75 text-decoration-none small">Home</Link>
              </li>
              <li className="breadcrumb-item active small"
                style={{ color: "rgba(255,255,255,0.55)" }}>Contact</li>
            </ol>
          </nav>
          <h2 className="fw-bold text-white mb-1">Get in Touch</h2>
          <p className="mb-0 small" style={{ color: "rgba(255,255,255,0.75)" }}>
            We'd love to hear from you — reach out any time
          </p>
        </div>
      </div>

      <div className="container py-5">

        {/* ── Contact Info Cards ── */}
        <div className="row g-3 mb-5">
          {contactInfo.map(({ icon, label, value, sub, color, bg }) => (
            <div key={label} className="col-6 col-md-3">
              <div className="card border-0 shadow-sm rounded-4 h-100 text-center p-3"
                style={{ transition: "transform 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = ""}>
                <div className="d-flex align-items-center justify-content-center rounded-3 mx-auto mb-3"
                  style={{ width: 52, height: 52, background: bg }}>
                  <i className={"fas " + icon} style={{ color, fontSize: "1.2rem" }}></i>
                </div>
                <p className="fw-bold text-dark mb-1 small">{label}</p>
                <p className="fw-semibold mb-0" style={{ color, fontSize: "0.85rem" }}>{value}</p>
                <p className="text-muted mb-0" style={{ fontSize: "0.7rem" }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Map + Form ── */}
        <div className="row g-4 mb-5">

          {/* Map */}
          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
              <iframe
                className="w-100 border-0"
                style={{ minHeight: 300, flex: 1 }}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387191.33750346623!2d-73.97968099999999!3d40.6974881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbd!4v1694259649153!5m2!1sen!2sbd"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
              />
              {/* Map footer */}
              <div className="p-3 bg-white border-top d-flex align-items-center gap-2">
                <i className="fas fa-map-marker-alt text-primary"></i>
                <span className="text-muted small">123 Street, New York, USA</span>
                <a href="https://maps.google.com" target="_blank" rel="noreferrer"
                  className="btn btn-sm btn-outline-primary rounded-pill px-3 ms-auto"
                  style={{ fontSize: "0.72rem" }}>
                  <i className="fas fa-external-link-alt me-1" style={{ fontSize: "0.6rem" }}></i>
                  Open Maps
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4 p-md-5">
                <h5 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                  <i className="fas fa-paper-plane text-primary" style={{ fontSize: "1rem" }}></i>
                  Send us a Message
                </h5>
                <p className="text-muted small mb-4">
                  Fill in the form below and we'll get back to you within 24 hours.
                </p>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="row g-3">

                    {/* Name */}
                    <div className="col-12 col-sm-6">
                      <label className="form-label fw-medium text-dark small mb-1">
                        Full Name <span className="text-danger">*</span>
                      </label>
                      <div className="input-group input-group-lg">
                        <span className={"input-group-text bg-light border-end-0 " + (errors.name ? "border-danger" : "text-muted")}>
                          <i className={"fas fa-user " + (errors.name ? "text-danger" : "")} style={{ fontSize: "0.85rem" }}></i>
                        </span>
                        <input type="text" name="name" value={form.name} onChange={handleChange}
                          placeholder="John Doe"
                          className={"form-control bg-light border-start-0 " + (errors.name ? "border-danger is-invalid" : "")} />
                      </div>
                      {errors.name && (
                        <div className="d-flex align-items-center gap-1 mt-1">
                          <i className="fas fa-exclamation-circle text-danger" style={{ fontSize: "0.7rem" }}></i>
                          <small className="text-danger">{errors.name}</small>
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div className="col-12 col-sm-6">
                      <label className="form-label fw-medium text-dark small mb-1">
                        Email Address <span className="text-danger">*</span>
                      </label>
                      <div className="input-group input-group-lg">
                        <span className={"input-group-text bg-light border-end-0 " + (errors.email ? "border-danger" : "text-muted")}>
                          <i className={"fas fa-envelope " + (errors.email ? "text-danger" : "")} style={{ fontSize: "0.85rem" }}></i>
                        </span>
                        <input type="email" name="email" value={form.email} onChange={handleChange}
                          placeholder="john@example.com"
                          className={"form-control bg-light border-start-0 " + (errors.email ? "border-danger is-invalid" : "")} />
                      </div>
                      {errors.email && (
                        <div className="d-flex align-items-center gap-1 mt-1">
                          <i className="fas fa-exclamation-circle text-danger" style={{ fontSize: "0.7rem" }}></i>
                          <small className="text-danger">{errors.email}</small>
                        </div>
                      )}
                    </div>

                    {/* Subject */}
                    <div className="col-12">
                      <label className="form-label fw-medium text-dark small mb-1">
                        Subject <span className="text-danger">*</span>
                      </label>
                      <div className="input-group input-group-lg">
                        <span className={"input-group-text bg-light border-end-0 " + (errors.subject ? "border-danger" : "text-muted")}>
                          <i className={"fas fa-tag " + (errors.subject ? "text-danger" : "")} style={{ fontSize: "0.85rem" }}></i>
                        </span>
                        <select name="subject" value={form.subject} onChange={handleChange}
                          className={"form-select bg-light border-start-0 " + (errors.subject ? "border-danger is-invalid" : "")}>
                          <option value="">Select a topic...</option>
                          <option>Order Issue</option>
                          <option>Return / Refund</option>
                          <option>Product Enquiry</option>
                          <option>Delivery Status</option>
                          <option>Payment Problem</option>
                          <option>Other</option>
                        </select>
                      </div>
                      {errors.subject && (
                        <div className="d-flex align-items-center gap-1 mt-1">
                          <i className="fas fa-exclamation-circle text-danger" style={{ fontSize: "0.7rem" }}></i>
                          <small className="text-danger">{errors.subject}</small>
                        </div>
                      )}
                    </div>

                    {/* Message */}
                    <div className="col-12">
                      <label className="form-label fw-medium text-dark small mb-1">
                        Message <span className="text-danger">*</span>
                      </label>
                      <div className="input-group input-group-lg">
                        <span className={"input-group-text bg-light border-end-0 align-items-start pt-3 " + (errors.message ? "border-danger" : "text-muted")}>
                          <i className={"fas fa-comment-alt " + (errors.message ? "text-danger" : "")} style={{ fontSize: "0.85rem" }}></i>
                        </span>
                        <textarea name="message" value={form.message} onChange={handleChange}
                          rows={4} placeholder="Describe your issue or question in detail..."
                          className={"form-control bg-light border-start-0 " + (errors.message ? "border-danger is-invalid" : "")} />
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-1">
                        {errors.message
                          ? <div className="d-flex align-items-center gap-1">
                              <i className="fas fa-exclamation-circle text-danger" style={{ fontSize: "0.7rem" }}></i>
                              <small className="text-danger">{errors.message}</small>
                            </div>
                          : <span />}
                        <small className={"ms-auto " + (form.message.length > 450 ? "text-danger" : "text-muted")}>
                          {form.message.length}/500
                        </small>
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="col-12">
                      <button type="submit" disabled={loading}
                        className="btn btn-primary rounded-3 fw-semibold py-3 w-100 d-flex align-items-center justify-content-center gap-2 shadow-sm">
                        {loading ? (
                          <><span className="spinner-border spinner-border-sm" role="status"></span> Sending...</>
                        ) : (
                          <><i className="fas fa-paper-plane"></i> Send Message</>
                        )}
                      </button>
                      <p className="text-muted text-center mt-2 mb-0" style={{ fontSize: "0.72rem" }}>
                        <i className="fas fa-lock me-1"></i>
                        Your information is secure and will never be shared.
                      </p>
                    </div>

                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* ── FAQ Section ── */}
        <div className="card border-0 shadow-sm rounded-4 mb-5">
          <div className="card-body p-4 p-md-5">
            <div className="text-center mb-4">
              <p className="text-primary fw-semibold small mb-1 d-flex align-items-center justify-content-center gap-2">
                <i className="fas fa-question-circle" style={{ fontSize: "0.8rem" }}></i>
                QUICK ANSWERS
              </p>
              <h5 className="fw-bold text-dark mb-0">Frequently Asked Questions</h5>
            </div>
            <div className="row g-3">
              {faqs.map(({ q, a }, i) => (
                <div key={i} className="col-12 col-md-6">
                  <div className="p-3 rounded-3 h-100" style={{ background: "#f8fafc" }}>
                    <p className="fw-bold text-dark mb-1 d-flex align-items-start gap-2"
                      style={{ fontSize: "0.88rem" }}>
                      <i className="fas fa-circle-question text-primary mt-1 flex-shrink-0"
                        style={{ fontSize: "0.75rem" }}></i>
                      {q}
                    </p>
                    <p className="text-muted mb-0 ps-3" style={{ fontSize: "0.8rem", lineHeight: 1.6 }}>
                      {a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <div className="rounded-4 overflow-hidden"
          style={{ background: "linear-gradient(135deg,#0d6efd,#6610f2)" }}>
          <div className="p-4 p-md-5 text-center">
            <h5 className="fw-bold text-white mb-1">
              <i className="fas fa-headset me-2"></i>
              Still need help?
            </h5>
            <p className="mb-3" style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem" }}>
              Our support team is available 24/7 to assist you with any questions or concerns.
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <a href="tel:+01234567890"
                className="btn btn-white rounded-pill px-4 fw-semibold"
                style={{ background: "#fff", color: "#0d6efd" }}>
                <i className="fas fa-phone-alt me-2"></i>Call Now
              </a>
              <a href="mailto:info@ecomm.com"
                className="btn btn-outline-light rounded-pill px-4 fw-semibold">
                <i className="fas fa-envelope me-2"></i>Email Us
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;