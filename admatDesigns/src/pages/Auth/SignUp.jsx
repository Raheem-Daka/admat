import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getPasswordStrength, generatePassword, getPasswordRules } from "../../utils/passwords";
import PasswordStrength from "../../components/PasswordStrength";
import { apiFetch } from "../../api/api";

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


        <div className="space-y-4">
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
          
          <div className="relative">
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
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full p-2 pr-10 rounded border border-slate-400"
              {...register("confirmPassword", {
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            <span
              role="button"
              aria-label="Toggle password visibility"
              tab
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>

          </div>

          {password && confirmPassword && (
            <p className={`text-xs mt-2 ${
              password === watch("confirmPassword")
                ? "text-green-600"
                : "text-red-500"
            }`}>
              {password === watch("confirmPassword")
                ? "Passwords match ✅"
                : "Passwords do not match ❌"}
            </p>
          )}


          {errors.confirmPassword && (
            <p className="bg-red-500 text-white p-1 rounded text-red-500 text-sm mb-2">
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
          className="w-full gap-2 justify-center cursor-pointer rounded bg-linear-to-b from-orange-600 to-orange-800 text-orange-100 transition hover:from-orange-700 hover:to-orange-900 px-3 py-2 disabled:opacity-50"
        >
          {mutation.isLoading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignUp;