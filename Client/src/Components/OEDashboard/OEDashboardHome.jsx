import React, { useMemo } from "react";
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
  CheckCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  ArrowRightOutlined,
  BuildOutlined,
  IdcardOutlined,
  ThunderboltOutlined,
  CarryOutOutlined,
  ExclamationCircleOutlined,
  SyncOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";

const { Title, Text } = Typography;

const OEDashboardHome = ({ stats, assignedTasks }) => {
  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) return "-";
    try {
      return format(parseISO(date), "dd MMM");
    } catch (e) {
      return "-";
    }
  };

  const statusConfig = {
    pending: { color: "warning", text: "Pending", icon: <ClockCircleOutlined /> },
    in_progress: { color: "processing", text: "In Progress", icon: <SyncOutlined spin /> },
    completed: { color: "success", text: "Completed", icon: <CheckCircleOutlined /> },
    overdue: { color: "error", text: "Overdue", icon: <ExclamationCircleOutlined /> },
    assigned: { color: "purple", text: "Assigned", icon: <CarryOutOutlined /> },
  };

  const columns = [
    {
      title: "Task ID",
      dataIndex: "taskId",
      key: "taskId",
      width: 120,
      render: (id) => (
        <Space>
          <div style={{ padding: '6px', background: '#ecfeff', borderRadius: '8px', display: 'flex' }}>
            <IdcardOutlined style={{ color: '#0891b2' }} />
          </div>
          <Text strong style={{ fontSize: '12px' }}>{id || "N/A"}</Text>
        </Space>
      )
    },
    {
      title: "Task Description",
      key: "description",
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937' }}>{record.description || record.taskType || "N/A"}</div>
          {record.category && <Text type="secondary" style={{ fontSize: '11px' }}>Category: {record.category}</Text>}
        </div>
      )
    },
    {
      title: "Customer",
      key: "customer",
      render: (_, record) => (
        <Space align="start">
          <BuildOutlined style={{ color: '#94a3b8', marginTop: 4 }} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500 }}>{record.customerName || "N/A"}</div>
            {record.customerCode && <Text type="secondary" style={{ fontSize: '11px' }}>Code: {record.customerCode}</Text>}
          </div>
        </Space>
      )
    },
    {
      title: "Due Date",
      key: "dueDate",
      width: 140,
      render: (_, record) => (
        record.dueDate ? (
          <div>
            <Space style={{ fontSize: '13px', fontWeight: 500 }}>
              <CalendarOutlined style={{ color: '#0891b2' }} />
              {formatDate(record.dueDate)}
            </Space>
            {record.dueTime && <div style={{ fontSize: '10px', color: '#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: 4 }}>{record.dueTime}</div>}
          </div>
        ) : <Text type="secondary" italic>No due date</Text>
      )
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status, record) => {
        const config = statusConfig[status] || { color: "default", text: status || "N/A" };
        return (
          <Space direction="vertical" size={4}>
            <Tag color={config.color} icon={config.icon} style={{ borderRadius: '6px', fontWeight: 600 }}>
              {config.text.toUpperCase()}
            </Tag>
            {record.priority && <Tag style={{ fontSize: '10px', margin: 0 }}>{record.priority.toUpperCase()}</Tag>}
          </Space>
        );
      }
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Stats Overview */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <Statistic 
              title="Total Assigned" 
              value={stats.totalAssigned} 
              prefix={<ThunderboltOutlined style={{ color: '#0891b2' }} />} 
              valueStyle={{ color: '#1f2937', fontWeight: 800 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <Statistic 
              title="Completed" 
              value={stats.completed} 
              prefix={<CheckCircleOutlined style={{ color: '#10b981' }} />} 
              valueStyle={{ color: '#1f2937', fontWeight: 800 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <Statistic 
              title="Today's Tasks" 
              value={stats.todayTasks} 
              prefix={<ClockCircleOutlined style={{ color: '#f59e0b' }} />} 
              valueStyle={{ color: '#1f2937', fontWeight: 800 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <Statistic 
              title="Upcoming" 
              value={stats.upcomingTasks} 
              prefix={<CalendarOutlined style={{ color: '#8b5cf6' }} />} 
              valueStyle={{ color: '#1f2937', fontWeight: 800 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table Section */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card 
          title={<Title level={4} style={{ margin: 0 }}>Recent Assignments</Title>}
          extra={<Button type="primary" icon={<ArrowRightOutlined />} onClick={() => navigate("/oe/task-summary")}>View Full Registry</Button>}
          bordered={false}
          style={{ borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', overflow: 'hidden' }}
          styles={{ body: { padding: 0 } }}
        >
          <Table 
            columns={columns} 
            dataSource={assignedTasks.slice(0, 8)} 
            rowKey="id" 
            pagination={false}
            onRow={(record) => ({
              onClick: () => navigate(`/oe/task/details/${record.id}`),
              style: { cursor: 'pointer' }
            })}
            locale={{
              emptyText: <Empty description="No recent assignments found" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            }}
          />
          {assignedTasks.length > 8 && (
            <div style={{ padding: '16px', textAlign: 'center', borderTop: '1px solid #f0f0f0' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>Showing 8 of {assignedTasks.length} active tasks</Text>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Analytics Summary */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card style={{ borderRadius: '16px', borderLeft: '4px solid #f59e0b' }}>
            <Statistic 
              title="Pending Action" 
              value={stats.pending} 
              prefix={<ExclamationCircleOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card style={{ borderRadius: '16px', borderLeft: '4px solid #10b981' }}>
            <Statistic 
              title="Completion Velocity" 
              value={stats.totalAssigned > 0 ? Math.round((stats.completed / stats.totalAssigned) * 100) : 0} 
              suffix="%" 
              prefix={<ThunderboltOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card style={{ borderRadius: '16px', borderLeft: '4px solid #0891b2' }}>
            <Statistic 
              title="Active Queue" 
              value={stats.totalAssigned - stats.completed} 
              prefix={<BuildOutlined />} 
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OEDashboardHome;
