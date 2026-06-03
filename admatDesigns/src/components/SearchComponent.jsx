import { useEffect, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import placeHolder from "../assets/placeHolder.png"
import { apiFetch } from "../api/api";


const API_BASE = import.meta.env.VITE_API_BASE_URL;


const SearchComponent = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState("");

  const navigate = useNavigate();

  // ✅ Fetch results
  const fetchResults = async (searchTerm) => {
    try {
      setLoading(true);

      const data = await apiFetch(
        `/products/?search=${encodeURIComponent(searchTerm)}&limit=6`
      );

      setResults(data.results || data.items || []).slice(0,8);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  // ✅ Auto-open on desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");

    const handleResize = () => setSearchOpen(mq.matches);

    handleResize();
    mq.addEventListener("change", handleResize);

    return () => mq.removeEventListener("change", handleResize);
  }, []);

  // ✅ Debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim().length > 1 && query !== lastQuery) {
        fetchResults(query);
        setLastQuery(query);
      } else if (!query.trim()) {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query, lastQuery]);

  // ✅ Click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const el = document.querySelector(".search-container");
      if (el && !el.contains(e.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Toggle search
  const toggleSearch = () => {
    setSearchOpen((prev) => {
      if (prev) {
        setQuery("");
        setResults([]);
      }
      return !prev;
    });
  };

  const handleSelect = (item) => {
    navigate(`/product/${item.id}/${item.slug}`);
    setSearchOpen(false);
    setQuery("");
    setResults([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/?search=${encodeURIComponent(query)}`);
      setSearchOpen(false);
    }
  };

  return (
    <div className="search-container relative flex flex-col items-center z-[200]">

      {/* MOBILE BUTTON */}
      <button
        onClick={toggleSearch}
        className="lg:hidden px-3 py-2"
      >
        <FaSearch size={18} />
      </button>

      {/* MOBILE SEARCH */}
      {searchOpen && (
        <div className="lg:hidden w-full mt-3 relative rounded">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search products..."
            className="w-full focus-within:ring-2 focus-within:ring-orange-600 border rounded border border-orange-600 focus:ring-orange-600 px-4 py-2"
          />

          {query && (
            <div className="absolute top-full left-0 w-full bg-white shadow rounded mt-2 z-[300] backdrop-blur-md">

              {/* LOADING */}
              {loading && (
                <div className="flex flex-col items-center p-3">
                  <div className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-sm">Searching...</p>
                </div>
              )}

              {/* NO RESULTS */}
              {!loading && results.length === 0 && (
                <p className="p-3 text-gray-500">No results</p>
              )}

              {/* RESULTS */}
              {!loading && results.length > 0 && results.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="flex gap-3 p-3 border-b cursor-pointer hover:bg-gray-100"
                >
                  <img
                    src={item.imageUrl || placeHolder}
                    className="w-10 h-10 rounded object-cover"
                    alt=""
                  />
                  <div>
                    <p>{item.name}</p>
                    <p className="text-xs text-gray-500">
                      ${item.price}
                    </p>
                  </div>
                </div>
              ))}

            </div>
          )}

        </div>
      )}

      {/* DESKTOP SEARCH */}
      <div className="hidden lg:flex items-center mt-4">
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSearch();
          }}
        >
          {searchOpen ? <FaTimes /> : <FaSearch />}
        </button>

        <div className="relative ml-2">

          {/* INPUT */}
          <div
            className={`flex items-center border pl-3 h-10 rounded-full transition-all focus:ring-orange-600 border-xl border-orange-600 ${
              searchOpen
                ? "w-[300px]"
                : "w-0 opacity-0 pointer-events-none"
            }`}
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full outline-none bg-transparent text-sm  "
              placeholder="Search..."
            />

            {loading && <span className="mr-2">...</span>}
          </div>

          {/* DROPDOWN */}
          {searchOpen && query.trim().length > 1 && (
            <div className="absolute top-full left-0 w-[300px] bg-white shadow-lg rounded mt-2 max-h-80 overflow-y-auto z-[300]">
              
              {loading && <p className="p-3">Searching...</p>}

              {!loading && results.length === 0 && (
                <p className="p-3">No results</p>
              )}

              {results.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="flex gap-3 p-3 cursor-pointer hover:bg-gray-100"
                >
                  <img
                    src={item.imageUrl || "placeholder.png"}
                    className="w-10 h-10 rounded object-cover"
                    alt=""
                  />
                  <div>
                    <p>{item.name}</p>
                    <p className="text-xs text-gray-500">
                      ${item.price}
                    </p>
                  </div>
                </div>
              ))}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;