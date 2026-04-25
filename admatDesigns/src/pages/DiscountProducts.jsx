import React, { useEffect, useState } from 'react'
import DesignCard from '../components/DesignCard'
import { useNavigate } from 'react-router-dom';

const DiscountProducts = () => {
    const [message, setMessage] = useState('');
    const [items, setItems] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/discount_products/')
        .then(Response => Response.json())
        .then(data => {
            setMessage(data.message);
            setItems(data.items || []);
            console.log('Discount products API Response:',data)
        })
        .catch(error => console.error('Error fetching discount products:', error));
    }, []);

    const handleNavigate = (id, slug) => {
        console.log(`Clicked item with ID: ${id} and slug: ${slug}`);
        navigate(`/products/${id}/${slug}`);
    };
  return (
    <div className="p-6">
      <h1 className="lg:text-4xl sm:text-2xl font-bold mb-4 flex justify-center">{message}</h1>
      <ul className="space-y-2">
        <DesignCard items={items} onClick={handleNavigate}/>
      </ul>
    </div>

  )
}

export default DiscountProducts;