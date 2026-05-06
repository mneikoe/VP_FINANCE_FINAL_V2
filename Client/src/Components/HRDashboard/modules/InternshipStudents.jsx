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
  Statistic,
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
  Empty,
  Upload,
  Divider,
} from "antd";
import {
  UserOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  BookOutlined,
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  UploadOutlined,
  DownloadOutlined,
  ReloadOutlined,
  FilePdfOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import InternshipForm from "./InternshipForm";

const { Title, Text } = Typography;
const { Option } = Select;

const InternshipStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/internships");
      if (response.data.success) {
        setStudents(response.data.data);
      }
    } catch (error) {
      message.error("Failed to load internships");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`/api/internships/${id}`, { status });
      message.success(`Status updated to ${status}`);
      fetchInternships();
      setIsStatusModalOpen(false);
    } catch (error) {
      message.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/internships/${id}`);
      message.success("Application deleted");
      fetchInternships();
    } catch (error) {
      message.error("Deletion failed");
    }
  };

  const handleDownload = async (id, type) => {
    try {
      const endpoint = type === 'certificate' 
        ? `/api/internships/${id}/download-certificate`
        : `/api/internships/${id}/download-activity`;
        
      const response = await axios.get(endpoint, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type === 'certificate' ? 'Certificate' : 'Activity'}-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      message.error(`${type === 'certificate' ? 'Certificate' : 'Activity report'} not available`);
    }
  };

  const handleFileUpload = async (id, type, file) => {
    try {
      const formData = new FormData();
      formData.append(type === "certificate" ? "certificateFile" : "activityFile", file);
      
      const endpoint = type === "certificate" 
        ? `/api/internships/${id}/upload-certificate`
        : `/api/internships/${id}/upload-activity`;

      const response = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.success) {
        message.success(`${type === "certificate" ? "Certificate" : "Activity report"} uploaded successfully`);
        fetchInternships();
      }
      return false; 
    } catch (error) {
      message.error("Upload failed");
    }
  };

  const columns = [
    {
      title: "Student",
      dataIndex: "fullName",
      key: "name",
      width: 220,
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.email}</Text>
        </Space>
      ),
    },
    {
      title: "Position",
      dataIndex: "positionApplied",
      key: "position",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "blue";
        if (status === "Completed") color = "success";
        if (status === "Selected") color = "green";
        if (status === "Rejected") color = "error";
        if (status === "Pending") color = "gold";
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: "Certificate",
      key: "certificate",
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          {record.certificateFile ? (
            <Button size="small" type="link" icon={<DownloadOutlined />} onClick={() => handleDownload(record._id, 'certificate')}>Download</Button>
          ) : (
            <Upload beforeUpload={(file) => handleFileUpload(record._id, "certificate", file)} showUploadList={false}>
              <Button size="small" icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          )}
        </Space>
      )
    },
    {
      title: "Activity PDF",
      key: "activity",
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          {record.activityFile ? (
            <Button size="small" type="link" icon={<FileSearchOutlined />} style={{ color: '#52c41a' }} onClick={() => handleDownload(record._id, 'activity')}>View Activity</Button>
          ) : (
            <Upload beforeUpload={(file) => handleFileUpload(record._id, "activity", file)} showUploadList={false}>
              <Button size="small" icon={<UploadOutlined />}>Upload PDF</Button>
            </Upload>
          )}
        </Space>
      )
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Profile">
            <Button type="text" icon={<EyeOutlined />} onClick={() => { setSelectedStudent(record); setIsViewModalOpen(true); }} />
          </Tooltip>
          <Tooltip title="Update Status">
            <Button type="text" icon={<EditOutlined style={{ color: '#faad14' }} />} onClick={() => { setSelectedStudent(record); setIsStatusModalOpen(true); }} />
          </Tooltip>
          <Popconfirm title="Delete application?" onConfirm={() => handleDelete(record._id)}>
            <Button type="text" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="fade-in">
      <Card bordered={false} style={{ borderRadius: 12, marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0 }}>Internship Students</Title>
            <Text type="secondary">Manage student documents, activities, and certifications</Text>
          </Col>
          <Col>
             <Space>
                <Button icon={<ReloadOutlined />} onClick={fetchInternships}>Refresh</Button>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  size="large"
                  onClick={() => setIsFormModalOpen(true)}
                >
                  New Application
                </Button>
             </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
            <Card bordered={false} bodyStyle={{ padding: 20 }}>
                <Badge.Ribbon text="Live" color="cyan">
                    <Statistic title="Total Applications" value={students.length} />
                </Badge.Ribbon>
            </Card>
        </Col>
        <Col span={6}>
            <Card bordered={false} bodyStyle={{ padding: 20 }}>
                <Statistic title="Pending" value={students.filter(s => s.status === "Pending").length} valueStyle={{ color: '#faad14' }} />
            </Card>
        </Col>
        <Col span={6}>
            <Card bordered={false} bodyStyle={{ padding: 20 }}>
                <Statistic title="Selected" value={students.filter(s => s.status === "Selected").length} valueStyle={{ color: '#52c41a' }} />
            </Card>
        </Col>
        <Col span={6}>
            <Card bordered={false} bodyStyle={{ padding: 20 }}>
                <Statistic title="Completed" value={students.filter(s => s.status === "Completed").length} valueStyle={{ color: '#1890ff' }} />
            </Card>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 12, overflow: 'hidden' }} bodyStyle={{ padding: 0 }}>
        <Table
          columns={columns}
          dataSource={students}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          className="custom-table"
        />
      </Card>

      <Modal
        title="Student Details"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={[<Button key="close" onClick={() => setIsViewModalOpen(false)}>Close</Button>]}
        width={800}
      >
        {selectedStudent && (
          <div className="fade-in">
            <Descriptions title="Personal Information" bordered column={2} size="small">
              <Descriptions.Item label="Full Name">{selectedStudent.fullName}</Descriptions.Item>
              <Descriptions.Item label="Gender">{selectedStudent.gender}</Descriptions.Item>
              <Descriptions.Item label="Email" span={2}>{selectedStudent.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedStudent.contactNo}</Descriptions.Item>
              <Descriptions.Item label="Nationality">{selectedStudent.nationality}</Descriptions.Item>
            </Descriptions>
            
            <Divider />
            <Descriptions title="Academic Information" bordered column={2} size="small">
              <Descriptions.Item label="University" span={2}>{selectedStudent.universityName}</Descriptions.Item>
              <Descriptions.Item label="Degree">{selectedStudent.degreeProgram}</Descriptions.Item>
              <Descriptions.Item label="GPA">{selectedStudent.cumulativeGPA}/10</Descriptions.Item>
            </Descriptions>

            <Divider />
            <Descriptions title="Internship Details" bordered column={2} size="small">
              <Descriptions.Item label="Position">{selectedStudent.positionApplied}</Descriptions.Item>
              <Descriptions.Item label="Status"><Tag color="blue">{selectedStudent.status}</Tag></Descriptions.Item>
              <Descriptions.Item label="Start Date">{dayjs(selectedStudent.preferredStartDate).format("DD MMM YYYY")}</Descriptions.Item>
              <Descriptions.Item label="End Date">{dayjs(selectedStudent.preferredEndDate).format("DD MMM YYYY")}</Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      <Modal
        title="Update Status"
        open={isStatusModalOpen}
        onCancel={() => setIsStatusModalOpen(false)}
        footer={null}
        width={400}
        centered
      >
        <Space direction="vertical" style={{ width: '100%' }}>
            {["Pending", "Under Review", "Shortlisted", "Selected", "Completed", "Rejected"].map(s => (
                <Button key={s} block onClick={() => handleStatusUpdate(selectedStudent._id, s)}>{s}</Button>
            ))}
        </Space>
      </Modal>

      <InternshipForm 
        show={isFormModalOpen} 
        onHide={() => setIsFormModalOpen(false)} 
        onSuccess={() => {
          setIsFormModalOpen(false);
          fetchInternships();
        }}
      />

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

export default InternshipStudents;
