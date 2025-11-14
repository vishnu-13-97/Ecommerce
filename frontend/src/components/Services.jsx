import React from "react";
import featur1 from "../assets/img/featur-1.jpg";
import featur2 from "../assets/img/featur-2.jpg";
import featur3 from "../assets/img/featur-3.jpg";

const servicesData = [
  {
    id: 1,
    img: featur1,
    bgColor: "bg-secondary",
    borderColor: "border-secondary",
    contentBg: "bg-primary",
    titleColor: "text-white",
    title: "Fresh Apples",
    offer: "20% OFF",
  },
  {
    id: 2,
    img: featur2,
    bgColor: "bg-dark",
    borderColor: "border-dark",
    contentBg: "bg-light",
    titleColor: "text-primary",
    title: "Tasty Fruits",
    offer: "Free delivery",
  },
  {
    id: 3,
    img: featur3,
    bgColor: "bg-primary",
    borderColor: "border-primary",
    contentBg: "bg-secondary",
    titleColor: "text-white",
    title: "Exotic Vegetables",
    offer: "Discount 30$",
  },
];

const Services = () => {
  return (
    <div className="container-fluid service py-5">
      <div className="container py-5">
        <div className="row g-4 justify-content-center">
          {servicesData.map((service) => (
            <div key={service.id} className="col-md-6 col-lg-4">
              <a href="#">
                <div
                  className={`service-item ${service.bgColor} rounded ${service.borderColor}`}
                >
                  <img
                    src={service.img}
                    className="img-fluid rounded-top w-100"
                    alt={service.title}
                  />
                  <div className="px-4 rounded-bottom">
                    <div
                      className={`service-content ${service.contentBg} text-center p-4 rounded`}
                    >
                      <h5 className={service.titleColor}>{service.title}</h5>
                      <h3 className="mb-0">{service.offer}</h3>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
