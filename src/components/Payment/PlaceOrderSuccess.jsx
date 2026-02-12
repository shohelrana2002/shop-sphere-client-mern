/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Confetti from "react-confetti";
import { useNavigate } from "react-router";

const PlaceOrderSuccess = () => {
  const [countdown, setCountdown] = useState(50); // 50 seconds countdown
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown === 0) {
      navigate("/"); // redirect to home after countdown
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-green-50 to-green-100 relative overflow-hidden">
      {/* Confetti */}
      <Confetti numberOfPieces={300} recycle={false} gravity={0.2} />

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
        className="bg-white shadow-2xl rounded-3xl p-12 text-center flex flex-col items-center gap-6 z-10 relative"
      >
        {/* Animated Check Icon with glow */}
        <motion.div
          initial={{ rotate: -180 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <CheckCircle className="text-green-500 w-24 h-24 drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-3xl md:text-4xl font-extrabold text-green-600 drop-shadow-md"
        >
          🎉 Your Order is Successful!
        </motion.h1>

        {/* Payment Method */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-gray-700 text-lg"
        >
          Payment Method:{" "}
          <span className="font-semibold text-orange-500">
            Cash On Delivery (COD)
          </span>
        </motion.p>

        {/* Delivery Time */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-gray-700 text-lg"
        >
          Estimated Delivery:{" "}
          <span className="font-semibold text-orange-500">25 minutes</span>
        </motion.p>

        {/* Countdown */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="text-gray-500 text-sm"
        >
          Redirecting to home in <span className="font-mono">{countdown}</span>{" "}
          seconds...
        </motion.p>

        {/* Home Button */}
        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 0px 15px rgba(34,197,94,0.5)",
          }}
          whileTap={{ scale: 0.95 }}
          className="bg-green-500 cursor-pointer text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:bg-green-600 transition-all duration-300"
          onClick={() => navigate("/")}
        >
          Go to Home
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PlaceOrderSuccess;
