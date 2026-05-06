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
  Upload,
  Empty,
} from "antd";
import {
  FilePdfOutlined,
  UploadOutlined,
  EyeOutlined,
  DownloadOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

const RulesRegulations = () => {
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
      const response = await axios.get("/api/rules");
      if (response.data.success) {
        setDocuments(response.data.data || []);
      }
    } catch (error) {
      message.error("Failed to load documents");
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
    formData.append("description", values.description || "");

    try {
      const response = await axios.post("/api/rules/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        message.success("Document uploaded successfully");
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
      await axios.delete(`/api/rules/${id}`);
      message.success("Document deleted");
      fetchDocuments();
    } catch (error) {
      message.error("Deletion failed");
    }
  };

  const handleView = (id) => {
    window.open(`/api/rules/view/${id}`, "_blank");
  };

  const handleDownload = (id, name) => {
    const link = document.createElement("a");
    link.href = `/api/rules/download/${id}`;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const categories = [
    "General Rules", "HR Policies", "Company Policies", 
    "Code of Conduct", "Compliance", "IT Policies", "Finance Policies"
  ];

  const columns = [
    {
      title: "Document",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Space>
          <FilePdfOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />
          <Space direction="vertical" size={0}>
            <Text strong>{text}</Text>
            <Text type="secondary" style={{ fontSize: '11px' }}>{record.originalName}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (cat) => <Tag color="blue">{cat}</Tag>
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
      render: (date) => dayjs(date).format("DD MMM YYYY")
    },
    {
      title: "Downloads",
      dataIndex: "downloadCount",
      key: "downloads",
      render: (count) => <Badge count={count || 0} showZero color="#1890ff" />
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="View PDF">
            <Button type="text" icon={<EyeOutlined />} onClick={() => handleView(record._id)} />
          </Tooltip>
          <Tooltip title="Download">
            <Button type="text" icon={<DownloadOutlined />} onClick={() => handleDownload(record._id, record.originalName)} />
          </Tooltip>
          <Popconfirm title="Delete document?" onConfirm={() => handleDelete(record._id)}>
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
            <Title level={3} style={{ margin: 0 }}>Rules & Regulations</Title>
            <Text type="secondary">Compliance documents and company policy guidelines</Text>
          </Col>
          <Col>
             <Space>
                <Button icon={<ReloadOutlined />} onClick={fetchDocuments}>Refresh</Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} size="large">
                    Upload PDF
                </Button>
             </Space>
          </Col>
        </Row>
      </Card>

      <Card bordered={false} style={{ borderRadius: 12, marginBottom: 24 }}>
        <Row gutter={16}>
            <Col span={12}>
                <Input 
                    prefix={<SearchOutlined />} 
                    placeholder="Search documents..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </Col>
            <Col span={8}>
                <Select style={{ width: '100%' }} value={categoryFilter} onChange={setCategoryFilter}>
                    <Option value="All">All Categories</Option>
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
          locale={{ emptyText: <Empty description="No documents found" /> }}
        />
      </Card>

      <Modal
        title={<Space><UploadOutlined /> Upload Document</Space>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleUpload}>
            <Form.Item label="Document Title" name="title" rules={[{ required: true }]}>
                <Input placeholder="Enter title" />
            </Form.Item>
            <Form.Item label="Category" name="category" rules={[{ required: true }]}>
                <Select placeholder="Select category">
                    {categories.map(c => <Option key={c} value={c}>{c}</Option>)}
                </Select>
            </Form.Item>
            <Form.Item label="Description" name="description">
                <Input.TextArea rows={3} placeholder="Brief description" />
            </Form.Item>
            <Form.Item label="Select PDF" name="file" rules={[{ required: true }]}>
                <Upload beforeUpload={() => false} maxCount={1} accept=".pdf">
                    <Button icon={<UploadOutlined />} block>Click to Select PDF</Button>
                </Upload>
            </Form.Item>
            <div style={{ textAlign: 'right', marginTop: 24 }}>
                <Space>
                    <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button type="primary" htmlType="submit" loading={uploading}>Upload Now</Button>
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

export default RulesRegulations;
