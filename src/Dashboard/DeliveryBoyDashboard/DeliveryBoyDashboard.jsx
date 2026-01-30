import { Truck, PackageCheck, Wallet, MapPin } from "lucide-react";
import { useSelector } from "react-redux";
import DeliveryNav from "../../shared/DeliveryNav";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import axios from "axios";
import { serverURL } from "../../App";
import { useEffect, useState } from "react";

const StatCard = ({ icon, title, value, color }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-lg shadow-md rounded-2xl p-5 flex items-center gap-4 border"
  >
    <div className={`p-3 rounded-xl ${color} text-white shadow`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-300">{title}</p>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">
        {value}
      </h2>
    </div>
  </motion.div>
);

const AssignmentCard = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      className="group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl rounded-3xl p-5 flex flex-col gap-4 transition"
    >
      {/* Top */}
      <div className="flex justify-between items-start">
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-lg shadow">
            🏪
          </div>
          <div>
            <h2 className="font-bold text-gray-800 dark:text-white text-lg">
              {data.shopName}
            </h2>
            <p className="text-xs text-gray-500">
              Order ID: {data.orderId.slice(-6)}
            </p>
          </div>
        </div>

        <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow">
          ৳ {data.subTotal}
        </span>
      </div>

      {/* Address */}
      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-xl text-sm text-gray-600 dark:text-gray-300 flex gap-2 items-center">
        <MapPin size={16} className="text-red-500" />
        {data.deliveryAddress?.text}
      </div>

      {/* Items */}
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
        <span>🛒 {data.items?.length} Items</span>
        <span className="bg-green-100 text-green-600 px-2 py-1 rounded-lg text-xs font-medium">
          New Request
        </span>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-2">
        <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 active:scale-95 transition text-white py-2.5 rounded-xl font-semibold shadow-md">
          Accept
        </button>
        <button className="flex-1 bg-gray-200 dark:bg-gray-600 hover:bg-red-500 hover:text-white transition py-2.5 rounded-xl font-semibold">
          Reject
        </button>
      </div>
    </motion.div>
  );
};

const DeliveryBoyDashboard = () => {
  const { userData } = useSelector((state) => state.user);

  const [availableAssignments, setAvailableAssignments] = useState([]);

  const [loading, setLoading] = useState(true);
  const SkeletonCard = () => (
    <div className="animate-pulse bg-white dark:bg-gray-800 p-5 rounded-2xl shadow flex flex-col gap-4">
      <div className="h-5 w-1/2 bg-gray-300 rounded"></div>
      <div className="h-4 w-full bg-gray-200 rounded"></div>
      <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
      <div className="flex gap-3 mt-2">
        <div className="h-10 w-full bg-gray-300 rounded"></div>
        <div className="h-10 w-full bg-gray-300 rounded"></div>
      </div>
    </div>
  );

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${serverURL}/api/orders/get-assignments`,
        { withCredentials: true },
      );
      setAvailableAssignments(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchAssignments();
      setLoading(false);
    }
  }, [userData]);

  return (
    <div className="min-h-screen -mt-36 w-full bg-linear-to-br from-slate-100 to-slate-200 dark:from-gray-900 dark:to-gray-800">
      <DeliveryNav />

      <div className="max-w-7xl mx-auto px-6  pt-24 pb-10">
        {/* Header */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg shadow-xl rounded-3xl p-6 flex justify-between items-center border">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Truck className="text-orange-500" size={30} />
              Delivery Dashboard
            </h1>
            <p className="text-gray-500">Active requests waiting for you 🚚</p>
          </div>

          <button
            onClick={fetchAssignments}
            className="bg-orange-500 cursor-pointer hover:bg-orange-600 text-white px-5 py-2 rounded-xl font-semibold shadow"
          >
            Refresh
          </button>
        </div>

        {/* Stats */}
        {/* <div className="grid md:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={<PackageCheck size={22} />}
            title="Today Deliveries"
            value={stats.todayDeliveries}
            color="bg-blue-500"
          />
          <StatCard
            icon={<Truck size={22} />}
            title="Total Deliveries"
            value={stats.totalDeliveries}
            color="bg-green-500"
          />
          <StatCard
            icon={<Wallet size={22} />}
            title="Earnings"
            value={`৳ ${stats.earnings}`}
            color="bg-purple-500"
          />
        </div> */}

        {/* Assignments */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
            🚚 New Delivery Requests
          </h2>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : availableAssignments.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow border">
              <p className="text-gray-500">No delivery requests right now</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableAssignments.map((assign) => (
                <AssignmentCard key={assign.assignmentId} data={assign} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryBoyDashboard;
