import React from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import FactSection from "../components/FactSection";
import Services from "../components/Services";
import FruitsSection from "../components/FruitsSection";
import BestSellerProducts from "../components/BestSellerProducts";
import Testimonials from "../components/Testimonials";
import VegitableShop from "../components/VegitableShop";
import Banner from "../components/Banner";

const Home = () => {
  return (
    <>
      <Hero />
     
      <Features />
       <FruitsSection />
      <Services />
     
      <BestSellerProducts />
      <Banner />
      <VegitableShop />
       <FactSection />
      
      <Testimonials />
    </>
  );
};

export default Home;
