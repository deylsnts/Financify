import { useState, useEffect } from "react";
import axios from "axios";

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
          `http://127.0.0.1:8000/api/transactions/${editingTransaction.id}/`,
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
          "http://127.0.0.1:8000/api/transactions/",
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
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-xl p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">{editingTransaction ? "Edit Transaction" : "Add Transaction"}</h2>

      <div className="grid md:grid-cols-3 gap-4">
        <input
          className="border p-2 rounded"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          type="number"
          className="border p-2 rounded"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />
        <input
          className="border p-2 rounded"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
        <select
          className="border p-2 rounded"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div className="flex gap-2 mt-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {editingTransaction ? "Update" : "Add"}
        </button>
        {editingTransaction && (
          <button
            type="button"
            onClick={() => setEditingTransaction(null)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
