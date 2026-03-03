import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import API from "../api-helper/Axioxinstance";

const OrderSuccess = () => {
  const navigate       = useNavigate();
  const { orderId }    = useParams();
  const [order, setOrder]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await API.get(`/user/orders/${orderId}`, { withCredentials: true });
        setOrder(res.data.order || res.data.data || res.data);
      } catch { console.error("Could not fetch order details"); }
      finally { setLoading(false); }
    };
    fetchOrder();
  }, [orderId]);

  /* ── Confetti burst (CSS only, no library) ── */
  const confettiColors = ["#0d6efd","#6610f2","#198754","#fbbf24","#dc3545","#0dcaf0"];

  return (
    <div className="bg-light" style={{ minHeight: "100vh" }}>

      {/* ── Confetti strip ── */}
      <div className="w-100 overflow-hidden position-relative" style={{ height: 6 }}>
        {confettiColors.map((c, i) => (
          <div key={i} className="position-absolute h-100"
            style={{ background: c, width: `${100 / confettiColors.length}%`, left: `${i * (100 / confettiColors.length)}%` }} />
        ))}
      </div>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">

            {/* ── Success card ── */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">

              {/* Green header */}
              <div className="text-center py-5 px-4"
                style={{ background: "linear-gradient(135deg,#198754,#0f5132)" }}>
                {/* Animated checkmark circle */}
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white mb-3 shadow"
                  style={{ width: 80, height: 80 }}>
                  <i className="fas fa-check text-success" style={{ fontSize: "2.2rem" }}></i>
                </div>
                <h4 className="fw-bold text-white mb-1">Order Placed Successfully!</h4>
                <p className="mb-0" style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.9rem" }}>
                  🎉 Thank you for your purchase! We've received your order.
                </p>
              </div>

              <div className="card-body p-4">

                {/* Order ID */}
                <div className="rounded-3 px-4 py-3 mb-4 d-flex align-items-center gap-3"
                  style={{ background: "rgba(25,135,84,0.06)", border: "1px dashed #198754" }}>
                  <i className="fas fa-receipt text-success" style={{ fontSize: "1.2rem" }}></i>
                  <div>
                    <p className="text-muted mb-0" style={{ fontSize: "0.72rem" }}>Order ID</p>
                    <p className="fw-bold text-dark mb-0 small" style={{ wordBreak: "break-all" }}>
                      #{orderId}
                    </p>
                  </div>
                </div>

                {/* Order details */}
                {loading ? (
                  <div className="text-center py-3">
                    <div className="spinner-border text-primary spinner-border-sm" role="status" />
                    <p className="text-muted small mt-2 mb-0">Loading order details...</p>
                  </div>
                ) : order ? (
                  <div className="d-flex flex-column gap-3">

                    {/* Items */}
                    {order.items?.length > 0 && (
                      <div>
                        <p className="fw-semibold text-dark mb-2 small d-flex align-items-center gap-2">
                          <i className="fas fa-box text-primary" style={{ fontSize: "0.8rem" }}></i>
                          Items Ordered
                        </p>
                        <div className="d-flex flex-column gap-2">
                          {order.items.map((item, i) => (
                            <div key={i} className="d-flex align-items-center gap-3 p-2 rounded-3"
                              style={{ background: "#f8fafc" }}>
                              <div className="rounded-3 overflow-hidden flex-shrink-0 bg-white border"
                                style={{ width: 44, height: 44 }}>
                                <img
                                  src={item.product?.images?.[0]?.url || "https://via.placeholder.com/44"}
                                  alt={item.product?.name}
                                  className="w-100 h-100" style={{ objectFit: "cover" }}
                                />
                              </div>
                              <div className="flex-grow-1 min-width-0">
                                <p className="fw-medium text-dark mb-0 text-truncate small">
                                  {item.product?.name || "Product"}
                                </p>
                                <p className="text-muted mb-0" style={{ fontSize: "0.7rem" }}>
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <p className="fw-bold text-primary mb-0 small flex-shrink-0">
                                ₹{(item.price * item.quantity).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Summary row */}
                    <div className="row g-2">
                      {[
                        {
                          icon: "fa-rupee-sign",
                          label: "Total Paid",
                          value: `₹${order.totalPrice?.toLocaleString() || "—"}`,
                          color: "#0d6efd", bg: "rgba(13,110,253,0.06)",
                        },
                        {
                          icon: "fa-credit-card",
                          label: "Payment",
                          value: order.paymentMethod || "—",
                          color: "#6610f2", bg: "rgba(102,16,242,0.06)",
                        },
                        {
                          icon: "fa-circle-dot",
                          label: "Status",
                          value: order.status || "Pending",
                          color: "#198754", bg: "rgba(25,135,84,0.06)",
                        },
                      ].map(({ icon, label, value, color, bg }) => (
                        <div key={label} className="col-4">
                          <div className="rounded-3 p-2 text-center h-100" style={{ background: bg }}>
                            <i className={"fas " + icon + " mb-1 d-block"} style={{ color, fontSize: "0.9rem" }}></i>
                            <p className="text-muted mb-0" style={{ fontSize: "0.65rem" }}>{label}</p>
                            <p className="fw-bold mb-0 text-truncate" style={{ color, fontSize: "0.78rem" }}>{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery address */}
                    {order.address && (
                      <div className="rounded-3 p-3" style={{ background: "#f8fafc" }}>
                        <p className="fw-semibold text-dark mb-1 small d-flex align-items-center gap-2">
                          <i className="fas fa-map-marker-alt text-primary" style={{ fontSize: "0.8rem" }}></i>
                          Delivering To
                        </p>
                        <p className="text-muted mb-0 small" style={{ lineHeight: 1.7 }}>
                          <strong>{order.address.fullName}</strong><br />
                          {order.address.addressLine}
                          {order.address.landmark ? ", " + order.address.landmark : ""}, {order.address.city}, {order.address.state} — {order.address.pincode}<br />
                          <i className="fas fa-phone me-1" style={{ fontSize: "0.65rem" }}></i>{order.address.mobile}
                        </p>
                      </div>
                    )}

                  </div>
                ) : null}

                {/* Divider */}
                <div className="my-4" style={{ borderTop: "1px dashed #e2e8f0" }}></div>

                {/* What happens next */}
                <div className="mb-4">
                  <p className="fw-semibold text-dark mb-3 small d-flex align-items-center gap-2">
                    <i className="fas fa-road text-primary" style={{ fontSize: "0.8rem" }}></i>
                    What Happens Next?
                  </p>
                  <div className="d-flex flex-column gap-2">
                    {[
                      { icon: "fa-check-circle",  color: "#198754", text: "Order confirmed & being processed"     },
                      { icon: "fa-box",            color: "#0d6efd", text: "Items will be packed within 24 hours"  },
                      { icon: "fa-shipping-fast",  color: "#6610f2", text: "Shipped and tracking link sent via SMS" },
                      { icon: "fa-house",          color: "#f59e0b", text: "Delivered to your doorstep in 3–5 days" },
                    ].map(({ icon, color, text }, i) => (
                      <div key={i} className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                          style={{ width: 30, height: 30, background: color + "18" }}>
                          <i className={"fas " + icon} style={{ color, fontSize: "0.75rem" }}></i>
                        </div>
                        <p className="text-muted mb-0 small">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="d-flex flex-column gap-2">
                  <button
                    className="btn btn-primary rounded-3 fw-semibold py-2 d-flex align-items-center justify-content-center gap-2"
                    onClick={() => navigate("/my-orders")}>
                    <i className="fas fa-list-ul"></i>
                    View My Orders
                  </button>
                  <div className="d-flex gap-2">
                    <Link to="/shop"
                      className="btn btn-outline-primary rounded-3 fw-medium flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                      style={{ fontSize: "0.85rem" }}>
                      <i className="fas fa-store"></i>
                      Continue Shopping
                    </Link>
                    <Link to="/"
                      className="btn btn-outline-secondary rounded-3 fw-medium flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                      style={{ fontSize: "0.85rem" }}>
                      <i className="fas fa-home"></i>
                      Home
                    </Link>
                  </div>
                </div>

              </div>
            </div>

            {/* ── Support note ── */}
            <div className="text-center">
              <p className="text-muted small mb-0">
                Need help?&nbsp;
                <Link to="/contact" className="text-primary fw-medium text-decoration-none">
                  Contact Support
                </Link>
                &nbsp;·&nbsp;
                <span className="text-muted">support@ecomm.com</span>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;