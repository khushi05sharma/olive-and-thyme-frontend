import { type FC, useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, User, Eye, EyeOff } from "lucide-react";

import Button from "../components/common/Button";
import Input from "../components/common/Input";
import logo from "../assets/logo.png";

const Signup: FC = () => {
  const navigate = useNavigate();

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

  //HANDLERS

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Phase 1: Just simulate successful signup
    // Phase 3: POST /api/auth/signup
    // const response = await fetch('/api/auth/signup', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     name: formData.name,
    //     email: formData.email,
    //     password: formData.password
    //   })
    // });
    // const { token, user } = await response.json();
    // Store token, update AuthContext

    setIsSubmitting(false);

    // Show success and redirect
    alert("Account created successfully!");
    navigate("/");
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
                className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                style={{ marginTop: "24px" }}
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
                className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                style={{ marginTop: "24px" }}
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
