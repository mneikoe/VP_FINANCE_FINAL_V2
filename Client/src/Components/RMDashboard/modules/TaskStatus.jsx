import React from "react";
import { Empty, Card, Typography, ConfigProvider, Space } from "antd";
import { ReconciliationOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const TaskStatus = () => {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#4f46e5' } }}>
      <div style={{ padding: '24px' }}>
        <Card style={{ borderRadius: 24, textAlign: 'center', padding: '40px 0' }}>
          <Empty
            image={<ReconciliationOutlined style={{ fontSize: 48, color: '#4f46e5' }} />}
            description={
              <Space direction="vertical">
                <Title level={4}>Lifecycle Audit</Title>
                <Text type="secondary">Real-time task lifecycle tracking and audit trails will be available shortly.</Text>
              </Space>
            }
          >
            <Text italic type="secondary">Integrating with OE systems</Text>
          </Empty>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default TaskStatus;
