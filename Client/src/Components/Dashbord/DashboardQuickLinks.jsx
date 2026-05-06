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
          <Col xs={24} sm={12} lg={6} xl={cat.title === "Masters" ? 12 : 6} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={cat.to}>
                <Card
                  hoverable
                  bodyStyle={{ padding: "20px" }}
                  style={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                    overflow: "hidden"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: cat.bgColor,
                        color: cat.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "24px",
                        flexShrink: 0
                      }}
                    >
                      {cat.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <Title level={5} style={{ margin: "0 0 4px 0", fontSize: "16px" }}>
                        {cat.title}
                      </Title>
                      <Text type="secondary" style={{ fontSize: "13px" }}>
                        {cat.desc}
                      </Text>
                    </div>
                    <FiChevronRight style={{ color: "#bfbfbf", marginTop: "4px" }} />
                  </div>
                </Card>
              </Link>
            </motion.div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default DashboardQuickLinks;
