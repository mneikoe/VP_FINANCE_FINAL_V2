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
  message,
  Tooltip,
  Empty,
  Divider,
  Progress,
  Badge,
} from "antd";
import {
  EyeOutlined,
  CheckOutlined,
  ReloadOutlined,
  UserAddOutlined,
  MailOutlined,
  FileTextOutlined,
  TrophyOutlined,
  UserOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import DocumentProcessModal from "./DocumentProcessModal";

const { Title, Text } = Typography;

const JoiningData = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docType, setDocType] = useState("");
  const [candidateForDoc, setCandidateForDoc] = useState(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      // Fetch both "Selected" and "Joining Data" and "Offer Letter Sent" stages
      const response = await axios.get("/api/addcandidate/stages/Selected,Joining Data,Offer Letter Sent");
      setCandidates(response.data.candidates || []);
    } catch (error) {
      message.error("Failed to load joining candidates");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, stage) => {
    try {
      await axios.put(`/api/addcandidate/${id}/stage`, { currentStage: stage });
      message.success(`Candidate status: ${stage}`);
      fetchCandidates();
      setIsModalOpen(false);
    } catch (error) {
      message.error("Failed to update status");
    }
  };

  const columns = [
    {
      title: "Candidate",
      dataIndex: "candidateName",
      key: "name",
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.mobileNo}</Text>
        </Space>
      ),
    },
    {
      title: "Applied For",
      key: "designation",
      render: (_, record) => (
        <Tag color="cyan">{record.designation || record.appliedFor?.designation || "N/A"}</Tag>
      )
    },
    {
      title: "Offer Letter",
      key: "offerLetter",
      render: (_, record) => {
        const doc = record.offerLetterDetails;
        if (!doc?.sentDate) return <Tag color="default">Not Sent</Tag>;
        return (
          <Space direction="vertical" size={0}>
            <Tag color="processing" icon={<CheckOutlined />}>Sent ({dayjs(doc.sentDate).format("DD/MM")})</Tag>
            {doc.file?.path && (
              <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => window.open(doc.file.path, '_blank')}>View</Button>
            )}
          </Space>
        );
      }
    },
    {
      title: "Joining Letter",
      key: "joiningLetter",
      render: (_, record) => {
        const doc = record.joiningLetterDetails;
        if (!doc?.sentDate) return <Tag color="default">Not Sent</Tag>;
        return (
          <Space direction="vertical" size={0}>
            <Tag color="success" icon={<CheckOutlined />}>Sent ({dayjs(doc.sentDate).format("DD/MM")})</Tag>
            {doc.file?.path && (
              <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => window.open(doc.file.path, '_blank')}>View</Button>
            )}
          </Space>
        );
      }
    },
    {
      title: "Joining Date",
      key: "joiningDate",
      render: (_, record) => (
        <Text strong>
          {record.joiningLetterDetails?.joiningDate 
            ? dayjs(record.joiningLetterDetails.joiningDate).format("DD/MM/YYYY") 
            : "Not Set"}
        </Text>
      )
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button icon={<EyeOutlined />} onClick={() => { setSelectedCandidate(record); setIsModalOpen(true); }} />
          </Tooltip>
          <Tooltip title="Process Offer Letter">
            <Button 
                icon={<MailOutlined />} 
                onClick={() => { setCandidateForDoc(record); setDocType("Offer Letter"); setIsDocModalOpen(true); }}
                style={{ color: '#1890ff' }}
            />
          </Tooltip>
          <Tooltip title="Process Joining Letter">
            <Button 
                icon={<FileTextOutlined />} 
                onClick={() => { setCandidateForDoc(record); setDocType("Joining Letter"); setIsDocModalOpen(true); }}
                style={{ color: '#13c2c2' }}
            />
          </Tooltip>
          <Tooltip title="Final Hiring">
            <Button 
                type="primary" 
                icon={<UserAddOutlined />} 
                onClick={() => updateStatus(record._id, "Added as Employee")}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="fade-in">
      <Card bordered={false} style={{ borderRadius: 12, marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0 }}>Joining Data</Title>
            <Text type="secondary">Onboarding and final selection process</Text>
          </Col>
          <Col>
            <Button icon={<ReloadOutlined />} onClick={fetchCandidates} loading={loading}>Refresh</Button>
          </Col>
        </Row>
      </Card>

      <Card bordered={false} style={{ borderRadius: 12, overflow: 'hidden' }} bodyStyle={{ padding: 0 }}>
        <Table
          columns={columns}
          dataSource={candidates}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          className="custom-table"
        />
      </Card>

      <Modal
        title={<Space><UserOutlined style={{ color: '#1890ff' }} /> Candidate Onboarding Profile</Space>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={850}
        centered
      >
        {selectedCandidate && (
          <div className="fade-in">
            <Descriptions 
                bordered 
                column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }} 
                size="small"
                labelStyle={{ background: '#fafafa', fontWeight: 600, width: '100px' }}
            >
              <Descriptions.Item label="Full Name" span={1}><Text strong>{selectedCandidate.candidateName}</Text></Descriptions.Item>
              <Descriptions.Item label="Phone" span={1}>{selectedCandidate.mobileNo}</Descriptions.Item>
              <Descriptions.Item label="Email" span={1}><div style={{ minWidth: '180px' }}>{selectedCandidate.email || "N/A"}</div></Descriptions.Item>
              <Descriptions.Item label="Designation">
                <Tag color="cyan">{selectedCandidate.designation || selectedCandidate.appliedFor?.designation || "N/A"}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Salary Expect.">
                <Text strong color="green">{selectedCandidate.salaryExpectation || "N/A"}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Total Score">
                <Badge 
                    count={selectedCandidate.totalMarks || 0} 
                    overflowCount={100}
                    color={ (selectedCandidate.totalMarks || 0) > 25 ? '#52c41a' : '#faad14'} 
                />
              </Descriptions.Item>
              <Descriptions.Item label="Interview Date">
                {selectedCandidate.interviewDate ? dayjs(selectedCandidate.interviewDate).format("DD MMM YYYY") : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Status" span={2}>
                 <Tag color="blue" icon={<SyncOutlined spin />}>{selectedCandidate.currentStage}</Tag>
              </Descriptions.Item>
            </Descriptions>
            
            <Divider orientation="left"><TrophyOutlined /> Experience & Skill Breakdown</Divider>
            
            <Row gutter={[32, 16]}>
              {[
                { label: 'Admin', key: 'administrative', parent: 'experienceFields' },
                { label: 'Ins. Sales', key: 'insuranceSales', parent: 'experienceFields' },
                { label: 'Any Sales', key: 'anySales', parent: 'experienceFields' },
                { label: 'Field Work', key: 'fieldWork', parent: 'experienceFields' },
                { label: 'Data Mgmt', key: 'dataManagement', parent: 'operationalActivities' },
                { label: 'Back Office', key: 'backOffice', parent: 'operationalActivities' },
                { label: 'MIS', key: 'mis', parent: 'operationalActivities' }
              ].map(item => {
                const value = selectedCandidate[item.key] || selectedCandidate[item.parent]?.[item.key] || 0;
                return (
                  <Col span={8} key={item.key}>
                    <div style={{ marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                      <Text type="secondary">{item.label}</Text>
                      <Text strong>{value}/5</Text>
                    </div>
                    <Progress 
                      percent={value * 20} 
                      size="small" 
                      showInfo={false} 
                      strokeColor={ value >= 4 ? '#52c41a' : value >= 2 ? '#faad14' : '#ff4d4f' }
                    />
                  </Col>
                );
              })}
              <Col span={8}>
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9', borderRadius: 8, padding: '8px 12px' }}>
                   <Space direction="vertical" align="center" size={0}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>Spoken English</Text>
                      <Tag color={selectedCandidate.spokenEnglish ? "success" : "error"} style={{ marginTop: 4 }}>
                        {selectedCandidate.spokenEnglish ? "Excellent" : "Needs Improvement"}
                      </Tag>
                   </Space>
                </div>
              </Col>
            </Row>

            <Divider />
            
            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <Space size="middle">
                <Button 
                   icon={<MailOutlined />} 
                   onClick={() => { setCandidateForDoc(selectedCandidate); setDocType("Offer Letter"); setIsDocModalOpen(true); setIsModalOpen(false); }}
                >
                  Offer Letter
                </Button>
                <Button 
                   icon={<FileTextOutlined />} 
                   onClick={() => { setCandidateForDoc(selectedCandidate); setDocType("Joining Letter"); setIsDocModalOpen(true); setIsModalOpen(false); }}
                >
                  Joining Letter
                </Button>
                <Button 
                    type="primary" 
                    icon={<UserAddOutlined />} 
                    onClick={() => updateStatus(selectedCandidate._id, "Added as Employee")}
                    style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                >
                    Complete Hiring
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Modal>

      <DocumentProcessModal 
        open={isDocModalOpen}
        type={docType}
        candidate={candidateForDoc}
        onCancel={() => setIsDocModalOpen(false)}
        onSuccess={() => {
          setIsDocModalOpen(false);
          fetchCandidates();
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

export default JoiningData;
