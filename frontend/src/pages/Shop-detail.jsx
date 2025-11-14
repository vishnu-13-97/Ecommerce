import React from "react";


const ShopDetail = () => {
  return (
    <>
  

      {/* Single Page Header Start */}
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Shop Detail</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item">
            <a href="#">Home</a>
          </li>
          <li className="breadcrumb-item">
            <a href="#">Pages</a>
          </li>
          <li className="breadcrumb-item active text-white">Shop Detail</li>
        </ol>
      </div>
      {/* Single Page Header End */}

      {/* Single Product Start */}
      <div className="container-fluid py-5 mt-5">
        <div className="container py-5">
          <div className="row g-4 mb-5">
            <div className="col-lg-8 col-xl-9">
              <div className="row g-4">
                <div className="col-lg-6">
                  <div className="border rounded">
                    <img
                      src="img/vegetable-item-6.jpg"
                      className="img-fluid rounded"
                      alt="Product"
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <h4 className="fw-bold mb-3">Organic Tomato</h4>
                  <p className="mb-3">
                    <span className="fw-bold">Category:</span> Vegetables
                  </p>
                  <h5 className="fw-bold mb-3">$4.99 / kg</h5>
                  <p className="mb-4">
                    Fresh, organic, and locally sourced tomatoes packed with
                    natural flavor.
                  </p>

                  <div className="input-group quantity mb-4" style={{ width: "130px" }}>
                    <div className="input-group-btn">
                      <button className="btn btn-sm btn-minus rounded-circle bg-light border">
                        <i className="fa fa-minus"></i>
                      </button>
                    </div>
                    <input
                      type="text"
                      className="form-control form-control-sm text-center border-0"
                      value="1"
                      readOnly
                    />
                    <div className="input-group-btn">
                      <button className="btn btn-sm btn-plus rounded-circle bg-light border">
                        <i className="fa fa-plus"></i>
                      </button>
                    </div>
                  </div>

                  <a href="#" className="btn border border-secondary rounded-pill px-4 py-2 text-primary">
                    <i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Description Tabs */}
          <div className="row g-4">
            <div className="col-lg-8 col-xl-9">
              <div className="border-bottom mb-4">
                <ul className="nav nav-tabs">
                  <li className="nav-item">
                    <a className="nav-link active" data-bs-toggle="tab" href="#desc">
                      Description
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="tab" href="#reviews">
                      Reviews
                    </a>
                  </li>
                </ul>
              </div>

              <div className="tab-content">
                <div className="tab-pane fade show active" id="desc">
                  <p>
                    These tomatoes are grown using sustainable farming methods
                    and without any pesticides. Perfect for salads, sauces, and
                    soups.
                  </p>
                </div>

                <div className="tab-pane fade" id="reviews">
                  <div className="d-flex mb-4">
                    <img
                      src="img/avatar.jpg"
                      className="img-fluid rounded-circle p-2 border"
                      alt="User"
                      style={{ width: "80px", height: "80px" }}
                    />
                    <div className="ms-3">
                      <h6>John Doe</h6>
                      <div className="d-flex mb-2">
                        <i className="fa fa-star text-primary"></i>
                        <i className="fa fa-star text-primary"></i>
                        <i className="fa fa-star text-primary"></i>
                        <i className="fa fa-star text-primary"></i>
                        <i className="fa fa-star"></i>
                      </div>
                      <p>Excellent quality and taste. Definitely recommended!</p>
                    </div>
                  </div>

                  <div className="bg-light p-4 rounded">
                    <h6 className="mb-3">Leave a Review</h6>
                    <form>
                      <div className="mb-3">
                        <label className="form-label">Your Name</label>
                        <input type="text" className="form-control" />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Your Email</label>
                        <input type="email" className="form-control" />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Your Review</label>
                        <textarea className="form-control" rows="4"></textarea>
                      </div>
                      <button type="submit" className="btn btn-primary">
                        Submit Review
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End Tabs */}
        </div>
      </div>
      {/* Single Product End */}

  
    </>
  );
};

export default ShopDetail;
