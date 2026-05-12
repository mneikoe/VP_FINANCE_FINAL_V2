import React from "react";
import { Card, Row, Col, Typography } from "antd";
import { Link } from "react-router-dom";
import {
  FiLayers,
  FiUsers,
  FiBriefcase,
  FiCheckSquare,
  FiFileText,
  FiTrendingUp,
  FiUser,
  FiChevronRight
} from "react-icons/fi";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

const categories = [
  {
    title: "Masters",
    icon: <FiLayers />,
    color: "#1890ff",
    bgColor: "rgba(24, 144, 255, 0.1)",
    to: "/composite",
    desc: "Manage core templates and types"
  },
  {
    title: "Customers",
    icon: <FiUser />,
    color: "#722ed1",
    bgColor: "rgba(114, 46, 209, 0.1)",
    to: "/client",
    desc: "Leads, prospects, and clients"
  },
  {
    title: "Employee",
    icon: <FiUsers />,
    color: "#52c41a",
    bgColor: "rgba(82, 196, 26, 0.1)",
    to: "/all-employee",
    desc: "Staff profiles and targets"
  },
  {
    title: "Financial",
    icon: <FiTrendingUp />,
    color: "#faad14",
    bgColor: "rgba(250, 173, 20, 0.1)",
    to: "/financial-product-list",
    desc: "Products and company names"
  },
  {
    title: "Department",
    icon: <FiBriefcase />,
    color: "#ff4d4f",
    bgColor: "rgba(255, 77, 79, 0.1)",
    to: "/marketing-documents",
    desc: "Departmental records"
  },
  {
    title: "Tasks",
    icon: <FiCheckSquare />,
    color: "#13c2c2",
    bgColor: "rgba(19, 194, 194, 0.1)",
    to: "/task-assign",
    desc: "Assignment and tracking"
  },
  {
    title: "Reports",
    icon: <FiFileText />,
    color: "#eb2f96",
    bgColor: "rgba(235, 47, 150, 0.1)",
    to: "/reports/employee-report",
    desc: "Performance and data analysis"
  }
];

const DashboardQuickLinks = () => {
  return (
    <div style={{ marginBottom: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <Title level={4} style={{ margin: 0, fontWeight: 600 }}>Quick Access</Title>
        <Text type="secondary">Direct shortcuts to main sections</Text>
      </div>
      <Row gutter={[16, 16]}>
        {categories.map((cat, index) => (
          <Col xs={24} sm={12} xl={24} key={index}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={cat.to}>
                <Card
                  hoverable
                  styles={{ body: { padding: "16px" } }}
                  style={{
                    borderRadius: "14px",
                    border: "1px solid #f1f5f9",
                    background: "white",
                    boxShadow: "none",
                    overflow: "hidden"
                  }}
                  className="quick-link-card"
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "10px",
                        background: cat.bgColor,
                        color: cat.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                        flexShrink: 0
                      }}
                    >
                      {cat.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <Title level={5} style={{ margin: 0, fontSize: "14px", fontWeight: 700 }}>
                        {cat.title}
                      </Title>
                      <Text type="secondary" style={{ fontSize: "12px", display: "block" }}>
                        {cat.desc}
                      </Text>
                    </div>
                    <FiChevronRight style={{ color: "#cbd5e1" }} />
                  </div>
                </Card>
              </Link>
            </motion.div>
          </Col>
        ))}
      </Row>
      <style>{`
        .quick-link-card:hover {
          border-color: #3b82f6 !important;
          background: #f8fafc !important;
        }
      `}</style>
    </div>
  );
};

export default DashboardQuickLinks;
