import React from "react";
import { useNavigate } from "react-router-dom";
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
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const { Header } = Layout;
const { Text } = Typography;

const TopHeader = ({ collapsed, setCollapsed }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/auth/login");
  };

  return (
    <Header
      style={{
        padding: "0 24px 0 0",
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
      <div style={{ display: "flex", alignItems: "center" }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: "18px",
            width: "64px",
            height: "64px",
            color: "#64748b",
            transition: "color 0.3s",
          }}
          className="trigger-btn"
        />
      </div>

      <Space size={20}>
        <Tooltip title="Global Search">
          <Button
            type="text"
            icon={<SearchOutlined style={{ color: "#64748b", fontSize: "20px" }} />}
            style={{ width: "44px", height: "44px", borderRadius: "12px" }}
            className="util-btn"
          />
        </Tooltip>

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

        <Divider type="vertical" style={{ height: "24px", background: "#e2e8f0" }} />

        <Dropdown
          menu={{
            items: [
              {
                key: "user-info",
                label: (
                  <div style={{ padding: "8px" }}>
                    <Text strong style={{ display: "block", fontSize: "16px", color: "#1e293b" }}>
                      {loggedInUser.username || "Operations Associate"}
                    </Text>
                    <Text type="secondary" style={{ color: "#64748b" }}>
                      {loggedInUser.role || "Administrator"}
                    </Text>
                  </div>
                ),
                disabled: true,
              },
              { type: "divider" },
              {
                key: "profile",
                icon: <UserOutlined />,
                label: "Account Settings",
                onClick: () =>
                  navigate(
                    loggedInUser.role === "HR"
                      ? `/dashboard/employee/${loggedInUser._id || loggedInUser.id}`
                      : `/employee/${loggedInUser._id || loggedInUser.id}`
                  ),
              },
              {
                key: "logout",
                icon: <LogoutOutlined />,
                label: "Secure Logout",
                danger: true,
                onClick: handleLogout,
              },
            ],
          }}
          placement="bottomRight"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", padding: "4px 8px", borderRadius: "12px", transition: "background 0.3s" }} className="profile-btn">
            <Avatar
              size={44}
              style={{
                backgroundColor: "#ffedd5",
                color: "#ea580c",
                border: "2px solid #fed7aa",
                fontWeight: 800,
              }}
            >
              {loggedInUser.username?.[0]?.toUpperCase() || "OA"}
            </Avatar>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
              <Text strong style={{ color: "#1e293b", fontSize: "14px" }}>
                {loggedInUser.username || "Admin"}
              </Text>
              <Text style={{ color: "#64748b", fontSize: "12px" }}>
                {loggedInUser.role || "Administrator"}
              </Text>
            </div>
          </div>
        </Dropdown>
      </Space>

      <style>{`
        .trigger-btn:hover {
          color: #f27405 !important;
          background: rgba(242, 116, 5, 0.05) !important;
        }
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
      `}</style>
    </Header>
  );
};

export default TopHeader;
