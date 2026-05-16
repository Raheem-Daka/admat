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
import OrderDetail from "./pages/Orders/OrderDetails";
import Payments from "./pages/Orders/Payments";
import Checkout from "./pages/Orders/Checkout";
import NotFoundPage from "./pages/NotFoundPage";

import { ACCESS_TOKEN_KEY } from "./utils/authKeys";
import { useAuth } from "./utils/AuthContext";
import ProtectedRoute from "./utils/ProtectedRoute";
import AccountPage from "./pages/AccountPage";
import OurPopularProducts from "./components/OurPopularProductsComponent";
import SearchPage from "./pages/SearchPage";

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
            <Route path="/contact" element={<Contact />} />
            <Route path="/our_popular_products" element={<OurPopularProducts />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="*" element={<NotFoundPage />} />

            {/* ✅ Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/cart" element={<Cart />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/order_details/:id" element={<OrderDetail />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payments" element={<Payments />} />

            </Route>
          </Routes>
        </main>
      </div>

      <Footer />
    </>
  );
}

export default App;