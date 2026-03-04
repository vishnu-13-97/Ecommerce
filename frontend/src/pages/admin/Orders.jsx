import { useEffect, useState } from "react";
import API from "../../api-helper/Axioxinstance";
import { toast } from "react-toastify";

const validStatuses = ["Pending","Processing","Shipped","Out for Delivery","Delivered","Cancelled"];

const statusConfig = {
  Pending:           { bg: "secondary", icon: "fa-clock" },
  Processing:        { bg: "info",      icon: "fa-cog" },
  Shipped:           { bg: "primary",   icon: "fa-truck" },
  "Out for Delivery":{ bg: "warning",   icon: "fa-map-marker-alt" },
  Delivered:         { bg: "success",   icon: "fa-check-circle" },
  Cancelled:         { bg: "danger",    icon: "fa-times-circle" },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/orders", {
        params: { page, status: statusFilter || undefined },
      });
      if (res.data.success) {
        setOrders(res.data.orders);
        setTotalPages(res.data.totalPages);
      }
    } catch { toast.error("Failed to load orders"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [page, statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    const previous = [...orders];
    setOrders(orders.map((o) => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
    setUpdatingId(orderId);
    try {
      const res = await API.put(`/admin/orders/${orderId}`, { status: newStatus });
      if (!res.data.success) throw new Error(res.data.message);
      toast.success(`Order updated to ${newStatus}`);
    } catch (err) {
      setOrders(previous);
      toast.error(err.response?.data?.message || "Failed to update order status");
    } finally { setUpdatingId(null); }
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "50vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }} />
          <p className="text-muted fw-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-4">

      {/* ── Page Header ── */}
      <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3">
        <div>
          <h4 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <i className="fas fa-receipt text-primary"></i> Order Management
          </h4>
          <p className="text-muted small mb-0">
            {orders.length} order{orders.length !== 1 ? "s" : ""} on this page
          </p>
        </div>
        <button className="btn btn-light btn-sm rounded-3 px-3 d-flex align-items-center gap-2 fw-medium" onClick={fetchOrders}>
          <i className="fas fa-sync-alt" style={{ fontSize: "0.8rem" }}></i> Refresh
        </button>
      </div>

      {/* ── Toolbar ── */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-3 p-md-4">
          <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-3">

            {/* Status filter */}
            <div className="input-group" style={{ maxWidth: 260 }}>
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="fas fa-filter" style={{ fontSize: "0.85rem" }}></i>
              </span>
              <select
                className="form-select bg-light border-start-0"
                value={statusFilter}
                onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}
              >
                <option value="">All Orders</option>
                {validStatuses.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Status count pills */}
            <div className="d-flex flex-wrap gap-2 ms-sm-auto">
              {[
                { label: "Pending",   bg: "warning", text: "dark" },
                { label: "Delivered", bg: "success", text: "white" },
                { label: "Cancelled", bg: "danger",  text: "white" },
              ].map(({ label, bg}) => (
                <button
                  key={label}
                  className={"btn btn-sm rounded-pill px-3 fw-medium " + (statusFilter === label ? `btn-${bg}` : `btn-outline-${bg}`)}
                  onClick={() => { setPage(1); setStatusFilter(statusFilter === label ? "" : label); }}
                  style={{ fontSize: "0.78rem" }}
                >
                  {orders.filter((o) => o.orderStatus === label).length} {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">

        {orders.length === 0 ? (
          <div className="card-body py-5 text-center">
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mb-3"
              style={{ width: 72, height: 72 }}>
              <i className="fas fa-receipt text-primary" style={{ fontSize: "1.8rem" }}></i>
            </div>
            <h6 className="fw-bold text-dark mb-1">No orders found</h6>
            <p className="text-muted small mb-3">
              {statusFilter ? `No orders with status "${statusFilter}".` : "No orders placed yet."}
            </p>
            {statusFilter && (
              <button className="btn btn-outline-secondary rounded-pill px-4 small" onClick={() => setStatusFilter("")}>
                <i className="fas fa-times me-2"></i>Clear Filter
              </button>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-borderless align-middle mb-0" style={{ fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #f1f5f9" }}>
                  {["#", "CUSTOMER", "ORDER ID", "TOTAL", "STATUS", "UPDATE STATUS", "DATE"].map((h) => (
                    <th key={h}
                      className={"py-3 text-muted fw-medium " + (h === "#" ? "px-4" : "")}
                      style={{ fontSize: "0.72rem", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => {
                  const cfg = statusConfig[order.orderStatus] || statusConfig.Pending;
                  const isLocked = order.orderStatus === "Delivered" || order.orderStatus === "Cancelled";
                  return (
                    <tr key={order._id}
                      style={{ borderBottom: "1px solid #f8fafc", transition: "background 0.15s", opacity: updatingId === order._id ? 0.6 : 1 }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fafbff"}
                      onMouseLeave={e => e.currentTarget.style.background = ""}>

                      {/* # */}
                      <td className="px-4 text-muted" style={{ fontSize: "0.78rem" }}>
                        {(page - 1) * 10 + index + 1}
                      </td>

                      {/* Customer */}
                      <td className="py-3">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                            style={{ width: 36, height: 36, fontSize: "0.8rem", background: "linear-gradient(135deg,#0d6efd,#6610f2)" }}
                          >
                            {order.user?.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="fw-semibold text-dark mb-0 small">{order.user?.name || "Unknown"}</p>
                            <p className="text-muted mb-0" style={{ fontSize: "0.72rem" }}>{order.user?.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Order ID */}
                      <td>
                        <span className="text-muted font-monospace" style={{ fontSize: "0.72rem" }}>
                          #{order._id?.slice(-8).toUpperCase()}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="fw-bold text-dark">₹{order.totalPrice?.toLocaleString()}</td>

                      {/* Status badge */}
                      <td>
                        <span className={`badge bg-${cfg.bg} text-white rounded-pill d-inline-flex align-items-center gap-1 px-2 py-1`}
                          style={{ fontSize: "0.72rem" }}>
                          <i className={`fas ${cfg.icon}`} style={{ fontSize: "0.6rem" }}></i>
                          {order.orderStatus}
                        </span>
                      </td>

                      {/* Update dropdown */}
                      <td>
                        {isLocked ? (
                          <span className="text-muted small d-flex align-items-center gap-1">
                            <i className="fas fa-lock" style={{ fontSize: "0.7rem" }}></i> Locked
                          </span>
                        ) : updatingId === order._id ? (
                          <span className="spinner-border spinner-border-sm text-primary" role="status"></span>
                        ) : (
                          <div className="input-group input-group-sm" style={{ minWidth: 160 }}>
                            <span className="input-group-text bg-light border-end-0 text-muted">
                              <i className="fas fa-pen" style={{ fontSize: "0.65rem" }}></i>
                            </span>
                            <select
                              className="form-select form-select-sm bg-light border-start-0"
                              value={order.orderStatus}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            >
                              {validStatuses.map((s) => <option key={s}>{s}</option>)}
                            </select>
                          </div>
                        )}
                      </td>

                      {/* Date */}
                      <td className="text-muted" style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                        <i className="fas fa-calendar-alt me-1" style={{ fontSize: "0.65rem" }}></i>
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <nav aria-label="Orders pagination">
          <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2">
            <p className="text-muted small mb-0">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </p>
            <ul className="pagination pagination-sm mb-0 gap-1">
              <li className={"page-item " + (page === 1 ? "disabled" : "")}>
                <button className="page-link rounded-3 border-0 shadow-sm px-3" onClick={() => setPage(page - 1)}>
                  <i className="fas fa-chevron-left small"></i>
                </button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li key={i} className={"page-item " + (page === i + 1 ? "active" : "")}>
                  <button className="page-link rounded-3 border-0 shadow-sm fw-semibold"
                    style={{ width: 36 }} onClick={() => setPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={"page-item " + (page === totalPages ? "disabled" : "")}>
                <button className="page-link rounded-3 border-0 shadow-sm px-3" onClick={() => setPage(page + 1)}>
                  <i className="fas fa-chevron-right small"></i>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      )}

    </div>
  );
}