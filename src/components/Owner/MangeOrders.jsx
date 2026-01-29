// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Loader,
  MapPin,
  Store,
  User,
  CreditCard,
  PackageCheck,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import useGetMyOrders from "../../hooks/useGetMyOrders";
import { useNavigate } from "react-router";
import { serverURL } from "../../App";
import axios from "axios";
import { updateOrderStatus } from "../../redux/userSlice";
import { useState } from "react";

const ManageOrders = () => {
  const [availableBoys, setAvailableBoys] = useState([]);
  useGetMyOrders();
  const navigate = useNavigate();
  const { myOrders, myOrdersLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleStatusChange = async (orderId, shopId, newStatus) => {
    try {
      const { data } = await axios.put(
        `${serverURL}/api/orders/update-status/${orderId}`,
        { status: newStatus, shopId },
        { withCredentials: true },
      );
      dispatch(updateOrderStatus({ orderId, shopId, status: newStatus }));
      setAvailableBoys(data?.availableBoys);
      // console.log(data);
      //   window.location.reload();
    } catch (err) {
      console.error("Status update error", err);
    }
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    preparing: "bg-blue-100 text-blue-700 border-blue-200",
    "out of delivery": "bg-purple-100 text-purple-700 border-purple-200",
    delivered: "bg-green-100 text-green-700 border-green-200",
  };

  if (myOrdersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size={48} className="animate-spin text-orange-500" />
      </div>
    );
  }

  if (!myOrders?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">No Orders Yet</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 px-4 md:px-10 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-orange-600 transition mb-6"
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      {/* Title */}
      <div className="max-w-6xl mx-auto mb-10">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Manage Orders
        </h2>
        <p className="text-sm text-gray-500">
          All customer orders for your shop
        </p>
      </div>

      <div className="space-y-8 max-w-6xl mx-auto">
        {myOrders?.map((order, index) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-3xl shadow-sm overflow-hidden"
          >
            {/* ===== ORDER HEADER ===== */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-5 border-b border-orange-500/80 border-dotted bg-gray-50 dark:bg-gray-900">
              <div>
                <p className="text-xs text-gray-500">ORDER ID</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100">
                  #{order._id.slice(-6)}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <Clock size={13} />{" "}
                  {new Date(order.createdAt).toLocaleString("en-BD", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    hour12: true,
                  })}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                  <CreditCard size={14} /> {order.paymentStatus || "PENDING"}
                </span>
              </div>
            </div>

            {/* ===== CUSTOMER INFO ===== */}
            <div className="px-6 py-5 border-b border-gray-400/10">
              <div className="grid md:grid-cols-2 gap-5">
                {/* Customer Card */}
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl ">
                  <div className="bg-orange-100 text-orange-600 p-2 rounded-xl">
                    <User size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Customer</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">
                      {order.user?.fullName || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.user?.mobile || "No phone"}
                    </p>
                  </div>
                </div>

                {/* Address Card */}
                <div className="flex items-start gap-4 bg-gray-50 dark:bg-gray-900 p-4 ">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
                    <MapPin size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Delivery Address
                    </p>
                    {order.deliveryAddress?.text ? (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          order.deliveryAddress.text,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 leading-relaxed hover:underline wrap-break-word"
                      >
                        {order.deliveryAddress.text}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {order.deliveryAddress?.text || "Address not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ===== SHOP ORDERS ===== */}
            {order?.shopOrder?.map((shop, idx) => (
              <div key={idx} className="px-6 py-5">
                <div className="flex items-center gap-2 text-orange-600 font-semibold mb-3">
                  <Store size={16} />
                  {shop?.shop?.name}
                </div>

                <div className=" ">
                  {shop?.shopOrderItem?.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center px-4 py-3 text-sm"
                    >
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          {item?.item?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          ৳ {item?.price} × {item?.quantity}
                        </p>
                      </div>
                      {/* Product Image */}
                      <img
                        src={item?.item?.image}
                        alt={item?.item?.name}
                        className="w-12 h-12 object-cover rounded-lg border"
                      />
                      <p className="font-semibold text-gray-800 dark:text-gray-100">
                        ৳ {item?.price * item?.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                {/* ===== FOOTER ===== */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">
                  <p className="text-sm font-semibold flex items-center gap-2">
                    <PackageCheck size={16} /> Subtotal: ৳ {shop.subTotal}
                  </p>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-full border font-semibold capitalize ${statusColors[shop?.status]}`}
                    >
                      {shop?.status}
                    </span>

                    <select
                      value={shop?.status}
                      disabled={shop?.status === "delivered"}
                      onChange={(e) =>
                        handleStatusChange(
                          order._id,
                          shop.shop._id,
                          e.target.value,
                        )
                      }
                      className="border rounded-lg px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700"
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="out of delivery">Out for Delivery</option>
                    </select>
                  </div>
                </div>
                {shop.status === "out of delivery" &&
                availableBoys?.length > 0 ? (
                  <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-4 space-y-3">
                    <h3 className="text-sm font-bold text-orange-600">
                      🚚 Available Delivery Partners
                    </h3>

                    {availableBoys.map((boy) => (
                      <div
                        key={boy.id}
                        className="flex items-center justify-between bg-white shadow-sm rounded-lg p-3 border hover:shadow-md transition"
                      >
                        {/* Left Info */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600">
                            {boy.fullName?.charAt(0)}
                          </div>

                          <div>
                            <p className="font-semibold text-gray-800">
                              {boy.fullName}
                            </p>
                            <p className="text-xs text-gray-500">
                              📞 {boy.mobile}
                            </p>
                            <p className="text-xs text-gray-400">
                              📍 {boy.latitude}, {boy.longitude}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-green-600">🟢 Nearby Rider</p>
                )}
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ManageOrders;
