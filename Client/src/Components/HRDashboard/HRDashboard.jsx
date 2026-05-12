import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ConfigProvider } from "antd";
import UnifiedNavbar from "../Dashbord/UnifiedNavbar";
import { hrMenuConfig } from "../../config/menuConfigs";

// Import HR Dashboard Components
import HRDashboardHome from "./HRDashboardHome.jsx";
import Analytics from "./modules/Analytics.jsx";
import BusinessAssociates from "./modules/BusinessAssociates.jsx";
import VacancyManagement from "./modules/VacancyManagement.jsx";
import AddCandidate from "./modules/AddCandidate.jsx";
import CareerEnquiry from "./modules/CareerEnquiry.jsx";
import ResumeShortlist from "./modules/ResumeShortlist.jsx";
import InterviewProcess from "./modules/InterviewProcess.jsx";
import JoiningData from "./modules/JoiningData.jsx";
import AddEmployeeFromCandidates from "./modules/AddEmployeeFromCandidates.jsx";
import InternshipStudents from "./modules/InternshipStudents.jsx";
import RulesRegulations from "./modules/RulesRegulations.jsx";
import FuturePlans from "./modules/FuturePlans.jsx";
import HRActions from "./modules/HRActions.jsx";

// Import Employee Management Components
import EmployeeList from "../Employee/OfficeAdmin/EmployeeList";
import EmployeeDetails from "../Employee/OfficeAdmin/EmployeeDetails";

const HRDashboard = () => {
  const location = useLocation();

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#f27405",
          borderRadius: 12,
          fontFamily: "'Outfit', sans-serif",
        },
      }}
    >
      <div className="min-h-screen bg-slate-50 font-outfit">
        <UnifiedNavbar role="HR" menuConfig={hrMenuConfig} />
        
        <main className="relative z-0 p-4 lg:p-8 animate-in fade-in duration-500">
          <div className="mx-auto max-w-[1920px]">
            <Routes>
              {/* Default Dashboard Route */}
              <Route path="/" element={<HRDashboardHome />} />
              <Route path="/home" element={<HRDashboardHome />} />

              {/* HR Module Routes */}
              <Route path="/vacancies" element={<VacancyManagement />} />
              <Route path="/add-candidate" element={<AddCandidate />} />
              <Route path="/career-enquiry" element={<CareerEnquiry />} />
              <Route path="/resume-shortlist" element={<ResumeShortlist />} />
              <Route path="/interview-process" element={<InterviewProcess />} />
              <Route path="/joining-data" element={<JoiningData />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/business-associates" element={<BusinessAssociates />} />
              <Route
                path="/add-employee-from-candidates"
                element={<AddEmployeeFromCandidates />}
              />

              {/* New Routes for Business Associates */}
              <Route path="/internship-students" element={<InternshipStudents />} />
              <Route path="/rules-regulations" element={<RulesRegulations />} />
              <Route path="/future-plans" element={<FuturePlans />} />
              <Route path="/hr-actions" element={<HRActions />} />

              {/* Employee Management Routes */}
              <Route path="/all-employee" element={<EmployeeList />} />
              <Route path="/employee/:id" element={<EmployeeDetails />} />

              {/* Catch all route - redirect to dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </ConfigProvider>
  );
};

export default HRDashboard;
