import React, { useEffect, useState } from "react";
import ProfileSidePanel from "../../components/ProfileSidePanel";
import { ACCESS_TOKEN_KEY } from "../../utils/authKeys";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../api/api";
import { useAuth } from "../../utils/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "sonner";
import { useMemo } from "react";


const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [cards, setCards] = useState([]);

  const defaultAddress = addresses.find(addr => addr.is_default);
  const defaultCard = cards.find(card => card.is_default);


  const [filters, setFilters] = useState({
    status: "all",
    startDate: "",
    endDate: "",
  });



  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const status = (order.status || "").toLowerCase();

      if (filters.status !== "all" && status !== filters.status) return false;

      const date = new Date(order.created_at);

      if (filters.startDate && date < new Date(filters.startDate)) return false;
      if (filters.endDate && date > new Date(filters.endDate)) return false;

      return true;
    });
  }, [orders, filters]);

  const Card = ({ title, value, onClick }) => (

    <div
        onClick={onClick}
        className={`bg-white p-4 rounded-xl shadow transition-transform duration-200
          ${onClick ? "cursor-pointer hover:scale-[1.03] hover:shadow-lg" : ""}
        `}
      >
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>

  );
  const COLORS = ["#6366F1", "#22C55E", "#FACC15", "#EF4444"];

  const fetchData = async () => {
    try {
      if (!user) {
        const userData = await apiFetch("/profile/");
        setUser(userData);
      }

      const [addressData, cardData, orderData] = await Promise.all([
        apiFetch("/addresses/"),
        apiFetch("/billing/"),
        apiFetch("/orders/")
      ]);


      setAddresses(addressData?.results || addressData || []);


      const normalizedCards = (cardData?.results || cardData || []).map((card) => ({
        id: card.id,
        cardName: card.card_name || "Unknown",
        cardNumber: card.card_number || "",
        expiry: card.expiry || "--/--",
        is_default: card.is_default, // ✅ ADD THIS
      }));

      setCards(normalizedCards);

      const orderList = orderData?.results || orderData || [];
      setOrders(orderList);

    } catch (err) {
      navigate("/signin", { replace: true });
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    const init = async () => {
      try {
        if (!user) {
          const userData = await apiFetch("/profile/");
          setUser(userData);
        }

        await fetchData();
      } catch {
        navigate("/signin", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);


  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8000/ws/orders/");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      toast.info("📦 Order updated")
      fetchData(); 
    };

    return () => socket.close();
  }, []);

  // ✅ Derived data
  const activeOrders = filteredOrders.filter(
    (o) => (o.status || "").toLowerCase() !== "cancelled"
  );

  const cancelledOrders = filteredOrders.filter(
    (o) => (o.status || "").toLowerCase() === "cancelled"
  );

  const totalRevenue = filteredOrders.reduce(
    (sum, order) =>
      (order.status || "").toLowerCase() !== "cancelled"
        ? sum + Number(order.total || 0)
        : sum,
    0
  );

  const normalize = (s) => (s || "").toLowerCase();

  const statusData = ["delivered", "processing", "pending", "cancelled"].map(
    (status) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: filteredOrders.filter(
        (o) => normalize(o.status) === status
      ).length,
    })
  );

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <ProfileSidePanel />

      <div className="flex-1 p-6 transition-all duration-300">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-500">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold">
                Welcome, <span className="text-orange-600">{user?.username}</span>
              </h1>
              <p className="text-gray-500">
                Here’s your account overview
              </p>
            </div>

            {/*Date Filters */}
            <div className="flex gap-3 mt-4 flex-wrap py-5">

            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ 
                  ...filters, 
                  status: e.target.value 
                })
              }
              className="border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-600  rounded"
            >
              <option value="all">All</option>
              <option value="delivered">Delivered</option>
              <option value="processing">Processing</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
              className="border border-gray-300 p-2 text-sm  focus:outline-none focus:ring-2 focus:ring-orange-600  rounded"
            />

            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
              className="border border-gray-300 p-2 text-sm  focus:outline-none focus:ring-2 focus:ring-orange-600  rounded"
            />

            <button
              onClick={() =>
                setFilters({ status: "all", startDate: "", endDate: "" })
              }
              className="px-3 py-2 bg-gray-200 rounded text-sm hover:bg-gray-300 hover:cursor-pointer"
            >
              Reset
            </button>

          </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

              <Card title="Revenue" value={`MWK ${totalRevenue.toLocaleString("en-MW")}`} />

              <Card onClick={() => navigate("/orders")} title="Active Orders" value={activeOrders.length} />

              <Card onClick={() => navigate("/orders")} title="Cancelled" value={cancelledOrders.length} />

              <Card title="Total Orders" value={filteredOrders.length} />

            </div>

            {/* CHARTS */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">

              {/* BAR CHART */}
              <div className="bg-white p-5 rounded-xl shadow">
                <h2 className="mb-4 font-semibold">Order Status</h2>
                
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={statusData}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false}/>
                    <Tooltip />
                    <Bar dataKey="value" fill="#ea580c" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* PIE CHART */}
              <div className="bg-white p-5 rounded-xl shadow">
                <h2 className="mb-4 font-semibold">Distribution</h2>
              
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      outerRadius={90}
                      innerRadius={30}
                      label
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

              </div>

            </div>

            {/* RECENT ORDERS */}
            <div className="mt-8 bg-white p-5 rounded-xl shadow">
              <h2 className="mb-4 font-semibold">Recent Orders</h2>

              <div className="space-y-3">
                {activeOrders.length === 0 ? (
                  <p className="text-gray-500 italic">No orders yet.</p>
                ) : (
                  activeOrders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="flex justify-between p-3 border border-gray-300 rounded"
                    >
                      <p>
                        #{order.id} - {order.status}
                      </p>
                      <span className="font-semibold text-orange-600">
                        MWK {Number(order.total || 0).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8 bg-white p-5 rounded-xl shadow">

              {/* Addresses */}
              <div
                onClick={() => navigate("/account/addresses")}
                className="border-2 rounded p-3 border-orange-600 cursor-pointer hover:scale-[1.02] transition"
              >
                {defaultAddress ? (
                  <>
                    <span className="text-xs bg-orange-200 text-orange-700 px-2 py-1 rounded mb-2 inline-block">
                      Default
                    </span>
                    <p className="font-semibold text-gray-500">{defaultAddress.full_name}</p>
                    <p className="text-sm">{defaultAddress.street}</p>
                    <p className="text-sm">{defaultAddress.city}</p>
                  </>
                ) : (
                  <p>No default address</p>
                )}
              </div>            
              
              {/* Payment Methods */}
              <div
                onClick={() => navigate("/account/billing")}
                className="border-2 rounded p-3 border-orange-600 cursor-pointer hover:scale-[1.02] transition"
              >
                {defaultCard ? (
                  <>
                    <span className="text-xs bg-orange-200 text-orange-700 px-2 py-1 rounded mb-2 inline-block">

                      Default
                    </span>
                    <p className="font-semibold text-gray-500">{defaultCard.cardName}</p>
                    <p>**** **** **** {defaultCard.cardNumber}</p>
                    <p className="text-sm">{defaultCard.expiry}</p>
                  </>
                ) : (
                  <p>No default card</p>
                )}
              </div>
              {/*Other Cards goes here */}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
