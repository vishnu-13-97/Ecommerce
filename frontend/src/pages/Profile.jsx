import React, { useEffect, useState } from "react";
import API from "../api-helper/Axioxinstance";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { logout } = useAuth();
  const navigate = useNavigate();

  // ---- Logout ----
  const handleLogout = async () => {
    try {
      await logout(); 
      navigate("/");  // redirect home after logout
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  // ---- Fetch Profile Data ----
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/profile");

        setUser({
          name: res.data.user.name,
          email: res.data.user.email,
         
          phone: res.data.user.phone || "Not Provided",
          avatar: res.data.user.avatar || "/img/team-1.jpg",
          country: res.data.user.country || "Not Provided",
          state: res.data.user.state || "Not Provided",
          city: res.data.user.city || "Not Provided",
          hobbies: res.data.user.hobbies || [],
          joinedOn: new Date(res.data.user.createdAt).toLocaleDateString(),
        });

        setLoading(false);
      } catch (error) {
        console.error("Profile Fetch Error:", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ---- Loading UI ----
  if (loading) {
    return <p className="text-center py-5">Loading profile...</p>;
  }

  // ---- Error UI ----
  if (!user) {
    return <p className="text-center py-5 text-danger">Failed to load profile</p>;
  }

  return (
    <>
      {/* Page Header */}
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">My Profile</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item"><a href="/">Home</a></li>
          <li className="breadcrumb-item active text-white">Profile</li>
        </ol>
      </div>

      {/* Profile Section */}
      <div className="container-fluid py-5">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="bg-light p-5 rounded shadow-sm">
                
                {/* User Avatar + Name */}
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

                {/* User Details */}
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-dark fw-bold">Phone</label>
                    <p className="form-control bg-white border-0">{user.phone}</p>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-dark fw-bold">Country</label>
                    <p className="form-control bg-white border-0">{user.country}</p>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-dark fw-bold">State</label>
                    <p className="form-control bg-white border-0">{user.state}</p>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-dark fw-bold">City</label>
                    <p className="form-control bg-white border-0">{user.city}</p>
                  </div>

                  {/* Hobbies */}
                  <div className="col-12">
                    <label className="form-label text-dark fw-bold">Hobbies</label>
                    <div className="d-flex flex-wrap gap-2">
                      {user.hobbies.length > 0 ? (
                        user.hobbies.map((hobby, idx) => (
                          <span
                            key={idx}
                            className="badge bg-secondary text-light px-3 py-2"
                          >
                            {hobby}
                          </span>
                        ))
                      ) : (
                        <p>No hobbies added</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="text-center mt-5">
                  <a href="/edit-profile" className="btn btn-primary px-4 py-2">
                    Edit Profile
                  </a>

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
