import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DesignCard from "../components/DesignCard";
import Hero from "../components/Hero";
import DiscountComponent from "../components/DiscountComponent";
import SearchComponent from "../components/SearchComponent";
import CategoryList from "../components/CartegoryList";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/api/products/`)
      .then((res) => res.json())
      .then((productsData) => {
        console.log("Products:", productsData);
        setItems(
          Array.isArray(productsData)
            ? productsData
            : productsData.items || []
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-8 lg:grid-cols-7 lg:gap-4 md:gap-3 sm:gap-2 px-4">
            {items.map((item) => (
              <DesignCard
                key={item.id}
                item={item}
                onClick={handleCardClick}
              />
            ))}
          </div>
        )}

        {/* ✅ Discount slideshow (self‑contained) */}
        <section className="w-full my-10">
          <DiscountComponent />
        </section>

      </section>

    </div>
  );
};

export default Home;
