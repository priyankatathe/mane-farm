import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/authSlice";
import { useLoginAdminMutation } from "../redux/authApi/authApi";
import { useVerifyAndResetMutation, useVerifyEmailMutation } from "../redux/authApi/contactApi";
import { useForm } from "react-hook-form";

const AdminLogin = () => {
  const [showForgot, setShowForgot] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(""); // ✅ Added email state

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginAdmin, { isLoading, error }] = useLoginAdminMutation();
  const [verifyEmail, { isLoading: isEmailLoading }] = useVerifyEmailMutation();
  const [verifyAndReset, { isLoading: isResetLoading }] = useVerifyAndResetMutation();

  /* ================= LOGIN FORM ================= */

  const onSubmit = async (data) => {
    try {
      const result = await loginAdmin({
        contact: data.contact,
        password: data.password,
      }).unwrap();

      dispatch(setToken(result.token));
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

/* ================= LOGIN FORM ================= */
const {
  register,
  handleSubmit,
  formState: { errors }
} = useForm();

/* ================= FORGOT PASSWORD ================= */
const {
  register: forgotRegister,
  getValues,
  trigger: forgotTrigger,
  formState: { errors: forgotErrors },
  reset
} = useForm();


  const handleSendOtp = async () => {
  const isValid = await forgotTrigger("email"); // ✅ CORRECT trigger

  if (!isValid) return;

  try {
    const emailValue = getValues("email");

    setEmail(emailValue);
    await verifyEmail({ email: emailValue }).unwrap();

    setStep(2);
  } catch (err) {
    console.error(err);
  }
};


  const handleResetPassword = async () => {
    try {
      const data = getValues();
      await verifyAndReset({
        email,
        otp: data.otp,
        newPassword: data.newPassword,
      }).unwrap();

      alert("Password reset successfully!");
      reset();
      setStep(1);
      setShowForgot(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0e2202]">
      {/* LEFT IMAGE */}
      <div className="hidden md:block w-full md:w-1/2">
        <img src="/farn.avif" alt="Buffelo" className="w-full h-full object-cover" />
      </div>

      {/* RIGHT LOGIN */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6">
        <div className="w-full max-w-lg text-white">
          <h1 className="text-5xl font-serif mb-2">Login</h1>
          <p className="text-xl text-gray-400 mb-10">Welcome back! Please login to your account.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* CONTACT */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-white mb-2">Contact No</label>
              <input
                type="tel"
                maxLength={10}
                {...register("contact", {
                  required: "Contact is required",
                  pattern: { value: /^[0-9]{10}$/, message: "Enter valid 10 digit number" },
                })}
                placeholder="Enter contact number"
                className="w-full bg-transparent border-b border-green-600 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
              />
              {errors.contact && <p className="text-red-400 text-sm">{errors.contact.message}</p>}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-white mb-2">Password</label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 4, message: "Minimum 6 characters required" },
                })}
                placeholder="Enter password"
                className="w-full bg-transparent border-b border-green-600 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
              />
              {errors.password && <p className="text-red-400 text-sm">{errors.password.message}</p>}
            </div>

            <div className="text-right mt-2">
              <button
                type="button"
                onClick={() => { setShowForgot(true); setStep(1); }}
                className="text-sm text-green-400 hover:text-green-300 underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-gradient-to-r from-[#2D461D] to-[#A9FF67] text-black font-semibold py-3 rounded-full transition hover:opacity-90 disabled:opacity-60"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            {error && <p className="text-red-400 text-center text-sm mt-4">{error?.data?.message || "Invalid credentials"}</p>}
          </form>

          {/* FORGOT PASSWORD MODAL */}
          {showForgot && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
              <div className="bg-[#0e2202] w-full max-w-md rounded-2xl p-6 text-white relative">

                {/* CLOSE */}
                <button onClick={() => setShowForgot(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">✕</button>
                <h2 className="text-3xl font-serif mb-6 text-center">Forgot Password</h2>

                {/* STEP 1 */}
                {step === 1 && (
                  <>
                    <label className="block text-xs uppercase tracking-widest mb-2">Email Address</label>
                    <input
                      type="email"
                      {...forgotRegister("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Enter valid email",
                        },
                      })}
                      placeholder="Enter your email"
                      className="w-full bg-transparent border-b border-green-600 py-2 mb-2 text-white placeholder-gray-500 focus:outline-none"
                    />

                    {forgotErrors.email && (
                      <p className="text-red-400 text-sm">
                        {forgotErrors.email.message}
                      </p>
                    )}


                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isEmailLoading}
                      className="w-full bg-gradient-to-r from-[#2D461D] to-[#A9FF67] text-black font-semibold py-3 rounded-full transition hover:opacity-90"
                    >
                      {isEmailLoading ? "Sending OTP..." : "Send OTP"}
                    </button>
                  </>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <>
                    <label className="block text-xs uppercase tracking-widest mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full bg-transparent border-b border-green-600 py-2 mb-6 text-white placeholder-gray-500 focus:outline-none"
                    />

                    <label className="block text-xs uppercase tracking-widest mb-2">OTP</label>
                    <input
                      type="text"
                      {...forgotRegister("otp", { required: "OTP is required", minLength: { value: 4, message: "Invalid OTP" } })}
                      placeholder="Enter OTP"
                      className="w-full bg-transparent border-b border-green-600 py-2 mb-6 text-white placeholder-gray-500 focus:outline-none"
                    />
                    {forgotErrors.otp && <p className="text-red-400 text-sm">{forgotErrors.otp.message}</p>}

                    <label className="block text-xs uppercase tracking-widest mb-2">New Password</label>
                    <input
                      type="password"
                      {...forgotRegister("newPassword", { required: "Password required", minLength: { value: 6, message: "Min 6 characters required" } })}
                      placeholder="Enter new password"
                      className="w-full bg-transparent border-b border-green-600 py-2 mb-8 text-white placeholder-gray-500 focus:outline-none"
                    />
                    {forgotErrors.newPassword && <p className="text-red-400 text-sm">{forgotErrors.newPassword.message}</p>}

                    <button
                      type="button"
                      onClick={handleResetPassword}
                      disabled={isResetLoading}
                      className="w-full bg-gradient-to-r from-[#2D461D] to-[#A9FF67] text-black font-semibold py-3 rounded-full transition hover:opacity-90"
                    >
                      {isResetLoading ? "Resetting..." : "Reset Password"}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;













