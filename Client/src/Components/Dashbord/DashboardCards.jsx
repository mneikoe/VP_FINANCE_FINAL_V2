import React from "react";
import { 
  FiUsers, 
  FiUserMinus, 
  FiUserCheck, 
  FiUserX, 
  FiUserPlus, 
  FiClock,
  FiTrendingUp,
  FiTrendingDown
} from "react-icons/fi";

const cardsData = [
  {
    title: "New Registrations",
    value: 1587,
    icon: FiUserPlus,
    color: "var(--primary-orange)",
    bgColor: "bg-orange-50",
    trend: "+12.5%",
    trendUp: true,
  },
  {
    title: "Discontinued Accounts",
    value: 782,
    icon: FiUserMinus,
    color: "#ef4444",
    bgColor: "bg-red-50",
    trend: "-3.2%",
    trendUp: false,
  },
  {
    title: "Active Accounts",
    value: 15,
    icon: FiUserCheck,
    color: "#22c55e",
    bgColor: "bg-green-50",
    trend: "+5.1%",
    trendUp: true,
  },
  {
    title: "Inactive Accounts",
    value: 1890,
    icon: FiClock,
    color: "#f59e0b",
    bgColor: "bg-amber-50",
    trend: "-1.8%",
    trendUp: false,
  },
  {
    title: "Suspect Leads",
    value: 1890,
    icon: FiUsers,
    color: "var(--secondary-navy)",
    bgColor: "bg-slate-50",
    trend: "+8.3%",
    trendUp: true,
  },
  {
    title: "Pending Tasks",
    value: 1890,
    icon: FiTrendingUp,
    color: "#06b6d4",
    bgColor: "bg-cyan-50",
    trend: "+15.2%",
    trendUp: true,
  },
];

const DashboardCards = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 font-outfit">
      {cardsData.map((card, index) => (
        <div 
          key={index}
          className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-100 ring-1 ring-slate-100"
        >
          {/* Subtle Background Icon Accent */}
          <div className="absolute -right-4 -top-4 text-slate-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <card.icon size={80} />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.bgColor} transition-colors group-hover:bg-orange-500 group-hover:text-white`}>
                <card.icon size={22} className="transition-colors" style={{ color: card.color === 'var(--primary-orange)' ? undefined : card.color }} />
              </div>
              <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold ${card.trendUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                {card.trendUp ? <FiTrendingUp size={10} /> : <FiTrendingDown size={10} />}
                {card.trend}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">
                {card.title}
              </p>
              <h3 className="text-3xl font-black tracking-tight text-slate-900">
                {card.value.toLocaleString()}
              </h3>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <div className="h-1 w-full rounded-full bg-slate-100 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-orange-500 transition-all duration-500" 
                  style={{ width: card.trendUp ? '70%' : '30%' }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;