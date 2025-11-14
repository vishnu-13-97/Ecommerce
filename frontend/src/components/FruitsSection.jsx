import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../api-helper/Axioxinstance";
const FruitsSection = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/category");
        if (res.data && Array.isArray(res.data.data)) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        if (res.data && Array.isArray(res.data.data)) {
          setProducts(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // Filtered products
  const filteredProducts =
    activeTab === "all"
      ? products
      : products.filter((p) => p.category && p.category === activeTab);

  // Handle product click
  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="container-fluid fruite py-5">
      <div className="container py-5">
        <div className="tab-class text-center">
          <div className="row g-4">
            <div className="col-lg-4 text-start">
              <h1>Our Products</h1>
            </div>

            <div className="col-lg-8 text-end">
              <ul className="nav nav-pills d-inline-flex text-center mb-5">
                <li className="nav-item">
                  <button
                    className={`d-flex m-2 py-2 bg-light rounded-pill ${
                      activeTab === "all" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("all")}
                  >
                    <span className="text-dark" style={{ width: "130px" }}>
                      All Products
                    </span>
                  </button>
                </li>

                {categories.map((cat) => (
                  <li className="nav-item" key={cat._id}>
                    <button
                      className={`d-flex m-2 py-2 bg-light rounded-pill ${
                        activeTab === cat._id ? "active" : ""
                      }`}
                      onClick={() => setActiveTab(cat._id)}
                    >
                      <span className="text-dark" style={{ width: "130px" }}>
                        {cat.name}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Product Cards */}
          <div className="tab-content">
            <div className="tab-pane fade show p-0 active">
              <div className="row g-4">
                {filteredProducts.length === 0 ? (
                  <p className="text-center">No products found.</p>
                ) : (
                  filteredProducts.map((product) => (
                    <div
                      className="col-md-6 col-lg-4 col-xl-3"
                      key={product._id}
                    >
                      <div
                        className="rounded position-relative fruite-item"
                        onClick={() => handleProductClick(product._id)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="fruite-img">
                          <img
                            src={
                              product.images && product.images[0]
                                ? product.images[0].url
                                : "https://via.placeholder.com/300"
                            }
                            className="img-fluid w-100 rounded-top"
                            alt={product.name}
                            style={{
                              height: "250px",
                              objectFit: "cover",
                              borderTopLeftRadius: "0.5rem",
                              borderTopRightRadius: "0.5rem",
                            }}
                          />
                        </div>
                        <div
                          className="text-white bg-secondary px-3 py-1 rounded position-absolute"
                          style={{ top: "10px", left: "10px" }}
                        >
                          {categories.find(
                            (cat) => cat._id === product.category
                          )?.name || "Unknown"}
                        </div>
                        <div className="p-4 border border-secondary border-top-0 rounded-bottom">
                          <h4>{product.name}</h4>
                          <p>
                            {product.description?.slice(0, 70) ||
                              "No description available."}
                          </p>
                          <div className="d-flex justify-content-between flex-lg-wrap">
                            <p className="text-dark fs-5 fw-bold mb-0">
                              ₹{product.price}
                            </p>
                            <button className="btn border border-secondary rounded-pill px-3 text-primary">
                              <i className="fa fa-shopping-bag me-2 text-primary"></i>
                              Add to cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FruitsSection;
