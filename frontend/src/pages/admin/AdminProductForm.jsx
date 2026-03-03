import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import API from "../../api-helper/Axioxinstance";
import { toast } from "react-toastify";

/* ── Reusable Field Component ── */
const Field = ({
  name, label, icon, type = "text", required = true,
  placeholder, as: As = "input", children,
  product, errors, handleChange,
}) => (
  <div>
    <label htmlFor={name} className="form-label fw-medium text-dark small mb-1">
      {label} {required && <span className="text-danger">*</span>}
    </label>
    <div className="input-group input-group-lg">
      <span className={"input-group-text bg-light border-end-0 " + (errors[name] ? "border-danger" : "text-muted")}>
        <i className={"fas " + icon + (errors[name] ? " text-danger" : "")} style={{ fontSize: "0.9rem" }}></i>
      </span>
      {As === "textarea" ? (
        <textarea id={name} name={name} value={product[name]} onChange={handleChange}
          placeholder={placeholder} rows={4}
          className={"form-control bg-light border-start-0 " + (errors[name] ? "border-danger is-invalid" : "")} />
      ) : As === "select" ? (
        <select id={name} name={name} value={product[name]} onChange={handleChange}
          className={"form-select bg-light border-start-0 " + (errors[name] ? "border-danger is-invalid" : "")}>
          {children}
        </select>
      ) : (
        <input id={name} type={type} name={name} value={product[name]} onChange={handleChange}
          placeholder={placeholder}
          className={"form-control bg-light border-start-0 " + (errors[name] ? "border-danger is-invalid" : "")} />
      )}
    </div>
    {errors[name] && (
      <div className="d-flex align-items-center gap-1 mt-1">
        <i className="fas fa-exclamation-circle text-danger" style={{ fontSize: "0.72rem" }}></i>
        <small className="text-danger">{errors[name]}</small>
      </div>
    )}
  </div>
);

