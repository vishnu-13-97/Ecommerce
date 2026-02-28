import React, { useEffect, useState } from "react";
import API from "../api-helper/Axioxinstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Filters
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("desc");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ✅ Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [page, status, sort, startDate, endDate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await API.get("/user/orders", {
        params: {
          page,
          limit: 5,
          status,
          sort,
          startDate,
          endDate,
        },
        withCredentials: true,
      });

      setOrders(res.data.orders || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setStatus("");
    setSort("desc");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  if (loading) {
    return <p className="text-center py-5">Loading...</p>;
  }

  return (
    <div className="container py-5 mt-5">
      <h2 className="fw-bold mb-4 mt-5">My Orders</h2>

      {/* ✅ FILTER SECTION */}
      <div className="card p-3 mb-4 shadow-sm rounded-4">
        <div className="row g-3">

          <div className="col-md-3">
            <select
              className="form-select"
              value={status}
              onChange={(e) => {
                setPage(1);
                setStatus(e.target.value);
              }}
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="desc">Newest</option>
              <option value="asc">Oldest</option>
            </select>
          </div>

          <div className="col-md-2">
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="col-md-3 d-flex gap-2">
            <button
              className="btn btn-success w-100"
              onClick={() => setPage(1)}
            >
              Apply
            </button>

            <button
              className="btn btn-outline-secondary w-100"
              onClick={resetFilters}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* ✅ ORDERS LIST */}
      {orders.length === 0 ? (
        <div className="text-center py-5">
          <h5>No orders found</h5>
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="card shadow-sm border-0 rounded-4 p-4 mb-4"
          >
            <div
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/my-orders/${order._id}`)}
            >
              <div className="d-flex justify-content-between mb-3">
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

              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="d-flex justify-content-between border-bottom py-2"
                >
                  <div>
                    {item.product?.name}
                    <small className="text-muted ms-2">
                      Qty: {item.quantity}
                    </small>
                  </div>

                  <div>₹{item.price * item.quantity}</div>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-between mt-3">
              <strong>Total:</strong>
              <strong className="text-success">
                ₹{order.totalPrice}
              </strong>
            </div>
          </div>
        ))
      )}

      {/* ✅ PAGINATION */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4 gap-2">
          <button
            className="btn btn-outline-dark"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`btn ${
                page === i + 1
                  ? "btn-success"
                  : "btn-outline-dark"
              }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="btn btn-outline-dark"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MyOrders;