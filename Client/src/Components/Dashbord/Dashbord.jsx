import React from "react";
import { Typography, Row, Col, Space, Button, Card, Statistic, Divider } from "antd";
import { ReloadOutlined, ExportOutlined, ArrowUpOutlined } from "@ant-design/icons";
import DashboardCards from "./DashboardCards";
import DashboardCharts from "./DashboardCharts";
import DashboardQuickLinks from "./DashboardQuickLinks";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

const Dashbord = () => {
  return (
    <div style={{ padding: "0", minHeight: "100vh" }}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          marginBottom: "32px", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          background: "white",
          padding: "24px",
          borderRadius: "16px",
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 800, color: "#1e293b", letterSpacing: "-0.02em" }}>
            Operational Overview
          </Title>
          <Text type="secondary" style={{ fontSize: "15px", color: "#64748b" }}>
            Welcome back! Here's a summary of your workspace activities.
          </Text>
        </div>
        <Space size="middle">
          <Button 
            icon={<ReloadOutlined />} 
            style={{ borderRadius: '8px', height: '40px', fontWeight: 600 }}
          >
            Refresh
          </Button>
          <Button 
            type="primary" 
            icon={<ExportOutlined />}
            style={{ borderRadius: '8px', height: '40px', fontWeight: 600, boxShadow: '0 4px 6px -1px rgb(37 99 235 / 0.2)' }}
          >
            Export Report
          </Button>
        </Space>
      </motion.div>

      {/* Tier 1: Stat Cards */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: "32px" }}
      >
        <DashboardCards />
      </motion.div>

      <Row gutter={[32, 32]}>
        {/* Tier 2: Charts Overview */}
        <Col xs={24} xl={16}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card 
              title={<span style={{ fontWeight: 700, color: '#1e293b' }}>Performance Analytics</span>}
              bordered={false}
              style={{ borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
            >
              <DashboardCharts />
            </Card>
          </motion.div>
        </Col>

        {/* Tier 3: Quick Access Links & Recent Info */}
        <Col xs={24} xl={8}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card 
              title={<span style={{ fontWeight: 700, color: '#1e293b' }}>Quick Actions</span>}
              bordered={false}
              style={{ borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', height: '100%' }}
            >
              <DashboardQuickLinks />
              
              <Divider style={{ margin: '24px 0' }} />
              
              <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                <Statistic
                  title={<span style={{ color: '#0369a1', fontWeight: 600 }}>Weekly Growth</span>}
                  value={11.28}
                  precision={2}
                  valueStyle={{ color: '#0369a1', fontWeight: 800 }}
                  prefix={<ArrowUpOutlined />}
                  suffix="%"
                />
                <Text style={{ fontSize: '12px', color: '#0ea5e9' }}>Compared to last week</Text>
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Global Dashboard Overrides */}
      <style>{`
        .ant-card {
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .ant-card-head {
          border-bottom: 1px solid #f1f5f9 !important;
          padding: 0 24px !important;
          min-height: 56px !important;
        }
        .ant-card-body {
          padding: 24px !important;
        }
        .dashboard-stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default Dashbord;