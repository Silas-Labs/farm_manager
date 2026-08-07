// Project: Farm Manager | Module: Login.jsx
// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Leaf,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Wifi,
  WifiOff,
} from "lucide-react";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, isOnline } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-100 via-white to-yellow-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-300 rounded-full opacity-30 blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md overflow-hidden shadow-2xl border-green-200 relative z-10 bg-white">
        <div className="bg-gradient-to-r from-green-700 to-green-800 p-6 text-center">
          <div className="inline-flex p-3 bg-white/20 rounded-2xl mb-3 backdrop-blur-sm">
            <Leaf className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white important">
            Farm Manager
          </h1>
          <p className="text-whitetext-sm mt-1">
            Smart Agriculture Management System
          </p>
        </div>

        <CardContent className="p-6">
          <CardTitle className="text-2xl text-center mb-2 text-gray-800">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center mb-6 text-gray-500">
            Sign in to manage your farm operations
          </CardDescription>

          <div
            className={`mb-4 p-2 rounded-lg text-center text-sm ${
              isOnline
                ? "bg-green-50 text-green-700"
                : "bg-yellow-50 text-yellow-700"
            }`}
          >
            {isOnline ? (
              <span className="flex items-center justify-center gap-2">
                <Wifi className="w-4 h-4" /> Online
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <WifiOff className="w-4 h-4" /> Offline - Check your connection
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 pr-9 h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-green-700 hover:bg-green-800 font-medium shadow-md"
            >
              <LogIn className="w-4 h-4 mr-2 " />
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-green-700 hover:text-green-800 font-medium hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>

          {/* <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              Demo: <span className="font-mono">admin@farm.com</span> /{" "}
              <span className="font-mono">password123</span>
            </p>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
};

// EOF: Login.jsx
