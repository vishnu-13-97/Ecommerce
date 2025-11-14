import API from "../api-helper/Axioxinstance";

// Register user (send OTP)
export const registerUser = async (data) => {
  try {
    const response = await API.post("/auth/register", data);
    return response.data;
  } catch (error) {
    console.error("Register error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to register user");
  }
};

// Verify OTP
export const verifyOtp = async (email, otp) => {
  try {
    const response = await API.post("/auth/verify-otp", { email, otp });
    return response.data;
  } catch (error) {
    console.error("OTP verification error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to verify OTP");
  }
};

// Login user
export const loginUser = async (data) => {
  try {
    const response = await API.post("/auth/login", data);
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to login");
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    const response = await API.post("/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Logout error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to logout");
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await API.get("/auth/profile", { withCredentials: true });
    console.log(response.data);
    
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      return null;
    }
    console.error("Fetch current user error:", error.response?.data || error.message);
    return null; 
  }
};
