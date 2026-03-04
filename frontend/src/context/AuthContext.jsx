import { createContext, useContext, useState, useEffect } from "react";
import {
  registerUser,
  verifyOtp,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../api-helper/auth-Api";
import API from "../api-helper/Axioxinstance";

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
    const res = await registerUser(data);
    setPendingEmail(data.email);
    return res;
  };

  // Verify OTP and log user in
  const verifyOtpHandler = async (otp) => {
    const res = await verifyOtp(pendingEmail, otp);
    setUser(res.user);
    setPendingEmail("");
    return res;
  };

  // Email/password login
  const login = async (data) => {
    try {
      const res = await loginUser(data);
      setUser(res.user);
      await mergGuestCart();
      return res;
    } catch (err) {
      throw err;
    }
  };

  // Google OAuth login — called after the Google credential is verified by your backend
  const loginWithGoogle = async (data) => {
    try {
      // data = whatever your /auth/google endpoint returns, e.g. { user, message }
      setUser(data.user);
      await mergGuestCart();
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Shared helper: merge guest cart into user cart after any login
  const mergGuestCart = async () => {
    const guestCart = localStorage.getItem("cart");
    if (guestCart) {
      try {
        await API.post("/user/cart/merge", {
          items: JSON.parse(guestCart),
        });
        localStorage.removeItem("cart");
      } catch (err) {
        // Non-fatal — don't block login if cart merge fails
        console.warn("Cart merge failed:", err.message);
      }
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
        loginWithGoogle,
        logout,
        pendingEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);