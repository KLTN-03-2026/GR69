import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
}
interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: any, quantity: number) => void;
    increaseQty: (id: number) => void;
    decreaseQty: (id: number) => void;
    updateQty: (id: number, qty: number) => void;
    removeItem: (id: number) => void;
    subtotal: number;
    total: number;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);
export const CartProvider = ({ children }: any) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product: any, quantity: number) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            let updatedItems;

            if (existing) {
                updatedItems = prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                updatedItems = [
                    ...prev,
                    {
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.images?.[0]?.image_path,
                        quantity: quantity,
                    },
                ];
            }
            toast.success(`Đã thêm ${quantity} ${product.name} vào giỏ hàng!`);
            return updatedItems;
        });
    };

    const increaseQty = (id: number) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    const decreaseQty = (id: number) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
                    : item
            )
        );
    };

    const removeItem = (id: number) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const updateQty = (id: number, qty: number) => {
        if (qty < 1) qty = 1;
        setCartItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, quantity: qty }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };
    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const shippingFee = 30000;
    const total = subtotal + shippingFee;

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                increaseQty,
                decreaseQty,
                updateQty,
                removeItem,
                subtotal,
                total,
                clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
};