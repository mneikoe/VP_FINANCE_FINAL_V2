import React from "react";
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  Tag, 
  Button, 
  Typography, 
  Space, 
  Avatar, 
  Tooltip,
  Empty
} from "antd";
import { 
  ThunderboltOutlined, 
  CheckCircleOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined, 
  ArrowRightOutlined,
  UserOutlined,
  PhoneOutlined,
  IdcardOutlined,
  BarChartOutlined,
  SafetyCertificateOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

const RMDashboardHome = ({ stats, assignedSuspects }) => {
  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) return "-";
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const getStatusTag = (status) => {
    const config = {
      suspect: { color: "blue", icon: <UserOutlined /> },
      prospect: { color: "gold", icon: <ThunderboltOutlined /> },
      client: { color: "green", icon: <CheckCircleOutlined /> },
      assigned: { color: "purple", icon: <IdcardOutlined /> },
      completed: { color: "success", icon: <CheckCircleOutlined /> },
      cancelled: { color: "error", icon: <ClockCircleOutlined /> },
    };

    const { color, icon } = config[status?.toLowerCase()] || { color: "default", icon: null };

    return (
      <Tag icon={icon} color={color} style={{ borderRadius: '6px', fontWeight: 600, textTransform: 'capitalize' }}>
        {status || "N/A"}
      </Tag>
    );
  };

  const columns = [
    {
      title: "Group Details",
      dataIndex: "groupName",
      key: "groupName",
      render: (text, record) => (
        <Space size="middle">
          <Avatar 
            shape="square" 
            icon={<IdcardOutlined />} 
            style={{ backgroundColor: '#f1f5f9', color: '#64748b', borderRadius: '8px' }} 
          />
          <div>
            <Text strong style={{ fontSize: '14px', display: 'block' }}>{text || "N/A"}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>Code: {record.groupCode || "N/A"}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Contact",
      dataIndex: "mobile",
      key: "mobile",
      render: (text) => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: '13px' }}><PhoneOutlined style={{ fontSize: '11px', marginRight: '6px', color: '#94a3b8' }} />{text || "N/A"}</Text>
        </Space>
      ),
    },
    {
      title: "Schedule",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      render: (date, record) => (
        date ? (
          <div>
            <Text strong style={{ fontSize: '13px', color: '#4f46e5' }}>{formatDate(date)}</Text>
            {record.appointmentTime && (
              <div style={{ marginTop: '2px' }}>
                <Tag icon={<ClockCircleOutlined />} style={{ fontSize: '10px', margin: 0 }}>{record.appointmentTime}</Tag>
              </div>
            )}
          </div>
        ) : <Text type="secondary" italic>Not Scheduled</Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Tooltip title="View Details">
          <Button 
            type="text" 
            icon={<ArrowRightOutlined />} 
            onClick={() => navigate(`/rm/suspect/details/${record.id || record._id}`)} 
          />
        </Tooltip>
      ),
    },
  ];

  const statCards = [
    { 
      title: "Total Assigned", 
      value: stats.totalAssigned, 
      icon: <ThunderboltOutlined />, 
      color: "#4f46e5", 
      bg: "#eef2ff" 
    },
    { 
      title: "Completed", 
      value: stats.completed, 
      icon: <CheckCircleOutlined />, 
      color: "#10b981", 
      bg: "#ecfdf5" 
    },
    { 
      title: "Today's Schedule", 
      value: stats.todayAppointments, 
      icon: <CalendarOutlined />, 
      color: "#3b82f6", 
      bg: "#eff6ff" 
    },
    { 
      title: "Upcoming (7 Days)", 
      value: stats.upcomingAppointments, 
      icon: <ClockCircleOutlined />, 
      color: "#8b5cf6", 
      bg: "#f5f3ff" 
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Stats Grid */}
      <Row gutter={[16, 16]}>
        {statCards.map((stat, idx) => (
          <Col xs={24} sm={12} lg={6} key={idx}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card 
                bordered={false} 
                style={{ 
                  borderRadius: '16px', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  height: '110px'
                }}
                styles={{ body: { padding: '20px' } }}
              >
                <Statistic
                  title={<Text type="secondary" strong style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.title}</Text>}
                  value={stat.value}
                  valueStyle={{ color: '#1e293b', fontWeight: 800, fontSize: '28px' }}
                  prefix={
                    <div style={{ 
                      background: stat.bg, 
                      color: stat.color, 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '10px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      marginRight: '12px',
                      fontSize: '20px'
                    }}>
                      {stat.icon}
                    </div>
                  }
                />
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Main Table Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card
          bordered={false}
          style={{ 
            borderRadius: '20px', 
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden'
          }}
          title={
            <Space>
              <BarChartOutlined style={{ color: '#4f46e5' }} />
              <span style={{ fontWeight: 800 }}>Recent Assignments</span>
            </Space>
          }
          extra={
            <Button 
              type="primary" 
              icon={<ArrowRightOutlined />} 
              onClick={() => navigate("/rm/assigned-suspects")}
              style={{ borderRadius: '8px' }}
            >
              View Full Pipeline
            </Button>
          }
          styles={{ body: { padding: 0 } }}
        >
          <Table
            columns={columns}
            dataSource={assignedSuspects.slice(0, 5)}
            pagination={false}
            rowKey={(record) => record.id || record._id}
            locale={{
              emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No active assignments found" />
            }}
            onRow={(record) => ({
              onClick: () => navigate(`/rm/suspect/details/${record.id || record._id}`),
              style: { cursor: 'pointer' }
            })}
          />
          {assignedSuspects.length > 5 && (
            <div style={{ padding: '16px 24px', textAlign: 'right', borderTop: '1px solid #f1f5f9' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Displaying 5 of {assignedSuspects.length} total records
              </Text>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Quick Metrics Footer Grid */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <Space align="start" size={16}>
              <div style={{ background: '#fef3c7', color: '#d97706', padding: '12px', borderRadius: '12px' }}>
                <ClockCircleOutlined style={{ fontSize: '24px' }} />
              </div>
              <div>
                <Title level={5} style={{ margin: 0 }}>Pending Effort</Title>
                <Text type="secondary">{stats.pending} tasks awaiting action</Text>
                <div style={{ marginTop: '8px', fontSize: '20px', fontWeight: 800 }}>{stats.pending}</div>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderRadius: '16px', background: '#f0fdf4', border: '1px solid #dcfce7' }}>
            <Space align="start" size={16}>
              <div style={{ background: '#dcfce7', color: '#16a34a', padding: '12px', borderRadius: '12px' }}>
                <SafetyCertificateOutlined style={{ fontSize: '24px' }} />
              </div>
              <div>
                <Title level={5} style={{ margin: 0 }}>Success Ratio</Title>
                <Text type="secondary">Based on completions</Text>
                <div style={{ marginTop: '8px', fontSize: '20px', fontWeight: 800 }}>
                  {stats.totalAssigned > 0 ? `${Math.round((stats.completed / stats.totalAssigned) * 100)}%` : "0%"}
                </div>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderRadius: '16px', background: '#eff6ff', border: '1px solid #dbeafe' }}>
            <Space align="start" size={16}>
              <div style={{ background: '#dbeafe', color: '#2563eb', padding: '12px', borderRadius: '12px' }}>
                <BarChartOutlined style={{ fontSize: '24px' }} />
              </div>
              <div>
                <Title level={5} style={{ margin: 0 }}>Active Pipeline</Title>
                <Text type="secondary">In-progress assignments</Text>
                <div style={{ marginTop: '8px', fontSize: '20px', fontWeight: 800 }}>
                  {stats.totalAssigned - stats.completed}
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RMDashboardHome;
