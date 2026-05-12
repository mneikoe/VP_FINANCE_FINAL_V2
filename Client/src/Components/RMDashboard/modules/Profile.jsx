import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../config/axios";
import {
  Layout,
  Row,
  Col,
  Card,
  Typography,
  Tabs,
  Tag,
  Descriptions,
  Avatar,
  Space,
  Button,
  Badge,
  Spin,
  Alert,
  Divider,
  Statistic,
  List,
  Table,
  ConfigProvider
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
  BankOutlined,
  SolutionOutlined,
  CalendarOutlined,
  FilePdfOutlined,
  ArrowLeftOutlined,
  HistoryOutlined,
  SafetyCertificateOutlined,
  RocketOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
  StarOutlined,
  HomeOutlined,
  GlobalOutlined
} from "@ant-design/icons";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";

const { Content } = Layout;
const { Title, Text } = Typography;

const RMProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState(null);

  const fetchRMData = async () => {
    setLoading(true);
    setError(null);
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) throw new Error("Authentication stale. Re-login required.");
      const user = JSON.parse(userStr);
      const userId = user._id || user.id;

      const response = await axios.get("/api/employee/getEmployeeById", {
        params: { employeeId: userId },
      });

      if (response.data.success) {
        setEmployee(response.data.data);
      } else {
        throw new Error(response.data.message || "Synthesis failed.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRMData(); }, []);

  const totalPoints = useMemo(() => {
    if (!employee) return 0;
    const hrPoints = employee.hrActions?.reduce((acc, curr) => acc + (curr.points || 0), 0) || 0;
    const taskPoints = employee.taskRewards?.reduce((acc, curr) => acc + (curr.points || 0), 0) || 0;
    return hrPoints + taskPoints;
  }, [employee]);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "N/A";

  const calculateExperience = (doj) => {
    if (!doj) return "N/A";
    const joinDate = new Date(doj);
    const today = new Date();
    let years = today.getFullYear() - joinDate.getFullYear();
    let months = today.getMonth() - joinDate.getMonth();
    if (months < 0) { years--; months += 12; }
    return `${years}Y ${months}M`;
  };

  if (loading) return <div style={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spin size="large" tip="Synthesizing Profile..." /></div>;

  if (error || !employee) return (
    <Content style={{ padding: 40 }}>
      <Alert message="Profile Inaccessible" description={error} type="error" showIcon action={<Button onClick={fetchRMData}>Retry</Button>} />
    </Content>
  );

  const tabItems = [
    {
      key: 'personal',
      label: <Space><UserOutlined /><span>Personal</span></Space>,
      children: (
        <Card bordered={false}>
          <Descriptions column={{ xxl: 2, xl: 2, lg: 1, md: 1 }} bordered size="small">
            <Descriptions.Item label="Identity">{employee.name}</Descriptions.Item>
            <Descriptions.Item label="Gender">{employee.gender || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Birth Date">{formatDate(employee.dob)}</Descriptions.Item>
            <Descriptions.Item label="Marriage Date">{formatDate(employee.marriageDate)}</Descriptions.Item>
            <Descriptions.Item label="Mobile Primary">{employee.mobileNo}</Descriptions.Item>
            <Descriptions.Item label="Email Primary">{employee.emailId}</Descriptions.Item>
            <Descriptions.Item label="Emergency Contact">{employee.emergencyContactPerson} ({employee.emergencyContactMobile})</Descriptions.Item>
            <Descriptions.Item label="Family Liaison">{employee.familyContactPerson} ({employee.familyContactMobile})</Descriptions.Item>
          </Descriptions>
        </Card>
      )
    },
    {
      key: 'official',
      label: <Space><SolutionOutlined /><span>Official</span></Space>,
      children: (
        <Card bordered={false}>
          <Descriptions column={{ xxl: 2, xl: 2, lg: 1, md: 1 }} bordered size="small">
            <Descriptions.Item label="Employee Code"><Tag color="purple">{employee.employeeCode}</Tag></Descriptions.Item>
            <Descriptions.Item label="Designation">{employee.designation || 'Relationship Manager'}</Descriptions.Item>
            <Descriptions.Item label="Service Tenure"><Tag color="blue">{calculateExperience(employee.dateOfJoining)}</Tag></Descriptions.Item>
            <Descriptions.Item label="Joining Date">{formatDate(employee.dateOfJoining)}</Descriptions.Item>
            <Descriptions.Item label="Work Jurisdiction">{employee.workArea || 'General'}</Descriptions.Item>
            <Descriptions.Item label="Office digital">{employee.officeEmail || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Base Compensation">{employee.salaryOnJoining || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Target Allocation">{employee.target?.path ? <Button size="small" type="link" icon={<FilePdfOutlined />} href={`${axios.defaults.baseURL}${employee.target.path}`} target="_blank">View Docs</Button> : 'N/A'}</Descriptions.Item>
          </Descriptions>
        </Card>
      )
    },
    {
      key: 'address',
      label: <Space><EnvironmentOutlined /><span>Address</span></Space>,
      children: (
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card title="Current Residence" size="small" style={{ borderRadius: 12 }}>
              <Text>{employee.presentAddress || 'Not registered'}</Text>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Permanent Domicile" size="small" style={{ borderRadius: 12 }}>
              <Text>{employee.permanentAddress || 'Not registered'}</Text>
            </Card>
          </Col>
        </Row>
      )
    },
    {
      key: 'financial',
      label: <Space><BankOutlined /><span>Bank</span></Space>,
      children: (
        <Card bordered={false}>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Institution">{employee.bankName || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Account Identity">{employee.accountNo || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="IFSC Code">{employee.ifscCode || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="PAN Identity">{employee.panNo || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Aadhar Identity">{employee.aadharNo || 'N/A'}</Descriptions.Item>
          </Descriptions>
        </Card>
      )
    },
    {
      key: 'hr-actions',
      label: <Space><SafetyCertificateOutlined /><span>Performance & Docs</span></Space>,
      children: (
        <div style={{ padding: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <Title level={5} style={{ margin: 0 }}>HR Actions & Reviews</Title>
            <Badge count={`HR Points: ${employee.hrActions?.reduce((acc, curr) => acc + (curr.points || 0), 0) || 0}`} style={{ backgroundColor: '#faad14' }} />
          </div>
          
          <Divider orientation="left" style={{ margin: '12px 0' }}><Text type="secondary" small>TIMELINE</Text></Divider>
          
          {employee.hrActions && employee.hrActions.length > 0 ? (
            <List
              itemLayout="vertical"
              dataSource={employee.hrActions}
              renderItem={(action, idx) => (
                <List.Item key={idx} style={{ padding: '16px', background: '#f8fafc', borderRadius: 12, marginBottom: 16, borderLeft: `4px solid ${action.actionType === 'Warning' ? '#ef4444' : action.actionType === 'Appreciation' ? '#22c55e' : '#3b82f6'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <Title level={5} style={{ margin: 0, fontSize: 16 }}>{action.title}</Title>
                    <Tag color={action.actionType === 'Warning' ? 'error' : action.actionType === 'Appreciation' ? 'success' : 'processing'}>{action.actionType}</Tag>
                  </div>
                  <div style={{ margin: '4px 0 12px 0' }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>📅 {formatDate(action.actionDate)} • </Text>
                    <Text strong style={{ fontSize: 12, color: action.points >= 0 ? '#22c55e' : '#ef4444' }}>⭐ Points: {action.points}</Text>
                  </div>
                  <div 
                    style={{ fontSize: 14, color: '#475569', lineHeight: 1.6 }}
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(action.description) }}
                  />
                  {action.files && action.files.length > 0 && (
                    <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
                      <Text strong style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 8, letterSpacing: 0.5 }}>ATTACHMENTS</Text>
                      <Space wrap>
                        {action.files.map((file, fIdx) => (
                          <Button 
                            key={fIdx} 
                            size="small" 
                            type="dashed" 
                            icon={<FilePdfOutlined />} 
                            href={`${axios.defaults.baseURL}${file.path}`} 
                            target="_blank"
                            style={{ borderRadius: 6, fontSize: 12 }}
                          >
                            {file.name}
                          </Button>
                        ))}
                      </Space>
                    </div>
                  )}
                </List.Item>
              )}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '32px 0', background: '#f8fafc', borderRadius: 12 }}>
              <HistoryOutlined style={{ fontSize: 32, color: '#cbd5e1', marginBottom: 12 }} />
              <p style={{ color: '#64748b', margin: 0 }}>No actions or reviews recorded yet.</p>
            </div>
          )}

          <Divider orientation="left" style={{ margin: '24px 0 12px 0' }}><Text type="secondary" small>OFFICIAL DOCUMENTS</Text></Divider>
          
          {employee.generalDocuments && employee.generalDocuments.length > 0 ? (
            <Row gutter={[12, 12]}>
              {employee.generalDocuments.map((doc, dIdx) => (
                <Col xs={24} sm={12} key={dIdx}>
                  <Card size="small" style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ background: '#fef2f2', padding: 8, borderRadius: 8 }}>
                        <FilePdfOutlined style={{ fontSize: 20, color: '#ef4444' }} />
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <Text strong style={{ display: 'block', fontSize: 13 }} ellipsis title={doc.name}>{doc.name}</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>{formatDate(doc.uploadedAt)}</Text>
                      </div>
                      <Button 
                        size="small" 
                        type="link" 
                        style={{ marginLeft: 'auto' }} 
                        href={`${axios.defaults.baseURL}${doc.path}`} 
                        target="_blank"
                      >
                        View
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0', background: '#f8fafc', borderRadius: 12, border: '1px dashed #e2e8f0' }}>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: 13 }}>No general documents uploaded.</p>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'task-rewards',
      label: <Space><TrophyOutlined /><span>Task Rewards</span></Space>,
      children: (
        <div style={{ padding: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <Title level={5} style={{ margin: 0 }}>Earned Task Incentives</Title>
            <Badge count={`Reward Points: ${employee.taskRewards?.reduce((acc, curr) => acc + (curr.points || 0), 0) || 0}`} style={{ backgroundColor: '#52c41a' }} />
          </div>

          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={12}>
              <Card style={{ background: '#f0f9ff', border: 'none', borderRadius: 16 }}>
                <Statistic 
                  title="Completed Reward Tasks" 
                  value={employee.taskRewards?.length || 0} 
                  prefix={<ThunderboltOutlined style={{ color: '#0ea5e9' }} />} 
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card style={{ background: '#ecfdf5', border: 'none', borderRadius: 16 }}>
                <Statistic 
                  title="Performance Standing" 
                  value="Excellent" 
                  prefix={<StarOutlined style={{ color: '#10b981' }} />} 
                />
              </Card>
            </Col>
          </Row>

          <Table 
            dataSource={employee.taskRewards} 
            pagination={{ pageSize: 5 }}
            size="small"
            rowKey={(record, index) => record._id || `reward-${index}`}
            columns={[
              {
                title: 'Date',
                dataIndex: 'rewardDate',
                key: 'rewardDate',
                render: (date) => formatDate(date)
              },
              {
                title: 'Task Name',
                dataIndex: 'taskName',
                key: 'taskName',
                render: (text) => <Text strong>{text}</Text>
              },
              {
                title: 'Points',
                dataIndex: 'points',
                key: 'points',
                render: (p) => <Tag color="green">+{p} pts</Tag>
              },
              {
                title: 'Remarks',
                dataIndex: 'remarks',
                key: 'remarks',
                render: (text) => <Text type="secondary" size="small" style={{ fontSize: 12 }}>{text}</Text>
              }
            ]}
          />
        </div>
      )
    }
  ];

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#4f46e5', borderRadius: 16 } }}>
      <Content style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
        <Row gutter={[24, 24]}>
          {/* Sidebar */}
          <Col xs={24} lg={7}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Card 
                style={{ borderRadius: 24, textAlign: 'center', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white' }}
                bordered={false}
              >
                <Avatar size={100} icon={<UserOutlined />} style={{ border: '4px solid rgba(255,255,255,0.2)', marginBottom: 16 }} />
                <Title level={3} style={{ color: 'white', margin: 0 }}>{employee.name}</Title>
                <Text style={{ color: 'rgba(255,255,255,0.8)' }}>{employee.designation || 'Strategic Partner'}</Text>
                <div style={{ marginTop: 16 }}><Tag color="white" style={{ color: '#4f46e5' }}>{employee.employeeCode}</Tag></div>
                
                <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                
                <div style={{ textAlign: 'left' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Text style={{ color: 'white' }}><MailOutlined /> {employee.emailId}</Text>
                    <Text style={{ color: 'white' }}><PhoneOutlined /> {employee.mobileNo}</Text>
                    <Text style={{ color: 'white' }}><GlobalOutlined /> {employee.workArea || 'Unassigned'}</Text>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}><TrophyOutlined /> Total Performance: {totalPoints} pts</Text>
                  </Space>
                </div>
              </Card>

              <Card style={{ marginTop: 24, borderRadius: 24 }}>
                <Statistic title="Total Rewards" value={totalPoints} suffix="pts" prefix={<StarOutlined />} valueStyle={{ color: '#4f46e5' }} />
                <Divider />
                <Statistic title="Service Tenure" value={calculateExperience(employee.dateOfJoining)} prefix={<HistoryOutlined />} />
              </Card>
            </motion.div>
          </Col>

          {/* Main Content */}
          <Col xs={24} lg={17}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card style={{ borderRadius: 24 }} styles={{ body: { padding: '24px 32px' } }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                  <Title level={4} style={{ margin: 0 }}>Employee Profile</Title>
                  <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/rm/dashboard")}>Return</Button>
                </div>
                <Tabs items={tabItems} type="card" />
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Content>
    </ConfigProvider>
  );
};

export default RMProfile;
