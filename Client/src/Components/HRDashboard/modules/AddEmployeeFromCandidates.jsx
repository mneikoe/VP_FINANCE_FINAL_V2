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
  Descriptions,
  Tabs,
  Badge,
  message,
  Tooltip,
  Empty,
  Divider,
} from "antd";
import {
  UserAddOutlined,
  SyncOutlined,
  FileTextOutlined,
  UserOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import EmployeeAddFormModal from "./EmployeeAddFormModal";

const { Title, Text } = Typography;

const AddEmployeeFromCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [addedEmployees, setAddedEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [activeTab, setActiveTab] = useState("ready");

  useEffect(() => {
    fetchAllCandidates();
  }, []);

  const fetchAllCandidates = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/addcandidate");
      const allCandidates = response.data.candidates || (Array.isArray(response.data) ? response.data : []);

      const ready = allCandidates.filter(c => {
        const stage = (c.currentStage || "").toLowerCase();
        const status = (c.currentStatus || "").toLowerCase();
        return stage === "joining letter sent" || status === "joining letter sent";
      });

      const added = allCandidates.filter(c => {
        const stage = (c.currentStage || "").toLowerCase();
        const status = (c.currentStatus || "").toLowerCase();
        return stage === "added as employee" || status === "added as employee";
      });

      setCandidates(ready);
      setAddedEmployees(added);
    } catch (error) {
      message.error("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Candidate",
      dataIndex: "candidateName",
      key: "name",
      render: (text, record) => (
        <Space>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #d9d9d9' }}>
            {text?.charAt(0) || <UserOutlined />}
          </div>
          <Space direction="vertical" size={0}>
            <Text strong>{text}</Text>
            <Text type="secondary" style={{ fontSize: '11px' }}>Score: {record.totalMarks || 0}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: "Contact",
      dataIndex: "mobileNo",
      key: "contact",
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text>{text || "N/A"}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.email || "No email"}</Text>
        </Space>
      )
    },
    {
      title: "Designation",
      dataIndex: ["appliedFor", "designation"],
      key: "designation",
      render: (text) => <Tag color="blue">{text || "N/A"}</Tag>
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Tag color={activeTab === "ready" ? "green" : "default"} icon={activeTab === "ready" ? <CheckCircleOutlined /> : null}>
          {activeTab === "ready" ? "Joining Letter Sent" : "Added as Employee"}
        </Tag>
      )
    },
    {
      title: activeTab === "ready" ? "Exp. Joining" : "Joining Date",
      key: "joiningDate",
      render: (_, record) => {
        const date = record.joiningLetterDetails?.joiningDate || record.joiningDate;
        return date ? dayjs(date).format("DD/MM/YYYY") : "N/A";
      }
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
           <Tooltip title="View Candidate Details">
            <Button 
                icon={<EyeOutlined />} 
                onClick={() => { setSelectedCandidate(record); setShowViewModal(true); }}
            />
          </Tooltip>
          {activeTab === "ready" && (
            <Button 
                type="primary" 
                size="small" 
                icon={<UserAddOutlined />} 
                onClick={() => { setSelectedCandidate(record); setShowEmployeeForm(true); }}
            >
                Add as Employee
            </Button>
          )}
        </Space>
      )
    },
  ];

  const addedColumns = [
    ...columns.slice(0, 3), // Candidate, Contact, Designation
    {
      title: "Processed Date",
      dataIndex: "updatedAt",
      key: "processedDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY")
    },
    {
        title: "Interview Date",
        dataIndex: "interviewDate",
        key: "interviewDate",
        render: (date) => date ? dayjs(date).format("DD/MM/YYYY") : "N/A"
    },
    {
        title: "Joining Date",
        key: "joiningDate",
        render: (_, record) => {
            const date = record.joiningLetterDetails?.joiningDate || record.joiningDate;
            return date ? dayjs(date).format("DD/MM/YYYY") : "N/A";
        }
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Tooltip title="View All Details">
            <Button 
                icon={<EyeOutlined />} 
                onClick={() => { setSelectedCandidate(record); setShowViewModal(true); }}
            />
        </Tooltip>
      )
    }
  ];

  return (
    <div className="fade-in">
      <Card bordered={false} style={{ borderRadius: 12, marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0 }}>Candidate to Employee Conversion</Title>
            <Text type="secondary">Finalize hiring and transition candidates to workforce</Text>
          </Col>
          <Col>
            <Button icon={<SyncOutlined />} onClick={fetchAllCandidates} loading={loading}>Refresh</Button>
          </Col>
        </Row>
      </Card>

      <Card bordered={false} style={{ borderRadius: 12, overflow: 'hidden' }} bodyStyle={{ padding: 0 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          centered
          items={[
            {
              key: "ready",
              label: (
                <span>
                  <FileTextOutlined /> Ready for Employment <Badge count={candidates.length} offset={[10, -5]} size="small" />
                </span>
              ),
              children: (
                <Table
                  columns={columns}
                  dataSource={candidates}
                  rowKey="_id"
                  loading={loading}
                  className="custom-table"
                />
              )
            },
            {
              key: "added",
              label: (
                <span>
                  <TeamOutlined /> Already Added <Badge count={addedEmployees.length} offset={[10, -5]} size="small" showZero color="#d9d9d9" />
                </span>
              ),
              children: (
                <Table
                  columns={addedColumns}
                  dataSource={addedEmployees}
                  rowKey="_id"
                  loading={loading}
                  className="custom-table"
                />
              )
            }
          ]}
        />
      </Card>

      {showEmployeeForm && selectedCandidate && (
        <EmployeeAddFormModal
          candidate={selectedCandidate}
          onClose={() => { setShowEmployeeForm(false); setSelectedCandidate(null); }}
          onEmployeeAdded={() => { fetchAllCandidates(); setShowEmployeeForm(false); setSelectedCandidate(null); }}
        />
      )}

      <Modal
        title={<Space><EyeOutlined /> Candidate History & Details</Space>}
        open={showViewModal}
        onCancel={() => { setShowViewModal(false); setSelectedCandidate(null); }}
        footer={null}
        width={800}
        centered
      >
        {selectedCandidate && (
          <div className="fade-in">
            <Descriptions title="Personal Information" bordered column={2} size="small">
              <Descriptions.Item label="Full Name">{selectedCandidate.candidateName}</Descriptions.Item>
              <Descriptions.Item label="Mobile">{selectedCandidate.mobileNo}</Descriptions.Item>
              <Descriptions.Item label="Email" span={2}>{selectedCandidate.email || "N/A"}</Descriptions.Item>
              <Descriptions.Item label="Education">{selectedCandidate.education}</Descriptions.Item>
              <Descriptions.Item label="Location">{selectedCandidate.location}</Descriptions.Item>
            </Descriptions>
            
            <Divider />
            
            <Descriptions title="Recruitment Timeline" bordered column={2} size="small">
                <Descriptions.Item label="Current Stage">
                    <Tag color="blue">{selectedCandidate.currentStage}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Applied For">
                    {selectedCandidate.appliedFor?.designation || selectedCandidate.designation}
                </Descriptions.Item>
                <Descriptions.Item label="Interview Date">
                    {selectedCandidate.interviewDate ? dayjs(selectedCandidate.interviewDate).format("DD MMMM YYYY") : "Not Set"}
                </Descriptions.Item>
                <Descriptions.Item label="Joining Date">
                    { (selectedCandidate.joiningLetterDetails?.joiningDate || selectedCandidate.joiningDate) 
                        ? dayjs(selectedCandidate.joiningLetterDetails?.joiningDate || selectedCandidate.joiningDate).format("DD MMMM YYYY") 
                        : "Not Set"}
                </Descriptions.Item>
                <Descriptions.Item label="Last Updated">
                    {dayjs(selectedCandidate.updatedAt).format("DD MMMM YYYY HH:mm")}
                </Descriptions.Item>
                <Descriptions.Item label="Total Score">
                    <Badge count={selectedCandidate.totalMarks || 0} color="#faad14" showZero />
                </Descriptions.Item>
            </Descriptions>

            {selectedCandidate.salaryExpectation && (
                <div style={{ marginTop: 16 }}>
                    <Text strong>Salary Expectation: </Text>
                    <Text>{selectedCandidate.salaryExpectation}</Text>
                </div>
            )}
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
        .ant-tabs-nav {
            margin-bottom: 0 !important;
            padding: 10px 0;
            background: #fafafa;
            border-bottom: 1px solid #f0f0f0;
        }
      `}</style>
    </div>
  );
};

export default AddEmployeeFromCandidates;
