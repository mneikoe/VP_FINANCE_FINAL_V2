import React from "react";
import { Empty, Card, Typography, ConfigProvider, Space } from "antd";
import { WalletOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const SalaryHistory = () => {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#4f46e5' } }}>
      <div style={{ padding: '24px' }}>
        <Card style={{ borderRadius: 24, textAlign: 'center', padding: '40px 0' }}>
          <Empty
            image={<WalletOutlined style={{ fontSize: 48, color: '#4f46e5' }} />}
            description={
              <Space direction="vertical">
                <Title level={4}>Earnings Portfolio</Title>
                <Text type="secondary">Your historical compensation records are being archived into the new secure vault.</Text>
              </Space>
            }
          >
            <Text italic type="secondary">Data migration in progress</Text>
          </Empty>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default SalaryHistory;
