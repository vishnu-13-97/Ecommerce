import React from "react";

// Import your images from assets (adjust the path)
import product1 from "../assets/img/best-product-1.jpg";
import product2 from "../assets/img/best-product-2.jpg";
import product3 from "../assets/img/best-product-3.jpg";
import product4 from "../assets/img/best-product-4.jpg";
import product5 from "../assets/img/best-product-5.jpg";
import product6 from "../assets/img/best-product-6.jpg";

import fruit1 from "../assets/img/fruite-item-1.jpg";
import fruit2 from "../assets/img/fruite-item-2.jpg";
import fruit3 from "../assets/img/fruite-item-3.jpg";
import fruit4 from "../assets/img/fruite-item-4.jpg";

const BestsellerProducts = () => {
  const bestsellers = [
    { id: 1, name: "Organic Tomato", img: product1, price: "3.12 $" },
    { id: 2, name: "Organic Tomato", img: product2, price: "3.12 $" },
    { id: 3, name: "Organic Tomato", img: product3, price: "3.12 $" },
    { id: 4, name: "Organic Tomato", img: product4, price: "3.12 $" },
    { id: 5, name: "Organic Tomato", img: product5, price: "3.12 $" },
    { id: 6, name: "Organic Tomato", img: product6, price: "3.12 $" },
  ];

  const fruits = [
    { id: 1, name: "Organic Tomato", img: fruit1, price: "3.12 $" },
    { id: 2, name: "Organic Tomato", img: fruit2, price: "3.12 $" },
    { id: 3, name: "Organic Tomato", img: fruit3, price: "3.12 $" },
    { id: 4, name: "Organic Tomato", img: fruit4, price: "3.12 $" },
  ];

  return (
    <div className="container-fluid py-5">
      <div className="container py-5">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: "700px" }}>
          <h1 className="display-4">Bestseller Products</h1>
          <p>
            Latin words, combined with a handful of model sentence structures,
            to generate Lorem Ipsum which looks reasonable.
          </p>
        </div>

        <div className="row g-4">
          {/* Bestseller Items */}
          {bestsellers.map((item) => (
            <div key={item.id} className="col-lg-6 col-xl-4">
              <div className="p-4 rounded bg-light">
                <div className="row align-items-center">
                  <div className="col-6">
                    <img
                      src={item.img}
                      className="img-fluid rounded-circle w-100"
                      alt={item.name}
                    />
                  </div>
                  <div className="col-6">
                    <a href="#" className="h5">
                      {item.name}
                    </a>
                    <div className="d-flex my-3">
                      {[...Array(4)].map((_, i) => (
                        <i key={i} className="fas fa-star text-primary"></i>
                      ))}
                      <i className="fas fa-star"></i>
                    </div>
                    <h4 className="mb-3">{item.price}</h4>
                    <a
                      href="#"
                      className="btn border border-secondary rounded-pill px-3 text-primary"
                    >
                      <i className="fa fa-shopping-bag me-2 text-primary"></i>
                      Add to cart
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Fruit Items */}
          {fruits.map((item) => (
            <div key={item.id} className="col-md-6 col-lg-6 col-xl-3">
              <div className="text-center">
                <img
                  src={item.img}
                  className="img-fluid rounded"
                  alt={item.name}
                />
                <div className="py-4">
                  <a href="#" className="h5">
                    {item.name}
                  </a>
                  <div className="d-flex my-3 justify-content-center">
                    {[...Array(4)].map((_, i) => (
                      <i key={i} className="fas fa-star text-primary"></i>
                    ))}
                    <i className="fas fa-star"></i>
                  </div>
                  <h4 className="mb-3">{item.price}</h4>
                  <a
                    href="#"
                    className="btn border border-secondary rounded-pill px-3 text-primary"
                  >
                    <i className="fa fa-shopping-bag me-2 text-primary"></i>
                    Add to cart
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestsellerProducts;
