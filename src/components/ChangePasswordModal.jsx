import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { toast } from "sonner";
import { Lock, X, Eye, EyeOff, Loader } from "lucide-react";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

const changePasswordSchema = yup.object({
  password: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .matches(
      passwordRegex,
      "Password must be 8+ characters and include uppercase, lowercase, a number and a special character",
    ),
});

export default function ChangePasswordModal({
  token,
  onClose,
  onPasswordChanged,
}) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
    isSubmitting,
    dirty,
    isValid,
    resetForm,
  } = useFormik({
    initialValues: {
      password: "",
      newPassword: "",
    },
    validationSchema: changePasswordSchema,
    onSubmit: async (values) => {
      const options = {
        method: "PATCH",
        url: "https://route-posts.routemisr.com/users/change-password",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: values,
      };

      try {
        const { data } = await axios.request(options);
        localStorage.setItem("token", data.data.token);
        onPasswordChanged(data.data.token);
        toast.success("Password changed successfully");
        resetForm();
        onClose();
      } catch (error) {
        console.log(error.response?.data || error);
        toast.error(
          error.response?.data?.message || "Failed to change password",
        );
      }
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-[#07110D] border border-white/10 w-full max-w-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-[#1DB854]/10 border border-[#1DB854]/20 flex items-center justify-center text-[#1DB854]">
              <Lock className="size-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Change Password</h3>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="size-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-medium text-gray-300 block">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter current password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-11 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#1DB854] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer p-1"
              >
                {showCurrentPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.password && touched.password ? (
              <p className="text-red-500 text-xs mt-1">* {errors.password}</p>
            ) : (
              ""
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-medium text-gray-300 block">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={values.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter new password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-11 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#1DB854] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer p-1"
              >
                {showNewPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.newPassword && touched.newPassword ? (
              <p className="text-red-500 text-xs mt-1">
                * {errors.newPassword}
              </p>
            ) : (
              ""
            )}
          </div>

          <button
            type="submit"
            disabled={!(dirty && isValid) || isSubmitting}
            className="w-full mt-2 bg-[#1DB854] hover:bg-[#1ed760] text-[#0A1F18] font-semibold py-2.5 rounded-xl text-sm shadow-md shadow-[#1DB854]/20 transition-all duration-200 cursor-pointer disabled:bg-[#1DB854]/50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader className="size-5 block m-auto animate-spin" />
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
