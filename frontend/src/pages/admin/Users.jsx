import React, { useEffect, useState } from "react";
import API from "../../api-helper/Axioxinstance";
import { toast } from "react-toastify";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/user");
      if (res.data.success) setUsers(res.data.data);
    } catch { toast.error("Failed to fetch users"); }
    finally { setLoading(false); }
  };

  const handleToggleBlock = async (id, isBlocked) => {
    try {
      setTogglingId(id);
      const url = isBlocked ? `/admin/user/unblock/${id}` : `/admin/user/block/${id}`;
      const res = await API.put(url);
      toast.success(res.data.message || (isBlocked ? "User unblocked" : "User blocked"));
      loadUsers();
    } catch { toast.error("Block/Unblock failed"); }
    finally { setTogglingId(null); }
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter ? u.role === roleFilter : true;
    return matchSearch && matchRole;
  });

  const roles = [...new Set(users.map((u) => u.role).filter(Boolean))];

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "50vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }} />
          <p className="text-muted fw-medium">Loading users...</p>
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
            <i className="fas fa-users text-primary"></i> User Management
          </h4>
          <p className="text-muted small mb-0">
            {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <button className="btn btn-light btn-sm rounded-3 px-3 fw-medium d-flex align-items-center gap-2" onClick={loadUsers}>
          <i className="fas fa-sync-alt" style={{ fontSize: "0.8rem" }}></i> Refresh
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="row g-3">
        {[
          { label: "Total Users",    value: users.length,                                        icon: "fa-users",        color: "#0d6efd", bg: "rgba(13,110,253,0.1)" },
          { label: "Active",         value: users.filter((u) => u.isActive).length,              icon: "fa-check-circle", color: "#198754", bg: "rgba(25,135,84,0.1)" },
          { label: "Blocked",        value: users.filter((u) => u.isBlocked).length,             icon: "fa-ban",          color: "#dc3545", bg: "rgba(220,53,69,0.1)" },
          { label: "Admins",         value: users.filter((u) => u.role === "admin").length,      icon: "fa-user-shield",  color: "#6610f2", bg: "rgba(102,16,242,0.1)" },
        ].map(({ label, value, icon, color, bg }) => (
          <div key={label} className="col-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-3 p-md-4 d-flex align-items-center gap-3">
                <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                  style={{ width: 44, height: 44, background: bg }}>
                  <i className={"fas " + icon} style={{ color, fontSize: "1.1rem" }}></i>
                </div>
                <div>
                  <p className="text-muted small mb-0 fw-medium">{label}</p>
                  <h4 className="fw-bold mb-0" style={{ color }}>{value}</h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-3 p-md-4">
          <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center gap-3">

            {/* Search */}
            <div className="input-group" style={{ maxWidth: 360 }}>
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="fas fa-search" style={{ fontSize: "0.85rem" }}></i>
              </span>
              <input type="text" className="form-control bg-light border-start-0"
                placeholder="Search by name or email..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              {searchTerm && (
                <button className="input-group-text bg-light border-start-0 text-muted border"
                  onClick={() => setSearchTerm("")}>
                  <i className="fas fa-times" style={{ fontSize: "0.8rem" }}></i>
                </button>
              )}
            </div>

            {/* Role filter */}
            <div className="input-group" style={{ maxWidth: 200 }}>
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="fas fa-filter" style={{ fontSize: "0.85rem" }}></i>
              </span>
              <select className="form-select bg-light border-start-0"
                value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="">All Roles</option>
                {roles.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Quick filters */}
            <div className="d-flex gap-2 ms-md-auto flex-wrap">
              <button
                className={"btn btn-sm rounded-pill px-3 fw-medium " + (roleFilter === "" && searchTerm === "" ? "btn-primary" : "btn-outline-secondary")}
                onClick={() => { setSearchTerm(""); setRoleFilter(""); }}
                style={{ fontSize: "0.78rem" }}>
                All
              </button>
              <button
                className={"btn btn-sm rounded-pill px-3 fw-medium " + (roleFilter === "admin" ? "btn-primary" : "btn-outline-primary")}
                onClick={() => setRoleFilter(roleFilter === "admin" ? "" : "admin")}
                style={{ fontSize: "0.78rem" }}>
                <i className="fas fa-user-shield me-1" style={{ fontSize: "0.7rem" }}></i>
                Admins
              </button>
              <button
                className={"btn btn-sm rounded-pill px-3 fw-medium " + (roleFilter === "user" ? "btn-danger" : "btn-outline-danger")}
                onClick={() => setRoleFilter(roleFilter === "user" ? "" : "user")}
                style={{ fontSize: "0.78rem" }}>
                <i className="fas fa-ban me-1" style={{ fontSize: "0.7rem" }}></i>
                Users
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Empty State ── */}
      {filteredUsers.length === 0 && (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body py-5 text-center">
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mb-3"
              style={{ width: 72, height: 72 }}>
              <i className="fas fa-users text-primary" style={{ fontSize: "1.8rem" }}></i>
            </div>
            <h6 className="fw-bold text-dark mb-1">No users found</h6>
            <p className="text-muted small mb-3">
              {searchTerm || roleFilter ? "Try adjusting your search or filters." : "No users registered yet."}
            </p>
            {(searchTerm || roleFilter) && (
              <button className="btn btn-outline-secondary rounded-pill px-4"
                onClick={() => { setSearchTerm(""); setRoleFilter(""); }}>
                <i className="fas fa-times me-2"></i>Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Table ── */}
      {filteredUsers.length > 0 && (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-borderless align-middle mb-0" style={{ fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #f1f5f9" }}>
                  {["#", "USER", "EMAIL", "PHONE", "ROLE", "ACCOUNT", "BLOCKED", "ACTIONS"].map((h) => (
                    <th key={h}
                      className={"py-3 text-muted fw-medium " + (h === "#" ? "px-4 " : "") + (h === "ACTIONS" ? "pe-4 text-end" : "")}
                      style={{ fontSize: "0.72rem", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, i) => (
                  <tr key={u._id}
                    style={{ borderBottom: "1px solid #f8fafc", transition: "background 0.15s", opacity: togglingId === u._id ? 0.6 : 1 }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fafbff"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}>

                    {/* # */}
                    <td className="px-4 text-muted" style={{ fontSize: "0.78rem" }}>{i + 1}</td>

                    {/* User avatar + name */}
                    <td className="py-3">
                      <div className="d-flex align-items-center gap-3">
                        {u.avatar?.url ? (
                          <img src={u.avatar.url} alt={u.name}
                            className="rounded-circle flex-shrink-0"
                            style={{ width: 38, height: 38, objectFit: "cover" }} />
                        ) : (
                          <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                            style={{ width: 38, height: 38, fontSize: "0.85rem", background: "linear-gradient(135deg,#0d6efd,#6610f2)" }}>
                            {u.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                        )}
                        <span className="fw-semibold text-dark">{u.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="text-muted small">{u.email}</td>

                    {/* Phone */}
                    <td className="text-muted small">{u.phone || <em className="opacity-50">—</em>}</td>

                    {/* Role */}
                    <td>
                      <span className={"badge rounded-pill px-2 py-1 " + (u.role === "admin" ? "bg-primary" : "bg-secondary")}
                        style={{ fontSize: "0.72rem" }}>
                        <i className={"fas me-1 " + (u.role === "admin" ? "fa-user-shield" : "fa-user")} style={{ fontSize: "0.6rem" }}></i>
                        {u.role}
                      </span>
                    </td>

                    {/* Account status */}
                    <td>
                      <span className={"badge rounded-pill px-2 py-1 " + (u.isActive ? "bg-success" : "bg-secondary")}
                        style={{ fontSize: "0.72rem" }}>
                        <i className={"fas me-1 " + (u.isActive ? "fa-check-circle" : "fa-times-circle")} style={{ fontSize: "0.6rem" }}></i>
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Blocked */}
                    <td>
                      <span className={"badge rounded-pill px-2 py-1 " + (u.isBlocked ? "bg-danger" : "bg-success")}
                        style={{ fontSize: "0.72rem" }}>
                        <i className={"fas me-1 " + (u.isBlocked ? "fa-ban" : "fa-check")} style={{ fontSize: "0.6rem" }}></i>
                        {u.isBlocked ? "Blocked" : "OK"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="pe-4 text-end">
                      <div className="d-flex align-items-center justify-content-end gap-2">
                        {togglingId === u._id ? (
                          <span className="spinner-border spinner-border-sm text-primary" role="status"></span>
                        ) : (
                          <button
                            className={"btn btn-sm rounded-3 px-3 fw-medium d-flex align-items-center gap-1 " + (u.isBlocked ? "btn-outline-success" : "btn-outline-warning")}
                            onClick={() => handleToggleBlock(u._id, u.isBlocked)}>
                            <i className={"fas " + (u.isBlocked ? "fa-unlock" : "fa-ban")} style={{ fontSize: "0.7rem" }}></i>
                            {u.isBlocked ? "Unblock" : "Block"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}