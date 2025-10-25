import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { loginServices } from "../../../services/authServices"
import { AuthContext } from "../../../utils/authContext"

function Login() {

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();


  const onSubmit = async (data) => {
    const response = await loginServices(data);
    const user = response.user;
    const accessToken = response.accessToken;
    login(user, accessToken);
    navigate("/home")
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-linear-to-br from-gray-900 via-black to-gray-950 text-white">
      {/* Left Image Section */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-black/30">
        <img
          src="/images/login.jpg"
          alt="Login Illustration"
          className="w-3/4 rounded-2xl shadow-2xl object-cover"
        />
      </div>

      {/* Right Form Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-20 py-16">
        <h1 className="text-5xl font-extrabold mb-4 text-center md:text-left">
          Welcome Back to <span className="text-red-500">MePlay</span>
        </h1>
        <p className="text-gray-400 mb-8 text-center md:text-left">
          Login to continue watching and uploading your favorite videos.
        </p>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 w-full max-w-md mx-auto"
        >
          {/* Email Field */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-all duration-300 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-gray-400 mt-6 text-center md:text-left">
          Don’t have an account?{" "}
          <NavLink
            to="/register"
            className="text-red-500 hover:text-red-400 font-semibold"
          >
            Register now
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Login;
