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
  Dropdown,
  ConfigProvider,
  Tooltip,
  Empty
} from "antd";
import {
  HomeOutlined,
  UserOutlined,
  CheckSquareOutlined,
  FileTextOutlined,
  HistoryOutlined,
  WalletOutlined,
  LogoutOutlined,
  MenuOutlined,
  BellOutlined,
  ThunderboltOutlined,
  AppstoreOutlined,
  LineChartOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";

import OEDashboardHome from "./OEDashboardHome";
import OETaskSummary from "./OETaskSummary";
import OEProfile from "./modules/Profile";

const { Header, Content, Footer } = Layout;
const { Text, Title } = Typography;

const PlaceholderComponent = ({ title }) => (
  <Card 
    style={{ textAlign: 'center', padding: '60px 0', borderRadius: '16px' }}
    bordered={false}
  >
    <Empty description={<span>{title} module is currently being optimized.</span>} />
    <Button type="primary" onClick={() => window.history.back()} style={{ marginTop: 20 }}>Return</Button>
  </Card>
);

const OEDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [stats, setStats] = useState({
    totalAssigned: 0,
    completed: 0,
    pending: 0,
    todayTasks: 0,
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (!userData || userData.role !== "OE") {
      navigate("/auth/login");
      return;
    }
    setUser(userData);
    fetchAssignedTasks(userData.id);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navigate]);

  const fetchAssignedTasks = async (oeId) => {
    if (!oeId) return;
    try {
      setLoading(true);
      const response = await axios.get("/api/OE/assigned-tasks", {
        params: { oeId },
      });
      if (response.data.success) {
        const tasks = response.data.data || [];
        setAssignedTasks(tasks);
        calculateStatistics(tasks);
      }
    } catch (error) {
      console.error("OE Task Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (tasks) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCount = tasks.filter((task) => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime();
    }).length;

    const completedCount = tasks.filter(
      (t) => t.status === "completed" || t.assignmentStatus === "completed"
    ).length;

    setStats({
      totalAssigned: tasks.length,
      completed: completedCount,
      pending: tasks.length - completedCount,
      todayTasks: todayCount,
    });
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/auth/login");
  };

  const navigation = [
    { name: "Dashboard", href: "/oe/dashboard", icon: <HomeOutlined /> },
    { name: "Profile", href: "/oe/profile", icon: <UserOutlined /> },
    { name: "Task Summary", href: "/oe/task-summary", icon: <CheckSquareOutlined /> },
    { name: "Salary", href: "/oe/salary-history", icon: <WalletOutlined /> },
    { name: "Incentives", href: "/oe/incentive-history", icon: <HistoryOutlined /> },
  ];

  const menuItems = navigation.map(item => ({
    key: item.href,
    icon: item.icon,
    label: item.name,
    onClick: () => {
      navigate(item.href);
      setMobileMenuOpen(false);
    }
  }));

  const userMenuItems = [
    { key: 'email', label: user?.emailId || user?.email || "OE User", disabled: true },
    { type: 'divider' },
    { key: 'profile', label: 'View Profile', icon: <UserOutlined />, onClick: () => navigate('/oe/profile') },
    { key: 'logout', label: 'Logout', icon: <LogoutOutlined />, danger: true, onClick: handleLogout },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#f27405', // Orange for OE
          borderRadius: 12,
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
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
                ? 'rgba(204, 98, 4, 0.95)' 
                : 'linear-gradient(135deg, #cc6204 0%, #f27405 100%)',
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
              <Link to="/oe/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                <div style={{
                  height: '40px',
                  width: '40px',
                  background: 'white',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f27405',
                  fontWeight: 900,
                  fontSize: '18px'
                }}>
                  OE
                </div>
                <div className="portal-title" style={{ lineHeight: 1.1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'white' }}>VPFinancial</div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#ffedd5', textTransform: 'uppercase' }}>Operational Executive</div>
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
                      background: location.pathname.startsWith(item.href) ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = location.pathname.startsWith(item.href) ? 'rgba(255, 255, 255, 0.15)' : 'transparent'}
                  >
                    {React.cloneElement(item.icon, { style: { fontSize: '16px', color: 'white' } })}
                    <span>{item.name}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* User Profile & Right Actions */}
            <Space size={16}>
              <div style={{ textAlign: 'right', display: 'none' }} className="user-details">
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'white' }}>{user?.username || user?.name || "OE Exec"}</div>
                <div style={{ fontSize: '10px', color: '#ffedd5' }}>ID: {user?.employeeCode || "N/A"}</div>
              </div>

              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                <Avatar 
                  size={40} 
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                    border: '2px solid rgba(255, 255, 255, 0.3)', 
                    cursor: 'pointer',
                    fontWeight: 700,
                    color: 'white'
                  }}
                >
                  {user?.username?.charAt(0) || user?.name?.charAt(0) || "O"}
                </Avatar>
              </Dropdown>
            </Space>
          </Header>
        </div>

        {/* Mobile Sidebar */}
        <Drawer
          title={<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><ThunderboltOutlined style={{ color: '#f27405' }} /><span>Operational Menu</span></div>}
          placement="left"
          onClose={() => setMobileMenuOpen(false)}
          open={mobileMenuOpen}
          width={280}
          styles={{ body: { padding: 0 } }}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            style={{ borderRight: 0, padding: '12px' }}
          />
        </Drawer>

        {/* Content Area */}
        <Content style={{ padding: '0 24px', paddingTop: '100px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
            {/* Page Header */}
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#1e293b' }}>
                  {navigation.find(n => location.pathname.includes(n.href))?.name || "OE Portal"}
                </Title>
                <Text type="secondary">Enterprise Operations & Task Management Hub</Text>
              </div>
              <Space>
                <Tooltip title="Refresh Data">
                  <Button icon={<ClockCircleOutlined />} style={{ borderRadius: '8px' }} onClick={() => fetchAssignedTasks(user?.id)} />
                </Tooltip>
                <Badge count={stats.pending} size="small">
                  <Button icon={<BellOutlined />} style={{ borderRadius: '8px' }} />
                </Badge>
              </Space>
            </div>

            <Routes>
              <Route path="/" element={<Navigate to="/oe/dashboard" replace />} />
              <Route path="/dashboard" element={<OEDashboardHome stats={stats} assignedTasks={assignedTasks} />} />
              <Route path="/profile" element={<OEProfile />} />
              <Route path="/task-summary" element={<OETaskSummary />} />
              <Route path="/salary-history" element={<PlaceholderComponent title="Salary History" />} />
              <Route path="/incentive-history" element={<PlaceholderComponent title="Incentive History" />} />
              <Route path="/task/details/:id" element={<OETaskSummary />} />
              <Route path="/task/:taskId" element={<OETaskSummary />} />
              <Route path="*" element={<Navigate to="/oe/dashboard" replace />} />
            </Routes>
          </div>
        </Content>

        {/* Modern Footer */}
        <Footer style={{ 
          background: 'transparent', 
          padding: '32px 24px',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px', alignItems: 'center' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>© {new Date().getFullYear()} VPFinancial Operations • Operational Executive Portal v2.0</Text>
            <Space split={<Divider type="vertical" />}>
                <Space><ClockCircleOutlined style={{ color: '#f27405' }} /><Text strong>{stats.todayTasks} Task(s) Today</Text></Space>
                <Space><CheckSquareOutlined style={{ color: '#10b981' }} /><Text strong>{stats.completed}/{stats.totalAssigned} Completed</Text></Space>
            </Space>
          </div>
        </Footer>

        <style>{`
          @media (max-width: 1200px) {
            .desktop-nav { display: none !important; }
            .mobile-toggle { display: inline-flex !important; }
            .user-details { display: none !important; }
            .portal-title { display: none !important; }
          }
          @media (min-width: 1201px) {
            .user-details { display: block !important; }
          }
          .ant-layout-header {
            line-height: 1 !important;
          }
        `}</style>
      </Layout>
    </ConfigProvider>
  );
};

export default OEDashboard;
