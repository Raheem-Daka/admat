import React, { useState, useEffect } from "react";
import DesignCard from "../components/DesignCard";
import { useNavigate } from "react-router-dom";
import CategoryList from "../components/CartegoryList";
import SearchComponent from "../components/SearchComponent";
import LoadingSkeleton from "../components/LoadingSkeleton";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Products = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const start = Date.now();

    fetch(`${API_BASE}/products/`)
      .then(res => res.json())
      .then(data => {

        const delay = Math.max(800 - (Date.now() - start), 0);

        setTimeout(() => {
          setItems(data.results || []);
          setLoading(false);
        }, delay);
      })
      .catch(err => {
        console.error(err);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });
  }, []);

  const handleNavigate = (id, slug) => {
    console.log(id, slug);
    navigate(`/product/${id}/${slug}`);
  };

  return (
    <div className="px-10">
      <h1 className="text-4xl font-bold text-center pt-10">
        All Products
      </h1>
      <div className="sticky top-0 z-10 bg-white py-2 w-full">

        {/*Search Panel */}
        <div className="">
          <SearchComponent />
        </div>

        <div>
          <CategoryList />
        </div>
      </div>

    {loading ? (
      <LoadingSkeleton className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
      ) : error ? (
        <p className="text-center text-red-500 mt-10">{error}</p>
      ) : (
        <div
          className="
            mt-10
            grid
            grid-cols-1
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-6
            xl:grid-cols-7
            gap-3
          "
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