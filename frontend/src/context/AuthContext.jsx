import { createContext, useMemo, useState } from 'react';

export const AuthContext = createContext({
  user: null,
  token: null,
  loading: false,
  setAuth: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading] = useState(false);

  const setAuth = (nextUser, nextToken) => {
    setUser(nextUser || null);
    setToken(nextToken || null);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({ user, token, loading, setAuth, logout }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};