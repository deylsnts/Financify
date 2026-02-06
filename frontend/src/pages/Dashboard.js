import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import DashboardCards from "../components/DashboardCards";
import TransactionForm from "../components/TransactionForm";
import TransactionTable from "../components/TransactionTable";

export default function Dashboard() {
  const [summary, setSummary] = useState({ income: 0, expenses: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("access");

  // Fetch dashboard data
  const fetchData = async () => {
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const summaryRes = await axios.get("http://127.0.0.1:8000/api/dashboard/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(summaryRes.data);

      const transactionsRes = await axios.get(
        "http://127.0.0.1:8000/api/transactions/",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTransactions(transactionsRes.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch dashboard data. Please login again.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddTransaction = (newTransaction) => {
    setTransactions([...transactions, newTransaction]);
    fetchData(); // refresh summary
  };

  const handleUpdateTransaction = (updatedTransaction) => {
    setTransactions(
      transactions.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
    );
    setEditingTransaction(null);
    fetchData(); // refresh summary
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/transactions/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(transactions.filter((t) => t.id !== id));
      fetchData(); // refresh summary
    } catch (err) {
      console.error(err);
      alert("Failed to delete transaction.");
    }
  };

  return (
    <Layout>
      <DashboardCards {...summary} />

      <TransactionForm
        onAdd={handleAddTransaction}
        onUpdate={handleUpdateTransaction}
        editingTransaction={editingTransaction}
        setEditingTransaction={setEditingTransaction}
      />

      <TransactionTable transactions={transactions} onDelete={handleDeleteTransaction} onEdit={setEditingTransaction} />
    </Layout>
  );
}
