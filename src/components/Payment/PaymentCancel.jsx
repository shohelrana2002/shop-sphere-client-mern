import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router";

const PaymentFail = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-50">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
        className="bg-white shadow-xl rounded-2xl p-12 text-center flex flex-col items-center gap-6"
      >
        <motion.div
          initial={{ x: -50, rotate: -10 }}
          animate={{ x: 0, rotate: 0 }}
          transition={{ duration: 0.8 }}
        >
          <AlertCircle className="text-yellow-500 w-20 h-20" />
        </motion.div>

        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-3xl font-bold text-yellow-600"
        >
          Payment Failed
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-gray-600"
        >
          Something went wrong with your transaction. Please try again.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-yellow-500 cursor-pointer text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-yellow-600"
          onClick={() => navigate("/")}
        >
          Go Back to Home
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PaymentFail;
