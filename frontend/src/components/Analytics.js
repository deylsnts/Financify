import React, { useMemo } from "react";

const CATEGORY_LABELS = {
  income: "Income",
  housing_shelter: "Housing/Shelter",
  transportation: "Transportation",
  shopping_personal_care: "Shopping/Personal Care",
  health_medical: "Health & Medical",
  entertainment: "Entertainment",
  debt_finance: "Debt & Finance",
  savings_investments: "Savings & Investments",
};

const COLORS = [
  "bg-blue-500", "bg-red-500", "bg-green-500", "bg-yellow-500", 
  "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500"
];

export default function Analytics({ transactions }) {
  const { 
    categoryBreakdown, 
    totalIncome, 
    totalExpense, 
    netSavings, 
    savingsRate,
    monthlyData,
    spendingByType
  } = useMemo(() => {
    if (!transactions.length) return { 
      categoryBreakdown: [], totalIncome: 0, totalExpense: 0, 
      netSavings: 0, savingsRate: 0, monthlyData: [], spendingByType: { needs: 0, wants: 0, savings: 0 } 
    };

    let income = 0;
    let expense = 0;
    const catMap = {};
    const monthMap = {};
    
    // 50/30/20 Rule Grouping
    let needs = 0; // Housing, Transport, Health, Debt
    let wants = 0; // Shopping, Entertainment
    let savings = 0; // Savings & Investments

    transactions.forEach((t) => {
      const amount = Number(t.amount);
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthMap[monthKey]) monthMap[monthKey] = { income: 0, expense: 0 };

      if (t.type === "income") {
        income += amount;
        monthMap[monthKey].income += amount;
      } else {
        expense += amount;
        monthMap[monthKey].expense += amount;
        catMap[t.category] = (catMap[t.category] || 0) + amount;

        // Classify for Budget Insights
        if (["housing_shelter", "transportation", "health_medical", "debt_finance"].includes(t.category)) {
          needs += amount;
        } else if (["shopping_personal_care", "entertainment"].includes(t.category)) {
          wants += amount;
        } else if (t.category === "savings_investments") {
          savings += amount;
        }
      }
    });

    const net = income - expense;
    const rate = income ? (net / income) * 100 : 0;

    // Category Breakdown List
    const breakdown = Object.entries(catMap)
      .map(([cat, amount]) => ({
        category: cat,
        amount,
        percentage: expense ? (amount / expense) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    // Monthly Trends (Last 6 months usually, but showing all for now)
    const months = Object.keys(monthMap).sort();
    const monthly = months.map(m => ({
      month: m,
      ...monthMap[m]
    }));

    return {
      categoryBreakdown: breakdown,
      totalIncome: income,
      totalExpense: expense,
      netSavings: net,
      savingsRate: rate,
      monthlyData: monthly,
      spendingByType: { needs, wants, savings }
    };
  }, [transactions]);

  const maxMonthlyVal = Math.max(...monthlyData.map(m => Math.max(m.income, m.expense)), 100);

  return (
    <div className="space-y-6 mb-6">
      {/* 1. Cash Flow Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 uppercase font-bold">Net Savings</p>
          <p className={`text-2xl font-bold ${netSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₱{netSavings.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 uppercase font-bold">Savings Rate</p>
          <p className="text-2xl font-bold text-blue-600">{savingsRate.toFixed(1)}%</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 uppercase font-bold">Needs (Fixed)</p>
          <p className="text-2xl font-bold text-gray-700">₱{spendingByType.needs.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 uppercase font-bold">Wants (Variable)</p>
          <p className="text-2xl font-bold text-gray-700">₱{spendingByType.wants.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2. Expense Breakdown */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Spending by Category</h2>
          {categoryBreakdown.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No expenses yet.</p>
          ) : (
            <div className="space-y-4">
              {categoryBreakdown.map((item, index) => (
                <div key={item.category}>
                  <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                    <span>{CATEGORY_LABELS[item.category] || item.category}</span>
                    <span>₱{item.amount.toLocaleString()} ({item.percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full ${COLORS[index % COLORS.length]}`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Monthly Trends Chart */}
        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Income vs Expense Trend</h2>
          <div className="flex-1 flex items-end justify-between space-x-2 min-h-[200px] pt-4">
            {monthlyData.length === 0 ? (
              <p className="w-full text-center text-gray-500">No data available</p>
            ) : (
              monthlyData.map((m) => (
                <div key={m.month} className="flex flex-col items-center flex-1 group">
                  <div className="flex items-end space-x-1 h-40 w-full justify-center">
                    <div style={{ height: `${(m.income / maxMonthlyVal) * 100}%` }} className="w-3 md:w-6 bg-green-400 rounded-t opacity-80 group-hover:opacity-100 transition-all" title={`Income: ₱${m.income}`}></div>
                    <div style={{ height: `${(m.expense / maxMonthlyVal) * 100}%` }} className="w-3 md:w-6 bg-red-400 rounded-t opacity-80 group-hover:opacity-100 transition-all" title={`Expense: ₱${m.expense}`}></div>
                  </div>
                  <span className="text-[10px] md:text-xs text-gray-500 mt-2 font-medium">{m.month.split('-')[1]}</span>
                </div>
              ))
            )}
          </div>
          <div className="flex justify-center gap-4 mt-4 text-xs text-gray-600">
            <div className="flex items-center"><div className="w-3 h-3 bg-green-400 rounded mr-1"></div> Income</div>
            <div className="flex items-center"><div className="w-3 h-3 bg-red-400 rounded mr-1"></div> Expense</div>
          </div>
        </div>
      </div>
    </div>
  );
}
