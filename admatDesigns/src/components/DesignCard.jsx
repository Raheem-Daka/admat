import React from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const DesignCard = ({ item, onClick }) => {
  if (!item) return null;

  // calculate discount percentage safely
  const price = Number(item.price);
  const currentPrice = Number(item.current_price);

  const discountPercent =
    price > currentPrice
      ? Math.round(((price - currentPrice) / price) * 100)
      : null;

      // choose image with fallback
  const imageSrc =
    item.imageUrl
      ? item.imageUrl.startsWith("http")
        ? item.imageUrl
        : `${API_BASE}${item.imageUrl}`
      : item.images?.length
        ? item.images[0].imageUrl.startsWith("http")
          ? item.images[0].imageUrl
          : `${API_BASE}${item.images[0].imageUrl}`
        : "/placeholder.png";   
                  
  return (
    <div
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter") onClick?.(item.id, item.slug);
    }}
      onClick={() => onClick?.(item.id, item.slug)}
      className="
        border border-zinc-200 hover:border-zinc-300
        transition-colors rounded-xl p-2
        sm:w-44 md:w-46 lg:w-48
        flex flex-col cursor-pointer bg-white
      "
    >
      {/* Image */}
      <div className="relative flex items-start justify-center h-32 mb-1 rounded-lg">

        {/* ✅ Discount Badge */}
        {discountPercent !== null && (
          <div className="absolute top-2 flex items-center text-xs shadow-md z-10">

            <span className="bg-white text-gray-500 px-1 py-1 font-semibold rounded-l line-through border-r">
              MWK {item.price}
            </span>

            <span className="bg-red-600 text-white font-semibold px-1 py-1 rounded-r">
              {discountPercent}% OFF
            </span>

          </div>
        )}

        {/* ✅ Image */}
        <img
          src={imageSrc}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-center object-cover rounded-lg transition-transform duration-300 hover:scale-105"
          onError={(e) => (e.currentTarget.src = "/placeholder.png")}
        />
        
      </div>

      {/* Name */}
      <p className="text-sm font-semibold text-neutral-700 truncate">
        {item.name}
      </p>

      {/* Price */}
      <div className="flex items-center gap-2 mt-1">
        <span className="text-sm font-semibold text-orange-600">
          MWK {item.current_price}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-neutral-600 mt-1 line-clamp-2">
        {item.description}
      </p>
    </div>
  );
};

export default DesignCard;