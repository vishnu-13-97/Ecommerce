import React from 'react';


const Checkout = () => {
  return (
    <>
     

      {/* Page Header */}
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Checkout</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item"><a href="#">Home</a></li>
          <li className="breadcrumb-item"><a href="#">Pages</a></li>
          <li className="breadcrumb-item active text-white">Checkout</li>
        </ol>
      </div>

      {/* Checkout Page */}
      <div className="container-fluid py-5">
        <div className="container py-5">
          <h1 className="mb-4">Billing details</h1>
          <form>
            <div className="row g-5">
              {/* Left Side: Billing Form */}
              <div className="col-md-12 col-lg-6 col-xl-7">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-item w-100">
                      <label className="form-label my-3">First Name<sup>*</sup></label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-item w-100">
                      <label className="form-label my-3">Last Name<sup>*</sup></label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                </div>

                <div className="form-item">
                  <label className="form-label my-3">Company Name<sup>*</sup></label>
                  <input type="text" className="form-control" />
                </div>

                <div className="form-item">
                  <label className="form-label my-3">Address<sup>*</sup></label>
                  <input type="text" className="form-control" placeholder="House Number Street Name" />
                </div>

                <div className="form-item">
                  <label className="form-label my-3">Town/City<sup>*</sup></label>
                  <input type="text" className="form-control" />
                </div>

                <div className="form-item">
                  <label className="form-label my-3">Country<sup>*</sup></label>
                  <input type="text" className="form-control" />
                </div>

                <div className="form-item">
                  <label className="form-label my-3">Postcode/Zip<sup>*</sup></label>
                  <input type="text" className="form-control" />
                </div>

                <div className="form-item">
                  <label className="form-label my-3">Mobile<sup>*</sup></label>
                  <input type="tel" className="form-control" />
                </div>

                <div className="form-item">
                  <label className="form-label my-3">Email Address<sup>*</sup></label>
                  <input type="email" className="form-control" />
                </div>

                <div className="form-check my-3">
                  <input type="checkbox" className="form-check-input" id="Account-1" />
                  <label className="form-check-label" htmlFor="Account-1">Create an account?</label>
                </div>

                <hr />

                <div className="form-check my-3">
                  <input className="form-check-input" type="checkbox" id="Address-1" />
                  <label className="form-check-label" htmlFor="Address-1">Ship to a different address?</label>
                </div>

                <div className="form-item">
                  <textarea className="form-control" rows="6" placeholder="Order Notes (Optional)"></textarea>
                </div>
              </div>

              {/* Right Side: Order Summary */}
              <div className="col-md-12 col-lg-6 col-xl-5">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Products</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><img src="img/vegetable-item-2.jpg" alt="" className="img-fluid rounded-circle" style={{ width: '90px', height: '90px' }} /></td>
                        <td className="py-5">Awesome Broccoli</td>
                        <td className="py-5">$69.00</td>
                        <td className="py-5">2</td>
                        <td className="py-5">$138.00</td>
                      </tr>
                      <tr>
                        <td><img src="img/vegetable-item-5.jpg" alt="" className="img-fluid rounded-circle" style={{ width: '90px', height: '90px' }} /></td>
                        <td className="py-5">Potatoes</td>
                        <td className="py-5">$69.00</td>
                        <td className="py-5">2</td>
                        <td className="py-5">$138.00</td>
                      </tr>
                      <tr>
                        <td><img src="img/vegetable-item-3.png" alt="" className="img-fluid rounded-circle" style={{ width: '90px', height: '90px' }} /></td>
                        <td className="py-5">Big Banana</td>
                        <td className="py-5">$69.00</td>
                        <td className="py-5">2</td>
                        <td className="py-5">$138.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="row g-4 text-center align-items-center justify-content-center border-bottom py-3">
                  <div className="col-12">
                    <div className="form-check text-start my-3">
                      <input type="checkbox" className="form-check-input bg-primary border-0" id="Transfer-1" />
                      <label className="form-check-label" htmlFor="Transfer-1">Direct Bank Transfer</label>
                    </div>
                    <p className="text-start text-dark">
                      Make your payment directly into our bank account. Please use your Order ID as the payment reference.
                    </p>
                  </div>
                </div>

                <div className="row g-4 text-center align-items-center justify-content-center pt-4">
                  <button type="button" className="btn border-secondary py-3 px-4 text-uppercase w-100 text-primary">
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

 
    </>
  );
};

export default Checkout;
