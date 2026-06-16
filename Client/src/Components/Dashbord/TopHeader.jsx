import React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/feature/auth/authThunx";
import {
  Layout,
  Button,
  Dropdown,
  Space,
  Badge,
  Avatar,
  Typography,
  Tooltip,
  Popover,
  Divider,
  Menu,
} from "antd";
import {
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SearchOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  TeamOutlined,
  ShopOutlined,
  CheckSquareOutlined,
  FileTextOutlined,
  RiseOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

const { Header } = Layout;
const { Text } = Typography;

const TopHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/auth/login");
  };

  const menuConfig = {
    masters: {
      label: "Masters",
      icon: <DatabaseOutlined />,
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

  const getMenuItems = () => {
    const items = [
      {
        key: "/",
        icon: <DashboardOutlined />,
        label: "Dashboard",
        onClick: () => navigate("/"),
      },
    ];

    Object.entries(menuConfig).forEach(([configKey, config]) => {
      items.push({
        key: configKey,
        icon: config.icon,
        label: config.label,
        children: config.sections.map((section) => ({
          type: "group",
          label: (
            <span style={{ color: "#ea580c", fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              {section.title}
            </span>
          ),
          children: section.items.map((item) => ({
            key: item.to,
            icon: <ThunderboltOutlined style={{ fontSize: "12px", color: "#ea580c" }} />,
            label: item.name,
            onClick: () => navigate(item.to),
          })),
        })),
      });
    });

    return items;
  };


  return (
    <Header
      style={{
        padding: "0 24px",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 10px 20px -5px rgba(0,0,0,0.02)",
        position: "sticky",
        top: 0,
        zIndex: 99,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "72px",
        lineHeight: "72px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none", marginRight: "24px" }}>
          <div
            style={{
              height: "40px",
              width: "40px",
              minWidth: "40px",
              background: "#f27405",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 900,
              fontSize: "18px",
              boxShadow: "0 4px 12px rgba(242, 116, 5, 0.2)",
            }}
          >
            VP
          </div>
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontSize: "20px", fontWeight: 800, color: "#1e293b", letterSpacing: "-0.02em" }}>
              VPFinance
            </div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#f27405", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              System
            </div>
          </div>
        </Link>

        {/* Horizontal Menu */}
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          disabledOverflow
          items={getMenuItems()}
          style={{
            flex: 1,
            background: "transparent",
            borderBottom: "none",
            height: "72px",
            lineHeight: "72px",
          }}
          className="topbar-menu"
        />
      </div>


      <Space size={20}>


        <Badge count={3} size="small" offset={[-4, 4]} color="#ef4444">
          <Popover
            content={<div style={{ width: "300px", padding: "12px" }}>No new system alerts.</div>}
            trigger="click"
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<BellOutlined style={{ color: "#64748b", fontSize: "20px" }} />}
              style={{ width: "44px", height: "44px", borderRadius: "12px" }}
              className="util-btn"
            />
          </Popover>
        </Badge>



        <Tooltip title="Secure Logout">
          <Button
            type="text"
            icon={<LogoutOutlined style={{ fontSize: "20px", color: "#ef4444" }} />}
            onClick={handleLogout}
            style={{ width: "44px", height: "44px", borderRadius: "12px" }}
            className="util-btn"
          />
        </Tooltip>
      </Space>

      <style>{`
        .util-btn:hover {
          background: #f1f5f9 !important;
          color: #f27405 !important;
        }
        .util-btn:hover .anticon {
          color: #f27405 !important;
        }
        .profile-btn:hover {
          background: #f1f5f9;
        }
        .topbar-menu .ant-menu-item, .topbar-menu .ant-menu-submenu {
          font-weight: 600 !important;
          color: #64748b !important;
        }
        .topbar-menu .ant-menu-item-selected, .topbar-menu .ant-menu-submenu-selected {
          color: #f27405 !important;
        }
        .topbar-menu .ant-menu-item:hover, .topbar-menu .ant-menu-submenu:hover {
          color: #f27405 !important;
        }
      `}</style>
    </Header>
  );
};

export default TopHeader;
