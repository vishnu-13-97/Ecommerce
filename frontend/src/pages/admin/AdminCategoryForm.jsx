import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api-helper/Axioxinstance";

export default function CategoryForm() {
  const [category, setCategory] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { categoryId } = useParams();

  // Fetch category if editing
  useEffect(() => {
    if (categoryId) {
      API.get(`/category/${categoryId}`)
        .then((res) => {
          const data = res.data.data || res.data;
          console.log("Fetched category data:", data);
          setCategory({
            name: data.name || "",
            description: data.description || "",
            image: data.image?.url || data.image || "",
          });
          setPreview(data.image?.url || data.image || "");
        })
        .catch((err) => {
          console.error("Error fetching category:", err);
          setError("Failed to load category details.");
        });
    }
  }, [categoryId]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategory({ ...category, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", category.name);
      formData.append("description", category.description);
      if (category.image instanceof File) {
        formData.append("image", category.image);
      }

      if (categoryId) {
        // Update existing category
        await API.put(`/category/${categoryId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Create new category
        await API.post("/category", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigate("/admin/category");
    } catch (err) {
      console.error("Error saving category:", err);
      setError("Something went wrong while saving the category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h3 className="text-center mb-4">
        {categoryId ? "Edit Category" : "Add New Category"}
      </h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Category Name</label>
          <input
            type="text"
            name="name"
            value={category.name}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter category name"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={category.description}
            onChange={handleChange}
            className="form-control"
            rows="3"
            placeholder="Enter short description"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="form-control"
          />
        </div>

        {preview && (
          <div className="mb-3 text-center">
            <img
              src={preview}
              alt="Preview"
              className="img-thumbnail"
              style={{ maxWidth: "200px", borderRadius: "8px" }}
            />
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : categoryId
            ? "Update Category"
            : "Add Category"}
        </button>
      </form>
    </div>
  );
}
