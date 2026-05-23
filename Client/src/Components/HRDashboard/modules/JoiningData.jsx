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
  StarOutlined,
  FilePdfOutlined,
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

  const calculateMarks = (values) => {
    if (!values) return 0;
    let marks = 0;
    
    // 1. Referred By: Max 3
    const referredMarks = { "Internship": 3, "Referred By": 2, "Platofrm Indeep": 1, "Job Hai": 1 };
    marks += referredMarks[values.referredBy] || 0;

    // 2. Age: Max 3
    const ageMarks = { "31-45yr": 3, "26yr-30yr": 2, "20-25yr": 1 };
    marks += ageMarks[values.ageGroup] || 0;

    // 3. Education: Max 3
    const eduMarks = { "PG with any financial Subject": 3, "Maths/Economics/MBA": 2, "Graduate": 1 };
    marks += eduMarks[values.education] || 0;

    // 4. Operations Experience: Max 10
    const insuranceField = values.insuranceField || values.operationalActivities?.insuranceField;
    const dataManagement = values.dataManagement || values.operationalActivities?.dataManagement;
    const backOffice = values.backOffice || values.operationalActivities?.backOffice;
    const expOther = values.expOther || values.operationalActivities?.anyOther || values.operationalActivities?.expOther;

    if (insuranceField) marks += 4;
    if (dataManagement) marks += 3;
    if (backOffice) marks += 2;
    if (expOther) marks += 1;

    // 5. Sales & Work Experience: Max 15
    const adminTeamMgmt = values.adminTeamMgmt || values.salesExperience?.adminTeamMgmt;
    const salesInsFin = values.salesInsFin || values.salesExperience?.salesInsFin;
    const salesAnyField = values.salesAnyField || values.salesExperience?.salesAnyField;
    const fieldWork = values.fieldWork || values.salesExperience?.fieldWork;
    const salesOther = values.salesOther || values.salesExperience?.salesOther;

    if (adminTeamMgmt) marks += 5;
    if (salesInsFin) marks += 4;
    if (salesAnyField) marks += 3;
    if (fieldWork) marks += 2;
    if (salesOther) marks += 1;

    // 6. Computer Knowledge: Max 3
    const compMarks = { "Advance (M.S office)": 3, "MIS + EXCEL": 2, "Basic": 1 };
    marks += compMarks[values.computerKnowledge] || 0;

    // 7. Resident in Bhopal: Max 2
    const locMarks = { "H.B Road": 2, "Arera Colony": 2, "BHEL": 1, "Mandideep": 1, "Others": 1 };
    marks += locMarks[values.location] || 0;

    // 8. Native Place: Max 2
    if (values.nativePlace === "Bhopal") marks += 2;
    else if (values.nativePlace) marks += 1;

    // 9. Salary Expectation: Max 3
    const salaryMarks = { "12-15K": 3, "15-18K": 2, "18-20K": 1, "20-25k": 1 };
    marks += salaryMarks[values.salaryExpectation] || 0;

    // 10. Vehicle: Max 2
    const vehicleVal = values.vehicle;
    if (vehicleVal === "YES" || vehicleVal === true) marks += 2;
    else if (vehicleVal === "NO" || vehicleVal === false) marks += 1;

    return marks;
  };

  const getMarksBreakdown = (values) => {
    if (!values) return [];

    const insuranceField = values.insuranceField || values.operationalActivities?.insuranceField;
    const dataManagement = values.dataManagement || values.operationalActivities?.dataManagement;
    const backOffice = values.backOffice || values.operationalActivities?.backOffice;
    const expOther = values.expOther || values.operationalActivities?.anyOther || values.operationalActivities?.expOther;

    const adminTeamMgmt = values.adminTeamMgmt || values.salesExperience?.adminTeamMgmt;
    const salesInsFin = values.salesInsFin || values.salesExperience?.salesInsFin;
    const salesAnyField = values.salesAnyField || values.salesExperience?.salesAnyField;
    const fieldWork = values.fieldWork || values.salesExperience?.fieldWork;
    const salesOther = values.salesOther || values.salesExperience?.salesOther;

    const vehicleVal = values.vehicle;
    const vehicleScore = (vehicleVal === "YES" || vehicleVal === true) ? 2 : (vehicleVal === "NO" || vehicleVal === false) ? 1 : 0;

    return [
      { 
        label: "Referred By", 
        score: { "Internship": 3, "Referred By": 2, "Platofrm Indeep": 1, "Job Hai": 1 }[values.referredBy] || 0, 
        max: 3 
      },
      { 
        label: "Age Group", 
        score: values.ageGroup === "31-45yr" ? 3 : values.ageGroup === "26yr-30yr" ? 2 : values.ageGroup === "20-25yr" ? 1 : 0, 
        max: 3 
      },
      { 
        label: "Education", 
        score: values.education === "PG with any financial Subject" ? 3 : values.education === "Maths/Economics/MBA" ? 2 : values.education === "Graduate" ? 1 : 0, 
        max: 3 
      },
      { 
        label: "Operations Experience", 
        score: (insuranceField ? 4 : 0) + (dataManagement ? 3 : 0) + (backOffice ? 2 : 0) + (expOther ? 1 : 0), 
        max: 10 
      },
      { 
        label: "Sales Experience", 
        score: (adminTeamMgmt ? 5 : 0) + (salesInsFin ? 4 : 0) + (salesAnyField ? 3 : 0) + (fieldWork ? 2 : 0) + (salesOther ? 1 : 0), 
        max: 15 
      },
      { 
        label: "Computer Knowledge", 
        score: { "Advance (M.S office)": 3, "MIS + EXCEL": 2, "Basic": 1 }[values.computerKnowledge] || 0, 
        max: 3 
      },
      { 
        label: "Location (Resident)", 
        score: { "H.B Road": 2, "Arera Colony": 2, "BHEL": 1, "Mandideep": 1, "Others": 1 }[values.location] || 0, 
        max: 2 
      },
      { 
        label: "Native Place", 
        score: values.nativePlace === "Bhopal" ? 2 : values.nativePlace ? 1 : 0, 
        max: 2 
      },
      { 
        label: "Salary Expectation", 
        score: { "12-15K": 3, "15-18K": 2, "18-20K": 1, "20-25k": 1 }[values.salaryExpectation] || 0, 
        max: 3 
      },
      { 
        label: "Vehicle", 
        score: vehicleScore, 
        max: 2 
      }
    ];
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
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '95%' }}>
            <Space><EyeOutlined style={{ color: '#1890ff' }} /> Candidate Onboarding Profile</Space>
            {selectedCandidate && (
                <Tag color={(selectedCandidate.totalMarks || calculateMarks(selectedCandidate)) > 35 ? 'success' : (selectedCandidate.totalMarks || calculateMarks(selectedCandidate)) > 20 ? 'warning' : 'error'}>
                    {(selectedCandidate.totalMarks || calculateMarks(selectedCandidate)) > 35 ? 'Highly Recommended' : (selectedCandidate.totalMarks || calculateMarks(selectedCandidate)) > 20 ? 'Potential Match' : 'Below Threshold'}
                </Tag>
            )}
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={900}
        centered
        className="premium-modal"
      >
        {selectedCandidate && (
          <div className="fade-in">
            <Row gutter={24} style={{ marginBottom: 24 }}>
                <Col span={16}>
                    <Descriptions 
                        bordered 
                        column={2} 
                        size="small"
                        labelStyle={{ background: '#fafafa', fontWeight: 600, width: '120px' }}
                    >
                        <Descriptions.Item label="Candidate" span={2}><Text strong style={{ fontSize: 16 }}>{selectedCandidate.candidateName}</Text></Descriptions.Item>
                        <Descriptions.Item label="Mobile">{selectedCandidate.mobileNo}</Descriptions.Item>
                        <Descriptions.Item label="Email">{selectedCandidate.email || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Education" span={2}><Tag color="blue">{selectedCandidate.education}</Tag></Descriptions.Item>
                        <Descriptions.Item label="Location">{selectedCandidate.location}</Descriptions.Item>
                        <Descriptions.Item label="Native">{selectedCandidate.nativePlace}</Descriptions.Item>
                        <Descriptions.Item label="Designation" span={2}>{selectedCandidate.designation || selectedCandidate.appliedFor?.designation || "N/A"}</Descriptions.Item>
                        <Descriptions.Item label="Salary Expect."><Text strong color="green">{selectedCandidate.salaryExpectation || "N/A"}</Text></Descriptions.Item>
                        {selectedCandidate.interviewDate && (
                            <Descriptions.Item label="Interview Date">
                              {dayjs(selectedCandidate.interviewDate).format("DD MMM YYYY")}
                            </Descriptions.Item>
                        )}
                        <Descriptions.Item label="Status" span={2}>
                           <Tag color="blue" icon={<SyncOutlined spin />}>{selectedCandidate.currentStage}</Tag>
                        </Descriptions.Item>
                    </Descriptions>
                </Col>
                <Col span={8} style={{ textAlign: 'center', borderLeft: '1px solid #f0f0f0' }}>
                    <Progress 
                        type="dashboard" 
                        percent={Math.round(((selectedCandidate.totalMarks || calculateMarks(selectedCandidate)) / 46) * 100)} 
                        strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                        format={() => (
                            <div>
                                <div style={{ fontSize: 28, fontWeight: 'bold' }}>{selectedCandidate.totalMarks || calculateMarks(selectedCandidate)}</div>
                                <div style={{ fontSize: 12, color: '#8c8c8c' }}>/ 46 Total</div>
                            </div>
                        )}
                    />
                    <div style={{ marginTop: 10 }}>
                        <Text type="secondary">Evaluation Date: {dayjs(selectedCandidate.appliedDate).format('DD MMM YYYY')}</Text>
                    </div>
                </Col>
            </Row>
            
            <Divider orientation="left"><StarOutlined /> Sales & Operations Breakdown</Divider>
            
            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Text strong style={{ display: 'block', marginBottom: 10 }}>Sales & Field (Max 15)</Text>
                {[
                    { label: 'Admin & Team', key: 'adminTeamMgmt', max: 5 },
                    { label: 'Sales Ins/Fin', key: 'salesInsFin', max: 4 },
                    { label: 'Sales Any', key: 'salesAnyField', max: 3 },
                    { label: 'Field Work', key: 'fieldWork', max: 2 },
                    { label: 'Others', key: 'salesOther', max: 1 }
                ].map(item => {
                    const checked = selectedCandidate[item.key] === true || selectedCandidate.salesExperience?.[item.key] === true;
                    return (
                        <div key={item.key} style={{ marginBottom: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: 11 }}>{item.label}</Text>
                            <Tag color={checked ? 'green' : 'default'} style={{ fontSize: 10 }}>{checked ? item.max : 0} pts</Tag>
                        </div>
                    );
                })}
              </Col>
              <Col span={12} style={{ borderLeft: '1px solid #f0f0f0' }}>
                <Text strong style={{ display: 'block', marginBottom: 10 }}>Operations (Max 10)</Text>
                {[
                    { label: 'Insurance Field', key: 'insuranceField', max: 4 },
                    { label: 'Data Mgmt', key: 'dataManagement', max: 3 },
                    { label: 'Back Office', key: 'backOffice', max: 2 },
                    { label: 'Any Other', key: 'expOther', max: 1 }
                ].map(item => {
                    const checked = selectedCandidate[item.key] === true || selectedCandidate.operationalActivities?.[item.key] === true;
                    return (
                        <div key={item.key} style={{ marginBottom: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: 11 }}>{item.label}</Text>
                            <Tag color={checked ? 'green' : 'default'} style={{ fontSize: 10 }}>{checked ? item.max : 0} pts</Tag>
                        </div>
                    );
                })}
              </Col>
            </Row>

            <Divider orientation="left"><StarOutlined /> Full Marks Distribution (Max 46)</Divider>
            <Table
                size="small"
                pagination={false}
                bordered
                dataSource={getMarksBreakdown(selectedCandidate).map((item, index) => ({ ...item, key: index }))}
                columns={[
                    { title: 'Scoring Category', dataIndex: 'label', key: 'label', render: (t) => <Text strong>{t}</Text> },
                    { 
                        title: 'Points Earned', 
                        dataIndex: 'score', 
                        key: 'score', 
                        align: 'center', 
                        render: (s, r) => <Text strong color={s > 0 ? '#52c41a' : '#000'}>{s} / {r.max}</Text> 
                    },
                    { 
                        title: 'Achievement', 
                        key: 'percent', 
                        render: (_, r) => <Progress percent={Math.round((r.score / r.max) * 100)} size="small" strokeColor={r.score === r.max ? '#52c41a' : '#1890ff'} /> 
                    }
                ]}
                summary={() => (
                    <Table.Summary.Row style={{ background: '#fafafa' }}>
                        <Table.Summary.Cell index={0}><Text strong>TOTAL AGGREGATE SCORE</Text></Table.Summary.Cell>
                        <Table.Summary.Cell index={1} align="center">
                            <Text strong style={{ fontSize: 16, color: (selectedCandidate.totalMarks || calculateMarks(selectedCandidate)) > 30 ? '#52c41a' : '#1890ff' }}>
                                {selectedCandidate.totalMarks || calculateMarks(selectedCandidate)} / 46
                            </Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={2}>
                            <Progress 
                                percent={Math.round(((selectedCandidate.totalMarks || calculateMarks(selectedCandidate)) / 46) * 100)} 
                                strokeColor={(selectedCandidate.totalMarks || calculateMarks(selectedCandidate)) > 30 ? '#52c41a' : '#1890ff'}
                            />
                        </Table.Summary.Cell>
                    </Table.Summary.Row>
                )}
            />

            {selectedCandidate.resume && (
              <div style={{ textAlign: 'center', marginTop: 24, marginBottom: 24 }}>
                <Button
                  type="primary"
                  ghost
                  size="large"
                  icon={<FilePdfOutlined />}
                  onClick={() => window.open(`${axios.defaults.baseURL || import.meta.env.VITE_API_URL || 'http://localhost:6060'}/candidate-resumes/${selectedCandidate.resume}`, '_blank')}
                  style={{ borderRadius: 8 }}
                >
                  View Candidate Resume / Documents
                </Button>
              </div>
            )}

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
