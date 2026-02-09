export default function DashboardCards({ income, expenses, balance, theme }) {
  const cardBg = theme === "dark" ? "bg-gradient-to-br text-white" : "";
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card title="Income" value={income} color="green" theme={theme} />
      <Card title="Expenses" value={expenses} color="red" theme={theme} />
      <Card title="Balance" value={balance} color="blue" theme={theme} />
    </div>
  );
}

function Card({ title, value, color, theme }) {
  const colors = {
    green: "from-green-500 to-emerald-600",
    red: "from-red-500 to-rose-600",
    blue: "from-blue-500 to-indigo-600",
  };

  return (
    <div
      className={`p-6 rounded-2xl shadow-lg transform transition hover:scale-105 duration-200 ${
        theme === "dark" ? `bg-gradient-to-br ${colors[color]} text-white` : "bg-white text-gray-900"
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium opacity-90">{title}</p>
          <h3 className="text-3xl font-bold mt-1">
            ₱{value.toLocaleString()}
          </h3>
        </div>
        <div className="p-3 bg-white bg-opacity-20 rounded-xl shadow-inner">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {/* You can add icon paths here */}
          </svg>
        </div>
      </div>
    </div>
  );
}
