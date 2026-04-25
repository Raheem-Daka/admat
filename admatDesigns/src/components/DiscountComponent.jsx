import React from 'react';
import heroImage from "../assets/heroImage.webp";
import { useNavigate } from 'react-router-dom';

const DiscountComponent = ({ items = [] }) => {
  const navigate = useNavigate();

  const navigateDiscountProducts = () => {
    navigate('/discount_products');
  };

  // Filter items to only those with a discount
  const discountedItems = items.filter(item => item.discount);

  return (
    <section className="flex bg-slate-100 py-20 px-6 justify-center w-full sm:flex-col lg:flex-row items-center gap-8">
      {/* Image Section */}
      <div className="px-6 border p-3 flex flex-grow-0 justify-start items-center">
        {discountedItems.length > 0 ? (
          discountedItems.map((item) => (
            <div
              key={item.id}
              className="border border-zinc-200 hover:border-zinc-300 transition-colors rounded-xl p-4 flex flex-col w-46 cursor-pointer mb-4"
              onClick={() => navigate(`/product/${item.slug}`)}
            >
              {/* Discount badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="bg-lime-300 text-neutral-800 text-xs px-2 py-0.5 rounded-full">
                  <span className="font-bold">{item.discount}</span> off
                </span>
              </div>

              {/* Product image */}
              <div className="flex items-center justify-center h-30 mb-2">
                <img
                  src={item.imageUrl || "https://assets.prebuiltui.com/images/components/card/card-lamp-image.png"}
                  alt={item.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Product name */}
              <p className="text-sm text-neutral-500 mb-2 px-2">{item.name}</p>

              {/* Price */}
              <div className="flex items-center gap-2 px-2">
                <span className="text-sm font-semibold text-neutral-800">
                  {item.price}
                </span>
                <span className="text-xs text-neutral-500 line-through">
                  {item.originalPrice}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-neutral-600 px-2 mt-2">
                {item.description}
              </p>
            </div>
          ))
        ) : (
          <p className="text-2xl text-center text-gray-500 col-span-full">
            No discounted items available.
          </p>
        )}


      </div>

      {/* Text Section */}
      <div className="flex-1 text-center lg:text-left">
        <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
          Transform your living space into a masterpiece.
        </h1>
        <div className="flex flex-col justify-start items-center lg:items-start w-full">
          <p className="mt-4 text-lg font-light max-w-md">
            Discover premium furniture, unique design rights, and creative custom designs 
            to bring marvels into your living space.
          </p>

          <button
            className="flex justify-center items-center mt-6 rounded-xl bg-red-600 lg:px-10 lg:py-3 sm:px-6 sm:py-3 text-white hover:bg-red-700 transition w-40"
            aria-label="View all furniture designs"
            onClick={navigateDiscountProducts}
          >
            View all
          </button>
        </div>
      </div>
    </section>
  );
};

export default DiscountComponent;