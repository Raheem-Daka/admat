import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ACCESS_TOKEN_KEY } from "../../utils/authKeys";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      toast.error("Session expired. Please sign in again.")
      navigate("/signin");
      return;
    }

    fetchCart(token);
  }, [navigate]);

  const fetchCart = async (token) => {
    try {
      const res = await axios.get(`${API_BASE}/api/cart/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.data?.items?.length) {
        toast.info("Your cart is empty 🛒");
        navigate("/cart");
        return;
      }

      setCart(res.data);
    } catch (err) {
      toast.error("Failed to load checkout items");
      navigate("/cart");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6">Loading checkout…</p>;
  if (!cart) return null;

  const subtotal = cart.items.reduce(
    (sum, ci) =>
      sum + Number(ci.item.current_price) * ci.quantity,
    0
  );

  const deliveryFee = cart.delivery_fee ?? 5000; // or backend-provided later
  const total = cart.total ?? subtotal + deliveryFee;

  return (
    <div className="border rounded-xl mt-20 px-6 py-5 bg-white shadow xl:w-7xl mx-auto text-center  items-center">
      <h2 className="text-2xl font-semibold mb-4 pt-5">Order Summary</h2>

      {cart.items.map((ci) => (
        <div
          key={ci.id}
          className="flex justify-between mb-3 text-sm"
        >
          <div>
            <p className="font-medium">{ci.item.name}</p>
            <p className="text-gray-500">Qty: {ci.quantity}</p>
          </div>

          <p className="font-semibold">
            MWK {(ci.item.current_price * ci.quantity).toFixed(2)}
          </p>
        </div>
      ))}

      <hr className="my-3" />

      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>MWK {subtotal.toFixed(2)}</span>
      </div>

      <div className="flex justify-between">
        <span>Delivery</span>
        <span>MWK {deliveryFee.toFixed(2)}</span>
      </div>

      <hr className="my-3" />

      <div className="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>MWK {total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default Checkout;

