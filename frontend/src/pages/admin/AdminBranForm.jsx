import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api-helper/Axioxinstance";

export default function BrandForm() {
  const [brand, setBrand] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { brandId } = useParams();

  useEffect(() => {
    if (brandId) {
      API.get(`/brand/${brandId}`)
        .then((res) => {
          const data = res.data.data || res.data;
          console.log("Fetched brand data:", data);
          setBrand({
            name: data.name || "",
            description: data.description || "",
            image: data.logo?.url || data.image || "",
          });
          setPreview(data.logo?.url || data.image || "");
        })
        .catch((err) => {
          console.error("Error fetching brand:", err);
          setError("Failed to load brand details.");
        });
    }
  }, [brandId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBrand({ ...brand, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBrand({ ...brand, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", brand.name);
      formData.append("description", brand.description);
      if (brand.image instanceof File) {
        formData.append("image", brand.image);
      }

      if (brandId) {
        await API.put(`/brand/${brandId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await API.post("/brand", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigate("/admin/brand");
    } catch (err) {
      console.error("Error saving brand:", err);
      setError("Something went wrong while saving the brand.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h3 className="text-center mb-4">
        {brandId ? "Edit Brand" : "Add New Brand"}
      </h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Brand Name</label>
          <input
            type="text"
            name="name"
            value={brand.name}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter brand name"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={brand.description}
            onChange={handleChange}
            className="form-control"
            rows="3"
            placeholder="Enter short description"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Brand Image</label>
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
          {loading ? "Saving..." : brandId ? "Update Brand" : "Add Brand"}
        </button>
      </form>
    </div>
  );
}
