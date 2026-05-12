import React from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import UnifiedNavbar from "../../Dashbord/UnifiedNavbar";
import { accountantMenuConfig } from "../../../config/menuConfigs";

const AccountantLayout = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const location = useLocation();

  if (!token || !user || user.role !== "Accountant") {
    return <Navigate to="/auth/login" replace />;
  }

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("dashboard")) return "Dashboard";
    if (path.includes("salary")) return "Salary Management";
    if (path.includes("incentive")) return "Incentives";
    if (path.includes("banks")) return "Transaction Master";
    if (path.includes("reports")) return "Financial Reports";
    return "Accountant Dashboard";
  };

  return (
    <div className="min-h-screen bg-slate-50 font-outfit">
      <UnifiedNavbar role="Accountant" menuConfig={accountantMenuConfig} />
      
      <main className="relative z-0 p-4 lg:p-8 animate-in fade-in duration-500">
        <div className="mx-auto max-w-[1920px]">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 lg:text-3xl">
                {getPageTitle()}
              </h1>
              <p className="text-sm font-medium text-slate-500 mt-1">
                Managing financial operations and records.
              </p>
            </div>
            <div className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Accountant <span className="mx-2 text-slate-300">/</span> {getPageTitle()}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountantLayout;