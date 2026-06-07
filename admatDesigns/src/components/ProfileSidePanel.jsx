import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import {
  LayoutDashboard,
  ShoppingBag,
  Truck,
  MapPin,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  User
} from "lucide-react";

const ProfileSidePanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const profileLinks = [
    { label: "Dashboard", path: "/account/dashboard", icon: LayoutDashboard },
    { label: "My Orders", path: "/orders", icon: ShoppingBag },
    { label: "Track Orders", path: "/orders-tracking", icon: Truck },
    { label: "Addresses", path: "/account/addresses", icon: MapPin },
    { label: "Billing", path: "/account/billing", icon: CreditCard },
    { label: "Profile", path: "/account/profile", icon: User },
    { label: "Settings", path: "/account/settings", icon: Settings }
  ];

  return (
    <div className="flex h-screen">
      
      {/* MOBILE MENU BUTTON */}
      <div className="lg:hidden fixed top-15 left-4 z-[50]">
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          className=" p-2 rounded-lg text-white bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-lg"
        >
          <Menu className="w-6 h-6 text-white"/>
        </button>      
      </div>

      {/* OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-xs z-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-screen w-auto bg-gradient-to-b from-orange-300 to-orange-100 p-4 pt-14 transform transition-all duration-300 flex flex-col gap-6 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:sticky lg:w-70 top-5 lg:left-0 start-self lg:max-h[calc(100vh-80px)] lg:overflow-y-auto`}
      >
          {/* CLOSE BUTTON (mobile) */}
          
          <div className="lg:hidden flex justify-end mb-4">
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X className="text-orange-900 w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col items-center">
            
            {/* USER INFO WITH AVATAR */}
          <div className="mb-6 p-4 bg-orange-600 rounded-xl shadow">

            <div className="flex items-center gap-3">
              {/* AVATAR */}
              <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold overflow-hidden">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.username?.[0]?.toUpperCase() || "U"
                )}
              </div>

                <div className=" flex flex-col">

                {/* USERNAME (same row as image) */}
                <p className="text-orange-200 font-semibold text-lg">
                  {user?.username || "---"}
                </p>
                {/* EMAIL (below) */}
                <p className="text-orange-200 text-sm mt-1">
                  {user?.email || "---"}
                </p>
              </div>
            </div>

    
          </div>

            {/* NAV LINKS */}
            <div className="flex flex-col gap-2 flex-1 overflow-y-auto p-2  w-full">
              {profileLinks.map((link, i) => {
                const Icon = link.icon;

                return (
                  <NavLink
                    key={i}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-xl transition ${
                        isActive
                          ? "bg-white text-orange-600 font-semibold shadow border border-orange-300"
                          : "text-gray-700 hover:bg-orange-200"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={`w-5 h-5 mr-3 ${
                            isActive ? "text-orange-600" : "text-gray-500"
                          }`}
                        />
                        {link.label}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
        </div>
        {/* LOGOUT BUTTON */}
        <div className="flex items-start ">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full gap-2 bg-red-600 text-white py-3 rounded hover:bg-red-700 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfileSidePanel;