import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  Typography,
  Card,
  Row,
  Col,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  message,
  Badge,
  Tooltip,
  Progress,
  Empty,
  Upload,
  Divider,
} from "antd";
import {
  RocketOutlined,
  UploadOutlined,
  EyeOutlined,
  DownloadOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
  FilePdfOutlined,
  LockOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

// Helper for Statistic (Moved to top to avoid hoisting issues)
const StatisticHelper = ({ title, value, prefix, valueStyle }) => (
    <div style={{ textAlign: 'center' }}>
        <Text type="secondary" style={{ fontSize: 12 }}>{title}</Text>
        <div style={{ fontSize: 24, fontWeight: 'bold', ...valueStyle }}>
            {prefix && <span style={{ marginRight: 8 }}>{prefix}</span>}
            {value}
        </div>
    </div>
);

const InputNumber = (props) => <Input type="number" {...props} />;

const FuturePlans = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [form] = Form.useForm();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/future-plans");
      if (response.data.success) {
        setDocuments(response.data.data || []);
      }
    } catch (error) {
      message.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (values) => {
    if (!values.file?.file) {
      message.error("Please select a PDF file");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("document", values.file.file);
    formData.append("title", values.title);
    formData.append("category", values.category);
    formData.append("priority", values.priority);
    formData.append("targetYear", values.targetYear);
    formData.append("description", values.description || "");

    try {
      const response = await axios.post("/api/future-plans/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        message.success("Strategic plan uploaded successfully");
        setIsModalOpen(false);
        form.resetFields();
        fetchDocuments();
      }
    } catch (error) {
      message.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/future-plans/${id}`);
      message.success("Plan deleted");
      fetchDocuments();
    } catch (error) {
      message.error("Deletion failed");
    }
  };

  const categories = [
    "Vision & Mission", "Business Expansion", "Technology Roadmap", 
    "Marketing Strategy", "Financial Planning", "HR Development"
  ];

  const columns = [
    {
      title: "Strategic Plan",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Space>
          <div style={{ padding: 8, background: '#f5f5f5', borderRadius: 8 }}>
            <FilePdfOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />
          </div>
          <Space direction="vertical" size={0}>
            <Text strong>{text}</Text>
            <Text type="secondary" style={{ fontSize: '11px' }}>{record.originalName}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: "Strategy Area",
      dataIndex: "category",
      key: "category",
      render: (cat) => <Tag color="purple">{cat}</Tag>
    },
    {
        title: "Target Year",
        dataIndex: "targetYear",
        key: "targetYear",
        render: (year) => <Text strong>{year}</Text>
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (p) => {
        let color = "default";
        if (p === "High") color = "red";
        if (p === "Medium") color = "orange";
        return <Tag color={color}>{p}</Tag>;
      }
    },
    {
        title: "Status",
        dataIndex: "approvalStatus",
        key: "status",
        render: (status) => (
            <Tag icon={status === "Approved" ? <CheckCircleOutlined /> : <ClockCircleOutlined />} color={status === "Approved" ? "success" : "processing"}>
                {status}
            </Tag>
        )
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="View">
            <Button type="text" icon={<EyeOutlined />} onClick={() => window.open(`/api/future-plans/view/${record._id}`, "_blank")} />
          </Tooltip>
          <Tooltip title="Download">
            <Button type="text" icon={<DownloadOutlined />} onClick={() => {
                const link = document.createElement("a");
                link.href = `/api/future-plans/download/${record._id}`;
                link.download = record.originalName;
                document.body.appendChild(link);
                link.click();
            }} />
          </Tooltip>
          <Popconfirm title="Delete plan?" onConfirm={() => handleDelete(record._id)}>
            <Button type="text" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fade-in">
      <Card bordered={false} style={{ borderRadius: 12, marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0 }}>Director's Future Plans</Title>
            <Text type="secondary">Strategic roadmap and vision for future growth</Text>
          </Col>
          <Col>
             <Space>
                <Button icon={<ReloadOutlined />} onClick={fetchDocuments}>Refresh</Button>
                <Button type="primary" icon={<RocketOutlined />} onClick={() => setIsModalOpen(true)} size="large">
                    New Strategic Plan
                </Button>
             </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={8}>
            <Card bordered={false}>
                <StatisticHelper title="Total Plans" value={documents.length} prefix={<RocketOutlined />} />
            </Card>
        </Col>
        <Col span={8}>
            <Card bordered={false}>
                <StatisticHelper title="Approved" value={documents.filter(d => d.approvalStatus === "Approved").length} valueStyle={{ color: '#3f8600' }} prefix={<CheckCircleOutlined />} />
            </Card>
        </Col>
        <Col span={8}>
            <Card bordered={false}>
                <StatisticHelper title="High Priority" value={documents.filter(d => d.priority === "High").length} valueStyle={{ color: '#cf1322' }} prefix={<InfoCircleOutlined />} />
            </Card>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 12, marginBottom: 24 }}>
        <Row gutter={16}>
            <Col span={12}>
                <Input 
                    prefix={<SearchOutlined />} 
                    placeholder="Search strategic plans..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </Col>
            <Col span={8}>
                <Select style={{ width: '100%' }} value={categoryFilter} onChange={setCategoryFilter}>
                    <Option value="All">All Strategy Areas</Option>
                    {categories.map(c => <Option key={c} value={c}>{c}</Option>)}
                </Select>
            </Col>
        </Row>
      </Card>

      <Card bordered={false} style={{ borderRadius: 12, overflow: 'hidden' }} bodyStyle={{ padding: 0 }}>
        <Table
          columns={columns}
          dataSource={filteredDocs}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          className="custom-table"
          locale={{ emptyText: <Empty description="No strategic plans found" /> }}
        />
      </Card>

      <Modal
        title={<Space><RocketOutlined /> Upload Strategic Plan</Space>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleUpload} initialValues={{ priority: 'Medium', targetYear: new Date().getFullYear() + 1 }}>
            <Form.Item label="Plan Title" name="title" rules={[{ required: true }]}>
                <Input placeholder="Vision 2025..." />
            </Form.Item>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item label="Category" name="category" rules={[{ required: true }]}>
                        <Select>
                            {categories.map(c => <Option key={c} value={c}>{c}</Option>)}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Priority" name="priority">
                        <Select>
                            <Option value="High">High</Option>
                            <Option value="Medium">Medium</Option>
                            <Option value="Low">Low</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Target Year" name="targetYear" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} min={2020} max={2100} />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item label="Description" name="description">
                <Input.TextArea rows={3} placeholder="Strategic objectives..." />
            </Form.Item>
            <Form.Item label="Select PDF Plan" name="file" rules={[{ required: true }]}>
                <Upload beforeUpload={() => false} maxCount={1} accept=".pdf">
                    <Button icon={<UploadOutlined />} block>Select Document</Button>
                </Upload>
            </Form.Item>
            <div style={{ textAlign: 'right', marginTop: 24 }}>
                <Space>
                    <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button type="primary" htmlType="submit" loading={uploading}>Upload Plan</Button>
                </Space>
            </div>
        </Form>
      </Modal>

      <style>{`
        .custom-table .ant-table-thead > tr > th {
          background-color: #FFCC00 !important;
          color: #000 !important;
          font-weight: bold !important;
          text-align: center !important;
        }
        .custom-table .ant-table-tbody > tr > td {
          text-align: center !important;
        }
      `}</style>
    </div>
  );
};

export default FuturePlans;
