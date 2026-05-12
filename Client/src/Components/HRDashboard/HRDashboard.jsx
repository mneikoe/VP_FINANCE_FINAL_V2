import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Layout, ConfigProvider } from "antd";
import Sidebar from "./Sidebar.jsx";
import TopNavigation from "./TopNavigation.jsx";
import "./HRDashboard.css";

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
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1890ff",
          borderRadius: 8,
        },
      }}
    >
      <Layout className="hr-dashboard-layout" hasSider>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        
        <Layout 
          style={{ 
            marginLeft: collapsed ? 80 : 280, 
            transition: 'margin-left 0.2s',
            minHeight: '100vh',
            background: '#f0f2f5'
          }}
        >
          <TopNavigation collapsed={collapsed} setCollapsed={setCollapsed} />
          
          <Content style={{ margin: '24px', minHeight: 280 }}>
            <div className="fade-in">
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
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default HRDashboard;
