import React, { useEffect, useState } from "react";

const Spinner = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // 1 second fake loading
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div
      id="spinner"
      className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center"
    >
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );
};

export default Spinner;
