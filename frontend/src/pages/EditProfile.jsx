import React, { useEffect, useState } from "react";
import API from "../api-helper/Axioxinstance";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const [user, setUser] = useState({
    name: "",
    phone: "",
    avatar: "",
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await API.get("/auth/profile");

        setUser({
          name: res.data.user.name,
          phone: res.data.user.phone || "",
          avatar: res.data.user.avatar || "",
        });

        setPreview(res.data.user.avatar || null);
        setLoading(false);
      } catch (err) {
        console.error("Fetch profile failed:", err);
        setLoading(false);
      }
    };
    fetchDetails();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUser({ ...user, avatar: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("phone", user.phone);

      if (user.avatar instanceof File) {
        formData.append("image", user.avatar);
      }

      await API.put("/auth/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error("Update error:", err);
      alert("Something went wrong!");
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading) return <p className="text-center py-5">Loading profile...</p>;

  return (
    <>
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Edit Profile</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item"><a href="/">Home</a></li>
          <li className="breadcrumb-item"><a href="/profile">Profile</a></li>
          <li className="breadcrumb-item active text-white">Edit Profile</li>
        </ol>
      </div>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <form
              onSubmit={handleSubmit}
              className="bg-light p-5 rounded shadow-sm"
              encType="multipart/form-data"
            >
              {/* Avatar */}
              <div className="text-center mb-4">
                <img
                  src={preview || "/img/team-1.jpg"}
                  alt="Avatar Preview"
                  className="rounded-circle border border-3 border-primary"
                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                />
                <input
                  type="file"
                  accept="image/*"
                  className="form-control mt-3"
                  onChange={handleAvatar}
                />
              </div>

              {/* Basic Inputs */}
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={user.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center mt-4">
                <button
                  type="submit"
                  className="btn btn-primary px-4 py-2"
                  disabled={btnLoading}
                >
                  {btnLoading ? "Saving..." : "Save Changes"}
                </button>
                <a href="/profile" className="btn btn-outline-secondary ms-3 px-4 py-2">
                  Cancel
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
