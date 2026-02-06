import React, { useState, useMemo } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

export default function AIInsights({ transactions }) {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1. Local Analysis (Instant Feedback without API)
  const stats = useMemo(() => {
    if (transactions.length === 0) return null;

    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    // Calculate previous month key
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthKey = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;

    const currentMonthTx = transactions.filter(t => t.date.startsWith(currentMonthKey) && t.type === 'expense');
    const lastMonthTx = transactions.filter(t => t.date.startsWith(lastMonthKey) && t.type === 'expense');

    // Group by category
    const groupByCategory = (txs) => {
      return txs.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
        return acc;
      }, {});
    };

    const currentCat = groupByCategory(currentMonthTx);
    const lastCat = groupByCategory(lastMonthTx);

    // Find top category this month
    let topCategory = null;
    let maxAmount = 0;
    for (const [cat, amount] of Object.entries(currentCat)) {
      if (amount > maxAmount) {
        maxAmount = amount;
        topCategory = cat;
      }
    }

    if (!topCategory) return null;

    const lastMonthAmount = lastCat[topCategory] || 0;
    const percentChange = lastMonthAmount === 0 
      ? 100 
      : ((maxAmount - lastMonthAmount) / lastMonthAmount) * 100;

    return {
      topCategory,
      currentAmount: maxAmount,
      percentChange: percentChange.toFixed(0),
      isHigher: percentChange > 0
    };
  }, [transactions]);

  // 2. AI Analysis (Calls Backend)
  const generateAIInsights = async () => {
    setLoading(true);
    setError("");
    setInsight("");

    try {
      const token = localStorage.getItem("access");
      
      // Prepare a summary to send to the AI (saves tokens)
      const summaryData = {
        total_income: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0),
        total_expense: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0),
        top_category: stats ? stats.topCategory : "N/A",
        recent_transactions: transactions.slice(0, 5) // Context for the AI
      };

      // NOTE: You need to implement this endpoint in your Django backend
      const response = await axios.post(
        `${API_URL}/api/ai-insights/`, 
        summaryData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setInsight(response.data.insight);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to generate insights. Make sure your backend AI endpoint is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 border border-gray-100">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">AI Financial Insights</h2>
        </div>

        {/* Local Stat (Instant) */}
        {stats && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-gray-700">
                    You spent <span className={`font-bold ${stats.isHigher ? 'text-red-600' : 'text-green-600'}`}>
                        {Math.abs(stats.percentChange)}% {stats.isHigher ? 'more' : 'less'}
                    </span> on <span className="font-semibold capitalize">{stats.topCategory.replace('_', ' ')}</span> compared to last month.
                </p>
            </div>
        )}

        {/* AI Button & Result */}
        {!insight && !loading && (
            <button 
                onClick={generateAIInsights}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transform transition hover:-translate-y-0.5"
            >
                Generate Smart Advice 🤖
            </button>
        )}

        {loading && (
            <div className="flex items-center justify-center py-4 space-x-2 text-purple-600 animate-pulse">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyzing your spending patterns...</span>
            </div>
        )}

        {error && (
             <p className="text-red-500 text-sm text-center mt-4">{error}</p>
        )}

        {insight && (
            <div className="mt-4 p-5 bg-purple-50 rounded-xl border border-purple-100 relative">
                <h3 className="text-sm font-bold text-purple-800 uppercase mb-2 tracking-wide">AI Recommendation</h3>
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">{insight}</p>
                <button onClick={() => setInsight("")} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                    ✕
                </button>
            </div>
        )}
    </div>
  );
}