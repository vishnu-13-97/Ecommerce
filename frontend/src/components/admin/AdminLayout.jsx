import AdminSidebar from "./AdminSideBar";
import AdminTopbar from "./AdminTopBar";

export default function AdminLayout({ children }) {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <div className="flex-grow-1 d-flex flex-column">
        <AdminTopbar />
        <main className="flex-grow-1 p-4 bg-light">{children}</main>
      </div>
    </div>
  );
}
