import React, { useEffect, useState } from "react";

import heroImg1 from "../assets/img/hero-img-1.png";
import heroImg2 from "../assets/img/hero-img-2.jpg";
import { IoIosSearch } from "react-icons/io";
import API from '../api-helper/Axioxinstance'
const Hero = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from your API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/category");
        if (res.data && Array.isArray(res.data.data)) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fallback data when API has no categories
  const fallbackCategories = [
    { name: "Fruits", image: { url: heroImg1 } },
    { name: "Vegetables", image: { url: heroImg2 } },
  ];

  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

  return (
    <div className="container-fluid py-5 mb-5 hero-header">
      <div className="container py-5">
        <div className="row g-5 align-items-center">
          {/* Text Section */}
          <div className="col-md-12 col-lg-7">
            <h4 className="mb-3 text-secondary">100% Trustable</h4>
            <h1 className="mb-5 display-3 text-primary">
              Your Complete Shopping Partner
            </h1>
            <div className="position-relative mx-auto">
              <input
                className="form-control border-2 border-secondary w-75 py-3 px-4 rounded-pill"
                type="text"
                placeholder="Search"
              />
              <button
                type="submit"
                className="btn btn-primary border-2 border-secondary py-3 px-4 position-absolute rounded-pill text-white h-100"
                style={{ top: 0, right: "25%" }}
              >
                <IoIosSearch size={30} />
              </button>
            </div>
          </div>

          {/* Carousel Section */}
          <div className="col-md-12 col-lg-5">
            <div
              id="carouselId"
              className="carousel slide position-relative"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner" role="listbox">
                {loading ? (
                  <div className="text-center py-5">Loading...</div>
                ) : (
                  displayCategories.map((cat, index) => (
                    <div
                      key={cat._id || index}
                      className={`carousel-item ${index === 0 ? "active" : ""} rounded`}
                    >
                      <img
                        src={cat.image?.url || heroImg1}
                        className="img-fluid rounded"
                        alt={cat.name}
                        style={{
                          width: "100%",
                          height: "350px", 
                          objectFit: "cover", 
                          backgroundColor: "#f8f9fa",
                        }}
                      />
                      <a
                        href={`/category/${cat.slug || cat.name.toLowerCase()}`}
                        className="btn px-4 py-2 text-white rounded"
                      >
                        {cat.name}
                      </a>
                    </div>
                  ))
                )}
              </div>

              {/* Carousel Controls */}
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselId"
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselId"
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
