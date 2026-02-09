import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";

const API_URL = process.env.REACT_APP_API_URL || "";

export default function LoginModal({ isOpen, onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/token/`, { username, password });
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      navigate("/dashboard");
      onClose();
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <AuthModal isOpen={isOpen} onClose={onClose} title="Welcome Back">
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition"
          required
        />
        <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold transition">
          Sign In
        </button>
      </form>

      {error && <p className="text-red-400 text-center mt-2">{error}</p>}

      <p className="text-center mt-4 text-slate-400 text-sm">
        Don't have an account?{" "}
        <span className="text-blue-500 cursor-pointer hover:text-blue-400 transition">
          Sign up
        </span>
      </p>
    </AuthModal>
  );
}
