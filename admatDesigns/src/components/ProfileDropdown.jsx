import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { toast } from "sonner";

const ProfileDropdown = ({ close }) => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const { logout, user } = useAuth(); // assuming AuthContext provides user

  const options = [
    { label: "Account", path: "/account" },
    { label: "Cart", path: "/cart" },
    { label: "Orders", path: "/orders" },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        close();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [close]);

  const handleLogout = () => {
    logout();
    close();
    navigate("/", { replace: true });
  };

  const handleProtectedClick = (path) => {
    if (!user) {
      toast.error("You must be signed in to access this page.");
      close();
      return;
    }
    close();
    navigate(path);
  };

  return (
    <div
      ref={ref}
      className="absolute right-0 top-14 w-44 bg-white text-black rounded-md shadow-lg py-2 z-50"
    >
      {options.map((option) => (
        <button
          key={option.label}
          onClick={() => handleProtectedClick(option.path)}
          className="block w-full text-left px-4 py-2 hover:bg-indigo-500 hover:text-white transition"
        >
          {option.label}
        </button>
      ))}

      <div className="border-t my-1" />

      <button
        onClick={handleLogout}
        className="w-full text-left px-4 py-2 text-white bg-red-500 hover:bg-red-400 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default ProfileDropdown;
