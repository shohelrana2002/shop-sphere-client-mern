/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Confetti from "react-confetti";
import { useParams, useNavigate } from "react-router";

const PaymentSuccess = () => {
  const [countdown, setCountdown] = useState(50); // 5 seconds countdown
  const navigate = useNavigate();
  const { tran_id } = useParams(); // get transaction ID from URL

  useEffect(() => {
    if (countdown === 0) {
      navigate("/"); // redirect to home after countdown
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 relative overflow-hidden">
      {/* Confetti */}
      <Confetti numberOfPieces={300} recycle={false} />

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
        className="bg-white shadow-xl rounded-2xl p-12 text-center flex flex-col items-center gap-6 z-10"
      >
        {/* Animated Check Icon */}
        <motion.div
          initial={{ rotate: -180 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.8 }}
        >
          <CheckCircle className="text-green-500 w-20 h-20" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-3xl font-bold text-green-600"
        >
          Payment Successful!
        </motion.h1>

        {/* Payment Details */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-gray-600"
        >
          Transaction ID:{" "}
          <span className="font-mono text-orange-500">{tran_id}</span>
        </motion.p>

        {/* Countdown Notice */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="text-gray-500"
        >
          Redirecting to home in {countdown} seconds...
        </motion.p>

        {/* Home Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-green-500 cursor-pointer text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-green-600"
          onClick={() => navigate("/")}
        >
          Go to Home
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
