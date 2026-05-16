import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ACCESS_TOKEN_KEY } from "../../utils/authKeys";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Orders = () => {
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

      setOrders(res.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        toast.error("Session expired. Please sign in again.");
        navigate("/signin");
      } else {
        toast.error("Failed to load orders");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (order) => {
    navigate(`/order_details/${order.id}`);
  }

  if (loading) return <p className="p-6">Loading orders…</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center">
          You haven’t placed any orders yet.
          <br />
          <button
            onClick={() => navigate("/products")}
            className="mt-4 text-indigo-600 rounded text-white bg-indigo-600 p-2"
          >
            Start shopping
          </button>
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusColor = {
              Delivered: "text-green-600",
              Processing: "text-yellow-600",
              Pending: "text-blue-600",
              Cancelled: "text-red-600",
            }[order.status] || "text-gray-600";

            return (
              <div
                key={order.id}
                className="border rounded-xl p-4 bg-white shadow-sm flex flex-col sm:flex-row justify-between gap-4"
              >
                {/* Order Info */}
                <div>
                  <p className="font-semibold">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">
                    Date:{" "}
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    Status:{" "}
                    <span className={`font-semibold ${statusColor}`}>
                      {order.status}
                    </span>
                  </p>
                </div>

                {/* Order Total */}
                <div className="flex flex-col items-start sm:items-end">
                  <p className="font-bold text-lg text-indigo-600">
                    MWK {Number(order.total).toLocaleString()}
                  </p>
                  <button
                    onClick={() => handleNavigation(order)}
                    className="mt-2 px-4 py-2 border rounded hover:bg-indigo-600 hover:text-white transition"
                  >
                    View Order
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default Orders;