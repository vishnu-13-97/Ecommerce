import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    id: 1,
    text: "Absolutely love this store! The quality of products exceeded my expectations. Delivery was super fast and the packaging was perfect. Will definitely shop again!",
    name: "Priya Sharma",
    profession: "Home Chef · Mumbai",
    rating: 5,
    verified: true,
    product: "Ordered: Kitchen Essentials",
    initials: "PS",
    color: "linear-gradient(135deg,#0d6efd,#6610f2)",
    date: "2 weeks ago",
  },
  {
    id: 2,
    text: "Great experience from start to finish. The app is easy to use, prices are competitive, and customer support resolved my query in minutes. Highly recommended!",
    name: "Rahul Mehta",
    profession: "Software Engineer · Bangalore",
    rating: 5,
    verified: true,
    product: "Ordered: Electronics",
    initials: "RM",
    color: "linear-gradient(135deg,#198754,#0dcaf0)",
    date: "1 month ago",
  },
  {
    id: 3,
    text: "The return process was seamless and the refund came within 3 days. I'm impressed by how easy everything is. The product range is also fantastic — spoilt for choice!",
    name: "Anjali Nair",
    profession: "Teacher · Kochi",
    rating: 4,
    verified: true,
    product: "Ordered: Fashion & Clothing",
    initials: "AN",
    color: "linear-gradient(135deg,#dc3545,#fd7e14)",
    date: "3 weeks ago",
  },
  {
    id: 4,
    text: "I've been shopping here for 6 months now. Best prices in the market and genuine products every time. The loyalty points system is a great bonus too!",
    name: "Vikram Patel",
    profession: "Business Owner · Ahmedabad",
    rating: 5,
    verified: true,
    product: "Ordered: Home & Living",
    initials: "VP",
    color: "linear-gradient(135deg,#6610f2,#d63384)",
    date: "1 week ago",
  },
];

const StarRating = ({ rating }) => (
  <div className="d-flex align-items-center gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <i key={s} className="fas fa-star"
        style={{ fontSize: "0.75rem", color: s <= rating ? "#f59e0b" : "#e2e8f0" }}></i>
    ))}
    <span className="ms-1 fw-semibold text-dark" style={{ fontSize: "0.75rem" }}>{rating}.0</span>
  </div>
);

