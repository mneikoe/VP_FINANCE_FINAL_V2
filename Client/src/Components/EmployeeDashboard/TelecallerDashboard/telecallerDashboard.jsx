import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import UnifiedNavbar from "../../Dashbord/UnifiedNavbar";
import { telecallerMenuConfig } from "../../../config/menuConfigs";

const TelecallerPanel = () => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("dashboard")) return "Dashboard";
    if (path.includes("suspect/add")) return "Add Suspect";
    if (path.includes("balance-leads")) return "Balance Leads";
    if (path.includes("calling-done")) return "Calling Done";
    if (path.includes("appointments")) return "Appointments";
    return "Telecaller Panel";
  };

  return (
    <div className="min-h-screen bg-slate-50 font-outfit">
      <UnifiedNavbar role="Telecaller" menuConfig={telecallerMenuConfig} />
      
      <main className="relative z-0 p-4 lg:p-8 animate-in fade-in duration-500">
        <div className="mx-auto max-w-[1920px]">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 lg:text-3xl">
              {getPageTitle()}
            </h1>
            <div className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Telecaller <span className="mx-2 text-slate-300">/</span> {getPageTitle()}
            </div>
          </div>
          
          <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
            <Outlet key={location.pathname} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TelecallerPanel;
