import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api-helper/Axioxinstance";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch products from backend
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/product");
      const data = res.data.data || res.data;
       console.log("ppp",data);
       
      // Flatten or map backend data for UI display
      const formatted = data.map((p) => ({
        id: p._id,
        name: p.name,
        category: p.category?.name || "N/A",
        brand: p.brand?.name || "N/A",
        price: p.price,
        stock: p.stock,
        status: p.isActive ? "Active" : "Inactive",
        image:
          p.images?.[0]?.url ||
          "https://via.placeholder.com/60?text=No+Image",
      }));
console.log("ghb",formatted);

      setProducts(formatted);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`/product/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product. Please try again.");
    }
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      {/* Header Row */}
      <div className="row mb-3 align-items-center">
        <div className="col-md-6">
          <h4 className="fw-bold">Product List</h4>
        </div>
        <div className="col-md-6 text-end">
          <button
            className="btn btn-success"
            onClick={() => navigate("/admin/product/new")}
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search product..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Error / Loading */}
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="text-center">Loading...</div>}

      {/* Table */}
      {!loading && (
        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price (₹)</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <tr key={product.id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={product.image}
                        alt={product.name}
                        width="50"
                        height="50"
                        className="rounded"
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td>{product.price?.toLocaleString()}</td>
                    <td>{product.stock}</td>
                    <td>
                      <span
                        className={`badge ${
                          product.status === "Active"
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => navigate(`/admin/product/edit/${product.id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-muted">
                    No products found
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