const Testimonials = () => {
  return (
    <section style={{ background: "linear-gradient(135deg,#f0f4ff 0%,#e8f5e9 100%)" }}
      className="py-5 overflow-hidden">
      <div className="container py-3">

        {/* ── Section Header ── */}
        <div className="text-center mb-5">
          <p className="text-primary fw-semibold mb-1 small d-flex align-items-center justify-content-center gap-2">
            <i className="fas fa-heart" style={{ fontSize: "0.8rem" }}></i>
            CUSTOMER LOVE
          </p>
          <h2 className="fw-bold text-dark mb-2">What Our Customers Say</h2>
          <p className="text-muted small mx-auto mb-4" style={{ maxWidth: 420 }}>
            Thousands of happy shoppers trust us every day. Here's what some of them have to say.
          </p>

          {/* Aggregate rating bar */}
          <div className="d-inline-flex align-items-center gap-3 bg-white rounded-4 px-4 py-3 shadow-sm">
            <div className="text-center">
              <h3 className="fw-bold text-dark mb-0">4.8</h3>
              <div className="d-flex gap-1 justify-content-center">
                {[1,2,3,4,5].map((s) => (
                  <i key={s} className="fas fa-star"
                    style={{ fontSize: "0.7rem", color: s <= 4 ? "#f59e0b" : "#e2e8f0" }}></i>
                ))}
              </div>
            </div>
            <div style={{ width: 1, height: 36, background: "#e2e8f0" }}></div>
            <div className="text-start">
              <p className="fw-bold text-dark mb-0 small">50,000+ Reviews</p>
              <p className="text-muted mb-0" style={{ fontSize: "0.72rem" }}>96% positive feedback</p>
            </div>
          </div>
        </div>

        {/* ── Swiper ── */}
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1200: { slidesPerView: 3 },
          }}
          style={{ paddingBottom: "48px" }}
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="card border-0 rounded-4 shadow-sm h-100"
                style={{ background: "#fff", minHeight: 260 }}>
                <div className="card-body p-4 d-flex flex-column gap-3">

                  {/* Top row: stars + quote icon */}
                  <div className="d-flex align-items-start justify-content-between">
                    <StarRating rating={item.rating} />
                    <div className="d-flex align-items-center justify-content-center rounded-3
                                    bg-primary bg-opacity-10 flex-shrink-0"
                      style={{ width: 36, height: 36 }}>
                      <i className="fas fa-quote-right text-white" style={{ fontSize: "0.9rem" }}></i>
                    </div>
                  </div>

                  {/* Review text */}
                  <p className="text-muted mb-0"
                    style={{
                      fontSize: "0.88rem", lineHeight: 1.7,
                      display: "-webkit-box", WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical", overflow: "hidden",
                      flexGrow: 1,
                    }}>
                    "{item.text}"
                  </p>

                  {/* Product ordered tag */}
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-1"
                      style={{ fontSize: "0.65rem" }}>
                      <i className="fas fa-check-circle me-1" style={{ fontSize: "0.6rem" }}></i>
                      {item.product}
                    </span>
                  </div>

                  {/* Divider */}
                  <div style={{ borderTop: "1px solid #f1f5f9" }}></div>

                  {/* Reviewer info */}
                  <div className="d-flex align-items-center gap-3">
                    {/* Avatar circle */}
                    <div className="rounded-circle d-flex align-items-center justify-content-center
                                    text-white fw-bold flex-shrink-0"
                      style={{
                        width: 44, height: 44, fontSize: "0.85rem",
                        background: item.color,
                      }}>
                      {item.initials}
                    </div>
                    <div className="flex-grow-1 min-width-0">
                      <div className="d-flex align-items-center gap-2">
                        <p className="fw-bold text-dark mb-0 small text-truncate">{item.name}</p>
                        {item.verified && (
                          <i className="fas fa-check-circle text-primary flex-shrink-0"
                            style={{ fontSize: "0.7rem" }} title="Verified Buyer"></i>
                        )}
                      </div>
                      <p className="text-muted mb-0" style={{ fontSize: "0.72rem" }}>
                        {item.profession}
                      </p>
                    </div>
                    <span className="text-muted flex-shrink-0" style={{ fontSize: "0.68rem" }}>
                      <i className="fas fa-clock me-1" style={{ fontSize: "0.6rem" }}></i>
                      {item.date}
                    </span>
                  </div>

                </div>

                {/* Bottom accent */}
                <div style={{ height: 3, background: item.color, borderRadius: "0 0 1rem 1rem" }}></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ── Bottom stat strip ── */}
        <div className="row g-3 mt-2">
          {[
            { value: "50K+",  label: "Happy Customers",  icon: "fa-users",        color: "#0d6efd" },
            { value: "4.8★",  label: "Average Rating",   icon: "fa-star",         color: "#f59e0b" },
            { value: "96%",   label: "Positive Reviews", icon: "fa-thumbs-up",    color: "#198754" },
            { value: "24/7",  label: "Customer Support", icon: "fa-headset",      color: "#6610f2" },
          ].map(({ value, label, icon, color }) => (
            <div key={label} className="col-6 col-md-3">
              <div className="card border-0 rounded-4 text-center p-3 h-100"
                style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)" }}>
                <div className="d-flex align-items-center justify-content-center rounded-3 mx-auto mb-2"
                  style={{ width: 40, height: 40, background: color + "18" }}>
                  <i className={"fas " + icon} style={{ color, fontSize: "1rem" }}></i>
                </div>
                <h5 className="fw-bold text-dark mb-0">{value}</h5>
                <p className="text-muted mb-0" style={{ fontSize: "0.72rem" }}>{label}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;