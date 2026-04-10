import { type FC, useState, type FormEvent, type ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginApi } from "../services/authApi";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import logo from "../assets/logo.png";
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";

const Login: FC = () => {
  const navigate = useNavigate();

  // get login function from AuthContext
  const { login } = useAuth();

  // STATE
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  //HANDLERS

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
      // clear server error when user starts typing again
      if (serverError) setServerError("");
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    //email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    //password validation

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;
    setIsSubmitting(true);
    setServerError("");

    //real api call
    try {
      const { token, user } = await loginApi(formData.email, formData.password);
      // save token + user in AuthContext + localStorage
      login(token, user);
      navigate("/");
    } catch (error: any) {
      setServerError(error.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // RENDER

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10 sm:px-6 lg:px-8 sm:py-12 bg-gradient-to-br from-orange-50 via-primary-light to-yellow-50">
      <div className="w-full max-w-md mx-auto sm:max-w-lg md:max-w-md">
        {/* logo & title */}
        <div className="mb-6 text-center">
          <Link to="/" className="inline-block mb-3">
            <img
              src={logo}
              alt="Olive & Thyme"
              className="w-12 h-12 mx-auto sm:w-14 sm:h-14 md:w-16 md:h-16"
            />
          </Link>
          <h1 className="mb-2 text-xl font-bold text-gray-800 sm:text-2xl md:text-3xl">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-600 sm:text-base">
            Sign in to continue to Olive & Thyme
          </p>
        </div>

        {/* Login Form */}

        <div className="w-full p-5 bg-white shadow-lg sm:p-6 md:p-8 rounded-xl">
          {/* server error */}
          {serverError && (
            <div className="p-3 mb-4 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50">
              {serverError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* email input*/}
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              icon={<Mail size={18} />}
              error={errors.email}
              required
            />

            {/* password input */}
            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                icon={<Lock size={18} />}
                error={errors.password}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* forgot password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-primary focus:ring-primary"
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="font-medium transition text-primary hover:text-orange-600"
              >
                Forgot password?
              </Link>
            </div>

            {/* submit button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full gap-2 text-sm sm:text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-gray-300" />
            <span className="text-sm text-gray-500">OR</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>
          {/* Sign Up Link */}
          <p className="text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium transition text-primary hover:text-orange-600"
            >
              Sign up for free
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-6 text-[11px] sm:text-xs text-center text-gray-500">
          By signing in, you agree to our{" "}
          <a href="#" className="underline hover:text-gray-700">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-gray-700">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};
export default Login;
