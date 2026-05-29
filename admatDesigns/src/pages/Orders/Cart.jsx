import { useEffect, useState } from "react";
import { apiFetch } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "../../context/CartContext";
import placeHolder from "../../assets/placeholder.png";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const resolveImageUrl = (url) => {
  if (!url) return "/placeholder.png";

  const base = import.meta.env.VITE_API_BASE_URL.replace("/api", "");

  return url.startsWith("http")
    ? url
    : `${base}${url}`;
};

const Cart = () => {
  const { cart, fetchCart } = useCart();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchCart().finally(() => 
      setTimeout(() =>
      setLoading(false)
      , 1000)
    );
  }, []);

  // ✅ PRODUCT ID (item.id)
  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;

    setUpdating(itemId);

    try {
      await apiFetch(`/cart/items/${itemId}/`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    });
    fetchCart();
    } finally {
      setUpdating(null);
    }
  };

  // ✅ PRODUCT ID (item.id)
  const removeItem = async (itemId) => {

    setUpdating(itemId);

    try {
      await apiFetch(`/cart/items/${itemId}/delete/`, {
        method: "DELETE",
      });
      fetchCart();
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-10">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-gray-500">Loading cart items...</p>
      </div>
    );
  }

  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    return <div className="p-6 text-center">Your cart is empty 🛒</div>;
  }

  const total = cart.items.reduce(
    (sum, ci) => sum + Number(ci.item.current_price) * ci.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-4">
        {cart.items.map((ci) => (
          <div
            key={ci.id}
            className="flex gap-4 items-center border rounded-lg p-4"
          >
            {/* ✅ Image */}
            <img
              src={resolveImageUrl(
                ci.item.imageUrl ||
                  (ci.item.images?.length
                    ? ci.item.images[0].imageUrl
                    : placeHolder)
              )}
              alt={ci.item.name}
              className="w-24 h-24 object-cover rounded"
            />

            {/* ✅ Info */}
            <div className="flex-1">
              <h2 className="font-semibold">{ci.item.name}</h2>

              {Number(ci.item.current_price) !== Number(ci.item.price) ? (
                <div className="text-sm">
                  <p className="text-red-500 line-through">
                    Was: MWK {ci.item.price}
                  </p>
                  <p className="text-green-600 font-semibold">
                    Now: MWK {ci.item.current_price}
                  </p>
                </div>
              ) : (
                <p className="text-green-600 font-semibold">
                  MWK {ci.item.current_price}
                </p>
              )}
            </div>

            {/* ✅ Quantity */}
            <div className="flex items-center gap-2">
              <button
              disabled={updating === ci.item.id}
                onClick={() => updateQuantity(ci.item.id, ci.quantity - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                −
              </button>

              <span>{ci.quantity}</span>

              <button
              disabled={updating === ci.item.id}
                onClick={() => updateQuantity(ci.item.id, ci.quantity + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>

            {/* ✅ Remove */}
            <button
              disabled={updating === ci.item.id}
              onClick={() => removeItem(ci.item.id)}
              className="ml-4 px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* ✅ Total */}
      <div className="mt-8 flex justify-between items-center border-t pt-6">
        <h2 className="text-xl font-semibold">
          Total: MWK {total.toFixed(2)}
        </h2>

        <button
          onClick={() => navigate("/checkout")}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;