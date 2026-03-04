import React, { useEffect, useState } from "react";
import API from "../../api-helper/Axioxinstance";
import { Line } from "react-chartjs-2";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const statusConfig = {
  Delivered:  { bg: "success", icon: "fa-check-circle" },
  Shipped:    { bg: "primary", icon: "fa-truck" },
  Processing: { bg: "info",    icon: "fa-cog" },
  Pending:    { bg: "warning", icon: "fa-clock" },
  Cancelled:  { bg: "danger",  icon: "fa-times-circle" },
};

const kpiCards = [
  { key: "totalUsers",    label: "Total Users",    icon: "fa-users",        color: "#0d6efd", bg: "rgba(13,110,253,0.1)",  prefix: "",  suffix: "" },
  { key: "totalProducts", label: "Total Products", icon: "fa-box-open",     color: "#6610f2", bg: "rgba(102,16,242,0.1)", prefix: "",  suffix: "" },
  { key: "totalOrders",   label: "Total Orders",   icon: "fa-receipt",      color: "#fd7e14", bg: "rgba(253,126,20,0.1)", prefix: "",  suffix: "" },
  { key: "totalRevenue",  label: "Total Revenue",  icon: "fa-rupee-sign", color: "#198754", bg: "rgba(25,135,84,0.1)",  prefix: "₹", suffix: "" },
];

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    try {
      const res = await API.get("/admin/dashboard");
      if (res.data.success) {
        const { stats, recentOrders, topProducts, lowStock, weeklySales } = res.data.data;
        setStats(stats);
        setRecentOrders(recentOrders);
        setTopProducts(topProducts);
        setLowStock(lowStock);
        setSalesData(weeklySales);
      }
    } catch (err) {
     console.log(err);
     
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: salesData.map((d) => d.day),
    datasets: [
      {
        label: "Revenue (₹)",
        data: salesData.map((d) => d.amount),
        borderColor: "#0d6efd",
        backgroundColor: "rgba(13,110,253,0.08)",
        borderWidth: 2.5,
        pointBackgroundColor: "#0d6efd",
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#94a3b8",
        bodyColor: "#fff",
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => ` ₹${ctx.raw?.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#94a3b8", font: { size: 11 } } },
      y: { grid: { color: "#f1f5f9" }, ticks: { color: "#94a3b8", font: { size: 11 }, callback: (v) => `₹${v}` } },
    },
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted fw-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-4">

      {/* ── Page Title ── */}
      <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-2">
        <div>
          <h4 className="fw-bold text-dark mb-0">Dashboard</h4>
          <p className="text-muted small mb-0">
            Welcome back! Here's what's happening in your store.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-success text-white rounded-pill px-3 py-2 small fw-medium">
            <i className="fas fa-circle me-1" style={{ fontSize: "0.5rem" }}></i>
            Live
          </span>
          <button className="btn btn-light btn-sm rounded-3 fw-medium d-flex align-items-center gap-2" onClick={loadDashboard}>
            <i className="fas fa-sync-alt" style={{ fontSize: "0.8rem" }}></i>
            Refresh
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="row g-3">
        {kpiCards.map(({ key, label, icon, color, bg, prefix }) => (
          <div key={key} className="col-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3"
                    style={{ width: 44, height: 44, background: bg }}
                  >
                    <i className={`fas ${icon}`} style={{ color, fontSize: "1.1rem" }}></i>
                  </div>
                  <span className="badge rounded-pill" style={{ background: bg, color, fontSize: "0.65rem" }}>
                    <i className="fas fa-arrow-up me-1" style={{ fontSize: "0.6rem" }}></i>+12%
                  </span>
                </div>
                <p className="text-muted small mb-1 fw-medium">{label}</p>
                <h3 className="fw-bold mb-0" style={{ color }}>
                  {prefix}{key === "totalRevenue"
                    ? (stats[key] || 0).toLocaleString()
                    : (stats[key] || 0)}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Chart + Top Products ── */}
      <div className="row g-3">

        {/* Sales Chart */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                  <h6 className="fw-bold text-dark mb-0">Sales Overview</h6>
                  <p className="text-muted mb-0" style={{ fontSize: "0.78rem" }}>Last 7 days revenue</p>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span
                    className="d-inline-block rounded-circle"
                    style={{ width: 10, height: 10, background: "#0d6efd" }}
                  ></span>
                  <span className="text-muted small">Revenue</span>
                </div>
              </div>
              {salesData.length > 0 ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <div className="d-flex align-items-center justify-content-center" style={{ height: 200 }}>
                  <div className="text-center text-muted">
                    <i className="fas fa-chart-line mb-2" style={{ fontSize: "2rem", opacity: 0.3 }}></i>
                    <p className="small mb-0">No sales data available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                  <h6 className="fw-bold text-dark mb-0">Top Products</h6>
                  <p className="text-muted mb-0" style={{ fontSize: "0.78rem" }}>By units sold</p>
                </div>
                <Link to="/admin/product" className="btn btn-light btn-sm rounded-3 text-muted" style={{ fontSize: "0.75rem" }}>
                  View all
                </Link>
              </div>

              {topProducts.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="fas fa-box-open mb-2" style={{ fontSize: "1.8rem", opacity: 0.3 }}></i>
                  <p className="small mb-0">No data available</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {topProducts.map((p, index) => {
                    const maxSold = topProducts[0]?.sold || 1;
                    const pct = Math.round((p.sold / maxSold) * 100);
                    const colors = ["#0d6efd", "#6610f2", "#fd7e14", "#198754", "#dc3545"];
                    return (
                      <div key={p._id}>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <div className="d-flex align-items-center gap-2 min-width-0">
                            <span
                              className="fw-bold flex-shrink-0"
                              style={{ fontSize: "0.72rem", color: colors[index % colors.length] }}
                            >
                              #{index + 1}
                            </span>
                            <span className="text-dark small text-truncate fw-medium">{p.name}</span>
                          </div>
                          <span className="fw-semibold flex-shrink-0 ms-2" style={{ fontSize: "0.78rem", color: colors[index % colors.length] }}>
                            {p.sold} sold
                          </span>
                        </div>
                        <div className="progress rounded-pill" style={{ height: 5 }}>
                          <div
                            className="progress-bar rounded-pill"
                            style={{ width: `${pct}%`, background: colors[index % colors.length], transition: "width 0.6s ease" }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Orders + Low Stock ── */}
      <div className="row g-3">

        {/* Recent Orders */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                  <h6 className="fw-bold text-dark mb-0">Recent Orders</h6>
                  <p className="text-muted mb-0" style={{ fontSize: "0.78rem" }}>Latest customer orders</p>
                </div>
                <Link to="/admin/orders" className="btn btn-light btn-sm rounded-3 text-muted" style={{ fontSize: "0.75rem" }}>
                  View all
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="fas fa-receipt mb-2" style={{ fontSize: "1.8rem", opacity: 0.3 }}></i>
                  <p className="small mb-0">No recent orders</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-borderless align-middle mb-0" style={{ fontSize: "0.85rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
                        <th className="text-muted fw-medium pb-3 ps-0" style={{ fontSize: "0.75rem" }}>CUSTOMER</th>
                        <th className="text-muted fw-medium pb-3" style={{ fontSize: "0.75rem" }}>AMOUNT</th>
                        <th className="text-muted fw-medium pb-3" style={{ fontSize: "0.75rem" }}>STATUS</th>
                        <th className="text-muted fw-medium pb-3 pe-0" style={{ fontSize: "0.75rem" }}>ORDER ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((o) => {
                        const cfg = statusConfig[o.orderStatus] || statusConfig.Pending;
                        return (
                          <tr key={o._id} style={{ borderBottom: "1px solid #f8fafc" }}>
                            <td className="ps-0 py-3">
                              <div className="d-flex align-items-center gap-2">
                                <div
                                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold text-white"
                                  style={{
                                    width: 32, height: 32, fontSize: "0.72rem",
                                    background: "linear-gradient(135deg,#0d6efd,#6610f2)"
                                  }}
                                >
                                  {o.user?.name?.charAt(0).toUpperCase() || "?"}
                                </div>
                                <span className="fw-medium text-truncate" style={{ maxWidth: 120 }}>
                                  {o.user?.name || "Unknown"}
                                </span>
                              </div>
                            </td>
                            <td className="fw-semibold text-dark">₹{o.totalPrice?.toLocaleString()}</td>
                            <td>
                              <span className={`badge bg-${cfg.bg} bg-opacity-10 text-${cfg.bg} rounded-pill d-inline-flex align-items-center gap-1 px-2 py-1`}
                                style={{ fontSize: "0.72rem" }}>
                                <i className={`fas ${cfg.icon}`} style={{ fontSize: "0.6rem" }}></i>
                                {o.orderStatus}
                              </span>
                            </td>
                            <td className="pe-0">
                              <span className="text-muted font-monospace" style={{ fontSize: "0.72rem" }}>
                                #{o._id?.slice(-6).toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                  <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                    Low Stock Alerts
                    {lowStock.length > 0 && (
                      <span className="badge bg-danger rounded-pill" style={{ fontSize: "0.65rem" }}>
                        {lowStock.length}
                      </span>
                    )}
                  </h6>
                  <p className="text-muted mb-0" style={{ fontSize: "0.78rem" }}>Products running low</p>
                </div>
                <Link to="/admin/product" className="btn btn-light btn-sm rounded-3 text-muted" style={{ fontSize: "0.75rem" }}>
                  Manage
                </Link>
              </div>

              {lowStock.length === 0 ? (
                <div className="text-center py-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10 mb-3"
                    style={{ width: 56, height: 56 }}
                  >
                    <i className="fas fa-check-circle text-success fs-4"></i>
                  </div>
                  <p className="fw-semibold text-dark small mb-1">All stocked up!</p>
                  <p className="text-muted" style={{ fontSize: "0.78rem" }}>No low stock products right now.</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {lowStock.map((p) => {
                    const urgency = p.stock <= 3 ? "danger" : p.stock <= 8 ? "warning" : "info";
                    return (
                      <div
                        key={p._id}
                        className={`d-flex align-items-center justify-content-between p-3 rounded-3 bg-${urgency} bg-opacity-10`}
                      >
                        <div className="d-flex align-items-center gap-3 min-width-0">
                          <div
                            className={`d-flex align-items-center justify-content-center rounded-2 bg-${urgency} flex-shrink-0`}
                            style={{ width: 32, height: 32 }}
                          >
                            <i className="fas fa-box text-white" style={{ fontSize: "0.75rem" }}></i>
                          </div>
                          <span className="fw-medium text-dark small text-truncate">{p.name}</span>
                        </div>
                        <span className={`badge bg-${urgency} rounded-pill flex-shrink-0 ms-2`} style={{ fontSize: "0.72rem" }}>
                          {p.stock} left
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}