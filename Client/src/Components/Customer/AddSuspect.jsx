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
  SafetyCertificateOutlined
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  createSuspectLead,
  fetchSuspectLeadById,
  updateSuspectLead,
} from "../../redux/feature/SuspectLead/SuspectLeadThunx";
import { fetchLeadOccupationDetails, getAllOccupations } from "../../redux/feature/LeadOccupation/OccupationThunx";
import { getAllOccupationTypes } from "../../redux/feature/OccupationType/OccupationThunx";
import { fetchDetails } from "../../redux/feature/LeadSource/LeadThunx";
import { fetchCallingPurposes } from "../../redux/feature/CallingPurpose/CallingPurposeThunx";
import axiosInstance from "../../config/axiosConfig";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const { Title, Text } = Typography;
const { Option } = Select;

const AddSuspect = ({ editId, setActiveTab, setEditId }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { loading, error, currentLead } = useSelector((state) => state.suspectLead);
  const { alldetails: allOccupations } = useSelector((state) => state.leadOccupation);
  const { alldetailsForTypes } = useSelector((state) => state.OccupationType);
  const leadSources = useSelector((state) => state.leadsource.leadsourceDetail);
  const { callingPurposes, loading: callingPurposeLoading } = useSelector((state) => state.callingPurpose);

  const [rms, setRms] = useState([]);
  const [filteredRms, setFilteredRms] = useState(null);
  const [preferredAddressType, setPreferredAddressType] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        await dispatch(fetchLeadOccupationDetails()).unwrap();
        await dispatch(fetchDetails()).unwrap();
        await dispatch(fetchCallingPurposes()).unwrap();
        dispatch(getAllOccupationTypes());
        dispatch(getAllOccupations());
        fetchRMs();
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, [dispatch]);

  const fetchRMs = async () => {
    try {
      const response = await axiosInstance.get("/api/employee/getAllEmployees");
      let allEmployees = [];
      if (response.data && response.data.success) allEmployees = response.data.data;
      else if (Array.isArray(response.data)) allEmployees = response.data;

      const rmEmployees = allEmployees.filter((emp) => {
        const isActive = !emp.dateOfTermination && (emp.status === "active" || emp.status === "Active" || !emp.status);
        const empRole = (emp.role || emp.designation || "").toLowerCase();
        return isActive && (empRole.includes("rm") || empRole.includes("relationship") || empRole.includes("manager"));
      });
      setRms(rmEmployees);
    } catch (error) {
      console.error("Error fetching RMs:", error);
    }
  };

  useEffect(() => {
    if (editId) {
      dispatch(fetchSuspectLeadById(editId));
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

    // RM Filtering logic
    const pin = allValues.preferredAddressType === "office" ? allValues.officePincode : allValues.resiPincode;
    if (pin && pin.length === 6) {
      const matched = rms.filter((rm) => {
        const directMatch = String(rm.workPincode || "").trim() === String(pin).trim();
        const managedMatch = Array.isArray(rm.managedAreas) &&
          rm.managedAreas.some((a) => String(a.pincode || "").trim() === String(pin).trim());
        return directMatch || managedMatch;
      });
      setFilteredRms(matched.length > 0 ? matched : null);
    } else {
      setFilteredRms(null);
    }
  };

  const onFinish = async (values) => {
    const cleanedValues = { ...values };
    cleanedValues.dob = values.dob ? values.dob.toISOString() : null;
    cleanedValues.dom = values.dom ? values.dom.toISOString() : null;

    if (values.preferredAddressType === "resi") {
      cleanedValues.officeAddr = "";
      cleanedValues.officeLandmark = "";
      cleanedValues.officePincode = "";
    } else if (values.preferredAddressType === "office") {
      cleanedValues.resiAddr = "";
      cleanedValues.resiLandmark = "";
      cleanedValues.resiPincode = "";
    }

    const leadDataToSave = {
      personalDetails: cleanedValues,
    };

    try {
      let resultAction;
      if (editId) {
        resultAction = await dispatch(updateSuspectLead({ id: editId, leadData: leadDataToSave }));
      } else {
        resultAction = await dispatch(createSuspectLead(leadDataToSave));
      }

      if (resultAction.payload) {
        toast.success(`Lead successfully ${editId ? "updated" : "added"}!`);
        form.resetFields();
        setEditId(null);
        setActiveTab("display");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error("Failed to save lead details");
    }
  };

  if (editId && loading) {
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>
        <Spin size="large" tip="Loading lead data..." />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", backgroundColor: "#f0f2f5" }}>
      <Card bordered={false} className="shadow-sm border-radius-8" style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItem: "center" }}>
          <div>
            <Title level={3} style={{ margin: 0 }}>{editId ? "Edit Suspect Lead" : "Add Suspect Lead"}</Title>
            <Text type="secondary">Enter personal and professional details for the potential client</Text>
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
        initialValues={{ name: "LIC" }}
        requiredMark="optional"
      >
        <Row gutter={24}>
          {/* Section 1: Basic Information */}
          <Col xs={24} lg={24}>
            <Card 
              title={<Space><UserOutlined style={{ color: "#1890ff" }} />Basic Information</Space>} 
              bordered={false} 
              className="shadow-sm border-radius-8 mb-4"
              size="small"
            >
              <Row gutter={16}>
                <Col xs={24} md={4}>
                  <Form.Item name="salutation" label="Salutation">
                    <Select placeholder="Select">
                      {["Mr.", "Mrs.", "Ms.", "Mast.", "Shri.", "Smt.", "Kum.", "Kr.", "Dr."].map(s => (
                        <Option key={s} value={s}>{s}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={10}>
                  <Form.Item name="name" label="Full Name" rules={[{ required: true, message: "Name is required" }]}>
                    <Input prefix={<UserOutlined className="text-muted" />} placeholder="Enter lead name" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={10}>
                  <Form.Item name="familyHead" label="Family Head">
                    <Input placeholder="Enter family head name" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item name="gender" label="Gender">
                    <Radio.Group>
                      <Radio value="Male">Male</Radio>
                      <Radio value="Female">Female</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col xs={24} md={9}>
                  <Form.Item name="dob" label="Date of Birth">
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={9}>
                  <Form.Item name="dom" label="Date of Marriage">
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Section 2: Professional & Income Details */}
          <Col xs={24} lg={24}>
            <Card 
              title={<Space><BankOutlined style={{ color: "#722ed1" }} />Professional Details</Space>} 
              bordered={false} 
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

          {/* Section 3: Contact Details */}
          <Col xs={24} lg={24}>
            <Card 
              title={<Space><PhoneOutlined style={{ color: "#52c41a" }} />Contact Information</Space>} 
              bordered={false} 
              className="shadow-sm border-radius-8 mb-4"
              size="small"
            >
              <Row gutter={16}>
                <Col xs={24} md={6}>
                  <Form.Item 
                    name="mobile" 
                    label="Mobile Number" 
                    rules={[{ pattern: /^\d{10}$/, message: "Please enter a valid 10-digit number" }]}
                  >
                    <Input prefix={<PhoneOutlined className="text-muted" />} maxLength={10} placeholder="Primary mobile" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item name="contactNo" label="Contact No. (Landline/Alt)">
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
                    rules={[{ type: "email", message: "Please enter a valid email" }]}
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
              bordered={false} 
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
                          rules={[{ pattern: /^\d{6}$/, message: "Must be 6 digits" }]}
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
                          rules={[{ pattern: /^\d{6}$/, message: "Must be 6 digits" }]}
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

          {/* Section 5: Lead & Internal Assignment */}
          <Col xs={24} lg={24}>
            <Card 
              title={<Space><SolutionOutlined style={{ color: "#eb2f96" }} />Lead & Internal Details</Space>} 
              bordered={false} 
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
                    <Input placeholder="Referrer / Campaign name" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item name="occupationType" label="Occupation Type">
                    <Select 
                      placeholder="Category" 
                      onChange={() => form.setFieldsValue({ leadOccupation: "" })}
                    >
                      {Array.isArray(alldetailsForTypes) && alldetailsForTypes.map(t => (
                        <Option key={t._id} value={t.occupationType}>{t.occupationType}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item 
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => prevValues.occupationType !== currentValues.occupationType}
                  >
                    {({ getFieldValue }) => (
                      <Form.Item name="leadOccupation" label="Occupation Name">
                        <Select 
                          placeholder="Specific occupation" 
                          disabled={!getFieldValue("occupationType")}
                        >
                          {Array.isArray(allOccupations) && allOccupations
                            .filter(occ => occ?.occupationType?.occupationType === getFieldValue("occupationType"))
                            .map(occ => <Option key={occ._id} value={occ.occupationName}>{occ.occupationName}</Option>)
                          }
                        </Select>
                      </Form.Item>
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item name="callingPurpose" label="Calling Purpose">
                    <Select placeholder="Purpose of contact" loading={callingPurposeLoading}>
                      {callingPurposes?.map(p => <Option key={p._id} value={p.purposeName}>{p.purposeName}</Option>)}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="name" label="Product Type">
                    <Select>
                      <Option value="LIC">LIC</Option>
                      <Option value="Portfolio Management">Portfolio Management</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Divider style={{ margin: "16px 0" }} />

              <Row gutter={16}>
                <Col xs={24}>
                  <Form.Item 
                    name="allocatedRM" 
                    label={<Space><SafetyCertificateOutlined style={{ color: "#1890ff" }} /><Text strong>Allocated Relationship Manager (RM)</Text></Space>}
                    extra={filteredRms ? `System found ${filteredRms.length} suggested RMs for this pincode` : "No direct matches found for this pincode. Listing all active RMs."}
                  >
                    <Select 
                      placeholder="Select Relationship Manager" 
                      size="large"
                      showSearch
                      optionFilterProp="children"
                    >
                      {(filteredRms || rms).map(rm => (
                        <Option key={rm._id} value={rm._id}>
                          <Space>
                            <Text strong>{rm.name}</Text>
                            <Text type="secondary">({rm.employeeCode || rm.designation})</Text>
                            {filteredRms && <Text type="success" style={{ fontSize: "12px" }}>(Suggested)</Text>}
                          </Space>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Card bordered={false} className="shadow-sm border-radius-8">
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
                {editId ? "Update Lead" : "Save Suspect Lead"}
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
        .ant-radio-wrapper { font-weight: 500; }
      `}</style>
    </div>
  );
};

export default AddSuspect;

