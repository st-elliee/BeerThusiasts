import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem("cart");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const add = (beer, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((p) => p.beer_id === beer.beer_id);
      if (found) {
        return prev.map((p) => (p.beer_id === beer.beer_id ? { ...p, quantity: p.quantity + qty } : p));
      }
      return [...prev, { beer_id: beer.beer_id, beer_name: beer.beer_name, price: Number(beer.price), quantity: qty }];
    });
  };

  const update = (beer_id, quantity) => {
    setItems((prev) => prev.map((p) => (p.beer_id === beer_id ? { ...p, quantity } : p)));
  };

  const remove = (beer_id) => setItems((prev) => prev.filter((p) => p.beer_id !== beer_id));

  const clear = () => setItems([]);

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, add, update, remove, clear, total }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
