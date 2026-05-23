import React, { useEffect, useState } from "react";

const LoadingSkeleton = () => {
  const [count, setCount] = useState(6);

  useEffect(() => {
    const updateCount = () => {
      const width = window.innerWidth;

      if (width >= 1280) {
        setCount(21); // xl screens
      } else if (width >= 1024) {
        setCount(18); // lg screens
      } else if (width >= 768) {
        setCount(12); // md screens
      } else {
        setCount(6); // small screens ✅
      }
    };

    updateCount(); // run once
    window.addEventListener("resize", updateCount);

    return () => window.removeEventListener("resize", updateCount);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 mt-10">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="p-2 border border-gray-200 rounded-lg">
          <div className="h-32 bg-gray-200 animate-pulse rounded mb-2"></div>
          <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mb-1"></div>
          <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;