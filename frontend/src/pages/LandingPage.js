import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// --- Reusable AuthModal Component ---
function AuthModal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900/80 backdrop-blur-lg border border-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-md relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold text-xl"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>
        {children}
      </motion.div>
    </div>
  );
}

// --- Login Modal ---
function LoginModal({ isOpen, onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "";

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
    </AuthModal>
  );
}

// --- Register Modal ---
function RegisterModal({ isOpen, onClose }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "";

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/register/`, { username, email, password });
      alert("Registration successful! Please login.");
      onClose();
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

// --- Landing Page ---
export default function LandingPage() {
  const navigate = useNavigate();
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">
            Financ<span className="text-indigo-600">ify</span>
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => setLoginOpen(true)}
              className="text-slate-300 hover:text-white"
            >
              Login
            </button>
            <button
              onClick={() => setRegisterOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Take Full Control of Your Finances
          </motion.h1>

          <p className="text-lg text-slate-300 mb-8">
            Track every peso effortlessly and stay in control of your money
            with a fast, modern finance tracker built for everyday use.
          </p>

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => setRegisterOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl text-lg font-semibold"
            >
              Get Started Free
            </button>
          </div>
        </div>

        <motion.img
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80"
          alt="Dashboard preview"
          className="rounded-2xl shadow-2xl w-full h-[420px] object-cover"
        />
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20 space-y-20">
        {[
          {
            title: "Smart Expense & Income Tracking",
            tagline: "Track every peso effortlessly and stay in control of your money.",
            desc: "Add transactions instantly, categorize income and expenses, and see real-time balance updates in a clean interface.",
            img: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=800&q=80",
          },
          {
            title: "Live Financial Dashboard",
            tagline: "Your finances, summarized in one powerful dashboard.",
            desc: "Instantly view total income, expenses, and balances with visual summaries that reveal spending patterns.",
            img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
          },
          {
            title: "Visual Analytics & Charts",
            tagline: "Turn numbers into insights with visual analytics.",
            desc: "Interactive charts and summaries help you understand trends and make smarter financial decisions.",
            img: "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=800&q=80",
          },
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className={`grid md:grid-cols-2 gap-10 items-center ${
              i % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            <img
              src={feature.img}
              alt={feature.title}
              className="rounded-2xl shadow-xl w-full h-[320px] object-cover"
            />

            <div>
              <h2 className="text-3xl font-bold mb-4">{feature.title}</h2>
              <p className="text-blue-400 font-semibold mb-2">{feature.tagline}</p>
              <p className="text-slate-300">{feature.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Testimonials */}
      <section className="bg-slate-900/60 py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Trusted by Everyday Users
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            "This app helped me finally understand my spending habits.",
            "Clean, fast, and incredibly easy to use.",
            "The dashboard makes managing money simple.",
          ].map((quote, i) => (
            <div key={i} className="bg-slate-800 p-6 rounded-2xl shadow-lg">
              <p className="text-slate-300">“{quote}”</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-slate-500">
        © {new Date().getFullYear()} Financify. All rights reserved.
      </footer>

      {/* Modals */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />
      <RegisterModal isOpen={isRegisterOpen} onClose={() => setRegisterOpen(false)} />
    </div>
  );
}