/* ── ProductForm ── */
export default function ProductForm() {
  const [product, setProduct] = useState({
    name: "", type: "", description: "",
    price: "", stock: "", category: "", brand: "", images: [],
  });
  const [errors, setErrors]     = useState({});
  const [preview, setPreview]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands]     = useState([]);
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(false);

  const navigate = useNavigate();
  const { productId } = useParams();
  const isEdit = Boolean(productId);

  /* ── Fetch categories & brands ── */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/category");
        setCategories(res.data.data || res.data);
      } catch { toast.error("Failed to load categories"); }
    };
    const fetchBrands = async () => {
      try {
        const res = await API.get("/brand");
        setBrands(res.data.data || res.data);
      } catch { toast.error("Failed to load brands"); }
    };
    fetchCategories();
    fetchBrands();
  }, []);

  /* ── Fetch product in edit mode ── */
  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      try {
        setFetching(true);
        const res = await API.get(`/product/${productId}`);
        const data = res.data.product || res.data.data;
        setProduct({
          name: data.name || "", type: data.type || "",
          description: data.description || "", price: data.price || "",
          stock: data.stock || "", category: data.category?._id || "",
          brand: data.brand?._id || "", images: [],
        });
        setPreview(data.images?.map((img) => img.url) || []);
      } catch { toast.error("Failed to load product"); }
      finally { setFetching(false); }
    };
    fetchProduct();
  }, [productId]);

  /* ── Handlers ── */
  const handleChange = (e) => {
    setProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.some((f) => f.size > 5 * 1024 * 1024)) {
      toast.error("Each image must be under 5MB"); return;
    }
    setProduct((prev) => ({ ...prev, images: files }));
    setPreview(files.map((f) => URL.createObjectURL(f)));
  };

  const removePreview = (index) => {
    setPreview((prev) => prev.filter((_, i) => i !== index));
    setProduct((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  /* ── Validation ── */
  const validate = () => {
    const e = {};
    if (!product.name.trim() || product.name.length < 2)       e.name        = "Name must be at least 2 characters.";
    if (!product.description.trim() || product.description.length < 10) e.description = "Description must be at least 10 characters.";
    if (!product.price || isNaN(product.price) || Number(product.price) <= 0) e.price = "Enter a valid price.";
    if (!product.stock || isNaN(product.stock) || Number(product.stock) < 0)  e.stock = "Enter a valid stock quantity.";
    if (!product.category) e.category = "Please select a category.";
    if (!product.brand)    e.brand    = "Please select a brand.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const fd = new FormData();
      ["name","type","description","price","stock","category","brand"].forEach((k) => fd.append(k, product[k]));
      product.images.forEach((img) => fd.append("images", img));
      const headers = { "Content-Type": "multipart/form-data" };
      if (isEdit) {
        await API.put(`/product/${productId}`, fd, { headers });
        toast.success("Product updated successfully!");
      } else {
        await API.post("/product", fd, { headers });
        toast.success("Product added successfully!");
      }
      navigate("/admin/product");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally { setLoading(false); }
  };

  /* ── Loading state ── */
  if (fetching) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "50vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }} />
          <p className="text-muted fw-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  /* ── Shared Field props ── */
  const fp = { product, errors, handleChange };

  return (
    <>
      {/* ── Page Header ── */}
      <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-2 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <i className={"fas " + (isEdit ? "fa-pen" : "fa-plus-circle") + " text-primary"}></i>
            {isEdit ? "Edit Product" : "Add New Product"}
          </h4>
          <p className="text-muted small mb-0">
            {isEdit ? "Update product details below" : "Fill in the details to add a new product"}
          </p>
        </div>
        <Link to="/admin/product" className="btn btn-light btn-sm rounded-3 px-3 fw-medium d-flex align-items-center gap-2">
          <i className="fas fa-arrow-left" style={{ fontSize: "0.8rem" }}></i> Back
        </Link>
      </div>

      <form onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
        <div className="row g-4">

          {/* ── LEFT COLUMN ── */}
          <div className="col-12 col-lg-8 d-flex flex-column gap-4">

            {/* Basic Info */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h6 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                  <i className="fas fa-info-circle text-primary"></i> Basic Information
                </h6>
                <div className="d-flex flex-column gap-3">
                  <Field {...fp} name="name" label="Product Name" icon="fa-box-open"
                    placeholder="e.g. Samsung Galaxy S24" />
                  <Field {...fp} name="type" label="Product Type" icon="fa-tag"
                    placeholder="e.g. Electronics, Clothing" required={false} />
                  <Field {...fp} name="description" label="Description" icon="fa-align-left"
                    placeholder="Describe the product in detail..." as="textarea" />
                </div>
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h6 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                  <i className="fas fa-rupee-sign text-primary"></i> Pricing & Inventory
                </h6>
                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <Field {...fp} name="price" label="Price (₹)" icon="fa-rupee-sign"
                      type="number" placeholder="0.00" />
                  </div>
                  <div className="col-12 col-sm-6">
                    <Field {...fp} name="stock" label="Stock Quantity" icon="fa-cubes"
                      type="number" placeholder="0" />
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h6 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                  <i className="fas fa-images text-primary"></i> Product Images
                </h6>
                <p className="text-muted small mb-3">
                  Upload up to 5 images · JPG, PNG · Max 5MB each
                </p>

                {/* Upload zone */}
                <label htmlFor="imageInput"
                  className="d-flex flex-column align-items-center justify-content-center rounded-4 border border-2 p-4 mb-3 text-center"
                  style={{ borderStyle: "dashed", borderColor: "#c7d3e8", background: "#f8fafc", cursor: "pointer", transition: "border-color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#0d6efd"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#c7d3e8"}>
                  <div className="d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mb-2"
                    style={{ width: 48, height: 48 }}>
                    <i className="fas fa-cloud-upload-alt text-primary" style={{ fontSize: "1.2rem" }}></i>
                  </div>
                  <p className="fw-semibold text-dark small mb-1">Click to upload images</p>
                  <p className="text-muted mb-0" style={{ fontSize: "0.75rem" }}>JPG, PNG up to 5MB each</p>
                  <input id="imageInput" type="file" multiple accept="image/*"
                    className="d-none" onChange={handleImageChange} />
                </label>

                {/* Previews */}
                {preview.length > 0 && (
                  <div className="row g-2">
                    {preview.map((img, i) => (
                      <div key={i} className="col-4 col-sm-3 col-md-2 position-relative">
                        <img src={img} alt={"Preview " + (i + 1)} className="rounded-3 w-100 border"
                          style={{ aspectRatio: "1/1", objectFit: "cover" }} />
                        <button type="button"
                          className="position-absolute top-0 end-0 btn btn-danger btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center border border-2 border-white"
                          style={{ width: 22, height: 22, transform: "translate(30%, -30%)" }}
                          onClick={() => removePreview(i)}>
                          <i className="fas fa-times" style={{ fontSize: "0.55rem" }}></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="col-12 col-lg-4 d-flex flex-column gap-4">

            {/* Classification */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h6 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                  <i className="fas fa-sitemap text-primary"></i> Classification
                </h6>
                <div className="d-flex flex-column gap-3">
                  <Field {...fp} name="category" label="Category" icon="fa-layer-group" as="select">
                    <option value="">Select Category</option>
                    {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </Field>
                  <Field {...fp} name="brand" label="Brand" icon="fa-tag" as="select">
                    <option value="">Select Brand</option>
                    {brands.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
                  </Field>
                </div>
              </div>
            </div>

            {/* Live Summary */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-header border-0 py-3 px-4"
                style={{ background: "linear-gradient(135deg,#0d6efd,#003db5)" }}>
                <h6 className="fw-bold text-white mb-0 d-flex align-items-center gap-2">
                  <i className="fas fa-clipboard-check"></i> Live Summary
                </h6>
              </div>
              <div className="card-body p-4">
                <div className="d-flex flex-column gap-2">
                  {[
                    { label: "Name",     value: product.name || "—" },
                    { label: "Price",    value: product.price ? "₹" + Number(product.price).toLocaleString() : "—" },
                    { label: "Stock",    value: product.stock ? product.stock + " units" : "—" },
                    { label: "Category", value: categories.find((c) => c._id === product.category)?.name || "—" },
                    { label: "Brand",    value: brands.find((b) => b._id === product.brand)?.name || "—" },
                    { label: "Images",   value: preview.length > 0 ? preview.length + " selected" : "None" },
                  ].map(({ label, value }) => (
                    <div key={label} className="d-flex justify-content-between align-items-center py-1"
                      style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <span className="text-muted small fw-medium">{label}</span>
                      <span className="text-dark fw-semibold small text-truncate ms-3" style={{ maxWidth: 140 }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4 d-flex flex-column gap-3">
                <button type="submit" disabled={loading}
                  className="btn btn-primary rounded-3 fw-semibold py-2 d-flex align-items-center justify-content-center gap-2 shadow-sm w-100">
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      {isEdit ? "Updating..." : "Saving..."}
                    </>
                  ) : (
                    <>
                      <i className={"fas " + (isEdit ? "fa-save" : "fa-plus")}></i>
                      {isEdit ? "Update Product" : "Add Product"}
                    </>
                  )}
                </button>
                <Link to="/admin/product"
                  className="btn btn-outline-secondary rounded-3 fw-semibold py-2 d-flex align-items-center justify-content-center gap-2 w-100">
                  <i className="fas fa-times"></i> Cancel
                </Link>
              </div>
            </div>

          </div>
        </div>
      </form>
    </>
  );
}