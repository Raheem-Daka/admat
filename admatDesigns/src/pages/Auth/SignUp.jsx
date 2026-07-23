import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getPasswordStrength, generatePassword, getPasswordRules } from "../../utils/passwords";
import PasswordStrength from "../../components/PasswordStrength";
import { apiFetch } from "../../api/api";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const SignUp = () => {

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const strength = getPasswordStrength(password);
  const [suggested, setSuggested] = useState("");
  const rules = getPasswordRules(password);

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const data = await apiFetch(`/signup/`, {
        method: "POST",
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword,
        }),
      });

      return data;
    },
    onSuccess: () => {
      reset();
      navigate("/signin");
    },
  });

  return (
    <>
      
      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="flex w-full mx-auto flex-col items-center justify-center max-w-lg xl:max-w-100 lg:max-w-96"
      >
        <h2 className="text-4xl font-medium text-gray-900">Create Account</h2>

        {mutation.isError && (
          <p className="bg-red-500 text-white p-1 rounded text-sm mb-4">
            {mutation.error.message}
          </p>
        )}


        <div className="space-y-4 w-full">
          {/* Username */}
            <div className="flex h-12 w-full items-center gap-2 overflow-hidden rounded border border-orange-300 bg-transparent pl-5 focus-within:border-orange-600 focus-within:ring-1 focus-within:ring-orange-600">
              <FaUser className="text-orange-600 mr-2"/>            
            <input
              placeholder="Username"
              className="pl-2 h-full w-full bg-transparent text-sm placeholder-gray-400 outline-none"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <p className="bg-red-500 text-white p-1 rounded text-sm mb-2">{errors.username.message}</p>
            )}

          </div>


          {/* Email */}
            <div className="flex h-12 w-full items-center gap-2 overflow-hidden rounded border border-orange-300 bg-transparent pl-5 focus-within:border-orange-600 focus-within:ring-1 focus-within:ring-orange-600">
              <FaEnvelope className="text-orange-600 mr-2"/>
            <input
              type="email"
              placeholder="Email"
              className="pl-2 h-full w-full bg-transparent text-sm placeholder-gray-400 outline-none"
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
          </div>



          {/* Password */}
          
          <div className="relative">
             <div className="relative mt-4 flex h-12 w-full items-center gap-2 overflow-hidden rounded border border-orange-300 bg-transparent pl-5 focus-within:border-orange-600 focus-within:ring-1 focus-within:ring-orange-600">
                <FaLock className="text-orange-600 mr-2"/>
              
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="pl-2 h-full w-full bg-transparent text-sm placeholder-gray-400 outline-none"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />


            </div>
            <span
              role="button"
              aria-label="Toggle password visibility"
              tabIndex={0}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>


            <button
              type="button"
              onClick={() => setSuggested(generatePassword())}
              className="text-xs text-orange-600 mt-1 block hover:underline hover:text-orange-800"
            >
              Suggest password 🔐
            </button>

            {suggested && (
              <div className="mt-2 p-2 border rounded bg-gray-50 text-sm flex justify-between items-center">
                <span className="font-mono">{suggested}</span>

                <div className="flex gap-2">
                  {/* COPY BUTTON */}
                  <button
                    type="button"
                    onClick={() => {
                      setValue("password", suggested, { shouldValidate: true });
                      setValue("confirmPassword", suggested, { shouldValidate: true });          
                      setSuggested("");
                    }}
                    className="text-orange-600 hover:underline text-xs"
                  >
                    Use
                  </button>
                  {/* REGENERATE BUTTON */}
                  <button
                    type="button"
                    onClick={() => setSuggested(generatePassword())}
                    className="text-orange-600 hover:underline text-xs"
                  >
                    Regenerate
                  </button>
                  {/* COPY BUTTON */}
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(suggested)}
                    className="text-orange-600 hover:underline text-xs hover:underline"
                  >
                    Copy
                  </button>

                </div>
              </div>
            )}
          </div>

          {/* ✅ PASSWORD STRENGTH BAR */}
          <PasswordStrength
          password={password}
          strength={strength}
          rules={rules} 
          />

          {/* Confirm Password */}


          <div className="relative">
            <div className="relative mt-4 flex h-12 w-full items-center gap-2 overflow-hidden rounded border border-orange-300 bg-transparent pl-5 focus-within:border-orange-600 focus-within:ring-1 focus-within:ring-orange-600">
              <FaLock className="text-orange-600 mr-2"/>

              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="pl-2 h-full w-full bg-transparent text-sm placeholder-gray-400 outline-none"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />

            </div>
            <span
              role="button"
              aria-label="Toggle password visibility"
              tabIndex={0}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>

          </div>

          {password &&
            confirmPassword &&
            password === confirmPassword && (
              <p className="mt-2 rounded bg-green-600 p-2 text-xs text-white">
                Passwords match
              </p>
          )}


          {errors.confirmPassword && (
            <p className="mb-2 rounded bg-red-500 p-2 text-xs text-white">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>


        <button
          disabled={
            mutation.isLoading || 
            strength.label !== "Very Strong 💪" || 
            password !== confirmPassword
          }
          className="mt-8 h-11 w-full cursor-pointer rounded bg-linear-to-b from-orange-600 to-orange-800 text-orange-100 transition hover:from-orange-700 hover:to-orange-900"
        >
          {mutation.isLoading ? "Signing up..." : "Sign Up"}
        </button>
        
        <div className="mt-5">
          <p className="text-gray-500 text-sm">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-orange-600 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </>
  );
};

export default SignUp;