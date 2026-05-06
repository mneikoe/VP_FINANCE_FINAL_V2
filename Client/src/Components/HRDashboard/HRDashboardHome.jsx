import React, { useState, useEffect } from "react";
import { 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Typography, 
  List, 
  Avatar, 
  Tag, 
  Button, 
  Space, 
  Progress, 
  Empty, 
  Spin,
  Tooltip
} from "antd";
import {
  FileTextOutlined,
  UserAddOutlined,
  CalendarOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SyncOutlined,
  MailOutlined,
  SolutionOutlined,
  RocketOutlined,
  RiseOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const HRDashboardHome = () => {
  const [stats, setStats] = useState({
    totalVacancies: 0,
    activeCandidates: 0,
    interviewsToday: 0,
    newApplications: 0,
    shortlistedCandidates: 0,
    businessAssociates: 0,
    selectedCandidates: 0,
    offerLettersSent: 0,
  });

  const [recentCandidates, setRecentCandidates] = useState([]);
  const [recentVacancies, setRecentVacancies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [vacanciesRes, candidatesRes, associatesRes] = await Promise.all([
        axios.get("/api/vacancynotice"),
        axios.get("/api/addcandidate"),
        axios.get("/api/business-associates")
      ]);

      const vacancies = vacanciesRes.data.vacancies || [];
      const candidates = candidatesRes.data.candidates || [];
      const associates = associatesRes.data.data || [];

      const today = dayjs().format("YYYY-MM-DD");
      const interviewsToday = candidates.filter(c => c.interviewDate && dayjs(c.interviewDate).format("YYYY-MM-DD") === today);
      
      const shortlisted = candidates.filter(c => c.currentStage === "Resume Shortlisted" || c.shortlisted);
      const selected = candidates.filter(c => ["Selected", "Joining Data", "Added as Employee"].includes(c.currentStage));
      const offers = candidates.filter(c => c.currentStage === "Offer Letter Sent");

      setStats({
        totalVacancies: vacancies.length,
        activeCandidates: candidates.length,
        interviewsToday: interviewsToday.length,
        newApplications: candidates.filter(c => c.currentStage === "Career Enquiry").length,
        shortlistedCandidates: shortlisted.length,
        businessAssociates: associates.length,
        selectedCandidates: selected.length,
        offerLettersSent: offers.length,
      });

      setRecentCandidates(candidates.slice(0, 5));
      setRecentVacancies(vacancies.slice(0, 4));
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: "Total Vacancies", value: stats.totalVacancies, icon: <FileTextOutlined />, color: "#1890ff", sub: "Active openings" },
    { title: "Active Candidates", value: stats.activeCandidates, icon: <TeamOutlined />, color: "#52c41a", sub: "In pipeline" },
    { title: "Interviews Today", value: stats.interviewsToday, icon: <CalendarOutlined />, color: "#faad14", sub: "Scheduled" },
    { title: "Business Associates", value: stats.businessAssociates, icon: <RocketOutlined />, color: "#13c2c2", sub: "Partners" },
    { title: "Shortlisted", value: stats.shortlistedCandidates, icon: <CheckCircleOutlined />, color: "#722ed1", sub: "Qualified" },
    { title: "Selected", value: stats.selectedCandidates, icon: <RiseOutlined />, color: "#eb2f96", sub: "Converted" },
    { title: "Offer Letters", value: stats.offerLettersSent, icon: <MailOutlined />, color: "#2f54eb", sub: "Sent" },
    { title: "New Enquiries", value: stats.newApplications, icon: <UserAddOutlined />, color: "#fa8c16", sub: "Recent" },
  ];

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <Spin size="large" tip="Loading Dashboard Data..." />
    </div>
  );

  return (
    <div className="fade-in">
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>Dashboard Overview</Title>
          <Text type="secondary">Welcome back! Here's what's happening today.</Text>
        </Col>
        <Col>
          <Button icon={<SyncOutlined />} onClick={loadDashboardData}>Refresh</Button>
        </Col>
      </Row>

      {/* Stats Grid */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statCards.map((item, index) => (
          <Col xs={12} sm={8} lg={6} key={index}>
            <Card bordered={false} className="stat-card" hoverable style={{ borderRadius: 12 }}>
              <Space align="start">
                <div style={{ 
                  width: 40, height: 40, borderRadius: 10, background: `${item.color}15`, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, fontSize: 20 
                }}>
                  {item.icon}
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 13 }}>{item.title}</Text>
                  <Title level={3} style={{ margin: 0 }}>{item.value}</Title>
                  <Text type="secondary" style={{ fontSize: 11 }}>{item.sub}</Text>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        {/* Recent Candidates */}
        <Col xs={24} lg={16}>
          <Card 
            title={<Space><TeamOutlined /> Recent Candidates</Space>} 
            extra={<Link to="/dashboard/add-candidate">View All</Link>}
            bordered={false}
            style={{ borderRadius: 12 }}
          >
            <List
              itemLayout="horizontal"
              dataSource={recentCandidates}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Tag color="blue">{item.currentStage || "Pending"}</Tag>,
                    <Link to="/dashboard/resume-shortlist">Details</Link>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar style={{ backgroundColor: '#1890ff' }}>{item.candidateName?.charAt(0).toUpperCase()}</Avatar>}
                    title={item.candidateName}
                    description={
                      <Space split={<Text type="secondary">|</Text>}>
                        <Text type="secondary"><MailOutlined /> {item.email}</Text>
                        <Text type="secondary"><SolutionOutlined /> {item.designation}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
              locale={{ emptyText: <Empty description="No recent candidates" /> }}
            />
          </Card>
        </Col>

        {/* Quick Insights & Recent Vacancies */}
        <Col xs={24} lg={8}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Card title={<Space><ClockCircleOutlined /> Recruitment Progress</Space>} bordered={false} style={{ borderRadius: 12 }}>
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <Progress 
                  type="dashboard" 
                  percent={Math.round((stats.selectedCandidates / (stats.activeCandidates || 1)) * 100)} 
                  strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                />
                <div style={{ marginTop: 10 }}>
                  <Text strong>Conversion Rate</Text><br/>
                  <Text type="secondary">Selection vs Pipeline</Text>
                </div>
              </div>
            </Card>

            <Card 
              title={<Space><FileTextOutlined /> Latest Vacancies</Space>} 
              extra={<Link to="/dashboard/vacancies">Manage</Link>}
              bordered={false}
              style={{ borderRadius: 12 }}
            >
              <List
                dataSource={recentVacancies}
                renderItem={(item) => (
                  <List.Item style={{ padding: '12px 0' }}>
                    <List.Item.Meta
                      title={<Text strong>{item.designation}</Text>}
                      description={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>{dayjs(item.createdDate).format("D MMM")}</Text>
                          <Tag color={item.status === "Active" ? "success" : "default"}>{item.status}</Tag>
                        </div>
                      }
                    />
                  </List.Item>
                )}
                locale={{ emptyText: <Empty description="No active vacancies" /> }}
              />
            </Card>
          </Space>
        </Col>
      </Row>

      <style>{`
        .stat-card {
          transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
        }
        .ant-list-item-meta-title { margin-bottom: 4px !important; }
      `}</style>
    </div>
  );
};

export default HRDashboardHome;
