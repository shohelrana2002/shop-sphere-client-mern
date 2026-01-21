import React, { useEffect, useState } from "react";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { serverURL } from "../../App";
import { Loader } from "lucide-react";

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
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, []);

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
      <div className="min-h-screen max-w-5xl flex items-center justify-center">
        <p className="text-lg text-gray-500 dark:text-gray-300">
          You have no orders yet.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 px-4 md:px-10 py-8">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-gray-100">
        My Orders
      </h2>

      <div className="space-y-8 max-w-6xl mx-auto">
        {orders.map((order, orderIndex) => {
          const deliveryFee = order.totalAmount >= 400 ? 0 : 60;
          const grandTotal = order.totalAmount + deliveryFee;

          return (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: orderIndex * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              {/* Header */}
              <div className="flex flex-wrap justify-between items-center gap-4 border-b pb-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">
                    {order._id}
                  </p>
                </div>

                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold
                  ${
                    order.paymentStatus === "PAID"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>

              {/* Address */}
              <div className="mb-6">
                <p className="font-medium text-gray-700 dark:text-gray-200">
                  Delivery Address
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.deliveryAddress?.text}
                </p>
              </div>

              {/* Shops */}
              <div className="space-y-6">
                {order.shopOrder.map((shop, shopIndex) => (
                  <div
                    key={shop._id}
                    className="border rounded-xl p-4 dark:border-gray-700"
                  >
                    <p className="font-semibold text-gray-800 dark:text-gray-100 mb-4">
                      Shop {shopIndex + 1}
                    </p>

                    {/* Items */}
                    <div className="space-y-3">
                      {shop.shopOrderItem.map((item) => (
                        <motion.div
                          key={item._id}
                          // whileHover={{ scale: 1.01 }}
                          className="flex gap-4 items-center bg-gray-50 dark:bg-gray-900 rounded-lg p-3"
                        >
                          {/* Image */}
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 object-cover rounded-lg border"
                          />

                          {/* Info */}
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 dark:text-gray-100">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              ৳ {item.price} × {item.quantity}
                            </p>
                          </div>

                          {/* Price */}
                          <p className="font-semibold text-gray-800 dark:text-gray-100">
                            ৳ {item.price * item.quantity}
                          </p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Subtotal */}
                    <div className="flex justify-between mt-4 font-semibold text-gray-800 dark:text-gray-100">
                      <span>Shop Subtotal</span>
                      <span>৳ {shop.subTotal}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-6 border-t pt-4 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="text-gray-700 dark:text-gray-300 font-medium">
                  Delivery Fee:{" "}
                  <span className="text-orange-600 dark:text-orange-400">
                    {deliveryFee === 0 ? "Free" : `৳ ${deliveryFee}`}
                  </span>
                </div>

                <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                  Total: ৳ {grandTotal}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => alert(`Tracking order ${order._id}`)}
                  className="px-6 py-2 rounded-lg text-white font-semibold
                  bg-linear-to-r from-blue-500 to-blue-600
                  hover:from-blue-600 hover:to-blue-700
                  shadow-md"
                >
                  Track Order
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
