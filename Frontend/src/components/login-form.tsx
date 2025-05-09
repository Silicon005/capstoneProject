// src/components/LoginForm.tsx
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { useUser } from "../hooks/userContext";
import axios from "axios";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setIsAuthenticated, isAuthenticated } = useAuth();
  const { setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      let isMounted = true; 

      const redirectToDashboard = async () => {
        try {
          const response = await axios.get("http://localhost:3000/auth/profile", { withCredentials: true });

          console.log(response.data);

          if (isMounted && response.data) {
            const { role, id, name, email } = response.data;
            setUser(id, role, name, email);

            switch (role) {
              case "STUDENT":
                navigate("/student");
                break;
              case "TEACHER":
                navigate("/teacher");
                break;
              case "ADMIN":
                navigate("/admin-dashboard");
                break;
              default:
                alert("Invalid user type");
            }
          }
        } catch (error) {
          console.error("Error fetching profile: ", error);
        }
      };

      redirectToDashboard();

      return () => {
        isMounted = false; 
      };
    }
  }, [isAuthenticated, navigate, setUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        { email, password },
        { withCredentials: true }
      );
      if (response.data) {
        setIsAuthenticated(true);
        const { role, id, name, email } = response.data;

        setUser(id, role, name, email);
        switch (role) {
          case "STUDENT":
            navigate("/student-dashboard");
            break;
          case "TEACHER":
            navigate("/teacher");
            break;
          case "ADMIN":
            navigate("/admin-dashboard");
            break;
          default:
            alert("Invalid user type");
        }
      } else {
        alert("Invalid credentials. Please try again.");
      }
    } catch (error: unknown) {
      console.error("Error logging in:", error);
      alert(error.response?.data?.message || "Error logging in. Please try again later.");
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to log in to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full">
          {/* GitHub icon SVG can be added here */}
          Login with GitHub
        </Button>
      </div>
      <div className="text-center text-sm">
        Don't have an account?{" "}
        <a href="/signup" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  );
}
