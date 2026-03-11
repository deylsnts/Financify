import React, { useState, useEffect } from "react";
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
function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL || "";

    useEffect(() => {
        // Reset form and states when modal is closed
        if (!isOpen) {
            setTimeout(() => {
                setUsername("");
                setPassword("");
                setError("");
                setIsSuccess(false);
                setLoading(false);
            }, 300); // Delay for exit animation
        }
    }, [isOpen]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/api/token/`, { username, password });
            localStorage.setItem("access", response.data.access);
            localStorage.setItem("refresh", response.data.refresh);
            setIsSuccess(true); // Trigger success animation
            setTimeout(() => {
                navigate("/dashboard");
                onClose();
            }, 2000); // Navigate after 2 seconds
        } catch (err) {
            setError("Invalid username or password");
            setLoading(false);
        }
    };

    return (
        <AuthModal isOpen={isOpen} onClose={onClose} title={isSuccess ? "Success!" : "Welcome Back"}>
            {isSuccess ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-center py-4"
                >
                    <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4 border-2 border-green-500/30">
                        <motion.svg
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, delay: 0.2, type: "tween" }}
                            className="w-8 h-8 text-green-500" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </motion.svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white">Login Successful!</h3>
                    <p className="text-slate-400 mt-2">Redirecting to your dashboard...</p>
                </motion.div>
            ) : (
                <>
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
                        <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold transition disabled:opacity-50" disabled={loading}>
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>

                    {error && <p className="text-red-400 text-center mt-2">{error}</p>}

                    <p className="text-center mt-4 text-slate-400 text-sm">
                        Don't have an account?{" "}
                        <span onClick={onSwitchToRegister} className="text-blue-500 cursor-pointer hover:text-blue-400 transition">
                            Sign up
                        </span>
                    </p>
                </>
            )}
        </AuthModal>
    );
}

// --- Register Modal ---
function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const API_URL = process.env.REACT_APP_API_URL || "";

    useEffect(() => {
        // Reset form and states when modal is closed to ensure a clean state
        if (!isOpen) {
            setTimeout(() => {
                setUsername("");
                setEmail("");
                setPassword("");
                setPassword2("");
                setError("");
                setIsSuccess(false);
                setLoading(false);
            }, 300); // Delay to allow for exit animation
        }
    }, [isOpen]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (password !== password2) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            await axios.post(`${API_URL}/api/register/`, { username, email, password });
            setIsSuccess(true); // Show success message
            setTimeout(() => {
                onClose(); // Close the modal after a delay
            }, 4000);
        } catch (err) {
            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError("Registration failed. An unknown error occurred.");
            }
            setLoading(false);
        }
    };

    return (
        <AuthModal isOpen={isOpen} onClose={onClose} title={isSuccess ? "Success!" : "Create Account"}>
            {isSuccess ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-center py-4"
                >
                    <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4 border-2 border-green-500/30">
                        <motion.svg
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, delay: 0.2, type: "tween" }}
                            className="w-8 h-8 text-green-500" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </motion.svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white">Registration Successful!</h3>
                    <p className="text-slate-400 mt-2">Please check your email to find your activation link.</p>
                </motion.div>
            ) : (
                <>
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
                            placeholder="Password (min. 8 characters)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition"
                            required
                        />
                        <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold transition disabled:opacity-50" disabled={loading}>
                            {loading ? "Signing Up..." : "Sign Up"}
                        </button>
                    </form>

                    {error && <p className="text-red-400 text-center mt-2">{error}</p>}

                    <p className="text-center mt-4 text-slate-400 text-sm">
                        Already have an account?{" "}
                        <span onClick={onSwitchToLogin} className="text-blue-500 cursor-pointer hover:text-blue-400 transition">
                            Sign in
                        </span>
                    </p>
                </>
            )}
        </AuthModal>
    );
}

// --- Icon Components for Features ---
const TrackingIcon = () => (
    <svg className="w-6 h-6 mb-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
);
const DashboardIcon = () => (
    <svg className="w-6 h-6 mb-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
);
const AnalyticsIcon = () => (
    <svg className="w-6 h-6 mb-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" /></svg>
);

const features = [
    {
        icon: <TrackingIcon />,
        title: "Smart Transaction Logging",
        desc: "Quickly add expenses and income with smart categorization that learns your habits.",
    },
    {
        icon: <DashboardIcon />,
        title: "Unified Financial Dashboard",
        desc: "See your complete financial picture with real-time balances and cash flow summaries.",
    },
    {
        icon: <AnalyticsIcon />,
        title: "Insightful Visual Analytics",
        desc: "Interactive charts reveal spending patterns, helping you make smarter decisions.",
    },
];

// --- Landing Page ---
export default function LandingPage() {
    const navigate = useNavigate();
    const [isLoginOpen, setLoginOpen] = useState(false);
    const [isRegisterOpen, setRegisterOpen] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('activated') === 'true') {
            alert('Account activated successfully! You can now log in.');
            setRegisterOpen(false);
            setLoginOpen(true);
            // Clean the URL so the message doesn't pop up on every refresh
            navigate('/', { replace: true });
        } else if (params.get('activated') === 'false') {
            alert('Activation link is invalid or has expired. Please try registering again.');
            // Clean the URL
            navigate('/', { replace: true });
        }
    }, [navigate]);

    const openLogin = () => {
        setRegisterOpen(false);
        setLoginOpen(true);
    };

    const openRegister = () => {
        setLoginOpen(false);
        setRegisterOpen(true);
    };

    const closeModals = () => {
        setLoginOpen(false);
        setRegisterOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white relative">
            {/* Background Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-1/4 w-full h-full bg-gradient-to-r from-indigo-600/30 to-transparent filter blur-3xl opacity-20 transform -rotate-45"></div>
                <div className="absolute bottom-0 -right-1/4 w-full h-full bg-gradient-to-l from-blue-600/30 to-transparent filter blur-3xl opacity-20 transform rotate-45"></div>
            </div>

            {/* Navbar */}
            <header className="sticky top-0 z-50">
            <nav className="bg-slate-950/60 backdrop-blur-lg border-b border-slate-800">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

                    {/* Logo + Brand */}
                    <div className="flex items-center gap-1">
                        <img 
                            src="/financify-icon.png" 
                            alt="Financify Logo" 
                            className="w-10 h-10 rounded-lg object-cover" 
                        />
                        <h1 className="text-xl font-bold text-white">
                            Financ<span className="text-indigo-600">ify</span>
                        </h1>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={openLogin}
                            className="text-slate-300 hover:text-white font-medium transition"
                        >
                            Login
                        </button>
                        <button
                            onClick={openRegister}
                            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl text-white font-semibold transition"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </nav>
            </header>

            {/* Hero */}
            <main>
            <section className="max-w-6xl mx-auto px-6 pt-20 pb-8 grid md:grid-cols-2 gap-16 items-center">
                <div className="md:mt-[-4rem]">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tighter"
                    >
                        Track Your Money,
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-400">
                            Simplify Your Life.
                        </span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-lg text-slate-400 mb-10 max-w-lg"
                    >
                        Financify is the modern, intuitive finance tracker that helps you
                        understand your spending and grow your savings effortlessly.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex gap-4 flex-wrap"
                    >
                        <button
                            onClick={openRegister}
                            className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-xl text-white font-semibold transition-transform hover:scale-105 shadow-lg shadow-indigo-600/20"
                        >
                            Get Started Free
                        </button>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative w-full h-[420px] bg-slate-800/50 rounded-2xl shadow-2xl border border-slate-700 p-4"
                >
                    <div className="w-full h-full rounded-lg bg-slate-900 p-3 flex flex-col gap-3">
                        {/* Header */}
                        <div className="flex justify-between items-center flex-shrink-0">
                            <p className="font-bold text-lg">Dashboard</p>
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                        </div>

                        {/* Mini Cards */}
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-green-500/20 p-2 rounded-lg"><p className="text-xs text-green-300">Income</p><p className="text-sm font-bold text-white">₱12,500</p></div>
                            <div className="bg-red-500/20 p-2 rounded-lg"><p className="text-xs text-red-300">Expenses</p><p className="text-sm font-bold text-white">₱4,800</p></div>
                            <div className="bg-blue-500/20 p-2 rounded-lg"><p className="text-xs text-blue-300">Balance</p><p className="text-sm font-bold text-white">₱7,700</p></div>
                        </div>

                        {/* Mini Chart & Transactions */}
                        <div className="flex-1 grid grid-cols-2 gap-3 overflow-hidden">
                            <div className="bg-slate-800/50 p-3 rounded-lg flex flex-col">
                                <p className="text-xs font-bold text-slate-300 mb-2 flex-shrink-0">Spending</p>
                                <div className="flex items-end h-full w-full gap-2">
                                    <div className="w-full bg-indigo-500 rounded-t-sm" style={{ height: '40%' }}></div>
                                    <div className="w-full bg-indigo-500 rounded-t-sm" style={{ height: '75%' }}></div>
                                    <div className="w-full bg-indigo-500 rounded-t-sm" style={{ height: '20%' }}></div>
                                    <div className="w-full bg-indigo-500 rounded-t-sm" style={{ height: '55%' }}></div>
                                </div>
                            </div>
                            <div className="bg-slate-800/50 p-3 rounded-lg flex flex-col gap-2">
                                <p className="text-xs font-bold text-slate-300 mb-1 flex-shrink-0">Recent</p>
                                <div className="flex justify-between items-center"><p className="text-xs text-white truncate">Coffee Shop</p><p className="text-xs font-mono text-red-400">-₱250</p></div>
                                <div className="flex justify-between items-center"><p className="text-xs text-white truncate">Salary</p><p className="text-xs font-mono text-green-400">+₱12,500</p></div>
                                <div className="flex justify-between items-center"><p className="text-xs text-white truncate">Groceries</p><p className="text-xs font-mono text-red-400">-₱1,200</p></div>
                                <div className="flex justify-between items-center"><p className="text-xs text-white truncate">Netflix</p><p className="text-xs font-mono text-red-400">-₱550</p></div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Features */}
            <section className="max-w-6xl mx-auto px-6 py-10">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">Everything You Need to Succeed</h2>
                    <p className="text-slate-400">
                        Financify is packed with powerful features designed to give you clarity and control.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-5 mt-8">
                {features.map((feature, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-colors"
                    >
                        {feature.icon}
                        <h3 className="text-lg font-bold mb-1">{feature.title}</h3>
                        <p className="text-slate-400">{feature.desc}</p>
                    </motion.div>
                ))}
                </div>
            </section>

        

            {/* Footer */}
            <footer className="border-t border-slate-800 py-8 text-center text-slate-500">
                © {new Date().getFullYear()} Financify. All rights reserved.
            </footer>

            {/* Modals */}
            <LoginModal isOpen={isLoginOpen} onClose={closeModals} onSwitchToRegister={openRegister} />
            <RegisterModal isOpen={isRegisterOpen} onClose={closeModals} onSwitchToLogin={openLogin} />
            </main>
        </div>
    );
}
