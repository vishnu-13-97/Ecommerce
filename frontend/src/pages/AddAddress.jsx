import React, { useState } from "react";
import API from "../api-helper/Axioxinstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import indianStates from "../api-helper/States";

export default function AddAddress() {
  const navigate = useNavigate();
  const [btnLoading, setBtnLoading] = useState(false);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    // reset city if state changed
    if (name === "state") setForm(prev => ({ ...prev, city: "" }));
  };

  const validate = () => {
    if (!form.fullName || !form.mobile || !form.pincode || !form.addressLine || !form.state || !form.city) {
      toast.error("Please fill required fields");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setBtnLoading(true);
    try {
      await API.post("/user/address", { ...form });
      toast.success("Address added");
      navigate("/profile/addresses");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add address");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="container py-5 mb-5" style={{ minHeight: "50vh" , marginTop:"80px"}}>
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <form className="bg-light p-5 rounded shadow-sm" onSubmit={handleSubmit}>
            <h4 className="mb-3">Add Address</h4>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Full Name *</label>
                <input name="fullName" value={form.fullName} onChange={handleChange} className="form-control" required />
              </div>

              <div className="col-md-6">
                <label className="form-label">Mobile *</label>
                <input name="mobile" value={form.mobile} onChange={handleChange} className="form-control" required />
              </div>

              <div className="col-md-6">
                <label className="form-label">Pincode *</label>
                <input name="pincode" value={form.pincode} onChange={handleChange} className="form-control" required />
              </div>

              <div className="col-md-6">
                <label className="form-label">Landmark</label>
                <input name="landmark" value={form.landmark} onChange={handleChange} className="form-control" />
              </div>

              <div className="col-12">
                <label className="form-label">Address Line *</label>
                <input name="addressLine" value={form.addressLine} onChange={handleChange} className="form-control" required />
              </div>

              <div className="col-md-4">
                <label className="form-label">Country</label>
                <select name="country" value={form.country} onChange={handleChange} className="form-control">
                  <option value="India">India</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">State *</label>
                <select name="state" value={form.state} onChange={handleChange} className="form-control">
                  <option value="">Select State</option>
                  {Object.keys(indianStates).map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">City *</label>
                <select name="city" value={form.city} onChange={handleChange} className="form-control">
                  <option value="">Select City</option>
                  {form.state && indianStates[form.state]?.map(ct => <option key={ct} value={ct}>{ct}</option>)}
                </select>
              </div>

              <div className="col-12">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" name="isDefault" id="isDefault" checked={form.isDefault} onChange={handleChange}/>
                  <label className="form-check-label" htmlFor="isDefault">Set as default address</label>
                </div>
              </div>
            </div>

            <div className="text-center mt-4">
              <button className="btn btn-primary px-4" type="submit" disabled={btnLoading}>
                {btnLoading ? "Saving..." : "Add Address"}
              </button>
              <button type="button" className="btn btn-outline-secondary ms-3" onClick={() => navigate("/profile/addresses")}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
