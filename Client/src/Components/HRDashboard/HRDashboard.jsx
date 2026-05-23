import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ConfigProvider, Layout } from "antd";
import HRSidebar from "./HRSidebar";
import HRTopBar from "./HRTopBar";

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

const { Content } = Layout;

const HRDashboard = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const siderWidth = collapsed ? 72 : 260;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#f27405",
          borderRadius: 10,
          fontFamily: "'Inter', 'Outfit', sans-serif",
        },
      }}
    >
      <Layout style={{ minHeight: "100vh", background: "#f8fafc" }}>
        {/* ── Collapsible Sidebar ────────────────────────────── */}
        <HRSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* ── Main area pushed right by sidebar width ─────────── */}
        <Layout
          style={{
            marginLeft: siderWidth,
            transition: "margin-left 0.25s ease",
            background: "#f8fafc",
            minHeight: "100vh",
          }}
        >
          {/* ── Sticky Top Bar ─────────────────────────────────── */}
          <HRTopBar collapsed={collapsed} setCollapsed={setCollapsed} />

          {/* ── Page Content ───────────────────────────────────── */}
          <Content
            style={{
              padding: "24px",
              minHeight: "calc(100vh - 56px)",
            }}
          >
            <Routes>
              {/* Default */}
              <Route path="/" element={<HRDashboardHome />} />
              <Route path="/home" element={<HRDashboardHome />} />

              {/* Recruitment */}
              <Route path="/vacancies" element={<VacancyManagement />} />
              <Route path="/add-candidate" element={<AddCandidate />} />
              <Route path="/career-enquiry" element={<CareerEnquiry />} />
              <Route path="/resume-shortlist" element={<ResumeShortlist />} />

              {/* Process */}
              <Route path="/interview-process" element={<InterviewProcess />} />
              <Route path="/joining-data" element={<JoiningData />} />
              <Route
                path="/add-employee-from-candidates"
                element={<AddEmployeeFromCandidates />}
              />

              {/* Employees */}
              <Route path="/all-employee" element={<EmployeeList />} />
              <Route path="/employee/:id" element={<EmployeeDetails />} />
              <Route
                path="/internship-students"
                element={<InternshipStudents />}
              />

              {/* Organisation */}
              <Route path="/analytics" element={<Analytics />} />
              <Route
                path="/business-associates"
                element={<BusinessAssociates />}
              />
              <Route
                path="/rules-regulations"
                element={<RulesRegulations />}
              />
              <Route path="/future-plans" element={<FuturePlans />} />
              <Route path="/hr-actions" element={<HRActions />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default HRDashboard;
