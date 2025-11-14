import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import client1 from "../assets/img/testimonial-1.jpg";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      text: "Lorem Ipsum is simply dummy text of the printing Ipsum has been the industry's standard dummy text ever since the 1500s.",
      name: "Client Name",
      profession: "Profession",
      rating: 4,
      img: client1,
    },
    {
      id: 2,
      text: "Lorem Ipsum is simply dummy text of the printing Ipsum has been the industry's standard dummy text ever since the 1500s.",
      name: "Client Name",
      profession: "Profession",
      rating: 5,
      img: client1,
    },
    {
      id: 3,
      text: "Lorem Ipsum is simply dummy text of the printing Ipsum has been the industry's standard dummy text ever since the 1500s.",
      name: "Client Name",
      profession: "Profession",
      rating: 5,
      img: client1,
    },
  ];

  return (
    <div className="container-fluid testimonial py-5">
      <div className="container py-5">
        <div className="testimonial-header text-center mb-5">
          <h4 className="text-primary">Our Testimonial</h4>
          <h1 className="display-5 text-dark">Our Client Saying!</h1>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          spaceBetween={30}
          slidesPerView={3}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
          }}
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="testimonial-item bg-light rounded p-4 position-relative">
                <i
                  className="fa fa-quote-right fa-2x text-secondary position-absolute"
                  style={{ bottom: "30px", right: "0" }}
                ></i>
                <div className="mb-4 pb-4 border-bottom border-secondary">
                  <p className="mb-0">{item.text}</p>
                </div>
                <div className="d-flex align-items-center flex-nowrap">
                  <div className="bg-secondary rounded">
                    <img
                      src={item.img}
                      className="img-fluid rounded"
                      style={{ width: "100px", height: "100px" }}
                      alt={item.name}
                    />
                  </div>
                  <div className="ms-4 d-block">
                    <h4 className="text-dark">{item.name}</h4>
                    <p className="m-0 pb-3">{item.profession}</p>
                    <div className="d-flex pe-5">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fas fa-star ${
                            i < item.rating ? "text-primary" : ""
                          }`}
                        ></i>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Testimonials;
