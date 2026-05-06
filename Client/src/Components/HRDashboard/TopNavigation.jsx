import React, { useState, useEffect } from "react";
import { Layout, Button, Space, Typography, Badge, Avatar, Tooltip } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  MailOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Header } = Layout;
const { Text } = Typography;

const TopNavigation = ({ collapsed, setCollapsed }) => {
  const [currentTime, setCurrentTime] = useState(dayjs());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user?.username || user?.name || "HR Manager";
  const userEmail = user?.email || "hr@company.com";

  return (
    <Header
      className="hr-header"
      style={{
        padding: "0 24px",
        background: "#fff",
        height: "64px",
        lineHeight: "64px",
        position: "sticky",
        top: 0,
        zIndex: 99,
        width: "100%",
      }}
    >
      <Space size="large">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ fontSize: "16px", width: 64, height: 64 }}
        />
        
        <div className="d-none d-md-flex align-items-center">
          <Avatar 
            size="large" 
            icon={<UserOutlined />} 
            style={{ backgroundColor: '#1890ff', marginRight: 12 }}
          >
            {userName.charAt(0).toUpperCase()}
          </Avatar>
          <Space direction="vertical" size={0} style={{ lineHeight: '1.2' }}>
            <Text strong style={{ fontSize: '14px' }}>{userName}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              <MailOutlined style={{ marginRight: 4 }} />
              {userEmail}
            </Text>
          </Space>
        </div>
      </Space>

      <Space size="large">
        <div className="d-none d-lg-flex align-items-center" style={{ textAlign: 'right' }}>
          <Space direction="vertical" size={0} style={{ lineHeight: '1.2' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              <CalendarOutlined style={{ marginRight: 4 }} />
              {currentTime.format("dddd, D MMMM YYYY")}
            </Text>
            <Text strong style={{ fontSize: '14px' }}>
              <ClockCircleOutlined style={{ marginRight: 4 }} />
              {currentTime.format("hh:mm:ss A")}
            </Text>
          </Space>
        </div>

        <Space size="middle">
          <Tooltip title="Notifications">
            <Badge count={3} size="small">
              <Button type="text" icon={<BellOutlined style={{ fontSize: '18px' }} />} />
            </Badge>
          </Tooltip>
          
          <Avatar 
            style={{ backgroundColor: '#f56a00', verticalAlign: 'middle', cursor: 'pointer' }} 
            size="large"
          >
            {userName.charAt(0).toUpperCase()}
          </Avatar>
        </Space>
      </Space>
    </Header>
  );
};

export default TopNavigation;
