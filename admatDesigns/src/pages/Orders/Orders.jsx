import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ACCESS_TOKEN_KEY } from "../../utils/authKeys";
import ProfileSidePanel from "../../components/ProfileSidePanel";
import { apiFetch } from "../../api/api";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Orders = () => {
  const boxIcon = "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/boxIcon.svg"
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

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
      const data = await apiFetch(`/orders/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log(data?.results || data)

      setOrders(data?.results || data || []);
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
      }, 1000);
    }
  };

  const handleNavigation = (order) => {
    navigate(`/order-details/${order.id}`);
  }

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/orders/${id}/`, {
        method: "DELETE",
      });

      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      setOrders(prev => prev.filter(o => o.id !== id));

    } catch (err) {
      console.error(err);
    }
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;

    await handleDelete(selectedItem.id);

    setShowModal(false);
    setSelectedItem(null);
    toast.success("Order deleted successfully ✅");
  };
  


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
                    {Array.isArray(order.items) && order.items.map((item) => (
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
                      className="mt-2 px-4 py-2 border-orange-600 border hover:bg-orange-600 cursor-pointer rounded bg-linear-to-b from-white to-white hover:text-orange-100 hover:from-orange-700 hover:to-orange-900 hover:text-white transition"
                    >
                      View
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(order);
                        setShowModal(true);
                      }}
                      className="mt-2 px-4 py-2 cursor-pointer rounded bg-red-600 transition hover:from-red-700 text-white transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>


              </div>
            </div>
          ))}

                {/* Delete Modal */}
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
                        Do you really want to delete 
                        <span className="text-red-500 font-bold"> #{selectedItem?.id} </span>
                        with items:

                        <span className="font-semibold text-red-500">
                          <ul className="my-2 inline-block text-left">
                            {selectedItem?.items?.length <= 3 ? (
                              selectedItem.items.map(item => (
                                <li key={item.id}>{item.item_name}</li>
                              ))
                            ) : (
                              <li>
                                {selectedItem.items[0]?.item_name} and{" "}
                                {selectedItem.items.length - 1} more...
                              </li>
                            )}
                          </ul>
                        </span>

                        <br />

                        <span>This action cannot be undone.</span>
                      </p>


                      {/* Buttons */}
                      <div className="flex items-center justify-center gap-4 mt-5 w-full">
                        <button
                          onClick={() => {
                            setShowModal(false);
                            setSelectedItem(null);
                          }}
                          className="w-full md:w-36 h-10 rounded-md border border-gray-300 bg-white text-gray-600 font-medium text-sm hover:bg-gray-100 active:scale-95 transition"
                        >
                          Cancel
                        </button>

                        <button
                          onClick={confirmDelete}
                          className="w-full md:w-36 h-10 rounded-md text-white bg-red-600 font-medium text-sm hover:bg-red-700 active:scale-95 transition"
                        >
                          Yes, Remove
                        </button>
                      </div>
                  </div>
                </div>
                )}

          </div>
        )}
      </div>
    </div>
  );

};

export default Orders;