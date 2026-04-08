import { createContext, useContext, useMemo, useState } from 'react';

export const CartContext = createContext({
  cartItems: [],
  setCartItems: () => {},
  cartCount: 0,
  setCartCount: () => {},
});

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const value = useMemo(
    () => ({ cartItems, setCartItems, cartCount, setCartCount }),
    [cartItems, cartCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);