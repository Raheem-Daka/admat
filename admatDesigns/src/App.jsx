import { useState } from 'react'
import { Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import Contact from './pages/Contact'
import About from './pages/About'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import DiscountProducts from './pages/DiscountProducts'
import ProductDetails from './pages/ProductDetails'

function App() {

  return (
    <>
    <Navbar />
    <div>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/discount_products" element={<DiscountProducts/>} />
            <Route path="/products/:id/:slug" element={<ProductDetails />} />
          </Routes>
        </main>
      </div>
    </div>
    <Footer />
    </>
  )
}

export default App
