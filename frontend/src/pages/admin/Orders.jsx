import { useEffect, useState } from "react";
import API from "../../api-helper/Axioxinstance";

const validStatuses = [
  "Pending",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const getStatusBadge = (status) => {
  const colors = {
    Pending: "secondary",
    Processing: "info",
    Shipped: "primary",
    "Out for Delivery": "warning",
    Delivered: "success",
    Cancelled: "danger",
  };

  return `badge bg-${colors[status] || "secondary"}`;
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await API.get("/admin/orders", {
        params: {
          page,
          status: statusFilter || undefined,
        },
      });

      if (res.data.success) {
        setOrders(res.data.orders);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

 const handleStatusChange = async (orderId, newStatus) => {
  const previousOrders = [...orders];

  // Optimistic update
  const updatedOrders = orders.map((order) =>
    order._id === orderId
      ? { ...order, orderStatus: newStatus }
      : order
  );

  setOrders(updatedOrders);
  setUpdatingId(orderId);
  setError("");

  try {
    const res = await API.put(`/admin/orders/${orderId}`, {
      status: newStatus,
    });

    if (!res.data.success) {
      throw new Error(res.data.message);
    }
  } catch (err) {
    // Revert UI
    setOrders(previousOrders);

    setError(
      err.response?.data?.message ||
      "Failed to update order status"
    );
  } finally {
    setUpdatingId(null);
  }
};

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" />
      </div>
    );

  return (
    <div className="container-fluid">
      <div className="card shadow-sm border-0">
        <div className="card-body">

          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0 fw-bold">Order Management</h4>

            <select
              className="form-select w-auto"
              value={statusFilter}
              onChange={(e) => {
                setPage(1);
                setStatusFilter(e.target.value);
              }}
            >
              <option value="">All Orders</option>
              {validStatuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table align-middle table-hover">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Update</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order, index) => (
                    <tr key={order._id}>
                      <td>{(page - 1) * 10 + index + 1}</td>

                      <td>
                        <div className="fw-semibold">
                          {order.user?.name}
                        </div>
                        <small className="text-muted">
                          {order.user?.email}
                        </small>
                      </td>

                      <td className="fw-bold">₹{order.totalPrice}</td>

                      <td>
                        <span className={getStatusBadge(order.orderStatus)}>
                          {order.orderStatus}
                        </span>
                      </td>

                      <td>
                      <select
  className="form-select form-select-sm"
  value={order.orderStatus}
  onChange={(e) =>
    handleStatusChange(order._id, e.target.value)
  }
  disabled={
    updatingId === order._id ||
    order.orderStatus === "Delivered" ||
    order.orderStatus === "Cancelled"
  }
>
                          {validStatuses.map((status) => (
                            <option key={status}>{status}</option>
                          ))}
                        </select>
                      </td>

                      <td>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {orders.length > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div className="text-muted">
                Page {page} of {totalPages}
              </div>

              <div>
                <button
                  className="btn btn-outline-secondary btn-sm me-2"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </button>

                <button
                  className="btn btn-primary btn-sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}