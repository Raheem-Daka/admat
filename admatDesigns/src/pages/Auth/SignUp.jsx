import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const res = await fetch("http://127.0.0.1:8000/api/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        const message = data?.errors 
          ? Object.values(data.errors).flat().join(" ") 
          : data?.message || "Sign up failed";
        throw new Error(message);
      }
      return data;
    },
    onSuccess: () => {
      reset();
      navigate("/signin");
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="w-full max-w-md border border-slate-300 rounded-xl p-6"
      >
        <h2 className="text-2xl font-bold mb-4">Create Account</h2>

        {mutation.isError && (
          <p className="bg-red-500 text-white p-1 rounded text-sm mb-4">
            {mutation.error.message}
          </p>
        )}

        {/* Username */}
        <input
          placeholder="Username"
          className="w-full mb-3 p-2 rounded border border-slate-400"
          {...register("username", { required: "Username is required" })}
        />
        {errors.username && (
          <p className="bg-red-500 text-white p-1 rounded text-sm mb-2">{errors.username.message}</p>
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 rounded border border-slate-400"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
        />
        {errors.email && (
          <p className="bg-red-500 text-white p-1 rounded text-red-500 text-sm mb-2">{errors.email.message}</p>
        )}

        {/* Password */}
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-2 pr-10 rounded border border-slate-400"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="bg-red-500 text-white p-1 rounded text-red-500 text-sm mb-2">{errors.password.message}</p>
        )}

        {/* Confirm Password */}
        <div className="relative mb-4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full p-2 pr-10 rounded border border-slate-400"
            {...register("confirmPassword", {
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="bg-red-500 text-white p-1 rounded text-red-500 text-sm mb-2">
            {errors.confirmPassword.message}
          </p>
        )}

        <button
          disabled={mutation.isLoading}
          className="w-full py-2 rounded-xl bg-indigo-700 text-white hover:bg-indigo-700 transition font-medium"
        >
          {mutation.isLoading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignUp;