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
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
    // Clear error for this field
    if (errors[name]) {
      setErrors({...errors, [name]: ""});
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    //name validation
    if (!formData.name) {
      newErrors.name = "name is required";
    } else if (formData.name.trim().length < 2){
      newErrors.name = "name must be at least 2 characters";
    }

    //email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    //password validation
    if (!formData.password){
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6){
      newErrors.password = "Password must be at least 6 characters";
    }

    //confirm password validation
    if (!formData.confirmPassword){
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.confirmPassword !== formData.password){
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
      <div>

      </div>
    );
};

export default Signup;
