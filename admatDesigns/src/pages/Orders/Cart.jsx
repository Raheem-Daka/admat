import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const resolveImageUrl = (url) => {
  if (!url) return "/placeholder.png";
  return url.startsWith("http") ? url : `${API_BASE}${url}`;
};

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      setCart(null);
      setLoading(false);
      toast.info("Please sign in to view your cart.")
      navigate("/signin")
      return;
    }

    fetchCart(token);
  }, [token]);

  const fetchCart = async (authToken) => {
    try {
      const res = await axios.get(`${API_BASE}/cart/`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setCart(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setCart(null);
      } else {
        console.error("Failed to load cart", err.response?.data || err);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;

    await axios.patch(
      `${API_BASE}/cart/items/${itemId}/`,
      { quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchCart(token);
  };

  const removeItem = async (itemId) => {
    await axios.delete(
      `${API_BASE}/cart/items/${itemId}/delete/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchCart(token);
  };

  if (loading) return <div className="p-6 text-center animate-pulse">Loading cart…</div>;

  if (!token) {
    return <div className="p-6 text-center">Please log in to view your cart 🔐</div>;
  }

  if (!cart || !Array(cart.items) || cart.items.length === 0) {
    return <div className="p-6 text-center">Your cart is empty 🛒</div>;
  }

  const total = cart.items.reduce(
    (sum, ci) => sum + Number(ci.item.current_price) * ci.quantity,
    0
  );

  const handleNavigate = () => {
    navigate("/checkout")
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-4">
        {cart.items.map((ci) => (
          <div key={ci.id} className="flex gap-4 items-center border rounded-lg p-4">
            <img
              src={resolveImageUrl(
                ci.item.imageUrl ||
                  (ci.item.images?.length ? ci.item.images[0].imageUrl : null)
              )}
              alt={ci.item.name}
              className="w-24 h-24 object-cover rounded"
              onError={(e) => (e.currentTarget.src = "/placeholder.png")}
            />
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

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(ci.item.id, ci.quantity - 1)}
                className="px-3 py-1 border rounded"
              >
                −
              </button>
              <span>{ci.quantity}</span>
              <button
                onClick={() => updateQuantity(ci.item.id, ci.quantity + 1)}
                className="px-3 py-1 border rounded"
              >
                +
              </button>
            </div>

            <button
              onClick={() => removeItem(ci.item.id)}
              className="text-red-500 hover:underline ml-4 border px-2 py-1 rounded bg-red-600 text-white"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center border-t pt-6">
        <h2 className="text-xl font-semibold">Total: MWK {total.toFixed(2)}</h2>
        <button 
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
        onClick={handleNavigate}>
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;