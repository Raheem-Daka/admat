import React from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const DesignCard = ({ item, onClick }) => {
  if (!item) return null;

  // calculate discount percentage safely
const discountPercent =
  item.price &&
  item.current_price &&
  Number(item.price) !== Number(item.current_price) 
    ? Math.round(
        ((item.price - item.current_price) / item.price) * 100
      )
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
        sm:w-42 md:w-44 lg:w-48
        flex flex-col cursor-pointer bg-white
      "
    >
      {/* Image */}
      <div className="relative flex items-start justify-center h-32 mb-1">
        {discountPercent !== null && (
          <span className="absolute top-2 left-2 text-white text-xs flex">
            <span className="bg-white text-red-500 border px-1 rounded-l">
              MWK {item.price}
            </span>
            <span className="bg-red-600 px-1 rounded-r">
              {discountPercent}% OFF
            </span>
          </span>
        )}
        <img
          src={imageSrc}
          alt={item.name}
          className="min-h-full max-w-full object-cover"
          onError={(e) => (e.currentTarget.src = "/placeholder.png")}
        />     
      
      </div>

      {/* Name */}
      <p className="text-sm font-semibold text-neutral-700 truncate">
        {item.name}
      </p>

      {/* Price */}
      <div className="flex items-center gap-2 mt-1">
        <span className="text-sm font-semibold text-green-600">
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