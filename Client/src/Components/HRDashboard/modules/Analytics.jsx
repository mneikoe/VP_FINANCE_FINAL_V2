import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from "recharts";
import { 
  Row, Col, Card, Statistic, Typography, Space, Progress, Timeline, 
  Badge, Button, Empty, Divider, Select 
} from "antd";
import {
  UserOutlined,
  CheckCircleOutlined,
  LineChartOutlined,
  PieChartOutlined,
  ArrowUpOutlined,
  SyncOutlined,
  RiseOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;
const { Option } = Select;

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    candidatesByStage: [],
    marksDistribution: [],
    designationStats: [],
    monthlyHires: [],
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/addcandidate");
      const candidates = response.data.candidates || [];

      // Process Stages
      const stages = ["Career Enquiry", "Resume Shortlisted", "Interview Process", "Selected", "Joining Data"];
      const candidatesByStage = stages.map(s => ({
        name: s.split(' ')[0], 
        count: candidates.filter(c => c.currentStage === s).length
      }));

      // Process Marks
      const marksRanges = [
        { name: "0-15", min: 0, max: 15 },
        { name: "16-25", min: 16, max: 25 },
        { name: "26+", min: 26, max: 100 },
      ];
      const marksDistribution = marksRanges.map(r => ({
        name: r.name,
        value: candidates.filter(c => (c.totalMarks || 0) >= r.min && (c.totalMarks || 0) <= r.max).length
      }));

      // Designation Stats
      const designations = [...new Set(candidates.map(c => c.designation).filter(Boolean))];
      const designationStats = designations.slice(0, 5).map(d => ({
        name: d,
        total: candidates.filter(c => c.designation === d).length,
        selected: candidates.filter(c => c.designation === d && c.currentStage === "Selected").length
      }));

      setData({
        candidatesByStage,
        marksDistribution,
        designationStats,
        monthlyHires: [
            { name: "Jan", count: 4 }, { name: "Feb", count: 7 }, { name: "Mar", count: 5 },
            { name: "Apr", count: 9 }, { name: "May", count: 12 }, { name: "Jun", count: 8 }
        ]
      });
    } catch (error) {
      console.error("Analytics load failed", error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ["#1890ff", "#52c41a", "#faad14", "#f5222d", "#722ed1"];

  return (
    <div className="fade-in">
      <Card bordered={false} style={{ borderRadius: 12, marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0 }}>HR Analytics & Insights</Title>
            <Text type="secondary">Data-driven recruitment performance monitoring</Text>
          </Col>
          <Col>
            <Button icon={<SyncOutlined />} onClick={loadAnalytics} loading={loading}>Refresh</Button>
          </Col>
        </Row>
      </Card>

      {/* Primary Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} hoverable>
                <Statistic 
                    title="Total Applicants" 
                    value={data.candidatesByStage.reduce((a, b) => a + b.count, 0)} 
                    prefix={<TeamOutlined />} 
                    valueStyle={{ color: '#1890ff' }}
                />
                <Text type="secondary" style={{ fontSize: 11 }}><ArrowUpOutlined /> 12% from last month</Text>
            </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} hoverable>
                <Statistic 
                    title="Conversion Rate" 
                    value={18.4} 
                    suffix="%" 
                    prefix={<RiseOutlined />} 
                    valueStyle={{ color: '#52c41a' }}
                />
                <Progress percent={18.4} size="small" strokeColor="#52c41a" showInfo={false} />
            </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} hoverable>
                <Statistic 
                    title="Avg Screening Score" 
                    value={28.5} 
                    prefix={<LineChartOutlined />} 
                    valueStyle={{ color: '#faad14' }}
                />
                <Text type="secondary" style={{ fontSize: 11 }}>Target: 25.0</Text>
            </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} hoverable>
                <Statistic 
                    title="Active Vacancies" 
                    value={14} 
                    prefix={<UserOutlined />} 
                    valueStyle={{ color: '#722ed1' }}
                />
                <Text type="secondary" style={{ fontSize: 11 }}>4 Urgent Requirements</Text>
            </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Recruitment Funnel */}
        <Col xs={24} lg={16}>
          <Card title={<Space><LineChartOutlined /> Recruitment Funnel (By Stage)</Space>} bordered={false} style={{ borderRadius: 12 }}>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <AreaChart data={data.candidatesByStage}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1890ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <ChartTooltip />
                  <Area type="monotone" dataKey="count" stroke="#1890ff" fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Scoring Distribution */}
        <Col xs={24} lg={8}>
          <Card title={<Space><PieChartOutlined /> Scoring Distribution</Space>} bordered={false} style={{ borderRadius: 12 }}>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data.marksDistribution}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.marksDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Designation Efficiency */}
        <Col xs={24} lg={12}>
            <Card title="Designation Performance (Selected vs Total)" bordered={false} style={{ borderRadius: 12 }}>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={data.designationStats} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} />
                            <ChartTooltip />
                            <Legend />
                            <Bar dataKey="total" fill="#d9d9d9" name="Applicants" radius={[0, 4, 4, 0]} />
                            <Bar dataKey="selected" fill="#52c41a" name="Selections" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </Col>

        {/* Timeline of Events */}
        <Col xs={24} lg={12}>
            <Card title="Recent Milestones" bordered={false} style={{ borderRadius: 12 }}>
                <Timeline mode="left" style={{ marginTop: 20 }}>
                    <Timeline.Item color="green" label="Today">New candidate onboarded for Sales Manager</Timeline.Item>
                    <Timeline.Item label="Yesterday">Interview round 2 completed for IT Executive</Timeline.Item>
                    <Timeline.Item color="blue" label="2 days ago">5 New vacancies published in portal</Timeline.Item>
                    <Timeline.Item color="red" label="3 days ago">Monthly HR performance review meeting</Timeline.Item>
                    <Timeline.Item label="4 days ago">Business associate partnership renewed</Timeline.Item>
                </Timeline>
            </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;
