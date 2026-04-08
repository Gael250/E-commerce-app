import { useContext, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const cartCount = useMemo(() => (cartItems ? cartItems.length : 0), [cartItems]);

  const handleLogout = () => {
    logout?.();
    navigate('/');
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/?q=${encodeURIComponent(q)}`);
    setMobileOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-gray-900">
            E-Shop
          </Link>

          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-1.5"
          >
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 outline-none text-sm"
              aria-label="Search products"
            />
            <button
              type="submit"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Search
            </button>
          </form>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link
              to="/cart"
              className="text-gray-700 hover:text-gray-900 relative"
            >
              Cart
              {cartCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-xs px-2 py-0.5">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700">
                  Hi, {user.name || user.email || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-700 hover:text-gray-900"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-gray-700 hover:text-gray-900">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden px-2 py-1 border border-gray-300 rounded text-gray-700"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            Menu
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 py-3 space-y-3">
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2"
            >
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-sm"
                aria-label="Search products"
              />
              <button
                type="submit"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Search
              </button>
            </form>

            <div className="flex flex-col gap-2">
              <Link
                to="/"
                className="text-gray-700 hover:text-gray-900"
                onClick={() => setMobileOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/cart"
                className="text-gray-700 hover:text-gray-900"
                onClick={() => setMobileOpen(false)}
              >
                Cart{cartCount > 0 ? ` (${cartCount})` : ''}
              </Link>
            </div>

            {user ? (
              <button
                onClick={handleLogout}
                className="text-left text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-gray-700 hover:text-gray-900"
                  onClick={() => setMobileOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;