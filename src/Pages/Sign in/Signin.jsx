import React, { useContext, useState } from "react";
import Typewriter from "typewriter-effect";
import mainBg from "../../assets/mainBg.jpg";
import logo from "../../assets/logo.png";
import { useFormik } from "formik";
import axios from "axios";
import * as yup from "yup";
import { Eye, EyeOff, Loader } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router";
import { userContext } from "../../context/UserContext";

export default function Signin() {
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const { token, setToken } = useContext(userContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  function customHandleChange(e) {
    handleChange(e);
    setInvalidCredentials(false);
  }

  const schema = yup.object({
    email: yup.string().required("email is required").email(),

    password: yup.string().required("password is required"),
  });

  const {
    values,
    handleChange,
    handleSubmit,
    handleBlur,
    errors,
    touched,
    isSubmitting,
    dirty,
    isValid,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    onSubmit: async (values) => {
      try {
        const options = {
          method: "POST",
          url: "https://route-posts.routemisr.com/users/signin",
          headers: {
            "Content-Type": "application/json",
          },
          data: values,
        };

        const { data } = await axios.request(options);

        toast.success("Signed in successfully!");
        localStorage.setItem("token", data.data.token);
        setToken(localStorage.getItem("token"));
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (error) {
        setInvalidCredentials(true);
      }
    },

    validationSchema: schema,
  });

  return (
    <section
      className="h-screen w-full bg-cover bg-center bg-no-repeat flex justify-center items-center relative overflow-hidden"
      style={{ backgroundImage: `url(${mainBg})` }}
    >
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 lg:w-[40%] w-full lg:rounded-3xl bg-[#07110D]/70 backdrop-blur-sm border-l border-white/5 px-6 sm:px-12 py-10 flex flex-col justify-center text-white my-auto max-lg:h-full">
        <div className="max-w-sm mx-auto w-full mb-6 text-center">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white min-h-[70px] flex items-center justify-center">
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .typeString(
                    `Welcome Back to <br/><span class="text-[#1DB854] uppercase">GROVE</span> <span class="inline-block align-middle"><img src=${logo} alt="logo" class="h-8 w-auto inline-block mb-1" /></span>`,
                  )
                  .start();
              }}
              options={{
                delay: 60,
                cursor: "",
              }}
            />
          </div>
          <p className="text-xs text-[#8A8F8D] mt-1 font-light">
            Please enter your details to continue
          </p>
        </div>

        <form
          className="space-y-3.5 max-w-sm mx-auto w-full"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={customHandleChange}
              onBlur={handleBlur}
              placeholder="Enter your email"
              className="w-full bg-[#112B22]/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#A3F5C3] placeholder-[#8A8F8D] focus:outline-none focus:border-[#1DB854] transition-colors"
            />
            {errors.email && touched.email ? (
              <p className="text-red-600 text-sm my-1">* {errors.email}</p>
            ) : (
              ""
            )}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={values.password}
                onChange={customHandleChange}
                onBlur={handleBlur}
                placeholder="Enter your password"
                className="w-full bg-[#112B22]/80 border border-white/10 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-[#A3F5C3] placeholder-[#8A8F8D] focus:outline-none focus:border-[#1DB854] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.password && touched.password ? (
              <p className="text-red-600 text-sm my-1">* {errors.password}</p>
            ) : (
              ""
            )}
          </div>

          {invalidCredentials ? (
            <p className="text-red-600 text-sm my-1">
              * incorrect email or password
            </p>
          ) : (
            ""
          )}

          <button
            type="submit"
            className="w-full mt-2 py-3 bg-[#1DB854] hover:bg-[#19a34a] text-[#0A1F18] font-semibold text-xs rounded-xl transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:bg-[#1DB854]/50 disabled:cursor-not-allowed"
            disabled={!(dirty && isValid) || isSubmitting}
          >
            {isSubmitting ? (
              <Loader className="size-5 block m-auto animate-spin" />
            ) : (
              "Sign in"
            )}
          </button>

          <div className="text-center text-xs text-[#8A8F8D] pt-2">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-[#1DB854] hover:underline"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
