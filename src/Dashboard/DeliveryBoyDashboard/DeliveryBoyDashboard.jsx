import { Truck, MapPin, Loader } from "lucide-react";
import { useSelector } from "react-redux";
import DeliveryNav from "../../shared/DeliveryNav";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import axios from "axios";
import { serverURL } from "../../App";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DeliveryBoyTracking from "../../components/DeliveryBoy/DeliveryBoyTracking";

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

const AssignmentCard = ({ data, acceptOrder, rejectOrder }) => {
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

        <span className="bg-linear-to-r from-orange-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow">
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
        <button
          onClick={() => acceptOrder(data.assignmentId)}
          className="flex-1 cursor-pointer bg-linear-to-r from-green-500 to-emerald-600 hover:scale-105 active:scale-95 transition text-white py-2.5 rounded-xl font-semibold shadow-md"
        >
          Accept
        </button>
        <button
          onClick={() => rejectOrder(data.assignmentId)}
          className="flex-1 cursor-pointer bg-gray-200 dark:bg-gray-600 hover:bg-red-500 hover:text-white transition py-2.5 rounded-xl font-semibold"
        >
          Reject
        </button>
      </div>
    </motion.div>
  );
};
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
const DeliveryBoyDashboard = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const { userData } = useSelector((state) => state.user);
  const [availableAssignments, setAvailableAssignments] = useState([]);
  const [currentOrderLoading, setCurrenOrderLoading] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [otp, setOtp] = useState("");
  /*======== Fetch Assignment====== */
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
  /*========= Accept Order ======== */
  const acceptOrder = async (assignmentId) => {
    try {
      const { data } = await axios.get(
        `${serverURL}/api/orders/accept-order/${assignmentId}`,
        { withCredentials: true },
      );
      toast.success(data.message);
      getCurrentOrder();
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong";
      // console.log("Backend Error:", msg);
      toast.error(msg);
    }
  };
  /*============== Reject Order ==========*/
  const rejectOrder = async (assignmentId) => {
    await axios.post(
      `${serverURL}/api/orders/reject/${assignmentId}`,
      {},
      { withCredentials: true },
    );
    setAvailableAssignments((prev) =>
      prev.filter((a) => a.assignmentId !== assignmentId),
    );
  };
  /* ========== Get Current Order ======== */
  const getCurrentOrder = async () => {
    setCurrenOrderLoading(true);
    try {
      const { data } = await axios.get(
        `${serverURL}/api/orders/get-current-order`,
        { withCredentials: true },
      );
      setCurrentOrder(data);
      setCurrenOrderLoading(false);
    } catch (error) {
      console.log(error);
      setCurrenOrderLoading(false);
    }
  };
  /*======= Send Delivery OTP ========== */
  const sendDeliveryOtp = async (orderId, shopOrderId) => {
    setShow(true);
    try {
      const { data } = await axios.post(
        `${serverURL}/api/orders/send-delivery-otp`,
        { orderId, shopOrderId },
        { withCredentials: true },
      );

      toast.success(data.message);
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong";
      toast.error(msg);
    }
  };
  /*======= Send Delivery OTP ========== */
  const verifyOtp = async (orderId, shopOrderId) => {
    setShow(true);
    try {
      const { data } = await axios.post(
        `${serverURL}/api/orders/verify-delivery-otp`,
        { orderId, shopOrderId, otp },
        { withCredentials: true },
      );

      toast.success(data.message);
      window.location.reload();
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong";
      toast.error(msg);
    }
  };

  useEffect(() => {
    getCurrentOrder();
    if (userData) {
      fetchAssignments();
    }
  }, [userData]);

  if (currentOrderLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600"></div>
          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
            Fetching order details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen -mt-36 w-full bg-linear-to-br from-slate-100 to-slate-200 dark:from-gray-900 dark:to-gray-800">
      <DeliveryNav />

      {!currentOrder && (
        <div className="max-w-7xl mx-auto px-6  pt-24 pb-10">
          {/* Header */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg shadow-xl rounded-3xl p-6 flex justify-between items-center border">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Truck className="text-orange-500" size={30} />
                Delivery Dashboard
              </h1>
              <p className="text-gray-500">
                Active requests waiting for you 🚚
              </p>
            </div>

            <button
              onClick={fetchAssignments}
              className="bg-orange-500 cursor-pointer hover:bg-orange-600 text-white px-5 py-2 rounded-xl font-semibold shadow"
            >
              Refresh
            </button>
          </div>

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
            ) : availableAssignments?.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow border">
                <p className="text-gray-500">No delivery requests right now</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableAssignments?.map((assign) => (
                  <AssignmentCard
                    key={assign.assignmentId}
                    acceptOrder={acceptOrder}
                    rejectOrder={rejectOrder}
                    data={assign}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {currentOrder && (
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-white  rounded-2xl shadow-lg border dark:border-gray-700 overflow-hidden text-sm">
            {/* Shop Header */}
            <div className="flex items-center gap-3 p-3 bg-orange-300 text-black">
              <img
                src={currentOrder?.shop?.image}
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div className="leading-tight">
                <p className="font-semibold">{currentOrder?.shop?.name}</p>
                <p className="text-xs opacity-80 truncate">
                  {currentOrder?.shop?.address}
                </p>
              </div>
            </div>

            <div className="p-3 space-y-3">
              {/* Customer */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{currentOrder?.user?.fullName}</p>
                  <p className="text-xs text-gray-500">
                    {currentOrder?.user?.mobile}
                  </p>
                </div>
                <a
                  href={`tel:${currentOrder?.user?.mobile}`}
                  className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
                >
                  Call
                </a>
              </div>

              {/* Address */}
              <p className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded-lg truncate">
                📍 {currentOrder?.deliveryAddress?.text}
              </p>

              {/* Items */}
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {currentOrder?.shopOrder?.shopOrderItem?.map((item) => (
                  <div
                    key={item?._id}
                    className="flex justify-between items-center"
                  >
                    <p className="truncate">
                      {item?.name} × {item?.quantity}
                    </p>
                    <span className="font-semibold text-orange-600">
                      ৳ {item?.price * item?.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              {(() => {
                const subtotal = currentOrder?.shopOrder?.shopOrderItem?.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0,
                );

                const deliveryFee = subtotal < 400 ? 40 : 0;
                const total = subtotal + deliveryFee;

                return (
                  <div className="pt-2 border-t mt-2 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>৳ {subtotal}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span
                        className={
                          deliveryFee === 0
                            ? "text-green-600 font-semibold"
                            : ""
                        }
                      >
                        {deliveryFee === 0 ? "FREE" : `৳ ${deliveryFee}`}
                      </span>
                    </div>

                    <div className="flex justify-between font-bold text-gray-800 dark:text-white text-base">
                      <span>Total</span>
                      <span className="text-orange-600">৳ {total}</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
          {/* DeliveryBoy Tracking */}
          <DeliveryBoyTracking data={currentOrder} />
          {/* button or delivery otp send */}
          {!show ? (
            <button
              onClick={() =>
                sendDeliveryOtp(currentOrder._id, currentOrder.shopOrder._id)
              }
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold shadow transition active:scale-95"
            >
              ✅ Mark as Delivered
            </button>
          ) : (
            <div className="mt-4 p-4 rounded-2xl bg-white dark:bg-gray-900 border shadow space-y-4">
              <div className="text-center">
                <p className="font-semibold text-gray-800 dark:text-white">
                  Delivery Verification
                </p>
                <p className="text-xs text-gray-500">
                  Send OTP to customer to confirm delivery
                </p>
              </div>

              {/* OTP Input */}
              <div>
                <label className="text-xs text-gray-500">Delivery Code</label>
                <input
                  type="text"
                  name="code"
                  maxLength={6}
                  defaultValue={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6 digit OTP"
                  className="w-full mt-1 px-4 py-2 rounded-xl border focus:ring-2 focus:ring-green-500 outline-none text-center tracking-widest font-semibold"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    verifyOtp(currentOrder._id, currentOrder.shopOrder._id)
                  }
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-semibold shadow"
                >
                  ✔ Verify
                </button>
              </div>

              {/* Cancel */}
              <button
                onClick={() => setShow(false)}
                className="w-full text-xs text-gray-500 hover:text-red-500"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryBoyDashboard;
