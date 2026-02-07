import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

// Use empty string for production (same domain) or localhost for development
const API_URL = process.env.REACT_APP_API_URL || "";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/api/token/`, {
        username,
        password,
      });

      // Save tokens in localStorage
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid username or password");
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1565514020176-dbf2277f18f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" 
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-black opacity-70"></div>

      <div className="relative z-10 bg-white bg-opacity-95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white border-opacity-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to manage your finances</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg transform hover:-translate-y-0.5"
          >
            Sign In
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm text-center border border-red-100">
            {error}
          </div>
        )}
        <p className="mt-6 text-center text-gray-600 text-sm">
          Don't have an account? <Link to="/register" className="text-indigo-600 font-semibold hover:text-indigo-800 transition">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
