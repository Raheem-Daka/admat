import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const profileLinks = [
    { label: "Dashboard", path: "/account/dashboard", icon: LayoutDashboard },
    { label: "My Orders", path: "/orders", icon: ShoppingBag },
    { label: "Track Orders", path: "/orders-tracking", icon: Truck },
    { label: "Addresses", path: "/account/addresses", icon: MapPin },
    { label: "Billing", path: "/account/billing/", icon: CreditCard },
    { label: "Profile", path: "/account/profile", icon: User },
    { label: "Settings", path: "/account/settings", icon: Settings },
  ];

  return (
    <div className="relative min-h-screen">
      {/* MOBILE MENU BUTTON (outside sidebar) */}
      <div className="lg:hidden p-4">
        <button onClick={() => setIsOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-indigo-100 p-4 z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:flex flex-col relative`}
      >
        {/* CLOSE BUTTON (mobile only) */}
        <div className="lg:hidden flex justify-end mb-4">
          <button onClick={() => setIsOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* USER INFO */}
        <div className="mb-6 p-4 bg-white rounded-xl shadow">
          <p className="font-semibold text-lg">{user?.username || "---"}</p>
          <p className="text-sm text-gray-500">{user?.email || "---"}</p>
        </div>

        {/* NAV LINKS */}
        <div className="flex flex-col gap-2">
          {profileLinks.map((link, i) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={i}
                to={link.path}
                onClick={() => setIsOpen(false)} // auto-close on mobile
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-xl transition ${
                    isActive
                      ? "bg-white text-indigo-700 font-semibold shadow border border-indigo-300"
                      : "text-gray-700 hover:bg-indigo-200"
                  }`
                }
              >
                <Icon className="w-5 h-5 mr-3" />
                {link.label}
              </NavLink>
            );
          })}
        </div>

        {/* LOGOUT */}
        <div className="absolute inset-x-0 w-full bottom-2 pt-6">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full gap-2 bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition"
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