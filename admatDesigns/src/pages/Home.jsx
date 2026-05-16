import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from 'react-icons/fa';

import DesignCard from "../components/DesignCard";
import Hero from "../components/Hero";
import DiscountComponent from "../components/DiscountComponent";
import SearchComponent from "../components/SearchComponent";
import CategoryList from "../components/CartegoryList";
import CategoryLayout from "../components/CategoryLayout";
import OurPopularProducts from "../components/OurPopularProductsComponent";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/products/`)
      .then((res) => res.json())
      .then((productsData) => {
        console.log("Products:", productsData);
        setItems(productsData.results|| []
        );
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  const handleCardClick = (id, slug) => {
    navigate(`/product/${id}/${slug}`);
  };
  
  const handleNavigation = () => {
    navigate("/our_popular_products")
  }

  const handleNavProducts = () => {
    navigate("/products")
  }
  return (
    <div>
      <Hero />

      {/* ✅ Products section */}
      <section className="border-t border-slate-100 pb-5">
        <h1 id="products" className="text-4xl font-bold text-center pt-5">
          All Our Featured Products
        </h1>

        <div className="text-center sticky bg-white top-0 z-10 py-1 w-full">
          <SearchComponent />
        </div>


        {loading && (
          <p className="text-center text-gray-500 animate-pulse">
            Loading products...
          </p>
        )}

        {!loading && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-7 lg:grid-cols-6 lg:gap-4 md:gap-3 sm:gap-2 px-4">
              {items.map((item) => (
                <DesignCard
                  key={item.id}
                  item={item}
                  onClick={handleCardClick}
                />
              ))}
            </div>
            <div className="flex justify-center py-10">
              <button 
              onClick={handleNavProducts}
              className="flex items-center gap-2 justify-center rounded bg-indigo-600 text-white px-3 py-2">
                View All
                <FaArrowRight />
              </button>
            </div>

          </div>
        )}

        {/* ✅ Discount slideshow (self‑contained) */}
        <section className="w-full my-10">
          <DiscountComponent />
        </section>

        <div className="overflow-x-scroll">
          <CategoryLayout />
        </div>

        <div>
          <OurPopularProducts />
          <div className="py-10 flex justify-center">
            <button 
            onClick={handleNavigation}
            className="py-2 px-3 flex items-center gap-2 rounded bg-indigo-600 text-white">
                View all
                <FaArrowRight />
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
