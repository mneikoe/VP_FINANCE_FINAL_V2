import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  Input,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
  Avatar,
  Tooltip
} from "antd";
import {
  EyeOutlined,
  PhoneOutlined,
  ReloadOutlined,
  SearchOutlined,
  UserOutlined,
  UserSwitchOutlined,
  EnvironmentOutlined,
  ArrowRightOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  IdcardOutlined
} from "@ant-design/icons";
import axios from "../../../config/axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

const CustomerMaster = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [areas, setAreas] = useState([]);
  const [lastRefreshedAt, setLastRefreshedAt] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    clients: 0,
    prospects: 0,
  });

  const [currentUser] = useState(() => {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  });

  const calculateStats = (clientsData) => {
    const total = clientsData.length;
    const clientsCount = clientsData.filter((c) => c.status === "client").length;
    const prospectsCount = clientsData.filter((c) => c.status === "prospect").length;
    setStats({ total, clients: clientsCount, prospects: prospectsCount });
  };

  const fetchMyCustomers = async () => {
    setLoading(true);
    try {
      const currentRMId = currentUser?._id || currentUser?.id;
      if (!currentRMId) return;

      const response = await axios.get("/api/employee/getClientsByAllocatedRM", {
        params: { allocatedRM: currentRMId },
      });

      if (response.data.success) {
        const allClients = response.data?.data?.clients || [];
        setClients(allClients);
        calculateStats(allClients);
        setLastRefreshedAt(new Date().toLocaleTimeString());

        const uniqueAreas = [...new Set(allClients.map((c) => c.area).filter((a) => a && a !== "N/A"))];
        setAreas(uniqueAreas);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === "RM") fetchMyCustomers();
  }, []);

  const filteredClients = useMemo(() => {
    let filtered = [...clients];
    if (selectedArea !== "all") filtered = filtered.filter(c => c.area === selectedArea);
    if (selectedStatus !== "all") filtered = filtered.filter(c => c.status === selectedStatus);
    if (search.trim()) {
      const s = search.toLowerCase();
      filtered = filtered.filter(c => 
        (c.name || "").toLowerCase().includes(s) || 
        (c.mobileNo || "").toLowerCase().includes(s) || 
        (c.groupCode || "").toLowerCase().includes(s)
      );
    }
    return filtered;
  }, [clients, search, selectedArea, selectedStatus]);

  const getStatusTag = (status) => {
    const config = {
      client: { color: "green", icon: <CheckCircleOutlined /> },
      prospect: { color: "gold", icon: <IdcardOutlined /> },
    };
    const { color } = config[status?.toLowerCase()] || { color: "default" };
    return <Tag color={color} style={{ borderRadius: '6px', fontWeight: 600 }}>{(status || "unknown").toUpperCase()}</Tag>;
  };

  const columns = [
    {
      title: "Customer Profile",
      dataIndex: "name",
      fixed: 'left',
      width: 280,
      render: (name, record) => (
        <Space size="middle">
          <Avatar 
            shape="square" 
            style={{ backgroundColor: '#eef2ff', color: '#4f46e5', borderRadius: '10px' }}
            icon={<UserOutlined />} 
          />
          <div>
            <Text strong style={{ fontSize: '14px', display: 'block' }}>{name || "Unnamed Customer"}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>{record.emailId || "No Email Provided"}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Relationship Status",
      dataIndex: "status",
      width: 150,
      render: (status) => getStatusTag(status),
    },
    {
      title: "Contact",
      width: 180,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: '13px' }}><PhoneOutlined style={{ marginRight: 8, color: '#94a3b8' }} />{record.mobileNo || "N/A"}</Text>
          {record.contactNo && record.contactNo !== "N/A" && <Text type="secondary" style={{ fontSize: '11px' }}>Alt: {record.contactNo}</Text>}
        </Space>
      ),
    },
    {
      title: "Location Details",
      width: 200,
      render: (_, record) => (
        <Space size={4}>
          <EnvironmentOutlined style={{ color: '#94a3b8' }} />
          <Text style={{ fontSize: '13px' }}>{record.area || "N/A"}, {record.city || "N/A"}</Text>
        </Space>
      ),
    },
    {
      title: "Group Code",
      dataIndex: "groupCode",
      width: 150,
      render: (code) => <Tag style={{ fontFamily: 'monospace', fontWeight: 700 }}>{code || "N/A"}</Tag>,
    },
    {
      title: "Actions",
      fixed: 'right',
      width: 140,
      render: (_, record) => (
        <Space>
          <Tooltip title="View Profile">
            <Button 
              shape="circle" 
              type="primary" 
              ghost 
              icon={<EyeOutlined />} 
              onClick={() => navigate(`/rm/suspect/details/${record._id}`)} 
            />
          </Tooltip>
          <Tooltip title="Direct Call">
            <Button 
              shape="circle" 
              icon={<PhoneOutlined />} 
              onClick={() => record.mobileNo && (window.location.href = `tel:${record.mobileNo}`)} 
              disabled={!record.mobileNo}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Stats Cards Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: '16px', height: '100px' }}>
            <Statistic title="Total Customers" value={stats.total} prefix={<UserSwitchOutlined style={{ color: '#4f46e5' }} />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: '16px', height: '100px' }}>
            <Statistic title="Clients" value={stats.clients} valueStyle={{ color: '#10b981' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: '16px', height: '100px' }}>
            <Statistic title="Prospects" value={stats.prospects} valueStyle={{ color: '#f59e0b' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: '16px', height: '100px', background: '#4f46e5', color: 'white' }}>
            <Statistic 
              title={<span style={{ color: 'rgba(255,255,255,0.7)' }}>Active Filter Match</span>} 
              value={filteredClients.length} 
              valueStyle={{ color: 'white' }} 
            />
          </Card>
        </Col>
      </Row>

      {/* Modern Filter Card */}
      <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Input
              size="large"
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              placeholder="Search by name, mobile, code..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              allowClear
              style={{ borderRadius: '12px' }}
            />
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Select
              size="large"
              placeholder="Filter by Area"
              value={selectedArea}
              onChange={setSelectedArea}
              style={{ width: '100%' }}
              prefix={<EnvironmentOutlined />}
              options={[
                { label: "Global (All Areas)", value: "all" },
                ...areas.map(a => ({ label: a, value: a }))
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Select
              size="large"
              placeholder="Life-cycle Status"
              value={selectedStatus}
              onChange={setSelectedStatus}
              style={{ width: '100%' }}
              prefix={<FilterOutlined />}
              options={[
                { label: "All Status", value: "all" },
                { label: "Active Clients", value: "client" },
                { label: "Hot Prospects", value: "prospect" }
              ]}
            />
          </Col>
          <Col xs={24} md={6}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button 
                size="large" 
                icon={<ReloadOutlined />} 
                onClick={fetchMyCustomers} 
                loading={loading}
                style={{ borderRadius: '12px' }}
              >
                Sync
              </Button>
              <Button 
                size="large" 
                onClick={() => { setSearch(""); setSelectedArea("all"); setSelectedStatus("all"); }}
                style={{ borderRadius: '12px' }}
              >
                Reset
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Main Table Card */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card 
          bordered={false} 
          style={{ borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', overflow: 'hidden' }}
          styles={{ body: { padding: 0 } }}
          title={<span style={{ fontWeight: 800 }}>Customer List</span>}
          extra={<Text type="secondary" style={{ fontSize: '12px' }}>Last updated: {lastRefreshedAt}</Text>}
        >
          <Table
            columns={columns}
            dataSource={filteredClients}
            rowKey="_id"
            loading={loading}
            scroll={{ x: 1200 }}
            pagination={{ 
              pageSize: 10, 
              showSizeChanger: true,
              style: { padding: '16px 24px' }
            }}
          />
        </Card>
      </motion.div>
    </div>
  );
};

export default CustomerMaster;
