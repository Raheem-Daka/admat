import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ACCESS_TOKEN_KEY } from "../../utils/authKeys";
import { useAuth } from "../../utils/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const Checkout = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [placingOrder, setPlacingOrder] = useState(false);
    const { user } = useAuth();

    const [formData, setFormData] = useState({
      full_name: "",
      phone: "",
      address: "",
      city: "",
      payment_method: "cod",
    });

  const placeOrder = async () => {
    if (
      !formData.full_name.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim()
    ) {
      toast.error("Please fill in all shipping details");
      return;
    }

    try {
      setPlacingOrder(true);

      const token = user?.token;

      if (formData.payment_method === "cod") {
        await axios.post(
          `${API_BASE}/orders/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        toast.success("Order placed successfully ✅");
        navigate("/orders");

      } else {

        // Go to payment page for online
        navigate("/payments");
      }

    } catch (error) {
      console.log("ERROR RESPONSE:", error.response?.data);
      toast.error("Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  useEffect(() => {
    const token = user?.token;
    
    if (!token) {
      toast.error("Session expired. Please sign in again.")
      navigate("/signin");
      return;
    }

    fetchCart(token);
  }, [user]);

  const fetchCart = async (token) => {
    try {
      const res = await axios.get(`${API_BASE}/cart/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.data?.items?.length) {
        toast.info("Your cart is empty 🛒");
        setTimeout(() => {
          navigate("/cart");
        }, 1000)
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading checkout...
      </div>
    );
  }  
  if (!cart) return null;

  const subtotal = cart.items.reduce(
    (sum, ci) =>
      sum + Number(ci.item.current_price) * ci.quantity,
    0
  );

  const deliveryFee = cart.delivery_fee ?? 5000;
  const total = Number(cart.total ?? subtotal + deliveryFee);

  return (
    <div className="rounded-xl mt-20 px-6 py-5 bg-white shadow xl:w-4xl mx-auto text-center  items-center">
      <h1 className="font-bold text-2xl text-center py-5">Checkout</h1>
      <div className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={(e) =>
            setFormData({ ...formData, full_name: e.target.value })
          }
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) =>
            setFormData({ ...formData, phone: e.target.value })
          }
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          placeholder="Address"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          placeholder="City"
          value={formData.city}
          onChange={(e) =>
            setFormData({ ...formData, city: e.target.value })
          }
          className="w-full border p-3 rounded"
        />
      </div>
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

      <div className="my-10">
        <h1 className="font-bold text-2xl mb-5">Choose a Payment method</h1>
        <select
          value={formData.payment_method}
          onChange={(e) =>
            setFormData({ ...formData, payment_method: e.target.value })
          }
          className="w-full border py-3 px-5 rounded"
        >
          <option value="cod">Cash on Delivery</option>
          <option value="online">Online Payment</option>
        </select>
      </div>

      <button
        onClick={placeOrder}
        disabled={placingOrder}
        className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
      >
        {placingOrder ? "Placing order..." : "Place order"}
      </button>
    </div>
  );
};

export default Checkout;

