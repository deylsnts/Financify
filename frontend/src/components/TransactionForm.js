import { useState, useEffect } from "react";
import axios from "axios";

const CATEGORY_OPTIONS = [
  { value: "income", label: "Income" },
  { value: "housing_shelter", label: "Housing/Shelter" },
  { value: "transportation", label: "Transportation" },
  { value: "shopping_personal_care", label: "Shopping/Personal Care" },
  { value: "health_medical", label: "Health & Medical" },
  { value: "entertainment", label: "Entertainment" },
  { value: "debt_finance", label: "Debt & Finance" },
  { value: "savings_investments", label: "Savings & Investments" }
];

const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

export default function TransactionForm({ onAdd, onUpdate, editingTransaction, setEditingTransaction }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    date: new Date().toISOString().split("T")[0],
    category: "",
  });

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        title: editingTransaction.title,
        amount: editingTransaction.amount,
        type: editingTransaction.type,
        date: editingTransaction.date,
        category: editingTransaction.category,
      });
    } else {
      setForm({
        title: "",
        amount: "",
        type: "expense",
        date: new Date().toISOString().split("T")[0],
        category: "",
      });
    }
  }, [editingTransaction]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access");
    if (!token) {
      alert("You must be logged in!");
      return;
    }

    // Helper to extract user_id from JWT token
    const getUserId = (token) => {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.user_id;
      } catch (e) {
        return null;
      }
    };

    try {
      if (editingTransaction) {
        const response = await axios.put(
          `${API_URL}/api/transactions/${editingTransaction.id}/`,
          {
            ...form,
            amount: parseFloat(form.amount),
            user: getUserId(token),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        onUpdate(response.data);
      } else {
        const response = await axios.post(
          `${API_URL}/api/transactions/`,
          {
            ...form,
            amount: parseFloat(form.amount),
            user: getUserId(token), // Send user ID extracted from token
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        onAdd(response.data); // Add to frontend state
        setForm({
          title: "",
          amount: "",
          date: new Date().toISOString().split("T")[0],
          type: "expense",
          category: "",
        });
      }

    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        alert("Session expired. Please login again.");
      } else {
        // Show the actual error from backend (e.g., missing fields)
        alert(
          JSON.stringify(err.response?.data) ||
            "Failed to add transaction. Please check your input."
        );
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl p-6 h-fit">
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
        />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
        <input
          type="number"
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        >
          <option value="">Select Category</option>
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="date"
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
        <select
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button className="flex-1 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm">
          {editingTransaction ? "Update" : "Add"}
        </button>
        {editingTransaction && (
          <button
            type="button"
            onClick={() => setEditingTransaction(null)}
            className="flex-1 bg-gray-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-600 transition shadow-sm"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
