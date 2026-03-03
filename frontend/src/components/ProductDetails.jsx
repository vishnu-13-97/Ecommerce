import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api-helper/Axioxinstance";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchCartCount } = useCart();

  const [product, setProduct]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const [activeImg, setActiveImg]     = useState(0);
  const [addingCart, setAddingCart]   = useState(false);

  /* ── Fetch Product ── */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/product/${id}`);
        if (res.data?.data) setProduct(res.data.data);
      } catch {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  /* ── Add To Cart ── */
  const handleAddToCart = async () => {
    if (product.stock <= 0) { toast.error("Out of stock"); return; }
    if (!user) { navigate(`/login?redirect=/product/${product._id}`); return; }
    try {
      setAddingCart(true);
      await API.post("/user/cart", { productId: product._id, quantity: 1 }, { withCredentials: true });
      fetchCartCount();
      toast.success("Added to cart!");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch {
      toast.error("Unable to add to cart");
    } finally {
      setAddingCart(false);
    }
  };

  /* ── Buy Now ── */
  const handleBuyNow = () => {
    if (!user) navigate(`/login?redirect=/payment/${product._id}`);
    else navigate(`/payment/${product._id}`);
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"
            style={{ width: "3rem", height: "3rem" }} />
          <p className="text-muted fw-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  /* ── Not Found ── */
  if (!product) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-10 mb-3"
            style={{ width: 80, height: 80 }}>
            <i className="fas fa-box-open text-danger" style={{ fontSize: "2rem" }}></i>
          </div>
          <h5 className="fw-bold text-dark mb-1">Product not found</h5>
          <p className="text-muted small mb-3">This product may have been removed or doesn't exist.</p>
          <Link to="/" className="btn btn-primary rounded-pill px-4">
            <i className="fas fa-arrow-left me-2"></i>Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const images  = product.images?.length ? product.images : [{ url: "https://via.placeholder.com/400" }];
  const inStock = product.stock > 0;
  const stockBadge = product.stock <= 5 && product.stock > 0 ? "warning" : inStock ? "success" : "danger";
  const stockLabel = product.stock === 0 ? "Out of Stock" : product.stock <= 5 ? `Only ${product.stock} left!` : `${product.stock} in stock`;

  return (
    <div className="bg-light" style={{ minHeight: "100vh" }}>

      {/* ── Breadcrumb bar ── */}
      <div className="bg-white border-bottom">
        <div className="container py-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 small">
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none text-primary">Home</Link>
              </li>
              {product.category?.name && (
                <li className="breadcrumb-item text-muted">{product.category.name}</li>
              )}
              <li className="breadcrumb-item active text-muted text-truncate" style={{ maxWidth: 200 }}>
                {product.name}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container py-4 py-lg-5">
        <div className="row g-4 g-lg-5">

          {/* ── LEFT: Images ── */}
          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">

              {/* Main image */}
              <div className="position-relative bg-light d-flex align-items-center justify-content-center"
                style={{ height: 380 }}>
                <img
                  src={images[activeImg]?.url}
                  alt={product.name}
                  className="img-fluid"
                  style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", padding: "1rem" }}
                />
                {/* Stock badge overlay */}
                <span className={"position-absolute top-0 start-0 badge bg-" + stockBadge + " m-3 rounded-pill px-3 py-2"}
                  style={{ fontSize: "0.75rem" }}>
                  <i className={"fas me-1 " + (inStock ? "fa-check-circle" : "fa-times-circle")} style={{ fontSize: "0.65rem" }}></i>
                  {stockLabel}
                </span>
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="d-flex gap-2 p-3 border-top bg-white flex-wrap">
                  {images.map((img, i) => (
                    <button key={i} type="button"
                      className={"btn p-0 rounded-3 overflow-hidden border-2 " + (activeImg === i ? "border border-primary" : "border")}
                      style={{ width: 60, height: 60, flexShrink: 0 }}
                      onClick={() => setActiveImg(i)}>
                      <img src={img.url} alt={"Thumbnail " + (i + 1)}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Details ── */}
          <div className="col-12 col-lg-7 d-flex flex-column gap-4">

            {/* Title + badges */}
            <div>
              <div className="d-flex flex-wrap gap-2 mb-2">
                {product.brand?.name && (
                  <span className="badge bg-primary text-white rounded-pill px-3 py-1" style={{ fontSize: "0.72rem" }}>
                    <i className="fas fa-tag me-1" style={{ fontSize: "0.6rem" }}></i>
                    {product.brand.name}
                  </span>
                )}
                {product.category?.name && (
                  <span className="badge bg-secondary text-white rounded-pill px-3 py-1" style={{ fontSize: "0.72rem" }}>
                    <i className="fas fa-layer-group me-1" style={{ fontSize: "0.6rem" }}></i>
                    {product.category.name}
                  </span>
                )}
              </div>
              <h2 className="fw-bold text-dark mb-2 text-capitalize lh-sm">{product.name}</h2>
              <p className="text-muted mb-0" style={{ fontSize: "0.95rem", lineHeight: 1.7 }}>
                {product.description}
              </p>
            </div>

            {/* Price card */}
            <div className="card border-0 rounded-4 overflow-hidden"
              style={{ background: "linear-gradient(135deg,#0d6efd,#003db5)" }}>
              <div className="card-body p-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                  <p className="text-white mb-0" style={{ opacity: 0.7, fontSize: "0.8rem" }}>Price</p>
                  <h2 className="fw-bold text-white mb-0">
                    ₹{Number(product.price).toLocaleString()}
                  </h2>
                </div>
                <div className="text-end">
                  <p className="text-white mb-0" style={{ opacity: 0.7, fontSize: "0.8rem" }}>Availability</p>
                  <span className={"badge bg-" + stockBadge + " rounded-pill px-3 py-2 fw-semibold"}
                    style={{ fontSize: "0.8rem" }}>
                    {stockLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Product meta */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                  <i className="fas fa-info-circle text-primary"></i> Product Details
                </h6>
                <div className="row g-2">
                  {[
                    { label: "Category", value: product.category?.name || "N/A", icon: "fa-layer-group" },
                    { label: "Brand",    value: product.brand?.name    || "N/A", icon: "fa-tag" },
                    { label: "Type",     value: product.type           || "N/A", icon: "fa-cube" },
                    { label: "Stock",    value: product.stock + " units",        icon: "fa-cubes" },
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="col-6">
                      <div className="d-flex align-items-center gap-2 p-2 rounded-3 bg-light">
                        <div className="d-flex align-items-center justify-content-center rounded-2 bg-primary bg-opacity-10 flex-shrink-0"
                          style={{ width: 30, height: 30 }}>
                          <i className={"fas " + icon + " text-primary"} style={{ fontSize: "0.75rem" }}></i>
                        </div>
                        <div className="min-width-0">
                          <p className="text-muted mb-0" style={{ fontSize: "0.68rem" }}>{label}</p>
                          <p className="fw-semibold text-dark mb-0 small text-truncate">{value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="d-flex flex-wrap gap-3">
              {[
                { icon: "fa-shield-alt",     text: "Secure Payment" },
                { icon: "fa-undo",           text: "Easy Returns" },
                { icon: "fa-shipping-fast",  text: "Fast Delivery" },
              ].map(({ icon, text }) => (
                <div key={text} className="d-flex align-items-center gap-2 text-muted small">
                  <i className={"fas " + icon + " text-success"}></i>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <div className="d-flex flex-column flex-sm-row gap-3">
                  <button
                    className="btn btn-primary rounded-3 fw-semibold py-3 flex-grow-1 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                    onClick={handleAddToCart}
                    disabled={!inStock || addingCart}>
                    {addingCart ? (
                      <><span className="spinner-border spinner-border-sm" role="status"></span> Adding...</>
                    ) : (
                      <><i className="fas fa-shopping-cart"></i> Add to Cart</>
                    )}
                  </button>
                  <button
                    className="btn btn-success rounded-3 fw-semibold py-3 flex-grow-1 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                    onClick={handleBuyNow}
                    disabled={!inStock}>
                    <i className="fas fa-bolt"></i> Buy Now
                  </button>
                </div>
                {!inStock && (
                  <p className="text-danger text-center small mt-2 mb-0 d-flex align-items-center justify-content-center gap-1">
                    <i className="fas fa-exclamation-circle"></i>
                    This product is currently out of stock.
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;