import React, { useState, useEffect } from "react";
import API from "../api-helper/Axioxinstance";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import indianStates from "../api-helper/States";

export default function AddAddress() {
  const navigate = useNavigate();
  const { id } = useParams(); // detect edit mode
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    pincode: "",
    addressLine: "",
    landmark: "",
    country: "India",
    state: "",
    city: "",
    isDefault: false,
  });

  /* ================= FETCH ADDRESS (EDIT MODE) ================= */

  useEffect(() => {
    if (!isEditMode) return;

    const fetchAddress = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/user/address/${id}`);
        const data = res.data.address || res.data;

        setForm({
          fullName: data.fullName || "",
          mobile: data.mobile || "",
          pincode: data.pincode || "",
          addressLine: data.addressLine || "",
          landmark: data.landmark || "",
          country: data.country || "India",
          state: data.state || "",
          city: data.city || "",
          isDefault: data.isDefault || false,
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load address");
        navigate("/profile/addresses");
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [id, isEditMode, navigate]);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "state" ? { city: "" } : {}),
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /* ================= VALIDATION ================= */

  const validate = () => {
    const newErrors = {};

    if (!form.fullName || form.fullName.length < 3)
      newErrors.fullName = "Full name must be at least 3 characters";

    if (!/^[6-9]\d{9}$/.test(form.mobile))
      newErrors.mobile = "Enter valid 10-digit Indian mobile number";

    if (!/^\d{6}$/.test(form.pincode))
      newErrors.pincode = "Pincode must be 6 digits";

    if (!form.addressLine || form.addressLine.length < 5)
      newErrors.addressLine = "Address must be at least 5 characters";

    if (!form.state)
      newErrors.state = "State is required";

    if (!form.city)
      newErrors.city = "City is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the highlighted errors");
      return false;
    }

    return true;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setBtnLoading(true);

    try {
      if (isEditMode) {
        await API.put(`/user/address/${id}`, form);
        toast.success("Address updated successfully");
      } else {
        await API.post("/user/address", form);
        toast.success("Address added successfully");
      }

      navigate("/profile/addresses");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center py-5">Loading address...</p>;
  }

  /* ================= UI ================= */

  return (
    <div className="container py-5 mb-5" style={{ marginTop: "80px" }}>
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <form
            className="bg-light p-5 rounded shadow-sm"
            onSubmit={handleSubmit}
            noValidate
          >
            <h4 className="mb-4">
              {isEditMode ? "Edit Address" : "Add Address"}
            </h4>

            <div className="row g-3">

              {/* Full Name */}
              <div className="col-md-6">
                <label className="form-label">Full Name *</label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                />
                <div className="invalid-feedback">{errors.fullName}</div>
              </div>

              {/* Mobile */}
              <div className="col-md-6">
                <label className="form-label">Mobile *</label>
                <input
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  className={`form-control ${errors.mobile ? "is-invalid" : ""}`}
                />
                <div className="invalid-feedback">{errors.mobile}</div>
              </div>

              {/* Pincode */}
              <div className="col-md-6">
                <label className="form-label">Pincode *</label>
                <input
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  className={`form-control ${errors.pincode ? "is-invalid" : ""}`}
                />
                <div className="invalid-feedback">{errors.pincode}</div>
              </div>

              {/* Landmark */}
              <div className="col-md-6">
                <label className="form-label">Landmark</label>
                <input
                  name="landmark"
                  value={form.landmark}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              {/* Address Line */}
              <div className="col-12">
                <label className="form-label">Address Line *</label>
                <input
                  name="addressLine"
                  value={form.addressLine}
                  onChange={handleChange}
                  className={`form-control ${errors.addressLine ? "is-invalid" : ""}`}
                />
                <div className="invalid-feedback">{errors.addressLine}</div>
              </div>

              {/* Country */}
              <div className="col-md-4">
                <label className="form-label">Country</label>
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="India">India</option>
                </select>
              </div>

              {/* State */}
              <div className="col-md-4">
                <label className="form-label">State *</label>
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className={`form-control ${errors.state ? "is-invalid" : ""}`}
                >
                  <option value="">Select State</option>
                  {Object.keys(indianStates).map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
                <div className="invalid-feedback">{errors.state}</div>
              </div>

              {/* City */}
              <div className="col-md-4">
                <label className="form-label">City *</label>
                <select
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className={`form-control ${errors.city ? "is-invalid" : ""}`}
                >
                  <option value="">Select City</option>
                  {form.state &&
                    indianStates[form.state]?.map((ct) => (
                      <option key={ct} value={ct}>{ct}</option>
                    ))}
                </select>
                <div className="invalid-feedback">{errors.city}</div>
              </div>

              {/* Default */}
              <div className="col-12">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="isDefault"
                    checked={form.isDefault}
                    onChange={handleChange}
                    id="isDefault"
                  />
                  <label className="form-check-label" htmlFor="isDefault">
                    Set as default address
                  </label>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="text-center mt-4">
              <button
                className="btn btn-primary px-4"
                type="submit"
                disabled={btnLoading}
              >
                {btnLoading
                  ? isEditMode ? "Updating..." : "Saving..."
                  : isEditMode ? "Update Address" : "Add Address"}
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary ms-3"
                onClick={() => navigate("/profile/addresses")}
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
