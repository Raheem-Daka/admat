import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DesignCard from "../components/DesignCard";
import placeHolder from "../assets/placeHolder.png";
import {toast} from "sonner"
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../utils/authKeys";
import { apiFetch } from "../api/api";
import RatingInput from "../components/Rating";
import { useAuth } from "../utils/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const ProductDetails = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [item, setItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(placeHolder)

  const [adding, setAdding] = useState(false)

  const refreshItem = async () => {
    try {
      const data = await apiFetch(`/product/${item.id}/`);
      setItem(data);
    } catch (err) {
      console.error(err);
    }
  };

  //Add to Cart function
  const addToCart = async () => {
    if (adding || !item) return;

    try {
      setAdding(true);

      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (!token) {
        toast.error("Please sign in first");
        navigate("/signin");
        return;
      }

      const res = await fetch(`${API_BASE}/cart/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          item_id: item.id,
          quantity: 1,
        }),
      });

      // TOKEN EXPIRED OR INVALID

      if (res.status === 401) {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        toast.error("Session expired. Please sign in again")
        navigate("/signin");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add item to cart");
      }
      
        toast.success(`${item.name} added to cart 🛒`);

      setTimeout(() => {
        navigate("/cart", { replace: true });
      }, 800);    
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(
        error.message || "Failed to add item to cart. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);

        const data = await apiFetch(`/product/${id}/${slug}/`);

        if (!data || !data.item) {
          throw new Error("Invalid item data");
        }

        setItem(data.item);
        setRelatedItems(data.related_items || []);

        const resolveImageUrl = (url) => {
          if (!url) return placeHolder;
          return url.startsWith("http") ? url : `${API_BASE}${url}`;
        };

        if (data.item?.imageUrl) {
          setMainImage(resolveImageUrl(data.item.imageUrl));
        } else if (data.item?.images?.length) {
          setMainImage(resolveImageUrl(data.item.images[0].imageUrl));
        } else {
          setMainImage(placeHolder);
        }

      } catch (err) {
        console.error(err);
        toast.error("Failed to load item details. Redirecting...");
        navigate("/discounts");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, slug]);

  const handleNavigate = (item) => {
    navigate(`/product/${item.id}/${item.slug}`);
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
      <div className="flex sm:flex-col lg:flex-row gap-6" >
        {/* Main Image */}
        <div className="lg:w-1/2 w-full ">
          <img
            src={mainImage}
            alt={item.name}
            className="w-full xl:h-[420px] lg:h-[400px] md:h-[300px] sm:h-[250px] rounded-xl shadow-lg object-cover"
            onError={(e) => {
              e.currentTarget.src = placeHolder;
            }}
          />
        </div>

        {/* Thumbnails */}
        {item.images?.length > 0 && (
          <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
            {item.images.map((img, idx) => {
            const imgUrl = img.imageUrl.startsWith("http")
              ? img.imageUrl
              : `${API_BASE}${img.imageUrl}`;

              return ( 
                <div
                  key={img.id || idx}
                  onClick={() => setMainImage(imgUrl)}
                  className={`rounded-xl xl:h-50 lg:h-48 md:h-44 sm:h-40 overflow-hidden cursor-pointer border-2 ${
                    mainImage === imgUrl
                      ? "border-orange-600"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${item.name} ${idx + 1}`}
                    className="h-full w-full object-cover object-center rounded-lg transition"
                  />
                </div>
              );
            })}
          </div>
        )}      
      </div>

      {/* item name */}
      <div className="py-5">
        <h1 className="text-3xl font-medium">{item.name}</h1>
      </div>

      {/* Rating */}
      {item && (
        <>
          <div className="flex items-center gap-2 mt-2">
            <RatingInput 
            itemId={item.id} 
            onRated={refreshItem} />

            <p className="text-base text-gray-600">
              {item.rating_count > 0
                ? `(${(item.rating ?? 0).toFixed(1)} · ${item.rating_count} ${
                    item.rating_count === 1 ? "review" : "reviews"
                  })`
                : "(No reviews yet)"}
            </p>
          </div>

            {!user && (
            <p className="text-sm text-gray-500">
              Please log in to leave a review
            </p>
          )}
        </>
      )}

      {/* Price */}
      <div className=" mb-6 pt-5 lg:w-1/2 sm:flex justify-between items-center">
        {Number(item.current_price) !== Number(item.price) ? (
          /* ✅ DISCOUNTED ITEM */
          <div className="flex justify-between w-full">
            <div className="flex gap-2">
              <span className="font-semibold text-xl">Was:</span>
              <p className="text-red-500 line-through border rounded bg-red-600 text-white px-2">
                MWK {item.price}
              </p>
            </div>

            <div className="flex gap-2">
              <span className="font-semibold text-xl">Now:</span>
              <p className="text-green-600 text-xl font-semibold">
                MWK {item.current_price}
              </p>
            </div>

          </div>
        ) : (
          /* ✅ NORMAL ITEM (NO DISCOUNT) */
          <p className="text-green-600 text-2xl font-semibold">
            MWK {item.price}
          </p>
        )}
      </div>

      <div>
        <span className="text-gray-500/70">(inclusive of all taxes)</span>
      </div>


      {/* Description */}
      <div className="gap-2">
        <h1 className="text-base font-semibold mt-6">About Product</h1>

        <ul className="text-gray-700 my-4 list-disc pl-6 space-y-1">
          {item.description && (
            <ul className="text-gray-700 my-4 list-disc pl-6 space-y-1">
              {item.description
                .split(/\n|,/)
                .map((line, i) =>
                  line.trim() ? <li key={i}>{line.trim()}</li> : null
                )}
            </ul>
          )}
        </ul>
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

      {/* Cart Button */}
      <div>
        <button 
        onClick={addToCart}
        disabled={adding}
        className={`rounded bg-orange-600 text-white px-4 py-2 ${
          adding ? "bg-gray-400" : "bg-orange-600 hover:bg-orange-700"
        }`}>
          {adding ? "Adding.." : "Add to Cart"}
        </button>
      </div>

      {/* Related Items */}
      <div className="bg-gray-50 mt-10 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Related items</h2>

        {relatedItems.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            No related items found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedItems.map((related) => (
              <DesignCard
                key={related.id}
                item={related}
                onClick={() => handleNavigate(related)}            
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;