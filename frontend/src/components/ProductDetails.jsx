import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api-helper/Axioxinstance";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchCartCount } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch Product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/product/${id}`);
        if (res.data?.data) {
          setProduct(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // 🔹 Add To Cart
  const handleAddToCart = async () => {
    if (product.stock <= 0) {
      toast.error("Out of stock");
      return;
    }

    // 🚀 Require Login
    if (!user) {
      navigate(`/login?redirect=/product/${product._id}`);
      return;
    }

    try {
      await API.post(
        "/user/cart",
        { productId: product._id, quantity: 1 },
        { withCredentials: true }
      );
      fetchCartCount();
      toast.success("Added to cart");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error(error);
      toast.error("Unable to add to cart");
    }
  };

  // 🔹 Buy Now
  const handleBuyNow = () => {
    if (!user) {
      navigate(`/login?redirect=/payment/${product._id}`);
    } else {
      navigate(`/payment/${product._id}`);
    }
  };

  if (loading) {
    return <p className="text-center py-5">Loading...</p>;
  }

  if (!product) {
    return (
      <p className="text-center py-5 text-danger">
        Product not found
      </p>
    );
  }

  return (
    <div className="container py-5 position-relative">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="btn btn-outline-success rounded-pill px-4 py-2 position-absolute"
        style={{ top: "20px", left: "20px", zIndex: 10, fontWeight: "500" }}
      >
        <i className="fa fa-arrow-left me-2"></i>
        Back to Home
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
        {/* Product Image */}
        <div className="col-md-5 text-center mb-4 mb-md-0">
          <img
            src={
              product.images?.[0]?.url ||
              "https://via.placeholder.com/400"
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

        {/* Product Details */}
        <div className="col-md-6">
          <h2 className="fw-bold mb-3 text-capitalize">
            {product.name}
          </h2>

          <p className="text-muted mb-3">
            {product.description}
          </p>

          <h4 className="text-success fw-semibold mb-3">
            ₹{product.price}
          </h4>

          <p>
            <strong>Category:</strong>{" "}
            {product.category?.name || "N/A"}
          </p>

          <p className="mb-4">
            <strong>Brand:</strong>{" "}
            {product.brand?.name || "N/A"}
          </p>

          <p className="mb-3">
            <strong>Stock:</strong>{" "}
            {product.stock > 0 ? (
              <span className="text-success">
                {product.stock} Available
              </span>
            ) : (
              <span className="text-danger">Out of Stock</span>
            )}
          </p>

          {/* Buttons */}
          <div className="d-flex gap-3 flex-wrap">
            <button
              className="btn btn-success rounded-pill px-4 py-2"
              onClick={handleAddToCart}
              style={{ fontWeight: "500" }}
              disabled={product.stock <= 0}
            >
              <i className="fa fa-shopping-bag me-2"></i>
              Add to Cart
            </button>

            <button
              className="btn btn-outline-success rounded-pill px-4 py-2"
              style={{ fontWeight: "500" }}
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
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
