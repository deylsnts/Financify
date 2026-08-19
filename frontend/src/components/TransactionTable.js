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

export default function TransactionTable({ transactions, onDelete, onEdit, theme, searchTerm, setSearchTerm }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const itemsPerPage = 5;

  const filteredTransactions = transactions.filter(tx => {
    const searchLower = searchTerm.toLowerCase();
    return tx.title.toLowerCase().includes(searchLower) || tx.category.toLowerCase().includes(searchLower);
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredTransactions.length, totalPages, currentPage]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 h-full flex flex-col transition-colors duration-300">
      {transactions.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400 py-10">No transactions yet.</div>
      ) : (
        <>
          {/* Desktop Table View */}
            {/* Search Bar */}
            <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className={`h-5 w-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 block w-full shadow-sm sm:text-sm rounded-xl py-2.5 outline-none ring-2 ring-transparent focus-visible:ring-indigo-500 transition-all dark:bg-slate-800 dark:text-white dark:placeholder-gray-400"
                />
            </div>
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
              {filteredTransactions.slice(indexOfFirstItem, indexOfLastItem).map((tx) => (
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
                    {confirmId === tx.id ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-400 text-xs">Delete?</span>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          disabled={deletingId === tx.id}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 rounded disabled:opacity-50"
                        >
                          {deletingId === tx.id ? "Deleting…" : "Confirm"}
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 rounded"
                        >
                          Cancel
                        </button>
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => onEdit(tx)}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setConfirmId(tx.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 rounded"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

          {/* Mobile Card View (PWA Friendly) */}
          <div className="md:hidden space-y-4">
            {filteredTransactions.slice(indexOfFirstItem, indexOfLastItem).map((tx) => (
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
                    {confirmId === tx.id ? (
                      <>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          disabled={deletingId === tx.id}
                          className="text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-800 disabled:opacity-50"
                        >
                          {deletingId === tx.id ? "Deleting…" : "Confirm"}
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => onEdit(tx)}
                          className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setConfirmId(tx.id)}
                          className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                Previous
              </button>
              
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
              >
                Next
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
