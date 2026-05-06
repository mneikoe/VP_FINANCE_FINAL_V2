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
  DatePicker,
  Tabs,
  Popconfirm,
  message,
  Descriptions,
  Badge,
  Tooltip,
  Divider,
  Upload,
} from "antd";
import {
  UserOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  BankOutlined,
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
  ReloadOutlined,
  FileExcelOutlined,
  UploadOutlined,
  FilePdfOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
// Use CDN for XLSX to avoid installation issues
import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs";

const { Title, Text } = Typography;
const { Option } = Select;

const BusinessAssociates = () => {
  const [associates, setAssociates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssociate, setEditingAssociate] = useState(null);
  const [viewingAssociate, setViewingAssociate] = useState(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("1");

  useEffect(() => {
    loadAssociates();
  }, []);

  const loadAssociates = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/business-associates");
      if (response.data.success) {
        setAssociates(response.data.data);
      }
    } catch (error) {
      message.error("Failed to load associates");
    } finally {
      setLoading(false);
    }
  };

  const showModal = (associate = null) => {
    if (associate) {
      setEditingAssociate(associate);
      form.setFieldsValue({
        ...associate,
        dateOfBirth: associate.dateOfBirth ? dayjs(associate.dateOfBirth) : null,
        anniversaryDate: associate.anniversaryDate ? dayjs(associate.anniversaryDate) : null,
        dateOfJoining: associate.dateOfJoining ? dayjs(associate.dateOfJoining) : null,
        dateOfTermination: associate.dateOfTermination ? dayjs(associate.dateOfTermination) : null,
      });
    } else {
      setEditingAssociate(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingAssociate(null);
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      const data = {
        ...values,
        dateOfBirth: values.dateOfBirth?.format("YYYY-MM-DD"),
        anniversaryDate: values.anniversaryDate?.format("YYYY-MM-DD"),
        dateOfJoining: values.dateOfJoining?.format("YYYY-MM-DD"),
        dateOfTermination: values.dateOfTermination?.format("YYYY-MM-DD"),
      };

      if (!editingAssociate) {
        const firstName = values.name.split(" ")[0].toLowerCase();
        data.loginCredentials = {
          username: `${firstName}${Math.floor(1000 + Math.random() * 9000)}`,
          password: "123456",
        };
        await axios.post("/api/business-associates", data);
        message.success("Business Associate added successfully");
      } else {
        await axios.put(`/api/business-associates/${editingAssociate._id}`, data);
        message.success("Business Associate updated successfully");
      }
      handleCancel();
      loadAssociates();
    } catch (error) {
      message.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleFileUpload = async (id, type, file) => {
    try {
      const formData = new FormData();
      formData.append(type === "agreement" ? "agreement" : "payoutSheet", file);
      
      const endpoint = type === "agreement" 
        ? `/api/business-associates/${id}/upload-agreement`
        : `/api/business-associates/${id}/upload-payout`;

      const response = await axios.put(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.success) {
        message.success(`${type === "agreement" ? "Agreement" : "Payout Sheet"} uploaded successfully`);
        loadAssociates();
      }
      return false; // Prevent auto upload by Ant Design
    } catch (error) {
      message.error("Upload failed");
    }
  };

  const handleExcelImport = (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet);

        if (parsedData.length === 0) {
            message.error("Excel file is empty");
            return;
        }

        // Map excel headers to model fields (Assumes specific headers)
        const associatesToImport = parsedData.map(row => ({
            name: row["Full Name"] || row["Name"],
            associateType: row["Type"] || "Sub-Broker",
            dateOfBirth: row["DOB"] ? dayjs(row["DOB"]).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
            gender: row["Gender"] || "Male",
            mobileNumber1: row["Mobile"] || row["Phone"],
            emailId: row["Email"],
            panNumber: row["PAN"],
            address: row["Address"] || "N/A",
            dateOfJoining: dayjs().format("YYYY-MM-DD"),
            bankDetails: {
                accountHolderName: row["Account Holder"] || row["Name"],
                accountNumber: row["Account Number"],
                ifscCode: row["IFSC"],
                branch: row["Branch"] || "N/A"
            }
        }));

        const response = await axios.post("/api/business-associates/bulk-import", { associates: associatesToImport });
        if (response.data.success) {
            message.success(response.data.message);
            loadAssociates();
        }
      } catch (error) {
        message.error("Failed to parse Excel file. Ensure headers: Name, Type, Mobile, Email, PAN, Account Number, IFSC");
      }
    };
    reader.readAsBinaryString(file);
    return false;
  };

  const downloadSampleExcel = () => {
    const sampleData = [
      {
        "Full Name": "John Doe",
        "Type": "Sub-Broker",
        "Mobile": "9876543210",
        "Email": "john@example.com",
        "PAN": "ABCDE1234F",
        "Gender": "Male",
        "DOB": "1990-01-01",
        "Account Number": "1234567890",
        "IFSC": "HDFC0001234",
        "Branch": "Main Branch",
        "Address": "Mumbai, India"
      }
    ];
    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Associates");
    XLSX.writeFile(wb, "Business_Associates_Template.xlsx");
  };

  const columns = [
    {
      title: "Associate",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.emailId}</Text>
        </Space>
      ),
    },
    {
      title: "Type",
      dataIndex: "associateType",
      key: "type",
      render: (type) => <Tag color="blue">{type}</Tag>
    },
    {
      title: "Documents",
      key: "documents",
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          <Space>
            <Text size="small" type="secondary">Agreement:</Text>
            {record.agreementPath ? (
              <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => window.open(record.agreementPath, "_blank")}>View</Button>
            ) : (
              <Upload beforeUpload={(file) => handleFileUpload(record._id, "agreement", file)} showUploadList={false}>
                <Button size="small" icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            )}
          </Space>
          <Space>
            <Text size="small" type="secondary">Payout:</Text>
            {record.payoutSheetPath ? (
              <Button type="link" size="small" icon={<FileExcelOutlined />} onClick={() => window.open(record.payoutSheetPath, "_blank")}>Sheet</Button>
            ) : (
              <Upload beforeUpload={(file) => handleFileUpload(record._id, "payout", file)} showUploadList={false}>
                <Button size="small" icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            )}
          </Space>
        </Space>
      )
    },
    {
      title: "Contact",
      dataIndex: "mobileNumber1",
      key: "contact",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        if (status === "Active") color = "success";
        if (status === "Terminated") color = "error";
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Profile">
            <Button type="text" icon={<EyeOutlined />} onClick={() => setViewingAssociate(record)} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button type="text" icon={<EditOutlined style={{ color: '#1890ff' }} />} onClick={() => showModal(record)} />
          </Tooltip>
          <Popconfirm title="Delete associate?" onConfirm={() => handleDelete(record._id)}>
            <Button type="text" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/business-associates/${id}`);
      message.success("Associate deleted successfully");
      loadAssociates();
    } catch (error) {
      message.error("Failed to delete associate");
    }
  };

  return (
    <div className="fade-in">
      <Card bordered={false} style={{ borderRadius: 12, marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0 }}>Business Associates</Title>
            <Text type="secondary">Manage partners, upload agreements, and import bulk data</Text>
          </Col>
          <Col>
            <Space size="middle">
              <Button icon={<DownloadOutlined />} onClick={downloadSampleExcel}>Template</Button>
              <Upload beforeUpload={handleExcelImport} showUploadList={false} accept=".xlsx,.xls">
                <Button icon={<FileExcelOutlined />} style={{ color: '#52c41a', borderColor: '#52c41a' }}>Bulk Import</Button>
              </Upload>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} size="large">
                Add Associate
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card bordered={false} style={{ borderRadius: 12, overflow: 'hidden' }} bodyStyle={{ padding: 0 }}>
        <Table
          columns={columns}
          dataSource={associates}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          className="custom-table"
        />
      </Card>

      <Modal
        title={<Space><UserOutlined /> {editingAssociate ? "Edit Associate" : "Add New Associate"}</Space>}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={800}
        centered
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: 20 }}
          initialValues={{ associateType: "Sub-Broker", status: "Active" }}
        >
          <Tabs defaultActiveKey="1" items={[
            {
              key: "1",
              label: "Basic Details",
              children: (
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Full Name" name="name" rules={[{ required: true }]}>
                      <Input prefix={<UserOutlined />} placeholder="Full Name" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Associate Type" name="associateType" rules={[{ required: true }]}>
                      <Select>
                        <Option value="Sub-Broker">Sub-Broker</Option>
                        <Option value="Referral Partner">Referral Partner</Option>
                        <Option value="Corporate Associate">Corporate Associate</Option>
                        <Option value="Individual Partner">Individual Partner</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="DOB" name="dateOfBirth" rules={[{ required: true }]}>
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Gender" name="gender">
                      <Select>
                        <Option value="Male">Male</Option>
                        <Option value="Female">Female</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Joining Date" name="dateOfJoining" rules={[{ required: true }]}>
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Mobile No" name="mobileNumber1" rules={[{ required: true }]}>
                      <Input prefix={<PhoneOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Email ID" name="emailId" rules={[{ required: true, type: 'email' }]}>
                      <Input prefix={<MailOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="Address" name="address">
                      <Input.TextArea rows={2} />
                    </Form.Item>
                  </Col>
                </Row>
              )
            },
            {
              key: "2",
              label: "Professional & Bank",
              children: (
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="PAN Number" name="panNumber" rules={[{ required: true }]}>
                      <Input prefix={<IdcardOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="RM Name" name="rmName">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={24}><Divider orientation="left"><BankOutlined /> Bank Details</Divider></Col>
                  <Col span={12}>
                    <Form.Item label="Account Holder" name={["bankDetails", "accountHolderName"]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Account Number" name={["bankDetails", "accountNumber"]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="IFSC Code" name={["bankDetails", "ifscCode"]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Branch" name={["bankDetails", "branch"]}>
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              )
            }
          ]} />
          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {editingAssociate ? "Update Associate" : "Add Associate"}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      <Modal
        title="Associate Profile"
        open={!!viewingAssociate}
        onCancel={() => setViewingAssociate(null)}
        footer={null}
        width={700}
      >
        {viewingAssociate && (
          <div className="fade-in">
            <Descriptions bordered column={2}>
                <Descriptions.Item label="Name" span={2}><Text strong>{viewingAssociate.name}</Text></Descriptions.Item>
                <Descriptions.Item label="Type">{viewingAssociate.associateType}</Descriptions.Item>
                <Descriptions.Item label="Code">{viewingAssociate.subbrokerCode || "N/A"}</Descriptions.Item>
                <Descriptions.Item label="Phone">{viewingAssociate.mobileNumber1}</Descriptions.Item>
                <Descriptions.Item label="Email">{viewingAssociate.emailId}</Descriptions.Item>
                <Descriptions.Item label="PAN">{viewingAssociate.panNumber}</Descriptions.Item>
                <Descriptions.Item label="Status"><Tag color="green">{viewingAssociate.status}</Tag></Descriptions.Item>
            </Descriptions>
            
            <Divider orientation="left">Documents & Financials</Divider>
            <Row gutter={16}>
                <Col span={12}>
                    <Card size="small" title="Partnership Agreement" extra={viewingAssociate.agreementPath ? <Tag color="blue">Available</Tag> : <Tag>Missing</Tag>}>
                        {viewingAssociate.agreementPath ? (
                            <Button type="primary" block icon={<FilePdfOutlined />} onClick={() => window.open(viewingAssociate.agreementPath, "_blank")}>Open Agreement</Button>
                        ) : (
                            <Upload beforeUpload={(file) => handleFileUpload(viewingAssociate._id, "agreement", file)} showUploadList={false}>
                                <Button block icon={<UploadOutlined />}>Upload PDF</Button>
                            </Upload>
                        )}
                    </Card>
                </Col>
                <Col span={12}>
                    <Card size="small" title="Payout Sheet" extra={viewingAssociate.payoutSheetPath ? <Tag color="green">Available</Tag> : <Tag>Missing</Tag>}>
                        {viewingAssociate.payoutSheetPath ? (
                            <Button type="primary" block icon={<FileExcelOutlined />} style={{ background: '#52c41a', borderColor: '#52c41a' }} onClick={() => window.open(viewingAssociate.payoutSheetPath, "_blank")}>Open Payout Sheet</Button>
                        ) : (
                            <Upload beforeUpload={(file) => handleFileUpload(viewingAssociate._id, "payout", file)} showUploadList={false}>
                                <Button block icon={<UploadOutlined />}>Upload Excel</Button>
                            </Upload>
                        )}
                    </Card>
                </Col>
            </Row>
          </div>
        )}
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

export default BusinessAssociates;
