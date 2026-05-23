import React, { useState } from "react";
import { Layout, Menu, Typography, Avatar, Divider, Tooltip } from "antd";
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
  SafetyCertificateOutlined,
  BarChartOutlined,
  ApartmentOutlined,
  ReadOutlined,
  RocketOutlined,
  ThunderboltOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/feature/auth/authThunx";

const { Sider } = Layout;
const { Text } = Typography;

const HRSidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user?.username || user?.name || "HR Manager";

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.clear();
    navigate("/auth/login");
  };

  // All menu items laid out flat – no sub-menus, grouped with type:"group"
  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },

    // ── Recruitment ──────────────────────────────────────────
    { type: "divider" },
    {
      type: "group",
      label: !collapsed ? (
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#f97316",
            paddingLeft: 8,
          }}
        >
          Recruitment
        </span>
      ) : null,
      children: [
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
          label: <Link to="/dashboard/resume-shortlist">Resume Shortlist</Link>,
        },
      ],
    },

    // ── Process ────────────────────────────────────────────────
    { type: "divider" },
    {
      type: "group",
      label: !collapsed ? (
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#f97316",
            paddingLeft: 8,
          }}
        >
          Process
        </span>
      ) : null,
      children: [
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
          label: (
            <Link to="/dashboard/add-employee-from-candidates">Add Employee</Link>
          ),
        },
      ],
    },

    // ── Employees ─────────────────────────────────────────────
    { type: "divider" },
    {
      type: "group",
      label: !collapsed ? (
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#f97316",
            paddingLeft: 8,
          }}
        >
          Employees
        </span>
      ) : null,
      children: [
        {
          key: "/dashboard/all-employee",
          icon: <TeamOutlined />,
          label: <Link to="/dashboard/all-employee">All Employees</Link>,
        },
        {
          key: "/dashboard/internship-students",
          icon: <ReadOutlined />,
          label: (
            <Link to="/dashboard/internship-students">Internship Students</Link>
          ),
        },
      ],
    },

    // ── Organisation ──────────────────────────────────────────
    { type: "divider" },
    {
      type: "group",
      label: !collapsed ? (
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#f97316",
            paddingLeft: 8,
          }}
        >
          Organisation
        </span>
      ) : null,
      children: [
        {
          key: "/dashboard/analytics",
          icon: <BarChartOutlined />,
          label: <Link to="/dashboard/analytics">Analytics</Link>,
        },
        {
          key: "/dashboard/business-associates",
          icon: <ApartmentOutlined />,
          label: (
            <Link to="/dashboard/business-associates">Business Associates</Link>
          ),
        },
        {
          key: "/dashboard/rules-regulations",
          icon: <SafetyCertificateOutlined />,
          label: (
            <Link to="/dashboard/rules-regulations">Rules & Regulations</Link>
          ),
        },
        {
          key: "/dashboard/future-plans",
          icon: <RocketOutlined />,
          label: (
            <Link to="/dashboard/future-plans">Future Plans</Link>
          ),
        },
        {
          key: "/dashboard/hr-actions",
          icon: <ThunderboltOutlined />,
          label: <Link to="/dashboard/hr-actions">HR Actions</Link>,
        },
      ],
    },

    // ── Logout ────────────────────────────────────────────────
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Sign Out",
      danger: true,
      onClick: handleLogout,
    },
  ];

  // Determine currently selected key
  const allKeys = [
    "/dashboard",
    "/dashboard/vacancies",
    "/dashboard/add-candidate",
    "/dashboard/career-enquiry",
    "/dashboard/resume-shortlist",
    "/dashboard/interview-process",
    "/dashboard/joining-data",
    "/dashboard/add-employee-from-candidates",
    "/dashboard/all-employee",
    "/dashboard/internship-students",
    "/dashboard/analytics",
    "/dashboard/business-associates",
    "/dashboard/rules-regulations",
    "/dashboard/future-plans",
    "/dashboard/hr-actions",
  ];

  const selectedKey =
    [...allKeys]
      .sort((a, b) => b.length - a.length)
      .find(
        (k) =>
          location.pathname === k || location.pathname.startsWith(k + "/")
      ) || "/dashboard";

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={260}
      collapsedWidth={72}
      trigger={null}
      className="hr-sider-container"
      style={{
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        overflow: "hidden",
        background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
        boxShadow: "4px 0 24px rgba(0,0,0,0.18)",
        zIndex: 200,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Logo / Header ───────────────────────────────────── */}
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: collapsed ? "0 16px" : "0 20px",
          background: "rgba(242,116,5,0.12)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              minWidth: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #f27405 0%, #cc5500 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: 14,
              color: "#fff",
              boxShadow: "0 4px 12px rgba(242,116,5,0.4)",
            }}
          >
            HR
          </div>
          {!collapsed && (
            <div style={{ lineHeight: 1.15 }}>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 15,
                  color: "#fff",
                  letterSpacing: "-0.01em",
                }}
              >
                VP Finance
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#f97316",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                HR Dashboard
              </div>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.5)",
              cursor: "pointer",
              padding: 4,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#fff")}
            onMouseLeave={(e) =>
              (e.target.style.color = "rgba(255,255,255,0.5)")
            }
          >
            <MenuFoldOutlined style={{ fontSize: 16 }} />
          </button>
        )}

        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            style={{
              position: "absolute",
              top: 16,
              right: -1,
              background: "#f27405",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              padding: "4px 6px",
              borderRadius: "0 6px 6px 0",
              display: "flex",
              alignItems: "center",
              boxShadow: "2px 2px 8px rgba(242,116,5,0.4)",
            }}
          >
            <MenuUnfoldOutlined style={{ fontSize: 13 }} />
          </button>
        )}
      </div>

      {/* ── User Profile strip ──────────────────────────────── */}
      {!collapsed && (
        <div
          style={{
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(255,255,255,0.03)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            flexShrink: 0,
          }}
        >
          <Avatar
            size={36}
            style={{
              background: "linear-gradient(135deg, #f27405 0%, #cc5500 100%)",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {userName.charAt(0).toUpperCase()}
          </Avatar>
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                color: "#fff",
                fontWeight: 600,
                fontSize: 13,
                lineHeight: 1.2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {userName}
            </div>
            <div
              style={{
                color: "#94a3b8",
                fontSize: 11,
                lineHeight: 1.2,
              }}
            >
              HR Manager
            </div>
          </div>
        </div>
      )}

      {/* ── Navigation Menu ─────────────────────────────────── */}
      <div
        className="hr-sidebar-scroll"
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(249,115,22,0.4) transparent",
        }}
      >
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          style={{
            background: "transparent",
            borderRight: 0,
            padding: "8px 0 24px 0",
          }}
        />
      </div>

      {/* ── Custom styles injected ──────────────────────────── */}
      <style>{`
        /* Make Ant Design Sider children container a flex container */
        .hr-sider-container .ant-layout-sider-children {
          display: flex !important;
          flex-direction: column !important;
          height: 100% !important;
        }

        /* Override ant dark menu bg */
        .hr-sider-menu.ant-menu-dark,
        .hr-sider-menu.ant-menu-dark .ant-menu-sub {
          background: transparent !important;
        }

        /* Selected item */
        .ant-menu-dark .ant-menu-item-selected {
          background: linear-gradient(90deg, rgba(242,116,5,0.25) 0%, rgba(242,116,5,0.08) 100%) !important;
          border-left: 3px solid #f27405 !important;
          border-radius: 0 8px 8px 0 !important;
        }

        /* Hover */
        .ant-menu-dark .ant-menu-item:hover {
          background: rgba(255,255,255,0.07) !important;
          border-radius: 8px !important;
        }

        /* Group label */
        .ant-menu-item-group-title {
          padding: 10px 16px 4px !important;
        }

        /* Divider color */
        .ant-menu-dark .ant-menu-item-divider {
          border-color: rgba(255,255,255,0.06) !important;
          margin: 4px 16px !important;
        }

        /* Item text */
        .ant-menu-dark .ant-menu-item a {
          color: #cbd5e1 !important;
          font-weight: 500;
        }
        .ant-menu-dark .ant-menu-item-selected a {
          color: #fff !important;
          font-weight: 600;
        }
        .ant-menu-dark .ant-menu-item a:hover {
          color: #fff !important;
        }

        /* Icon color */
        .ant-menu-dark .ant-menu-item .anticon {
          color: #94a3b8 !important;
        }
        .ant-menu-dark .ant-menu-item-selected .anticon {
          color: #f97316 !important;
        }

        /* ── Custom Scrollbar (webkit) ── */
        .hr-sidebar-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .hr-sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .hr-sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(249, 115, 22, 0.35);
          border-radius: 8px;
          transition: background 0.2s;
        }
        .hr-sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(249, 115, 22, 0.65);
        }

        /* Danger (logout) */
        .ant-menu-dark .ant-menu-item-danger {
          color: #f87171 !important;
        }
        .ant-menu-dark .ant-menu-item-danger .anticon {
          color: #f87171 !important;
        }
        .ant-menu-dark .ant-menu-item-danger:hover {
          background: rgba(239,68,68,0.15) !important;
        }
      `}</style>
    </Sider>
  );
};

export default HRSidebar;
