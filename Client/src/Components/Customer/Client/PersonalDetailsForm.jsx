import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Form, 
  Row, 
  Col, 
  Button, 
  Input, 
  Select, 
  Card, 
  Typography, 
  Divider, 
  Space, 
  Radio, 
  TimePicker, 
  Tooltip,
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
  TeamOutlined,
  ScheduleOutlined,
  WhatsAppOutlined,
  GlobalOutlined,
  LinkOutlined,
  MessageOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import {
  createClient,
  updateClientPersonalDetails,
} from "../../../redux/feature/ClientRedux/ClientThunx";
import { fetchDetails } from "../../../redux/feature/LeadSource/LeadThunx";
import { getAllOccupations } from "../../../redux/feature/LeadOccupation/OccupationThunx";
import { getAllOccupationTypes } from "../../../redux/feature/OccupationType/OccupationThunx";
import { toast } from "react-toastify";
import axiosInstance from "../../../config/axios";
import { fetchLeadType } from "../../../redux/feature/LeadType/LeadTypeThunx";
import { fetchCallingPurposes } from "../../../redux/feature/CallingPurpose/CallingPurposeThunx";
import {
  splitGroupHeadName,
  joinGroupHeadName,
  sanitizePersonalDetailsGroupHead,
  GROUP_HEAD_NAME_PART_FIELDS,
} from "../../../utils/groupNameParts";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const incomeOptions = [
  { value: "25 lakh to 1 Cr.", label: "25 lakh to 1 Cr." },
  { value: "5 to 25 lakh", label: "5 to 25 lakh" },
  { value: "2.5 to 5 lakh", label: "2.5 to 5 lakh" },
];

const gradeMap = {
  "25 lakh to 1 Cr.": 1,
  "5 to 25 lakh": 2,
  "2.5 to 5 lakh": 3,
};

