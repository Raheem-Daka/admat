import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { toast } from "sonner";
import { User2Icon, Key, Package } from "lucide-react";

const ProfileDropdown = ({ close, toggleMenu, onLogout }) => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const options = [
    { label: "Account", path: "/account/dashboard", icon: Key },
    { label: "Profile", path: "/account/profile", icon: User2Icon },
    { label: "Orders", path: "/orders", icon: Package },
  ];

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

  const handleProtectedClick = (path) => {
    if (!user) {
      toast.error("You must be signed in to access this page.");
      close();
      toggleMenu?.();   // ✅ close mobile menu
      navigate("/signin");
      return;
    }

    close();
    toggleMenu?.();     // ✅ FIX (CRITICAL)
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    close();
    toggleMenu?.();     // ✅ FIX (CRITICAL)
    navigate("/", { replace: true });
  };

  return (
    <div
      ref={ref}
      className="relative right-0 top-0 w-50 bg-white text-black rounded shadow-lg py-2 z-50 "
      onClick={(e) => e.stopPropagation()}
    >
      {options.map((option) => {
        const Icon = option.icon;

        return (
          <button
            key={option.label}
            onClick={() => handleProtectedClick(option.path)}
            className="flex items-center gap-2 w-full text-left px-4 py-2 
                      hover:bg-orange-600 hover:rounded hover:text-orange-200 
                      transition group"
          >
            <Icon
              size={16}
              className="text-orange-600 transition group-hover:text-orange-200"
            />
            {option.label}
          </button>
        );
      })}


      <button
        onClick={handleLogout}
        className="w-full text-left px-4 py-2 text-white bg-red-600 rounded absolute inset-x-0 bottom-[-45px] hover:bg-red-400 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default ProfileDropdown;