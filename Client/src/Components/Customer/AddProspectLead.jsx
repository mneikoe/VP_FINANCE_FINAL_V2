import React, { useState, useEffect } from "react";
import { 
  Form, 
  Input, 
  Select, 
  Button, 
  Row, 
  Col, 
  Card, 
  Typography, 
  Radio, 
  DatePicker, 
  Divider, 
  Space, 
  Alert,
  Spin
} from "antd";
import { 
  UserOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  HomeOutlined, 
  EnvironmentOutlined,
  BankOutlined,
  SolutionOutlined,
  SaveOutlined,
  CloseOutlined,
  WhatsAppOutlined,
  GlobalOutlined,
  BarcodeOutlined
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeadOccupationDetails } from "../../redux/feature/LeadOccupation/OccupationThunx";
import { fetchDetails } from "../../redux/feature/LeadSource/LeadThunx";
import { fetchCallingPurposes } from "../../redux/feature/CallingPurpose/CallingPurposeThunx";
import {
  createProspectLead,
  fetchProspectLeadById,
  updateProspectLead,
} from "../../redux/feature/ProspectLead/ProspectThunx";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const { Title, Text } = Typography;
const { Option } = Select;

const AddProspectLead = ({ editId, setActiveTab, setEditId }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { loading, error, currentLead } = useSelector((state) => state.prospectLead);
  const leadOccupations = useSelector((state) => state.leadOccupation.details);
  const leadSources = useSelector((state) => state.leadsource.leadsourceDetail);
  const { callingPurposes, loading: callingPurposeLoading } = useSelector((state) => state.callingPurpose);

  const [preferredAddressType, setPreferredAddressType] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        await dispatch(fetchLeadOccupationDetails()).unwrap();
        await dispatch(fetchDetails()).unwrap();
        await dispatch(fetchCallingPurposes()).unwrap();
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, [dispatch]);

  useEffect(() => {
    if (editId) {
      dispatch(fetchProspectLeadById(editId));
    } else {
      form.resetFields();
      setPreferredAddressType("");
    }
  }, [editId, dispatch, form]);

  useEffect(() => {
    if (editId && currentLead && currentLead._id === editId) {
      const personalData = currentLead.personalDetails || {};
      const formattedData = {
        ...personalData,
        status: currentLead.status || "prospect",
        dob: personalData.dob ? dayjs(personalData.dob) : null,
        dom: personalData.dom ? dayjs(personalData.dom) : null,
      };
      form.setFieldsValue(formattedData);
      setPreferredAddressType(personalData.preferredAddressType || "");
    }
  }, [editId, currentLead, form]);

  const onValuesChange = (changedValues, allValues) => {
    if (changedValues.annualIncome) {
      let grade = "";
      const income = changedValues.annualIncome;
      if (income === "25 lakh to 1 Cr.") grade = 1;
      else if (income === "5 to 25 lakh") grade = 2;
      else if (income === "2.5 to 5 lakh") grade = 3;
      form.setFieldsValue({ grade });
    }

    if (changedValues.preferredAddressType || changedValues.resiAddr || changedValues.officeAddr || changedValues.resiPincode || changedValues.officePincode) {
      const type = allValues.preferredAddressType;
      setPreferredAddressType(type);
      
      if (type === "resi") {
        form.setFieldsValue({
          preferredMeetingAddr: allValues.resiAddr,
          preferredMeetingArea: allValues.resiPincode ? `Area for ${allValues.resiPincode}` : "",
        });
      } else if (type === "office") {
        form.setFieldsValue({
          preferredMeetingAddr: allValues.officeAddr,
          preferredMeetingArea: allValues.officePincode ? `Area for ${allValues.officePincode}` : "",
        });
      }
    }
  };

  const onFinish = async (values) => {
    const personalDetails = { ...values };
    personalDetails.dob = values.dob ? values.dob.toISOString() : null;
    personalDetails.dom = values.dom ? values.dom.toISOString() : null;

    if (values.preferredAddressType === "resi") {
      personalDetails.officeAddr = "";
      personalDetails.officeLandmark = "";
      personalDetails.officePincode = "";
    } else if (values.preferredAddressType === "office") {
      personalDetails.resiAddr = "";
      personalDetails.resiLandmark = "";
      personalDetails.resiPincode = "";
    }

    const payload = {
      status: editId ? values.status : "prospect",
      personalDetails,
    };

    try {
      let resultAction;
      if (editId) {
        resultAction = await dispatch(updateProspectLead({ id: editId, leadData: payload }));
      } else {
        resultAction = await dispatch(createProspectLead(payload));
      }

      if (resultAction.payload) {
        toast.success(`Prospect successfully ${editId ? "updated" : "added"}!`);
        form.resetFields();
        setEditId(null);
        setActiveTab("display");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error("Failed to save prospect details");
    }
  };

  if (editId && loading) {
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>
        <Spin size="large" tip="Loading prospect data..." />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", backgroundColor: "#f0f2f5" }}>
      <Card variant="borderless" className="shadow-sm border-radius-8" style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItem: "center" }}>
          <div>
            <Title level={3} style={{ margin: 0 }}>{editId ? "Edit Prospect Lead" : "Add Prospect Lead"}</Title>
            <Text type="secondary">Manage qualified leads and detailed prospect information</Text>
          </div>
          {editId && (
            <Button icon={<CloseOutlined />} onClick={() => { setActiveTab("display"); setEditId(null); }}>
              Cancel
            </Button>
          )}
        </div>
      </Card>

      {error && <Alert message="Error" description={error} type="error" showIcon style={{ marginBottom: "24px" }} />}

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={onValuesChange}
        initialValues={{ name: "LIC", status: "prospect" }}
        requiredMark="optional"
      >
        <Row gutter={24}>
          {/* Section 1: Identity & Basic Info */}
          <Col xs={24} lg={24}>
            <Card 
              title={<Space><UserOutlined style={{ color: "#1890ff" }} />Identity & Basic Details</Space>} 
              variant="borderless" 
              className="shadow-sm border-radius-8 mb-4"
              size="small"
            >
              <Row gutter={16}>
                <Col xs={24} md={6}>
                  <Form.Item name="groupCode" label="Group Code" rules={[{ required: true, message: "Group code is required" }]}>
                    <Input prefix={<BarcodeOutlined className="text-muted" />} placeholder="Enter group code" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={4}>
                  <Form.Item name="salutation" label="Salutation">
                    <Select placeholder="Select">
                      {["Mr.", "Mrs.", "Ms.", "Mast.", "Shri.", "Smt.", "Kum.", "Kr.", "Dr."].map(s => (
                        <Option key={s} value={s}>{s}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={7}>
                  <Form.Item name="familyHead" label="Family Head" rules={[{ required: true, message: "Family head is required" }]}>
                    <Input placeholder="Enter family head name" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={7}>
                  <Form.Item name="gender" label="Gender">
                    <Radio.Group>
                      <Radio value="Male">Male</Radio>
                      <Radio value="Female">Female</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item name="dob" label="Date of Birth">
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="dom" label="Date of Marriage">
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Section 2: Professional Details */}
          <Col xs={24} lg={24}>
            <Card 
              title={<Space><BankOutlined style={{ color: "#722ed1" }} />Professional Details</Space>} 
              variant="borderless" 
              className="shadow-sm border-radius-8 mb-4"
              size="small"
            >
              <Row gutter={16}>
                <Col xs={24} md={6}>
                  <Form.Item name="organisation" label="Organisation">
                    <Input placeholder="Company name" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item name="designation" label="Designation">
                    <Input placeholder="Role/Position" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="annualIncome" label="Annual Income Range">
                    <Select placeholder="Choose income range">
                      {["25 lakh to 1 Cr.", "5 to 25 lakh", "2.5 to 5 lakh"].map(i => (
                        <Option key={i} value={i}>{i}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={4}>
                  <Form.Item name="grade" label="Grade">
                    <Input readOnly style={{ backgroundColor: "#f5f5f5", fontWeight: "bold", textAlign: "center" }} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Section 3: Contact Information */}
          <Col xs={24} lg={24}>
            <Card 
              title={<Space><PhoneOutlined style={{ color: "#52c41a" }} />Contact Information</Space>} 
              variant="borderless" 
              className="shadow-sm border-radius-8 mb-4"
              size="small"
            >
              <Row gutter={16}>
                <Col xs={24} md={6}>
                  <Form.Item 
                    name="mobile" 
                    label="Mobile Number" 
                    rules={[{ required: true, message: "Required" }, { pattern: /^\d{10}$/, message: "Valid 10 digits" }]}
                  >
                    <Input prefix={<PhoneOutlined className="text-muted" />} maxLength={10} placeholder="Primary mobile" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item name="contactNo" label="Contact No.">
                    <Input prefix={<PhoneOutlined className="text-muted" />} placeholder="Alternative contact" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item name="whatsapp" label="WhatsApp Number">
                    <Input prefix={<WhatsAppOutlined style={{ color: "#25D366" }} />} maxLength={10} placeholder="WhatsApp contact" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item 
                    name="email" 
                    label="Email Address"
                    rules={[{ type: "email", message: "Invalid email" }]}
                  >
                    <Input prefix={<MailOutlined className="text-muted" />} placeholder="example@domain.com" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Section 4: Address Details */}
          <Col xs={24} lg={24}>
            <Card 
              title={<Space><HomeOutlined style={{ color: "#faad14" }} />Address Details</Space>} 
              variant="borderless" 
              className="shadow-sm border-radius-8 mb-4"
              size="small"
            >
              <Form.Item name="preferredAddressType" label={<Text strong>Preferred Communication Address</Text>} className="mb-4">
                <Radio.Group className="mb-4">
                  <Radio value="resi">Residential Address</Radio>
                  <Radio value="office">Office Address</Radio>
                </Radio.Group>
              </Form.Item>

              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Card size="small" type="inner" title="Residential Address" style={{ opacity: preferredAddressType === "office" ? 0.6 : 1 }}>
                    <Form.Item name="resiAddr" label="Street Address">
                      <Input.TextArea rows={2} placeholder="Building, Street, Area" />
                    </Form.Item>
                    <Row gutter={8}>
                      <Col span={14}>
                        <Form.Item name="resiLandmark" label="Landmark">
                          <Input placeholder="Near..." />
                        </Form.Item>
                      </Col>
                      <Col span={10}>
                        <Form.Item 
                          name="resiPincode" 
                          label="Pincode"
                          rules={[{ pattern: /^\d{6}$/, message: "6 digits" }]}
                        >
                          <Input maxLength={6} placeholder="6-digit" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card size="small" type="inner" title="Office Address" style={{ opacity: preferredAddressType === "resi" ? 0.6 : 1 }}>
                    <Form.Item name="officeAddr" label="Workplace Address">
                      <Input.TextArea rows={2} placeholder="Office/Shop No, Complex" />
                    </Form.Item>
                    <Row gutter={8}>
                      <Col span={14}>
                        <Form.Item name="officeLandmark" label="Landmark">
                          <Input placeholder="Nearby location" />
                        </Form.Item>
                      </Col>
                      <Col span={10}>
                        <Form.Item 
                          name="officePincode" 
                          label="Pincode"
                          rules={[{ pattern: /^\d{6}$/, message: "6 digits" }]}
                        >
                          <Input maxLength={6} placeholder="6-digit" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>

              <Divider style={{ margin: "24px 0" }} />
              
              <Row gutter={16}>
                <Col xs={24} md={10}>
                  <Form.Item name="preferredMeetingAddr" label={<Text strong style={{ color: "#1890ff" }}>Selected Meeting Address</Text>}>
                    <Input prefix={<EnvironmentOutlined className="text-muted" />} placeholder="Auto-populated from selection" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={7}>
                  <Form.Item name="preferredMeetingArea" label="Area">
                    <Input prefix={<GlobalOutlined className="text-muted" />} placeholder="Meeting area" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={7}>
                  <Form.Item name="city" label="City">
                    <Input placeholder="Enter city" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Section 5: Lead & Internal Details */}
          <Col xs={24} lg={24}>
            <Card 
              title={<Space><SolutionOutlined style={{ color: "#eb2f96" }} />Lead & Management Details</Space>} 
              variant="borderless" 
              className="shadow-sm border-radius-8 mb-4"
              size="small"
            >
              <Row gutter={16}>
                <Col xs={24} md={6}>
                  <Form.Item name="leadSource" label="Lead Source">
                    <Select placeholder="Select source">
                      {leadSources.map(s => <Option key={s._id} value={s.leadName}>{s.leadName}</Option>)}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item name="leadName" label="Lead Reference Name">
                    <Input placeholder="Referrer / Campaign" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item name="leadOccupation" label="Lead Occupation">
                    <Select placeholder="Select Occupation">
                      {leadOccupations.map(occ => <Option key={occ._id} value={occ.leadName}>{occ.leadName}</Option>)}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item name="occupationType" label="Occupation Type">
                    <Input placeholder="Occupation Category" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item name="callingPurpose" label="Calling Purpose">
                    <Select placeholder="Purpose" loading={callingPurposeLoading}>
                      {callingPurposes?.map(p => <Option key={p._id} value={p.purposeName}>{p.purposeName}</Option>)}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="name" label="Product Type">
                    <Select>
                      <Option value="LIC">LIC</Option>
                      <Option value="Portfolio Management">Portfolio Management</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="status" label="Current Status">
                    <Select disabled={!editId}>
                      <Option value="prospect">Prospect</Option>
                      <Option value="suspect">Suspect</Option>
                      <Option value="client">Client</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Card variant="borderless" className="shadow-sm border-radius-8">
          <Row justify="end">
            <Space size="large">
              {editId && (
                <Button size="large" onClick={() => { setActiveTab("display"); setEditId(null); }} icon={<CloseOutlined />}>
                  Cancel Changes
                </Button>
              )}
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large" 
                loading={loading} 
                icon={<SaveOutlined />}
                style={{ minWidth: "180px" }}
              >
                {editId ? "Update Prospect" : "Save Prospect Lead"}
              </Button>
            </Space>
          </Row>
        </Card>
      </Form>

      <style>{`
        .border-radius-8 { border-radius: 8px; overflow: hidden; }
        .shadow-sm {
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
        }
        .text-muted { color: #bfbfbf; }
        .mb-4 { margin-bottom: 16px; }
        .ant-form-item-label > label { font-weight: 600; color: #434343; }
        .ant-card-head-title { font-weight: 700; color: #1f1f1f; }
      `}</style>
    </div>
  );
};

export default AddProspectLead;

