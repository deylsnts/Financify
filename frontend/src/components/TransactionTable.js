// src/components/TransactionTable.js
import React, { useState, useEffect } from "react";

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
    <div className="bg-white shadow rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-4">Transactions</h2>
      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions yet.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Title</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Amount</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Type</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="px-4 py-2">{tx.title}</td>
                  <td className="px-4 py-2">₱{tx.amount}</td>
                  <td
                    className={`px-4 py-2 font-semibold ${
                      tx.type === "income" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => onEdit(tx)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(tx.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
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
