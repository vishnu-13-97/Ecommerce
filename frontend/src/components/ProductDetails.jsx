import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api-helper/Axioxinstance";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";


const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    API.get(`/product/${id}`)
      .then((res) => res.data?.data && setProduct(res.data.data))
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);

  if (!product) return <p className="text-center py-5">Loading...</p>;

  const handleAddToCart = async () => {
  if (product.stock <= 0) {
    toast.error("Out of stock");
    return;
  }

  if (!user) {
    try {
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];
console.log(localCart);

      const existingIdx = localCart.findIndex(
        (item) => item.product === product._id
      );
     


      if (existingIdx >= 0) {
        if (localCart[existingIdx].quantity < product.stock) {
          localCart[existingIdx].quantity += 1;
        } else {
          toast.error("Maximum stock reached");
          return;
        }
      } else {
        localCart.push({
         product: product._id,
  name: product.name,
  price: product.price,
  image: product.images[0]?.url,
  quantity: 1
        });
      }

      localStorage.setItem("cart", JSON.stringify(localCart));
      window.dispatchEvent(new Event("cartUpdated")); // for navbar badge
      toast.success("Added to cart (guest)");
    } catch (err) {
      console.error("Local cart error", err);
      toast.error("Could not add to cart");
    }
    return;
  }

  try {
   await API.post(
      "/user/cart/",
      { productId: product._id, quantity: 1 },
      { withCredentials: true }
    );
    toast.success("Added to cart");
    window.dispatchEvent(new Event("cartUpdated")); // for navbar badge
  } catch (error) {
    console.error(error);
    toast.error("Unable to add to cart");
  }
};



  const handleBuyNow = () => {
    if (!user) {
      navigate(`/login?redirect=/payment/${product._id}`);
    } else {
      navigate(`/payment/${product._id}`);
    }
  };

  return (
    <div className="container py-5 position-relative">
      <button
        onClick={() => navigate("/")}
        className="btn btn-outline-success rounded-pill px-4 py-2 position-absolute"
        style={{ top: "20px", left: "20px", zIndex: 10, fontWeight: "500" }}
      >
        <i className="fa fa-arrow-left me-2"></i> Back to Home
      </button>

      <div
        className="row justify-content-center align-items-center mt-5"
        style={{
          backgroundColor: "#fff",
          borderRadius: "10px",
          padding: "50px",
          boxShadow: "0 0 15px rgba(0,0,0,0.1)",
        }}
      >
        <div className="col-md-5 text-center mb-4 mb-md-0">
          <img
            src={
              product.images?.[0]?.url || "https://via.placeholder.com/400"
            }
            alt={product.name}
            className="img-fluid rounded"
            style={{
              width: "100%",
              maxWidth: "400px",
              height: "400px",
              objectFit: "cover",
            }}
          />
        </div>

        <div className="col-md-6">
          <h2 className="fw-bold mb-3 text-capitalize">{product.name}</h2>
          <p className="text-muted mb-3">{product.description}</p>
          <h4 className="text-success fw-semibold mb-3">₹{product.price}</h4>

          <p><strong>Category:</strong> {product.category?.name || "N/A"}</p>
          <p className="mb-4"><strong>Brand:</strong> {product.brand?.name || "N/A"}</p>

          <div className="d-flex gap-3 flex-wrap">
            <button
              className="btn btn-success rounded-pill px-4 py-2"
              onClick={handleAddToCart}
              style={{ fontWeight: "500" }}
            >
              <i className="fa fa-shopping-bag me-2"></i>
              Add to Cart
            </button>

            <button
              className="btn btn-outline-success rounded-pill px-4 py-2"
              style={{ fontWeight: "500" }}
              onClick={handleBuyNow}
            >
              <i className="fa fa-bolt me-2"></i>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
