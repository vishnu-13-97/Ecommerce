import React, { useEffect, useState } from "react";
import API from "../api-helper/Axioxinstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/user/orders", {
        withCredentials: true,
      });

      setOrders(res.data.orders || []);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === "Delivered") return "bg-success";
    if (status === "Cancelled") return "bg-danger";
    return "bg-warning text-dark";
  };

  if (loading) {
    return <p className="text-center py-5">Loading...</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h3 className="fw-bold">No Orders Found</h3>
        <p className="text-muted">Looks like you haven't placed any orders yet.</p>
        <button
          className="btn btn-success mt-3"
          onClick={() => navigate("/shop")}
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5 mt-5">
      <h2 className="fw-bold mt-4">My Orders</h2>

   {orders.map((order) => (
  <div
    key={order._id}
    className="card shadow-sm border-0 rounded-4 p-4 mb-4"
  >
    {/* CLICKABLE AREA START */}
    <div
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/my-orders/${order._id}`) }
    >
      {/* Order Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <strong>Order ID:</strong> {order._id}
          <div className="text-muted small">
            {new Date(order.createdAt).toLocaleDateString()}
          </div>
        </div>

        <span
          className={`badge ${
            order.orderStatus === "Delivered"
              ? "bg-success"
              : order.orderStatus === "Cancelled"
              ? "bg-danger"
              : "bg-warning text-dark"
          }`}
        >
          {order.orderStatus}
        </span>
      </div>

      {/* Order Items */}
      {order.items.map((item) => (
        <div
          key={item._id}
          className="d-flex align-items-center justify-content-between border-bottom py-3"
        >
          <div className="d-flex align-items-center">
            <img
              src={item.product?.images?.[0]?.url || "/placeholder.png"}
              alt={item.product?.name}
              style={{
                width: "70px",
                height: "70px",
                objectFit: "cover",
              }}
              className="rounded me-3"
            />

            <div>
              <h6 className="mb-1">
                {item.product?.name || item.name}
              </h6>
              <small className="text-muted">
                Qty: {item.quantity}
              </small>
            </div>
          </div>

          <div className="fw-semibold">
            ₹{item.price * item.quantity}
          </div>
        </div>
      ))}
    </div>
    {/* CLICKABLE AREA END */}

    {/* FOOTER (NOT CLICKABLE) */}
    <div className="d-flex justify-content-between mt-3">
      <strong>Total:</strong>
      <strong className="text-success">
        ₹{order.totalPrice}
      </strong>
    </div>

    <div className="mt-2 text-muted">
      Payment Method: {order.paymentMethod}
    </div>
  </div>
))}
 </div>
  );
};

export default MyOrders;