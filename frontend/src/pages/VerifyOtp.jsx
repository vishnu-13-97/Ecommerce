import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import API from "../api-helper/Axioxinstance";
const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const email = localStorage.getItem("registerEmail"); // 👈 Saved from register page

    if (!email) {
      setMessage("No email found. Please register again.");
      setLoading(false);
      return;
    }

    try {
      const response = await API.post("/auth/verify-otp", {
        email,
        otp,
      });

      setMessage(response.data.message);
      localStorage.removeItem("registerEmail"); // clean up after success

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     

      {/* Page Header */}
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Verify OTP</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item">
            <a href="/">Home</a>
          </li>
          <li className="breadcrumb-item active text-white">Verify OTP</li>
        </ol>
      </div>

      {/* OTP Verification Section */}
      <div className="container-fluid py-5">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">
              <div className="bg-light p-5 rounded shadow">
                <h2 className="text-center mb-4 text-dark">Enter OTP</h2>

                <form onSubmit={handleVerifyOtp}>
                  <div className="mb-3">
                    <label className="form-label text-dark">OTP</label>
                    <input
                      type="text"
                      className="form-control text-center"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2"
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>

                  {message && (
                    <div className="alert alert-info mt-3 text-center">
                      {message}
                    </div>
                  )}

                  <div className="text-center mt-3">
                    <p>
                      Didn’t receive OTP?{" "}
                      <a href="/signup" className="text-primary fw-bold">
                        Resend
                      </a>
                    </p>
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

export default VerifyOtp;
