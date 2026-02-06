// src/components/DashboardCards.js
import React from "react";

export default function DashboardCards({ income, expenses, balance }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card title="Income" value={income} color="green" />
      <Card title="Expenses" value={expenses} color="red" />
      <Card title="Balance" value={balance} color="blue" />
    </div>
  );
}

function Card({ title, value, color }) {
  const colors = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-blue-100 text-blue-700",
  };

  return (
    <div className={`p-6 rounded-xl shadow ${colors[color]}`}>
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="text-2xl font-bold mt-2">₱{value}</p>
    </div>
  );
}

