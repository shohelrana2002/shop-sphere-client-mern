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

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    // Basic frontend validation
    if (!email || !password) {
      setError("Email and password are required");
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${serverURL}/api/auth/signin`,
        { email, password },
        { withCredentials: true },
      );

      if (res.status === 200) {
        dispatch(setUser(res.data));
        setLoading(false);
        toast.success("Login Successful");
        form.reset();
        // user data set na hor jon_o  reload
        window.location.reload();
      }
    } catch (err) {
      setLoading(false);
      let message = "Something went wrong. Please try again";

      if (err.response && err.response.data?.message) {
        message = err.response.data.message;
      } else if (err.request) {
        message = "Server not responding. Please try later";
      }

      setError(message);
      toast.error(message);
    }
  };
  const provider = new GoogleAuthProvider();
  const handleSocialLogin = async () => {
    try {
      // Google popup
      const result = await signInWithPopup(auth, provider);
      // Backend API call
      const { data } = await axios.post(
        `${serverURL}/api/auth/google-auth`,
        {
          email: result.user.email,
        },
        { withCredentials: true },
      );
      dispatch(setUser(data));
      toast.success("Login Successfully");
    } catch (error) {
      console.error("Google login error:", error);
      const errMsg =
        error.response?.data?.message || error.message || "Google login failed";
      toast.error(errMsg);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl bg-card rounded-2xl shadow-xl flex overflow-hidden"
      >
        {/* Left Side Info */}
        <div className="hidden md:flex flex-col justify-center w-1/2 bg-light-bg p-10">
          <h2 className="text-4xl font-bold mb-4 text-dark">Welcome Back 👋</h2>
          <p className="text-dark text-lg mb-6">
            Login to your account and continue managing your orders, customers,
            and business seamlessly.
          </p>
          <ul className="space-y-2 text-dark">
            <li>✔ Secure login system</li>
            <li>✔ Access your dashboard</li>
            <li>✔ Fast & reliable experience</li>
          </ul>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-dark">Login</h2>
            <p className="text-text-secondary text-sm mt-1">
              Enter your credentials to continue
            </p>
          </div>

          <div className="space-y-3 mb-5">
            <button
              onClick={handleSocialLogin}
              className={
                "w-full hover:cursor-pointer hover:bg-black/20 flex items-center justify-center gap-2 border py-2 rounded-lg transition"
              }
            >
              <FaGoogle className="w-5 h-5" />
              {loading ? "Signing in..." : "Continue with Google"}
            </button>
          </div>
          {/* Divider */}
          <div className="flex items-center gap-2 my-4">
            <div className="flex-1 h-px bg-light-bg"></div>
            <span className="text-text-secondary text-sm">OR</span>
            <div className="flex-1 h-px bg-light-bg"></div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm text-center mb-3">{error}</p>
          )}

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <input
              name="email"
              type="email"
              required
              placeholder="Email Address"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-success focus:outline-none bg-bg text-dark"
            />

            {/* Password */}
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
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

            {/* Forgot Password */}
            <Link to={"/forgot-password"} className="text-right ">
              <span className="text-black  cursor-pointer hover:underline">
                Forgot password?
              </span>
            </Link>

            {/* Login Button */}
            <motion.button
              disabled={loading}
              className="w-full py-2 cursor-pointer bg-dark mt-3 text-bg rounded-lg font-semibold disabled:opacity-60"
            >
              {loading ? (
                <CgSpinner className="animate-spin mx-auto text-light-bg" />
              ) : (
                "Login"
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="text-center text-text-secondary mt-6">
            Don&apos;t have an account?{" "}
            <Link
              to={"/signUp"}
              className="text-black cursor-pointer hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;
