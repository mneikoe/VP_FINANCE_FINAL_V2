import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Tag,
  Badge,
  Space,
  Typography,
  message,
  Popconfirm,
  Tooltip,
  Card,
  Row,
  Col,
  Spin,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
  FileTextOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PauseCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

const VacancyManagement = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    fetchVacancies();
  }, []);

  const fetchVacancies = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/vacancynotice");
      setVacancies(response.data.vacancies || []);
    } catch (error) {
      console.error("❌ Error fetching vacancies:", error);
      message.error("Failed to load vacancies");
    } finally {
      setLoading(false);
    }
  };

  const showModal = (vacancy = null) => {
    if (vacancy) {
      setEditingVacancy(vacancy);
      form.setFieldsValue({
        designation: vacancy.designation,
        createdDate: dayjs(vacancy.createdDate),
        publishPlatform: vacancy.publishPlatform || [],
        description: vacancy.description || "",
        status: vacancy.status,
      });
      setFileList([]);
    } else {
      setEditingVacancy(null);
      form.resetFields();
      form.setFieldsValue({ createdDate: dayjs() });
      setFileList([]);
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingVacancy(null);
    form.resetFields();
    setFileList([]);
  };

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("vacancy", values.designation);
    formData.append("designation", values.designation);
    formData.append("date", values.createdDate.format("YYYY-MM-DD"));
    
    // Append each platform
    if (values.publishPlatform) {
      values.publishPlatform.forEach(p => formData.append("platform", p));
    }
    
    formData.append("description", values.description || "");
    
    if (editingVacancy) {
      formData.append("status", values.status);
    }

    fileList.forEach((file) => {
      if (file.originFileObj) {
        formData.append("document", file.originFileObj);
      }
    });

    try {
      if (editingVacancy) {
        await axios.put(`/api/vacancynotice/${editingVacancy._id}`, formData);
        message.success("Vacancy updated successfully");
      } else {
        if (fileList.length === 0) {
          message.error("Please upload at least one document");
          return;
        }
        await axios.post("/api/vacancynotice", formData);
        message.success("Vacancy created successfully");
      }
      handleCancel();
      fetchVacancies();
    } catch (error) {
      console.error("Error saving vacancy:", error);
      message.error(error.response?.data?.message || "Failed to save vacancy");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/vacancynotice/${id}`);
      message.success("Vacancy deleted successfully");
      fetchVacancies();
    } catch (error) {
      message.error("Failed to delete vacancy");
    }
  };

  const filteredVacancies = vacancies.filter((v) => {
    const designation = v.designation?.toLowerCase() || "";
    const description = v.description?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    
    const matchesSearch = designation.includes(search) || description.includes(search);
    const matchesStatus = statusFilter === "All" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
      render: (text, record) => (
        <Space direction="vertical" size={0} style={{ textAlign: 'left', width: '100%' }}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.description?.substring(0, 50)}{record.description?.length > 50 ? "..." : ""}
          </Text>
        </Space>
      ),
    },
    {
      title: "Platforms",
      dataIndex: "publishPlatform",
      key: "platforms",
      render: (platforms) => (
        <Space wrap justifyContent="center">
          {platforms?.map((p) => (
            <Tag key={p} color="blue" style={{ margin: '2px' }}>{p}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Documents",
      dataIndex: "document",
      key: "documents",
      render: (docs, record) => {
        const docArray = Array.isArray(docs) ? docs : [docs];
        return (
          <Space direction="vertical" size={2} style={{ width: '100%' }}>
            {docArray.filter(d => d).map((doc, index) => (
              <Button 
                key={index}
                type="link" 
                size="small" 
                icon={<FileTextOutlined />}
                onClick={() => window.open(`/api/vacancynotice/documents/${doc}?view=true`, "_blank")}
                style={{ padding: 0, height: 'auto', display: 'block', margin: '0 auto' }}
              >
                <span style={{ fontSize: '11px' }}>{record.originalFileName?.[index] || doc}</span>
              </Button>
            ))}
          </Space>
        );
      },
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date) => (
        <Space>
          <CalendarOutlined style={{ color: '#8c8c8c' }} />
          {dayjs(date).format("DD/MM/YYYY")}
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        let icon = null;
        if (status === "Active") { color = "success"; icon = <CheckCircleOutlined />; }
        if (status === "Closed") { color = "error"; icon = <CloseCircleOutlined />; }
        if (status === "On Hold") { color = "warning"; icon = <PauseCircleOutlined />; }
        return <Tag color={color} icon={icon}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View First Document">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                const doc = Array.isArray(record.document) ? record.document[0] : record.document;
                if (doc) window.open(`/api/vacancynotice/documents/${doc}?view=true`, "_blank");
              }}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: '#1890ff' }} />}
              onClick={() => showModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete Vacancy"
            description="Are you sure you want to delete this vacancy?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      <Card bordered={false} style={{ borderRadius: "12px", marginBottom: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Title level={3} style={{ margin: 0 }}>Vacancy Management</Title>
            <Text type="secondary">Create and manage job vacancies efficiently</Text>
          </Col>
          <Col xs={24} sm={12} style={{ textAlign: "right" }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => showModal()}
              style={{ height: '45px', borderRadius: '8px', padding: '0 24px' }}
            >
              Create Vacancy
            </Button>
          </Col>
        </Row>
      </Card>

      <Card bordered={false} style={{ borderRadius: "12px", marginBottom: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Input
              placeholder="Search vacancies by designation or description..."
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="large"
              allowClear
            />
          </Col>
          <Col xs={24} md={8}>
            <Select
              placeholder="Filter by Status"
              style={{ width: "100%" }}
              size="large"
              defaultValue="All"
              onChange={setStatusFilter}
            >
              <Option value="All">All Status</Option>
              <Option value="Active">Active</Option>
              <Option value="Closed">Closed</Option>
              <Option value="On Hold">On Hold</Option>
              <Option value="Draft">Draft</Option>
            </Select>
          </Col>
          <Col xs={24} md={4}>
            <Button 
              icon={<ReloadOutlined />} 
              size="large" 
              block 
              onClick={fetchVacancies}
              loading={loading}
            >
              Refresh
            </Button>
          </Col>
        </Row>
      </Card>

      <Card bordered={false} style={{ borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }} bodyStyle={{ padding: 0 }}>
        <Table
          columns={columns}
          dataSource={filteredVacancies}
          rowKey="_id"
          loading={loading}
          pagination={{ 
            pageSize: 10, 
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} vacancies`
          }}
          className="custom-table"
          scroll={{ x: 1000 }}
        />
      </Card>

      <Modal
        title={
          <Space>
            <div style={{ 
              width: 32, 
              height: 32, 
              borderRadius: 8, 
              background: '#e6f7ff', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <FileTextOutlined style={{ color: "#1890ff" }} />
            </div>
            <Title level={4} style={{ margin: 0 }}>
              {editingVacancy ? "Edit Vacancy" : "Create New Vacancy"}
            </Title>
          </Space>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={700}
        destroyOnClose
        centered
        bodyStyle={{ paddingTop: '20px' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark="optional"
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Vacancy Designation"
                name="designation"
                rules={[{ required: true, message: "Please enter designation!" }]}
              >
                <Input placeholder="e.g., Software Developer" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Created Date"
                name="createdDate"
                rules={[{ required: true, message: "Please select date!" }]}
              >
                <DatePicker style={{ width: "100%" }} size="large" format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Publish Platform"
                name="publishPlatform"
                rules={[{ required: true, message: "Please select platforms!" }]}
              >
                <Select mode="multiple" placeholder="Select platforms" size="large" allowClear>
                  <Option value="LinkedIn">LinkedIn</Option>
                  <Option value="Naukri">Naukri</Option>
                  <Option value="Indeed">Indeed</Option>
                  <Option value="Company Website">Company Website</Option>
                  <Option value="Social Media">Social Media</Option>
                  <Option value="Job Portal">Job Portal</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Job Description" name="description">
                <Input.TextArea rows={4} placeholder="Enter detailed job description, requirements, etc." />
              </Form.Item>
            </Col>
            {editingVacancy && (
                <Col xs={24} sm={12}>
                    <Form.Item label="Status" name="status">
                        <Select size="large">
                            <Option value="Active">Active</Option>
                            <Option value="Closed">Closed</Option>
                            <Option value="On Hold">On Hold</Option>
                            <Option value="Draft">Draft</Option>
                        </Select>
                    </Form.Item>
                </Col>
            )}
            <Col span={24}>
              <Form.Item
                label="Upload Documents"
                extra="PDF, DOC, JPG, PNG allowed. Max 10MB per file."
              >
                <Upload
                  fileList={fileList}
                  onChange={({ fileList }) => setFileList(fileList)}
                  beforeUpload={() => false}
                  multiple
                  listType="picture-card"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                >
                  {fileList.length < 10 && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ 
            marginTop: "32px", 
            paddingTop: "20px", 
            borderTop: "1px solid #f0f0f0",
            textAlign: "right" 
          }}>
            <Space>
              <Button onClick={handleCancel} size="large" style={{ borderRadius: '8px', minWidth: '100px' }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" size="large" style={{ borderRadius: '8px', minWidth: '140px' }}>
                {editingVacancy ? "Update Vacancy" : "Create Vacancy"}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      <style>{`
        .custom-table .ant-table-thead > tr > th {
          background-color: #FFCC00 !important;
          color: #000 !important;
          font-weight: bold !important;
          border-right: 1px solid #ffffff !important;
          border-radius: 0 !important;
          text-align: center !important;
        }
        .custom-table .ant-table-thead > tr > th:last-child {
          border-right: none !important;
        }
        .custom-table .ant-table-tbody > tr > td {
          text-align: center !important;
          padding: 12px 8px !important;
        }
        .ant-table-striped .ant-table-tbody > tr:nth-child(2n) > td {
          background-color: #fafafa;
        }
        .text-primary { color: #1890ff; }
        
        /* Modern Scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        ::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #999;
        }
      `}</style>
    </div>
  );
};

export default VacancyManagement;
