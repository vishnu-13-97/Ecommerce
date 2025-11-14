import React from "react";
import payment from "../assets/img/payment.png";

const Footer = () => {
  return (
    <>
      <div className="container-fluid bg-dark text-white-50 footer pt-5 mt-5">
        <div className="container py-5">
          <div
            className="pb-4 mb-4"
            style={{ borderBottom: "1px solid rgba(226, 175, 24, 0.5)" }}
          >
            <div className="row g-4">
              <div className="col-lg-3">
                <a href="#">
                  <h1 className="text-primary mb-0">Fruitables</h1>
                  <p className="text-secondary mb-0">Fresh products</p>
                </a>
              </div>
              <div className="col-lg-6">
                <div className="position-relative mx-auto">
                  <input
                    className="form-control border-0 w-100 py-3 px-4 rounded-pill"
                    type="email"
                    placeholder="Your Email"
                  />
                  <button
                    type="submit"
                    className="btn btn-primary border-0 border-secondary py-3 px-4 position-absolute rounded-pill text-white"
                    style={{ top: 0, right: 0 }}
                  >
                    Subscribe Now
                  </button>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="d-flex justify-content-end pt-3">
                  {["twitter", "facebook-f", "youtube", "linkedin-in"].map(
                    (icon, i) => (
                      <a
                        key={i}
                        className="btn btn-outline-secondary me-2 btn-md-square rounded-circle"
                        href="#"
                      >
                        <i className={`fab fa-${icon}`}></i>
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="row g-5">
            <div className="col-lg-3 col-md-6">
              <div className="footer-item">
                <h4 className="text-light mb-3">Why People Like us!</h4>
                <p>
                  typesetting, remaining essentially unchanged. It was
                  popularised in the 1960s with the like Aldus PageMaker.
                </p>
                <a href="#" className="btn border-secondary py-2 px-4 rounded-pill text-primary">
                  Read More
                </a>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="d-flex flex-column text-start footer-item">
                <h4 className="text-light mb-3">Shop Info</h4>
                {[
                  "About Us",
                  "Contact Us",
                  "Privacy Policy",
                  "Terms & Condition",
                  "Return Policy",
                  "FAQs & Help",
                ].map((link, i) => (
                  <a key={i} className="btn-link" href="#">
                    {link}
                  </a>
                ))}
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="d-flex flex-column text-start footer-item">
                <h4 className="text-light mb-3">Account</h4>
                {[
                  "My Account",
                  "Shop details",
                  "Shopping Cart",
                  "Wishlist",
                  "Order History",
                  "International Orders",
                ].map((link, i) => (
                  <a key={i} className="btn-link" href="#">
                    {link}
                  </a>
                ))}
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="footer-item">
                <h4 className="text-light mb-3">Contact</h4>
                <p>Address: 1429 Netus Rd, NY 48247</p>
                <p>Email: Example@gmail.com</p>
                <p>Phone: +0123 4567 8910</p>
                <p>Payment Accepted</p>
                <img src={payment} className="img-fluid" alt="payment methods" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="container-fluid copyright bg-dark py-4">
        <div className="container text-center text-md-start text-light">
          <p className="mb-0">
            © <a href="#">Your Site Name</a>. All rights reserved. | Designed By{" "}
            <a href="https://htmlcodex.com" target="_blank" rel="noreferrer">
              HTML Codex
            </a>{" "}
            & Distributed By{" "}
            <a href="https://themewagon.com" target="_blank" rel="noreferrer">
              ThemeWagon
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Footer;
