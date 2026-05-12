import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../config/axios";
import {
  Layout,
  Row,
  Col,
  Button,
  Card,
  Tabs,
  Badge,
  Modal,
  Space,
  Typography,
  Descriptions,
  Avatar,
  Divider,
  Tag,
  Statistic,
  Empty,
  Spin,
  Alert,
  Tooltip,
  Form as AntForm,
  Input as AntInput,
  ConfigProvider
} from "antd";
import {
  ArrowLeftOutlined,
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  TeamOutlined,
  DollarCircleOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ShopOutlined,
  PlusOutlined,
  ThunderboltOutlined,
  IdcardOutlined,
  MessageOutlined
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

// Import form components from SuspectDetail
import PersonalDetailsFormForSuspect from "../../Customer/Suspect/PersonalDetailFormSuspect";
import FamilyMembersFormForSuspect from "../../Customer/Suspect/FamilyMembersFormSuspect";
import FinancialInformationFormForSuspect from "../../Customer/Suspect/FinancialInformationFormSuspect";
import FuturePrioritiesFormForSuspect from "../../Customer/Suspect/FuturePrioritiesFromSuspect";
import ProposedPlanFormForSuspect from "../../Customer/Suspect/ProposedPanFormSuspect";

const { Title, Text } = Typography;
const { Content } = Layout;

const RMSuspectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Main states
  const [suspect, setSuspect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editModalType, setEditModalType] = useState("");
  const [editFormData, setEditFormData] = useState(null);
  const [savingModal, setSavingModal] = useState(false);

  // Call History states
  const [apptDate, setApptDate] = useState("");
  const [apptTime, setApptTime] = useState("");
  const [apptRemark, setApptRemark] = useState("");
  const [savingAppt, setSavingAppt] = useState(false);

  // Helpers
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "N/A";
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(amount);
  };

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const hasData = (type) => {
    if (!suspect) return false;
    switch (type) {
      case "personal": return !!suspect.personalDetails && Object.keys(suspect.personalDetails).length > 0;
      case "family": return suspect.familyMembers && suspect.familyMembers.length > 0;
      case "financial": 
        const fin = suspect.financialInfo || {};
        return (fin.insurance?.length > 0 || fin.investments?.length > 0 || fin.loans?.length > 0);
      case "futurePriorities": return suspect.futurePriorities && suspect.futurePriorities.length > 0;
      case "proposedPlan": return suspect.proposedPlan && suspect.proposedPlan.length > 0;
      default: return false;
    }
  };

  const fetchSuspectDetails = async () => {
    if (!id || id === "undefined") return;
    try {
      setLoading(true);
      const response = await axios.get(`/api/suspect/${id}`);
      if (response.data?.success) setSuspect(response.data.suspect);
      else setError("Failed to fetch suspect details");
    } catch (err) {
      setError(err.response?.data?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && id !== "undefined") fetchSuspectDetails();
    else { setError("Invalid suspect ID"); setLoading(false); }
  }, [id]);

  const handleAddAppointment = async () => {
    if (!apptDate) { toast.warning("Please select a date."); return; }
    setSavingAppt(true);
    try {
      const response = await axios.post(`/api/suspect/${id}/call-history`, {
        callDate: apptDate, callTime: apptTime, remarks: apptRemark,
      });
      if (response.data?.success) {
        toast.success("Engagement recorded.");
        setApptDate(""); setApptTime(""); setApptRemark("");
        fetchSuspectDetails();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to record.");
    } finally {
      setSavingAppt(false);
    }
  };

  const handleOpenEditModal = (type) => {
    setEditModalType(type);
    if (suspect) {
      switch (type) {
        case "personal": setEditFormData(suspect.personalDetails || {}); break;
        case "family": setEditFormData(suspect.familyMembers || []); break;
        case "financial": setEditFormData(suspect.financialInfo || { insurance: [], investments: [], loans: [] }); break;
        case "futurePriorities": setEditFormData({ futurePriorities: suspect.futurePriorities || [], needs: suspect.needs || {} }); break;
        case "proposedPlan": setEditFormData(suspect.proposedPlan || []); break;
      }
    }
    setShowEditModal(true);
  };

  const handleFormDataUpdate = (data) => setEditFormData(data);

  const handleSaveModalData = async () => {
    setSavingModal(true);
    try {
      let result;
      const existing = hasData(editModalType);
      if (editModalType === "personal") {
        result = await axios.put(`/api/suspect/update/personaldetails/${id}`, { personalDetails: editFormData });
      } else if (existing) {
        switch (editModalType) {
          case "family": result = await axios.put(`/api/suspect/${id}/family`, { familyMembers: editFormData }); break;
          case "financial": result = await axios.put(`/api/suspect/${id}/financial`, editFormData); break;
          case "futurePriorities": result = await axios.put(`/api/suspect/${id}/priorities`, { futurePriorities: editFormData.futurePriorities, needs: editFormData.needs }); break;
          case "proposedPlan": result = await axios.put(`/api/suspect/${id}/proposed-plan`, { proposedPlan: editFormData }); break;
        }
      } else {
        switch (editModalType) {
          case "family": result = await axios.post(`/api/suspect/${id}/family/create`, { membersArray: editFormData }); break;
          case "financial": 
            const fd = new FormData(); fd.append("financialData", JSON.stringify(editFormData));
            result = await axios.post(`/api/suspect/${id}/financial/create`, fd); break;
          case "futurePriorities": result = await axios.post(`/api/suspect/${id}/priorities/create`, { futurePriorities: editFormData.futurePriorities, needs: editFormData.needs }); break;
          case "proposedPlan": 
            const pfd = new FormData(); pfd.append("formData", JSON.stringify(editFormData));
            result = await axios.post(`/api/suspect/${id}/proposed-plan/create`, pfd); break;
        }
      }

      if (result?.data?.success) {
        toast.success(`${editModalType} synced successfully!`);
        setShowEditModal(false);
        fetchSuspectDetails();
      }
    } catch (err) {
      toast.error("Operation failed. Verify data format.");
    } finally {
      setSavingModal(false);
    }
  };

  if (loading) return (
    <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <Spin size="large" />
      <Text type="secondary" style={{ marginTop: 16 }}>Synthesizing profile data...</Text>
    </div>
  );

  if (error || !suspect) return (
    <Content style={{ padding: '24px' }}>
      <Alert message="Profile Unavailable" description={error || "Suspect profile not found."} type="error" showIcon action={<Button onClick={() => navigate("/rm/dashboard")}>Dashboard</Button>} />
    </Content>
  );

  const tabItems = [
    {
      key: 'personal',
      label: <Space><UserOutlined /><span>Personal Details</span></Space>,
      children: (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card 
            title={<Title level={5} style={{ margin: 0 }}>Personal Details</Title>}
            extra={<Button type="primary" ghost icon={<EditOutlined />} onClick={() => handleOpenEditModal("personal")}>Update</Button>}
            style={{ borderRadius: '16px' }}
          >
            {suspect.personalDetails ? (
              <Descriptions column={{ xxl: 3, xl: 2, lg: 2, md: 1 }} bordered={false}>
                <Descriptions.Item label="Identity">{suspect.personalDetails.name || suspect.personalDetails.groupName}</Descriptions.Item>
                <Descriptions.Item label="Contact">{suspect.personalDetails.mobileNo}</Descriptions.Item>
                <Descriptions.Item label="Digital">{suspect.personalDetails.emailId}</Descriptions.Item>
                <Descriptions.Item label="Birthday">
                  <Space>{formatDate(suspect.personalDetails.dob)} <Tag color="blue">{calculateAge(suspect.personalDetails.dob)} Yrs</Tag></Space>
                </Descriptions.Item>
                <Descriptions.Item label="Enterprise">{suspect.personalDetails.organisation}</Descriptions.Item>
                <Descriptions.Item label="Income Capacity"><Text strong color="#16a34a">{formatCurrency(suspect.personalDetails.annualIncome)}</Text></Descriptions.Item>
                <Descriptions.Item label="Location"><Space><EnvironmentOutlined />{suspect.personalDetails.city}</Space></Descriptions.Item>
              </Descriptions>
            ) : <Empty />}
          </Card>
        </motion.div>
      )
    },
    {
      key: 'family',
      label: <Space><TeamOutlined /><span>Family Members</span></Space>,
      children: (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card 
            title={<Title level={5} style={{ margin: 0 }}>Family Members</Title>}
            extra={<Button type="primary" ghost icon={<PlusOutlined />} onClick={() => handleOpenEditModal("family")}>Manage</Button>}
            style={{ borderRadius: '16px' }}
          >
            <Row gutter={[16, 16]}>
              {suspect.familyMembers?.filter(m => m.relation?.toLowerCase() !== 'self').map((member, idx) => (
                <Col xs={24} md={12} lg={8} key={idx}>
                  <Card size="small" style={{ borderRadius: '12px', background: '#f8fafc' }}>
                    <Space align="start">
                      <Avatar style={{ backgroundColor: '#4f46e5' }}>{member.name?.charAt(0)}</Avatar>
                      <div>
                        <Text strong>{member.name}</Text>
                        <div><Tag color="cyan">{member.relation}</Tag></div>
                        <Text type="secondary">Income: </Text><Text strong color="#16a34a">{formatCurrency(member.annualIncome)}</Text>
                      </div>
                    </Space>
                  </Card>
                </Col>
              )) || <Col span={24}><Empty /></Col>}
            </Row>
          </Card>
        </motion.div>
      )
    },
    {
      key: 'financial',
      label: <Space><DollarCircleOutlined /><span>Financial Information</span></Space>,
      children: (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card 
            title={<Title level={5} style={{ margin: 0 }}>Financial Information</Title>}
            extra={<Button type="primary" ghost icon={<EditOutlined />} onClick={() => handleOpenEditModal("financial")}>Refine</Button>}
            style={{ borderRadius: '16px' }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}><Card style={{ background: '#4f46e5', color: 'white' }}><Statistic title={<span style={{ color: 'white' }}>Insurance</span>} value={suspect.financialInfo?.insurance?.length || 0} valueStyle={{ color: 'white' }} /></Card></Col>
              <Col xs={24} md={8}><Card style={{ background: '#10b981', color: 'white' }}><Statistic title={<span style={{ color: 'white' }}>Investments</span>} value={suspect.financialInfo?.investments?.length || 0} valueStyle={{ color: 'white' }} /></Card></Col>
              <Col xs={24} md={8}><Card style={{ background: '#f43f5e', color: 'white' }}><Statistic title={<span style={{ color: 'white' }}>Liabilities</span>} value={suspect.financialInfo?.loans?.length || 0} valueStyle={{ color: 'white' }} /></Card></Col>
            </Row>
          </Card>
        </motion.div>
      )
    }
  ];

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#4f46e5' } }}>
      <Content style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* HEADER */}
        <Card style={{ borderRadius: '24px', marginBottom: 24 }} bordered={false}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space size={16}>
                <Avatar size={64} icon={<UserOutlined />} style={{ background: 'linear-gradient(135deg, #4f46e5, #8b5cf6)' }} />
                <div>
                  <Title level={3} style={{ margin: 0 }}>{suspect.personalDetails?.groupName || "Profile"}</Title>
                  <Space><Tag color="blue">{suspect.personalDetails?.groupCode}</Tag><Tag color="orange">{suspect.status?.toUpperCase()}</Tag></Space>
                </div>
              </Space>
            </Col>
            <Col><Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/rm/assigned-suspects")}>Back</Button></Col>
          </Row>
        </Card>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Tabs items={tabItems} type="card" />
            <Card title="Appointment Status" style={{ marginTop: 24, borderRadius: 16 }}>
              {suspect.callHistory?.length > 0 ? suspect.callHistory.map((call, idx) => (
                <div key={idx} style={{ padding: 12, borderLeft: '4px solid #4f46e5', background: '#f8fafc', marginBottom: 12, borderRadius: 4 }}>
                  <Text strong>{formatDate(call.callDate)}</Text> - <Text italic>{call.remarks}</Text>
                </div>
              )) : <Empty />}
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="Scheduling" style={{ borderRadius: 16 }}>
              <AntForm layout="vertical">
                <AntForm.Item label="Date"><AntInput type="date" value={apptDate} onChange={e => setApptDate(e.target.value)} /></AntForm.Item>
                <AntForm.Item label="Time"><AntInput type="time" value={apptTime} onChange={e => setApptTime(e.target.value)} /></AntForm.Item>
                <AntForm.Item label="Notes"><AntInput.TextArea rows={3} value={apptRemark} onChange={e => setApptRemark(e.target.value)} /></AntForm.Item>
                <Button type="primary" block size="large" loading={savingAppt} onClick={handleAddAppointment}>Add Appointment</Button>
              </AntForm>
            </Card>
          </Col>
        </Row>

        <Modal title={`Modify ${editModalType}`} open={showEditModal} onCancel={() => setShowEditModal(false)} onOk={handleSaveModalData} confirmLoading={savingModal} width={1000} style={{ top: 20 }}>
          <div className="bootstrap-wrapper">
            {editModalType === "personal" && <PersonalDetailsFormForSuspect isEdit={true} suspectData={suspect} onFormDataUpdate={handleFormDataUpdate} />}
            {editModalType === "family" && <FamilyMembersFormForSuspect isEdit={true} initialData={editFormData} onDataUpdate={handleFormDataUpdate} />}
            {editModalType === "financial" && <FinancialInformationFormForSuspect isEdit={true} initialData={editFormData} onDataUpdate={handleFormDataUpdate} />}
            {editModalType === "futurePriorities" && <FuturePrioritiesFormForSuspect isEdit={true} initialData={editFormData} onDataUpdate={handleFormDataUpdate} />}
            {editModalType === "proposedPlan" && <ProposedPlanFormForSuspect isEdit={true} initialData={editFormData} onDataUpdate={handleFormDataUpdate} />}
          </div>
        </Modal>
      </Content>
    </ConfigProvider>
  );
};

export default RMSuspectDetailsPage;
