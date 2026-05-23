import { useEffect, useState, useRef} from "react";
import axios from "axios";
import { useParams, useNavigate  } from "react-router-dom";
import { toast } from "sonner";
import { ACCESS_TOKEN_KEY } from "../../utils/authKeys";
import { FaArrowLeft } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);

  const timeoutRef = useRef(null);

  const getTimeRemaining = (date) => {
    const total = Date.parse(date) - Date.now();

    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / 1000 / 60) % 60);

    return { total, days, hours, minutes };
  };

  useEffect(() => {
    if (!order?.estimated_delivery) return;

    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(order.estimated_delivery));
    }, 1000);

    return () => clearInterval(timer);
  }, [order]);

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
      if (err.response?.status === 404 ) {
        toast.error("Order not found");
        navigate("/orders");
      } else if (err.response?.status === 401) {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        toast.error("Session expired. Please sign in again.");
        navigate("/signin");
      } else {
        
        toast.error( "Failed to load order");
      }
    } finally {
        timeoutRef.current = setTimeout(() => {
          setLoading(false);
        }, 800);
    }
  };

  const cancelOrder = async () => {
    const confirmed = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmed) return;

    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    try {
      await axios.patch(
        `${API_BASE}/orders/${order.id}/`,
        { status: "cancelled" },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success("Order cancelled");

      setOrder(prev => ({
        ...prev,
        status: "Cancelled"
      }));

    } catch {
      toast.error("Failed to cancel order");
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-gray-500">Loading order...</p>
      </div>
    );
  }

  if (!order) return null;

  const statusSteps = ["pending", "processing", "shipped", "in_transit", "delivered"];

  const normalizedStatus = (order.status || "").toLowerCase();
  const currentIndex = Math.max(statusSteps.indexOf(normalizedStatus), 0);

  const statusColor = {
    delivered: "text-green-600",
    processing: "text-yellow-600",
    pending: "text-blue-600",
    cancelled: "text-red-600",
  }[normalizedStatus] || "text-gray-600";

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate("/orders")}
        className="mb-4 bg-indigo-600 text-white gap-1 rounded p-2 flex items-center"
      >
        <FaArrowLeft />
        Back to Orders
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
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => navigate(`/orders-tracking?order=${order.id}`)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Track Order
          </button>
          {normalizedStatus !== "delivered" && normalizedStatus !== "cancelled" && (
            <button
              onClick={cancelOrder}
              className="ml-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* MINI PROGRESS BAR */}
      <div className="flex items-center gap-2 mt-2 mb-2">
        {statusSteps.map((step, index) => (
          <div key={step} className="flex items-center">

            <div
              className={`w-3 h-3 rounded-full ${
                index <= currentIndex ? "bg-indigo-600" : "bg-gray-300"
              }`}
            />

            {index < statusSteps.length - 1 && (
              <div
                className={`w-6 h-1 ${
                  index < currentIndex ? "bg-indigo-600" : "bg-gray-300"
                }`}
              />
            )}

          </div>
        ))}
      </div>

      {/* ✅ ETA GOES HERE */}
      {order.estimated_delivery && timeLeft?.total > 0 && (
        <p className="text-sm text-indigo-600 mt-1">
          Delivery in: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
        </p>
      )}

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

export default OrderDetails;