import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { registerUser } from '../Functions/RegisterApi';  
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { useUser } from "../hooks/userContext";
import axios from "axios";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [alert, setAlert] = useState<{
    type: "success" | "danger" | null;
    message: string;
  } | null>(null);

  const { setIsAuthenticated, isAuthenticated } = useAuth();
  const { setUser } = useUser();

  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (formData.name.trim().length < 2 || formData.name.trim().length > 20) {
      newErrors.name = "Name should be between 2 and 20 characters.";
    }
    if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Invalid email format.";
    }
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Password must have at least 8 characters, one uppercase, one lowercase, one digit, and one special character.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { name, email, password } = formData;

    try {
        const response = await registerUser(name, email, password);
        setAlert({
            type: "success",
            message: response.message || "Registration successful! Logging you in...",
        });

        const loginResponse = await axios.post(
          "http://localhost:3000/auth/login",
          { email, password },
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        const { role, id, name: userName, email: userEmail } = loginResponse.data.user;
        setUser(id, role, userName, userEmail);
        navigate("/dashboard");
    } catch (error: unknown) {
        setAlert({
            type: "danger",
            message: error.response?.data?.message || "Error processing request.",
        }); 
    }
};
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <form
      className={cn("flex flex-col gap-6 w-[400px]", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      {alert && (
        <div
          className={`fixed top-0 left-1/2 transform -translate-x-1/2 p-2 w-2/4 mt-1 text-sm ${
            alert.type === "danger" ? "text-red-700 bg-red-100" : "text-green-700 bg-green-100"
          } rounded-lg flex items-center justify-center gap-2 text-center`}
        >
          <div>{alert.message}</div>
        </div>
      )}
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Sign Up to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to create your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            required
            onChange={handleChange}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            onChange={handleChange}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            required
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>
        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="/login" className="underline underline-offset-4">
          Login
        </a>
      </div>
    </form>
  );
}