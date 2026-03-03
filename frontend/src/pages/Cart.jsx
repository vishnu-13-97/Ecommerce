import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api-helper/Axioxinstance";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const { fetchCartCount } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await API.get("/user/cart", { withCredentials: true });
      setCart(res.data.data);
    } catch {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = async (productId) => {
    try {
      setUpdatingId(productId);
      await API.post("/user/cart", { productId, quantity: 1 }, { withCredentials: true });
      fetchCart(); fetchCartCount();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating cart");
    } finally { setUpdatingId(null); }
  };

  const decreaseQuantity = async (productId) => {
    try {
      setUpdatingId(productId);
      await API.delete("/user/cart", { data: { productId, quantity: 1 }, withCredentials: true });
      fetchCart(); fetchCartCount();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating cart");
    } finally { setUpdatingId(null); }
  };

  const removeItem = async (productId) => {
    try {
      setUpdatingId(productId);
      await API.delete("/user/cart", { data: { productId, quantity: 999 }, withCredentials: true });
      toast.success("Item removed");
      fetchCart(); fetchCartCount();
    } catch {
      toast.error("Error removing item");
    } finally { setUpdatingId(null); }
  };

  // ── Loading State ──
  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted fw-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // ── Empty State ──
  if (!cart || cart.items.length === 0) {
    return (
      <div className="d-flex align-items-center justify-content-center bg-light" style={{ minHeight: "70vh" }}>
        <div className="text-center px-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mb-4"
            style={{ width: 100, height: 100 }}
          >
            <i className="fas fa-shopping-bag text-primary" style={{ fontSize: "2.5rem" }}></i>
          </div>
          <h3 className="fw-bold text-dark mb-2">Your cart is empty</h3>
          <p className="text-muted mb-4 small">Looks like you haven't added anything yet.<br />Explore our store and find something you love!</p>
          <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
            <button
              className="btn btn-primary rounded-pill px-5 py-2 fw-semibold shadow-sm"
              onClick={() => navigate("/shop")}
            >
              <i className="fas fa-store me-2"></i>Browse Shop
            </button>
            <Link to="/" className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-semibold">
              <i className="fas fa-home me-2"></i>Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Savings calculation ──
  const savings = cart.items.reduce((acc, item) => {
    const original = item.product?.originalPrice || item.price;
    return acc + (original - item.price) * item.quantity;
  }, 0);

  return (
    <>
      {/* ── Page Header ── */}
      <div
        className="py-4 py-md-5"
        style={{ background: "linear-gradient(135deg, #0d6efd 0%, #003db5 100%)" }}
      >
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
            <div>
              <h2 className="text-white fw-bold mb-1 d-flex align-items-center gap-2">
                <i className="fas fa-shopping-bag"></i> Shopping Cart
              </h2>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/" className="text-white-50 text-decoration-none">Home</Link>
                  </li>
                  <li className="breadcrumb-item active text-white">Cart</li>
                </ol>
              </nav>
            </div>
            <span className="badge bg-white text-primary fw-semibold px-3 py-2 rounded-pill fs-6">
              {cart.totalItems} {cart.totalItems === 1 ? "item" : "items"}
            </span>
          </div>
        </div>
      </div>

      <div className="container py-4 py-lg-5">
        <div className="row g-4">

          {/* ── Cart Items ── */}
          <div className="col-12 col-lg-8">

            {/* Column headers — desktop only */}
            <div className="d-none d-md-flex align-items-center px-3 mb-2">
              <span className="text-muted small fw-medium" style={{ width: 100 }}>Product</span>
              <span className="text-muted small fw-medium ms-3 flex-grow-1">Details</span>
              <span className="text-muted small fw-medium me-5">Qty</span>
              <span className="text-muted small fw-medium">Total</span>
            </div>

            <div className="d-flex flex-column gap-3">
              {cart.items.map((item) => {
                const isUpdating = updatingId === item.product._id;
                return (
                  <div
                    key={item._id}
                    className={`card border-0 shadow-sm rounded-4 ${isUpdating ? "opacity-75" : ""}`}
                    style={{ transition: "opacity 0.2s" }}
                  >
                    <div className="card-body p-3 p-md-4">
                      <div className="d-flex align-items-center gap-3">

                        {/* Product Image */}
                        <div className="flex-shrink-0 position-relative">
                          <img
                            src={item.product?.images?.[0]?.url || "https://via.placeholder.com/90"}
                            alt={item.product?.name}
                            className="rounded-3 object-fit-cover"
                            style={{ width: 80, height: 80, objectFit: "cover" }}
                          />
                          {isUpdating && (
                            <div
                              className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center rounded-3"
                              style={{ background: "rgba(255,255,255,0.7)" }}
                            >
                              <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-grow-1 min-width-0">
                          <h6 className="fw-bold mb-1 text-truncate">{item.product?.name}</h6>
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <span className="text-primary fw-semibold">₹{item.price}</span>
                            {item.product?.originalPrice && item.product.originalPrice > item.price && (
                              <span className="text-muted text-decoration-line-through small">
                                ₹{item.product.originalPrice}
                              </span>
                            )}
                          </div>

                          {/* Quantity + Remove — always visible */}
                          <div className="d-flex align-items-center gap-3 flex-wrap">
                            {/* Qty controls */}
                            <div className="d-flex align-items-center border rounded-pill overflow-hidden bg-light">
                              <button
                                className="btn btn-sm btn-link text-dark px-3 py-1 text-decoration-none"
                                disabled={item.quantity <= 1 || isUpdating}
                                onClick={() => decreaseQuantity(item.product._id)}
                              >
                                <i className="fas fa-minus" style={{ fontSize: "0.7rem" }}></i>
                              </button>
                              <span className="fw-bold px-2 small">{item.quantity}</span>
                              <button
                                className="btn btn-sm btn-link text-dark px-3 py-1 text-decoration-none"
                                disabled={isUpdating}
                                onClick={() => increaseQuantity(item.product._id)}
                              >
                                <i className="fas fa-plus" style={{ fontSize: "0.7rem" }}></i>
                              </button>
                            </div>

                            {/* Remove */}
                            <button
                              className="btn btn-sm btn-outline-danger rounded-pill px-3 d-flex align-items-center gap-1"
                              disabled={isUpdating}
                              onClick={() => removeItem(item.product._id)}
                            >
                              <i className="fas fa-trash-alt" style={{ fontSize: "0.7rem" }}></i>
                              <span className="d-none d-sm-inline">Remove</span>
                            </button>
                          </div>
                        </div>

                        {/* Line Total */}
                        <div className="text-end flex-shrink-0 ms-2">
                          <span className="fw-bold text-dark fs-6">₹{item.price * item.quantity}</span>
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Continue Shopping */}
            <div className="mt-4">
              <Link
                to="/shop"
                className="btn btn-outline-primary rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2"
              >
                <i className="fas fa-arrow-left"></i>
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* ── Order Summary ── */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden sticky-lg-top" style={{ top: "100px" }}>

              {/* Header */}
              <div
                className="card-header border-0 py-3 px-4"
                style={{ background: "linear-gradient(135deg, #0d6efd 0%, #003db5 100%)" }}
              >
                <h5 className="text-white fw-bold mb-0 d-flex align-items-center gap-2">
                  <i className="fas fa-receipt"></i> Order Summary
                </h5>
              </div>

              <div className="card-body p-4">

                {/* Line items */}
                <div className="d-flex flex-column gap-2 mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">Subtotal ({cart.totalItems} items)</span>
                    <span className="fw-medium">₹{cart.totalPrice}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">Shipping</span>
                    <span className="text-success fw-medium small">
                      <i className="fas fa-check-circle me-1"></i>Free
                    </span>
                  </div>
                  {savings > 0 && (
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-success small">You save</span>
                      <span className="text-success fw-medium small">−₹{savings}</span>
                    </div>
                  )}
                </div>

                <hr className="my-3" />

                {/* Total */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="fw-bold fs-6">Total</span>
                  <span className="fw-bold text-primary fs-5">₹{cart.totalPrice}</span>
                </div>

                {/* Checkout Button */}
                <button
                  className="btn btn-primary w-100 rounded-pill py-2 fw-semibold shadow-sm d-flex align-items-center justify-content-center gap-2 mb-3"
                  onClick={() => navigate("/checkout")}
                  style={{ fontSize: "1rem" }}
                >
                  <i className="fas fa-lock"></i>
                  Proceed to Checkout
                </button>

                {/* Payment icons */}
                <div className="text-center">
                  <p className="text-muted mb-2" style={{ fontSize: "0.72rem" }}>
                    <i className="fas fa-shield-alt text-success me-1"></i>
                    Secure & encrypted checkout
                  </p>
                  <div className="d-flex justify-content-center gap-2">
                    {["fa-cc-visa", "fa-cc-mastercard", "fa-cc-paypal", "fa-cc-apple-pay"].map((icon) => (
                      <i key={icon} className={`fab ${icon} text-muted`} style={{ fontSize: "1.4rem" }}></i>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Cart;