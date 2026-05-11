import React, { useState, useEffect } from "react";
import DesignCard from "../components/DesignCard";
import { useNavigate } from "react-router-dom";
import CategoryList from "../components/CartegoryList";
import SearchComponent from "../components/SearchComponent";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Products = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/api/products/`)
      .then(res => res.json())
      .then(data => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleNavigate = (id, slug) => {
    console.log(id, slug);
    navigate(`/product/${id}/${slug}`);
  };

  return (
    <div className="px-6">
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
        <p className="text-center text-gray-500 mt-10">Loading...</p>
      ) : (
        <div
          className="
            mt-10
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-4
            lg:grid-cols-8
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