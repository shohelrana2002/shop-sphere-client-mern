import React, { useEffect, useState } from "react";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { serverURL } from "../../App";
import { ArrowLeft, Clock, Loader, Truck } from "lucide-react";
import { useNavigate } from "react-router";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const res = await axios.get(`${serverURL}/api/orders/my-orders`, {
          withCredentials: true,
        });
        setOrders(res.data.orders || []);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, []);
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="animate-spin text-lg  text-gray-500 dark:text-gray-300">
          <Loader size={48} />
        </p>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-10 max-w-md w-full text-center border border-gray-200 dark:border-gray-700"
        >
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 text-3xl">
              📦
            </div>
          </div>

          {/* Text */}
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            No Orders Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
            You haven’t placed any orders yet. Start exploring and order your
            favorite items.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.history.back()}
              className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600
            text-gray-700 dark:text-gray-200 font-medium
            hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              ← Go Back
            </button>

            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 rounded-lg font-semibold text-white
            bg-linear-to-r from-orange-500 to-orange-600
            hover:from-orange-600 hover:to-orange-700
            shadow-md transition"
            >
              Browse Shops
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 px-4 md:px-10 py-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-10">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-orange-600 transition"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          My Orders
        </h2>

        <div />
      </div>

      <div className="space-y-8 max-w-6xl mx-auto">
        {orders.map((order, orderIndex) => {
          const deliveryFee = order.totalAmount >= 400 ? 0 : 60;
          const grandTotal = order.totalAmount;

          return (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: orderIndex * 0.08 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700"
            >
              {/* Order Meta */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Order ID:{" "}
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                      #{order._id.slice(-6)}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock size={14} />
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full w-fit
                  ${
                    order.paymentStatus === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>

              {/* Address */}
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                📍 {order.deliveryAddress?.text}
              </p>

              {/* Shops */}
              {order.shopOrder?.map((shop) => (
                <div
                  key={shop._id}
                  className="mb-6 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
                >
                  {shop.shopOrderItem?.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 mb-3 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />

                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 dark:text-gray-100">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          ৳ {item.price} × {item.quantity}
                        </p>
                      </div>

                      <p className="font-bold text-gray-800 dark:text-gray-100">
                        ৳ {item.price * item.quantity}
                      </p>
                    </div>
                  ))}

                  <div className="flex justify-between mt-2 font-semibold text-sm">
                    <span>Shop Subtotal</span>
                    <span>৳ {shop.subTotal}</span>
                  </div>
                </div>
              ))}

              {/* Footer */}
              <div className="border-t pt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-sm">
                  <p>
                    Delivery:{" "}
                    <span className="text-orange-600 font-semibold">
                      {deliveryFee === 0 ? "Free" : `৳ ${deliveryFee}`}
                    </span>
                  </p>
                  <p>
                    Payment:{" "}
                    <span className="font-semibold uppercase">
                      {order.paymentMethod}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold text-orange-600">
                    Total: ৳ {grandTotal}
                  </span>

                  <button
                    onClick={() =>
                      (window.location.href = `/track-order/${order._id}`)
                    }
                    className="flex items-center gap-2 px-5 py-2 rounded-lg
                    bg-linear-to-r from-orange-500 to-orange-600
                    hover:from-orange-600 hover:to-orange-700
                    text-white text-sm font-semibold shadow-md transition"
                  >
                    <Truck size={16} /> Track Order
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
