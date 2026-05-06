import React, { useEffect, useState } from "react";
import axios from "../../../config/axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchBanks } from "../../../redux/feature/BankRedux/BankThunx";
import { 
  TrendingUp, 
  TrendingDown, 
  IndianRupee, 
  Landmark, 
  ArrowRight,
  Activity,
  ChevronRight,
  MoreHorizontal
} from "lucide-react";
import { 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const AccountantDashboard = () => {
  const dispatch = useDispatch();
  const { banks = [] } = useSelector((s) => s.bank);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, net: 0 });
  const [loading, setLoading] = useState(true);

  const activeBanks = banks.filter((b) => b.isActive);

  useEffect(() => {
    dispatch(fetchBanks());
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      const res = await axios.get("/api/IncomeExpenseReport/balance-sheet");
      setSummary(res.data || { totalIncome: 0, totalExpense: 0, net: 0 });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const comparisonData = [
    { name: "Income", amount: summary.totalIncome, color: "#4f46e5" },
    { name: "Expense", amount: summary.totalExpense, color: "#f43f5e" },
    { name: "Net", amount: summary.net, color: "#10b981" },
  ];

  const bankData = activeBanks.map(bank => ({
    name: bank.bankName,
    value: bank.balance || 0
  })).slice(0, 4);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  // Handle completely empty pie chart case
  const totalBalance = bankData.reduce((acc, curr) => acc + curr.value, 0);
  const pieChartData = totalBalance > 0 
    ? bankData 
    : [{ name: "No Balance Added", value: 1, isEmpty: true }];

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-4 pb-8 space-y-6">
      
      {/* 📊 High-Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Income" value={summary.totalIncome} icon={<TrendingUp size={20} />} color="blue" />
        <MetricCard title="Total Expense" value={summary.totalExpense} icon={<TrendingDown size={20} />} color="rose" />
        <MetricCard title="Net Balance" value={summary.net} icon={<IndianRupee size={20} />} color="emerald" />
        <MetricCard title="Active Banks" value={activeBanks.length} icon={<Landmark size={20} />} color="indigo" isCount />
      </div>

      {/* 📉 Unified Analytics Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-800">Financial Analytics</h3>
            <p className="text-xs text-slate-500 mt-0.5">Income vs Expense & Bank Distribution</p>
          </div>
          <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={20} /></button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          
          {/* Bar Chart Area */}
          <div className="p-4 lg:col-span-2">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barCategoryGap="25%">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 11 }} 
                    tickFormatter={(value) => `₹${value >= 1000 ? (value/1000).toFixed(0) + 'k' : value}`}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [`₹ ${value.toLocaleString()}`, 'Amount']}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={55}>
                    {comparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart Area */}
          <div className="p-4 bg-slate-50/30 flex flex-col items-center">
            <h4 className="text-sm font-semibold text-slate-700 w-full mb-2">Bank Balances</h4>
            <div className="flex-1 w-full flex flex-col items-center justify-center relative">
              
              {/* Inner Label for Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-6">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
                <span className="text-sm font-black text-slate-800">₹{totalBalance >= 1000 ? (totalBalance/1000).toFixed(1) + 'k' : totalBalance}</span>
              </div>

              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={totalBalance > 0 ? 4 : 0}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.isEmpty ? "#e2e8f0" : COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    {totalBalance > 0 && (
                      <Tooltip 
                        formatter={(value) => `₹ ${value.toLocaleString()}`}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                      />
                    )}
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Legend Area */}
              <div className="w-full grid grid-cols-2 gap-y-4 gap-x-2 mt-4 px-2">
                {bankData.map((bank, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0 mt-1" style={{ background: COLORS[i % COLORS.length] }}></div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-700 leading-tight">{bank.name}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">₹ {bank.value.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 📑 Primary Bank Accounts Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800">Primary Bank Accounts</h3>
            <p className="text-xs text-slate-500 mt-0.5">Overview of active bank balances</p>
          </div>
          <button className="text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
            Manage Banks <ChevronRight size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Bank Detail</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Account Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Current Balance</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeBanks.length > 0 ? activeBanks.slice(0, 5).map((bank, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                        <Landmark size={18} />
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 text-sm block">{bank.bankName}</span>
                        <span className="text-xs text-slate-400 font-medium">{bank.accountNumber || "No AC Provided"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-600 text-sm font-medium">{bank.accountType || "Savings"}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-black text-slate-900 text-base">₹ {bank.balance?.toLocaleString() || 0}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400 text-sm">No active accounts found. Please add a bank account to see it here.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon, color, isCount = false }) => {
  const themes = {
    blue: "text-indigo-600 border-indigo-100 bg-indigo-50/50",
    rose: "text-rose-600 border-rose-100 bg-rose-50/50",
    emerald: "text-emerald-600 border-emerald-100 bg-emerald-50/50",
    indigo: "text-slate-600 border-slate-200 bg-slate-50/50"
  };

  const theme = themes[color] || themes.indigo;

  return (
    <div className={`bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow transition-shadow group cursor-default`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{title}</p>
        <div className={`p-2 rounded-lg ${theme} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
      <h2 className="text-2xl font-black text-slate-900 mt-1">
        {!isCount && <span className="text-base font-semibold text-slate-400 mr-1">₹</span>}
        {value.toLocaleString()}
      </h2>
    </div>
  );
};

export default AccountantDashboard;