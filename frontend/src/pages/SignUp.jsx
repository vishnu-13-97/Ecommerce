import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // ✅ import your context
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const { user,register } = useAuth(); // ✅ using context register method
  useEffect(() => {
    if (user) navigate("/"); 
  }, [user]);

  // Google Signup Script (unchanged)
  useEffect(() => {
    const initializeGoogleSignUp = () => {
      if (window.google && window.google.accounts.id) {
        window.google.accounts.id.initialize({
          client_id: "YOUR_GOOGLE_CLIENT_ID",
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById("googleSignupDiv"),
          { theme: "filled_blue", size: "large", width: 280 }
        );
      }
    };

    const handleGoogleResponse = (response) => {
      console.log("Google Token:", response.credential);
      // send token to backend if needed
    };

    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.onload = initializeGoogleSignUp;
      document.body.appendChild(script);
    } else {
      initializeGoogleSignUp();
    }
  }, []);

  // Handle input changes
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await register(formData); // ✅ using context
      setMessage(res.message || "OTP sent to your email!");
      setTimeout(() => {
        navigate("/verify-otp");
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Page Header */}
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Sign Up</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item"><a href="/">Home</a></li>
          <li className="breadcrumb-item active text-white">Sign Up</li>
        </ol>
      </div>

      {/* Signup Form Section */}
      <div className="container-fluid py-5">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">
              <div className="bg-light p-5 rounded shadow">
                <h2 className="text-center mb-4 text-dark">Create Account</h2>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label text-dark">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-dark">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-dark">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Create a password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2"
                    disabled={loading}
                  >
                    {loading ? "Sending OTP..." : "Sign Up"}
                  </button>

                  {message && (
                    <div className="alert alert-info mt-3 text-center">
                      {message}
                    </div>
                  )}

                  <div className="text-center mt-3">
                    <p>
                      Already have an account?{" "}
                      <a href="/login" className="text-primary fw-bold">
                        Login
                      </a>
                    </p>
                  </div>

                  <div className="text-center mt-3">
                    <div id="googleSignupDiv"></div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
