import React from "react";


const NotFound = () => {
  return (
    <>
   
    <div className="container-fluid py-5">
      <div className="container py-5 text-center">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <i className="bi bi-exclamation-triangle display-1 text-secondary"></i>
            <h1 className="display-1">404</h1>
            <h1 className="mb-4">Page Not Found</h1>
            <p className="mb-4">
              We’re sorry, the page you have looked for does not exist on our website! 
              Please return to the home page or try searching again.
            </p>
            <a 
              href="/" 
              className="btn border-secondary rounded-pill py-3 px-5"
            >
              Go Back To Home
            </a>
          </div>
        </div>
      </div>
    </div>
   
    </>
  );
};

export default NotFound;
