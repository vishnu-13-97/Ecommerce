import React from "react";

const featuresData = [
  {
    icon: "fas fa-car-side",
    title: "Free Shipping",
    text: "Free on order over $300",
  },
  {
    icon: "fas fa-user-shield",
    title: "Security Payment",
    text: "100% security payment",
  },
  {
    icon: "fas fa-exchange-alt",
    title: "30 Day Return",
    text: "30 day money guarantee",
  },
  {
    icon: "fa fa-phone-alt",
    title: "24/7 Support",
    text: "Support every time fast",
  },
];

const Features = () => {
  return (
    <div className="container-fluid featurs py-5">
      <div className="container py-5">
        <div className="row g-4">
          {featuresData.map((feature, index) => (
            <div key={index} className="col-md-6 col-lg-3">
              <div className="featurs-item text-center rounded bg-light p-4">
                <div className="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto">
                  <i className={`${feature.icon} fa-3x text-white`}></i>
                </div>
                <div className="featurs-content text-center">
                  <h5>{feature.title}</h5>
                  <p className="mb-0">{feature.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
