import React, { useEffect, useState } from 'react';
import DesignCard from '../components/DesignCard';
import Hero from '../components/Hero';
import DiscountComponent from '../components/DiscountComponent';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/")
      .then(response => response.json())
      .then(data => {
        console.log("API response:", data);
        setItems(Array.isArray(data) ? data : (data.items || []));
        setLoading(false);
      })
      .catch(error => console.error("Error fetching items:", error));
  }, []);

  const handleCardClick = (id, slug) => {
    navigate(`/products/${id}/${slug}`);
  };

  return (
    <div>
      <Hero />
      <div className="border-t border-slate-100">
        <h1 className="text-4xl w-full font-bold flex justify-center">
          All Our Featured Products
        </h1>
        <DesignCard items={items} onClick={handleCardClick} loading={loading}/>
      </div>
      <div className="w-full">
        <DiscountComponent />
      </div>
    </div>
  );
};

export default Home;