import React from "react";
import Slider from "react-slick";

// Import images
import veg1 from "../assets/img/vegetable-item-1.jpg";
import veg3 from "../assets/img/vegetable-item-3.png";
import veg4 from "../assets/img/vegetable-item-4.jpg";
import veg5 from "../assets/img/vegetable-item-5.jpg";
import veg6 from "../assets/img/vegetable-item-6.jpg";

// Import slick styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const vegetables = [
  {
    id: 1,
    img: veg6,
    name: "Parsely",
    price: "$4.99 / kg",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt",
  },
  {
    id: 2,
    img: veg1,
    name: "Parsely",
    price: "$4.99 / kg",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt",
  },
  {
    id: 3,
    img: veg3,
    name: "Banana",
    price: "$7.99 / kg",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt",
  },
  {
    id: 4,
    img: veg4,
    name: "Bell Pepper",
    price: "$7.99 / kg",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt",
  },
  {
    id: 5,
    img: veg5,
    name: "Potatoes",
    price: "$7.99 / kg",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt",
  },
];

const VegetableShop = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="container-fluid vesitable py-5">
      <div className="container py-5">
        <h1 className="mb-0 text-center text-primary">
          Fresh Organic Vegetables
        </h1>
        <Slider {...settings} className="mt-4">
          {vegetables.map((item) => (
            <div key={item.id} className="px-3">
              <div className="border border-primary rounded position-relative vesitable-item bg-white">
                <div className="vesitable-img">
                  <img
                    src={item.img}
                    className="img-fluid w-100 rounded-top"
                    alt={item.name}
                  />
                </div>
                <div
                  className="text-white bg-primary px-3 py-1 rounded position-absolute"
                  style={{ top: "10px", right: "10px" }}
                >
                  Vegetable
                </div>
                <div className="p-4 rounded-bottom">
                  <h4>{item.name}</h4>
                  <p>{item.desc}</p>
                  <div className="d-flex justify-content-between flex-lg-wrap">
                    <p className="text-dark fs-5 fw-bold mb-0">{item.price}</p>
                    <a
                      href="#"
                      className="btn border border-secondary rounded-pill px-3 text-primary"
                    >
                      <i className="fa fa-shopping-bag me-2 text-primary"></i>{" "}
                      Add to cart
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default VegetableShop;
