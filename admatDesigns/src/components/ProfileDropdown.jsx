import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const ProfileDropdown = ({ close }) => {
  const ref = useRef();
  const navigate = useNavigate();

  const options = [
    { label: "Profile", path: "/profile" },
    { label: "Cart", path: "/cart" },
    { label: "Orders", path: "/orders" },
  ];

  // Close when clicking outside
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

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    close();
    navigate("/signin");
  };

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
        onClick={logout}
        className="w-full text-left px-4 py-2 text-white bg-red-500 hover:cursor-pointer hover:bg-red-400 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default ProfileDropdown;