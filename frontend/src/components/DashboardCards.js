// src/components/DashboardCards.js
import React from "react";

export default function DashboardCards({ income, expenses, balance, theme = "dark" }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <Card
        title="Income"
        value={income}
        accent="emerald"
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
        accent="rose"
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
        accent="indigo"
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

const ACCENTS = {
  emerald: {
    iconBg: "bg-emerald-100 dark:bg-emerald-500/15",
    iconText: "text-emerald-600 dark:text-emerald-400",
    ring: "hover:border-emerald-300 dark:hover:border-emerald-500/40",
    valueText: "text-gray-900 dark:text-white",
  },
  rose: {
    iconBg: "bg-rose-100 dark:bg-rose-500/15",
    iconText: "text-rose-600 dark:text-rose-400",
    ring: "hover:border-rose-300 dark:hover:border-rose-500/40",
    valueText: "text-gray-900 dark:text-white",
  },
  indigo: {
    iconBg: "bg-indigo-100 dark:bg-indigo-500/15",
    iconText: "text-indigo-600 dark:text-indigo-400",
    ring: "hover:border-indigo-300 dark:hover:border-indigo-500/40",
    valueText: "text-gray-900 dark:text-white",
  },
};

function Card({ title, value, accent, icon, theme }) {
  const a = ACCENTS[accent];
  const amount = Number(value);

  return (
    <div
      className={`group relative p-6 rounded-2xl border bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${a.ring}`}
    >
      <div className="flex justify-between items-start">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wide">{title}</p>
          <h3 className={`text-2xl sm:text-3xl font-extrabold mt-1.5 tabular-nums truncate ${a.valueText}`}>
            ₱{amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </h3>
        </div>
        <div className={`p-2.5 rounded-xl shrink-0 ${a.iconBg}`}>
          <svg className={`w-5 h-5 ${a.iconText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {icon}
          </svg>
        </div>
      </div>
    </div>
  );
}
