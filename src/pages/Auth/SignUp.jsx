/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FaGoogle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";
import { serverURL } from "../../App";
import { auth } from "../../Firebase/firebase.config";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(""); // new state for role
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState("");
  const roles = ["user", "owner", "deliveryBoy"];
  const [error, setError] = useState("");
  const provider = new GoogleAuthProvider();
  const dispatch = useDispatch();
  const handleRegister = async (e) => {
    e.preventDefault();
    // Handle registration logic here
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;

    const password = form.password.value;
    const data = {
      fullName: name,
      email,
      mobile,
      password,
      role: selectedRole,
    };

    try {
      setLoading(true);
      const res = await axios.post(`${serverURL}/api/auth/signup`, data, {
        withCredentials: true,
      });
      if (res.data?.user) {
        dispatch(setUser(res.data));
        setLoading(false);
        setError("");
        toast.success("Registered Successfully! Please Sign In.");
        window.location.reload();
        // form.reset();
      }
    } catch (error) {
      setLoading(false);
      const errMsg = error.response?.data?.message || error.message;
      setError(errMsg);
    }
  };
  const handleSocialLogin = async () => {
    if (!mobile) {
      return toast.error("Please enter a mobile number first");
    }
    try {
      // Google popup
      const result = await signInWithPopup(auth, provider);
      // Backend API call
      const { data } = await axios.post(
        `${serverURL}/api/auth/google-auth`,
        {
          fullName: result.user.displayName,
          email: result.user.email,
          mobile,
        },
        { withCredentials: true },
      );
      dispatch(setUser(data));
      if (!data?.success) {
        toast.error(data?.message || "This email is already in use");
        // 👉 navigate("/"); or dashboard
      }
    } catch (error) {
      const errMsg =
        error.response?.data?.message || error.message || "Google login failed";
      toast.error(errMsg);
      setError(errMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-7xl bg-card rounded-2xl shadow-xl flex overflow-hidden"
      >
        {/* Left Side Text */}
        <div className="hidden md:flex flex-col justify-center w-1/2 bg-light-bg p-10">
          <h2 className="text-4xl font-bold mb-4 text-dark">
            Welcome to ShopSphere
          </h2>
          <p className="text-dark text-lg mb-6">
            Create your account and explore a seamless e-commerce experience.
            Manage your orders, connect with customers, and grow your business.
          </p>
          <ul className="space-y-2 text-dark">
            <li>✔ Easy signup process</li>
            <li>✔ Secure password protection</li>
            <li>✔ Social login support</li>
            <li>✔ Role-based access (User / Owner / Delivery Boy)</li>
          </ul>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-dark">Create Account</h2>
            <p className="text-text-secondary text-sm mt-1">
              Register to get started
            </p>
          </div>

          {/* Social Login */}
          <div className="space-y-3 mb-5">
            <button
              onClick={handleSocialLogin}
              className="w-full flex hover:bg-black/10 cursor-pointer items-center justify-center gap-2 border py-2 rounded-lg transition "
            >
              <FaGoogle className="w-5 h-5" />
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2 my-4">
            <div className="flex-1 h-px bg-light-bg"></div>
            <span className="text-text-secondary text-sm">OR</span>
            <div className="flex-1 h-px bg-light-bg"></div>
          </div>
          {error && (
            <>
              <p className="text-red-600 text-center">{error}</p>
            </>
          )}
          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              name="name"
              required
              placeholder="Full Name"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-success focus:outline-none bg-bg text-dark"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="Email Address"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-success focus:outline-none bg-bg text-dark"
            />
            <input
              type="number"
              name="mobile"
              required
              defaultValue={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Mobile Number"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-success focus:outline-none bg-bg text-dark"
            />

            {/* Password */}
            <div className="relative">
              <input
                name="password"
                required
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-success focus:outline-none bg-bg text-dark"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 cursor-pointer text-text-secondary"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </span>
            </div>

            {/* Role Buttons */}
            <div className="grid gap-2 grid-cols-3">
              {roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`w-full px-4 py-2 rounded-full font-medium transition
                    ${
                      selectedRole === role
                        ? "bg-orange-500 text-bg shadow-md"
                        : "bg-bg text-dark border"
                    }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <span className="text-accent cursor-pointer hover:underline">
                Forgot password?
              </span>
            </div>

            {/* Register Button */}
            <motion.button
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full cursor-pointer py-2 bg-dark text-bg rounded-lg font-semibold hover:brightness-110 transition mt-2"
            >
              {loading ? (
                <CgSpinner className="animate-spin mx-auto text-light-bg" />
              ) : (
                "Signup"
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="text-center text-text-secondary mt-6">
            Already have an account?{" "}
            <Link
              to={"/signIn"}
              className="text-shadow-dark cursor-pointer hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
