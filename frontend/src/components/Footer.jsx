import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <h3 className="text-2xl font-bold mb-3">E-Shop</h3>
          <p className="text-gray-300 text-sm">
            Quality products, simple checkout, and fast delivery.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link to="/" className="hover:text-white">Home</Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-white">Cart</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white">Login</Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-white">Register</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Customer Care</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>Support: support@eshop.com</li>
            <li>Phone: +250 700 000 000</li>
            <li>Hours: Mon–Sat, 8am–6pm</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Newsletter</h4>
          <p className="text-sm text-gray-300 mb-3">
            Get product updates and offers in your inbox.
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="w-full rounded-md px-3 py-2 text-sm text-gray-900"
              aria-label="Email address"
            />
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-md"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 text-xs text-gray-400 flex flex-col sm:flex-row gap-2 justify-between">
          <span>© {new Date().getFullYear()} E-Shop. All rights reserved.</span>
          <span>Privacy Policy · Terms</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;