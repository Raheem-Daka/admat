import React from "react";

const DesignCard = ({ items = [], onClick, loading }) => {
  return (
    <div className="container mx-auto px-4">
      <section className="bg-white flex items-center justify-center px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 flex flex-wrap items-stretch justify-center">
          {loading ? (
            <p className="text-2xl text-center text-slate-500 col-span-full animate-pulse font-semibold">
              Loading items...
            </p>
          ) : items.length === 0 ? (
            <p className="text-2xl text-center text-gray-500 col-span-full">
              No Items available.
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                onClick={() => onClick(item.id, item.slug)}
                className="border border-zinc-200 hover:border-zinc-300 transition-colors rounded-xl p-2 flex flex-col w-46 cursor-pointer"
              >
                {/* Image container with discount badge overlay */}
                <div className="relative flex items-center justify-center h-32 mb-2">
                  <img
                    src={item.imageUrl || "/placeholder.png"}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                  {item.discounts && item.discounts.length > 0 && (
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                      {item.discounts.map((discount, idx) => (
                        <span
                          key={idx}
                          className="bg-lime-300 text-neutral-800 text-xs px-2 py-0.5 rounded-full shadow"
                        >
                          {discount.discount_type === "percentage"
                            ? `${discount.discount_price}%`
                            : `MWK ${discount.discount_price}`} off
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Name */}
                <p className="text-sm font-semibold text-neutral-700 mb-1 px-2 truncate">
                  {item.name}
                </p>

                {/* Price */}
                <div className="flex items-center gap-2 px-2 mb-1">
                  {item.current_price !== item.price && (
                    <span className="text-sm font-semibold text-red-600 line-through">
                      {new Intl.NumberFormat("en-MW", {
                        style: "currency",
                        currency: "MWK",
                      }).format(Number(item.price))}
                    </span>
                  )}
                  <span className="text-sm font-semibold text-green-600">
                    {new Intl.NumberFormat("en-MW", {
                      style: "currency",
                      currency: "MWK",
                    }).format(Number(item.current_price))}
                  </span>
                </div>

                {/* Description flows naturally */}
                <p className="text-xs text-neutral-600 px-2">
                  {item.description}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default DesignCard;