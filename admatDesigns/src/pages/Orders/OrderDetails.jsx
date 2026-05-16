import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ACCESS_TOKEN_KEY } from "../../utils/authKeys";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      toast.error("Session expired. Please sign in again.");
      navigate("/signin");
      return;
    }

    fetchOrder(token);
  }, [id, navigate]);

  const fetchOrder = async (token) => {
    try {
      const res = await axios.get(`${API_BASE}/orders/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrder(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error("Order not found");
        navigate("/orders");
      } else if (err.response?.status === 401) {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        toast.error("Session expired. Please sign in again.");
        navigate("/signin");
      } else {
        toast.error("Failed to load order");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6">Loading order details…</p>;
  if (!order) return null;

  const statusColor = {
    Delivered: "text-green-600",
    Processing: "text-yellow-600",
    Pending: "text-blue-600",
    Cancelled: "text-red-600",
  }[order.status] || "text-gray-600";

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate("/orders")}
        className="mb-4 text-indigo-600 underline"
      >
        ← Back to Orders
      </button>

      <h1 className="text-3xl font-bold mb-6">Order #{order.id}</h1>

      {/* Order Meta */}
      <div className="mb-6 space-y-1">
        <p>
          Status:{" "}
          <span className={`font-semibold ${statusColor}`}>
            {order.status}
          </span>
        </p>
        <p className="text-gray-500">
          Placed on: {new Date(order.created_at).toLocaleDateString()}
        </p>
      </div>

      {/* Items */}
      <div className="border rounded-xl p-4 bg-white shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4">Items</h2>

        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between border-b py-3 last:border-0"
          >
            <div>
                <img 
                src={item.item_image} 
                alt=""
                className="w-14 object-cover rounded" />
                <p className="font-medium">{item.item_name}</p>
                <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
              </p>
            </div>
            <p className="font-semibold">
              MWK {Number(item.subtotal).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="border rounded-xl p-4 bg-white shadow-sm">
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>MWK {Number(order.subtotal).toLocaleString()}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Delivery</span>
          <span>MWK {Number(order.delivery_fee).toLocaleString()}</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>MWK {Number(order.total).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;