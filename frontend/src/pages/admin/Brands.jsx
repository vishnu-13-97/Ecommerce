import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api-helper/Axioxinstance";

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch brands from backend
useEffect(() => {
  const fetchBrands = async () => {
    try {
      const res = await API.get("/brand");
      console.log("API Response:", res.data);
      setBrands(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
    }
  };
  fetchBrands();
}, []);


  // ✅ Delete brand (frontend-only simulation for now)
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      try {
        await API.delete(`/brand/${id}`);
        setBrands((prev) => prev.filter((b) => b._id !== id));
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  // ✅ Search filter
  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="row mb-3 align-items-center">
        <div className="col-md-6">
          <h4 className="fw-bold">Brand Management</h4>
        </div>
        <div className="col-md-6 text-end">
          <button
            className="btn btn-success"
            onClick={() => navigate("/admin/brand/new")}
          >
            + Add Brand
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle text-center">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Logo</th>
              <th>Name</th>
           
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBrands.length > 0 ? (
              filteredBrands.map((brand, index) => (
                <tr key={brand._id}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={
                        brand.logo?.url ||
                        "https://via.placeholder.com/60?text=No+Logo"
                      }
                      alt={brand.name}
                      width="50"
                      height="50"
                      className="rounded"
                    />
                  </td>
                  <td>{brand.name}</td>
             
                  <td>{brand.description || "-"}</td>
                  <td>
                    <span
                      className={`badge ${
                        brand.isActive ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {brand.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => navigate(`/admin/brand/edit/${brand._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(brand._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-muted">
                  No brands found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
