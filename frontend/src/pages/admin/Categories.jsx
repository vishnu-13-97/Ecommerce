import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api-helper/Axioxinstance";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch all categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/category");
      const data = res.data.data || res.data;
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await API.delete(`/category/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Failed to delete category.");
    }
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredCategories = categories.filter((c) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="row mb-3 align-items-center">
        <div className="col-md-6">
          <h4 className="fw-bold">Category Management</h4>
        </div>
        <div className="col-md-6 text-end">
          <button
            className="btn btn-success"
            onClick={() => navigate("/admin/category/new")}
          >
            + Add Category
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search category..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Error or Loading */}
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="text-center">Loading...</div>}

      {/* Category Table */}
      {!loading && (
        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category, index) => (
                  <tr key={category._id || category.id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={category.image?.url || category.image || "https://via.placeholder.com/60"}
                        alt={category.name}
                        width="50"
                        height="50"
                        className="rounded"
                      />
                    </td>
                    <td>{category.name}</td>
                    <td>{category.description}</td>
                    <td>
                      <span
                        className={`badge ${
                          category.isActive ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => navigate(`/admin/category/edit/${category._id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(category._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-muted">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
