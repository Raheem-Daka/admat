import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import Cart from "./pages/User/Cart";
import Profile from "./pages/User/Profile";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/auth/check/",
        { credentials: "include" }
      );
      setIsAuthenticated(res.ok);
    } catch {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} />

      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>

            {/* ✅ Auth routes (ONLY ONCE) */}
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
            <Route path="/products/:id/:slug" element={<ProductDetails />} />
            <Route path="/discount_products" element={<DiscountProducts />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* ✅ Protected routes */}
            <Route
              path="/cart"
              element={
                isAuthenticated
                  ? <Cart />
                  : <Navigate to="/signin" />
              }
            />
            <Route
              path="/profile"
              element={
                isAuthenticated
                  ? <Profile />
                  : <Navigate to="/signin" />
              }
            />
          </Routes>
        </main>
      </div>

      <Footer />
    </>
  );
}

export default App;