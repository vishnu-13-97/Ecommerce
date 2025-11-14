import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function AdminTopbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <header className="d-flex justify-content-between align-items-center px-4 py-2 bg-secondary text-white shadow-sm position-relative">
      <h1 className="fs-4 m-0">Admin Panel</h1>

      <div className="position-relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="btn btn-dark dropdown-toggle"
        >
          {user?.name || "Admin"}
        </button>

        {open && (
          <div
            className="position-absolute bg-white text-dark border rounded shadow-sm"
            style={{
              right: 0,
              top: "100%",
              zIndex: 1000,
              width: "150px",
            }}
          >
            <button
              onClick={logout}
              className="dropdown-item text-start"
              style={{
                background: "none",
                border: "none",
                width: "100%",
                padding: "10px",
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
