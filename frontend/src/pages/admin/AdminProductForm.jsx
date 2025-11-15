import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api-helper/Axioxinstance";

export default function ProductForm() {
  const [product, setProduct] = useState({
    name: "",
    type: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    brand: "",
    images: [],
  });

  const [preview, setPreview] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { productId } = useParams();

  // Fetch dropdown values (CATEGORY + BRAND)
  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchCategories = async () => {
    const res = await API.get("/category");
    setCategories(res.data.data || res.data);
  };

  const fetchBrands = async () => {
    const res = await API.get("/brand");
    setBrands(res.data.data || res.data);
  };

  // Fetch product in edit mode
  useEffect(() => {
    if (productId) {
      API.get(`/product/${productId}`)
        .then((res) => {
          const data = res.data.product || res.data.data;
console.log("data",data);

          setProduct({
            name: data.name,
            type: data.type,
            description: data.description,
            price: data.price,
            stock: data.stock,
            category: data.category?._id,
            brand: data.brand?._id,
            images: [], // user will upload new files
          });

          // preview existing images
          setPreview(data.images?.map((img) => img.url) || []);
        })
        .catch((err) => console.error("Error fetching product:", err));
    }
  }, [productId]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProduct({ ...product, images: files });
    setPreview(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("name", product.name);
      fd.append("type", product.type);
      fd.append("description", product.description);
      fd.append("price", product.price);
      fd.append("stock", product.stock);
      fd.append("category", product.category);
      fd.append("brand", product.brand);

      // Images
      if (product.images.length > 0) {
        product.images.forEach((img) => fd.append("images", img));
      }

      if (productId) {
        await API.put(`/product/${productId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await API.post(`/product`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigate("/admin/product");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "700px" }}>
      <h3 className="text-center mb-3">
        {productId ? "Edit Product" : "Add New Product"}
      </h3>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
      
        <input
          className="form-control mb-3"
          placeholder="Product Name"
          name="name"
          value={product.name}
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-3"
          placeholder="Type"
          name="type"
          value={product.type}
          onChange={handleChange}
          required
        />

        <textarea
          className="form-control mb-3"
          placeholder="Description"
          name="description"
          value={product.description}
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-3"
          type="number"
          placeholder="Price"
          name="price"
          value={product.price}
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-3"
          type="number"
          placeholder="Stock"
          name="stock"
          value={product.stock}
          onChange={handleChange}
          required
        />

        {/* Category Dropdown */}
        <select
          className="form-control mb-3"
          name="category"
          value={product.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Brand Dropdown */}
        <select
          className="form-control mb-3"
          name="brand"
          value={product.brand}
          onChange={handleChange}
          required
        >
          <option value="">Select Brand</option>
          {brands.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>

        {/* Images */}
        <input
          type="file"
          multiple
          accept="image/*"
          className="form-control mb-3"
          onChange={handleImageChange}
        />

        {preview.length > 0 && (
          <div className="d-flex gap-2 mb-3 flex-wrap">
            {preview.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Preview"
                className="img-thumbnail"
                width="120"
              />
            ))}
          </div>
        )}

        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Saving..." : productId ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
}
