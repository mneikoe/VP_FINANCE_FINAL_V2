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
} from "@ant-design/icons";
import axios from "axios";
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [vRes, cRes] = await Promise.all([
        axios.get("/api/vacancynotice"),
        axios.get("/api/addcandidate"),
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
    if (values.education === "Graduate in any") marks += 2;
    if (values.education === "Graduate in Maths/Economics") marks += 3;
    if (values.education === "MBA/PG with financial subject") marks += 4;

    if (values.ageGroup === "20-25yr") marks += 1;
    if (values.ageGroup === "26-30yr") marks += 2;
    if (values.ageGroup === "31-45yr") marks += 3;
    if (values.ageGroup === "45 & above") marks += 2;

    if (values.vehicle) marks += 4;
    if (values.spokenEnglish) marks += 4;

    marks += (values.administrative || 0);
    marks += (values.insuranceSales || 0);
    marks += (values.anySales || 0);
    marks += (values.fieldWork || 0);
    marks += (values.dataManagement || 0);
    marks += (values.backOffice || 0);
    marks += (values.mis || 0);

    const locMarks = { "H.B Road": 4, "Arera Colony": 3, "BHEL": 2, "Mandideep": 2, "Others": 1 };
    marks += locMarks[values.location] || 0;

    if (values.nativePlace === "Bhopal") marks += 3;
    else if (values.nativePlace) marks += 1;

    const salMarks = { "10K-12K": 4, "12-15K": 3, "15-18K": 3, "18-20K": 2, "20-25K": 2, "25K & Above": 1 };
    marks += salMarks[values.salaryExpectation] || 0;

    return marks;
  };

  const onFinish = async (values) => {
    setSubmitLoading(true);
    const formData = new FormData();
    Object.keys(values).forEach(key => {
        if (values[key] !== undefined) {
            if (key === 'interviewDate' && values[key]) {
                formData.append(key, values[key].format('YYYY-MM-DD'));
            } else {
                formData.append(key, values[key]);
            }
        }
    });

    if (resume) {
      formData.append("resume", resume);
    }

    try {
      const response = await axios.post("/api/addcandidate/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
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

  const columns = [
    {
      title: "Candidate Name",
      dataIndex: "candidateName",
      key: "name",
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.email}</Text>
        </Space>
      ),
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
    },
    {
      title: "Mobile",
      dataIndex: "mobileNo",
      key: "mobile",
    },
    {
      title: "Marks",
      key: "marks",
      render: (_, record) => {
        const marks = record.totalMarks || calculateMarks(record);
        return <Badge count={marks} showZero color={marks > 30 ? '#52c41a' : marks > 20 ? '#faad14' : '#f5222d'} />;
      }
    },
    {
      title: "Stage",
      dataIndex: "currentStage",
      key: "stage",
      render: (stage) => <Tag color="blue">{stage || "Applied"}</Tag>
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button 
          type="text" 
          icon={<EyeOutlined />} 
          onClick={() => { setSelectedCandidate(record); setIsModalOpen(true); }}
        />
      ),
    },
  ];

  return (
    <div className="fade-in">
      <Card bordered={false} style={{ borderRadius: 12, marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0 }}>Candidate Management</Title>
            <Text type="secondary">Add, evaluate and track job applicants</Text>
          </Col>
          <Col>
             <Button icon={<ReloadOutlined />} onClick={fetchData}>Refresh</Button>
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
            label: <Space><UserAddOutlined /> Add Candidate</Space>,
            children: (
              <Card bordered={false} style={{ borderRadius: '0 0 12px 12px' }}>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  initialValues={{
                    administrative: 0, insuranceSales: 0, anySales: 0, fieldWork: 0,
                    dataManagement: 0, backOffice: 0, mis: 0
                  }}
                >
                  <Title level={5} style={{ marginBottom: 20 }}><UserAddOutlined /> Personal & Education Details</Title>
                  <Row gutter={24}>
                    <Col xs={24} md={8}>
                      <Form.Item label="Full Name" name="candidateName" rules={[{ required: true }]}>
                        <Input prefix={<UserAddOutlined />} placeholder="John Doe" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item label="Mobile No" name="mobileNo" rules={[{ required: true }]}>
                        <Input prefix={<PhoneOutlined />} placeholder="+91" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item label="Email ID" name="email">
                        <Input prefix={<MailOutlined />} placeholder="john@example.com" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item label="Education" name="education">
                        <Select placeholder="Select Qualification">
                          <Option value="Graduate in any">Graduate in any</Option>
                          <Option value="Graduate in Maths/Economics">Graduate in Maths/Economics</Option>
                          <Option value="MBA/PG with financial subject">MBA/PG with financial subject</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item label="Age Group" name="ageGroup">
                        <Select placeholder="Select Age Group">
                          <Option value="20-25yr">20-25yr</Option>
                          <Option value="26-30yr">26-30yr</Option>
                          <Option value="31-45yr">31-45yr</Option>
                          <Option value="45 & above">45 & above</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item label="Current Location" name="location">
                        <Select placeholder="Select Area">
                          <Option value="H.B Road">H.B Road</Option>
                          <Option value="Arera Colony">Arera Colony</Option>
                          <Option value="BHEL">BHEL</Option>
                          <Option value="Mandideep">Mandideep</Option>
                          <Option value="Others">Others</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Divider />
                  <Title level={5} style={{ marginBottom: 20 }}><TrophyOutlined /> Experience & Skill Evaluation (0-5 Marks)</Title>
                  <Row gutter={24}>
                    <Col xs={12} md={6} lg={3}>
                      <Form.Item label="Admin" name="administrative">
                        <InputNumber min={0} max={5} style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={12} md={6} lg={3}>
                      <Form.Item label="Ins. Sales" name="insuranceSales">
                        <InputNumber min={0} max={5} style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={12} md={6} lg={3}>
                      <Form.Item label="Any Sales" name="anySales">
                        <InputNumber min={0} max={5} style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={12} md={6} lg={3}>
                      <Form.Item label="Field Work" name="fieldWork">
                        <InputNumber min={0} max={5} style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={12} md={6} lg={3}>
                      <Form.Item label="Data Mgmt" name="dataManagement">
                        <InputNumber min={0} max={5} style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={12} md={6} lg={3}>
                      <Form.Item label="Back Office" name="backOffice">
                        <InputNumber min={0} max={5} style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={12} md={6} lg={3}>
                      <Form.Item label="MIS" name="mis">
                        <InputNumber min={0} max={5} style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={12} md={6} lg={3}>
                      <Form.Item label="English" name="spokenEnglish" valuePropName="checked">
                        <Checkbox>Spoken</Checkbox>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Divider />
                  <Row gutter={24}>
                    <Col xs={24} md={8}>
                      <Form.Item label="Applied For" name="appliedFor" rules={[{ required: true }]}>
                        <Select placeholder="Select Vacancy">
                          {vacancies.map(v => <Option key={v._id} value={v._id}>{v.designation}</Option>)}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item label="Interview Date" name="interviewDate">
                        <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item label="Resume (PDF)">
                        <Upload 
                          beforeUpload={(file) => { setResume(file); return false; }} 
                          maxCount={1}
                          fileList={resume ? [resume] : []}
                          onRemove={() => setResume(null)}
                        >
                          <Button icon={<UploadOutlined />} block>Select File</Button>
                        </Upload>
                      </Form.Item>
                    </Col>
                  </Row>

                  <div style={{ textAlign: 'right', marginTop: 24 }}>
                    <Space>
                      <Button onClick={() => form.resetFields()}>Reset</Button>
                      <Button type="primary" size="large" htmlType="submit" loading={submitLoading} icon={<UserAddOutlined />}>
                        Add Candidate
                      </Button>
                    </Space>
                  </div>
                </Form>
              </Card>
            )
          },
          {
            key: "2",
            label: <Space><UnorderedListOutlined /> View Candidates</Space>,
            children: (
              <Card bordered={false} style={{ borderRadius: '0 0 12px 12px' }} bodyStyle={{ padding: 0 }}>
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
        title={<Space><EyeOutlined style={{ color: '#1890ff' }} /> Candidate Evaluation Profile</Space>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[<Button key="close" type="primary" onClick={() => setIsModalOpen(false)}>Close Window</Button>]}
        width={850}
        centered
        className="premium-modal"
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
                <Tag color="cyan">{selectedCandidate.designation || selectedCandidate.appliedFor?.designation || "Not Specified"}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Education">{selectedCandidate.education}</Descriptions.Item>
              <Descriptions.Item label="Location">{selectedCandidate.location}</Descriptions.Item>
              <Descriptions.Item label="Total Score">
                <Badge 
                    count={selectedCandidate.totalMarks || calculateMarks(selectedCandidate)} 
                    overflowCount={100}
                    color={ (selectedCandidate.totalMarks || calculateMarks(selectedCandidate)) > 30 ? '#52c41a' : '#faad14'} 
                />
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color="processing" icon={<SyncOutlined spin />}>{selectedCandidate.currentStage || "Applied"}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Applied Date">
                {dayjs(selectedCandidate.createdAt).format("DD MMM YYYY")}
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

            {selectedCandidate.resumeUrl && (
              <>
                <Divider />
                <div style={{ textAlign: 'center' }}>
                  <Button type="dashed" size="large" icon={<FilePdfOutlined />} onClick={() => window.open(selectedCandidate.resumeUrl, '_blank')} block>
                    Open Candidate Resume / CV
                  </Button>
                </div>
              </>
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
        .ant-divider { margin: 24px 0 !important; }
      `}</style>
    </div>
  );
};

export default AddCandidate;
