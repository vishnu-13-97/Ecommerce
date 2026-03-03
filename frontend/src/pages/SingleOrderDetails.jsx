import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api-helper/Axioxinstance";
import { toast } from "react-toastify";

const statusConfig = {
  Pending:    { bg: "warning",  text: "dark",  icon: "fa-clock",        step: 1 },
  Processing: { bg: "info",     text: "white", icon: "fa-cog",          step: 2 },
  Shipped:    { bg: "primary",  text: "white", icon: "fa-truck",        step: 3 },
  Delivered:  { bg: "success",  text: "white", icon: "fa-check-circle", step: 4 },
  Cancelled:  { bg: "danger",   text: "white", icon: "fa-times-circle", step: 0 },
};

const trackingSteps = [
  { label: "Order Placed",  icon: "fa-shopping-bag",  step: 1 },
  { label: "Processing",    icon: "fa-cog",            step: 2 },
  { label: "Shipped",       icon: "fa-truck",          step: 3 },
  { label: "Delivered",     icon: "fa-check-circle",   step: 4 },
];

const SingleOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const [shippingAddress, setShippingAddress] = useState(null);

  useEffect(() => { fetchOrder(); }, []);

  // After order loads, fetch the shipping address if it's just an ObjectId string
  useEffect(() => {
    if (!order) return;
    const addr = order.shippingAddress;
    if (!addr) return;

    if (typeof addr === "string" || (typeof addr === "object" && !addr.city && !addr.address && Object.keys(addr).length <= 2)) {
      // It's an unpopulated ObjectId — fetch the address separately
      const addrId = typeof addr === "string" ? addr : addr._id;
      API.get(`/user/addresses/${addrId}`, { withCredentials: true })
        .then((res) => setShippingAddress(res.data.address || res.data.data || res.data))
        .catch(() => {
          // Fallback: try fetching from user profile addresses
          API.get("/user/profile", { withCredentials: true })
            .then((res) => {
              const addresses = res.data.user?.addresses || res.data.addresses || [];
              const found = addresses.find((a) => a._id === addrId || a._id?.toString() === addrId);
              if (found) setShippingAddress(found);
            })
            .catch(() => setShippingAddress(null));
        });
    } else {
      // Already populated
      setShippingAddress(addr);
    }
  }, [order]);

  const fetchOrder = async () => {
    try {
      const res = await API.get(`/user/orders/${id}`, { withCredentials: true });
      setOrder(res.data.order);
    } catch {
      toast.error("Order not found");
      navigate("/my-orders");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    try {
      setCancelling(true);
      await API.put(`/user/orders/${id}/cancel`, {}, { withCredentials: true });
      toast.success("Order cancelled successfully");
      setShowCancelConfirm(false);
      fetchOrder();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancelling(false);
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
          <p className="text-muted fw-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const cfg = statusConfig[order.orderStatus] || statusConfig.Pending;
  const currentStep = cfg.step;
  const isCancelled = order.orderStatus === "Cancelled";
  const canCancel = ["Pending", "Processing", "Shipped"].includes(order.orderStatus);

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
                <i className="fas fa-receipt"></i> Order Details
              </h2>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/" className="text-white-50 text-decoration-none">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/my-orders" className="text-white-50 text-decoration-none">My Orders</Link>
                  </li>
                  <li className="breadcrumb-item active text-white">
                    #{order._id.slice(-8).toUpperCase()}
                  </li>
                </ol>
              </nav>
            </div>
            <span className={`badge bg-${cfg.bg} text-${cfg.text} d-flex align-items-center gap-2 px-3 py-2 rounded-pill fs-6`}>
              <i className={`fas ${cfg.icon}`}></i>
              {order.orderStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="container py-4 py-lg-5">
        <div className="row g-4">

          {/* ── Left Column ── */}
          <div className="col-12 col-lg-8 d-flex flex-column gap-4">

            {/* Order Tracking */}
            {!isCancelled && (
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <h6 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                    <i className="fas fa-map-marker-alt text-primary"></i>
                    Order Tracking
                  </h6>
                  <div className="d-flex align-items-start justify-content-between position-relative">
                    {/* Progress line */}
                    <div
                      className="position-absolute bg-light rounded-pill"
                      style={{ top: 20, left: "10%", right: "10%", height: 4, zIndex: 0 }}
                    />
                    <div
                      className="position-absolute bg-primary rounded-pill"
                      style={{
                        top: 20, left: "10%", height: 4, zIndex: 0,
                        width: `${Math.max(0, (currentStep - 1) / 3 * 80)}%`,
                        transition: "width 0.5s ease",
                      }}
                    />
                    {trackingSteps.map(({ label, icon, step }) => {
                      const done = step < currentStep;
                      const active = step === currentStep;
                      return (
                        <div key={step} className="d-flex flex-column align-items-center gap-2 text-center" style={{ zIndex: 1, flex: 1 }}>
                          <div
                            className={`d-flex align-items-center justify-content-center rounded-circle border-3 ${
                              done ? "bg-primary border-primary" : active ? "bg-white border-primary" : "bg-white border-secondary"
                            }`}
                            style={{
                              width: 42, height: 42,
                              border: `3px solid ${done || active ? "#0d6efd" : "#dee2e6"}`,
                              transition: "all 0.3s",
                            }}
                          >
                            <i
                              className={`fas ${done ? "fa-check" : icon}`}
                              style={{ fontSize: "0.85rem", color: done ? "#fff" : active ? "#0d6efd" : "#adb5bd" }}
                            ></i>
                          </div>
                          <span className={`small fw-medium ${active ? "text-primary" : done ? "text-dark" : "text-muted"}`}
                            style={{ fontSize: "0.72rem" }}>
                            {label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Cancelled Banner */}
            {isCancelled && (
              <div className="alert alert-danger d-flex align-items-center gap-3 rounded-4 border-0 shadow-sm">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-10 flex-shrink-0"
                  style={{ width: 48, height: 48 }}
                >
                  <i className="fas fa-times-circle text-danger fs-5"></i>
                </div>
                <div>
                  <p className="fw-bold mb-0">This order has been cancelled</p>
                  <p className="mb-0 small opacity-75">If you were charged, a refund will be processed within 5–7 business days.</p>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-white border-0 px-4 pt-4 pb-2">
                <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                  <i className="fas fa-box text-primary"></i>
                  Order Items
                  <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill ms-1" style={{ fontSize: "0.7rem" }}>
                    {order.items.length}
                  </span>
                </h6>
              </div>
              <div className="card-body px-4 pb-4 pt-2">
                <div className="d-flex flex-column gap-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={item._id}
                      className={`d-flex align-items-center gap-3 ${idx < order.items.length - 1 ? "pb-3 border-bottom" : ""}`}
                    >
                      <img
                        src={item.product?.images?.[0]?.url || "/placeholder.png"}
                        alt={item.product?.name}
                        className="rounded-3 flex-shrink-0 object-fit-cover"
                        style={{ width: 70, height: 70, objectFit: "cover" }}
                      />
                      <div className="flex-grow-1 min-width-0">
                        <p className="fw-semibold text-dark mb-1 text-truncate">{item.product?.name || item.name}</p>
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                        <span
  className="badge rounded-pill small"
  style={{
    backgroundColor: "rgba(108, 117, 125, 0.1)",
    color: "#6c757d"
  }}
>
  Qty: {item.quantity}
</span>
                          <span className="text-muted small">×</span>
                          <span className="text-muted small">₹{item.price} each</span>
                        </div>
                      </div>
                      <span className="fw-bold text-dark flex-shrink-0">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                  <i className="fas fa-map-marker-alt text-primary"></i>
                  Shipping Address
                </h6>
                {(() => {
                  if (!shippingAddress || typeof shippingAddress === "string") {
                    return (
                      <div className="alert alert-warning rounded-3 small d-flex align-items-center gap-2 mb-0">
                        <i className="fas fa-exclamation-triangle"></i>
                        Address details could not be loaded.{" "}
                        <span className="text-muted">Check your backend — <code>shippingAddress</code> needs to be populated in your order query.</span>
                      </div>
                    );
                  }

                  const addr = shippingAddress;
                  const name    = addr.fullName   || addr.name       || addr.recipientName || "—";
                  const line    = addr.addressLine|| addr.address    || addr.street        || addr.line1 || "—";
                  const city    = addr.city       || addr.district   || "";
                  const state   = addr.state      || addr.province   || "";
                  const pin     = addr.pincode    || addr.zipCode    || addr.zip           || addr.postalCode || "";
                  const country = addr.country    || "";
                  const phone   = addr.mobile     || addr.phone      || addr.phoneNumber   || addr.contact || "—";

                  return (
                    <div className="d-flex align-items-start gap-3">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-3 bg-primary bg-opacity-10 flex-shrink-0"
                        style={{ width: 44, height: 44 }}
                      >
                        <i className="fas fa-home text-primary"></i>
                      </div>
                      <div>
                        <p className="fw-semibold text-dark mb-1">{name}</p>
                        <p className="text-muted small mb-1">{line}</p>
                        {(city || state || pin) && (
                          <p className="text-muted small mb-1">
                            {[city, state].filter(Boolean).join(", ")}{pin ? ` — ${pin}` : ""}
                          </p>
                        )}
                        {country && <p className="text-muted small mb-1">{country}</p>}
                        <p className="text-muted small mb-0">
                          <i className="fas fa-phone-alt me-1 text-primary" style={{ fontSize: "0.75rem" }}></i>
                          {phone}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

          </div>

          {/* ── Right Column ── */}
          <div className="col-12 col-lg-4 d-flex flex-column gap-4">

            {/* Order Summary */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden sticky-lg-top" style={{ top: 100 }}>
              <div
                className="card-header border-0 py-3 px-4"
                style={{ background: "linear-gradient(135deg, #0d6efd 0%, #003db5 100%)" }}
              >
                <h6 className="text-white fw-bold mb-0 d-flex align-items-center gap-2">
                  <i className="fas fa-receipt"></i> Payment Summary
                </h6>
              </div>

              <div className="card-body p-4">
                {/* Meta info */}
                <div className="d-flex flex-column gap-2 mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">Order ID</span>
                    <span className="fw-medium small font-monospace">#{order._id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">Date</span>
                    <span className="fw-medium small">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">Payment</span>
                    <span className="badge bg-primary text-white rounded-pill small d-flex align-items-center gap-1">
                      <i className="fas fa-credit-card" style={{ fontSize: "0.65rem" }}></i>
                      {order.paymentMethod || order.payment?.method || order.payment || "—"}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">Items</span>
                    <span className="fw-medium small">{order.items.length}</span>
                  </div>
                </div>

                <hr className="my-3" />

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-muted small">Subtotal</span>
                  <span className="fw-medium">₹{order.totalPrice}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-muted small">Shipping</span>
                  <span className="text-success small fw-medium">
                    <i className="fas fa-check-circle me-1"></i>Free
                  </span>
                </div>

                <hr className="my-3" />

                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Total</span>
                  <span className="fw-bold text-primary fs-5">₹{order.totalPrice}</span>
                </div>
              </div>

              {/* Cancel Section */}
              {canCancel && (
                <div className="card-footer bg-white border-top border-light p-4 pt-0">
                  {!showCancelConfirm ? (
                    <button
                      className="btn btn-outline-danger w-100 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                      onClick={() => setShowCancelConfirm(true)}
                    >
                      <i className="fas fa-times-circle"></i>
                      Cancel Order
                    </button>
                  ) : (
                    <div className="border border-danger rounded-3 p-3 bg-danger bg-opacity-10">
                      <p className="text-danger fw-semibold small mb-1">
                        <i className="fas fa-exclamation-triangle me-1"></i>
                        Cancel this order?
                      </p>
                      <p className="text-muted small mb-3">This action cannot be undone.</p>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-danger btn-sm rounded-3 fw-semibold flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                          onClick={cancelOrder}
                          disabled={cancelling}
                        >
                          {cancelling ? (
                            <span className="spinner-border spinner-border-sm" role="status"></span>
                          ) : (
                            <i className="fas fa-check"></i>
                          )}
                          Yes, Cancel
                        </button>
                        <button
                          className="btn btn-outline-secondary btn-sm rounded-3 fw-semibold flex-grow-1"
                          onClick={() => setShowCancelConfirm(false)}
                          disabled={cancelling}
                        >
                          Keep Order
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Back button */}
            <button
              className="btn btn-outline-primary rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2 w-100"
              onClick={() => navigate("/my-orders")}
            >
              <i className="fas fa-arrow-left"></i>
              Back to My Orders
            </button>

          </div>
        </div>
      </div>
    </>
  );
};

export default SingleOrder;