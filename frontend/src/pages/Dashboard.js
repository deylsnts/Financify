import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import DashboardCards from "../components/DashboardCards";
import TransactionForm from "../components/TransactionForm";
import Analytics from "../components/Analytics";
import AIInsights from "../components/AIInsights";
import TransactionTable from "../components/TransactionTable";

const API_URL = process.env.REACT_APP_API_URL || "";

export default function Dashboard() {
  const [summary, setSummary] = useState({ income: 0, expenses: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const token = localStorage.getItem("access");

  // Fetch dashboard data
  const fetchData = async () => {
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const summaryRes = await axios.get(`${API_URL}/api/dashboard/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(summaryRes.data);

      const transactionsRes = await axios.get(
        `${API_URL}/api/transactions/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTransactions(transactionsRes.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch dashboard data. Please login again.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddTransaction = (newTransaction) => {
    setTransactions([...transactions, newTransaction]);
    fetchData(); // refresh summary
  };

  const handleUpdateTransaction = (updatedTransaction) => {
    setTransactions(
      transactions.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
    );
    setEditingTransaction(null);
    fetchData(); // refresh summary
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;

    try {
      await axios.delete(`${API_URL}/api/transactions/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(transactions.filter((t) => t.id !== id));
      fetchData(); // refresh summary
    } catch (err) {
      console.error(err);
      alert("Failed to delete transaction.");
    }
  };

  // Filter transactions based on selected range
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter((t) => {
      const tDate = new Date(t.date);
      if (filter === "weekly") {
        const date = new Date();
        date.setDate(now.getDate() - 7);
        return tDate >= date;
      }
      if (filter === "monthly") {
        const date = new Date();
        date.setMonth(now.getMonth() - 1);
        return tDate >= date;
      }
      if (filter === "yearly") {
        const date = new Date();
        date.setFullYear(now.getFullYear() - 1);
        return tDate >= date;
      }
      return true;
    });
  }, [transactions, filter]);

  // Calculate summary based on filtered transactions
  const filteredSummary = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const expenses = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    return {
      income,
      expenses,
      balance: income - expenses
    };
  }, [filteredTransactions]);

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here is your financial overview.</p>
        </div>
        <div className="flex bg-white rounded-lg shadow-sm p-1 border border-gray-200">
          {["all", "weekly", "monthly", "yearly"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <DashboardCards {...filteredSummary} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
        {/* Left Column: Analytics & Insights */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              Analytics & Trends
            </h2>
            <Analytics transactions={filteredTransactions} />
          </div>
          
          <AIInsights transactions={transactions} />
        </div>

        {/* Right Column: Transactions */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              {editingTransaction ? "Edit Transaction" : "New Transaction"}
            </h2>
            <TransactionForm
              onAdd={handleAddTransaction}
              onUpdate={handleUpdateTransaction}
              editingTransaction={editingTransaction}
              setEditingTransaction={setEditingTransaction}
            />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              Recent Transactions
            </h2>
            <TransactionTable transactions={filteredTransactions} onDelete={handleDeleteTransaction} onEdit={setEditingTransaction} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
