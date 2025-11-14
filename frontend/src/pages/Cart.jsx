import React, { useEffect } from "react";


const Cart = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when page loads
  }, []);

  return (
    <>
    

      {/* Page Header */}
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Cart</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item"><a href="/">Home</a></li>
          <li className="breadcrumb-item active text-white">Cart</li>
        </ol>
      </div>

      {/* Cart Content */}
      <div className="container-fluid py-5">
        <div className="container py-5">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Products</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><img src="/assets/img/vegetable-item-3.png" alt="banana" className="rounded-circle" width="80" height="80" /></td>
                  <td>Big Banana</td>
                  <td>$2.99</td>
                  <td>1</td>
                  <td>$2.99</td>
                  <td><i className="fa fa-times text-danger"></i></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-end mt-4">
            <input type="text" placeholder="Coupon Code" className="border-0 border-bottom rounded me-3 py-2" />
            <button className="btn border-secondary rounded-pill px-4 py-2 text-primary">Apply Coupon</button>
          </div>
        </div>
      </div>

    
    </>
  );
};

export default Cart;
