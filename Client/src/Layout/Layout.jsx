// src/Layout/Layout.js
import React from "react";
import Navbarfrist from "../Components/Dashbord/Navbarfrist";
import { Outlet, useLocation } from "react-router-dom";
import { Layout, ConfigProvider } from "antd";

const { Content } = Layout;

const LayoutComponent = () => {
  const location = useLocation();
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#2563eb",
          borderRadius: 8,
        },
      }}
    >
      <Layout style={{ minHeight: "100vh", background: "#f8fafc" }}>
        <Navbarfrist />
        <Content style={{ padding: "24px", paddingTop: "100px" }}>
          <div className="layout-content-wrapper">
            <Outlet key={location.pathname} />
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default LayoutComponent;
