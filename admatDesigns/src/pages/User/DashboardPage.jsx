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

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [cards, setCards] = useState([]);

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

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (!token) {
      navigate("/signin", { replace: true });
      return;
    }

    const fetchData = async () => {
      try {
        if (!user) {
          const userData = await apiFetch("/profile/");
          setUser({ ...userData, token });
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
          expiry: card.expiry || "--/--"
        }));

        setCards(normalizedCards);

        const orderList = orderData?.results || orderData || [];
        setOrders(orderList);

      } catch (err) {
        navigate("/signin", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, user, setUser]);

  // ✅ Derived data
  const activeOrders = orders.filter(
    (o) => (o.status || "").toLowerCase() !== "cancelled"
  );

  const cancelledOrders = orders.filter(
    (o) => (o.status || "").toLowerCase() === "cancelled"
  );

  const totalRevenue = orders.reduce(
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
      value: orders.filter(
        (o) => normalize(o.status) === status
      ).length,
    })
  );

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      <ProfileSidePanel />

      <div className="flex-1 p-6 transition-all duration-300">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-500">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold">
                Welcome, <span className="text-indigo-600">{user?.username}</span>
              </h1>
              <p className="text-gray-500">
                Here’s your account overview
              </p>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

              <Card title="Revenue" value={`MWK ${totalRevenue.toLocaleString("en-MW")}`} />

              <Card onClick={() => navigate("/orders")} title="Active Orders" value={activeOrders.length} />

              <Card onClick={() => navigate("/orders")} title="Cancelled" value={cancelledOrders.length} />

              <Card title="Total Orders" value={orders.length} />

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
                    <Bar dataKey="value" fill="#6366F1" />
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
                      className="flex justify-between p-3 border rounded"
                    >
                      <p>
                        #{order.id} - {order.status}
                      </p>
                      <span className="font-semibold text-indigo-600">
                        MWK {Number(order.total || 0).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8 bg-white p-5 rounded-xl shadow">

              {/* Addresses */}
              <div>
                <div className="">
                  <h2 className="font-semibold">Addresses</h2>
                </div>
                <div 
                onClick={() => navigate("/account/addresses")}
                className="border rounded p-3 text-sm text-gray-500 mb-2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white cursor-pointer hover:scale-[1.02] hover:shadow-lg transition-transform duration-200">

                  {addresses.length === 0 ? (
                    <p>No addresses saved</p>
                  ) : (
                    addresses.slice(0, 2).map((addr, index) => (
                      <div key={index} className="mb-2">
                        <p className="font-semibold ">{addr.full_name}</p>
                        <p>{addr.street}</p>
                        <p className="text-sm ">{addr.city}</p>
                      </div>
                    ))
                  )}
                </div>                
                </div>
            
              
              {/* Payment Methods */}
              <div className="">
                <div>
                  <h2 className=" font-semibold">Cards</h2>
                </div>
                <div 
                onClick={() => navigate("/account/billing")}
                className="border rounded p-3 text-sm text-gray-500 mb-2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white cursor-pointer hover:scale-[1.02] hover:shadow-lg transition-transform duration-200">
                  {cards.length === 0 ? (
                    <p>No cards saved</p>
                  ) : (
                    cards.slice(0, 2).map((card, index) => (
                      <div key={index} className="mb-2">
                        <p className="font-semibold">{card.cardName || "Card"}</p>
                        <p className="font-medium ">
                          **** **** **** {card.cardNumber || ""}
                        </p>
                        <p className="text-sm">{card.expiry || "Card"}</p>
                      </div>
                    ))
                  )}
                </div>

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
