import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DesignCard from "../components/DesignCard";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const [results, setResults] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    if (query) {
      fetch(`${API_BASE}/products/?search=${query}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data.results || []);
        });
    }
  }, [query]);

  const handleNavigation = (id, slug) => {
    navigate(`/product/${id}/${slug}`)
  }

  return (
    <div className="p-6">
      <h1 className="text-xl text-center pt-10 font-semibold mb-4">
        Results for: "{query}"
      </h1>

      {results.length === 0 ? (
        <p>No results found</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
          {results.map((item) => (
            <div key={item.id} className="py-5">
              <DesignCard onClick={handleNavigation} item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
