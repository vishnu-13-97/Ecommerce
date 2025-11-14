import { createContext, useContext, useState, useEffect } from "react";
import {
  registerUser,
  verifyOtp,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../api-helper/auth-Api";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [pendingEmail, setPendingEmail] = useState("");
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadUser = async () => {
    const res = await getCurrentUser();
    if (res?.user) {
      setUser(res.user);
    } else {
      setUser(null);
    }
    setLoading(false);
  };
  loadUser();
}, []);


  // Register and store pending email
  const register = async (data) => {
    try {
      const res = await registerUser(data);
      setPendingEmail(data.email);
      return res;
    } catch (err) {
      throw err;
    }
  };

  // Verify OTP and log user in
  const verifyOtpHandler = async (otp) => {
    try {
      const res = await verifyOtp(pendingEmail, otp);
      setUser(res.user);
      setPendingEmail("");
      return res;
    } catch (err) {
      throw err;
    }
  };

  // Login
  const login = async (data) => {
    try {
      const res = await loginUser(data);
      setUser(res.user);
      return res;
    } catch (err) {
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      
    } catch (err) {
      console.error("Logout failed:", err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        verifyOtp: verifyOtpHandler,
        login,
        logout,
        pendingEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
