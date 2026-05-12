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
  ThunderboltOutlined,
  HomeOutlined,
  GlobalOutlined,
  AuditOutlined,
  SafetyOutlined
} from "@ant-design/icons";
import { motion } from "framer-motion";

const { Content } = Layout;
const { Title, Text } = Typography;

const OEProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOEData();
  }, []);

  const fetchOEData = async () => {
    setLoading(true);
    setError(null);
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) throw new Error("User not found. Please login again.");
      const user = JSON.parse(userStr);
      const userId = user._id || user.id;

      const response = await axios.get("/api/employee/getEmployeeById", {
        params: { employeeId: userId },
      });

      if (response.data.success && response.data.data) {
        setEmployee(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch profile");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const calculateExperience = (doj) => {
    if (!doj) return "N/A";
    const joinDate = new Date(doj);
    const today = new Date();
    let years = today.getFullYear() - joinDate.getFullYear();
    let months = today.getMonth() - joinDate.getMonth();
    if (months < 0) { years--; months += 12; }
    return `${years}y ${months}m`;
  };

  const tabItems = [
    {
      key: 'personal',
      label: <Space><UserOutlined /><span>Personal</span></Space>,
      children: (
        <Card bordered={false}>
          <Descriptions column={{ xxl: 2, xl: 2, lg: 1, md: 1 }} bordered size="small">
            <Descriptions.Item label="Full Name">{employee?.name}</Descriptions.Item>
            <Descriptions.Item label="Gender">{employee?.gender || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Birth Date">{formatDate(employee?.dob)}</Descriptions.Item>
            <Descriptions.Item label="Marriage Date">{formatDate(employee?.marriageDate)}</Descriptions.Item>
            <Descriptions.Item label="Mobile No">{employee?.mobileNo}</Descriptions.Item>
            <Descriptions.Item label="Email ID">{employee?.emailId}</Descriptions.Item>
            <Descriptions.Item label="PAN No">{employee?.panNo || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Aadhar No">{employee?.aadharNo || "N/A"}</Descriptions.Item>
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
            <Descriptions.Item label="Employee Code"><Tag color="cyan">{employee?.employeeCode}</Tag></Descriptions.Item>
            <Descriptions.Item label="Designation">{employee?.designation || 'Operations Executive'}</Descriptions.Item>
            <Descriptions.Item label="OE Type"><Tag color={employee?.oeType === 'onfield' ? 'blue' : 'green'}>{(employee?.oeType || 'inhouse').toUpperCase()}</Tag></Descriptions.Item>
            <Descriptions.Item label="Date of Joining">{formatDate(employee?.dateOfJoining)}</Descriptions.Item>
            <Descriptions.Item label="Allotted Login">{employee?.allottedLoginId || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Office Email">{employee?.officeEmail || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Work Area">{employee?.workArea || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Base Salary">{employee?.salaryOnJoining || 'N/A'}</Descriptions.Item>
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
            <Card title="Present Address" size="small" style={{ borderRadius: 12 }}>
              <Text>{employee?.presentAddress || 'Not registered'}</Text>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Permanent Address" size="small" style={{ borderRadius: 12 }}>
              <Text>{employee?.permanentAddress || 'Not registered'}</Text>
            </Card>
          </Col>
        </Row>
      )
    },
    {
      key: 'bank',
      label: <Space><BankOutlined /><span>Bank</span></Space>,
      children: (
        <Card bordered={false}>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Bank Name">{employee?.bankName || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Account No">{employee?.accountNo || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="IFSC Code">{employee?.ifscCode || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="MICR Code">{employee?.micr || 'N/A'}</Descriptions.Item>
          </Descriptions>
        </Card>
      )
    },
    {
      key: 'employment',
      label: <Space><AuditOutlined /><span>Employment</span></Space>,
      children: (
        <Card bordered={false}>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Job Profile">{employee?.jobProfile?.path ? <Button size="small" type="link" icon={<FilePdfOutlined />} href={`${axios.defaults.baseURL}${employee.jobProfile.path}`} target="_blank">View PDF</Button> : 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Target">{employee?.target?.path ? <Button size="small" type="link" icon={<FilePdfOutlined />} href={`${axios.defaults.baseURL}${employee.target.path}`} target="_blank">View Target PDF</Button> : 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Office Kit">{employee?.officeKit || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Drawer Key">{employee?.drawerKeyName} ({employee?.drawerKeyNumber})</Descriptions.Item>
          </Descriptions>
        </Card>
      )
    },
    {
      key: 'emergency',
      label: <Space><SafetyOutlined /><span>Emergency</span></Space>,
      children: (
        <Card bordered={false}>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Emergency Contact">{employee?.emergencyContactPerson} ({employee?.emergencyContactMobile})</Descriptions.Item>
            <Descriptions.Item label="Family Liaison">{employee?.familyContactPerson} ({employee?.familyContactMobile})</Descriptions.Item>
          </Descriptions>
        </Card>
      )
    }
  ];

  if (loading) return (
    <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <Spin size="large" />
      <Text type="secondary" style={{ marginTop: 16 }}>Retrieving operational profile...</Text>
    </div>
  );

  if (error || !employee) return (
    <Alert message="Profile Access Error" description={error || "OE Profile data unavailable."} type="error" showIcon action={<Button onClick={fetchOEData}>Retry</Button>} />
  );

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#0891b2', borderRadius: 16 } }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <Row gutter={[24, 24]}>
          {/* Sidebar */}
          <Col xs={24} lg={7}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Card 
                style={{ borderRadius: 24, textAlign: 'center', background: 'linear-gradient(135deg, #0891b2, #06b6d4)', color: 'white' }}
                bordered={false}
              >
                <Avatar size={100} icon={<UserOutlined />} style={{ border: '4px solid rgba(255,255,255,0.2)', marginBottom: 16, backgroundColor: 'white', color: '#0891b2' }} />
                <Title level={3} style={{ color: 'white', margin: 0 }}>{employee.name}</Title>
                <Text style={{ color: 'rgba(255,255,255,0.8)' }}>{employee.designation || 'Operations Specialist'}</Text>
                <div style={{ marginTop: 16 }}><Tag color="white" style={{ color: '#0891b2' }}>{employee.employeeCode}</Tag></div>
                
                <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                
                <div style={{ textAlign: 'left' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Text style={{ color: 'white' }}><MailOutlined /> {employee.emailId}</Text>
                    <Text style={{ color: 'white' }}><PhoneOutlined /> {employee.mobileNo}</Text>
                    <Text style={{ color: 'white' }}><GlobalOutlined /> {employee.workArea || 'Operational Zone'}</Text>
                  </Space>
                </div>
              </Card>

              <Card style={{ marginTop: 24, borderRadius: 24 }}>
                <Statistic title="Service Duration" value={calculateExperience(employee.dateOfJoining)} prefix={<HistoryOutlined />} />
                <Divider />
                <Statistic title="OE Domain" value={(employee.oeType || 'Inhouse').toUpperCase()} prefix={<ThunderboltOutlined />} />
              </Card>
            </motion.div>
          </Col>

          {/* Main Content */}
          <Col xs={24} lg={17}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card style={{ borderRadius: 24 }} styles={{ body: { padding: '24px 32px' } }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                  <Title level={4} style={{ margin: 0 }}>Employee Profile</Title>
                  <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/oe/dashboard")}>Dashboard</Button>
                </div>
                <Tabs items={tabItems} type="card" />
              </Card>
            </motion.div>
          </Col>
        </Row>
      </div>
    </ConfigProvider>
  );
};

export default OEProfile;
