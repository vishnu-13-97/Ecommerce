import React, { useEffect, useState } from "react";
import API from "../api-helper/Axioxinstance";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const statusConfig = {
  Pending:    { bg: "warning",  text: "dark",  icon: "fa-clock" },
  Processing: { bg: "info",     text: "white", icon: "fa-cog" },
  Shipped:    { bg: "primary",  text: "white", icon: "fa-truck" },
  Delivered:  { bg: "success",  text: "white", icon: "fa-check-circle" },
  Cancelled:  { bg: "danger",   text: "white", icon: "fa-times-circle" },
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("desc");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [page, status, sort, startDate, endDate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/user/orders", {
        params: { page, limit: 5, status, sort, startDate, endDate },
        withCredentials: true,
      });
      setOrders(res.data.orders || []);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setStatus(""); setSort("desc");
    setStartDate(""); setEndDate(""); setPage(1);
  };

  const hasActiveFilters = status || startDate || endDate || sort !== "desc";

  // ── Loading ──
  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted fw-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

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
                <i className="fas fa-box-open"></i> My Orders
              </h2>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/" className="text-white-50 text-decoration-none">Home</Link>
                  </li>
                  <li className="breadcrumb-item active text-white">My Orders</li>
                </ol>
              </nav>
            </div>
            {orders.length > 0 && (
              <span className="badge bg-white text-primary fw-semibold px-3 py-2 rounded-pill fs-6">
                {orders.length} order{orders.length !== 1 ? "s" : ""} found
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="container py-4 py-lg-5">

        {/* ── Filter Card ── */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-3 p-md-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="fas fa-filter text-primary"></i>
              <h6 className="fw-semibold mb-0 text-dark">Filter Orders</h6>
              {hasActiveFilters && (
                <span className="badge bg-primary rounded-pill ms-1" style={{ fontSize: "0.68rem" }}>
                  Active
                </span>
              )}
            </div>

            <div className="row g-3 align-items-end">

              {/* Status */}
              <div className="col-6 col-md-3">
                <label className="form-label text-muted small mb-1 fw-medium">Status</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted">
                    <i className="fas fa-tag" style={{ fontSize: "0.8rem" }}></i>
                  </span>
                  <select
                    className="form-select border-start-0"
                    value={status}
                    onChange={(e) => { setPage(1); setStatus(e.target.value); }}
                  >
                    <option value="">All Status</option>
                    {Object.keys(statusConfig).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sort */}
              <div className="col-6 col-md-2">
                <label className="form-label text-muted small mb-1 fw-medium">Sort</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted">
                    <i className="fas fa-sort" style={{ fontSize: "0.8rem" }}></i>
                  </span>
                  <select
                    className="form-select border-start-0"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="desc">Newest</option>
                    <option value="asc">Oldest</option>
                  </select>
                </div>
              </div>

              {/* Start Date */}
              <div className="col-6 col-md-2">
                <label className="form-label text-muted small mb-1 fw-medium">From</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted">
                    <i className="fas fa-calendar" style={{ fontSize: "0.8rem" }}></i>
                  </span>
                  <input
                    type="date"
                    className="form-control border-start-0"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>

              {/* End Date */}
              <div className="col-6 col-md-2">
                <label className="form-label text-muted small mb-1 fw-medium">To</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted">
                    <i className="fas fa-calendar-check" style={{ fontSize: "0.8rem" }}></i>
                  </span>
                  <input
                    type="date"
                    className="form-control border-start-0"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="col-12 col-md-3 d-flex gap-2">
                <button
                  className="btn btn-primary rounded-3 fw-semibold flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => setPage(1)}
                >
                  <i className="fas fa-search" style={{ fontSize: "0.8rem" }}></i>
                  Apply
                </button>
                <button
                  className={`btn rounded-3 fw-semibold flex-grow-1 d-flex align-items-center justify-content-center gap-2 ${hasActiveFilters ? "btn-outline-danger" : "btn-outline-secondary"}`}
                  onClick={resetFilters}
                >
                  <i className="fas fa-times" style={{ fontSize: "0.8rem" }}></i>
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Empty State ── */}
        {orders.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body py-5 text-center">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mb-4"
                style={{ width: 80, height: 80 }}
              >
                <i className="fas fa-box-open text-primary" style={{ fontSize: "2rem" }}></i>
              </div>
              <h5 className="fw-bold text-dark mb-2">No orders found</h5>
              <p className="text-muted small mb-4">
                {hasActiveFilters
                  ? "No orders match your current filters. Try adjusting them."
                  : "You haven't placed any orders yet. Start shopping!"}
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                {hasActiveFilters && (
                  <button className="btn btn-outline-secondary rounded-pill px-4" onClick={resetFilters}>
                    <i className="fas fa-times me-2"></i>Clear Filters
                  </button>
                )}
                <button className="btn btn-primary rounded-pill px-4" onClick={() => navigate("/shop")}>
                  <i className="fas fa-store me-2"></i>Browse Shop
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {orders.map((order) => {
              const cfg = statusConfig[order.orderStatus] || statusConfig.Pending;
              return (
                <div
                  key={order._id}
                  className="card border-0 shadow-sm rounded-4 overflow-hidden"
                  style={{ cursor: "pointer", transition: "box-shadow 0.2s, transform 0.2s" }}
                  onClick={() => navigate(`/my-orders/${order._id}`)}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = ""; e.currentTarget.style.transform = ""; }}
                >
                  {/* Card Header */}
                  <div className="card-header bg-light border-0 px-4 py-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
                    <div className="d-flex align-items-center gap-3 flex-wrap">
                      <div>
                        <span className="text-muted small fw-medium">Order ID</span>
                        <p className="mb-0 fw-semibold text-dark small font-monospace">
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                      <div className="vr d-none d-sm-block"></div>
                      <div>
                        <span className="text-muted small fw-medium">Placed on</span>
                        <p className="mb-0 fw-semibold text-dark small">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric"
                          })}
                        </p>
                      </div>
                      <div className="vr d-none d-sm-block"></div>
                      <div>
                        <span className="text-muted small fw-medium">Items</span>
                        <p className="mb-0 fw-semibold text-dark small">{order.items.length}</p>
                      </div>
                    </div>

                    <span className={`badge bg-${cfg.bg} text-${cfg.text} d-flex align-items-center gap-1 px-3 py-2 rounded-pill`}>
                      <i className={`fas ${cfg.icon}`} style={{ fontSize: "0.7rem" }}></i>
                      {order.orderStatus}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="card-body px-4 py-3">
                    <div className="d-flex flex-column gap-2">
                      {order.items.map((item) => (
                        <div
                          key={item._id}
                          className="d-flex justify-content-between align-items-center py-2 border-bottom border-light"
                        >
                          <div className="d-flex align-items-center gap-3">
                            {item.product?.images?.[0]?.url && (
                              <img
                                src={item.product.images[0].url}
                                alt={item.product?.name}
                                className="rounded-2 object-fit-cover flex-shrink-0"
                                style={{ width: 40, height: 40, objectFit: "cover" }}
                              />
                            )}
                            <div>
                              <p className="mb-0 fw-medium text-dark small">{item.product?.name}</p>
                              <span className="badge bg-secondary bg-opacity-10 text-white rounded-pill" style={{ fontSize: "0.68rem" }}>
                                Qty: {item.quantity}
                              </span>
                            </div>
                          </div>
                          <span className="fw-semibold text-dark small">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="card-footer bg-white border-0 px-4 py-3 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2 text-muted small">
                      <i className="fas fa-info-circle text-primary"></i>
                      Click to view full details
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-muted small">Total</span>
                      <span className="fw-bold text-primary fs-6">₹{order.totalPrice}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <nav className="mt-4" aria-label="Orders pagination">
            <ul className="pagination justify-content-center gap-1 mb-0">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button className="page-link rounded-3 border-0 shadow-sm px-3" onClick={() => setPage(page - 1)}>
                  <i className="fas fa-chevron-left small"></i>
                </button>
              </li>

              {[...Array(totalPages)].map((_, i) => (
                <li key={i} className={`page-item ${page === i + 1 ? "active" : ""}`}>
                  <button
                    className="page-link rounded-3 border-0 shadow-sm fw-semibold"
                    style={{ width: 40 }}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}

              <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                <button className="page-link rounded-3 border-0 shadow-sm px-3" onClick={() => setPage(page + 1)}>
                  <i className="fas fa-chevron-right small"></i>
                </button>
              </li>
            </ul>
            <p className="text-center text-muted small mt-2">
              Page {page} of {totalPages}
            </p>
          </nav>
        )}

      </div>
    </>
  );
};

export default MyOrders;