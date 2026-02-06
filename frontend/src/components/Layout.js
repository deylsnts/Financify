import { useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow p-4 flex justify-between">
        <h1 className="text-xl font-bold text-gray-800">
          Finance Tracker
        </h1>

        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </nav>

      {/* Content */}
      <main className="p-6 max-w-6xl mx-auto">
        {children}
      </main>
    </div>
  );
}
