import React, { useState, useEffect } from "react";
import { Layout, Button, Space, Typography, Badge, Avatar, Tooltip } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/feature/auth/authThunx";
import dayjs from "dayjs";

const { Header } = Layout;
const { Text } = Typography;

const HRTopBar = ({ collapsed, setCollapsed }) => {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user?.username || user?.name || "HR Manager";

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.clear();
    navigate("/auth/login");
  };

  return (
    <Header
      style={{
        padding: "0 20px",
        background: "#fff",
        height: 56,
        lineHeight: "56px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 1px 0 rgba(0,0,0,0.06)",
        borderBottom: "1px solid #f1f5f9",
      }}
    >
      {/* Left: Toggle button */}
      <Button
        type="text"
        icon={
          collapsed ? (
            <MenuUnfoldOutlined style={{ fontSize: 18 }} />
          ) : (
            <MenuFoldOutlined style={{ fontSize: 18 }} />
          )
        }
        onClick={() => setCollapsed(!collapsed)}
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          color: "#64748b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />

      {/* Right: Clock + Notifications + User */}
      <Space size={12} align="center">
        {/* Live Clock */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            lineHeight: 1.2,
          }}
        >
          <Text
            style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}
          >
            <CalendarOutlined style={{ marginRight: 4 }} />
            {currentTime.format("ddd, D MMM YYYY")}
          </Text>
          <Text style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            {currentTime.format("hh:mm:ss A")}
          </Text>
        </div>

        {/* Notification bell */}
        <Tooltip title="Notifications">
          <Badge count={3} size="small" offset={[-2, 2]}>
            <Button
              type="text"
              icon={<BellOutlined style={{ fontSize: 17 }} />}
              style={{
                borderRadius: 8,
                color: "#64748b",
                width: 38,
                height: 38,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </Badge>
        </Tooltip>

        {/* Avatar with tooltip */}
        <Tooltip title="Sign Out">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              padding: "4px 10px 4px 4px",
              borderRadius: 10,
              border: "1px solid #e2e8f0",
              transition: "all 0.2s",
            }}
            onClick={handleLogout}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#f27405")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
          >
            <Avatar
              size={30}
              style={{
                background: "linear-gradient(135deg, #f27405 0%, #cc5500 100%)",
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </Avatar>
            <Text style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
              {userName}
            </Text>
            <LogoutOutlined style={{ fontSize: 12, color: "#94a3b8" }} />
          </div>
        </Tooltip>
      </Space>
    </Header>
  );
};

export default HRTopBar;
