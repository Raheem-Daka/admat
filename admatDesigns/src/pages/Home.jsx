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
import NewsLetterComponent from "../components/NewsLetterComponent";
import LoadingSkeleton from "../components/LoadingSkeleton";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    const start = Date.now();

    fetch(`${API_BASE}/products/`)
      .then((res) => res.json())
      .then((productsData) => {
        const delay = Math.max(800 - (Date.now() - start), 0);

        setTimeout(() => {
          setItems(productsData.results || []);
          setLoading(false);
        }, delay);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError("Failed to load products");

        setTimeout(() => {
          setLoading(false);
        }, 800);
      });
  }, []);

  const handleCardClick = (id, slug) => {
    navigate(`/product/${id}/${slug}`);
  };
  
  const handleNavigation = () => {
    navigate("/popular-products")
  }

  const handleNavProducts = () => {
    navigate("/products")
  }
  return (
    <div>
      <Hero />

      {/* ✅ Products section */}
      <section className="border-t border-slate-100 pb-5">
        <h1 
        id="products" 
        className="text-4xl font-bold text-center pt-5">
          All Our Featured Products
        </h1>

        <div className="text-center sticky bg-white top-0 py-1 w-full z-[500]">
          <SearchComponent />
        </div>


        {loading ? (
          <div className="flex flex-col items-center justify-center w-full py-10">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-500">Loading products...</p>
          </div>        
        ) : error ? (
          <p className="text-center text-red-500 mt-10">{error}</p>
        ) : (
          <div className="py-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 lg:gap-4 md:gap-3 sm:gap-2 px-4">
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
                className="flex items-center gap-2 justify-center cursor-pointer rounded bg-linear-to-b from-orange-600 to-orange-800 text-orange-100 transition hover:from-orange-700 hover:to-orange-900 px-3 py-2"
              >
                View All
                <FaArrowRight />
              </button>
            </div>
          </div>
        )}

        {/* Discount slideshow (self‑contained) */}
        <section className="w-full my-10">
          <DiscountComponent />
        </section>

        {/* Category Section */}
      {loading ? (
          <div className="flex flex-col items-center justify-center w-full py-10">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-500">Loading categories...</p>
          </div>        
        ) : error ? (
          <p className="text-center text-red-500 mt-10">{error}</p>
        ) : (
          <div>
            <CategoryLayout />
          </div>
        )}

        {/*Popular Products */}
        <div className="w-full py-10 bg-gray-50 my-10">
          <h1 className="text-3xl font-semibold text-center">
          Our Most Popular Furniture
          </h1>

          <p className="text-sm text-slate-500 text-center mt-2 max-w-lg mx-auto">
          A visual collection of our best selling works.
          </p>
          <div className="w-full
          ">
            <OurPopularProducts />
          </div>
          <div className="py-10 flex justify-center">
            <button 
            onClick={handleNavigation}
            className="py-2 px-3 flex items-center gap-2 cursor-pointer rounded bg-linear-to-b from-orange-600 to-orange-800 text-orange-100 transition hover:from-orange-700 hover:to-orange-900">
                View all
                <FaArrowRight />
            </button>
          </div>

        </div>

        <div className="mx-auto w-full flex justify-center">
          <NewsLetterComponent />
        </div>
      </section>

    </div>
  );
};

export default Home;
