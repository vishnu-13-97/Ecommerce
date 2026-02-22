import React, { useEffect, useState } from "react";
import API from "../api-helper/Axioxinstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Checkout = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [newAddress, setNewAddress] = useState({
    fullName: "",
    mobile: "",
    pincode: "",
    addressLine: "",
    landmark: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cartRes, addressRes] = await Promise.all([
        API.get("/user/cart", { withCredentials: true }),
        API.get("/user/address", { withCredentials: true }),
      ]);

      setCart(cartRes.data.data);
      setAddresses(addressRes.data.addresses || []);

      if (addressRes.data.addresses?.length > 0) {
        setSelectedAddress(addressRes.data.addresses[0]._id);
      }
    } catch (error) {
      toast.error("Failed to load checkout data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    const { fullName, mobile, pincode, addressLine, city, state } =
      newAddress;

    if (
      !fullName ||
      !mobile ||
      !pincode ||
      !addressLine ||
      !city ||
      !state
    ) {
      return toast.error("Please fill all required fields");
    }

    try {
      const res = await API.post(
        "/user/address",
        {
          ...newAddress,
          country: "India",
        },
        { withCredentials: true }
      );

      const addedAddress = res.data.address;

      setAddresses((prev) => [...prev, addedAddress]);
      setSelectedAddress(addedAddress._id);

      toast.success("Address added successfully");

      setShowModal(false);

      setNewAddress({
        fullName: "",
        mobile: "",
        pincode: "",
        addressLine: "",
        landmark: "",
        city: "",
        state: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add address"
      );
    }
  };

  const placeOrder = async () => {
    if (!selectedAddress) {
      return toast.error("Please select a shipping address");
    }

    if (!paymentMethod) {
      return toast.error("Please select a payment method");
    }

    try {
      setPlacingOrder(true);

      await API.post(
        "/user/orders",
        {
          addressId: selectedAddress,
          paymentMethod,
        },
        { withCredentials: true }
      );

      toast.success("Order placed successfully");
      navigate("/my-orders");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error placing order"
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return <p className="text-center py-5">Loading...</p>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-5">
        <h3>Your cart is empty</h3>
        <button
          className="btn btn-success mt-3"
          onClick={() => navigate("/shop")}
        >
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="container py-5">
        <h2 className="mb-4 fw-bold">Checkout</h2>

        <div className="row">
          {/* LEFT SIDE */}
          <div className="col-lg-8">

            {/* Address Section */}
            <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Shipping Address</h5>
                <button
                  className="btn btn-outline-success btn-sm"
                  onClick={() => setShowModal(true)}
                >
                  + Add New
                </button>
              </div>

              {addresses.length === 0 ? (
                <p className="text-muted">No address found. Add one.</p>
              ) : (
                addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className="form-check mb-3 border rounded p-3"
                    style={{
                      background:
                        selectedAddress === addr._id
                          ? "#f8fff8"
                          : "white",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      className="form-check-input"
                      type="radio"
                      name="address"
                      checked={selectedAddress === addr._id}
                      onChange={() =>
                        setSelectedAddress(addr._id)
                      }
                    />
                    <label className="form-check-label ms-2 w-100">
                      <strong>{addr.fullName}</strong> <br />
                      {addr.addressLine},{addr.landmark}, {addr.city},{" "}
                      {addr.state} - {addr.pincode} <br />
                      {addr.mobile}
                    </label>
                  </div>
                ))
              )}
            </div>

            {/* Payment Section */}
            <div className="card shadow-sm border-0 rounded-4 p-4">
              <h5 className="mb-3 fw-bold">Payment Method</h5>

              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />
                <label className="form-check-label ms-2">
                  Cash on Delivery
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentMethod"
                  value="Online"
                  checked={paymentMethod === "Online"}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />
                <label className="form-check-label ms-2">
                  Online Payment
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="col-lg-4">
            <div className="card shadow border-0 rounded-4 p-4">
              <h5 className="mb-4 fw-bold">Order Summary</h5>

              {cart.items.map((item) => (
                <div
                  key={item._id}
                  className="d-flex justify-content-between mb-2"
                >
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}

              <hr />

              <div className="d-flex justify-content-between mb-3">
                <strong>Total</strong>
                <strong className="text-success">
                  ₹{cart.totalPrice}
                </strong>
              </div>

              <button
                className="btn btn-success w-100 rounded-pill py-2 fw-bold"
                onClick={placeOrder}
                disabled={placingOrder}
              >
                {placingOrder
                  ? "Placing Order..."
                  : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="bg-white p-4 rounded-4 shadow"
            style={{ width: "400px" }}
          >
            <h5 className="mb-3">Add New Address</h5>

            {Object.keys(newAddress).map((key) => (
              <div className="mb-2" key={key}>
                <input
                  className="form-control"
                  placeholder={
                    key === "addressLine"
                      ? "Address Line"
                      : key.charAt(0).toUpperCase() +
                        key.slice(1)
                  }
                  value={newAddress[key]}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      [key]: e.target.value,
                    })
                  }
                />
              </div>
            ))}

            <div className="d-flex justify-content-end mt-3">
              <button
                className="btn btn-secondary me-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={handleAddAddress}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;
