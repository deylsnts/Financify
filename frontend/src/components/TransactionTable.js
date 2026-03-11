// src/components/TransactionTable.js
import React, { useState, useEffect } from "react";

const CATEGORY_LABELS = {
  income: "Income",
  housing_shelter: "Housing/Shelter",
  transportation: "Transportation",
  shopping_personal_care: "Shopping/Personal Care",
  health_medical: "Health & Medical",
  entertainment: "Entertainment",
  debt_finance: "Debt & Finance",
  savings_investments: "Savings & Investments"
};

export default function TransactionTable({ transactions, onDelete, onEdit }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(transactions.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [transactions.length, totalPages, currentPage]);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 h-full flex flex-col transition-colors duration-300">
      {transactions.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400 py-10">No transactions yet.</div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{tx.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{tx.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">₱{Number(tx.amount).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {CATEGORY_LABELS[tx.category] || tx.category}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      tx.type === "income" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(tx)}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(tx.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

          {/* Mobile Card View (PWA Friendly) */}
          <div className="md:hidden space-y-4">
            {currentTransactions.map((tx) => (
              <div key={tx.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-100 dark:border-gray-600 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">{tx.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{tx.date}</p>
                  </div>
                  <span className={`text-sm font-bold ${
                    tx.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  }`}>
                    {tx.type === "income" ? "+" : "-"}₱{Number(tx.amount).toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                    {CATEGORY_LABELS[tx.category] || tx.category}
                  </span>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => onEdit(tx)}
                      className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => onDelete(tx.id)}
                      className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
