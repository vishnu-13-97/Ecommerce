import React, { useEffect, useState } from "react";
import API from "../../api-helper/Axioxinstance";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await API.get("/admin/orders");
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  // Update order status
  const updateOrderStatus = async (id, status) => {
    try {
      const res = await API.put(`/admin/order/status/${id}`, { status });
      alert(res.data.message);
      loadOrders();
    } catch (err) {
      console.error("Failed to update order", err);
    }
  };

  // Delete Order
  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await API.delete(`/admin/order/${id}`);
      alert(res.data.message);
      loadOrders();
    } catch (err) {
      console.error("Failed to delete order", err);
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="fw-bold mb-3">Orders</h4>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Delivered At</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center fw-bold">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((o, i) => (
                <tr key={o._id}>
                  <td>{i + 1}</td>

                  <td>
                    <strong>{o.user?.name}</strong>
                    <br />
                    <small>{o.user?.email}</small>
                  </td>

                  <td>
                    {o.items.map((item, index) => (
                      <div key={index}>
                        {item.product?.name} × {item.quantity}  
                        <span className="text-muted">₹{item.price}</span>
                      </div>
                    ))}
                  </td>

                  <td className="fw-bold text-success">₹{o.totalPrice}</td>

                  <td>
                    <span className="badge bg-info">{o.paymentMethod}</span>
                    <br />
                    {o.paymentStatus === "Paid" ? (
                      <span className="badge bg-success mt-1">Paid</span>
                    ) : (
                      <span className="badge bg-warning mt-1">Pending</span>
                    )}
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        o.orderStatus === "Delivered"
                          ? "bg-success"
                          : o.orderStatus === "Shipped"
                          ? "bg-primary"
                          : o.orderStatus === "Cancelled"
                          ? "bg-danger"
                          : "bg-warning"
                      }`}
                    >
                      {o.orderStatus}
                    </span>
                  </td>

                  <td>{o.deliveredAt ? new Date(o.deliveredAt).toLocaleString() : "-"}</td>

                  <td>
                    {/* Status Update Buttons */}
                    <button
                      className="btn btn-sm btn-primary me-2 mb-1"
                      onClick={() => updateOrderStatus(o._id, "Shipped")}
                    >
                      Mark Shipped
                    </button>

                    <button
                      className="btn btn-sm btn-success me-2 mb-1"
                      onClick={() => updateOrderStatus(o._id, "Delivered")}
                    >
                      Mark Delivered
                    </button>

                    <button
                      className="btn btn-sm btn-danger me-2 mb-1"
                      onClick={() => updateOrderStatus(o._id, "Cancelled")}
                    >
                      Cancel
                    </button>

                    {/* Delete */}
                    <button
                      className="btn btn-sm btn-dark"
                      onClick={() => deleteOrder(o._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
