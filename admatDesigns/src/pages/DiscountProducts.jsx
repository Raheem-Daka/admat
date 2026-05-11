import React, { useEffect, useState } from "react";
import DesignCard from "../components/DesignCard";
import { useNavigate } from "react-router-dom";
import CategoryList from "../components/CartegoryList";
import SearchComponent from "../components/SearchComponent";


const API_BASE = import.meta.env.VITE_API_BASE_URL;

const DiscountProducts = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/api/products/discounts/`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Discount products API Response:", data);
        setItems(data.items || []);
      })
      .catch((error) => {
        console.error("Error fetching discount products:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleNavigate = (id, slug) => {
    navigate(`/products/${id}/${slug}`);
  };

  return (
    <div className="">
      <h1 className="lg:text-4xl sm:text-2xl font-bold py-10 text-center">
        Get quality products on discount
      </h1>

      {loading && (
        <p className="text-center text-lg text-gray-500 animate-pulse">
          Loading products...
        </p>
      )}

      <div className="w-full">
        <div className="">
          <SearchComponent/>
        </div>
        <div>
          <CategoryList />
        </div>
      </div>

      {!loading && items.length === 0 && (
        <p className="text-center text-gray-500">
          No discounted products available.
        </p>
      )}

      {!loading && items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {items.map((item) => (
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

export default DiscountProducts;