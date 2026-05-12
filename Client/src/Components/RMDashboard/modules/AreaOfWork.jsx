import React, { useState, useEffect, useMemo } from "react";
import {
  Layout,
  Row,
  Col,
  Card,
  Table,
  Tag,
  Button,
  Tabs,
  Typography,
  Space,
  Badge,
  Input,
  Select,
  Statistic,
  Spin,
  Alert,
  Tooltip,
  Divider,
  Avatar,
  ConfigProvider
} from "antd";
import {
  EnvironmentOutlined,
  SyncOutlined,
  TeamOutlined,
  FilterOutlined,
  SearchOutlined,
  EyeOutlined,
  PhoneOutlined,
  UserOutlined,
  ShopOutlined,
  EnvironmentTwoTone,
  DashboardOutlined,
  CheckCircleOutlined,
  UserAddOutlined,
  BlockOutlined,
  GlobalOutlined
} from "@ant-design/icons";
import axios from "../../../config/axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const AreaOfWork = () => {
  const navigate = useNavigate();
  const [rmData, setRmData] = useState(null);
  const [areas, setAreas] = useState([]);
  const [subAreas, setSubAreas] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingClients, setLoadingClients] = useState(false);
  const [activeTab, setActiveTab] = useState("area");
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    clientType: "all",
    search: "",
    subArea: "all",
  });

  const currentUser = useMemo(() => {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch (err) { return null; }
  }, []);

  const fetchRmData = async () => {
    setLoading(true);
    setError(null);
    try {
      const rmId = currentUser?.id || currentUser?._id;
      if (!rmId) { setError("Identity undefined"); return; }

      const rmResponse = await axios.get(`/api/employee/getEmployeeById?employeeId=${rmId}`);
      if (rmResponse.data.success) {
        const data = rmResponse.data.data;
        setRmData(data);
        if (data.workArea) {
          await Promise.all([fetchAreasAndSubAreas(), fetchClientsAndProspects(data.workArea)]);
        } else {
          setError("No operational jurisdiction assigned.");
        }
      }
    } catch (err) { setError("Data synthesis failed."); }
    finally { setLoading(false); }
  };

  const fetchAreasAndSubAreas = async () => {
    try {
      const [aRes, sRes] = await Promise.all([
        axios.get("/api/leadarea"),
        axios.get("/api/leadsubarea")
      ]);
      setAreas(aRes.data || []);
      setSubAreas(sRes.data || []);
    } catch (err) { console.error("Auxiliary fetch failed", err); }
  };

  const fetchClientsAndProspects = async (area, subArea = null) => {
    setLoadingClients(true);
    try {
      let url = `/api/employee/getClientsByArea?area=${encodeURIComponent(area)}`;
      if (subArea && subArea !== "all") url += `&subArea=${encodeURIComponent(subArea)}`;
      
      const response = await axios.get(url);
      if (response.data.success) {
        setClients((response.data.data || []).filter(i => i.status === "client" || i.status === "prospect"));
      }
    } finally { setLoadingClients(false); }
  };

  useEffect(() => { if (currentUser) fetchRmData(); }, [currentUser]);

  const rmAreaDetails = useMemo(() => areas.find(a => a.name === rmData?.workArea), [areas, rmData]);
  const rmSubAreas = useMemo(() => {
    if (!rmAreaDetails) return [];
    return subAreas.filter(s => (s.areaId?._id || s.areaId) === rmAreaDetails._id);
  }, [subAreas, rmAreaDetails]);

  const displayClients = useMemo(() => {
    return clients.filter(c => {
      const typeMatch = filters.clientType === "all" || c.status === filters.clientType;
      const searchLower = filters.search.toLowerCase();
      const searchMatch = !filters.search || 
        c.name?.toLowerCase().includes(searchLower) || 
        c.mobileNo?.toLowerCase().includes(searchLower) ||
        c.organisation?.toLowerCase().includes(searchLower);
      return typeMatch && searchMatch;
    });
  }, [clients, filters]);

  const stats = useMemo(() => ({
    total: clients.length,
    clients: clients.filter(c => c.status === "client").length,
    prospects: clients.filter(c => c.status === "prospect").length,
  }), [clients]);

  const columns = [
    {
      title: "Name",
      key: "name",
      render: (_, c) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: c.status === 'client' ? '#10b981' : '#3b82f6' }} />
          <div>
            <Text strong>{c.name}</Text>
            <div style={{ fontSize: '12px', color: '#64748b' }}>{c.groupCode || 'No Code'}</div>
          </div>
        </Space>
      )
    },
    {
      title: "Contact",
      dataIndex: "mobileNo",
      render: (m) => <Space><PhoneOutlined style={{ color: '#10b981' }} /> {m}</Space>
    },
    {
      title: "Category",
      dataIndex: "status",
      render: (s) => (
        <Tag color={s === 'client' ? 'green' : 'blue'} icon={s === 'client' ? <CheckCircleOutlined /> : <UserAddOutlined />}>
          {s.toUpperCase()}
        </Tag>
      )
    },
    {
      title: "Sub-Area",
      dataIndex: "subArea",
      render: (sa) => <Tag color="geekblue">{sa || 'Main'}</Tag>
    },
    {
      title: "Enterprise",
      dataIndex: "organisation",
      render: (o) => <Space><ShopOutlined style={{ color: '#f59e0b' }} /> {o || 'Individual'}</Space>
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, c) => (
        <Button type="primary" ghost icon={<EyeOutlined />} onClick={() => navigate(`/rm/suspect/details/${c._id}`)}>View Profile</Button>
      )
    }
  ];

  if (loading) return <div style={{ height: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spin size="large" tip="Mapping Jurisdiction..." /></div>;

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#4f46e5', borderRadius: 12 } }}>
      <Content style={{ padding: '24px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Row gutter={[24, 24]}>
            {/* Jurisdiction Info */}
            <Col xs={24} lg={8}>
              <Card 
                title={<Space><GlobalOutlined /><span>Work Area Summary</span></Space>}
                extra={<Button icon={<SyncOutlined />} onClick={fetchRmData} />}
                style={{ borderRadius: 20, height: '100%' }}
              >
                {rmAreaDetails ? (
                  <Space direction="vertical" style={{ width: '100%' }} size={24}>
                    <div style={{ textAlign: 'center', padding: '20px 0', background: 'linear-gradient(135deg, #4f46e510, #8b5cf610)', borderRadius: 16 }}>
                      <EnvironmentTwoTone twoToneColor="#4f46e5" style={{ fontSize: 40 }} />
                      <Title level={3} style={{ margin: '8px 0 0 0' }}>{rmAreaDetails.name}</Title>
                      <Text type="secondary">{rmAreaDetails.city} • {rmAreaDetails.pincode}</Text>
                    </div>
                    <Row gutter={[16, 16]}>
                      <Col span={12}><Statistic title="Active Clients" value={stats.clients} valueStyle={{ color: '#10b981' }} /></Col>
                      <Col span={12}><Statistic title="Target Prospects" value={stats.prospects} valueStyle={{ color: '#3b82f6' }} /></Col>
                    </Row>
                    <Divider style={{ margin: '8px 0' }} />
                    <Text strong><BlockOutlined /> Sub-Areas Defined</Text>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {rmSubAreas.map(s => <Tag key={s._id} color="indigo">{s.subAreaName}</Tag>)}
                      {rmSubAreas.length === 0 && <Text type="secondary">Primary Sector Only</Text>}
                    </div>
                  </Space>
                ) : <Alert message="Area Unassigned" type="warning" showIcon />}
              </Card>
            </Col>

            {/* Clients Management */}
            <Col xs={24} lg={16}>
              <Card style={{ borderRadius: 20 }}>
                <Tabs 
                  activeKey={activeTab} 
                  onChange={setActiveTab}
                  items={[
                    {
                      key: 'area',
                      label: <Space><DashboardOutlined /><span>Area Overview</span></Space>,
                      children: (
                        <div style={{ padding: '20px 0' }}>
                          <Alert message="Strategic Area Overview" description="Manage your assigned territory efficiently. Filter by sub-area or customer type to identify key opportunities." type="info" showIcon />
                        </div>
                      )
                    },
                    {
                      key: 'clients',
                      label: <Space><TeamOutlined /><span>Client/Prospect List</span></Space>,
                      children: (
                        <div style={{ marginTop: 20 }}>
                          <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                            <Col xs={24} md={8}>
                              <Input prefix={<SearchOutlined />} placeholder="Search by name/enterprise..." value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} size="large" allowClear />
                            </Col>
                            <Col xs={24} md={8}>
                              <Select style={{ width: '100%' }} value={filters.clientType} onChange={v => setFilters({...filters, clientType: v})} size="large">
                                <Option value="all">All Portfolios</Option>
                                <Option value="client">Active Clients</Option>
                                <Option value="prospect">Future Prospects</Option>
                              </Select>
                            </Col>
                            <Col xs={24} md={8}>
                              <Select style={{ width: '100%' }} value={filters.subArea} onChange={v => { setFilters({...filters, subArea: v}); fetchClientsAndProspects(rmData?.workArea, v); }} size="large">
                                <Option value="all">All Sub-Areas</Option>
                                {rmSubAreas.map(s => <Option key={s._id} value={s.subAreaName}>{s.subAreaName}</Option>)}
                              </Select>
                            </Col>
                          </Row>
                          <Table columns={columns} dataSource={displayClients} rowKey="_id" loading={loadingClients} pagination={{ pageSize: 8 }} scroll={{ x: 800 }} />
                        </div>
                      )
                    }
                  ]}
                />
              </Card>
            </Col>
          </Row>
        </motion.div>
      </Content>
    </ConfigProvider>
  );
};

export default AreaOfWork;
