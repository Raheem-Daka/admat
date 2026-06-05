import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ACCESS_TOKEN_KEY } from "../../utils/authKeys";
import ProfileSidePanel from "../../components/ProfileSidePanel";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Orders = () => {
  const boxIcon = "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/boxIcon.svg"
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    
    if (!token) {
      navigate("/signin");
      return;
    }

    fetchOrders(token);
  }, [navigate]);

  const fetchOrders = async (token) => {
    try {
      const res = await axios.get(`${API_BASE}/orders/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log(res.data?.results || res.data)

      setOrders(res.data?.results || res.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        toast.error("Session expired. Please sign in again.");
        navigate("/signin");
      } else {
        toast.error("Failed to load orders");
      }
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  const handleNavigation = (order) => {
    navigate(`/order-details/${order.id}`);
  }

  const handleTrackButton = (orderId) => {
    navigate(`/orders-tracking?order=${orderId}`)
  }

  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR stays visible */}
      <ProfileSidePanel />

      {/* CONTENT AREA */}
      <div className="px-5 w-full">
        <h1 className="text-3xl font-bold py-10">My Orders</h1>

        {loading ? (
          // ✅ Loader ONLY inside content
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          // ✅ Empty state
          <p className="text-gray-500 text-center">
            You haven’t placed any orders yet.
            <br />
            <button
              onClick={() => navigate("/products")}
              className="mt-4 cursor-pointer rounded bg-linear-to-b from-orange-600 to-orange-800 text-orange-100 transition hover:from-orange-700 hover:to-orange-900 p-2"
            >
              Start shopping
            </button>
          </p>
        ) : (
          // ✅ Orders list
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="grid grid-cols-1  md:items-center gap-5 p-5 rounded-md border border-gray-300 text-gray-800"
              >
                {/* Image */}
                <div className="flex justify-between">
                  <div className="flex gap-3">
                    <div>
                      <img className="w-12 h-12 object-cover opacity-60" src={boxIcon} alt="boxIcon" />

                    </div>

                  {/* Order Info */}
                  <div>
                    <p className="font-semibold">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">
                      Date: {new Date(order.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm mt-2">
                      Status:{" "}
                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold ${
                          {
                            Delivered: "bg-green-100 text-green-700",
                            Processing: "bg-yellow-100 text-yellow-700",
                            Pending: "bg-blue-100 text-blue-700",
                            Cancelled: "bg-red-100 text-red-700",
                          }[order.status] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Items List */}
                <div>
                  <ul>
                    {order.items?.map((item) => (
                      <li key={item.id}>{item.name}</li>
                    ))}
                  </ul>
                </div>

                {/* Address */}
                <div>
                  <div className="text-sm text-gray-600">
                    <p className="font-semibold">{order.full_name.toUpperCase()}</p>
                    <p>{order.address}</p>
                    <p>{order.city}</p>
                  </div>
                </div>
              

                {/* Total + Actions */}
                <div className="flex flex-col items-end sm:items-end">
                  <p className="font-bold text-lg text-orange-600">
                    MWK {Number(order.total || 0).toLocaleString()}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleNavigation(order)}
                      className="mt-2 px-4 py-2 border-orange-600 border rounded hover:bg-orange-600 cursor-pointer rounded bg-linear-to-b from-white to-white hover:text-orange-100 transition hover:from-orange-700 hover:to-orange-900 hover:text-white transition"
                    >
                      View Order
                    </button>

                    <button
                      onClick={() => handleTrackButton(order.id)}
                      className="mt-2 px-4 py-2 cursor-pointer rounded bg-linear-to-b from-orange-600 to-orange-800 text-orange-100 transition hover:from-orange-700 hover:to-orange-900 transition"
                    >
                      Track Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );

};

export default Orders;