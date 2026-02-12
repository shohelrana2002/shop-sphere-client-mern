import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../Firebase/firebase.config";
import toast from "react-hot-toast";

const provider = new GoogleAuthProvider();

const SocialLogin = () => {
  const [loading, setLoading] = useState(false);

  const handleSocialLogin = async () => {
    try {
      setLoading(true);

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Google User:", user);
      toast.success("Logged in with Google successfully!");
      // 👉 backend API call / navigate
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(error.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 mb-5">
      <button
        disabled={loading}
        onClick={handleSocialLogin}
        className={`w-full flex items-center justify-center gap-2 border py-2 rounded-lg transition
          ${
            loading
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "cursor-pointer text-dark hover:bg-green-200 hover:brightness-90"
          }
        `}
      >
        <FaGoogle className="w-5 h-5" />
        {loading ? "Signing in..." : "Continue with Google"}
      </button>
    </div>
  );
};

export default SocialLogin;
