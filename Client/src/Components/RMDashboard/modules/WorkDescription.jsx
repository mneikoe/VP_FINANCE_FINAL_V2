import React from "react";
import { Empty, Card, Typography, ConfigProvider, Space } from "antd";
import { ProjectOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const WorkDescription = () => {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#4f46e5' } }}>
      <div style={{ padding: '24px' }}>
        <Card style={{ borderRadius: 24, textAlign: 'center', padding: '40px 0' }}>
          <Empty
            image={<ProjectOutlined style={{ fontSize: 48, color: '#4f46e5' }} />}
            description={
              <Space direction="vertical">
                <Title level={4}>Mission parameters</Title>
                <Text type="secondary">Detailed role descriptions and operational standard operating procedures are being drafted.</Text>
              </Space>
            }
          >
            <Text italic type="secondary">Awaiting documentation release</Text>
          </Empty>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default WorkDescription;
