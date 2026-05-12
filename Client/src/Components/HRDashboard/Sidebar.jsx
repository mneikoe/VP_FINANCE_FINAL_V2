import React from "react";
import { Layout, Menu, Typography, Space } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  UserAddOutlined,
  SolutionOutlined,
  IdcardOutlined,
  ProfileOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  FileProtectOutlined,
  CalendarOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/feature/auth/authThunx";

const { Sider } = Layout;
const { Title } = Typography;

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/auth/login");
  };

  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: "/dashboard/vacancies",
      icon: <FileTextOutlined />,
      label: <Link to="/dashboard/vacancies">Vacancy Management</Link>,
    },
    {
      key: "/dashboard/add-candidate",
      icon: <UserAddOutlined />,
      label: <Link to="/dashboard/add-candidate">Add Candidate</Link>,
    },
    {
      key: "/dashboard/career-enquiry",
      icon: <SolutionOutlined />,
      label: <Link to="/dashboard/career-enquiry">Career Enquiry</Link>,
    },
    {
      key: "/dashboard/resume-shortlist",
      icon: <IdcardOutlined />,
      label: <Link to="/dashboard/resume-shortlist">Resume Shortlisted</Link>,
    },
    {
      key: "/dashboard/interview-process",
      icon: <ProfileOutlined />,
      label: <Link to="/dashboard/interview-process">Interview Process</Link>,
    },
    {
      key: "/dashboard/joining-data",
      icon: <FileProtectOutlined />,
      label: <Link to="/dashboard/joining-data">Joining Data</Link>,
    },
    {
      key: "/dashboard/add-employee-from-candidates",
      icon: <UsergroupAddOutlined />,
      label: <Link to="/dashboard/add-employee-from-candidates">Add Employee</Link>,
    },
    {
      key: "/dashboard/all-employee",
      icon: <TeamOutlined />,
      label: <Link to="/dashboard/all-employee">All Employees</Link>,
    },
    {
      key: "/dashboard/business-associates",
      icon: <UsergroupAddOutlined />,
      label: <Link to="/dashboard/business-associates">Business Associates</Link>,
    },
    {
      key: "/dashboard/internship-students",
      icon: <IdcardOutlined />,
      label: <Link to="/dashboard/internship-students">Internship Students</Link>,
    },
    {
      key: "/dashboard/rules-regulations",
      icon: <FileProtectOutlined />,
      label: <Link to="/dashboard/rules-regulations">Rules & Regulations</Link>,
    },
    {
      key: "/dashboard/future-plans",
      icon: <CalendarOutlined />,
      label: <Link to="/dashboard/future-plans">Future Plans of Director</Link>,
    },
    {
      key: "/dashboard/hr-actions",
      icon: <SafetyCertificateOutlined />,
      label: <Link to="/dashboard/hr-actions">HR Actions</Link>,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
      onClick: handleLogout,
      style: { marginTop: 'auto' }
    },
  ];

  // Find the current selected key based on the pathname
  // We filter out logout and then find the item whose key is a prefix of the current path
  // We sort by length descending to get the most specific match first
  const activeMenuItems = menuItems.filter(item => item.key !== "logout");
  const selectedKey = activeMenuItems
    .sort((a, b) => b.key.length - a.key.length)
    .find(item => 
      location.pathname === item.key || 
      location.pathname.startsWith(item.key + "/")
    )?.key || "/dashboard";

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={280}
      theme="light"
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
        zIndex: 100,
      }}
      trigger={null}
    >
      <div className="hr-sidebar-logo">
        <div className="hr-logo-icon">HR</div>
        {!collapsed && (
          <Title level={5} style={{ margin: 0, fontWeight: 700 }}>
            HR Dashboard
          </Title>
        )}
      </div>
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        style={{ borderRight: 0, padding: '16px 0' }}
      />
    </Sider>
  );
};

export default Sidebar;
