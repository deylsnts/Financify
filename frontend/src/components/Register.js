import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";

const API_URL = process.env.REACT_APP_API_URL || "";

export default function RegisterModal({ isOpen, onClose }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/register/`, { username, email, password });
      alert("Registration successful! Please login.");
      onClose();
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Please check your info.");
    }
  };

  return (
    <AuthModal isOpen={isOpen} onClose={onClose} title="Create Account">
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          Sign Up
        </button>
      </form>

      {error && <p className="text-red-400 text-center mt-2">{error}</p>}
    </AuthModal>
  );
}
