import React, { useEffect, useState, useRef } from 'react';
import ProfileSidePanel from '../../components/ProfileSidePanel';
import { ACCESS_TOKEN_KEY } from '../../utils/authKeys';
import { apiFetch } from '../../api/api';
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaArrowLeft, FaBox, FaCog, FaTruck, FaShippingFast, FaCheckCircle } from 'react-icons/fa';
import { toast } from "sonner"


const Tracking = () => {
  const [trackedItems, setTrackedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [prevStatuses, setPrevStatuses] = useState({})
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order");

  const navigate = useNavigate();

  const timeoutRef = useRef(null);

  const statusSteps = [
    "pending", 
    "processing", 
    "shipped", 
    "in_transit", 
    "delivered"
  ];

  const statusIcons = {
    pending: <FaBox />,
    processing: <FaCog />,
    shipped: <FaTruck />,
    in_transit: <FaShippingFast />,
    delivered: <FaCheckCircle />
  };

  const statusStyles = {
    delivered: "bg-green-100 text-green-700",
    shipped: "bg-blue-100 text-blue-700",
    in_transit: "bg-indigo-100 text-indigo-700",
    processing: "bg-yellow-100 text-yellow-700",
    pending: "bg-gray-100 text-gray-700",
  };

  useEffect(() => {
    const fetchTrackedItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const endpoint = orderId 
          ? `/tracking/?order=${orderId}` 
          : `/tracking/`;

        const response = await apiFetch(endpoint);

        const data = Array.isArray(response)
          ? response
          : (response?.results || []);
          console.log(response?.results)

          data.forEach(item => {
            const prevStatus = prevStatuses[item.id];

            if (prevStatus && prevStatus !== item.status) {
              toast.success(`order # ${item.order_id} is now ${item.status}`)
            }
          });

          const newStatuses = {};
          data.forEach(item => {
            newStatuses[item.id] = item.status;
          });
        
          setPrevStatuses(newStatuses);
          setTrackedItems(data);

      } catch (err) {
        setError(err.message || 'Failed to load tracks');
        toast.error("Failed to load tracks")
      } finally {
        timeoutRef.current = setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };

    fetchTrackedItems();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };

  }, [orderId]);

  useEffect(() => {
    let socket;

    const isTokenExpired = (token) => {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return Date.now() >= payload.exp * 1000;
      } catch {
        return true;
      }
    };

    const connect = () => {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);

      // No token → stop the server connection (or redirect to login)
      if (!token) {
        console.warn("❌ No token, skipping WebSocket");
        toast.error("session expired, Please sign in to enable live tracking");
        navigate("/signin");
        return;
      }

      // Decode expiry safely
      let payload;
      try {
        payload = JSON.parse(atob(token.split(".")[1]));
        const expDate = new Date(payload.exp * 1000);

        console.log("Token expires at:", expDate.toLocaleString());
      } catch (e) {
        console.error("Invalid token format ❌");
        return;
      }

      // Expired token → stop (or refresh here)
      if (isTokenExpired(token)) {
        console.warn("🔄 Token expired → refreshing...");
        setConnected(false);
        return;
      }

      // CONNECT websocket with token
      socket = new WebSocket(
        `ws://127.0.0.1:8000/ws/tracking/?token=${token}`
      );

      socket.onopen = () => {
        setConnected(true);
        console.log("✅ WebSocket connected");
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        setTrackedItems((prev) =>
          prev.map((item) =>
            item.id === data.id ? { ...item, ...data } : item
          )
        );

        toast.success(`Order #${data.order_id} → ${data.status}`);
      };

      socket.onerror = (err) => {
        console.error("❌ WebSocket error", err);
        socket.close(); // triggers reconnect
      };

      socket.onclose = () => {
        setConnected(false);
        console.log("⚠️ Socket closed, reconnecting in 3s...");

        setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      socket?.close();
    };
  }, []);

  return (
    <div className="flex min-h-screen">
      <ProfileSidePanel />

      <main className="flex-grow p-6">
        <h1 className="text-2xl font-bold mb-6">Tracking</h1>

        <div className="flex justify-between">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 mb-4 px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 transition"
          >
            <FaArrowLeft />
            Back
          </button>
          <p className={`text-xs mb-2 flex items-center gap-2 ${connected ? "text-green-600" : "text-red-500"}`}>
            {!connected && (
              <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
            )}

            {connected ? "Live tracking connected ✅" : "Connecting..."}
          </p>        
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-500">Loading tracked items...</p>
          </div>
        )}

        {/* ERROR */}
        {error && <p className="text-red-500">{error}</p>}

        {/* CONTENT */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">

              <thead>
                <tr>
                  <th className="p-3 border text-left">Tracking #</th>
                  <th className="p-3 border text-left">Order #</th>
                  <th className="p-3 border text-left">Item</th>
                  <th className="p-3 border text-left">Status</th>
                  <th className="p-3 border text-left">Delivery</th>
                </tr>
              </thead>

              <tbody>
                {trackedItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-6 text-gray-500">
                      {orderId 
                        ? `No tracking found for order #${orderId}`
                        : "No tracked items yet"}
                    </td>
                  </tr>
                ) : (
                  trackedItems.map(item => (
                    <React.Fragment key={item.id}>

                      {/* MAIN ROW */}
                      <tr
                        onClick={() =>
                          setExpandedRow(expandedRow === item.id ? null : item.id)
                        }
                        className="cursor-pointer hover:bg-indigo-50 transition"
                      >
                        <td className="p-3 border">{item.tracking_number}</td>
                        <td className="p-3 border">#{item.order_id}</td>
                        <td className="p-3 border">{item.item_name || "N/A"}</td>

                        {/* STATUS COLUMN WITH PROGRESS */}
                        <td className="p-3 border">

                          {/* PROGRESS WITH ICONS */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            {statusSteps.map((step, index) => {
                              const status = item.status?.toLowerCase() || "pending";
                              const currentIndex = statusSteps.indexOf(status);

                              return (
                                <div key={step} className="flex items-center">

                                  <div
                                    className={`flex items-center justify-center w-6 h-6 rounded-full text-xs transition ${
                                      index === currentIndex
                                        ? "bg-indigo-700 text-white scale-110"
                                        : index < currentIndex
                                        ? "bg-indigo-600 text-white"
                                        : "bg-gray-300 text-gray-500"
                                    }`}
                                  >
                                    {statusIcons[step]}
                                  </div>

                                  {index < statusSteps.length - 1 && (
                                    <div
                                      className={`w-8 h-1 ${
                                        index < currentIndex
                                          ? "bg-indigo-600"
                                          : "bg-gray-300"
                                      }`}
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* LABELS */}
                          <div className="flex justify-between text-[10px] text-gray-400 mb-2">
                            {statusSteps.map(step => (
                              <span key={step}>
                                {step.replace("_"," ")}
                              </span>
                            ))}
                          </div>

                          {/* BADGE */}
                          <span className={`px-2 py-1 rounded text-sm ${
                            statusStyles[item.status?.toLowerCase()] || "bg-gray-100 text-gray-700"
                          }`}>
                            {item.status_display || item.status}
                          </span>

                        </td>

                        <td className="p-3 border">
                          {item.estimated_delivery
                            ? new Date(item.estimated_delivery).toLocaleDateString()
                            : '-'}
                        </td>
                      </tr>

                      {/* TIMELINE */}
                      {expandedRow === item.id && (
                        <tr>
                          <td colSpan="5" className="p-4 bg-gray-50">
                            <div className="border-l-2 border-indigo-300 pl-4 space-y-4">

                              {item.events?.length ? (
                                item.events.map(event => (
                                  <div key={event.id} className="relative">

                                    <div className="absolute -left-[9px] top-1 w-4 h-4 bg-indigo-500 rounded-full"></div>

                                    <p className="font-semibold capitalize text-sm">
                                      {event.status.replace("_"," ")}
                                    </p>

                                    {event.description && (
                                      <p className="text-sm text-gray-500">
                                        {event.description}
                                      </p>
                                    )}

                                    <span className="text-xs text-gray-400">
                                      {new Date(event.created_at).toLocaleString()}
                                    </span>

                                  </div>
                                ))
                              ) : (
                                <p className="text-gray-400">No updates yet</p>
                              )}

                            </div>
                          </td>
                        </tr>
                      )}

                    </React.Fragment>
                  ))
                )}
              </tbody>

            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Tracking;