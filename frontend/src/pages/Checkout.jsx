import React, { useEffect, useState } from "react";
import API from "../api-helper/Axioxinstance";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Checkout = () => {
  const navigate      = useNavigate();
  const location      = useLocation();
  const buyNow        = location.state?.buyNow;
  const buyNowProduct = location.state?.product;

  const [cart,            setCart]            = useState(null);
  const [addresses,       setAddresses]       = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod,   setPaymentMethod]   = useState("");
  const [loading,         setLoading]         = useState(true);
  const [placingOrder,    setPlacingOrder]    = useState(false);
  const [showModal,       setShowModal]       = useState(false);
  const [newAddress,      setNewAddress]      = useState({
    fullName: "", mobile: "", pincode: "",
    addressLine: "", landmark: "", city: "", state: "",
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [cartRes, addressRes] = await Promise.all([
        API.get("/user/cart",    { withCredentials: true }),
        API.get("/user/address", { withCredentials: true }),
      ]);
      setCart(cartRes.data.data);
      setAddresses(addressRes.data.addresses || []);
      if (addressRes.data.addresses?.length > 0)
        setSelectedAddress(addressRes.data.addresses[0]._id);
    } catch { toast.error("Failed to load checkout data"); }
    finally { setLoading(false); }
  };

  const handleAddAddress = async () => {
    const { fullName, mobile, pincode, addressLine, city, state } = newAddress;
    if (!fullName || !mobile || !pincode || !addressLine || !city || !state)
      return toast.error("Please fill all required fields");
    try {
      const res = await API.post("/user/address", { ...newAddress, country: "India" }, { withCredentials: true });
      const added = res.data.address;
      setAddresses((prev) => [...prev, added]);
      setSelectedAddress(added._id);
      toast.success("Address added!");
      setShowModal(false);
      setNewAddress({ fullName: "", mobile: "", pincode: "", addressLine: "", landmark: "", city: "", state: "" });
    } catch (err) { toast.error(err.response?.data?.message || "Failed to add address"); }
  };

  const placeOrder = async () => {
    if (!selectedAddress) return toast.error("Please select a shipping address");
    if (!paymentMethod)   return toast.error("Please select a payment method");

    try {
      setPlacingOrder(true);

      // ── Build payload ──
      const payload = {
        addressId:     selectedAddress,
        paymentMethod,
        ...(buyNow && buyNowProduct
          ? { buyNow: true, productId: buyNowProduct._id, quantity: buyNowProduct.quantity || 1 }
          : {}),
      };

      if (paymentMethod === "COD") {
        const res = await API.post("/user/orders", payload, { withCredentials: true });
        toast.success("Order placed successfully!");
        navigate(`/order-success/${res.data.order._id}`);
        return;
      }

      if (paymentMethod === "Razorpay") {
        const res = await API.post("/user/orders", payload, { withCredentials: true });
        const { razorpayOrderId, amount } = res.data;
        const options = {
          key:      import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount,
          currency: "INR",
          order_id: razorpayOrderId,
          handler:  async (response) => {
            try {
              const verify = await API.post("/user/orders/verify",
                { ...response, addressId: selectedAddress }, { withCredentials: true });
              toast.success("Payment Successful!");
              navigate(`/order-success/${verify.data.order._id}`);
            } catch { toast.error("Payment verification failed"); }
          },
          theme: { color: "#0d6efd" },
        };
        new window.Razorpay(options).open();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error placing order");
    } finally { setPlacingOrder(false); }
  };

  /* ── Derived order items ── */
  const orderItems = buyNow && buyNowProduct
    ? [{ product: buyNowProduct, quantity: buyNowProduct.quantity || 1, price: buyNowProduct.price }]
    : cart?.items || [];

  const orderTotal = buyNow && buyNowProduct
    ? buyNowProduct.price * (buyNowProduct.quantity || 1)
    : cart?.totalPrice || 0;

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"
            style={{ width: "3rem", height: "3rem" }} />
          <p className="text-muted fw-medium">Loading checkout...</p>
        </div>
      </div>
    );
  }

  /* ── Empty cart (only if not buyNow) ── */
  if (!buyNow && (!cart || cart.items.length === 0)) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mb-3"
            style={{ width: 80, height: 80 }}>
            <i className="fas fa-shopping-cart text-primary" style={{ fontSize: "2rem" }}></i>
          </div>
          <h5 className="fw-bold text-dark mb-1">Your cart is empty</h5>
          <p className="text-muted small mb-3">Add some products before checking out.</p>
          <Link to="/shop" className="btn btn-primary rounded-pill px-4">
            <i className="fas fa-store me-2"></i>Go Shopping
          </Link>
        </div>
      </div>
    );
  }

  const addressFields = [
    { key: "fullName",    label: "Full Name",    icon: "fa-user",        col: "col-12 col-sm-6" },
    { key: "mobile",      label: "Mobile",       icon: "fa-phone",       col: "col-12 col-sm-6" },
    { key: "pincode",     label: "Pincode",      icon: "fa-map-pin",     col: "col-12 col-sm-6" },
    { key: "city",        label: "City",         icon: "fa-city",        col: "col-12 col-sm-6" },
    { key: "state",       label: "State",        icon: "fa-map",         col: "col-12 col-sm-6" },
    { key: "landmark",    label: "Landmark",     icon: "fa-location-dot",col: "col-12 col-sm-6" },
    { key: "addressLine", label: "Address Line", icon: "fa-home",        col: "col-12"          },
  ];

  return (
    <div className="bg-light" style={{ minHeight: "100vh" }}>

      {/* ── Banner ── */}
      <div style={{ background: "linear-gradient(135deg,#0d6efd,#003db5)", minHeight: 130 }}
        className="d-flex align-items-center">
        <div className="container py-4">
          <nav aria-label="breadcrumb" className="mb-1">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/" className="text-white text-opacity-75 text-decoration-none small">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/cart" className="text-white text-opacity-75 text-decoration-none small">Cart</Link>
              </li>
              <li className="breadcrumb-item active small" style={{ color: "rgba(255,255,255,0.55)" }}>
                Checkout
              </li>
            </ol>
          </nav>
          <h2 className="fw-bold text-white mb-0 d-flex align-items-center gap-2">
            <i className="fas fa-lock" style={{ fontSize: "1.2rem" }}></i>
            {buyNow ? "Buy Now — Checkout" : "Checkout"}
          </h2>
        </div>
      </div>

      {/* ── Buy Now badge ── */}
      {buyNow && (
        <div className="container mt-3">
          <div className="alert border-0 rounded-3 d-flex align-items-center gap-2 py-2 px-3"
            style={{ background: "rgba(13,110,253,0.08)", fontSize: "0.85rem" }}>
            <i className="fas fa-bolt text-primary"></i>
            <span className="text-primary fw-medium">
              Buy Now mode — ordering 1 item directly without using your cart.
            </span>
          </div>
        </div>
      )}

      <div className="container py-4">
        <div className="row g-4">

          {/* ── LEFT ── */}
          <div className="col-12 col-lg-8 d-flex flex-column gap-4">

            {/* Step 1: Shipping Address */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                    <div className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white fw-bold flex-shrink-0"
                      style={{ width: 28, height: 28, fontSize: "0.8rem" }}>1</div>
                    Shipping Address
                  </h6>
                  <button className="btn btn-outline-primary btn-sm rounded-3 fw-medium d-flex align-items-center gap-1"
                    onClick={() => setShowModal(true)}>
                    <i className="fas fa-plus" style={{ fontSize: "0.7rem" }}></i> Add New
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="fas fa-map-marker-alt text-muted mb-2" style={{ fontSize: "2rem", opacity: 0.3 }}></i>
                    <p className="text-muted small mb-2">No address found.</p>
                    <button className="btn btn-primary btn-sm rounded-3" onClick={() => setShowModal(true)}>
                      <i className="fas fa-plus me-1"></i>Add Address
                    </button>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {addresses.map((addr) => (
                      <div key={addr._id}
                        className={"rounded-3 border p-3 d-flex align-items-start gap-3 " + (selectedAddress === addr._id ? "border-primary" : "border-light")}
                        style={{
                          background: selectedAddress === addr._id ? "rgba(13,110,253,0.04)" : "#fff",
                          cursor: "pointer", transition: "all 0.15s",
                        }}
                        onClick={() => setSelectedAddress(addr._id)}>
                        {/* Radio */}
                        <div className={"d-flex align-items-center justify-content-center rounded-circle border-2 mt-1 flex-shrink-0 " + (selectedAddress === addr._id ? "border-primary bg-primary" : "border bg-white")}
                          style={{ width: 18, height: 18 }}>
                          {selectedAddress === addr._id && (
                            <div className="rounded-circle bg-white" style={{ width: 6, height: 6 }}></div>
                          )}
                        </div>
                        {/* Address details */}
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <p className="fw-bold text-dark mb-0 small">{addr.fullName}</p>
                            {selectedAddress === addr._id && (
                              <span className="badge bg-primary rounded-pill" style={{ fontSize: "0.6rem" }}>Selected</span>
                            )}
                          </div>
                          <p className="text-muted mb-0 small" style={{ lineHeight: 1.6 }}>
                            {addr.addressLine}{addr.landmark ? ", " + addr.landmark : ""}, {addr.city}, {addr.state} — {addr.pincode}
                          </p>
                          <p className="text-muted mb-0 small">
                            <i className="fas fa-phone me-1" style={{ fontSize: "0.65rem" }}></i>{addr.mobile}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h6 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                  <div className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white fw-bold flex-shrink-0"
                    style={{ width: 28, height: 28, fontSize: "0.8rem" }}>2</div>
                  Payment Method
                </h6>

                <div className="d-flex flex-column gap-3">
                  {/* COD */}
                  <div
                    className={"rounded-3 border p-3 d-flex align-items-center gap-3 " + (paymentMethod === "COD" ? "border-primary" : "")}
                    style={{
                      background: paymentMethod === "COD" ? "rgba(13,110,253,0.04)" : "#fff",
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                    onClick={() => setPaymentMethod("COD")}>
                    <div className={"d-flex align-items-center justify-content-center rounded-circle border-2 flex-shrink-0 " + (paymentMethod === "COD" ? "border-primary bg-primary" : "border bg-white")}
                      style={{ width: 18, height: 18 }}>
                      {paymentMethod === "COD" && (
                        <div className="rounded-circle bg-white" style={{ width: 6, height: 6 }}></div>
                      )}
                    </div>
                    <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                      style={{ width: 40, height: 40, background: "rgba(25,135,84,0.1)" }}>
                      <i className="fas fa-money-bill-wave text-success" style={{ fontSize: "1rem" }}></i>
                    </div>
                    <div>
                      <p className="fw-semibold text-dark mb-0 small">Cash on Delivery</p>
                      <p className="text-muted mb-0" style={{ fontSize: "0.72rem" }}>Pay when your order arrives</p>
                    </div>
                    {paymentMethod === "COD" && (
                      <span className="badge bg-primary rounded-pill ms-auto" style={{ fontSize: "0.6rem" }}>Selected</span>
                    )}
                  </div>

                  {/* Razorpay */}
                  <div
                    className={"rounded-3 border p-3 d-flex align-items-center gap-3 " + (paymentMethod === "Razorpay" ? "border-primary" : "")}
                    style={{
                      background: paymentMethod === "Razorpay" ? "rgba(13,110,253,0.04)" : "#fff",
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                    onClick={() => setPaymentMethod("Razorpay")}>
                    <div className={"d-flex align-items-center justify-content-center rounded-circle border-2 flex-shrink-0 " + (paymentMethod === "Razorpay" ? "border-primary bg-primary" : "border bg-white")}
                      style={{ width: 18, height: 18 }}>
                      {paymentMethod === "Razorpay" && (
                        <div className="rounded-circle bg-white" style={{ width: 6, height: 6 }}></div>
                      )}
                    </div>
                    <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                      style={{ width: 40, height: 40, background: "rgba(13,110,253,0.1)" }}>
                      <i className="fas fa-credit-card text-primary" style={{ fontSize: "1rem" }}></i>
                    </div>
                    <div>
                      <p className="fw-semibold text-dark mb-0 small">Online Payment</p>
                      <p className="text-muted mb-0" style={{ fontSize: "0.72rem" }}>UPI, Cards, Net Banking via Razorpay</p>
                    </div>
                    {paymentMethod === "Razorpay" && (
                      <span className="badge bg-primary rounded-pill ms-auto" style={{ fontSize: "0.6rem" }}>Selected</span>
                    )}
                  </div>
                </div>

                {/* Security note */}
                <div className="d-flex align-items-center gap-2 mt-3 pt-3" style={{ borderTop: "1px solid #f1f5f9" }}>
                  <i className="fas fa-lock text-success" style={{ fontSize: "0.75rem" }}></i>
                  <span className="text-muted" style={{ fontSize: "0.72rem" }}>
                    All transactions are encrypted and 100% secure.
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* ── RIGHT: Order Summary ── */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ position: "sticky", top: 80 }}>

              {/* Header */}
              <div className="px-4 py-3 d-flex align-items-center gap-2"
                style={{ background: "linear-gradient(135deg,#0d6efd,#003db5)" }}>
                <i className="fas fa-receipt text-white" style={{ fontSize: "0.9rem" }}></i>
                <h6 className="fw-bold text-white mb-0">Order Summary</h6>
                {buyNow && (
                  <span className="badge bg-warning text-dark rounded-pill ms-auto" style={{ fontSize: "0.6rem" }}>
                    <i className="fas fa-bolt me-1" style={{ fontSize: "0.55rem" }}></i>Buy Now
                  </span>
                )}
              </div>

              <div className="card-body p-4">

                {/* Items */}
                <div className="d-flex flex-column gap-3 mb-3">
                  {orderItems.map((item, i) => (
                    <div key={item._id || i} className="d-flex align-items-center gap-3">
                      <div className="rounded-3 overflow-hidden flex-shrink-0 bg-light border"
                        style={{ width: 48, height: 48 }}>
                        <img
                          src={item.product?.image || item.product?.images?.[0]?.url || "https://via.placeholder.com/48"}
                          alt={item.product?.name || item.product}
                          className="w-100 h-100" style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div className="flex-grow-1 min-width-0">
                        <p className="fw-semibold text-dark mb-0 text-truncate small">
                          {item.product?.name || item.product}
                        </p>
                        <p className="text-muted mb-0" style={{ fontSize: "0.72rem" }}>Qty: {item.quantity}</p>
                      </div>
                      <p className="fw-bold text-dark mb-0 small flex-shrink-0">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Price breakdown */}
                <div className="d-flex flex-column gap-2 py-3" style={{ borderTop: "1px solid #f1f5f9" }}>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted small">Subtotal</span>
                    <span className="text-dark small fw-medium">₹{orderTotal.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted small">Delivery</span>
                    <span className="text-success small fw-medium">
                      {orderTotal >= 499 ? "FREE" : "₹49"}
                    </span>
                  </div>
                  {orderTotal >= 499 && (
                    <div className="d-flex align-items-center gap-1">
                      <i className="fas fa-check-circle text-success" style={{ fontSize: "0.7rem" }}></i>
                      <span className="text-success" style={{ fontSize: "0.72rem" }}>You qualify for free delivery!</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="d-flex justify-content-between align-items-center py-3 mb-3"
                  style={{ borderTop: "2px solid #f1f5f9" }}>
                  <span className="fw-bold text-dark">Total</span>
                  <span className="fw-bold text-primary" style={{ fontSize: "1.3rem" }}>
                    ₹{(orderTotal + (orderTotal >= 499 ? 0 : 49)).toLocaleString()}
                  </span>
                </div>

                {/* Place Order Button */}
                <button className="btn btn-primary rounded-3 fw-bold py-3 w-100 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                  onClick={placeOrder} disabled={placingOrder}>
                  {placingOrder ? (
                    <><span className="spinner-border spinner-border-sm" role="status"></span> Placing Order...</>
                  ) : (
                    <><i className="fas fa-lock"></i> Place Order</>
                  )}
                </button>

                {/* Trust badges */}
                <div className="d-flex justify-content-center gap-3 mt-3 pt-2"
                  style={{ borderTop: "1px solid #f1f5f9" }}>
                  {[
                    { icon: "fa-lock",         text: "Secure"  },
                    { icon: "fa-undo",         text: "Returns" },
                    { icon: "fa-shipping-fast",text: "Fast"    },
                  ].map(({ icon, text }) => (
                    <div key={text} className="text-center">
                      <i className={"fas " + icon + " text-primary d-block mb-1"} style={{ fontSize: "0.85rem" }}></i>
                      <span className="text-muted" style={{ fontSize: "0.65rem" }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Add Address Modal ── */}
      {showModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.55)", zIndex: 1055 }}
          onClick={() => setShowModal(false)}>
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden"
            style={{ width: "100%", maxWidth: 520 }}
            onClick={(e) => e.stopPropagation()}>

            {/* Modal header */}
            <div className="px-4 py-3 d-flex align-items-center justify-content-between"
              style={{ background: "linear-gradient(135deg,#0d6efd,#003db5)" }}>
              <h6 className="fw-bold text-white mb-0 d-flex align-items-center gap-2">
                <i className="fas fa-map-marker-alt"></i> Add New Address
              </h6>
              <button className="btn btn-sm btn-close btn-close-white"
                onClick={() => setShowModal(false)} />
            </div>

            <div className="card-body p-4">
              <div className="row g-3">
                {addressFields.map(({ key, label, icon, col }) => (
                  <div key={key} className={col}>
                    <label className="form-label fw-medium text-dark small mb-1">
                      {label} {key !== "landmark" && <span className="text-danger">*</span>}
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-muted">
                        <i className={"fas " + icon} style={{ fontSize: "0.8rem" }}></i>
                      </span>
                      <input
                        className="form-control bg-light border-start-0"
                        placeholder={label}
                        value={newAddress[key]}
                        onChange={(e) => setNewAddress({ ...newAddress, [key]: e.target.value })}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-flex gap-3 mt-4">
                <button className="btn btn-outline-secondary rounded-3 fw-medium flex-grow-1"
                  onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary rounded-3 fw-semibold flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                  onClick={handleAddAddress}>
                  <i className="fas fa-save"></i> Save Address
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;