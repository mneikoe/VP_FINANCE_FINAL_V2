import { Empty, Card, Typography, ConfigProvider, Space } from "antd";
import { DollarCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const IncentiveHistory = () => {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#4f46e5' } }}>
      <div style={{ padding: '24px' }}>
        <Card style={{ borderRadius: 24, textAlign: 'center', padding: '40px 0' }}>
          <Empty
            image={<DollarCircleOutlined style={{ fontSize: 48, color: '#4f46e5' }} />}
            description={
              <Space direction="vertical">
                <Title level={4}>Incentive Analytics</Title>
                <Text type="secondary">The incentive calculation engine is currently being synchronized with your performance data.</Text>
              </Space>
            }
          >
            <Text italic type="secondary">Feature arriving in next update</Text>
          </Empty>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default IncentiveHistory;
