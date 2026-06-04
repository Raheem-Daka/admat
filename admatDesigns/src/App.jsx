import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Contact from "./pages/Contact";
import About from "./pages/About";
import DiscountProducts from "./pages/DiscountProducts";
import ProductDetails from "./pages/ProductDetails";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import CategoryProducts from "./pages/CategoryProducts";

import DashboardPage from "./pages/User/DashboardPage";
import Settings from "./pages/User/Settings";

import Cart from "./pages/Orders/Cart";
import Orders from "./pages/Orders/Orders";
import OrderDetails from "./pages/Orders/OrderDetails";
import Payments from "./pages/Orders/Payments";
import Checkout from "./pages/Orders/Checkout";
import NotFoundPage from "./pages/NotFoundPage";

import { ACCESS_TOKEN_KEY } from "./utils/authKeys";
import { useAuth } from "./utils/AuthContext";
import ProtectedRoute from "./utils/ProtectedRoute";
import Profile from "./pages/User/Profile";
import AccountPage from "./pages/User/DashboardPage";
import PopularProducts from "./pages/PopularProducts";
import SearchPage from "./pages/SearchPage";
import Billing from "./pages/User/Billing";
import Tracking from "./pages/User/Tracking";
import Addresses from "./pages/User/Addresses";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* auth state */}

      <Navbar isAuthenticated={isAuthenticated} />

      <Toaster
        position="top-center"
        richColors
        style={{ top: "5rem" }} 
        toastOptions={{
          duration: 2500,
          style: {
            borderRadius: "12px",
            background: "#ff4d00",
            color: "#fff",
          },
        }}
      />

      <div className="flex flex-col min-h-screen z-0">
        <main className="flex-grow pt-24">
          <Routes>
            {/* ✅ Auth routes */}
            <Route
              path="/signin"
              element={
                isAuthenticated === null
                  ? <div className="flex justify-center items-center h-screen">
                      Loading...
                    </div>
                  : isAuthenticated
                    ? <Navigate to="/" replace/>
                    : <SignIn />
              }
            />
            <Route
              path="/signup"
              element={
                isAuthenticated === null
                  ? <div className="flex justify-center items-center h-screen">
                      Loading...
                    </div>
                  : isAuthenticated
                    ? <Navigate to="/" replace />
                    : <SignUp />
              }
            />

            {/* ✅ Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id/:slug" element={<ProductDetails />} />
            <Route path="/category/:slug" element={<CategoryProducts/>} />
            <Route path="/discount_products" element={<DiscountProducts />} />
            <Route path="/about" element={<About />} />
            <Route path="/popular-products" element={<PopularProducts />} />
            <Route path="/search" element={<SearchPage />} />

            {/* ✅ Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/cart" element={<Cart />} />
              <Route path="/account/dashboard" element={<DashboardPage />} />
              <Route path="/account/profile" element={<Profile />} />
              <Route path="/account/settings" element={<Settings />} />
              <Route path="/account/billing" element={<Billing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/account/addresses" element={<Addresses />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/order-details/:id" element={<OrderDetails />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/orders-tracking" element={<Tracking />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>

      <Footer />
    </>
  );
}

export default App;