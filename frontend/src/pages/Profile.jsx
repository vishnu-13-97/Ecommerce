import React, { useEffect, useState } from "react";



const Profile = () => {
  // Example state — replace with data fetched from backend
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+91 98765 43210",
    avatar: "/img/team-1.jpg",
    country: "India",
    state: "Kerala",
    city: "Kochi",
    hobbies: ["Coding", "Reading", "Music"],
    joinedOn: "January 2024",
  });

  useEffect(() => {
    // Example API call
    // fetch("/api/user/profile", { credentials: "include" })
    //   .then((res) => res.json())
    //   .then((data) => setUser(data));
  }, []);

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
                  <div className="col-12">
                    <label className="form-label text-dark fw-bold">Hobbies</label>
                    <div className="d-flex flex-wrap gap-2">
                      {user.hobbies.map((hobby, idx) => (
                        <span key={idx} className="badge bg-secondary text-light px-3 py-2">
                          {hobby}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-center mt-5">
                  <a href="/edit-profile" className="btn btn-primary px-4 py-2">
                    Edit Profile
                  </a>
                  <a href="/logout" className="btn btn-outline-secondary ms-3 px-4 py-2">
                    Logout
                  </a>
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
