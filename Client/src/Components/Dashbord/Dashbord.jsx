import React from "react";
import { Typography, Row, Col, Space, Button } from "antd";
import { ReloadOutlined, ExportOutlined } from "@ant-design/icons";
import DashboardCards from "./DashboardCards";
import DashboardCharts from "./DashboardCharts";
import DashboardQuickLinks from "./DashboardQuickLinks";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

const Dashbord = () => {
  return (
    <div style={{ padding: "24px", background: "#f8fafc", minHeight: "100vh" }}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}
      >
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>
            Welcome Back!
          </Title>
          <Text type="secondary" style={{ fontSize: "16px" }}>
            Here's what's happening with your business today.
          </Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />}>Refresh Data</Button>
          <Button type="primary" icon={<ExportOutlined />}>Download Report</Button>
        </Space>
      </motion.div>

      {/* Tier 1: Stat Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ marginBottom: "24px" }}
      >
        <DashboardCards />
      </motion.div>

      {/* Tier 2: Charts Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ marginBottom: "24px" }}
      >
        <DashboardCharts />
      </motion.div>

      {/* Tier 3: Quick Access Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <DashboardQuickLinks />
      </motion.div>

      {/* CSS Overrides for Premium Look */}
      <style>{`
        .ant-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .ant-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.06) !important;
        }
        .ant-statistic-title {
          font-size: 13px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
          font-weight: 600 !important;
          color: #64748b !important;
        }
        .ant-statistic-content-value {
          font-weight: 700 !important;
          color: #0f172a !important;
        }
      `}</style>
    </div>
  );
};

export default Dashbord;