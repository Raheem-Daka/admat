import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DesignCard from "../components/DesignCard";
import Hero from "../components/Hero";
import DiscountComponent from "../components/DiscountComponent";

const API_BASE = "http://127.0.0.1:8000"

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
    navigate(`/products/${id}/${slug}`);
  };

  return (
    <div>
      <Hero />

      {/* ✅ Products section */}
      <section className="border-t border-slate-100 py-10">
        <h1 className="text-4xl font-bold text-center mb-6">
          All Our Featured Products
        </h1>

        {loading && (
          <p className="text-center text-gray-500 animate-pulse">
            Loading products...
          </p>
        )}

        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 lg:gap-4 md:gap-3 sm:gap-2 px-4">
            {items.map((item) => (
              <DesignCard
                key={item.id}
                item={item}
                onClick={handleCardClick}
              />
            ))}
          </div>
        )}
      </section>

      {/* ✅ Discount slideshow (self‑contained) */}
      <section className="w-full">
        <DiscountComponent />
      </section>
    </div>
  );
};

export default Home;
