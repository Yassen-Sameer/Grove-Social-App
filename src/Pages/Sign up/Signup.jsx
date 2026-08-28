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

export default function Signup() {
  const [usernameExist, setUsernameExist] = useState(false);
  const [emailExist, setEmailExist] = useState(false);
  const { setToken } = useContext(userContext);
  const [showRePassword, setShowRePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  function customHandleEmailChange(e) {
    setFieldValue("email", e.target.value);
    setEmailExist(false);
  }
  function customHandleUsernameChange(e) {
    setFieldValue("username", e.target.value);
    setUsernameExist(false);
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

  const schema = yup.object({
    name: yup
      .string()
      .required("name is required")
      .min(3, "name must be at least 3 characters")
      .max(25, "name must be maximum 25 characters"),

    username: yup
      .string()
      .required("username is required")
      .min(3, "username must be at least 3 characters")
      .max(25, "username must be maximum 25 characters").matches(/^[a-zA-Z0-9]+$/, "Not allowed use any special charcter(- , / , + ,...)"),

    email: yup.string().required("emai is required").email(),

    password: yup
      .string()
      .required("password is required")
      .matches(
        passwordRegex,
        "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character",
      ),

    rePassword: yup
      .string()
      .required("confirm password is required")
      .oneOf(
        [yup.ref("password")],
        "password and confirm password must be the same",
      ),

    dateOfBirth: yup.string().required("date of birth is required"),
  });

  const {
    values,
    handleChange,
    handleSubmit,
    handleBlur,
    errors,
    touched,
    setFieldValue,
    isSubmitting,
    dirty,
    isValid,
  } = useFormik({
    initialValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      rePassword: "",
      gender: "male",
      dateOfBirth: "",
    },

    onSubmit: async (values) => {
      try {
        const options = {
          method: "POST",
          url: "https://route-posts.routemisr.com/users/signup",
          headers: {
            "Content-Type": "application/json",
          },
          data: values,
        };

        const { data } = await axios.request(options);

        toast.success("Account created successfully!");
        localStorage.setItem("token", data.data.token);
        setToken(localStorage.getItem("token"));
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (error) {
        if (error.response.data.message === "user already exists.") {
          setEmailExist(true);
        }

        if (error.response.data.message === "username already exists.") {
          setUsernameExist(true);
        }
      }
    },

    validationSchema: schema,
  });

  return (
    <section
      className="min-h-screen w-full bg-cover bg-fixed bg-center bg-no-repeat flex justify-center items-center relative "
      style={{ backgroundImage: `url(${mainBg})` }}
    >
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 lg:w-[40%] overflow-y-auto w-full lg:rounded-3xl bg-[#07110D]/70 backdrop-blur-sm border-l border-white/5 px-6 sm:px-12 py-10 flex flex-col justify-center text-white my-auto max-lg:h-full">
        <div className="max-w-sm mx-auto w-full mb-6 text-center">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white min-h-[70px] flex items-center justify-center">
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .typeString(
                    `Welcome to <br/><span class="text-[#1DB854] uppercase">GROVE</span> <span class="inline-block align-middle"><img src=${logo} alt="logo" class="h-8 w-auto inline-block mb-1" /></span>`,
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
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="Enter your name"
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full bg-[#112B22]/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#A3F5C3] placeholder-[#8A8F8D] focus:outline-none focus:border-[#1DB854] transition-colors"
            />
            {errors.name && touched.name ? (
              <p className="text-red-600 text-sm my-1">* {errors.name}</p>
            ) : (
              ""
            )}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 text-gray-300">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={values.username}
              onChange={customHandleUsernameChange}
              onBlur={handleBlur}
              placeholder="Enter your username"
              className="w-full bg-[#112B22]/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#A3F5C3] placeholder-[#8A8F8D] focus:outline-none focus:border-[#1DB854] transition-colors"
            />
            {errors.username && touched.username ? (
              <p className="text-red-600 text-sm my-1">* {errors.username}</p>
            ) : (
              ""
            )}
            {usernameExist ? (
              <p className="text-red-600 text-sm my-1">
                * username already exist
              </p>
            ) : (
              ""
            )}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={customHandleEmailChange}
              onBlur={handleBlur}
              placeholder="Enter your email"
              className="w-full bg-[#112B22]/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#A3F5C3] placeholder-[#8A8F8D] focus:outline-none focus:border-[#1DB854] transition-colors"
            />
            {errors.email && touched.email ? (
              <p className="text-red-600 text-sm my-1">* {errors.email}</p>
            ) : (
              ""
            )}
            {emailExist ? (
              <p className="text-red-600 text-sm my-1">* email already exist</p>
            ) : (
              ""
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-300">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={values.dateOfBirth}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full bg-[#112B22]/80 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#A3F5C3] focus:outline-none focus:border-[#1DB854] transition-colors [color-scheme:dark]"
              />
              {errors.dateOfBirth && touched.dateOfBirth ? (
                <p className="text-red-600 text-sm my-1">
                  * {errors.dateOfBirth}
                </p>
              ) : (
                ""
              )}
            </div>

            <div>
              <label className="block text-xs font-medium mb-1 text-gray-300">
                Gender
              </label>
              <select
                name="gender"
                value={values.gender}
                onChange={handleChange}
                className="w-full bg-[#112B22]/80 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#A3F5C3] focus:outline-none focus:border-[#1DB854] transition-colors [&>option]:bg-[#112B22]"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
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
                onChange={handleChange}
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

          <div>
            <label className="block text-xs font-medium mb-1 text-gray-200">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showRePassword ? "text" : "password"}
                name="rePassword"
                value={values.rePassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Confirm your password"
                className="w-full bg-[#112B22]/80 border border-white/10 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-[#A3F5C3] placeholder-[#8A8F8D] focus:outline-none focus:border-[#1DB854] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowRePassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                {showRePassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.rePassword && touched.rePassword ? (
              <p className="text-red-600 text-sm my-1">* {errors.rePassword}</p>
            ) : (
              ""
            )}
          </div>

          <button
            type="submit"
            className="text-center w-full mt-2 py-3 bg-[#1DB854] hover:bg-[#19a34a] text-[#0A1F18] font-semibold 
            text-xs rounded-xl transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:bg-[#1DB854]/50 disabled:cursor-not-allowed"
            disabled={!(dirty && isValid) || isSubmitting}
          >
            {isSubmitting ? (
              <Loader className="size-5 block m-auto animate-spin" />
            ) : (
              "Sign Up"
            )}
          </button>

          <div className="text-center text-xs text-[#8A8F8D] pt-2">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-semibold text-[#1DB854] hover:underline"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