const PersonalDetailsForm = ({
  isEdit,
  clientData,
  onClientCreated,
  setFamilyDetail,
  onFormDataUpdate,
  changeTab,
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [whatsappEdited, setWhatsappEdited] = useState(false);
  const [rms, setRms] = useState([]);
  const [cres, setCres] = useState([]);
  const [filteredRms, setFilteredRms] = useState(null);
  const [preferredType, setPreferredType] = useState("resi");

  const { alldetails: allOccupations } = useSelector((state) => state.leadOccupation);
  const { alldetailsForTypes } = useSelector((state) => state.OccupationType);
  const { LeadType: leadTypes } = useSelector((state) => state.LeadType);
  const { callingPurposes, loading: callingPurposeLoading } = useSelector((state) => state.callingPurpose);
  const { leadsourceDetail } = useSelector((state) => state.leadsource);
  const { loading: clientLoading } = useSelector((state) => state.client);

  useEffect(() => {
    dispatch(fetchLeadType());
    dispatch(fetchCallingPurposes());
    dispatch(fetchDetails());
    dispatch(getAllOccupationTypes());
    dispatch(getAllOccupations());
    fetchRMs();
  }, [dispatch]);

  const fetchRMs = async () => {
    try {
      const response = await axiosInstance.get("/api/employee/getAllEmployees?limit=1000");
      let allEmployees = [];
      if (response.data) {
        if (response.data.success && Array.isArray(response.data.data)) allEmployees = response.data.data;
        else if (Array.isArray(response.data)) allEmployees = response.data;
      }

      const activeEmployees = allEmployees.filter(emp => 
        !emp.dateOfTermination && !emp.terminationDate && (emp.status === "active" || emp.status === "Active" || !emp.status)
      );

      setRms(activeEmployees.filter(emp => {
        const role = (emp.role || emp.designation || "").toLowerCase();
        return role.includes("rm") || role.includes("relationship") || role.includes("manager");
      }));

      setCres(activeEmployees.filter(emp => {
        const role = (emp.role || emp.designation || "").toLowerCase();
        return role.includes("cre") || role.includes("customer");
      }));
    } catch (error) { console.error("Error fetching RMs:", error); }
  };

  useEffect(() => {
    if (isEdit && clientData) {
      const pd = clientData.personalDetails || {};
      const combined = (pd.groupHeadName || pd.groupName || "").trim();
      const parts = splitGroupHeadName(combined);
      
      const formattedData = {
        ...pd,
        groupHeadNameFirst: parts.first,
        groupHeadNameMiddle: parts.middle,
        groupHeadNameLast: parts.last,
        time: pd.time ? (pd.time.includes("AM") || pd.time.includes("PM") ? pd.time : dayjs(pd.time, "HH:mm").format("hh:mm A")) : "10:00 AM",
      };
      form.setFieldsValue(formattedData);
      setPreferredType(pd.preferredAddressType || "resi");
    } else {
      form.resetFields();
      form.setFieldsValue({ time: "10:00 AM", preferredAddressType: "resi" });
    }
  }, [isEdit, clientData, form]);

  const fetchAreaData = async (pincode) => {
    try {
      const response = await axiosInstance.get(`/api/leadarea?pincode=${pincode}`);
      const data = response.data;
      if (data && Array.isArray(data)) {
        const area = data.find(item => String(item.pincode) === String(pincode));
        return area || { name: "Not Found", city: "" };
      }
      return { name: "No Data", city: "" };
    } catch (error) { return { name: "Error", city: "" }; }
  };

  const onValuesChange = async (changedValues, allValues) => {
    if (changedValues.annualIncome) {
      form.setFieldsValue({ grade: gradeMap[changedValues.annualIncome] || "" });
    }

    if (changedValues.mobileNo && String(changedValues.mobileNo).length === 10 && !whatsappEdited) {
      form.setFieldsValue({ whatsappNo: changedValues.mobileNo });
    }
    if (changedValues.whatsappNo) setWhatsappEdited(true);

    if (GROUP_HEAD_NAME_PART_FIELDS.some(f => changedValues[f])) {
      const joined = joinGroupHeadName({
        first: allValues.groupHeadNameFirst,
        middle: allValues.groupHeadNameMiddle,
        last: allValues.groupHeadNameLast,
      });
      form.setFieldsValue({ groupHeadName: joined, groupName: joined });
    }

    if (changedValues.resiPincode && String(changedValues.resiPincode).length === 6) {
      const areaData = await fetchAreaData(changedValues.resiPincode);
      form.setFieldsValue({ resiArea: areaData.name, resiCity: areaData.city });
      if (allValues.preferredAddressType === "resi") {
        form.setFieldsValue({ preferredMeetingArea: areaData.name, city: areaData.city });
      }
    }
    if (changedValues.officePincode && String(changedValues.officePincode).length === 6) {
      const areaData = await fetchAreaData(changedValues.officePincode);
      form.setFieldsValue({ officeArea: areaData.name, officeCity: areaData.city });
      if (allValues.preferredAddressType === "office") {
        form.setFieldsValue({ preferredMeetingArea: areaData.name, city: areaData.city });
      }
    }

    if (changedValues.preferredAddressType) {
      const type = changedValues.preferredAddressType;
      setPreferredType(type);
      if (type === "resi") {
        form.setFieldsValue({ 
          preferredMeetingAddr: allValues.resiAddr, 
          preferredMeetingArea: allValues.resiArea,
          city: allValues.resiCity
        });
      } else {
        form.setFieldsValue({ 
          preferredMeetingAddr: allValues.officeAddr, 
          preferredMeetingArea: allValues.officeArea,
          city: allValues.officeCity
        });
      }
    }

    const pin = allValues.preferredAddressType === "office" ? allValues.officePincode : allValues.resiPincode;
    if (pin && String(pin).length === 6) {
      const matched = rms.filter(rm => 
        String(rm.workPincode) === String(pin) || 
        (Array.isArray(rm.managedAreas) && rm.managedAreas.some(a => String(a.pincode) === String(pin)))
      );
      setFilteredRms(matched.length > 0 ? matched : null);
    } else {
      setFilteredRms(null);
    }

    if (onFormDataUpdate) {
      onFormDataUpdate(sanitizePersonalDetailsGroupHead(allValues));
    }
  };

  const onFinish = async (values) => {
    const sanitized = sanitizePersonalDetailsGroupHead(values);
    try {
      if (isEdit && clientData?._id) {
        await dispatch(updateClientPersonalDetails({
          id: clientData._id,
          personalDetails: sanitized,
        })).unwrap();
        toast.info("Client details updated successfully");
        if (onClientCreated) onClientCreated(clientData._id);
      } else {
        const result = await dispatch(createClient({ personalDetails: sanitized })).unwrap();
        toast.success("Client Created Successfully");
        if (setFamilyDetail) setFamilyDetail(values);
        if (changeTab) changeTab("family");
        if (onClientCreated && result) onClientCreated(result);
      }
    } catch (err) {
      toast.error(err || "Failed to save client details");
    }
  };

  return (
    <div className="professional-client-form">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={onValuesChange}
        initialValues={{ preferredAddressType: "resi", time: "10:00 AM" }}
        requiredMark="optional"
      >
        <Row gutter={[16, 16]}>
          {/* Section 1: Identity */}
          <Col span={24}>
            <Card 
              title={<Space><TeamOutlined style={{ color: "#1890ff" }} />Group & Identity</Space>}
              bordered={false} className="shadow-sm border-radius-8 mb-3" size="small"
            >
              <Row gutter={12}>
                <Col xs={24} md={2}>
                  <Form.Item name="salutation" label="Salutation">
                    <Select placeholder="Mr.">
                      {["Mr.", "Mrs.", "Ms.", "Kr.", "Kum.", "Shri.", "Smt.", "Dr.", "Adv."].map(s => <Option key={s} value={s}>{s}</Option>)}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={10}>
                  <Form.Item label="Group Head Full Name" required>
                    <Input.Group compact>
                      <Form.Item name="groupHeadNameFirst" noStyle rules={[{ required: true, message: "First Name" }]}>
                        <Input style={{ width: "33%" }} placeholder="First" />
                      </Form.Item>
                      <Form.Item name="groupHeadNameMiddle" noStyle>
                        <Input style={{ width: "34%" }} placeholder="Middle" />
                      </Form.Item>
                      <Form.Item name="groupHeadNameLast" noStyle rules={[{ required: true, message: "Last Name" }]}>
                        <Input style={{ width: "33%" }} placeholder="Last" />
                      </Form.Item>
                    </Input.Group>
                  </Form.Item>
                </Col>
                <Col xs={24} md={4}>
                  <Form.Item name="gender" label="Gender">
                    <Select placeholder="Select">
                      <Option value="Male">Male</Option>
                      <Option value="Female">Female</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={5}>
                  <Form.Item name="annualIncome" label="Annual Income">
                    <Select placeholder="Select range">
                      {incomeOptions.map(opt => <Option key={opt.value} value={opt.value}>{opt.label}</Option>)}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={3}>
                  <Form.Item name="grade" label="Grade">
                    <Input readOnly className="grade-display" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Section 2 & 3: Contacts and Professional */}
          <Col xs={24} lg={12}>
            <Card 
              title={<Space><PhoneOutlined style={{ color: "#52c41a" }} />Contact Information</Space>}
              bordered={false} className="shadow-sm border-radius-8 mb-3 h-100" size="small"
            >
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item name="mobileNo" label="Mobile No." rules={[{ required: true, pattern: /^\d{10}$/, message: "10 digits" }]}>
                    <Input prefix={<PhoneOutlined className="text-muted" />} maxLength={10} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="whatsappNo" label="WhatsApp No.">
                    <Input prefix={<WhatsAppOutlined style={{ color: "#25D366" }} />} maxLength={10} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="contactNo" label="Landline/Alternate">
                    <Input prefix={<PhoneOutlined className="text-muted" />} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="emailId" label="Email ID" rules={[{ type: "email", message: "Invalid email" }]}>
                    <Input prefix={<MailOutlined className="text-muted" />} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="socialLink" label="Social Profile Link">
                    <Input prefix={<LinkOutlined className="text-muted" />} placeholder="LinkedIn/FB" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card 
              title={<Space><SolutionOutlined style={{ color: "#722ed1" }} />Professional & Personal</Space>}
              bordered={false} className="shadow-sm border-radius-8 mb-3 h-100" size="small"
            >
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item name="organisation" label="Organisation">
                    <Input prefix={<BankOutlined className="text-muted" />} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="designation" label="Designation"><Input /></Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="nativePlace" label="Native Place">
                    <Input prefix={<GlobalOutlined className="text-muted" />} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="hobbies" label="Hobbies"><Input /></Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="habits" label="Habits/Preferences"><Input /></Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Section 4: Address */}
          <Col span={24}>
            <Card 
              title={<Space><HomeOutlined style={{ color: "#faad14" }} />Address & Communication</Space>}
              bordered={false} className="shadow-sm border-radius-8 mb-3" size="small"
            >
              <Form.Item name="preferredAddressType" label={<Text strong>Preferred Address for Communication</Text>}>
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value="resi">Residential</Radio.Button>
                  <Radio.Button value="office">Office</Radio.Button>
                </Radio.Group>
              </Form.Item>

              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Card size="small" type="inner" title="Residential" className={preferredType === "office" ? "faded-card" : ""}>
                    <Form.Item name="resiAddr" label="Street Address"><TextArea rows={2} /></Form.Item>
                    <Row gutter={8}>
                      <Col span={14}>
                        <Form.Item name="resiPincode" label="Pincode"><Input maxLength={6} /></Form.Item>
                      </Col>
                      <Col span={10}>
                        <Form.Item name="resiCity" label="City"><Input readOnly /></Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card size="small" type="inner" title="Office" className={preferredType === "resi" ? "faded-card" : ""}>
                    <Form.Item name="officeAddr" label="Workplace Address"><TextArea rows={2} /></Form.Item>
                    <Row gutter={8}>
                      <Col span={14}>
                        <Form.Item name="officePincode" label="Pincode"><Input maxLength={6} /></Form.Item>
                      </Col>
                      <Col span={10}>
                        <Form.Item name="officeCity" label="City"><Input readOnly /></Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>

              <Divider dashed />

              <Row gutter={12}>
                <Col xs={24} md={10}>
                  <Form.Item name="preferredMeetingAddr" label="Meeting Point Address">
                    <Input prefix={<EnvironmentOutlined className="text-muted" />} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={5}>
                  <Form.Item name="preferredMeetingArea" label="Area"><Input /></Form.Item>
                </Col>
                <Col xs={24} md={5}>
                  <Form.Item name="meetingLandmark" label="Landmark"><Input /></Form.Item>
                </Col>
                <Col xs={24} md={4}>
                  <Form.Item name="city" label="City"><Input /></Form.Item>
                </Col>
              </Row>

              <Row gutter={12}>
                <Col xs={24} md={12}>
                  <Form.Item name="bestTime" label="Best Time to Visit">
                    <Select placeholder="Select Slot">
                      <Option value="10 AM to 2 PM">10 AM to 2 PM</Option>
                      <Option value="2 PM to 7 PM">2 PM to 7 PM</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="time" label="Preferred Specific Time">
                    <Input prefix={<ScheduleOutlined className="text-muted" />} placeholder="e.g. 11:30 AM" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Section 5: Assistant */}
          <Col span={24}>
            <Card 
              title={<Space><UserOutlined style={{ color: "#eb2f96" }} />Assistant / PA Details</Space>}
              bordered={false} className="shadow-sm border-radius-8 mb-3" size="small"
            >
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item name="paName" label="PA Name"><Input /></Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="paMobileNo" label="PA Mobile No." rules={[{ pattern: /^\d{10}$/, message: "10 digits" }]}>
                    <Input prefix={<PhoneOutlined className="text-muted" />} maxLength={10} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Section 6: Internal */}
          <Col span={24}>
            <Card 
              title={<Space><SolutionOutlined style={{ color: "#fa541c" }} />Internal & Lead Management</Space>}
              bordered={false} className="shadow-sm border-radius-8 mb-3" size="small"
            >
              <Row gutter={12}>
                <Col xs={24} md={6}>
                  <Form.Item name="leadSource" label="Lead Source">
                    <Select placeholder="Source">
                      {leadsourceDetail?.map(s => <Option key={s._id} value={s.sourceName || s.leadName}>{s.sourceName || s.leadName}</Option>)}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item name="leadName" label="Reference Name"><Input /></Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item name="leadOccupationType" label="Occupation Category">
                    <Select placeholder="Type" onChange={() => form.setFieldsValue({ leadOccupation: "" })}>
                      {alldetailsForTypes?.map(t => <Option key={t._id} value={t.occupationType}>{t.occupationType}</Option>)}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item noStyle shouldUpdate={(p, c) => p.leadOccupationType !== c.leadOccupationType}>
                    {({ getFieldValue }) => (
                      <Form.Item name="leadOccupation" label="Specific Occupation">
                        <Select placeholder="Occupation" disabled={!getFieldValue("leadOccupationType")}>
                          {allOccupations?.filter(o => o.occupationType?.occupationType === getFieldValue("leadOccupationType")).map(o => (
                            <Option key={o._id} value={o.occupationName}>{o.occupationName}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={12}>
                <Col xs={24} md={8}>
                  <Form.Item name="callingPurpose" label="Calling Purpose">
                    <Select placeholder="Purpose" loading={callingPurposeLoading}>
                      {callingPurposes?.map(p => <Option key={p._id} value={p.purposeName}>{p.purposeName}</Option>)}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="name" label="Product Name"><Input /></Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="allocatedCRE" label="Allocated CRE">
                    <Select placeholder="Executive">
                      {cres?.map(e => <Option key={e._id} value={e._id}>{e.name} ({e.employeeCode})</Option>)}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={12}>
                <Col span={24}>
                  <Form.Item 
                    name="allocatedRM" label={<Text strong>Allocated Relationship Manager (Suggested by Pincode)</Text>}
                    extra={filteredRms ? `System found ${filteredRms.length} suggested RMs for this area.` : "No direct matches found."}
                  >
                    <Select placeholder="Select RM" showSearch optionFilterProp="children">
                      {(filteredRms || rms).map(e => (
                        <Option key={e._id} value={e._id}>
                          <Space>
                            <Text strong>{e.name}</Text>
                            <Text type="secondary">({e.employeeCode})</Text>
                            {filteredRms && <Text type="success" style={{ fontSize: "11px" }}>(Suggested)</Text>}
                          </Space>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="remark" label="Internal Remarks"><TextArea rows={3} prefix={<MessageOutlined />} /></Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Card bordered={false} className="shadow-sm border-radius-8">
          <Row justify="end">
            <Space size="middle">
              <Button size="large" icon={<ReloadOutlined />} onClick={() => form.resetFields()}>Reset</Button>
              <Button type="primary" htmlType="submit" size="large" loading={clientLoading} icon={<SaveOutlined />} style={{ minWidth: "180px" }}>
                {isEdit ? "Update Personal Details" : "Save & Proceed"}
              </Button>
            </Space>
          </Row>
        </Card>
      </Form>

      <style>{`
        .professional-client-form .ant-form-item { margin-bottom: 12px; }
        .professional-client-form .ant-form-item-label > label { font-weight: 600; font-size: 0.85rem; color: #434343; }
        .border-radius-8 { border-radius: 8px; overflow: hidden; }
        .shadow-sm { box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .faded-card { opacity: 0.55; pointer-events: none; transition: opacity 0.3s; }
        .grade-display { background-color: #f5f5f5 !important; font-weight: bold; color: #1890ff; text-align: center; }
        .text-muted { color: #bfbfbf; }
        .mb-3 { margin-bottom: 16px; }
      `}</style>
    </div>
  );
};

export default PersonalDetailsForm;
