import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-center"
      style={{ minHeight: "70vh" }}
    >
      <h2 className="text-success fw-bold mb-3">
        🎉 Order Placed Successfully!
      </h2>

      <p className="text-muted">Your Order ID:</p>
      <h5 className="mb-4">{orderId}</h5>

      <button
        className="btn btn-success rounded-pill px-4"
        onClick={() => navigate("/my-orders")}
      >
        View My Orders
      </button>
    </div>
  );
};

export default OrderSuccess;