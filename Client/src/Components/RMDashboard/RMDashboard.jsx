import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  Link
} from "react-router-dom";
import { logoutUser } from "../../redux/feature/auth/authThunx";
import { useDispatch } from "react-redux";
import axios from "../../config/axios";
import {
  Layout,
  Menu,
  Button,
  Space,
  Badge,
  Avatar,
  Drawer,
  Typography,
  Card,
  Divider,
  Popover,
  Tooltip,
  Dropdown,
  ConfigProvider
} from "antd";
import {
  HomeOutlined,
  UserOutlined,
  TeamOutlined,
  CheckSquareOutlined,
  FileTextOutlined,
  RiseOutlined,
  HistoryOutlined,
  WalletOutlined,
  EnvironmentOutlined,
  LogoutOutlined,
  MenuOutlined,
  BellOutlined,
  ThunderboltOutlined,
  DownOutlined,
  IdcardOutlined
} from "@ant-design/icons";

import RMDashboardHome from "./RMDashboardHome";
import Profile from "./modules/Profile";
import AreaOfWork from "./modules/AreaOfWork";
import TaskSummary from "./modules/TaskSummary";
import AssignedTasks from "./modules/AssignedSuspects";
import RMSuspectDetailsPage from "./modules/RMSuspectDetailsPage";
import CustomerMaster from "./modules/CustomerMaster";
import TaskDetailsPage from "../Masters/task-details/TaskDetailsPage";

const { Header, Content, Footer } = Layout;
const { Text, Title } = Typography;

const PlaceholderComponent = ({ title }) => (
  <Card 
    style={{ textAlign: 'center', padding: '60px 0', borderRadius: '16px' }}
    bordered={false}
  >
    <Title level={3} style={{ color: '#1e293b' }}>{title}</Title>
    <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>This module is currently being optimized for you.</Text>
    <Button 
      type="primary" 
      onClick={() => window.history.back()}
      style={{ borderRadius: '8px', height: '40px' }}
    >
      Return to Dashboard
    </Button>
  </Card>
);

const RMDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });
  const [assignedSuspects, setAssignedSuspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAssigned: 0,
    completed: 0,
    pending: 0,
    upcomingAppointments: 0,
    todayAppointments: 0,
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (!userData || userData.role !== "RM") {
      navigate("/auth/login");
      return;
    }
    setUser(userData);
    fetchAssignedSuspects();

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navigate]);

  const fetchAssignedSuspects = async () => {
    try {
      setLoading(true);
      const rmId = user?.id || JSON.parse(localStorage.getItem("user") || "{}").id;
      if (!rmId) return;

      const response = await axios.get("/api/rm/assigned-suspects", {
        params: { rmId: rmId },
      });

      if (response.data.success) {
        setAssignedSuspects(response.data.data || []);
      }
    } catch (error) {
      console.error("❌ Error fetching assigned suspects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assignedSuspects.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayCount = assignedSuspects.filter((suspect) => {
        if (!suspect.appointmentDate) return false;
        const aptDate = new Date(suspect.appointmentDate);
        aptDate.setHours(0, 0, 0, 0);
        return aptDate.getTime() === today.getTime();
      }).length;

      const upcomingCount = assignedSuspects.filter((suspect) => {
        if (!suspect.appointmentDate) return false;
        const aptDate = new Date(suspect.appointmentDate);
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        return aptDate >= today && aptDate <= nextWeek;
      }).length;

      const completedCount = assignedSuspects.filter(
        (s) => s.assignmentStatus === "completed"
      ).length;

      setStats({
        totalAssigned: assignedSuspects.length,
        completed: completedCount,
        pending: assignedSuspects.length - completedCount,
        upcomingAppointments: upcomingCount,
        todayAppointments: todayCount,
      });
    }
  }, [assignedSuspects]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/auth/login");
  };

  const navigation = [
    { name: "Home", href: "/rm/dashboard", icon: <HomeOutlined /> },
    { name: "My Profile", href: "/rm/profile", icon: <UserOutlined /> },
    { name: "Customers", href: "/rm/customer-master", icon: <IdcardOutlined /> },
    {
      name: "Assigned",
      href: "/rm/assigned-suspects",
      icon: <ThunderboltOutlined />,
      count: assignedSuspects.length,
    },
    { name: "Tasks", href: "/rm/task-summary", icon: <CheckSquareOutlined /> },
    { name: "Work Area", href: "/rm/area-of-work", icon: <EnvironmentOutlined /> },
    { name: "Salary", href: "/rm/salary-history", icon: <WalletOutlined /> },
    { name: "Incentives", href: "/rm/incentive-history", icon: <HistoryOutlined /> },
  ];

  const getPageTitle = () => {
    const item = navigation.find(n => location.pathname.includes(n.href));
    return item ? item.name : "RM Panel";
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#4f46e5",
          borderRadius: 12,
        },
      }}
    >
      <Layout style={{ minHeight: "100vh", background: "#f8fafc" }}>
        {/* VIBRANT FLOATING HEADER */}
        <div style={{ 
          padding: scrolled ? '12px 24px' : '0', 
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', 
          position: 'fixed', 
          top: 0, 
          width: '100%', 
          zIndex: 1000 
        }}>
          <Header
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              background: scrolled 
                ? 'rgba(15, 23, 42, 0.95)' 
                : 'linear-gradient(135deg, #4338ca 0%, #4f46e5 50%, #6366f1 100%)',
              backdropFilter: 'blur(12px)',
              padding: '0 24px',
              height: '72px',
              borderRadius: scrolled ? '20px' : '0',
              boxShadow: scrolled 
                ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
                : 'none',
              borderBottom: scrolled ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              color: 'white'
            }}
          >
            {/* Logo Section */}
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '32px' }}>
              <Button
                type="text"
                icon={<MenuOutlined style={{ color: 'white' }} />}
                onClick={() => setMobileMenuOpen(true)}
                className="mobile-toggle"
                style={{ display: 'none', marginRight: '12px' }}
              />
              <Link to="/rm/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                <div style={{
                  height: '40px',
                  width: '40px',
                  background: 'white',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4338ca',
                  fontWeight: 900,
                  fontSize: '18px'
                }}>
                  RM
                </div>
                <div style={{ lineHeight: 1.1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'white' }}>VPFinancial</div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#c7d2fe', textTransform: 'uppercase' }}>Relationship Manager</div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '8px' }} className="desktop-nav">
              {navigation.map((item) => (
                <Link key={item.name} to={item.href} style={{ textDecoration: 'none' }}>
                  <div 
                    style={{
                      height: '44px',
                      padding: '0 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      borderRadius: '10px',
                      background: location.pathname.includes(item.href) ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = location.pathname.includes(item.href) ? 'rgba(255, 255, 255, 0.15)' : 'transparent'}
                  >
                    <Badge count={item.count} size="small" color="#f59e0b">
                      {React.cloneElement(item.icon, { style: { fontSize: '16px', color: 'white' } })}
                    </Badge>
                    <span>{item.name}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* User Profile & Logout */}
            <Space size={16}>
              <div style={{ textAlign: 'right', display: 'none' }} className="user-details">
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'white' }}>{user?.username || user?.name || "RM User"}</div>
                <div style={{ fontSize: '10px', color: '#c7d2fe' }}>Code: {user?.employeeCode || "N/A"}</div>
              </div>

              <Dropdown
                menu={{
                  items: [
                    { key: 'user', label: user?.emailId || user?.email || "No email", disabled: true },
                    { type: 'divider' },
                    { key: 'profile', icon: <UserOutlined />, label: 'Edit Profile', onClick: () => navigate('/rm/profile') },
                    { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true, onClick: handleLogout }
                  ]
                }}
                placement="bottomRight"
              >
                <Avatar 
                  size={40} 
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', border: '2px solid rgba(255, 255, 255, 0.3)', cursor: 'pointer' }}
                  icon={<UserOutlined />}
                />
              </Dropdown>
            </Space>
          </Header>
        </div>

        {/* MAIN CONTENT AREA */}
        <Content style={{ padding: '0 24px', paddingTop: '100px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* BREADCRUMB / PAGE TITLE */}
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#1e293b' }}>{getPageTitle()}</Title>
                <Text type="secondary">Enterprise Relationship Management Portal</Text>
              </div>
              <Space>
                <Button icon={<BellOutlined />} style={{ borderRadius: '8px' }} />
                <Button type="primary" onClick={handleLogout} danger ghost style={{ borderRadius: '8px' }}>
                  Logout
                </Button>
              </Space>
            </div>

            {/* ROUTE OUTLET */}
            <Routes>
              <Route path="/" element={<Navigate to="/rm/dashboard" replace />} />
              <Route
                path="/dashboard"
                element={
                  <RMDashboardHome
                    stats={stats}
                    assignedSuspects={assignedSuspects}
                  />
                }
              />
              <Route path="/profile" element={<Profile />} />
              <Route path="/customer-master" element={<CustomerMaster />} />
              <Route path="/area-of-work" element={<AreaOfWork />} />
              <Route
                path="/work-description"
                element={<PlaceholderComponent title="Work Description" />}
              />
              <Route path="/task-summary" element={<TaskSummary />} />
              <Route
                path="/task-status"
                element={<PlaceholderComponent title="Task Status" />}
              />
              <Route
                path="/salary-history"
                element={<PlaceholderComponent title="Salary History" />}
              />
              <Route
                path="/incentive-history"
                element={<PlaceholderComponent title="Incentive History" />}
              />
              <Route
                path="/assigned-suspects"
                element={<AssignedTasks user={user} />}
              />
              <Route
                path="/suspect/details/:id"
                element={<RMSuspectDetailsPage />}
              />
              <Route path="/task/:taskId" element={<TaskDetailsPage />} />
              <Route path="*" element={<Navigate to="/rm/dashboard" replace />} />
            </Routes>
          </div>
        </Content>

        <Footer style={{ textAlign: 'center', background: 'transparent', padding: '24px' }}>
          <Text type="secondary">© {new Date().getFullYear()} VPFinancial RM Operations Hub • v2.0</Text>
        </Footer>

        {/* MOBILE NAVIGATION DRAWER */}
        <Drawer
          title="RM Navigation"
          placement="left"
          onClose={() => setMobileMenuOpen(false)}
          open={mobileMenuOpen}
          styles={{ body: { padding: 0 } }}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={navigation.map(item => ({
              key: item.href,
              icon: item.icon,
              label: <Link to={item.href} onClick={() => setMobileMenuOpen(false)}>{item.name}</Link>
            }))}
          />
        </Drawer>
      </Layout>

      <style>{`
        @media (max-width: 1200px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: inline-flex !important; }
          .user-details { display: none !important; }
        }
        @media (min-width: 1201px) {
          .user-details { display: block !important; }
        }
        .ant-layout-header {
          line-height: 1 !important;
        }
      `}</style>
    </ConfigProvider>
  );
};

export default RMDashboard;
