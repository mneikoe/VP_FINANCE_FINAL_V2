import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout, Menu, Typography } from "antd";
import {
  DashboardOutlined,
  DatabaseOutlined,
  TeamOutlined,
  ShopOutlined,
  CheckSquareOutlined,
  FileTextOutlined,
  RiseOutlined,
  UserOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;
const { Text } = Typography;

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();

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
        label: <Link to="/">Dashboard</Link>,
      },
    ];

    Object.entries(menuConfig).forEach(([key, config]) => {
      items.push({
        key,
        icon: config.icon,
        label: config.label,
        popupClassName: "scrollable-menu-popup",
        children: config.sections.map((section, idx) => ({
          type: "group",
          label: (
            <span style={{ color: "#fed7aa", fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              {section.title}
            </span>
          ),
          children: section.items.map((item) => ({
            key: item.to,
            icon: <ThunderboltOutlined style={{ fontSize: "14px", color: "#ffffff" }} />,
            label: <Link to={item.to} style={{ color: "#ffffff", fontWeight: 500 }}>{item.name}</Link>,
          })),
        })),
      });
    });

    return items;
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={280}
      collapsedWidth={110}
      theme="dark"
      breakpoint="lg"
      style={{
        overflow: "auto",
        height: "100vh",
        position: "sticky",
        top: 0,
        left: 0,
        background: "linear-gradient(180deg, #f27405 0%, #cc6204 100%)",
        boxShadow: "4px 0 24px rgba(0,0,0,0.15)",
        zIndex: 100,
      }}
    >
      <div
        style={{
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          padding: collapsed ? "0" : "0 24px",
          background: "rgba(204, 98, 4, 0.5)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
          <div
            style={{
              height: "40px",
              width: "40px",
              minWidth: "40px",
              background: "white",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#f27405",
              fontWeight: 900,
              fontSize: "18px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            VP
          </div>
          {!collapsed && (
            <div style={{ lineHeight: 1.1, animation: "fadeIn 0.3s ease-in-out" }}>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "white", letterSpacing: "-0.02em" }}>
                VPFinance
              </div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#ffedd5", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                System
              </div>
            </div>
          )}
        </Link>
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={getMenuItems()}
        style={{
          background: "transparent",
          borderRight: 0,
          padding: "12px 8px 100px 8px", /* Added generous bottom padding to fix scroll cutoff */
        }}
      />
      <style>{`
        .ant-menu-dark.ant-menu-dark .ant-menu-item-selected {
          background-color: rgba(255, 255, 255, 0.2) !important;
          color: #ffffff !important;
          border-radius: 8px;
        }
        .ant-menu-dark .ant-menu-item:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
          border-radius: 8px;
        }
        .ant-menu-dark .ant-menu-submenu-title:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
          border-radius: 8px;
        }
        /* Fix the dark background of expanded inline submenus */
        .ant-menu-dark .ant-menu-sub.ant-menu-inline {
          background: rgba(0, 0, 0, 0.15) !important;
          border-radius: 8px;
        }
        .ant-layout-sider-trigger {
          background: #cc6204 !important;
          border-top: 1px solid rgba(255,255,255,0.05);
          transition: all 0.3s;
        }
        .ant-layout-sider-trigger:hover {
          background: #f27405 !important;
          color: #ffffff !important;
        }
        /* Fix for scrollable popup menus when sidebar is collapsed */
        .scrollable-menu-popup {
          z-index: 1050 !important;
          position: fixed !important;
          top: 10px !important;
          transform: none !important;
        }
        .scrollable-menu-popup > .ant-menu {
          max-height: calc(100vh - 20px) !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          border-radius: 8px;
          background: #cc6204 !important; /* Match sidebar background */
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5) !important;
          margin: 0 !important;
          padding: 8px 0 !important;
          display: block !important;
        }
        .scrollable-menu-popup > .ant-menu::-webkit-scrollbar {
          width: 6px;
        }
        .scrollable-menu-popup > .ant-menu::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        /* Styles for Mini Sidebar (Collapsed with text) */
        .ant-layout-sider-collapsed .ant-menu-item,
        .ant-layout-sider-collapsed .ant-menu-submenu-title {
          padding: 12px 8px !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          align-items: center !important;
          height: auto !important;
          line-height: normal !important;
        }
        .ant-layout-sider-collapsed .ant-menu-item .anticon,
        .ant-layout-sider-collapsed .ant-menu-submenu-title .anticon {
          font-size: 22px !important;
          margin: 0 !important;
          line-height: 1 !important;
        }
        .ant-layout-sider-collapsed .ant-menu-title-content {
          opacity: 1 !important;
          display: block !important;
          margin-left: 0 !important;
          font-size: 11px !important;
          font-weight: 600 !important;
          margin-top: 8px !important;
          text-align: center !important;
          white-space: normal !important;
          letter-spacing: 0.02em;
          color: #fed7aa;
        }
        .ant-layout-sider-collapsed .ant-menu-item-selected .ant-menu-title-content {
          color: #ffffff !important;
        }
      `}</style>
    </Sider>
  );
};

export default Sidebar;
