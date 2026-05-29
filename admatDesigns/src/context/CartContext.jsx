import { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "../api/api";
import { ACCESS_TOKEN_KEY } from "../utils/authKeys";
import { useAuth } from "../utils/AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();

    const fetchCart = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);

        if(!token) {
        setCart(null);
        setLoading(false);
        return;
        }

        try {
        const data = await apiFetch("/cart/");
        setCart(data);
        } catch (err) {
        setCart(null);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
        fetchCart();
        } else {
        setCart(null);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
        }
    }, [isAuthenticated]);

    return (
        <CartContext.Provider value={{ cart, setCart, fetchCart }}>
        {children}
        </CartContext.Provider>
    );
};