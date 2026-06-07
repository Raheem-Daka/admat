import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../../utils/authKeys";
import { useAuth } from "../../utils/AuthContext";
import { toast } from "sonner";
import { FaEnvelope, FaLock, FaGoogle, FaTwitter, FaFacebook } from "react-icons/fa";
import { apiFetch } from "../../api/api";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [show2FA, setShow2FA] = useState(false);
  const [otp, setOtp] = useState("");

  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setError("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiFetch(`/signin/`, {
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      console.log("LOGIN RESPONSE:", data)

      if (data.requires_2fa){
        toast.info("2FA required, Enter your OTP");
        localStorage.setItem("2fa_email", formData.email)
        setShow2FA(true);

        return;
      } 

      if(data.access && data.refresh) {
        login(data.access, data.refresh);
        toast.success("Signed in successfully")

        const lastPath = localStorage.getItem("lastPath");

        if (lastPath) {
          localStorage.removeItem("lastPath");
            navigate(lastPath, { replace: true });
        } else {
            navigate("/", {replace : true });
        }
        return        
      }

    } catch (err) {
      console.log("LOGIN ERROR", err)
      setError(
        err?.message ||
        err?.respons?.data?.message ||
        "Failed to sighn in, Please try again"
      );
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000)
    }
  };

  const verifyOTP = async () => {
    try {
      const email = localStorage.getItem("2fa_email");

      const data = await apiFetch("/login_2fa/", {
        method: "POST",
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      login(data.access, data.refresh);
      toast.success("Login successful ✅");

      setShow2FA(false);
      navigate("/");

    } catch (err) {
      setError("Invalid OTP");
    }
  };

  return (
    <>
      <form 
      onSubmit={handleSubmit}
      className="flex w-full mx-auto flex-col items-center justify-center xl:max-w-100 lg:max-w-96">
        
        <h2 className="text-4xl font-medium text-gray-900">Sign in</h2>
        <p className="mt-3 text-sm text-gray-500/90 bg-orange-200 w-full text-center text-orange-600 rounded py-1 ">Welcome back! Please sign in to continue</p>
        <div className="mt-10 mb-2 grid w-full grid-cols-3 gap-6">
                <button type="button" className="flex items-center justify-center rounded border border-gray-200 py-2.5 hover:bg-gray-50 focus:border-gray-300 cursor-pointer">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_8755_1278)">
                            <path d="M12 9.81836V14.4656H18.4582C18.1746 15.9602 17.3236 17.2257 16.0472 18.0766L19.9417 21.0984C22.2108 19.0039 23.5199 15.9276 23.5199 12.273C23.5199 11.4221 23.4436 10.6039 23.3017 9.81849L12 9.81836Z" fill="#4285F4" />
                            <path d="M5.27657 14.2842L4.3982 14.9566L1.28906 17.3783C3.2636 21.2947 7.31058 24.0002 12.0014 24.0002C15.2414 24.0002 17.9577 22.9311 19.9432 21.0984L16.0487 18.0765C14.9796 18.7965 13.6159 19.2329 12.0014 19.2329C8.88146 19.2329 6.23063 17.1275 5.28147 14.2911L5.27657 14.2842Z" fill="#34A853" />
                            <path d="M1.28718 6.62207C0.469042 8.23655 0 10.0584 0 12.0002C0 13.942 0.469042 15.7638 1.28718 17.3783C1.28718 17.3891 5.27997 14.2801 5.27997 14.2801C5.03998 13.5601 4.89812 12.7965 4.89812 12.0001C4.89812 11.2036 5.03998 10.44 5.27997 9.72L1.28718 6.62207Z" fill="#FBBC05" />
                            <path d="M12.0017 4.77818C13.769 4.77818 15.3399 5.38907 16.5944 6.56727L20.0307 3.13095C17.9471 1.18917 15.2417 0 12.0017 0C7.31082 0 3.2636 2.69454 1.28906 6.62183L5.28174 9.72001C6.23077 6.88362 8.88171 4.77818 12.0017 4.77818Z" fill="#EA4335" />
                        </g>
                        <defs>
                            <clipPath id="clip0_8755_1278">
                                <rect width="24" height="24" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </button>
                <button type="button" className="flex items-center justify-center rounded border border-gray-200 py-2.5 hover:bg-gray-50 focus:border-gray-300 cursor-pointer">
                    <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_8755_1275)">
                            <path d="M16.7855 1.9043H19.8757L13.1245 10.3278L21.0667 21.7903H14.848L9.9773 14.8383L4.40409 21.7903H1.31202L8.53308 12.7804L0.914062 1.9043H7.29065L11.6934 8.25863L16.7855 1.9043ZM15.7009 19.7711H17.4132L6.36022 3.81743H4.52273L15.7009 19.7711Z" fill="black" />
                        </g>
                        <defs>
                            <clipPath id="clip0_8755_1275">
                                <rect width="21.9847" height="24" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </button>
                <button type="button" className="flex items-center justify-center rounded border border-gray-200 py-2.5 hover:bg-gray-50 focus:border-gray-300 cursor-pointer">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_8755_1272)">
                            <path d="M24 12C24 5.37264 18.6274 0 12 0C5.37264 0 0 5.37264 0 12C0 17.6275 3.87456 22.3498 9.10128 23.6467V15.6672H6.62688V12H9.10128V10.4198C9.10128 6.33552 10.9498 4.4424 14.9597 4.4424C15.72 4.4424 17.0318 4.59168 17.5685 4.74048V8.06448C17.2853 8.03472 16.7933 8.01984 16.1822 8.01984C14.2147 8.01984 13.4544 8.76528 13.4544 10.703V12H17.3741L16.7006 15.6672H13.4544V23.9122C19.3963 23.1946 24.0005 18.1354 24.0005 12H24Z" fill="#0866FF" />
                            <path d="M16.6988 15.6672L17.3722 12H13.4525V10.703C13.4525 8.76526 14.2128 8.01982 16.1804 8.01982C16.7914 8.01982 17.2834 8.0347 17.5666 8.06446V4.74046C17.03 4.59118 15.7181 4.44238 14.9578 4.44238C10.9479 4.44238 9.0994 6.3355 9.0994 10.4198V12H6.625V15.6672H9.0994V23.6467C10.0277 23.8771 10.9988 24 11.9981 24C12.4901 24 12.9754 23.9697 13.452 23.9121V15.6672H16.6983H16.6988Z" fill="white" />
                        </g>
                        <defs>
                            <clipPath id="clip0_8755_1272">
                                <rect width="24" height="24" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </button>
            </div>

            {/* Divider */}
             <div className="my-5 flex w-full items-center gap-4">
                <div className="h-px w-full bg-orange-300"></div>
                <p className="w-full text-sm text-nowrap text-gray-500">or sign in with email</p>
                <div className="h-px w-full bg-orange-300"></div>
            </div>

          {error && (
            <p className="bg-red-500 text-white p-1 rounded text-sm mb-4">{error}</p>
          )}

            {/* Email Input */}
            <div className="flex h-12 w-full items-center gap-2 overflow-hidden rounded border border-orange-300 bg-transparent pl-5 focus-within:border-orange-600 focus-within:ring-1 focus-within:ring-orange-600">
              <FaEnvelope className="text-orange-600 mr-2"/>
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="Enter your email"
                required
                onChange={handleChange}
                className="pl-2 h-full w-full bg-transparent text-sm placeholder-gray-400 outline-none"
              />
            </div>

            {/* Password Input */}
             <div className="relative mt-4 flex h-12 w-full items-center gap-2 overflow-hidden rounded border border-orange-300 bg-transparent pl-5 focus-within:border-orange-600 focus-within:ring-1 focus-within:ring-orange-600">
                <FaLock className="text-orange-600 mr-2"/>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  placeholder="Enter your Password"
                  required
                  onChange={handleChange}
                  className="pl-2 h-full w-full bg-transparent text-sm placeholder-gray-400 outline-none"
                />

              <button
                size={18}
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showPassword ? <EyeOff className="text-orange-600" size={18} /> : <Eye size={18} className="text-orange-600" />}
              </button>
            </div>

            {/* Remember me & Forgot password */}
            <div className="mt-8 flex w-full items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2">
                    <input 
                    onChange={() => setRememberMe(prev => !prev)}
                    className="peer hidden" 
                    type="checkbox"/>
                    <span className="relative flex size-4.5 items-center justify-center rounded border border-orange-300 peer-checked:border-orange-900 peer-checked:bg-orange-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check size-3 text-white" aria-hidden="true" >
                            <path d="M20 6 9 17l-5-5"></path>
                        </svg>
                    </span>
                    <span className="text-gray-500 select-none">Remember me</span>
                </label>
                <a className="text-orange-600 underline" href="#">
                    Forgot password?
                </a>
            </div>

            {/* Sign In Button */}
            <button
              disabled={loading}
              className="mt-8 h-11 w-full cursor-pointer rounded bg-linear-to-b from-orange-600 to-orange-800 text-orange-100 transition hover:from-orange-700 hover:to-orange-900"            
              >
              {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                
              </span>
            ) : (
              "Sign In"
            )}
            </button>        

          <div className="mt-4 text-sm text-center text-slate-500">
            Don’t have an account?
            <Link
              to="/signup"
              className="ml-2 text-orange-600 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </div>
      </form>

      {show2FA && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          
          <div className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-sm text-center">

            <h3 className="text-xl text-gray-500 font-semibold mb-3">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-500 mb-4">
              Enter the 6-digit code from your authenticator app
            </p>

            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              className="w-full border p-3 text-center text-xl tracking-widest rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            />

            <button
              onClick={verifyOTP}
              className="mt-4 w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg transition"
            >
              Verify
            </button>

            <button
              onClick={() => setShow2FA(false)}
              className="mt-2 text-sm text-gray-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SignIn;