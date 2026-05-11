import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import Contact from "./pages/Contact";
import About from "./pages/About";
import DiscountProducts from "./pages/DiscountProducts";
import ProductDetails from "./pages/ProductDetails";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import CategoryProducts from "./pages/CategoryProducts";

import Account from "./pages/User/Account";
import Settings from "./pages/User/Settings";

import Cart from "./pages/Orders/Cart";
import Orders from "./pages/Orders/Orders";
import Payments from "./pages/Orders/Payments";
import Checkout from "./pages/Orders/Checkout";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = () => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(Boolean(token));
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      {/* auth state */}
      <Navbar isAuthenticated={isAuthenticated} />

      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          duration: 2500,
          style: {
            borderRadius: "12px",
            background: "#4F46E5",
            color: "#fff",
          },
        }}
      />

      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            {/* ✅ Auth routes */}
            <Route
              path="/signin"
              element={
                isAuthenticated
                  ? <Navigate to="/" />
                  : <SignIn onLogin={checkAuth} />
              }
            />
            <Route
              path="/signup"
              element={
                isAuthenticated
                  ? <Navigate to="/" />
                  : <SignUp onSignUp={checkAuth} />
              }
            />

            {/* ✅ Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id/:slug" element={<ProductDetails />} />
            <Route path="/category/:slug" element={<CategoryProducts/>} />
            <Route path="/discount_products" element={<DiscountProducts />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFoundPage />} />

            {/* ✅ Protected routes */}
            <Route
              path="/cart"
              element={isAuthenticated ? <Cart /> : <Navigate to="/signin" />}
            />
            <Route
              path="/account"
              element={isAuthenticated ? <Account /> : <Navigate to="/signin" />}
            />
            <Route
              path="/orders"
              element={isAuthenticated ? <Orders /> : <Navigate to="/signin" />}
            />
            <Route
              path="/settings"
              element={isAuthenticated ? <Settings /> : <Navigate to="/signin" />}
            />
            <Route
              path="/checkout"
              element={isAuthenticated ? <Checkout /> : <Navigate to="/signin" />}
            />
            <Route
              path="/payments"
              element={isAuthenticated ? <Payments /> : <Navigate to="/signin" />}
            />
          </Routes>
        </main>
      </div>

      <Footer />
    </>
  );
}

export default App;