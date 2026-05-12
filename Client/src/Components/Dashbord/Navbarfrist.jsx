import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/feature/auth/authThunx";
import {
  Layout,
  Menu,
  Button,
  Dropdown,
  Space,
  Badge,
  Avatar,
  Drawer,
  Typography,
  Card,
  Divider,
  Popover,
  Tooltip
} from "antd";
import {
  DashboardOutlined,
  DatabaseOutlined,
  TeamOutlined,
  ShopOutlined,
  CheckSquareOutlined,
  FileTextOutlined,
  BellOutlined,
  RiseOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
  DownOutlined,
  ThunderboltOutlined,
  SearchOutlined
} from "@ant-design/icons";

const { Header } = Layout;
const { Text, Title } = Typography;

const Navbarfristn = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/auth/login");
  };

  const menuConfig = {
    masters: {
      label: "Masters",
      icon: <DatabaseOutlined />,
      width: 780,
      sections: [
        {
          title: "Task",
          items: [
            { name: "Composite Task", to: "/composite" },
            { name: "Marketing Task", to: "/marketing-task" },
            { name: "Servicing Task", to: "/servicing-task" },
          ],
        },
        {
          title: "Area",
          items: [
            { name: "Add Area", to: "/area" },
            { name: "Add Sub Area", to: "/sub-area" },
          ],
        },
        {
          title: "Lead",
          items: [
            { name: "Lead Source", to: "/lead-type" },
            { name: "Lead Name", to: "/lead-source" },
            { name: "Occupation Type", to: "/occupation-type" },
            { name: "Occupation Name", to: "/lead-occupation" },
            { name: "Calling Purpose", to: "/calling-purpose" },
          ],
        },
        {
          title: "Document",
          items: [
            { name: "Document Type", to: "/kycdocument" },
            { name: "Document Name", to: "/kyc-document-name-master" },
          ],
        },
      ],
    },
    customers: {
      label: "Customers",
      icon: <UserOutlined />,
      width: 560,
      sections: [
        {
          title: "Suspect",
          items: [
            { name: "Add Suspect", to: "/suspect/add" },
            { name: "Suspect List", to: "/suspect" },
            { name: "Import Lead", to: "/import-lead" },
          ],
        },
        {
          title: "Prospect",
          items: [
            { name: "Add Prospect", to: "/prospect/add" },
            { name: "Prospect List", to: "/prospect" },
          ],
        },
        {
          title: "Client",
          items: [
            { name: "Add Client", to: "/client/add" },
            { name: "Client List", to: "/client" },
          ],
        },
      ],
    },
    employee: {
      label: "Employee",
      icon: <TeamOutlined />,
      width: 720,
      sections: [
        {
          title: "Office Admin",
          items: [
            { name: "Job Profile & Target", to: "/job-profile-target-admin" },
            { name: "All Employee", to: "/all-employee" },
          ],
        },
        {
          title: "Telecaller",
          items: [{ name: "Job Profile & Target", to: "/job-profile-target-telecaller" }],
        },
        {
          title: "CRE",
          items: [{ name: "Job Profile & Target", to: "/job-profile-target-cre" }],
        },
        {
          title: "HR",
          items: [
            { name: "HR Rules & Regulations", to: "/hr-rules" },
            { name: "Employee Training", to: "/employee-training" },
          ],
        },
        {
          title: "Telemarketer",
          items: [{ name: "Job Profile & Target", to: "/job-profile-target-telemarketer" }],
        },
        {
          title: "Office Executive",
          items: [{ name: "Job Profile & Target", to: "/job-profile-target-office-executive" }],
        },
      ],
    },
    financial: {
      label: "Financial",
      icon: <RiseOutlined />,
      width: 360,
      sections: [
        {
          title: "Financial Services",
          items: [
            { name: "Financial Products", to: "/financial-product-list" },
            { name: "Company Name", to: "/company-name" },
            { name: "MF Registrar", to: "/mutual-fund/registrar" },
            { name: "MF AMC Name", to: "/mutual-fund/amc" },
            { name: "Other Product", to: "/other-product" },
          ],
        },
      ],
    },
    depart: {
      label: "Department",
      icon: <ShopOutlined />,
      width: 780,
      sections: [
        {
          title: "Marketing",
          items: [{ name: "Marketing Documents", to: "/marketing-documents" }],
        },
        {
          title: "Servicing",
          items: [{ name: "Servicing Documents", to: "/servicing-documents" }],
        },
        {
          title: "Office Records",
          items: [
            { name: "Office Diary", to: "/office-diary" },
            { name: "Office Purchase", to: "/office-purchase" },
            { name: "Important Documents", to: "/important-documents" },
          ],
        },
        {
          title: "CRM Activities",
          items: [
            { name: "CRM Advertisement Activities", to: "/crm-advertisement-activities" },
            { name: "CRM Creativity Activities", to: "/crm-creativity-activities" },
            { name: "CRM Relationship Activities", to: "/crm-relationship-activities" },
          ],
        },
      ],
    },
    task: {
      label: "Task",
      icon: <CheckSquareOutlined />,
      width: 400,
      sections: [
        {
          title: "Task Categories",
          items: [
            { name: "Composite", to: "/task-composite" },
            { name: "Marketing", to: "/task-marketing" },
            { name: "Servicing", to: "/task-servicing" },
          ],
        },
        {
          title: "Task Assign",
          items: [
            { name: "Assign Task", to: "/task-assign" },
            { name: "Assign Appointments", to: "/appointment-assign" },
          ],
        },
      ],
    },
    reports: {
      label: "Reports",
      icon: <FileTextOutlined />,
      width: 320,
      sections: [
        {
          title: "Reports",
          items: [
            { name: "Employee Report", to: "/reports/employee-report" },
            { name: "Telecaller Report", to: "/reports/telecaller-report" },
            { name: "Financial Reports", to: "/financial-product-list" },
            { name: "Sales Reports", to: "/report-2" },
            { name: "Customer Reports", to: "/report-3" },
          ],
        },
      ],
    },
  };


  const renderMegaMenu = (config) => (
    <Card
      styles={{ body: { padding: '24px' } }}
      style={{
        width: config.width,
        maxWidth: '92vw',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${config.sections.length > 3 ? 4 : config.sections.length}, 1fr)`,
        gap: '32px'
      }}>
        {config.sections.map((section, idx) => (
          <div key={idx}>
            <Title level={5} style={{
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#3b82f6',
              marginBottom: '16px',
              fontWeight: 800,
              borderLeft: '3px solid #3b82f6',
              paddingLeft: '10px'
            }}>
              {section.title}
            </Title>
            <Space direction="vertical" style={{ width: '100%' }} size={2}>
              {section.items.map((item, i) => (
                <Link
                  key={i}
                  to={item.to}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    color: '#1e293b',
                    fontSize: '14px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    textDecoration: 'none',
                    fontWeight: 500
                  }}
                  className="mega-menu-link"
                >
                  <ThunderboltOutlined style={{ marginRight: '8px', fontSize: '12px', opacity: 0.5 }} className="link-icon" />
                  {item.name}
                </Link>
              ))}
            </Space>
          </div>
        ))}
      </div>
      <style>{`
        .mega-menu-link:hover {
          background: #eff6ff !important;
          color: #2563eb !important;
          transform: translateX(5px);
        }
        .mega-menu-link:hover .link-icon {
          opacity: 1 !important;
          color: #f59e0b;
        }
      `}</style>
    </Card>
  );

  return (
    <div style={{ padding: scrolled ? '12px 24px' : '0', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', position: 'fixed', top: 0, width: '100%', zIndex: 1000 }}>
      <Header
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          background: scrolled 
            ? 'rgba(15, 23, 42, 0.95)' 
            : 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%)',
          backdropFilter: 'blur(12px)',
          padding: '0 24px',
          height: '72px',
          borderRadius: scrolled ? '20px' : '0',
          boxShadow: scrolled 
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
            : 'none',
          borderBottom: scrolled ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          color: 'white'
        }}
      >
        {/* Brand Section */}
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '40px' }}>
          <Button
            type="text"
            icon={<MenuOutlined style={{ color: 'white' }} />}
            onClick={() => setIsMobileMenuOpen(true)}
            style={{ display: 'none', marginRight: '12px' }}
            className="mobile-menu-btn"
          />
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
            <div style={{
              height: '42px',
              width: '42px',
              background: 'white',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1e40af',
              fontWeight: 900,
              fontSize: '18px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}>
              VP
            </div>
            <div style={{ lineHeight: 1.1 }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>VPFinancial</div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Nest</div>
            </div>
          </Link>
        </div>

        {/* Navigation Grid */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '12px' }} className="desktop-nav">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div 
              style={{
                height: '48px',
                padding: '0 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '12px',
                background: location.pathname === '/' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                color: 'white',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = location.pathname === '/' ? 'rgba(255, 255, 255, 0.15)' : 'transparent'}
            >
              <DashboardOutlined style={{ fontSize: '18px' }} />
              <span>Dashboard</span>
            </div>
          </Link>

          {Object.entries(menuConfig).map(([key, config]) => (
            <Dropdown
              key={key}
              dropdownRender={() => renderMegaMenu(config)}
              trigger={['click']}
              placement="bottom"
              arrow={{ pointAtCenter: true }}
            >
              <div 
                style={{
                  height: '48px',
                  padding: '0 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: '12px',
                  background: location.pathname.includes(key) ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = location.pathname.includes(key) ? 'rgba(255, 255, 255, 0.15)' : 'transparent'}
              >
                {config.icon}
                <span>{config.label}</span>
                <DownOutlined style={{ fontSize: '10px', opacity: 0.7 }} />
              </div>
            </Dropdown>
          ))}
        </div>

        {/* Global Utilities */}
        <Space size={20}>
          <Tooltip title="Global Search">
            <Button 
              type="text" 
              icon={<SearchOutlined style={{ color: 'white', fontSize: '20px' }} />} 
              style={{ width: '44px', height: '44px', borderRadius: '12px' }}
              className="util-btn"
            />
          </Tooltip>

          <Badge count={3} size="small" offset={[-4, 4]} color="#f59e0b">
            <Popover
              content={<div style={{ width: '300px', padding: '12px' }}>No new system alerts.</div>}
              trigger="click"
              placement="bottomRight"
            >
              <Button 
                type="text" 
                icon={<BellOutlined style={{ color: 'white', fontSize: '20px' }} />} 
                style={{ width: '44px', height: '44px', borderRadius: '12px' }}
                className="util-btn"
              />
            </Popover>
          </Badge>

          <Divider type="vertical" style={{ background: 'rgba(255, 255, 255, 0.2)', height: '24px' }} />

          <Dropdown
            menu={{
              items: [
                {
                  key: 'user-info',
                  label: (
                    <div style={{ padding: '8px' }}>
                      <Text strong style={{ display: 'block', fontSize: '16px' }}>{loggedInUser.username || "Operations Associate"}</Text>
                      <Text type="secondary">{loggedInUser.role || "Administrator"}</Text>
                    </div>
                  ),
                  disabled: true
                },
                { type: 'divider' },
                {
                  key: 'profile',
                  icon: <UserOutlined />,
                  label: 'Account Settings',
                  onClick: () => navigate(loggedInUser.role === "HR" ? `/dashboard/employee/${loggedInUser._id || loggedInUser.id}` : `/employee/${loggedInUser._id || loggedInUser.id}`)
                },
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: 'Secure Logout',
                  danger: true,
                  onClick: handleLogout
                }
              ]
            }}
            placement="bottomRight"
          >
            <Avatar
              size={44}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                fontWeight: 800
              }}
            >
              {loggedInUser.username?.[0]?.toUpperCase() || 'OA'}
            </Avatar>
          </Dropdown>
        </Space>
      </Header>

      {/* Mobile Control Drawer */}
      <Drawer
        title={<span style={{ fontWeight: 800 }}>VPCorp Navigation</span>}
        placement="left"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        styles={{ body: { padding: 0 } }}
      >
        <Menu
          mode="inline"
          items={[
            { key: 'dashboard', icon: <DashboardOutlined />, label: <Link to="/">Dashboard Overview</Link> },
            ...Object.entries(menuConfig).map(([key, config]) => ({
              key,
              icon: config.icon,
              label: config.label,
              children: config.sections.flatMap(s => s.items.map(i => ({
                key: i.to,
                label: <Link to={i.to}>{i.name}</Link>
              })))
            }))
          ]}
        />
      </Drawer>

      <style>{`
        .ant-layout-header {
          line-height: 1 !important;
        }
        .util-btn:hover {
          background: rgba(255, 255, 255, 0.1) !important;
        }
        @media (max-width: 1200px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: inline-flex !important; }
        }
      `}</style>
    </div>
  );
};

export default Navbarfristn;