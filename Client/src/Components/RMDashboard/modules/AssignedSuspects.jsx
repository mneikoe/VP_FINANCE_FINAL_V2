import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Empty,
  Input,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
  Row,
  Col,
  Tooltip,
  Avatar
} from "antd";
import {
  CalendarOutlined,
  PhoneOutlined,
  ReloadOutlined,
  SearchOutlined,
  UserOutlined,
  IdcardOutlined,
  EnvironmentOutlined,
  ArrowRightOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined
} from "@ant-design/icons";
import axios from "../../../config/axios";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

const AssignedTasks = ({ user }) => {
  const navigate = useNavigate();
  const [assignedSuspects, setAssignedSuspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchAssignedSuspects = async () => {
    try {
      setLoading(true);
      const rmId = user?.id || JSON.parse(localStorage.getItem("user") || "{}").id;
      if (!rmId) return;
      
      const response = await axios.get("/api/rm/assigned-suspects", {
        params: { rmId },
      });
      if (response.data.success) {
        setAssignedSuspects(response.data.data || []);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedSuspects();
  }, [user]);

  const filteredSuspects = useMemo(() => {
    if (!search.trim()) return assignedSuspects;
    const searchTerm = search.toLowerCase();
    return assignedSuspects.filter(
      (s) =>
        (s.groupName || "").toLowerCase().includes(searchTerm) ||
        (s.groupCode || "").toLowerCase().includes(searchTerm) ||
        (s.mobile || "").toLowerCase().includes(searchTerm) ||
        (s.city || "").toLowerCase().includes(searchTerm) ||
        (s.organisation || "").toLowerCase().includes(searchTerm)
    );
  }, [assignedSuspects, search]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusTag = (status) => {
    const config = {
      client: { color: "green", icon: <CheckCircleOutlined /> },
      prospect: { color: "gold", icon: <ThunderboltOutlined /> },
      suspect: { color: "blue", icon: <UserOutlined /> },
    };
    const { color } = config[status?.toLowerCase()] || { color: "default" };
    return <Tag color={color} style={{ borderRadius: '6px', fontWeight: 600 }}>{(status || "N/A").toUpperCase()}</Tag>;
  };

  const columns = [
    {
      title: "Group Name",
      dataIndex: "groupName",
      fixed: 'left',
      width: 250,
      render: (name, record) => (
        <Space size="middle">
          <Avatar 
            shape="square" 
            style={{ backgroundColor: '#eef2ff', color: '#4f46e5', borderRadius: '8px' }}
            icon={<IdcardOutlined />} 
          />
          <div>
            <Text strong style={{ fontSize: '14px', display: 'block' }}>{name || "N/A"}</Text>
            <Text type="secondary" style={{ fontSize: '12px', fontFamily: 'monospace' }}>{record.groupCode || "N/A"}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Organisation",
      dataIndex: "organisation",
      width: 200,
      render: (text) => <Text style={{ fontSize: '13px' }}>{text || "N/A"}</Text>,
    },
    {
      title: "Contact Info",
      width: 180,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: '13px' }}><PhoneOutlined style={{ marginRight: 8, color: '#94a3b8' }} />{record.mobile || record.mobileNo || "N/A"}</Text>
          {record.contactNo && record.contactNo !== "N/A" && <Text type="secondary" style={{ fontSize: '11px' }}>Alt: {record.contactNo}</Text>}
        </Space>
      ),
    },
    {
      title: "Location",
      width: 180,
      render: (_, record) => (
        <Space size={4}>
          <EnvironmentOutlined style={{ color: '#94a3b8' }} />
          <Text style={{ fontSize: '13px' }}>{record.city || "-"}, {record.area || "-"}</Text>
        </Space>
      ),
    },
    {
      title: "Appointment",
      width: 180,
      render: (_, record) => (
        record.appointmentDate ? (
          <Space direction="vertical" size={0}>
            <Text strong style={{ color: '#4f46e5' }}><CalendarOutlined style={{ marginRight: 6 }} />{formatDate(record.appointmentDate)}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>{record.appointmentTime || "Time N/A"}</Text>
          </Space>
        ) : <Text type="secondary" italic>Unscheduled</Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (status) => getStatusTag(status),
    },
    {
      title: "Actions",
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="Direct Call">
            <Button 
              shape="circle" 
              icon={<PhoneOutlined />} 
              type="primary" 
              ghost 
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `tel:${record.mobile || record.mobileNo}`;
              }}
            />
          </Tooltip>
          <Tooltip title="View Detailed Profile">
            <Button 
              shape="circle" 
              icon={<ArrowRightOutlined />} 
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/rm/suspect/details/${record.id || record._id}`);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Search and Action Bar */}
      <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col xs={24} md={12} lg={8}>
            <Input
              size="large"
              placeholder="Search across your pipeline..."
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ borderRadius: '12px' }}
              allowClear
            />
          </Col>
          <Col>
            <Space>
              <Button 
                size="large" 
                icon={<ReloadOutlined />} 
                onClick={fetchAssignedSuspects} 
                loading={loading}
                style={{ borderRadius: '12px' }}
              >
                Refresh
              </Button>
              <Button 
                size="large" 
                type="primary" 
                icon={<MessageOutlined />}
                style={{ borderRadius: '12px' }}
              >
                Send Bulk SMS
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Statistics Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic title="Total Pipeline" value={assignedSuspects.length} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic title="Search Matches" value={filteredSuspects.length} valueStyle={{ color: '#4f46e5' }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Statistic title="Appointments" value={assignedSuspects.filter(s => s.appointmentDate).length} prefix={<CalendarOutlined />} />
          </Card>
        </Col>
      </Row>

      {/* Main Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card 
          bordered={false} 
          style={{ borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', overflow: 'hidden' }}
          styles={{ body: { padding: 0 } }}
        >
          <Table
            columns={columns}
            dataSource={filteredSuspects}
            loading={loading}
            rowKey={record => record.id || record._id}
            scroll={{ x: 1200 }}
            pagination={{ 
              pageSize: 10, 
              showSizeChanger: true,
              style: { padding: '16px 24px' }
            }}
            onRow={(record) => ({
              onClick: () => navigate(`/rm/suspect/details/${record.id || record._id}`),
              style: { cursor: 'pointer' }
            })}
          />
        </Card>
      </motion.div>
    </div>
  );
};

export default AssignedTasks;
