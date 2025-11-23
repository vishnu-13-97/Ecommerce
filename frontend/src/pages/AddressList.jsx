import React, { useEffect, useState } from "react";
import API from "../api-helper/Axioxinstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AddressesList() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await API.get("/user/address");
      setAddresses(res.data.addresses || res.data || []);
    } catch (err) {
      console.error("Fetch addresses error:", err);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this address?");
    if (!ok) return;
    try {
      await API.delete(`/address/remove/${id}`);
      toast.success("Address deleted");
      fetchAddresses();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      // call update endpoint with isDefault true; backend should clear others
      await API.put(`/user/address/${id}`, { isDefault: true });
      toast.success("Set as default");
      fetchAddresses();
    } catch (err) {
      console.error(err);
      toast.error("Failed to set default");
    }
  };

  if (loading) return <p className="text-center py-5">Loading addresses...</p>;

  return (
    <div className="container py-5 mb-5" style={{ minHeight: "50vh" , marginTop:"80px"}}>
      <div className="d-flex justify-content-between mb-4">
        <h3>My Addresses</h3>
        <div>
          <button className="btn btn-primary me-2" onClick={() => navigate("/profile/addresses/add")}>
            + Add New Address
          </button>
          <button className="btn btn-outline-secondary" onClick={() => navigate("/profile")}>
            Back to Profile
          </button>
        </div>
      </div>

      {addresses.length === 0 ? (
        <div className="alert alert-info">No addresses found. Add one to get started.</div>
      ) : (
        addresses.map((addr) => (
          <div key={addr._id} className="border rounded p-3 mb-3 bg-white">
            <div className="d-flex justify-content-between">
              <div>
                <p className="mb-1 fw-bold">{addr.fullName}</p>
                <p className="mb-1">{addr.addressLine}</p>
                {addr.landmark && <p className="mb-1">Landmark: {addr.landmark}</p>}
                <p className="mb-1">{addr.city}, {addr.state}</p>
                <p className="mb-1">{addr.country} — {addr.pincode}</p>
                <small className="text-muted">Phone: {addr.mobile}</small>
                {addr.isDefault && <span className="badge bg-success ms-2">Default</span>}
              </div>

              <div className="d-flex flex-column align-items-end">
                <div className="mb-2">
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => navigate(`/profile/address/edit/${addr._id}`)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-outline-danger me-2" onClick={() => handleDelete(addr._id)}>
                    Delete
                  </button>
                </div>

                {!addr.isDefault && (
                  <button className="btn btn-sm btn-primary" onClick={() => handleSetDefault(addr._id)}>
                    Set as default
                  </button>
                )}

              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
