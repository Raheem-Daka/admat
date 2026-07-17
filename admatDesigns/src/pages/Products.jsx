import React, { useState, useEffect } from "react";
import DesignCard from "../components/DesignCard";
import { useNavigate } from "react-router-dom";
import CategoryList from "../components/CartegoryList";
import SearchComponent from "../components/SearchComponent";
import FilterBarComponent from "../components/FilterBarComponent";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { apiFetch } from "../api/api";

const Products = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const start = Date.now();

    const fetchProducts = async () => {
      try {
        const data = await apiFetch("/products/");

        const delay = Math.max(500 - (Date.now() - start), 0); // ✅ shorter

        setTimeout(() => {
          setItems(data.results || []);
          setLoading(false);
        }, delay);

      } catch (err) {
        console.error("Product fetch error:", err);

        setError("Failed to load products");

        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    fetchProducts();
  }, []);

  const handleNavigate = (id, slug) => {
    navigate(`/product/${id}/${slug}`);
  };

  return (
    <div className="px-10 ">
      
      <h1 className="text-4xl font-bold text-center">
        All Products
      </h1>

      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white py-2 w-full">
          <SearchComponent />
          <FilterBarComponent />
        <CategoryList />
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <p className="text-center text-red-500 mt-10">
          {error}
        </p>
      ) : (
        <div
          className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]"
        >
          {items.map(item => (
            <DesignCard
              key={item.id}
              item={item}
              onClick={handleNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;