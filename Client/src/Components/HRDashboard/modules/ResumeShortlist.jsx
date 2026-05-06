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
  Badge,
  Descriptions,
  message,
  Tooltip,
  Empty,
  Popconfirm,
  Divider,
  Progress,
} from "antd";
import {
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  ReloadOutlined,
  CalendarOutlined,
  ArrowRightOutlined,
  TrophyOutlined,
  SyncOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import InterviewScheduleModal from "./InterviewScheduleModal";

const { Title, Text } = Typography;

const ResumeShortlist = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [candidateToSchedule, setCandidateToSchedule] = useState(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/addcandidate/stage/Resume%20Shortlisted");
      setCandidates(response.data.candidates || []);
    } catch (error) {
      message.error("Failed to load shortlisted candidates");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, stage) => {
    try {
      await axios.put(`/api/addcandidate/${id}/stage`, { currentStage: stage });
      message.success(`Candidate moved to ${stage}`);
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
      title: "Interview Date",
      dataIndex: "interviewDate",
      key: "interviewDate",
      render: (date) => date ? dayjs(date).format("DD/MM/YYYY") : "Not Set"
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button icon={<EyeOutlined />} onClick={() => { setSelectedCandidate(record); setIsModalOpen(true); }} />
          </Tooltip>
          <Tooltip title="Schedule/Move to Interview">
            <Button 
                type="primary" 
                icon={<CalendarOutlined />} 
                onClick={() => { setCandidateToSchedule(record); setIsScheduleModalOpen(true); }}
                style={{ backgroundColor: '#faad14', borderColor: '#faad14' }}
            />
          </Tooltip>
          <Popconfirm title="Reject candidate?" onConfirm={() => updateStatus(record._id, "Rejected")}>
            <Button danger icon={<CloseOutlined />} />
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
            <Title level={3} style={{ margin: 0 }}>Resume Shortlisted</Title>
            <Text type="secondary">Candidates ready for interview</Text>
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
        title={<Space><UserOutlined style={{ color: '#1890ff' }} /> Shortlisted Candidate Profile</Space>}
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
              <Descriptions.Item label="Interview Date">
                <Text type="warning">{selectedCandidate.interviewDate ? dayjs(selectedCandidate.interviewDate).format("DD MMM YYYY") : "Not Scheduled"}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Total Score">
                <Badge 
                    count={selectedCandidate.totalMarks || 0} 
                    overflowCount={100}
                    color={ (selectedCandidate.totalMarks || 0) > 25 ? '#52c41a' : '#faad14'} 
                />
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
            
            <div style={{ textAlign: 'center', paddingBottom: 10 }}>
              <Space size="large">
                <Popconfirm title="Reject candidate?" onConfirm={() => updateStatus(selectedCandidate._id, "Rejected")}>
                    <Button size="large" danger icon={<CloseOutlined />} style={{ width: 150 }}>Reject</Button>
                </Popconfirm>
                <Button 
                    size="large" 
                    type="primary" 
                    icon={<CalendarOutlined />} 
                    onClick={() => { setCandidateToSchedule(selectedCandidate); setIsScheduleModalOpen(true); setIsModalOpen(false); }}
                    style={{ width: 220, backgroundColor: '#faad14', borderColor: '#faad14' }}
                >
                    Move to Interview
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Modal>

      <InterviewScheduleModal 
        open={isScheduleModalOpen}
        candidate={candidateToSchedule}
        onCancel={() => setIsScheduleModalOpen(false)}
        onScheduleSuccess={() => {
          setIsScheduleModalOpen(false);
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

export default ResumeShortlist;
