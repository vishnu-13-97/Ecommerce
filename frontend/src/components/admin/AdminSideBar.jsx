import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Products", path: "/admin/products" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Brands", path: "/admin/brand" },
    { name: "Categories", path: "/admin/category" },
    { name: "Users", path: "/admin/users" },
  ];

  return (
    <aside
      className="bg-dark text-white d-flex flex-column p-3"
      style={{ width: "250px", minHeight: "100vh" }}
    >
      <h2 className="fs-5 fw-bold mb-4">Admin Menu</h2>

      <nav className="nav flex-column">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "bg-secondary" : ""}`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
