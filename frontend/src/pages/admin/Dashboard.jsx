import React, { useEffect, useState } from "react";
import API from "../../api-helper/Axioxinstance";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await API.get("/admin/dashboard");
      if (res.data.success) {
        const { stats, recentOrders, topProducts, lowStock, weeklySales } =
          res.data.data;

        setStats(stats);
        setRecentOrders(recentOrders);
        setTopProducts(topProducts);
        setLowStock(lowStock);
        setSalesData(weeklySales);
      }
    } catch (err) {
      console.log("Dashboard fetch failed", err);
    }
  };

  const cardStyle =
    "p-5 rounded shadow bg-white flex flex-col gap-1 border hover:shadow-lg transition";

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Admin Dashboard</h2>

      {/* ===== KPI CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={cardStyle}>
          <h4 className="text-gray-600">Total Users</h4>
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalUsers || 0}
          </p>
        </div>

        <div className={cardStyle}>
          <h4 className="text-gray-600">Total Products</h4>
          <p className="text-3xl font-bold text-indigo-600">
            {stats.totalProducts || 0}
          </p>
        </div>

        <div className={cardStyle}>
          <h4 className="text-gray-600">Total Orders</h4>
          <p className="text-3xl font-bold text-orange-600">
            {stats.totalOrders || 0}
          </p>
        </div>

        <div className={cardStyle}>
          <h4 className="text-gray-600">Total Revenue</h4>
          <p className="text-3xl font-bold text-green-600">
            ₹{(stats.totalRevenue || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* ===== CHART + TOP PRODUCTS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="col-span-2 bg-white p-5 rounded shadow border">
          <h3 className="text-lg font-semibold mb-4">Sales (Last 7 Days)</h3>

          <Line
            data={{
              labels: salesData.map((d) => d.day),
              datasets: [
                {
                  label: "Revenue",
                  data: salesData.map((d) => d.amount),
                  borderColor: "rgb(75, 192, 192)",
                  borderWidth: 3,
                },
              ],
            }}
          />
        </div>

        {/* Top Products */}
        <div className="bg-white p-5 rounded shadow border">
          <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>

          {topProducts.length === 0 ? (
            <p className="text-gray-500">No data available</p>
          ) : (
            topProducts.map((p, index) => (
              <div
                key={p._id}
                className="flex justify-between py-2 border-b last:border-none"
              >
                <span className="font-medium">
                  {index + 1}. {p.name}
                </span>
                <span className="text-blue-600 font-semibold">
                  {p.sold} sold
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ===== RECENT ORDERS + LOW STOCK ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white p-5 rounded shadow border">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>

          {recentOrders.length === 0 ? (
            <p className="text-gray-500">No recent orders</p>
          ) : (
            <table className="table-auto w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">User</th>
                  <th className="text-left">Amount</th>
                  <th className="text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o._id} className="border-b">
                    <td className="py-2">{o.user?.name}</td>
                    <td>₹{o.totalPrice}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded text-white ${
                          o.orderStatus === "Delivered"
                            ? "bg-green-600"
                            : o.orderStatus === "Shipped"
                            ? "bg-blue-600"
                            : o.orderStatus === "Cancelled"
                            ? "bg-red-600"
                            : "bg-yellow-500"
                        }`}
                      >
                        {o.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-5 rounded shadow border">
          <h3 className="text-lg font-semibold mb-4 text-red-600">
            Low Stock Alerts
          </h3>

          {lowStock.length === 0 ? (
            <p className="text-gray-500">No low stock products</p>
          ) : (
            lowStock.map((p) => (
              <div
                key={p._id}
                className="flex justify-between py-2 border-b last:border-none"
              >
                <span>{p.name}</span>
                <span className="text-red-600 font-semibold">
                  {p.stock} left
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
