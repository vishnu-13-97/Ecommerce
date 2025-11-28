import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();

  // Get redirect path from URL
  const redirectPath =
    new URLSearchParams(location.search).get("redirect") || "/";

  useEffect(() => {
    if (user) navigate(redirectPath);
  }, [user, navigate, redirectPath]);

  useEffect(() => {
    const handleGoogleResponse = async (response) => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: response.credential }),
          credentials: "include",
        });

        const data = await res.json();
        if (res.ok) {
          setMessage("Google login successful!");
          setTimeout(() => navigate(redirectPath), 1500);
        } else {
          setMessage(data.message || "Google login failed.");
        }
      } catch (err) {
        console.error(err);
        setMessage("Something went wrong during Google login.");
      }
    };

    const initializeGoogleSignIn = () => {
      if (window.google && window.google.accounts.id) {
        window.google.accounts.id.initialize({
          client_id: "YOUR_GOOGLE_CLIENT_ID",
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById("googleLoginDiv"),
          { theme: "outline", size: "large", width: 280 }
        );
      }
    };

    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
    } else {
      initializeGoogleSignIn();
    }
  }, [navigate, redirectPath]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await login(formData);
      setMessage(res.message || "Logged in successfully!");
      setTimeout(() => navigate(redirectPath), 1500);
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Login</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item"><a href="/">Home</a></li>
          <li className="breadcrumb-item active text-white">Login</li>
        </ol>
      </div>

      <div className="container-fluid py-5">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">
              <div className="bg-light p-5 rounded shadow">
                <h2 className="text-center mb-4 text-dark">Welcome Back</h2>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label text-dark">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-dark">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {message && (
                    <div className="alert alert-info text-center">{message}</div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>

                  <div className="text-center mt-3">
                    <p>
                      Don’t have an account?{" "}
                      <a href="/signup" className="text-primary fw-bold">
                        Sign up
                      </a>
                    </p>
                  </div>

                  <div className="text-center mt-3">
                    <div id="googleLoginDiv"></div>
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

export default Login;
