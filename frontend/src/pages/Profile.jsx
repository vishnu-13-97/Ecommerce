import React, { useEffect, useState } from "react";
import API from "../api-helper/Axioxinstance";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/profile");

        setUser({
          id: res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email,
          phone: res.data.user.phone || "Not Provided",
          avatar: res.data.user.avatar || "/img/team-1.jpg",
          addresses: res.data.user.addresses || [],
          joinedOn: new Date(res.data.user.createdAt).toLocaleDateString(),
        });

        setLoading(false);
      } catch (error) {
        console.error("Profile Fetch Error:", error);
        setUser(null);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="text-center py-5">Loading profile...</p>;

  if (!user)
    return (
      <p className="text-center py-5 text-danger">
        Failed to load profile. Please try again.
      </p>
    );

  return (
    <>
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">My Profile</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item"><a href="/">Home</a></li>
          <li className="breadcrumb-item active text-white">Profile</li>
        </ol>
      </div>

      <div className="container-fluid py-5">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="bg-light p-5 rounded shadow-sm">

                <div className="text-center mb-4">
                  <img
                    src={user.avatar}
                    alt="User Avatar"
                    className="rounded-circle border border-3 border-primary"
                    style={{ width: "120px", height: "120px", objectFit: "cover" }}
                  />
                  <h3 className="mt-3 text-dark">{user.name}</h3>
                  <p className="text-muted mb-1">{user.email}</p>
                  <small className="text-secondary">Joined {user.joinedOn}</small>
                </div>

                <hr className="my-4" />

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-dark fw-bold">Phone</label>
                    <p className="form-control bg-white border-0">{user.phone}</p>
                  </div>

                  {/* Addresses */}
                  <div className="col-12 mt-4">
                    <label className="form-label text-dark fw-bold">Addresses</label>
                    {user.addresses.length > 0 ? (
                      user.addresses.map((address, i) => (
                        <div key={i} className="border rounded p-3 mb-3 bg-white">
                          <p className="mb-1 fw-bold">{address.fullName}</p>
                          <p className="mb-1">{address.street}</p>
                          <p className="mb-1">
                            {address.city}, {address.state}
                          </p>
                          <p className="mb-1">
                            {address.country} – {address.pincode}
                          </p>
                          <small className="text-muted">Phone: {address.phone}</small>
                        </div>
                      ))
                    ) : (
                      <p>No addresses added</p>
                    )}
                  </div>
                </div>

                <div className="text-center mt-5">
                  <button
                    onClick={() => navigate('/profile/edit-profile')}
                    className="btn btn-primary ms-3 px-4 py-2"
                  >
                    Edit Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-secondary ms-3 px-4 py-2"
                  >
                    Logout
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
