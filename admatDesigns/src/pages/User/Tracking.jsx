import React, { useEffect, useState, useRef } from 'react';
import ProfileSidePanel from '../../components/ProfileSidePanel';
import { ACCESS_TOKEN_KEY } from '../../utils/authKeys';
import { apiFetch } from '../../api/api';
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  FaArrowLeft,
  FaBox,
  FaCog,
  FaTimesCircle,
  FaTruck, 
  FaShippingFast, 
  FaCheckCircle } 
from 'react-icons/fa';
import { toast } from "sonner"

const WS_URL = import.meta.env.VITE_WS_URL;

const Tracking = () => {
  const [trackedItems, setTrackedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [prevStatuses, setPrevStatuses] = useState({})
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [highlightId, setHighlightId] = useState(null);
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order");
  const reconnectRef = useRef(null);

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
    delivered: "bg-orange-100 text-orange-700",
    shipped: "bg-orange-200 text-orange-800",
    in_transit: "bg-amber-100 text-amber-700",
    processing: "bg-yellow-100 text-yellow-700",
    pending: "bg-gray-100 text-gray-600",
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

          const newStatuses = {};

          setTrackedItems(prev => {
            data.forEach(item => {
              const prevStatus = prevStatuses[item.id];

              if (prevStatus && prevStatus !== item.status) {
                toast.success(`Order #${item.order_id} is now ${item.status}`);
              }

              newStatuses[item.id] = item.status;
            });

            setPrevStatuses(newStatuses);
            return data;
          });
        
      } catch (err) {
        setError(err.message || 'Failed to load tracks');
        toast.error("Failed to load tracks")
      } finally {
        timeoutRef.current = setTimeout(() => {
          setLoading(false);
        }, 1000);
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
    let isMounted = true;

    const isTokenExpired = (token) => {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return Date.now() >= payload.exp * 1000;
      } catch {
        return true;
      }
    };

    const connect = () => {
      if(!isMounted) return;

      const token = localStorage.getItem(ACCESS_TOKEN_KEY);

      // No token → stop the server connection (or redirect to login)
      if (!token) {
        console.warn("❌ No token, skipping WebSocket");
        toast.error("session expired, Please sign in to enable live tracking");
        navigate("/signin");
        return;
      }

      // Expired token → stop (or refresh here)
      if (isTokenExpired(token)) {
        toast.error("Session expired. Please sign in again.");
        navigate("/signin");
        //setConnected(false);
        return;
      }

      // CONNECT websocket with token
      socketRef.current = new WebSocket(
        `${WS_URL}/ws/tracking/?token=${token}`
      );

      socketRef.current.onopen = () => {
        if (isMounted) {
          setConnected(true);
          console.log("✅ WebSocket connected");
        }
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);

        setTrackedItems((prev) =>
          prev.map((item) =>
            item.id === data.id ? { ...item, ...data } : item
          )
        );

        setPrevStatuses(prev => {
          if (prev[data.id] &&prev[data.id] !== data.status) {
            toast.success(`Order #${data.order_id} → ${data.status}`);
          }

          return { ...prev, [data.id]: data.status };
        });
        
        // highlight + scroll
        setHighlightId(data.id);
        setTimeout(() => setHighlightId(null), 1500);
      
        setTimeout(() => {
          document.getElementById(`row-${data.id}`)?.scrollIntoView({
            behavior: "smooth",
          });          
        }, 100)
      };

      socketRef.current.onerror = (err) => {
        console.error("❌ WebSocket error", err);
        socketRef.current?.close(); 
      };

      socketRef.current.onclose = () => {
        if (!isMounted) return;

        setConnected(false);

        const token =localStorage.getItem(ACCESS_TOKEN_KEY);
        if(!token || isTokenExpired(token)) return;
        console.log("⚠️ Socket closed, reconnecting in 3s...");

        reconnectRef.current = setTimeout(connect, 3000);
        
      };
    };

    connect();

    return () => {
      isMounted = false;
      socketRef.current?.close();
      
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current);
      }                                                               
    };
  }, []);

  return (
    <div className="flex min-h-screen">
      <ProfileSidePanel />

      <main className="flex-1 p-6 transition-all duration-300">
        <h1 className="text-2xl font-bold mb-6">Tracking</h1>

        <div className="flex justify-between">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 mb-4 px-4 py-2 text-white bg-orange-600 rounded hover:bg-orange-700 transition"
          >
            <FaArrowLeft />
            Back
          </button>

          <div className={`flex items-center gap-2 text-xs mb-2 ${connected ? "text-green-600" : "text-red-500"}`}>

            {/* CONNECTING (spinner) */}
            {!connected && (
              <>
                <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                <span>Connecting...</span>
              </>
            )}

            {/* CONNECTED (ping + dot + text) */}
            {connected && (
              <>
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                </span>

                <span>Live tracking connected</span>
              </>
            )}

          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-500">Loading tracked items...</p>
          </div>
        )}

        {/* ERROR */}
        {error && <p className="text-red-500">{error}</p>}

        {/* CONTENT */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded">

              <thead className='text-gray-500 rounded'>
                <tr>
                  <th className="p-3 border text-left">Tracking #</th>
                  <th className="p-3 border text-left">Order #</th>
                  <th className="p-3 border text-left">Item</th>
                  <th className="p-3 border text-left">Status</th>
                  <th className="p-3 border text-left">Delivery</th>
                </tr>
              </thead>

              <tbody className="border border-gray-300">
                {trackedItems.length === 0 ? (
                  <tr className="border border-gray-300">
                    <td colSpan="5" className="text-center p-6 text-gray-500">
                      {orderId 
                        ? `No tracking found for order #${orderId}`
                        : "No tracked items yet"}
                    </td>
                  </tr>
                ) : (
                  trackedItems.map(item => {
                    
                    const isCancelled = item.status?.toLowerCase() === "cancelled";

                    return (
                    <React.Fragment key={item.id}>

                      {/* MAIN ROW */}
                      <tr
                        id={`row-${item.id}`}
                        onClick={() =>
                          setExpandedRow(expandedRow === item.id ? null : item.id)
                        }                        
                        className={`cursor-pointer transition text-sm text-gray-500 ${highlightId === item.id
                          ? "bg-yellow-100"
                              : item.status?.toLowerCase() === "cancelled"
                              ? "bg-red-50 hover:bg-red-100"
                              : "hover:bg-orange-50"
                          }`
                        }
                      >
                        <td className="p-3 border">{item.tracking_number}</td>
                        <td className="p-3 border">#{item.order_id}</td>
                        <td className="p-3 border">{item.item_name || "N/A"}</td>

                        {/* STATUS COLUMN WITH PROGRESS */}
                        <td className="p-3 border">
                       
                          {/* PROGRESS WITH ICONS */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                          {isCancelled ? (
                            <div className="flex items-center justify-center w-full">
                              <span className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded-full">
                                <FaTimesCircle className="inline mr-1" />
                                Cancelled
                              </span>
                              
                            </div>
                          ) : (
                            statusSteps.map((step, index) => {
                              const status = item.status?.toLowerCase() || "pending";
                              const currentIndex = statusSteps.indexOf(status);
                              const isActive = index === currentIndex;

                              return (
                                <div key={step} className="flex flex-col items-center">

                                  <div className="flex items-center">
                                    <div
                                      className={`flex items-center justify-center w-6 h-6 rounded-full text-xs transition ${
                                        isActive
                                          ? "bg-orange-600 text-white"
                                          : index < currentIndex
                                          ? "bg-orange-400 text-white"
                                          : "bg-gray-300 text-gray-500"
                                      }`}
                                    >
                                      
                                    {statusIcons[step]}
                                    </div>

                                    {index < statusSteps.length - 1 && (
                                      <div
                                        className={`w-8 h-1 ${
                                          index < currentIndex
                                            ? "bg-orange-300"
                                            : "bg-gray-300"
                                        }`}
                                      />
                                    )}
                                  </div>

                                  {isActive && (
                                    <span className="mt-1 text-[10px] text-orange-600 font-semibold">
                                      {step.replace("_", " ")}
                                    </span>
                                  )}
                                </div>
                              );
                            })
                          )}                          
                          </div>
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
                            <div className="border-l-2 border-orange-300 pl-4 space-y-4">

                              {item.events?.length ? (
                                item.events.map(event => (
                                  <div key={event.id} className="relative">

                                    <div className="flex items-center gap-2 mb-1 gap-2">

                                      {/* Pinging DOT */}
                                      <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-600"></span>
                                      </span>

                                      <p className="font-semibold capitalize text-sm">
                                        {event.status.replace("_"," ")}
                                      </p>
                                    </div>

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
                    )
                  })
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