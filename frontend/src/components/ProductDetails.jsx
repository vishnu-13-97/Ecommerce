import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api-helper/Axioxinstance";
import { useAuth } from "../context/AuthContext";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    API.get(`/product/${id}`)
      .then((res) => {
        if (res.data && res.data.data) setProduct(res.data.data);
      })
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);

  if (!product) return <p className="text-center py-5">Loading...</p>;

  return (
    <div className="container py-5 position-relative">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="btn btn-outline-success rounded-pill px-4 py-2 position-absolute"
        style={{
          top: "20px",
          left: "20px",
          zIndex: 10,
          fontWeight: "500",
        }}
      >
        <i className="fa fa-arrow-left me-2"></i> Back to Home
      </button>

      {/* Product Section */}
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
              product.images && product.images[0]
                ? product.images[0].url
                : "https://via.placeholder.com/400"
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
          <h2 className="fw-bold mb-3 text-capitalize">{product.name}</h2>
          <p className="text-muted mb-3" style={{ lineHeight: "1.6" }}>
            {product.description}
          </p>
          <h4 className="text-success fw-semibold mb-3">₹{product.price}</h4>

          <p className="mb-2">
            <strong>Category:</strong> {product.category?.name || "N/A"}
          </p>
          <p className="mb-4">
            <strong>Brand:</strong> {product.brand?.name || "N/A"}
          </p>

          <div className="d-flex gap-3 flex-wrap">
          
            <button
              className="btn btn-success rounded-pill px-4 py-2"
              style={{ fontWeight: "500" }}
            >
              <i className="fa fa-shopping-bag me-2"></i>
              Add to Cart
            </button>

          
            <button
              className="btn btn-outline-success rounded-pill px-4 py-2"
              style={{ fontWeight: "500" }}
              onClick={() => {
                if (!user) {
                  navigate(`/login?redirect=/payment/${product._id}`);
                } else {
                  navigate(`/payment/${product._id}`);
                }
              }}
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
