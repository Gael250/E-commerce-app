


import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function OrderConfirm() {
  const location = useLocation();
  const orderId = location.state?.orderId;

  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    fetch(`/api/orders/${orderId}`)
      .then(res => res.json())
      .then(data => {
        setOrder(data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, [orderId]);


  const handleWhatsApp = () => {
    fetch('/api/whatsapp-redirect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderId: order.id,
        customerName: order.customerName,
        amount: order.totalPrice
      })
    })
      .then(res => res.json())
      .then(data => {
        setMessage('Opening WhatsApp...');
        window.open(data.whatsappUrl, '_blank');
      })
      .catch(err => console.log(err));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) return <p>Order not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Order Confirmed</h1>

      {message && <p className="text-green-600">{message}</p>}

      <p><b>Order ID:</b> {order.id}</p>
      <p><b>Name:</b> {order.customerName}</p>
      <p><b>Total:</b> ${order.totalPrice}</p>
      <p><b>Address:</b> {order.deliveryAddress}</p>

      <h3 className="mt-4 font-semibold">Items:</h3>
      <ul>
        {order.items && order.items.map((item, i) => (
          <li key={i}>
            {item.name} - {item.quantity} x ${item.price}
          </li>
        ))}
      </ul>

      <button
        onClick={handleWhatsApp}
        className="mt-6 bg-green-500 text-white px-4 py-2"
      >
        WhatsApp Shopkeeper
      </button>
    </div>
  );
}

export default OrderConfirm;

import { useLocation, useNavigate } from "react-router-dom";

export default function OrderConfirm() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve orderId safely
  const orderId = location.state?.orderId;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10 text-center">

        {/* Success Icon */}
        <div className="flex items-center justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="h-8 w-8 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-sm text-gray-500 mb-4">
          Thank you for your purchase. Your order has been placed successfully.
        </p>

        {/* Order ID */}
        {orderId ? (
          <div className="inline-block bg-gray-100 rounded-lg px-4 py-2 mb-8">
            <span className="text-xs text-gray-500">Order ID: </span>
            <span className="text-sm font-semibold text-gray-800">
              {orderId}
            </span>
          </div>
        ) : (
          <p className="text-xs text-red-400 mb-8">No order ID found.</p>
        )}

        {/* Back to Home Button */}
        <button
          onClick={() => navigate("/")}
          className="w-full rounded-lg bg-blue-600 hover:bg-blue-700
            text-white font-semibold text-sm py-3 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

