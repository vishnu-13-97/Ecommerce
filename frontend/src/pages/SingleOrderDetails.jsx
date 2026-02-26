import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api-helper/Axioxinstance";
import { toast } from "react-toastify";

const SingleOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await API.get(`/user/orders/${id}`, {
        withCredentials: true,
      });
      setOrder(res.data.order);
    } catch (error) {
      toast.error("Order not found");
      navigate("/my-orders");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
  try {
    await API.put(`/user/orders/${id}/cancel`, {}, {
      withCredentials: true,
    });

    toast.success("Order cancelled successfully");
    fetchOrder();
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to cancel order"
    );
  }
};

  if (loading) return <p className="text-center py-5">Loading...</p>;

  if (!order) return null;

  return (
    <div className="container py-5 mt-5">
      <h2 className="fw-bold mb-4 mt-5">Order Details</h2>

      <div className="card shadow-sm p-4 rounded-4 border-0">

        {/* Order Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <strong>Order ID:</strong> {order._id}
            <div className="text-muted small">
              {new Date(order.createdAt).toLocaleString()}
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

        <hr />

        {/* Items */}
        <h5 className="mb-3">Items</h5>

        {order.items.map((item) => (
          <div
            key={item._id}
            className="d-flex justify-content-between align-items-center border-bottom py-3"
          >
            <div className="d-flex align-items-center">
              <img
                src={item.product?.images?.[0]?.url || "/placeholder.png"}
                alt={item.product?.name}
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
                className="rounded me-3"
              />

              <div>
                <h6 className="mb-1">
                  {item.product?.name || item.name}
                </h6>
                <small className="text-muted">
                  Quantity: {item.quantity}
                </small>
              </div>
            </div>

            <div className="fw-semibold">
              ₹{item.price * item.quantity}
            </div>
          </div>
        ))}

        <hr />

        {/* Shipping Address */}
        <h5 className="mt-4">Shipping Address</h5>
        <div className="text-muted">
          <div>{order.shippingAddress?.fullName}</div>
          <div>{order.shippingAddress?.addressLine}</div>
          <div>
            {order.shippingAddress?.city},{" "}
            {order.shippingAddress?.state} -{" "}
            {order.shippingAddress?.pincode}
          </div>
          <div>{order.shippingAddress?.country}</div>
          <div>Mobile: {order.shippingAddress?.mobile}</div>
        </div>

        <hr />

        {/* Payment Info */}
        <div className="mt-3">
          <strong>Total Amount:</strong>{" "}
          <span className="text-success fw-bold">
            ₹{order.totalPrice}
          </span>
        </div>

        <div className="text-muted mt-1">
          Payment Method: {order.paymentMethod}
        </div>

        {/* Cancel Button */}
     {["Pending", "Processing", "Shipped"].includes(order.orderStatus) && (
  <button
    className="btn btn-danger mt-4"
    onClick={cancelOrder}
  >
    Cancel Order
  </button>
)}
      </div>
    </div>
  );
};

export default SingleOrder;