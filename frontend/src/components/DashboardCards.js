// src/components/DashboardCards.js
import React from "react";

export default function DashboardCards({ income, expenses, balance, theme = "dark" }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card
        title="Income"
        value={income}
        color="green"
        icon={
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 11l5-5m0 0l5 5m-5-5v12"
          />
        }
        theme={theme}
      />
      <Card
        title="Expenses"
        value={expenses}
        color="red"
        icon={
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 13l-5 5m0 0l-5-5m5 5V6"
          />
        }
        theme={theme}
      />
      <Card
        title="Balance"
        value={balance}
        color="blue"
        icon={
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        }
        theme={theme}
      />
    </div>
  );
}

function Card({ title, value, color, icon, theme }) {
  const colors = {
    green: theme === "dark" ? "from-green-500 to-emerald-600" : "from-green-400 to-green-500",
    red: theme === "dark" ? "from-red-500 to-rose-600" : "from-red-400 to-red-500",
    blue: theme === "dark" ? "from-blue-500 to-indigo-600" : "from-blue-400 to-blue-500",
  };

  const textColor = theme === "dark" ? "text-white" : "text-gray-900";
  const bgOpacity = theme === "dark" ? "bg-opacity-20" : "bg-opacity-10";

  return (
    <div
      className={`p-6 rounded-2xl shadow-lg ${textColor} bg-gradient-to-br ${colors[color]} transform transition hover:scale-105 duration-200`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium opacity-90">{title}</p>
          <h3 className="text-3xl font-bold mt-1">₱{Number(value).toLocaleString()}</h3>
        </div>
        <div
          className={`p-3 rounded-lg ${bgOpacity} ${theme === "dark" ? "bg-white/20" : "bg-gray-200/20"}`}
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {icon}
          </svg>
        </div>
      </div>
    </div>
  );
}
