import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import DesignCard from "../components/DesignCard";
import placeHolder from "../assets/placeHolder.png";
const API_BASE = "http://127.0.0.1:8000";


const ProductDetails = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(placeHolder);

  useEffect(() => {
    setLoading(true);

    fetch(`${API_BASE}/api/products/${id}/${slug}/`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load item");
        return res.json();
      })
      .then(data => {
        setItem(data.item);
        setRelatedItems(data.related_items || []);

        if (data.item?.imageUrl) {
          setMainImage(`${API_BASE}${data.item.imageUrl}`);
        }

        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id, slug]);

  const handleNavigate = (id, slug) => {
    navigate(`/products/${id}/${slug}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl text-gray-500 animate-pulse">
          Loading item details...
        </p>
      </div>
    );
  }

  if (!item) {
    return (
      <p className="text-center text-red-500 py-10">
        Item not found.
      </p>
    );
  }

  return (
    <div className="container p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{item.name}</h1>

      {/* Images */}
      <div className="flex sm:flex-col lg:flex-row gap-6">
        {/* Main Image */}
        <div className="lg:w-1/2 w-full ">
          <img
            src={mainImage}
            alt={item.name}
            className="w-full h-[420px] rounded-xl shadow-lg object-contain"
          />
        </div>

        {/* Thumbnails */}
        {item.imageUrl.imagesUrl?.length > 0 && (
          <div className="border border-black grid sm:grid-col sm:grid-cols-2 md:grid-cols-2 gap-4 lg:w-1/2 w-full">
            {item.images.map((img, idx) => {
              const imgUrl = `${API_BASE}${item.imageUrl.image}`;

              return (
                <img
                  key={img.id || idx}
                  src={item.imageUrl.images}
                  alt={`${item.name} ${idx + 1}`}
                  onClick={() => setMainImage(imgUrl)}
                  className="cursor-pointer h-32 w-full object-cover rounded-lg border hover:border-black transition"
                />
              );
            })}
          </div>
        )}
      </div>

      <p>wagwawawah</p>
      {/* Description */}
      <p className="text-gray-700 my-4">{item.description}</p>

      {/* Price */}
      <div className="mb-6">
        {item.current_price !== item.price && (
          <p className="text-red-500 line-through">
            MWK {item.price}
          </p>
        )}
        <p className="text-green-600 text-xl font-semibold">
          MWK {item.current_price}
        </p>
      </div>

      {/* Discounts */}
      {item.discounts?.length > 0 && (
        <div className="space-y-1 mb-6">
          {item.discounts.map((discount, idx) => (
            <p key={idx} className="text-sm text-slate-600">
              Discount {idx + 1}:{" "}
              {new Date(discount.start_date).toLocaleDateString()}
              {discount.end_date &&
                ` to ${new Date(discount.end_date).toLocaleDateString()}`}
            </p>
          ))}
        </div>
      )}

      {/* Related Items */}
      <div className="bg-gray-50 mt-10 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Related items</h2>

        {relatedItems.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            No related items found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/*
                {relatedItems.map(item => (
                  <DesignCard
                    key={item.id}
                    item={item}
                    onClick={handleNavigate}

            */}
            {relatedItems.map(related => (
              <DesignCard
                key={related.id}
                item={related}
                onClick={handleNavigate}
            
          
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;