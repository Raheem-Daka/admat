import { useEffect, useState, useRef} from "react";
import { useParams, useNavigate  } from "react-router-dom";
import { toast } from "sonner";
import { ACCESS_TOKEN_KEY } from "../../utils/authKeys";
import { FaArrowLeft } from "react-icons/fa";
import placeHolder from "../../assets/placeHolder.png";
import { apiFetch } from "../../api/api";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

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
      const data = await apiFetch(`/orders/${id}/`);
      setOrder(data);
    } catch (err) {
      if (err?.status === 404 ) {
        toast.error("Order not found");
        navigate("/orders");
      } else if (err?.status === 401) {
        toast.error("Session expired. Please sign in again.");
        navigate("/signin");
      } else {
        
        toast.error( "Failed to load order");
      }
    } finally {
        timeoutRef.current = setTimeout(() => {
          setLoading(false);
        }, 1000);
    }
  };

  const cancelOrder = async () => {
    try {
      await apiFetch(`/orders/${order.id}/`, {
        method: "PATCH",
        body: JSON.stringify({ status: "Cancelled" }),
      }
    );

      toast.success("Order cancelled");

      setOrder(prev => ({
        ...prev,
        status: "Cancelled"
      }));

    } catch {
      toast.error("Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  const openModal = () => {
    setIsOpen(true);
  }

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
              onClick={() => {
                setShowModal(true);
              }}
              className="ml-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

              {/* DELETE CONFIRMATION MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center backdrop-blur-sm z-50">
          <div className="bg-white shadow-md rounded-xl py-6 px-5 md:w-[460px] w-[370px]">
               {/* Icon */}
               <div className="flex items-center justify-center p-4 bg-red-100 rounded-full w-16 h-16 mx-auto">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.875 5.75h1.917m0 0h15.333m-15.333 0v13.417a1.917 1.917 0 0 0 1.916 1.916h9.584a1.917 1.917 0 0 0 1.916-1.916V5.75m-10.541 0V3.833a1.917 1.917 0 0 1 1.916-1.916h3.834a1.917 1.917 0 0 1 1.916 1.916V5.75m-5.75 4.792v5.75m3.834-5.75v5.75" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Title */}
              <h2 className="text-gray-900 text-center font-semibold mt-4 text-xl">Are you sure?
              </h2>

              {/* Description */}
              <p className="text-sm text-gray-600 mt-2 text-center">
                Do you really want to cancel order  
                <span className="text-red-500 font-bold"> # {order?.id} </span>with items: <span className="font-semibold text-red-500">
                  <ul>
                    {order.items.length <= 3 ? (
                      order.items.map(item => (
                        <li key={item.id}>{item.item_name}</li>
                      ))
                    ) : (
                      <li>{order.items[0].item_name} and {order.items.length - 1} more...</li>
                    )}
                  </ul>
                  </span>
                  <br/> 
                  <span>This action cannot be undone.</span>
              </p>

              {/* Buttons */}
              <div className="flex items-center justify-center gap-4 mt-5 w-full">
                <button
                  onClick={() => {
                    setShowModal(false);
                  }}
                  className="w-full md:w-36 h-10 rounded-md border border-gray-300 bg-white text-gray-600 font-medium text-sm hover:bg-gray-100 active:scale-95 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    cancelOrder();
                    setShowModal(false);
                  }}
                  disabled={cancelling}
                  className="w-full md:w-36 h-10 rounded-md text-white bg-red-600 font-medium text-sm hover:bg-red-700 active:scale-95 transition"
                >
                  Yes, Remove
                </button>
              </div>
          </div>
        </div>
        )}


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
                src={item.item_image || placeHolder } 
                alt=""
                className="w-14 h-14 object-cover rounded object-center object-cover" />
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