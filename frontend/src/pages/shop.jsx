import React from "react";


const Shop = () => {
  return (
    <>
    

      {/* Page Header */}
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Shop</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item">
            <a href="#">Home</a>
          </li>
          <li className="breadcrumb-item">
            <a href="#">Pages</a>
          </li>
          <li className="breadcrumb-item active text-white">Shop</li>
        </ol>
      </div>

      {/* Fruits Shop Start */}
      <div className="container-fluid fruite py-5">
        <div className="container py-5">
          <h1 className="mb-4">Fresh fruits shop</h1>
          <div className="row g-4">
            <div className="col-lg-12">
              <div className="row g-4">
                <div className="col-xl-3">
                  <div className="input-group w-100 mx-auto d-flex">
                    <input
                      type="search"
                      className="form-control p-3"
                      placeholder="keywords"
                      aria-describedby="search-icon-1"
                    />
                    <span id="search-icon-1" className="input-group-text p-3">
                      <i className="fa fa-search"></i>
                    </span>
                  </div>
                </div>
                <div className="col-6"></div>
                <div className="col-xl-3">
                  <div className="bg-light ps-3 py-3 rounded d-flex justify-content-between mb-4">
                    <label htmlFor="fruits">Default Sorting:</label>
                    <select
                      id="fruits"
                      name="fruitlist"
                      className="border-0 form-select-sm bg-light me-3"
                    >
                      <option value="volvo">Nothing</option>
                      <option value="saab">Popularity</option>
                      <option value="opel">Organic</option>
                      <option value="audi">Fantastic</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="row g-4">
                {/* Sidebar */}
                <div className="col-lg-3">
                  <div className="row g-4">
                    <div className="col-lg-12">
                      <div className="mb-3">
                        <h4>Categories</h4>
                        <ul className="list-unstyled fruite-categorie">
                          {["Apples", "Oranges", "Strawberry", "Banana", "Pumpkin"].map((cat, i) => (
                            <li key={i}>
                              <div className="d-flex justify-content-between fruite-name">
                                <a href="#">
                                  <i className="fas fa-apple-alt me-2"></i>
                                  {cat}
                                </a>
                                <span>({Math.floor(Math.random() * 8) + 1})</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="mb-3">
                        <h4 className="mb-2">Price</h4>
                        <input
                          type="range"
                          className="form-range w-100"
                          id="rangeInput"
                          name="rangeInput"
                          min="0"
                          max="500"
                        />
                        <output id="amount">0</output>
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="mb-3">
                        <h4>Additional</h4>
                        {["Organic", "Fresh", "Sales", "Discount", "Expired"].map(
                          (label, i) => (
                            <div className="mb-2" key={i}>
                              <input
                                type="radio"
                                className="me-2"
                                id={`Categories-${i}`}
                                name="Categories"
                              />
                              <label htmlFor={`Categories-${i}`}>{label}</label>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <h4 className="mb-3">Featured products</h4>
                      {[1, 2, 3].map((num) => (
                        <div
                          className="d-flex align-items-center justify-content-start mb-3"
                          key={num}
                        >
                          <div
                            className="rounded me-4"
                            style={{ width: "100px", height: "100px" }}
                          >
                            <img
                              src={`/assets/img/featur-${num}.jpg`}
                              className="img-fluid rounded"
                              alt=""
                            />
                          </div>
                          <div>
                            <h6 className="mb-2">Big Banana</h6>
                            <div className="d-flex mb-2">
                              {[1, 2, 3, 4].map((star) => (
                                <i
                                  key={star}
                                  className="fa fa-star text-secondary"
                                ></i>
                              ))}
                              <i className="fa fa-star"></i>
                            </div>
                            <div className="d-flex mb-2">
                              <h5 className="fw-bold me-2">2.99 $</h5>
                              <h5 className="text-danger text-decoration-line-through">
                                4.11 $
                              </h5>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="d-flex justify-content-center my-4">
                        <a
                          href="#"
                          className="btn border border-secondary px-4 py-3 rounded-pill text-primary w-100"
                        >
                          View More
                        </a>
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="position-relative">
                        <img
                          src="/assets/img/banner-fruits.jpg"
                          className="img-fluid w-100 rounded"
                          alt=""
                        />
                        <div
                          className="position-absolute"
                          style={{
                            top: "50%",
                            right: "10px",
                            transform: "translateY(-50%)",
                          }}
                        >
                          <h3 className="text-secondary fw-bold">
                            Fresh <br /> Fruits <br /> Banner
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Grid */}
                <div className="col-lg-9">
                  <div className="row g-4 justify-content-center">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <div
                        className="col-md-6 col-lg-6 col-xl-4"
                        key={num}
                      >
                        <div className="rounded position-relative fruite-item">
                          <div className="fruite-img">
                            <img
                              src={`/assets/img/fruite-item-${num}.jpg`}
                              className="img-fluid w-100 rounded-top"
                              alt=""
                            />
                          </div>
                          <div
                            className="text-white bg-secondary px-3 py-1 rounded position-absolute"
                            style={{ top: "10px", left: "10px" }}
                          >
                            Fruits
                          </div>
                          <div className="p-4 border border-secondary border-top-0 rounded-bottom">
                            <h4>Fruit #{num}</h4>
                            <p>
                              Lorem ipsum dolor sit amet consectetur adipisicing
                              elit sed do eiusmod te incididunt
                            </p>
                            <div className="d-flex justify-content-between flex-lg-wrap">
                              <p className="text-dark fs-5 fw-bold mb-0">
                                $4.99 / kg
                              </p>
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

                    <div className="col-12">
                      <div className="pagination d-flex justify-content-center mt-5">
                        <a href="#" className="rounded">
                          &laquo;
                        </a>
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <a
                            key={n}
                            href="#"
                            className={`rounded ${n === 1 ? "active" : ""}`}
                          >
                            {n}
                          </a>
                        ))}
                        <a href="#" className="rounded">
                          &raquo;
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    
    </>
  );
};

export default Shop;
