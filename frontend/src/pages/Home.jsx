import React from "react";
import Hero from "../components/Hero";
import FactSection from "../components/FactSection";
import Services from "../components/Services";

import BestSellerProducts from "../components/BestSellerProducts";
import Testimonials from "../components/Testimonials";

import Banner from "../components/Banner";
import ProductSection from "../components/ProductSection";

const Home = () => {
  return (
    <>
      <Hero />
     
     
       <ProductSection />
      <Services />
     
      <BestSellerProducts />
      <Banner />
    
       <FactSection />
      
      <Testimonials />
    </>
  );
};

export default Home;
