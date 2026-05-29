import React, { useEffect, useState } from "react";
import ProfileSidePanel from "../../components/ProfileSidePanel";
import { ACCESS_TOKEN_KEY } from "../../utils/authKeys";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (!storedToken) {
      navigate("/signin", { replace: true });
      return;
    }

    // Simulate API delay
    setTimeout(() => {
      setUser({
        username: user?.username || "user",
        email: user?.email || "email",
      });
      setLoading(false);
    }, 1200);
  }, [navigate]);

  return (
    <div className="flex min-h-screen">
      
      {/* SIDEBAR */}
      <ProfileSidePanel />

      {/* CONTENT */}
      <div className="flex-1 p-6">
        <div>
          <h1 className="text-2xl font-bold">Account Dashboard</h1>

          <p className="mt-2 text-gray-600 font-medium">
            Hi, <span className="text-indigo-600">{user?.username}</span> 👋
          </p>

          <p className="mt-4 text-gray-500 text-sm">
            From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-500">Loading your dashboard...</p>
          </div>
        ) : (
          <>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-white shadow rounded-xl">
                <p className="text-sm text-gray-500">Orders</p>
                <p className="text-xl font-bold">12</p>
              </div>

              <div className="p-4 bg-white shadow rounded-xl">
                <p className="text-sm text-gray-500">Wishlist</p>
                <p className="text-xl font-bold">5</p>
              </div>

              <div className="p-4 bg-white shadow rounded-xl">
                <p className="text-sm text-gray-500">Addresses</p>
                <p className="text-xl font-bold">2</p>
              </div>
            </div>

            {/* RECENT ORDERS */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-3">Recent Orders</h2>

              <div className="space-y-3">
                <div className="p-3 bg-gray-100 rounded-lg">
                  Order #8 - <span className="text-yellow-600">Shipped</span>
                </div>
                <div className="p-3 bg-gray-100 rounded-lg">
                  Order #7 - <span className="text-green-600">Delivered</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;