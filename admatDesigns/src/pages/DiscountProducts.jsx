import React, { useEffect, useState } from 'react'

const DiscountProducts = () => {
    const [message, setMessage] = useState('');
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/discount_products/')
        .then(Response => Response.json())
        .then(data => {
            setMessage(data.message);
            setItems(data.items);
            console.log('Discount products API Response:',data)
        })
        .catch(error => console.error('Error fetching discount products:', error));
    }, [])
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{message || 'Loading..'}</h1>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="border p-3 rounded">
            {item.name} — {item.price} {item.currency}
          </li>
        ))}
      </ul>
    </div>

  )
}

export default DiscountProducts