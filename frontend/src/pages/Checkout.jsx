import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();

  // --- State ---
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // --- Validation ---
  const validate = () => {
    const newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    }
    if (!form.street.trim()) {
      newErrors.street = "Street address is required.";
    }
    if (!form.city.trim()) {
      newErrors.city = "City is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // --- Input Change Handler ---
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // --- Form Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          status: "pending",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to place order. Please try again.");
      }

      const data = await response.json();

      navigate("/order-confirm", {
        state: { orderId: data.orderId },
      });
    } catch (err) {
      setServerError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // --- UI ---
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Checkout</h1>
        <p className="text-sm text-gray-500 mb-8">
          Fill in your delivery details below.
        </p>

        {serverError && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-6">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm
                ${errors.fullName ? "border-red-400 bg-red-50" : "border-gray-300"}`}
            />
            {errors.fullName && (
              <p className="text-xs text-red-500">{errors.fullName}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm
                ${errors.phone ? "border-red-400 bg-red-50" : "border-gray-300"}`}
            />
            {errors.phone && (
              <p className="text-xs text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Street */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <input
              name="street"
              type="text"
              value={form.street}
              onChange={handleChange}
              placeholder="123 Main Street"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm
                ${errors.street ? "border-red-400 bg-red-50" : "border-gray-300"}`}
            />
            {errors.street && (
              <p className="text-xs text-red-500">{errors.street}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              name="city"
              type="text"
              value={form.city}
              onChange={handleChange}
              placeholder="New York"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm
                ${errors.city ? "border-red-400 bg-red-50" : "border-gray-300"}`}
            />
            {errors.city && (
              <p className="text-xs text-red-500">{errors.city}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
}