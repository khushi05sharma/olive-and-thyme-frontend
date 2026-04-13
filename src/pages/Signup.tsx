import { type FC, useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, User, Eye, EyeOff } from "lucide-react";

import Button from "../components/common/Button";
import Input from "../components/common/Input";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { signupApi } from "../services/authApi";

const Signup: FC = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  //STATE

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  //HANDLERS

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
      if (serverError) setServerError("");
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    //name validation
    if (!formData.name) {
      newErrors.name = "name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "name must be at least 2 characters";
    }

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

    //confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;
    setIsSubmitting(true);
    setServerError("");

    try {
      const { token, user } = await signupApi(
        formData.name,
        formData.email,
        formData.password,
      );
      // log user in immediately after signup
      login(token, user);
      navigate("/");
    } catch (error: any) {
      setServerError(error.message || "Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  //RENDER

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-orange-50 via-primary-light to-yellow-50">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block mb-4">
            <img src={logo} alt="Olive & Thyme" className="w-16 h-16 mx-auto" />
          </Link>
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Create Account
          </h1>
          <p className="text-gray-600">Join our community of food lovers</p>
        </div>

        {/* Signup Form */}
        <div className="p-8 bg-white shadow-lg rounded-xl">
          {/* Server Error */}
          {serverError && (
            <div className="p-3 mb-4 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50">
              {serverError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <Input
              label="Full Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              icon={<User size={18} />}
              error={errors.name}
              required
            />

            {/* Email Input */}
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

            {/* Password Input */}
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

            {/* Confirm Password Input */}
            <div className="relative">
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                icon={<Lock size={18} />}
                error={errors.confirmPassword}
                required
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* Terms Checkbox */}
            <label className="flex items-start gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                required
                className="w-4 h-4 mt-1 rounded text-primary focus:ring-primary"
              />
              <span className="text-gray-600">
                I agree to the{" "}
                <a
                  href="#"
                  className="font-medium text-primary hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="font-medium text-primary hover:underline"
                >
                  Privacy Policy
                </a>
              </span>
            </label>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Create Account
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

          {/* Login Link */}
          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium transition text-primary hover:text-orange-600"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
