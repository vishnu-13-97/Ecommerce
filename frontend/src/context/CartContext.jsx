import { createContext, useContext, useEffect, useState } from "react";
import API from "../api-helper/Axioxinstance";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      const res = await API.get("/user/cart");

      

      const totalItems = res.data?.data?.totalItems || 0;

      setCartCount(totalItems);
    } catch (error) {
      console.log(error);
      
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);