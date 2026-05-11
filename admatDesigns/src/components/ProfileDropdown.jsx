import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../utils/authKeys";
import { useAuth } from "../utils/AuthContent";


const ProfileDropdown = ({ close }) => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const options = [
    { label: "Account", path: "/account" },
    { label: "Cart", path: "/cart" },
    { label: "Orders", path: "/orders" },
  ];

  // ✅ Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [close]);

  const handleLogout = () => {
    logout();
    close();
    navigate("/", {replace: true})
  }

  return (
    <div
      ref={ref}
      className="absolute right-0 top-14 w-44 bg-white text-black rounded-md shadow-lg py-2 z-50"
    >
      {options.map((option) => (
        <Link
          key={option.label}
          to={option.path}
          onClick={close}
          className="block px-4 py-2 hover:bg-indigo-500 hover:text-white transition"
        >
          {option.label}
        </Link>
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