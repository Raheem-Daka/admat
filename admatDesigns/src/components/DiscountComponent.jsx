import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/discounts/")
      .then((response) => response.json())
      .then((data) => {
        console.log("Discount products API Response:", data);
        setItems(data.items || []);
      })
      .catch((error) =>
        console.error("Error fetching discount products:", error)
      );
  }, []);

  // ✅ Extract ONLY discounted item images
  const discountImages = items
    .filter(
      (item) =>
        Number(item.current_price) < Number(item.price) &&
        item.imageUrl
    )
    .map((item) => item.imageUrl);

  // ✅ Auto-slide logic
  useEffect(() => {
    if (discountImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % discountImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [discountImages.length]);

  return (
    <div className="flex bg-slate-100 py-20 px-6 justify-center w-full sm:flex-col lg:flex-row items-center gap-10">

      {/* ✅ Slideshow Section */}
      <div className="relative w-full max-w-md h-64 overflow-hidden rounded-xl bg-white shadow">
        {discountImages.length > 0 ? (
          discountImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt="Discount products"
              onClick={handleNavigate}
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ${
                index === current ? "opacity-100" : "opacity-0"
              }`}
            />
          ))
        ) : (
          <div className="flex items-center justify-center w-full h-full text-slate-500">
            No discount images available
          </div>
        )}

        {/* ✅ Dots indicator */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {discountImages.map((_, index) => (
            <span
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === current ? "bg-red-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ✅ Text Section */}
      <div className="flex-1 text-center lg:text-left">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800">
          Transform your living space into a masterpiece.
        </h1>

        <p className="mt-4 text-lg font-light max-w-md mx-auto lg:mx-0">
          Discover premium furniture, exclusive discounts, and stunning designs
          to bring marvels into your living space.
        </p>

        <button
          className="mt-6 rounded-xl bg-red-600 px-10 py-3 text-white hover:bg-red-700 transition"
          onClick={navigateDiscountProducts}
          aria-label="View all discounted products"
        >
          View all
        </button>
      </div>
    </div>
  );
};

export default DiscountComponent;