// src/components/DashboardCards.js
import React from "react";

export default function DashboardCards({ income, expenses, balance }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card 
        title="Income" 
        value={income} 
        color="green" 
        icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />} 
      />
      <Card 
        title="Expenses" 
        value={expenses} 
        color="red" 
        icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />} 
      />
      <Card 
        title="Balance" 
        value={balance} 
        color="blue" 
        icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />} 
      />
    </div>
  );
}

function Card({ title, value, color, icon }) {
  const colors = {
    green: "from-green-500 to-emerald-600",
    red: "from-red-500 to-rose-600",
    blue: "from-blue-500 to-indigo-600",
  };

  return (
    <div className={`p-6 rounded-2xl shadow-lg text-white bg-gradient-to-br ${colors[color]} transform transition hover:scale-105 duration-200`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium opacity-90">{title}</p>
          <h3 className="text-3xl font-bold mt-1">₱{value.toLocaleString()}</h3>
        </div>
        <div className="p-2 bg-white bg-opacity-20 rounded-lg">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {icon}
          </svg>
        </div>
      </div>
    </div>
  );
}
