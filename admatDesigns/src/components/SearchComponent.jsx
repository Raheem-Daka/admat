import { useEffect, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

const SearchComponent = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  // ✅ Auto-open search on large screens
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleResize = () => {
      setSearchOpen(mediaQuery.matches);
    };

    handleResize(); // initial check
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  const toggleSearch = () => {
    setSearchOpen((prev) => !prev);
  };

  return (
    <div className="py-10 flex items-center justify-center">
      {/* ✅ Mobile (icon only) */}
      <button
        type="button"
        onClick={toggleSearch}
        className="flex lg:hidden px-3 py-2"
        aria-label="Open search"
      >
        <FaSearch size={18} />
      </button>

      {/* ✅ Desktop (full search visible) */}
      <div className="relative hidden lg:flex items-center ml-6">
        <button
          type="button"
          onClick={toggleSearch}
          className="px-3 py-2"
          aria-label="Toggle search"
        >
          {searchOpen ? (
            <>
              <FaTimes size={16} />
            </>
          ) : (
            <div className="flex items-center gap-2 border rounded p-2">
              <FaSearch size={18} />
              <span className="ml-1">Search</span>
            </div>
          )}
        </button>

        <div
          className={`flex items-center border pl-4 gap-2 border-gray-500/30 h-[46px]
          rounded-full overflow-hidden transition-all duration-300 ml-2
          ${searchOpen ? "w-[340px] opacity-100" : "w-0 opacity-0"}`}
        >
          <FaSearch className="text-gray-400" />

          <input
            type="text"
            placeholder="Category, product name..."
            className="w-full h-full outline-none bg-transparent text-sm text-gray-600"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;