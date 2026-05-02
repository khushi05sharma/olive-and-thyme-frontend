import { type FC, useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from "lucide-react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import logo from "../assets/logo.png";
import { API_BASE } from "../services/config";

const ResetPassword: FC = () => {
  const { token } = useParams<{ token: string }>(); // gets token from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE}/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: formData.password }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        // token expired or invalid - show error inside form
        setErrors({ password: data.message });
        return;
      }

      // show success screen then redirect to login
      setIsSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setErrors({ password: "Could not connect to server. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-primary-light to-yellow-50">
      <div className="w-full max-w-md mx-auto">
        {/* Logo + Title */}
        <div className="mb-6 text-center">
          <Link to="/" className="inline-block mb-3">
            <img
              src={logo}
              alt="Olive & Thyme"
              className="w-12 h-12 mx-auto sm:w-14 sm:h-14 md:w-16 md:h-16"
            />
          </Link>
          <h1 className="mb-2 text-xl font-bold text-gray-800 sm:text-2xl md:text-3xl">
            Reset Password
          </h1>
          <p className="text-sm text-gray-600 sm:text-base">
            Create a strong new password for your account
          </p>
        </div>

        {/* Card */}
        <div className="w-full p-5 bg-white shadow-lg sm:p-6 md:p-8 rounded-xl">
          {/* SUCCESS VIEW */}
          {isSuccess ? (
            <div className="py-4 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
                <CheckCircle size={28} className="text-green-600" />
              </div>
              <h2 className="mb-2 text-lg font-bold text-gray-800">
                Password reset!
              </h2>
              <p className="mb-6 text-sm text-gray-600">
                Your password has been successfully changed. Redirecting you to
                login...
              </p>
              <div className="w-8 h-8 mx-auto border-2 rounded-full border-primary border-t-transparent animate-spin" />
            </div>
          ) : (
            /* FORM VIEW */
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-sm text-gray-600">
                Choose a new password for your account. Make sure it's at least
                6 characters long.
              </p>

              {/* New Password */}
              <div className="relative">
                <Input
                  label="New Password"
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

              {/* Confirm Password */}
              <div className="relative">
                <Input
                  label="Confirm New Password"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  icon={<Lock size={18} />}
                  error={errors.confirmPassword}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full gap-2 text-sm sm:text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Reset Password
                  </>
                )}
              </Button>

              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm font-medium transition text-primary hover:text-orange-600"
              >
                <ArrowLeft size={16} />
                Back to login
              </Link>
            </form>
          )}
        </div>

        <p className="mt-6 text-[11px] sm:text-xs text-center text-gray-500">
          By using this service, you agree to our{" "}
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

export default ResetPassword;
