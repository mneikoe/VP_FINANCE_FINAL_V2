import React from "react";
import { Card, Typography, Row, Col } from "antd";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from "recharts";

const { Title, Text } = Typography;

const growthData = [
  { name: "Jan", leads: 400, clients: 240 },
  { name: "Feb", leads: 300, clients: 139 },
  { name: "Mar", leads: 200, clients: 980 },
  { name: "Apr", leads: 278, clients: 390 },
  { name: "May", leads: 189, clients: 480 },
  { name: "Jun", leads: 239, clients: 380 },
  { name: "Jul", leads: 349, clients: 430 }
];

const taskDistData = [
  { name: "Composite", value: 400, color: "#1890ff" },
  { name: "Marketing", value: 300, color: "#722ed1" },
  { name: "Servicing", value: 200, color: "#52c41a" }
];

const DashboardCharts = () => {
  return (
    <Row gutter={[16, 16]}>
      {/* Growth Chart */}
      <Col xs={24} lg={16}>
        <Card
          title={
            <div style={{ padding: "8px 0" }}>
              <Title level={5} style={{ margin: 0 }}>Growth Overview</Title>
              <Text type="secondary" style={{ fontSize: "12px", fontWeight: "normal" }}>
                Leads vs Clients performance over the last 7 months
              </Text>
            </div>
          }
          bordered={false}
          style={{
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
            height: "100%"
          }}
        >
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1890ff" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#1890ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#52c41a" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#52c41a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#8c8c8c", fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#8c8c8c", fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                />
                <Area
                  type="monotone"
                  dataKey="leads"
                  stroke="#1890ff"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorLeads)"
                />
                <Area
                  type="monotone"
                  dataKey="clients"
                  stroke="#52c41a"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorClients)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </Col>

      {/* Task Distribution */}
      <Col xs={24} lg={8}>
        <Card
          title={
            <div style={{ padding: "8px 0" }}>
              <Title level={5} style={{ margin: 0 }}>Task Distribution</Title>
              <Text type="secondary" style={{ fontSize: "12px", fontWeight: "normal" }}>
                Active tasks across categories
              </Text>
            </div>
          }
          bordered={false}
          style={{
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
            height: "100%"
          }}
        >
          <div style={{ width: "100%", height: 300, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={taskDistData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskDistData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ marginTop: "20px" }}>
              {taskDistData.map((item, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: item.color }} />
                    <Text style={{ fontSize: "13px" }}>{item.name}</Text>
                  </div>
                  <Text strong style={{ fontSize: "13px" }}>{item.value}</Text>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardCharts;
