import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api-helper/Axioxinstance";
import { toast } from "react-toastify";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await API.get("/user/cart", {
        withCredentials: true,
      });
      setCart(res.data.data);
    } catch (error) {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  // ➕ Increase Quantity
  const increaseQuantity = async (productId) => {
    try {
      setUpdatingId(productId);

      await API.post(
        "/user/cart",
        { productId, quantity: 1 },
        { withCredentials: true }
      );

      fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating cart");
    } finally {
      setUpdatingId(null);
    }
  };

  // ➖ Decrease Quantity
  const decreaseQuantity = async (productId) => {
    try {
      setUpdatingId(productId);

      await API.delete("/user/cart", {
        data: { productId, quantity: 1 },
        withCredentials: true,
      });

      fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating cart");
    } finally {
      setUpdatingId(null);
    }
  };

  // 🗑 Remove Item Completely
  const removeItem = async (productId) => {
    try {
      setUpdatingId(productId);

      await API.delete("/user/cart", {
        data: { productId, quantity: 999 },
        withCredentials: true,
      });

      toast.success("Item removed");
      fetchCart();
    } catch (error) {
      toast.error("Error removing item");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <p className="text-center py-5">Loading...</p>;
  }

 if (!cart || cart.items.length === 0) {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "70vh" }}
    >
      <div className="text-center">
        <div
          className="mb-4"
          style={{
            fontSize: "80px",
            color: "#28a745",
          }}
        >
          🛒
        </div>

        <h2 className="fw-bold mb-3">Your Cart is Empty</h2>

        <p className="text-muted mb-4">
          Looks like you haven't added anything yet.
        </p>

        <button
          className="btn btn-success rounded-pill px-5 py-2 fw-bold shadow"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}


  return (
    <>
      {/* Header */}
      <div className="container-fluid bg-dark py-5">
        <h1 className="text-center text-white display-5 fw-bold">
          🛒 Your Shopping Cart
        </h1>
      </div>

      <div className="container py-5">
        <div className="row">
          {/* Cart Items */}
          <div className="col-lg-8">
            {cart.items.map((item) => (
              <div
                key={item._id}
                className="card mb-4 shadow-sm border-0 rounded-4"
              >
                <div className="card-body d-flex align-items-center">
                  <img
                    src={
                      item.product?.images?.[0]?.url ||
                      "https://via.placeholder.com/100"
                    }
                    alt={item.product?.name}
                    className="rounded-3"
                    width="100"
                    height="100"
                    style={{ objectFit: "cover" }}
                  />

                  <div className="ms-4 flex-grow-1">
                    <h5 className="fw-bold mb-1">
                      {item.product?.name}
                    </h5>
                    <p className="text-muted mb-2">
                      ₹{item.price}
                    </p>

                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-outline-dark btn-sm rounded-circle"
                        disabled={
                          item.quantity <= 1 ||
                          updatingId === item.product._id
                        }
                        onClick={() =>
                          decreaseQuantity(item.product._id)
                        }
                      >
                        −
                      </button>

                      <span className="px-3 fw-bold">
                        {item.quantity}
                      </span>

                      <button
                        className="btn btn-outline-dark btn-sm rounded-circle"
                        disabled={updatingId === item.product._id}
                        onClick={() =>
                          increaseQuantity(item.product._id)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-end">
                    <h5 className="text-success fw-bold">
                      ₹{item.price * item.quantity}
                    </h5>

                    <button
                      className="btn btn-sm btn-danger mt-2"
                      disabled={updatingId === item.product._id}
                      onClick={() =>
                        removeItem(item.product._id)
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="card shadow border-0 rounded-4 p-4">
              <h4 className="fw-bold mb-4">Order Summary</h4>

              <div className="d-flex justify-content-between">
                <span>Total Items</span>
                <span>{cart.totalItems}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-3">
                <span className="fw-bold">Total Price</span>
                <span className="fw-bold text-success">
                  ₹{cart.totalPrice}
                </span>
              </div>

              <button
                className="btn btn-success w-100 rounded-pill py-2 fw-bold"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
