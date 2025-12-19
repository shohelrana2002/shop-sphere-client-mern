import React, { useState } from "react";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { serverURL } from "../../App";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  /* STEP 1 → Send OTP */
  const handleSendOtp = async () => {
    if (!email) {
      return setError("Email is required");
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${serverURL}/api/auth/otp-send`,
        { email },
        { withCredentials: true }
      );
      toast.success(res?.data?.message || "OTP sent to your email");
      setError("");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* STEP 2 → Verify OTP */
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      return setError("OTP must be 6 digits");
    }

    try {
      setLoading(true);
      await axios.post(
        `${serverURL}/api/auth/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );
      setError("");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  /* STEP 3 → Reset Password */
  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      return setError("Password must be at least 6 characters");
    }
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);
      await axios.post(
        `${serverURL}/api/auth/reset-password`,
        { email, newPassword },
        { withCredentials: true }
      );
      toast.success("Password reset successful");
      navigate("/signIn");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <BsArrowLeftCircleFill
            size={24}
            className="cursor-pointer hover:text-orange-800"
            onClick={() => navigate("/signIn")}
          />
          <h4 className="text-2xl font-bold">Forgot Password</h4>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-3">{error}</p>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />
            <Button
              loading={loading}
              text="Send OTP"
              loadingText="Sending OTP..."
              onClick={handleSendOtp}
            />
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="6 digit OTP"
              value={otp}
              maxLength={6}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, ""));
                setError("");
              }}
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />
            <Button
              loading={loading}
              text="Verify OTP"
              loadingText="Verifying OTP..."
              onClick={handleVerifyOtp}
            />
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <div className="relative mb-4">
              <input
                type={show ? "text" : "password"}
                placeholder="New password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError("");
                }}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <span
                onClick={() => setShow(!show)}
                className="absolute right-3 top-2.5 cursor-pointer"
              >
                {show ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>

            <input
              type={show ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />

            <Button
              loading={loading}
              text="Reset Password"
              loadingText="Resetting..."
              onClick={handleResetPassword}
            />
          </>
        )}
      </div>
    </div>
  );
};

/* Reusable Button */
const Button = ({ loading, onClick, text, loadingText }) => (
  <button
    disabled={loading}
    onClick={onClick}
    className={`w-full py-2 rounded-lg font-semibold transition ${
      loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-black text-white hover:brightness-110"
    }`}
  >
    {loading ? loadingText : text}
  </button>
);

export default ForgotPassword;
