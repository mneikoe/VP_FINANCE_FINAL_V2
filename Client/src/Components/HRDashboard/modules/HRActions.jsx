import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Form,
  Input,
  Select,
  Space,
  Typography,
  Tag,
  Modal,
  Upload,
  message,
  Row,
  Col,
  Avatar,
  Divider,
  Statistic,
} from "antd";
import {
  SafetyCertificateOutlined,
  PlusOutlined,
  UploadOutlined,
  FileTextOutlined,
  UserOutlined,
  TrophyOutlined,
  WarningOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axiosInstance from "../../../config/axios";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

const HRActions = () => {
  const [employees, setEmployees] = useState([]);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editorData, setEditorData] = useState("");
  const [fileList, setFileList] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empRes, actionRes] = await Promise.all([
        axiosInstance.get("/api/employee/getallEmployee"),
        axiosInstance.get("/api/hr-actions/get-all/actions"),
      ]);
      setEmployees(empRes.data.data || []);
      setActions(actionRes.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    if (!editorData) {
      message.error("Please provide a description");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("title", values.type === "appreciation" ? "Appreciation" : "Warning");
    formData.append("points", values.points);
    formData.append("actionType", values.type);
    formData.append("description", editorData);
    
    fileList.forEach(file => {
      formData.append("files", file.originFileObj);
    });

    try {
      const res = await axiosInstance.post(`/api/hr-actions/add-action/${values.employeeId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        message.success("HR Action recorded successfully");
        setIsModalOpen(false);
        form.resetFields();
        setEditorData("");
        setFileList([]);
        fetchData();
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to add HR action");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "Employee",
      key: "employee",
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} src={record.employeeId?.profileImage} />
          <div style={{ textAlign: 'left' }}>
            <Text strong>{record.employeeId?.name || "Unknown"}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>{record.employeeId?.role || "N/A"}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Type",
      dataIndex: "actionType",
      key: "type",
      render: (type) => (
        <Tag color={type === "appreciation" ? "green" : "volcano"} icon={type === "appreciation" ? <TrophyOutlined /> : <WarningOutlined />}>
          {type?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Points",
      dataIndex: "points",
      key: "points",
      render: (points, record) => (
        <Text strong style={{ color: record.actionType === "appreciation" ? "#52c41a" : "#f5222d" }}>
          {record.actionType === "appreciation" ? "+" : "-"}{Math.abs(points)}
        </Text>
      ),
    },
    {
      title: "Date",
      dataIndex: "actionDate",
      key: "date",
      render: (date) => dayjs(date).format("DD MMM YYYY"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<FileTextOutlined />} 
          onClick={() => {
            Modal.info({
              title: 'HR Action Details',
              width: 600,
              content: (
                <div style={{ marginTop: 20 }}>
                  <div dangerouslySetInnerHTML={{ __html: record.description }} />
                  {record.files && record.files.length > 0 && (
                    <div style={{ marginTop: 20 }}>
                      <Text strong>Attached Files:</Text>
                      <ul style={{ marginTop: 8 }}>
                        {record.files.map((file, i) => (
                          <li key={i}>
                            <a href={`/uploads/${file}`} target="_blank" rel="noreferrer">{file}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ),
            });
          }}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card bordered={false} style={{ borderRadius: 16, marginBottom: 24, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0, color: "#fff" }}>
              <SafetyCertificateOutlined /> HR Performance Actions
            </Title>
            <Text style={{ color: "rgba(255,255,255,0.8)" }}>Manage employee appreciations, warnings, and performance points</Text>
          </Col>
          <Col>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => setIsModalOpen(true)}
              style={{ background: "#fff", color: "#764ba2", border: "none", fontWeight: 600 }}
            >
              New HR Action
            </Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card bordered={false} style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic 
              title="Total Actions" 
              value={actions.length} 
              prefix={<SafetyCertificateOutlined style={{ color: '#1890ff' }} />} 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic 
              title="Appreciations" 
              value={actions.filter(a => a.actionType === 'appreciation').length} 
              valueStyle={{ color: '#52c41a' }}
              prefix={<TrophyOutlined />} 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic 
              title="Warnings" 
              value={actions.filter(a => a.actionType === 'warning').length} 
              valueStyle={{ color: '#f5222d' }}
              prefix={<WarningOutlined />} 
            />
          </Card>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 16 }}>
        <Table 
          columns={columns} 
          dataSource={actions} 
          rowKey="_id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={
          <Space>
            <PlusOutlined style={{ color: '#1890ff' }} />
            <span>Record New HR Action</span>
          </Space>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
        centered
      >
        <Form form={form} layout="vertical" onFinish={onFinish} style={{ marginTop: 20 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="employeeId" label="Select Employee" rules={[{ required: true }]}>
                <Select showSearch placeholder="Search employee" optionFilterProp="children">
                  {employees.map(emp => (
                    <Option key={emp._id} value={emp._id}>{emp.name} ({emp.role})</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="type" label="Action Type" rules={[{ required: true }]}>
                <Select placeholder="Type">
                  <Option value="appreciation">Appreciation (+)</Option>
                  <Option value="warning">Warning (-)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="points" label="Points" rules={[{ required: true }]}>
                <Input type="number" placeholder="Points" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Action Description (Detailed Reason)">
            <div style={{ border: "1px solid #d9d9d9", borderRadius: 8, overflow: "hidden" }}>
              <CKEditor
                editor={ClassicEditor}
                data={editorData}
                onChange={(event, editor) => setEditorData(editor.getData())}
              />
            </div>
          </Form.Item>

          <Form.Item label="Support Documents (Optional)">
            <Upload
              multiple
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Click to upload files</Button>
            </Upload>
          </Form.Item>

          <Divider />

          <div style={{ textAlign: "right" }}>
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={submitting} icon={<CheckCircleOutlined />}>
                Record Action
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default HRActions;
