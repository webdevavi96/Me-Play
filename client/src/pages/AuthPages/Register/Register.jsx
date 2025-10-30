import React from "react";
import { useForm } from "react-hook-form";
import { FcImageFile } from "react-icons/fc";
import { NavLink, useNavigate } from "react-router-dom";
import { registerServices } from "../../../services/authServices";

function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    if (data.password !== data.re_password) {
      alert("Passwords do not match!");
      return;
    }

    // ✅ Convert to FormData for file upload
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("re_password", data.re_password);

    if (data.avatar && data.avatar[0]) {
      formData.append("avatar", data.avatar[0]);
    }

    if (data.coverImage && data.coverImage[0]) {
      formData.append("coverImage", data.coverImage[0]);
    }

    try {
      const res = await registerServices(formData); // ⚡ Make sure this supports multipart/form-data
      console.log(res);
      alert("Account created successfully!");
      reset();
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Registration failed!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-linear-to-br from-gray-900 via-black to-gray-950 text-white">
      {/* Left Image Section */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-black/30">
        <img
          src="/images/register.jpg"
          alt="Register Illustration"
          className="w-3/4 rounded-2xl shadow-2xl object-cover"
        />
      </div>

      {/* Right Form Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-20 py-16">
        <h1 className="text-5xl font-extrabold mb-4 text-center md:text-left">
          Join <span className="text-red-500">MePlay</span> Today
        </h1>
        <p className="text-gray-400 mb-8 text-center md:text-left">
          Create your account to start uploading and watching amazing videos.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 w-full max-w-md mx-auto"
          encType="multipart/form-data" // ✅ important for file upload
        >
          {/* Full Name */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              <span className="text-red-600">*</span>&nbsp;
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              {...register("fullName", { required: "Full name is required" })}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.fullName && (
              <p className="text-red-400 text-sm mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              <span className="text-red-600">*</span>&nbsp;
              Username
            </label>
            <input
              type="text"
              placeholder="Choose a username"
              {...register("username", { required: "Username is required" })}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.username && (
              <p className="text-red-400 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              <span className="text-red-600">*</span>&nbsp;
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

          {/* Avatar Upload */}
          <div>
            <label className="flex items-center gap-2 text-gray-300 mb-2 font-medium">
              <span className="text-red-600">*</span>&nbsp;
              <FcImageFile className="text-xl" /> Avatar
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("avatar", { required: "Avatar image is required" })}
              className="block w-full text-sm rounded-lg bg-gray-800 text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
            {errors.avatar && (
              <p className="text-red-400 text-sm mt-1">
                {errors.avatar.message}
              </p>
            )}
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="flex items-center gap-2 text-gray-300 mb-2 font-medium">
              <span className="text-red-600">*</span>&nbsp;
              <FcImageFile className="text-xl" /> Cover Image
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("coverImage", { required: "Cover image is required" })}
              className="block w-full text-sm rounded-lg bg-gray-800 text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
            {errors.coverImage && (
              <p className="text-red-400 text-sm mt-1">
                {errors.coverImage.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              <span className="text-red-600">*</span>&nbsp;
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              <span className="text-red-600">*</span>&nbsp;
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              {...register("re_password", {
                required: "Confirm password is required",
              })}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.re_password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.re_password.message}
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
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-gray-400 mt-6 text-center md:text-left">
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="text-red-500 hover:text-red-400 font-semibold"
          >
            Login here
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Register;
