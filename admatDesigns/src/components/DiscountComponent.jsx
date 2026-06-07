import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const DiscountComponent = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [current, setCurrent] = useState(0);

  const navigateDiscountProducts = () => {
    navigate("/discount_products");
  };

  const handleNavigate = (id, slug) => {
    navigate(`/products/${id}/${slug}`);
  };

  // ✅ Only discounted products
  const discountedItems = items.filter(
    (item) => Number(item.current_price) < Number(item.price)
  );

  useEffect(() => {
    fetch(`${API_BASE}/products/discounts/`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items || []);
      })
      .catch((err) =>
        console.error("Error fetching discount products:", err)
      );
  }, []);

  // ✅ Auto-slide logic
  useEffect(() => {
    if (discountedItems.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % discountedItems.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [discountedItems.length]);

  return (
    <div className="flex bg-slate-100 py-20 px-6 justify-center w-full sm:flex-col md:flex-col lg:flex-row items-center gap-10">
      {/* ✅ Slideshow */}
      <div className="relative w-full max-w-md h-64 overflow-hidden rounded-xl bg-white shadow">
        {discountedItems.length > 0 ? (
          discountedItems.map((item, index) => {
            const imageSrc = item.imageUrl.startsWith("http")
              ? item.imageUrl
              : `${API_BASE}${item.imageUrl}`;

            return (
              <img
                key={item.id}
                src={imageSrc}
                alt={item.name}
                onClick={() => handleNavigate(item.id, item.slug)}
                className={`absolute inset-0 w-full h-full object-cover cursor-pointer transition-opacity duration-700 ${
                  index === current ? "opacity-100" : "opacity-0"
                }`}
              />
            );
          })
        ) : (
          <div className="flex items-center justify-center w-full h-full text-slate-500">
            No discount images available
          </div>
        )}

        {/* ✅ Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {discountedItems.map((_, index) => (
            <span
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === current ? "bg-red-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ✅ Text */}
      <div className="flex-1 text-center lg:text-left">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800">
          Transform your living space into a masterpiece.
        </h1>

        <p className="mt-4 text font-light max-w-md mx-auto lg:mx-0 text-gray-500">
          Discover premium furniture, exclusive discounts, and stunning designs
          to bring marvels into your living space.
        </p>

        <button
          className="mt-6 rounded-xl bg-red-600 px-10 py-3 text-white hover:bg-red-700 transition"
          onClick={navigateDiscountProducts}
        >
          View all
        </button>
      </div>
    </div>
  );
};

export default DiscountComponent;