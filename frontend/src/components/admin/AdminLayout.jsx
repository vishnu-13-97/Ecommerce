import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSideBar";
import AdminTopbar from "./AdminTopBar";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="d-lg-none position-fixed top-0 start-0 w-100 h-100"
          style={{ zIndex: 1040, background: "rgba(0,0,0,0.5)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar handles desktop (in-flow) and mobile (fixed overlay) internally */}
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content fills remaining width */}
      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
        <AdminTopbar onMenuToggle={() => setSidebarOpen((p) => !p)} />
        <main className="flex-grow-1 p-3 p-lg-4" style={{ background: "#f0f2f5" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}