import React, { useEffect, useState } from "react";
import API from "../../api-helper/Axioxinstance";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await API.get("/admin/user");
      console.log("Users:", res.data);

      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const handleToggleBlock = async (id) => {
    try {
      const res = await API.put(`/admin/user/block/${id}`);
      alert(res.data.message);

      // reload user list
      loadUsers();
    } catch (err) {
      console.error("Block toggle failed", err);
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="fw-bold mb-3">Users</h4>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Blocked?</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center fw-bold">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u, i) => (
                <tr key={u._id}>
                  <td>{i + 1}</td>

                  <td>
                    <img
                      src={u.avatar?.url || "https://via.placeholder.com/40"}
                      width="40"
                      height="40"
                      className="rounded-circle"
                      alt="avatar"
                    />
                  </td>

                  <td>{u.name}</td>

                  <td>{u.email}</td>

                  <td>{u.phone || "-"}</td>

                  <td className="fw-bold">{u.role}</td>

                  <td>
                    {u.isActive ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-secondary">Inactive</span>
                    )}
                  </td>

                  <td>
                    {u.isBlocked ? (
                      <span className="badge bg-danger">Blocked</span>
                    ) : (
                      <span className="badge bg-primary">OK</span>
                    )}
                  </td>

                  <td>
                    {/* Block/Unblock */}
                    <button
                      className={`btn btn-sm ${
                        u.isBlocked ? "btn-success" : "btn-warning"
                      } me-2`}
                      onClick={() => handleToggleBlock(u._id)}
                    >
                      {u.isBlocked ? "Unblock" : "Block"}
                    </button>

                    {/* Edit User */}
                    <button className="btn btn-primary btn-sm me-2">
                      Edit
                    </button>

                    {/* Delete User */}
                    <button className="btn btn-danger btn-sm">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
