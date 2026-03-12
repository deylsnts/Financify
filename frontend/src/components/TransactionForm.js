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

const API_URL = process.env.REACT_APP_API_URL || "";

export default function TransactionForm({ onAdd, onUpdate, editingTransaction, setEditingTransaction }) {
  const now = new Date();
  const maxDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    date: maxDate,
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
        date: maxDate,
        category: "",
      });
    }
  }, [editingTransaction]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form Validation: Ensure Type and Category match
    if (form.type === "income" && form.category !== "income") {
      alert("Income transactions must use the 'Income' category.");
      return;
    }
    if (form.type === "expense" && form.category === "income") {
      alert("Expense transactions cannot use the 'Income' category.");
      return;
    }

    if (form.date > maxDate) {
      alert("Date cannot be in the future.");
      return;
    }

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
          date: maxDate,
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
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 sm:p-7 border border-gray-100 dark:border-gray-700 transition-colors duration-300"
    >
      <div className="space-y-5">

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Title
          </label>
          <input
            placeholder="Example: Grocery Shopping"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="w-full text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Amount
          </label>
          <input
            type="number"
            inputMode="decimal"
            placeholder="0.00"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
            className="w-full text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => {
              const newCategory = e.target.value;
              let newType = form.type;

              if (newCategory === "income") newType = "income";
              else if (newCategory !== "") newType = "expense";

              setForm({ ...form, category: newCategory, type: newType });
            }}
            required
            className="w-full text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          >
            <option value="">Select Category</option>
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Date
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
            max={maxDate}
            className="w-full text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Type
          </label>
          <select
            value={form.type}
            onChange={(e) => {
              const newType = e.target.value;
              let newCategory = form.category;

              if (newType === "income") newCategory = "income";
              else if (newType === "expense" && newCategory === "income") newCategory = "";

              setForm({ ...form, type: newType, category: newCategory });
            }}
            className="w-full text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-7">
        <button
          className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-md"
        >
          {editingTransaction ? "Update Transaction" : "Add Transaction"}
        </button>

        {editingTransaction && (
          <button
            type="button"
            onClick={() => setEditingTransaction(null)}
            className="flex-1 bg-gray-400 text-white py-3 rounded-xl font-semibold hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
