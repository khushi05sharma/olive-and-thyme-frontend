import { type FC, useState, type FormEvent, type ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import logo from "../assets/logo.png";
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";

const Login: FC = () => {
  const navigate = useNavigate();

  // STATE
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPaaword] = useState(false);
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

    if (!validateForm()) {
      setIsSubmitting(true);
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Phase 1: Just simulate successful login
    // Phase 3: POST /api/auth/login
    // const response = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   body: JSON.stringify(formData)
    // });
    // const { token, user } = await response.json();
    // Store token in localStorage
    // Update AuthContext

    setIsSubmitting(false);
    // Show success and redirect
    alert("Login successful!");
    navigate("/");
  };

  return <div></div>;
};
export default Login;
