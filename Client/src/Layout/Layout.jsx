import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Layout, ConfigProvider } from "antd";
import TopHeader from "../Components/Dashbord/TopHeader";

const { Content } = Layout;

const LayoutComponent = () => {
  const location = useLocation();

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#f27405",
          borderRadius: 8,
          fontFamily: "'Inter', sans-serif",
        },
      }}
    >
      <Layout style={{ minHeight: "100vh", background: "#f1f5f9" }}>
        <Layout style={{ transition: "all 0.3s", background: "transparent" }}>
          <TopHeader />
          <Content style={{ padding: "24px", margin: 0 }}>
            <div className="layout-content-wrapper">
              <Outlet key={location.pathname} />
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default LayoutComponent;
