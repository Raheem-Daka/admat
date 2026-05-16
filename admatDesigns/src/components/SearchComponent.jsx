import { useEffect, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import placaHolder from "../assets/placeHolder.png"


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

      const res = await fetch(
        `${API_BASE}/products/?search=${encodeURIComponent(searchTerm)}&limit=6`
      );

      const data = await res.json();
      setResults(data.results || data.items || []).slice(0,8);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
      if (query.trim().length > 1) {
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
      navigate(`/search?query=${encodeURIComponent(query)}`);
      setSearchOpen(false);
    }
  };

  return (
    <div className="search-container flex flex-col items-center">

      {/* MOBILE BUTTON */}
      <button
        onClick={toggleSearch}
        className="lg:hidden px-3 py-2"
      >
        <FaSearch size={18} />
      </button>

      {/* MOBILE SEARCH */}
      {searchOpen && (
        <div className="lg:hidden w-full px-4 mt-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search products..."
            className="w-full border rounded-full px-4 py-2"
          />

          {query && (
            <div className="bg-white shadow rounded mt-2">
              {loading && <p className="p-3">Searching...</p>}

              {!loading && results.length === 0 && query && (
                <p className="p-3 text-gray-500">No results</p>
              )}

              {results.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="flex gap-3 p-3 border-b cursor-pointer hover:bg-gray-100"
                >
                  <img
                    src={item.imageUrl || "/placeHolder.png"}
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
            className={`flex items-center border pl-3 h-10 rounded-full transition-all ${
              searchOpen
                ? "w-[300px]"
                : "w-0 opacity-0 pointer-events-none"
            }`}
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full outline-none bg-transparent text-sm"
              placeholder="Search..."
            />

            {loading && <span className="mr-2">...</span>}
          </div>

          {/* DROPDOWN */}
          {searchOpen && query.trim().length > 1 && (
            <div className="absolute top-full left-0 w-[300px] bg-white shadow rounded mt-2 max-h-80 overflow-y-auto">
              
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