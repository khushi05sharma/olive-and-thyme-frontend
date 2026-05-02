import { type FC, useState, type FormEvent, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Send } from "lucide-react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import logo from "../assets/logo.png";
import { API_BASE } from "../services/config";

const ForgotPassword: FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // after successful submision — show success message instead of form
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (): boolean => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return false;
    }
    setError("");
    return true;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(""); // clear error when typing
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong. Try again.");
        return;
      }

      // will show success view - same for both found and not found emails
      // backend returns success to prevent email fraud
      setIsSubmitted(true);
    } catch (err) {
      setError("Could not connect to server. Please try again.");
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
            Forgot Password?
          </h1>
          <p className="text-sm text-gray-600 sm:text-base">
            No worries — we'll send you reset instructions
          </p>
        </div>

        {/* Card */}
        <div className="w-full p-5 bg-white shadow-lg sm:p-6 md:p-8 rounded-xl">
          {/* SUCCESS VIEW — shown after form submit */}
          {isSubmitted ? (
            <div className="py-4 text-center">
              {/* Success icon */}
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
                <Mail size={28} className="text-green-600" />
              </div>

              <h2 className="mb-2 text-lg font-bold text-gray-800">
                Check your email
              </h2>
              <p className="mb-6 text-sm text-gray-600">
                We sent a password reset link to{" "}
                <span className="font-medium text-gray-800">{email}</span>.
                Check your inbox and follow the instructions.
              </p>

              {/* Resend option */}
              <p className="mb-4 text-sm text-gray-500">
                Didn't receive it?{" "}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="font-medium transition text-primary hover:text-orange-600"
                >
                  Try again
                </button>
              </p>

              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm font-medium transition text-primary hover:text-orange-600"
              >
                <ArrowLeft size={16} />
                Back to login
              </Link>
            </div>
          ) : (
            /* FORM VIEW — shown initially */
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-sm text-gray-600">
                Enter the email address linked to your account and we'll send
                you a link to reset your password.
              </p>

              <Input
                label="Email Address"
                name="email"
                type="email"
                value={email}
                onChange={handleChange}
                placeholder="you@example.com"
                icon={<Mail size={18} />}
                error={error}
                required
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full gap-2 text-sm sm:text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                    Sending link...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Reset Link
                  </>
                )}
              </Button>

              {/* Back to login */}
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

        {/* Footer */}
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

export default ForgotPassword;
