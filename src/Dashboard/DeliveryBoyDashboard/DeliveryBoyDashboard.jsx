import { Truck } from "lucide-react";
import { useSelector } from "react-redux";
import DeliveryNav from "../../shared/DeliveryNav";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import axios from "axios";
import { serverURL } from "../../App";
import { useEffect } from "react";
const StatCard = ({ icon, title, value, color }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-white/70  dark:bg-gray-800/70 backdrop-blur-lg shadow-md rounded-2xl p-5 flex items-center gap-4 border border-white/20"
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

const DeliveryBoyDashboard = () => {
  const { userData } = useSelector((state) => state.user);
  const fetchAssignment = async () => {
    try {
      const { data } = await axios.get(
        `${serverURL}/api/orders/get-assignments`,
        { withCredentials: true },
      );
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAssignment();
  }, [userData]);
  return (
    <div className="min-h-screen w-full -mt-36 bg-linear-to-br from-slate-100 to-slate-200 dark:from-gray-900 dark:to-gray-800">
      <DeliveryNav />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Truck className="text-orange-500" size={28} />
              Delivery Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back,{" "}
              <span className="font-semibold">{userData?.fullName}</span> 👋
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white  shadow-lg rounded-2xl px-6 py-4 flex items-center gap-4 border">
            <div className="w-14 h-14 rounded-full bg-orange-500 text-white flex items-center justify-center text-lg font-bold">
              {userData?.fullName?.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-800 dark:text-white">
                {userData?.fullName}
              </p>
              <p className="text-sm text-gray-500">{userData?.mobile}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryBoyDashboard;
