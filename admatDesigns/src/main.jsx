import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from "../src/utils/AuthContext.jsx"
import { CartProvider } from "./context/CartContext";

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <CartProvider>
          <App />
          </CartProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  </StrictMode>
)
