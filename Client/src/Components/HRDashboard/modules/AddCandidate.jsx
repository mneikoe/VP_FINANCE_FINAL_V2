import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Tabs,
  Table,
  Tag,
  Space,
  Typography,
  Checkbox,
  InputNumber,
  DatePicker,
  Upload,
  Modal,
  message,
  Tooltip,
  Badge,
  Descriptions,
  Divider,
  Progress,
  App,
} from "antd";
import {
  UserAddOutlined,
  UnorderedListOutlined,
  SearchOutlined,
  ReloadOutlined,
  UploadOutlined,
  EyeOutlined,
  StarOutlined,
  FilePdfOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  TrophyOutlined,
  SyncOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../../config/axios";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

const AddCandidate = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [vacancies, setVacancies] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [resume, setResume] = useState(null);
  const { message, modal } = App.useApp();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [vRes, cRes] = await Promise.all([
        axiosInstance.get("/api/vacancynotice"),
        axiosInstance.get("/api/addcandidate"),
      ]);
      setVacancies(vRes.data.vacancies || []);
      setCandidates(cRes.data.candidates || []);
    } catch (error) {
      message.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const calculateMarks = (values) => {
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
    if (values.insuranceField) marks += 4; // Insurance
    if (values.dataManagement) marks += 3; // Data Mgmt + CPCT
    if (values.backOffice) marks += 2;      // Back Office
    if (values.expOther) marks += 1;        // Any other

    // 5. Sales & Work Experience: Max 15
    if (values.adminTeamMgmt) marks += 5;
    if (values.salesInsFin) marks += 4;
    if (values.salesAnyField) marks += 3;
    if (values.fieldWork) marks += 2;
    if (values.salesOther) marks += 1;

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
    if (values.vehicle === "YES") marks += 2;
    else if (values.vehicle === "NO") marks += 1;

    return marks;
  };

  const getMarksBreakdown = (values) => {
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
        score: (values.insuranceField ? 4 : 0) + (values.dataManagement ? 3 : 0) + (values.backOffice ? 2 : 0) + (values.expOther ? 1 : 0), 
        max: 10 
      },
      { 
        label: "Sales Experience", 
        score: (values.adminTeamMgmt ? 5 : 0) + (values.salesInsFin ? 4 : 0) + (values.salesAnyField ? 3 : 0) + (values.fieldWork ? 2 : 0) + (values.salesOther ? 1 : 0), 
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
        score: values.vehicle === "YES" ? 2 : values.vehicle === "NO" ? 1 : 0, 
        max: 2 
      }
    ];
  };

  const onFinish = async (values) => {
    setSubmitLoading(true);
    
    const formData = new FormData();
    
    // Send all fields as individual entries to match candidateRoutes.js expectations
    Object.keys(values).forEach(key => {
        if (values[key] !== undefined && values[key] !== null) {
            if (key === 'interviewDate') {
                formData.append(key, values[key].format('YYYY-MM-DD'));
            } else {
                formData.append(key, values[key]);
            }
        }
    });

    // Explicitly add totalMarks for backup (though backend calculates it)
    formData.append("totalMarks", calculateMarks(values));

    if (resume) {
      formData.append("resume", resume);
    }

    try {
      const res = await axiosInstance.post("/api/addcandidate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        message.success("Candidate added successfully!");
        form.resetFields();
        setResume(null);
        fetchData();
        setActiveTab("2");
      }
    } catch (error) {
      message.error("Failed to add candidate");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = (id) => {
    modal.confirm({
      title: 'Are you sure you want to delete this candidate?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const res = await axiosInstance.delete(`/api/addcandidate/${id}`);
          if (res.data.success) {
            message.success('Candidate deleted successfully');
            fetchData();
          }
        } catch (error) {
          message.error('Failed to delete candidate');
        }
      },
    });
  };

  const columns = [
    {
      title: "Candidate Name",
      dataIndex: "candidateName",
      key: "name",
      render: (text, record) => (
        <Space direction="vertical" size={0} style={{ textAlign: 'left' }}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: '11px' }}>{record.email || "No email"}</Text>
        </Space>
      ),
    },
    {
      title: "Mobile",
      dataIndex: "mobileNo",
      key: "mobile",
    },
    {
      title: "Qualification",
      dataIndex: "education",
      key: "education",
      render: (edu) => <Text style={{ fontSize: '12px' }}>{edu || "N/A"}</Text>
    },
    {
      title: "Evaluation Score",
      key: "marks",
      render: (_, record) => {
        const marks = record.totalMarks || calculateMarks(record);
        const color = marks > 35 ? '#52c41a' : marks > 20 ? '#faad14' : '#f5222d';
        return (
          <Space>
            <Progress 
                type="circle" 
                percent={(marks / 61) * 100} 
                size={30} 
                strokeColor={color} 
                format={() => marks} 
            />
            <Text type="secondary" style={{ fontSize: '10px' }}>/61</Text>
          </Space>
        );
      }
    },
    {
      title: "Stage",
      dataIndex: "currentStage",
      key: "stage",
      render: (stage) => {
        const colors = {
            'Career Enquiry': 'default',
            'Resume Shortlisted': 'cyan',
            'Interview Process': 'blue',
            'Selected': 'green',
            'Joining Data': 'purple'
        };
        return <Tag color={colors[stage] || 'blue'}>{stage || "Applied"}</Tag>;
      }
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View Profile & Evaluation">
              <Button 
                type="text" 
                icon={<EyeOutlined style={{ color: '#1890ff' }} />} 
                onClick={() => { setSelectedCandidate(record); setIsModalOpen(true); }}
              />
          </Tooltip>
          <Tooltip title="Delete Candidate">
              <Button 
                type="text" 
                danger
                icon={<DeleteOutlined />} 
                onClick={() => handleDelete(record._id)}
              />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="fade-in">
      <Card bordered={false} style={{ borderRadius: 12, marginBottom: 24, background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0, color: '#fff' }}>Recruitment Control Center</Title>
            <Text style={{ color: 'rgba(255,255,255,0.85)' }}>Comprehensive evaluation & point-based candidate assessment</Text>
          </Col>
          <Col>
             <Button icon={<ReloadOutlined />} onClick={fetchData} style={{ borderRadius: 8 }}>Refresh Data</Button>
          </Col>
        </Row>
      </Card>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        type="card"
        items={[
          {
            key: "1",
            label: <Space><UserAddOutlined /> New Candidate Evaluation</Space>,
            children: (
              <Card bordered={false} style={{ borderRadius: '0 0 12px 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  initialValues={{
                    administrative: 0, insuranceSales: 0, anySales: 0, fieldWork: 0,
                    dataManagement: 0, backOffice: 0, mis: 0, nativePlace: "Bhopal"
                  }}
                >
                  <Row gutter={24}>
                    <Col xs={24} lg={16}>
                        <Divider orientation="left" style={{ marginTop: 0 }}><UserAddOutlined /> Basic Profile & Qualifications</Divider>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="Full Name" name="candidateName" rules={[{ required: true }]}>
                                    <Input prefix={<UserAddOutlined />} placeholder="Full Name" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item 
                                    label="Mobile No" 
                                    name="mobileNo" 
                                    rules={[
                                        { required: true, message: 'Mobile number is required' },
                                        { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit mobile number' }
                                    ]}
                                >
                                    <Input prefix={<PhoneOutlined />} placeholder="10-digit number" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item 
                                    label="Email ID" 
                                    name="email"
                                    rules={[
                                        { type: 'email', message: 'Please enter a valid email' }
                                    ]}
                                >
                                    <Input prefix={<MailOutlined />} placeholder="email@example.com" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Referred By" name="referredBy" rules={[{ required: true }]}>
                                    <Select placeholder="Select Reference">
                                        <Option value="Internship">Internship (3 pts)</Option>
                                        <Option value="Referred By">Referred By (2 pts)</Option>
                                        <Option value="Platofrm Indeep">Platofrm Indeep (1 pt)</Option>
                                        <Option value="Job Hai">Job Hai (1 pt)</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Education" name="education" rules={[{ required: true }]}>
                                    <Select placeholder="Select Qualification">
                                        <Option value="PG with any financial Subject">PG Finance (3 pts)</Option>
                                        <Option value="Maths/Economics/MBA">Maths/Economics/MBA (2 pts)</Option>
                                        <Option value="Graduate">Graduate (1 pt)</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Age Group" name="ageGroup" rules={[{ required: true }]}>
                                    <Select placeholder="Select Age Group">
                                        <Option value="31-45yr">31-45yr (3 pts)</Option>
                                        <Option value="26yr-30yr">26yr-30yr (2 pts)</Option>
                                        <Option value="20-25yr">20-25yr (1 pt)</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Computer Knowledge" name="computerKnowledge" rules={[{ required: true }]}>
                                    <Select placeholder="Select Proficiency">
                                        <Option value="Advance (M.S office)">Advance (M.S office) (3 pts)</Option>
                                        <Option value="MIS + EXCEL">MIS + EXCEL (2 pts)</Option>
                                        <Option value="Basic">Basic (1 pt)</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Current Location" name="location" rules={[{ required: true }]}>
                                    <Select placeholder="Select Area">
                                        <Option value="H.B Road">H.B Road (2 pts)</Option>
                                        <Option value="Arera Colony">Arera Colony (2 pts)</Option>
                                        <Option value="BHEL">BHEL (1 pt)</Option>
                                        <Option value="Mandideep">Mandideep (1 pt)</Option>
                                        <Option value="Others">Others (1 pt)</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Native Place" name="nativePlace" rules={[{ required: true }]}>
                                    <Input placeholder="e.g. Bhopal" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Salary Expectation" name="salaryExpectation" rules={[{ required: true }]}>
                                    <Select placeholder="Select Range">
                                        <Option value="12-15K">12-15K (3 pts)</Option>
                                        <Option value="15-18K">15-18K (2 pts)</Option>
                                        <Option value="18-20K">18-20K (1 pt)</Option>
                                        <Option value="20-25k">20-25k (1 pt)</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Vehicle (Y/N)" name="vehicle" rules={[{ required: true }]}>
                                    <Select placeholder="Vehicle Available?">
                                        <Option value="YES">YES (2 pts)</Option>
                                        <Option value="NO">NO (1 pt)</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Applied For" name="appliedFor" rules={[{ required: true }]}>
                                    <Select placeholder="Select Vacancy">
                                        {vacancies.map(v => <Option key={v._id} value={v._id}>{v.designation}</Option>)}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider orientation="left"><TrophyOutlined /> Sales & Work Experience (Screenshot 2)</Divider>
                        <Row gutter={[16, 12]}>
                            {[
                                { name: 'adminTeamMgmt', label: 'Administrative Work & Team Management', pts: 5 },
                                { name: 'salesInsFin', label: 'Sales in Insurance & Financial Field', pts: 4 },
                                { name: 'salesAnyField', label: 'Sales & Services in any field', pts: 3 },
                                { name: 'fieldWork', label: 'Field Work', pts: 2 },
                                { name: 'salesOther', label: 'Others', pts: 1 },
                            ].map(skill => (
                                <Col span={8} key={skill.name}>
                                    <Form.Item name={skill.name} valuePropName="checked" noStyle>
                                        <Card size="small" hoverable style={{ border: '1px solid #f0f0f0' }} bodyStyle={{ padding: '8px 12px' }}>
                                            <Checkbox style={{ width: '100%' }}>
                                                <Text strong style={{ fontSize: '12px' }}>{skill.label}</Text>
                                                <div style={{ fontSize: '11px', color: '#8c8c8c' }}>{skill.pts} Points</div>
                                            </Checkbox>
                                        </Card>
                                    </Form.Item>
                                </Col>
                            ))}
                        </Row>

                        <Divider orientation="left"><TrophyOutlined /> Operations Experience (Screenshot 1)</Divider>
                        <Row gutter={[16, 12]}>
                            {[
                                { name: 'insuranceField', label: 'Insurance & Financial Field', pts: 4 },
                                { name: 'dataManagement', label: 'Data Management with CPCT', pts: 3 },
                                { name: 'backOffice', label: 'Back Office Operations', pts: 2 },
                                { name: 'expOther', label: 'Any other', pts: 1 },
                            ].map(skill => (
                                <Col span={12} key={skill.name}>
                                    <Form.Item name={skill.name} valuePropName="checked" noStyle>
                                        <Card size="small" hoverable style={{ border: '1px solid #f0f0f0' }} bodyStyle={{ padding: '8px 12px' }}>
                                            <Checkbox style={{ width: '100%' }}>
                                                <Text strong style={{ fontSize: '12px' }}>{skill.label}</Text>
                                                <div style={{ fontSize: '11px', color: '#8c8c8c' }}>{skill.pts} Points</div>
                                            </Checkbox>
                                        </Card>
                                    </Form.Item>
                                </Col>
                            ))}
                        </Row>
                        <div style={{ marginTop: 12, background: '#fff7e6', padding: '8px 12px', borderRadius: 8, border: '1px solid #ffe7ba' }}>
                            <Text type="warning" strong style={{ fontSize: 13 }}><StarOutlined /> NOTE: Minimum 2yrs experience required in work experience</Text>
                        </div>
                    </Col>

                    <Col xs={24} lg={8}>
                        <Card 
                            style={{ position: 'sticky', top: 0, borderRadius: 12, border: '1px solid #e8e8e8', background: '#fafafa' }}
                            title={<Space><StarOutlined style={{ color: '#faad14' }} /> Real-time Evaluation Scorecard</Space>}
                        >
                            <Form.Item noStyle shouldUpdate>
                                {() => {
                                    const values = form.getFieldsValue();
                                    const score = calculateMarks(values);
                                    const breakdown = getMarksBreakdown(values);
                                    const percent = (score / 46) * 100;
                                    
                                    return (
                                        <div>
                                            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                                                <Progress 
                                                    type="dashboard" 
                                                    percent={percent} 
                                                    strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                                                    format={() => (
                                                        <div>
                                                            <div style={{ fontSize: 24, fontWeight: 'bold' }}>{score}</div>
                                                            <div style={{ fontSize: 12, color: '#8c8c8c' }}>/ 46 Points</div>
                                                        </div>
                                                    )}
                                                />
                                                <div style={{ marginTop: 8 }}>
                                                    <Tag color={score > 35 ? 'success' : score > 20 ? 'warning' : 'error'}>
                                                        {score > 35 ? 'Highly Recommended' : score > 20 ? 'Potential Match' : 'Below Threshold'}
                                                    </Tag>
                                                </div>
                                            </div>

                                            <Title level={5} style={{ fontSize: 14, marginBottom: 12 }}>Points Breakdown</Title>
                                            {breakdown.map((item, idx) => (
                                                <div key={idx} style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Text style={{ fontSize: 12 }}>{item.label}</Text>
                                                    <Badge 
                                                        count={`${item.score}/${item.max}`} 
                                                        style={{ backgroundColor: item.score > 0 ? '#52c41a' : '#d9d9d9' }} 
                                                    />
                                                </div>
                                            ))}

                                            <Divider style={{ margin: '12px 0' }} />
                                            <Form.Item label="Interview Date" name="interviewDate">
                                                <DatePicker style={{ width: '100%' }} />
                                            </Form.Item>
                                            <Form.Item label="Resume (PDF)">
                                                <Upload 
                                                    beforeUpload={(file) => { setResume(file); return false; }} 
                                                    maxCount={1}
                                                    fileList={resume ? [resume] : []}
                                                    onRemove={() => setResume(null)}
                                                >
                                                    <Button icon={<UploadOutlined />} block>Select PDF</Button>
                                                </Upload>
                                            </Form.Item>

                                            <Button 
                                                type="primary" 
                                                block 
                                                size="large" 
                                                htmlType="submit" 
                                                loading={submitLoading}
                                                style={{ marginTop: 16, height: 45, borderRadius: 8 }}
                                            >
                                                Save Candidate Evaluation
                                            </Button>
                                        </div>
                                    );
                                }}
                            </Form.Item>
                        </Card>
                    </Col>
                  </Row>
                </Form>
              </Card>
            )
          },
          {
            key: "2",
            label: <Space><UnorderedListOutlined /> Evaluation Pipeline</Space>,
            children: (
              <Card variant="borderless" style={{ borderRadius: '0 0 12px 12px' }} styles={{ body: { padding: 0 } }}>
                <Table 
                  columns={columns} 
                  dataSource={candidates} 
                  rowKey="_id" 
                  loading={loading}
                  pagination={{ pageSize: 10 }}
                  className="custom-table"
                />
              </Card>
            )
          }
        ]}
      />

      <Modal
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '95%' }}>
            <Space><EyeOutlined style={{ color: '#1890ff' }} /> Candidate Evaluation Report</Space>
            {selectedCandidate && (
                <Tag color={(selectedCandidate.totalMarks || calculateMarks(selectedCandidate)) > 35 ? 'success' : (selectedCandidate.totalMarks || calculateMarks(selectedCandidate)) > 20 ? 'warning' : 'error'}>
                    {(selectedCandidate.totalMarks || calculateMarks(selectedCandidate)) > 35 ? 'Highly Recommended' : (selectedCandidate.totalMarks || calculateMarks(selectedCandidate)) > 20 ? 'Potential Match' : 'Below Threshold'}
                </Tag>
            )}
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[<Button key="close" type="primary" onClick={() => setIsModalOpen(false)}>Close Evaluation</Button>]}
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
                    </Descriptions>
                </Col>
                <Col span={8} style={{ textAlign: 'center', borderLeft: '1px solid #f0f0f0' }}>
                    <Progress 
                        type="dashboard" 
                        percent={((selectedCandidate.totalMarks || calculateMarks(selectedCandidate)) / 46) * 100} 
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
                        render: (_, r) => <Progress percent={(r.score / r.max) * 100} size="small" strokeColor={r.score === r.max ? '#52c41a' : '#1890ff'} /> 
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
                                percent={((selectedCandidate.totalMarks || calculateMarks(selectedCandidate)) / 46) * 100} 
                                strokeColor={(selectedCandidate.totalMarks || calculateMarks(selectedCandidate)) > 30 ? '#52c41a' : '#1890ff'}
                            />
                        </Table.Summary.Cell>
                    </Table.Summary.Row>
                )}
            />

            {selectedCandidate.resumeUrl && (
              <div style={{ textAlign: 'center', marginTop: 32 }}>
                <Button type="primary" ghost size="large" icon={<FilePdfOutlined />} onClick={() => window.open(selectedCandidate.resumeUrl, '_blank')} style={{ borderRadius: 8 }}>
                  View Candidate Resume / Documents
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <style>{`
        .custom-table .ant-table-thead > tr > th {
          background-color: #f0f2f5 !important;
          color: #262626 !important;
          font-weight: 600 !important;
          border-bottom: 2px solid #e8e8e8 !important;
        }
        .premium-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
        }
        .ant-divider-horizontal { margin: 24px 0 !important; }
        .ant-card { transition: all 0.3s; }
        .ant-card-hoverable:hover { transform: translateY(-5px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
      `}</style>
    </div>
  );
};

export default AddCandidate;
