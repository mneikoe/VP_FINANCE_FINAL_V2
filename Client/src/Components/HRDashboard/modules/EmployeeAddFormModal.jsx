import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Row,
  Col,
  Tabs,
  Button,
  Divider,
  Space,
  Typography,
  message,
  Table,
  Badge,
  Alert,
  Descriptions,
  Tag,
} from "antd";
import {
  UserOutlined,
  BankOutlined,
  SolutionOutlined,
  ToolOutlined,
  HistoryOutlined,
  PlusOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Text, Title } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

const EmployeeAddFormModal = ({ candidate, onClose, onEmployeeAdded }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("1");

  // Initial State for Office Kit
  const defaultItems = {
    oneTime: ["Office Key", "Uniform Set", "Mobile Sim Card", "Drawer Key", "ID Card", "Laptop/Tablet"],
    yearly: ["Visiting Card", "Executive Folder/Bag", "Servicing Form & Application", "Dummy Portfolio File", "Proposal Form & Related Paper", "Daily Working Sheet", "Calculator"],
    monthly: ["Customer List", "Birth list, Anniversary List", "Outstanding Due list", "Maturity Due list & SB Due list", "GIC, Health, MF Due List"]
  };

  const initAllotment = (items) => items.map(item => ({
    particular: item,
    allotmentDate: dayjs(),
    condition: "New",
    quantity: 1,
    enabled: false
  }));

  const [oneTimeKit, setOneTimeKit] = useState(initAllotment(defaultItems.oneTime));
  const [yearlyKit, setYearlyKit] = useState(initAllotment(defaultItems.yearly));
  const [monthlyKit, setMonthlyKit] = useState(initAllotment(defaultItems.monthly));

  const roleOptions = [
    { value: "Telecaller", label: "Telecaller", code: "TC", designation: "Telecaller Executive" },
    { value: "Telemarketer", label: "Telemarketer", code: "TM", designation: "Telemarketing Executive" },
    { value: "OE", label: "OE (Operation Executive)", code: "OE", designation: "Operation Executive" },
    { value: "HR", label: "HR", code: "HR", designation: "HR Executive" },
    { value: "RM", label: "RM (Relationship Manager)", code: "RM", designation: "Relationship Manager" },
    { value: "OA", label: "OA (Office Assistant)", code: "OA", designation: "Office Assistant" },
    { value: "Accountant", label: "Accountant", code: "AC", designation: "Accountant" },
  ];

  useEffect(() => {
    if (candidate) {
      form.setFieldsValue({
        name: candidate.candidateName,
        mobileNo: candidate.mobileNo,
        emailId: candidate.email,
        presentAddress: candidate.location,
        permanentAddress: candidate.nativePlace,
        salaryOnJoining: candidate.salaryExpectation,
        dateOfJoining: dayjs(),
        password: "123456",
        role: "Telecaller"
      });
      handleRoleChange("Telecaller");
    }
  }, [candidate]);

  const handleRoleChange = (roleValue) => {
    const role = roleOptions.find(r => r.value === roleValue);
    if (role) {
      const code = `${role.code}${Math.floor(1000 + Math.random() * 9000)}`;
      form.setFieldsValue({
        employeeCode: code,
        allottedLoginId: code,
        designation: role.designation
      });
    }
  };

  const handleKitChange = (type, index, field, value) => {
    const setters = { oneTime: setOneTimeKit, yearly: setYearlyKit, monthly: setMonthlyKit };
    const states = { oneTime: oneTimeKit, yearly: yearlyKit, monthly: monthlyKit };
    
    const newKit = [...states[type]];
    newKit[index][field] = value;
    setters[type](newKit);
  };

  const columns = (type) => [
    {
      title: 'Select',
      dataIndex: 'enabled',
      width: 70,
      render: (val, _, index) => <input type="checkbox" checked={val} onChange={(e) => handleKitChange(type, index, 'enabled', e.target.checked)} />
    },
    { title: 'Particular', dataIndex: 'particular', width: 200 },
    {
      title: 'Date',
      dataIndex: 'allotmentDate',
      render: (val, _, index) => (
        <DatePicker size="small" value={val} onChange={(date) => handleKitChange(type, index, 'allotmentDate', date)} />
      )
    },
    {
      title: 'Condition',
      dataIndex: 'condition',
      render: (val, _, index) => (
        <Select size="small" value={val} style={{ width: 100 }} onChange={(v) => handleKitChange(type, index, 'condition', v)}>
          <Select.Option value="New">New</Select.Option>
          <Select.Option value="Used">Used</Select.Option>
        </Select>
      )
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      render: (val, _, index) => (
        <Input size="small" type="number" value={val} style={{ width: 60 }} onChange={(e) => handleKitChange(type, index, 'quantity', e.target.value)} />
      )
    }
  ];

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Prepare structured Office Kit data
      const officeKitAllotment = {
        oneTime: oneTimeKit.filter(k => k.enabled).map(({ enabled, ...rest }) => ({ ...rest, allotmentDate: rest.allotmentDate.toDate() })),
        yearly: yearlyKit.filter(k => k.enabled).map(({ enabled, ...rest }) => ({ ...rest, allotmentDate: rest.allotmentDate.toDate() })),
        monthly: monthlyKit.filter(k => k.enabled).map(({ enabled, ...rest }) => ({ ...rest, allotmentDate: rest.allotmentDate.toDate() }))
      };

      // Prepare Recruitment Details
      const recruitmentDetails = {
        candidateId: candidate._id,
        appliedDate: candidate.appliedDate,
        interviewDate: candidate.interviewDate,
        interviewPlace: candidate.interviewPlace,
        totalMarks: candidate.totalMarks,
        resume: candidate.resume,
        offerLetter: {
            path: candidate.offerLetterDetails?.file?.path,
            sentDate: candidate.offerLetterDetails?.sentDate
        },
        joiningLetter: {
            path: candidate.joiningLetterDetails?.file?.path,
            sentDate: candidate.joiningLetterDetails?.sentDate,
            joiningDate: candidate.joiningLetterDetails?.joiningDate
        }
      };

      const payload = {
        ...values,
        officeKitAllotment,
        recruitmentDetails,
        dateOfJoining: values.dateOfJoining.toDate(),
      };

      const response = await axios.post("/api/employee/addEmployee", payload);

      if (response.data.success) {
        // Update candidate status
        await axios.put(`/api/addcandidate/${candidate._id}/stage`, {
          currentStage: "Added as Employee",
          currentStatus: "Added as Employee"
        });
        
        message.success(`Employee added successfully! Code: ${payload.employeeCode}`);
        onEmployeeAdded();
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      message.error(error.response?.data?.message || "Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={<Space><CheckCircleOutlined style={{ color: '#52c41a' }} /> Finalize Hiring & Allotment: {candidate.candidateName}</Space>}
      open={true}
      onCancel={onClose}
      width={1000}
      centered
      onOk={handleSubmit}
      confirmLoading={loading}
      okText="Add as Employee"
      okButtonProps={{ size: 'large', style: { background: '#52c41a', borderColor: '#52c41a' } }}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
        {/* TAB 1: OFFICIAL DETAILS */}
        <TabPane tab={<span><SolutionOutlined /> Official & Role</span>} key="1">
          <Form form={form} layout="vertical" className="mt-3">
             <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="role" label="Employee Role" rules={[{ required: true }]}>
                    <Select onChange={handleRoleChange}>
                      {roleOptions.map(r => <Select.Option key={r.value} value={r.value}>{r.label}</Select.Option>)}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="employeeCode" label="Employee Code">
                    <Input disabled prefix={<Badge status="processing" />} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="designation" label="Designation">
                    <Input disabled />
                  </Form.Item>
                </Col>
             </Row>
             <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="dateOfJoining" label="Date of Joining" rules={[{ required: true }]}>
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="salaryOnJoining" label="Salary (Monthly)">
                    <Input placeholder="e.g. 15000" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="allottedLoginId" label="Login ID">
                    <Input disabled />
                  </Form.Item>
                </Col>
             </Row>
             <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="dateOfTermination" label="Date of Termination">
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="expenses" label="Expenses">
                    <Input placeholder="Monthly expenses" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="incentives" label="Incentives">
                    <Input placeholder="Incentive structure" />
                  </Form.Item>
                </Col>
             </Row>
             <Row gutter={16}>
                <Col span={12}>
                   <Form.Item name="officeMobile" label="Office Mobile">
                      <Input />
                   </Form.Item>
                </Col>
                <Col span={12}>
                   <Form.Item name="officeEmail" label="Office Email">
                      <Input type="email" />
                   </Form.Item>
                </Col>
             </Row>
             <Divider orientation="left">Personal Info (Verified)</Divider>
             <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                    <Input prefix={<UserOutlined />} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="mobileNo" label="Mobile No" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="emailId" label="Email ID" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
             </Row>
             <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="gender" label="Gender">
                    <Select>
                      <Select.Option value="Male">Male</Select.Option>
                      <Select.Option value="Female">Female</Select.Option>
                      <Select.Option value="Other">Other</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="dob" label="Date of Birth">
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="marriageDate" label="Marriage Date">
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
             </Row>
             <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="panNo" label="PAN No">
                    <Input placeholder="Enter PAN" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="aadharNo" label="Aadhar No">
                    <Input placeholder="Enter Aadhar Number" />
                  </Form.Item>
                </Col>
             </Row>
             <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="presentAddress" label="Present Address">
                    <TextArea rows={2} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="permanentAddress" label="Permanent Address">
                    <TextArea rows={2} />
                  </Form.Item>
                </Col>
             </Row>
             <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="homeTown" label="Home Town">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="familyContactPerson" label="Family Contact Person">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="familyContactMobile" label="Family Contact Mobile">
                    <Input />
                  </Form.Item>
                </Col>
             </Row>
             <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="emergencyContactPerson" label="Emergency Contact Person">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="emergencyContactMobile" label="Emergency Contact Mobile">
                    <Input />
                  </Form.Item>
                </Col>
             </Row>
          </Form>
        </TabPane>

        {/* TAB 2: OFFICE KIT ALLOTMENT */}
        <TabPane tab={<span><ToolOutlined /> Office Kit Allotment</span>} key="2">
          <div style={{ maxHeight: '500px', overflowY: 'auto', padding: '10px' }}>
            <Alert message="Select items from the list below to allot them to the employee." type="info" showIcon className="mb-3" />
            
            <Title level={5}><Badge status="warning" /> One-Time Allotment (Office Authorities)</Title>
            <Table 
                dataSource={oneTimeKit} 
                columns={columns('oneTime')} 
                pagination={false} 
                size="small" 
                rowKey="particular"
                bordered
                className="mb-4"
            />

            <Title level={5}><Badge status="processing" /> Yearly Allotment (Appliances & Stationary)</Title>
            <Table 
                dataSource={yearlyKit} 
                columns={columns('yearly')} 
                pagination={false} 
                size="small" 
                rowKey="particular"
                bordered
                className="mb-4"
            />

            <Title level={5}><Badge status="success" /> Monthly Allotment (Kinds of Data)</Title>
            <Table 
                dataSource={monthlyKit} 
                columns={columns('monthly')} 
                pagination={false} 
                size="small" 
                rowKey="particular"
                bordered
            />
          </div>
        </TabPane>

        {/* TAB 3: BANK DETAILS */}
        <TabPane tab={<span><BankOutlined /> Bank Details</span>} key="3">
           <Form form={form} layout="vertical" className="mt-3">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="bankName" label="Bank Name">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="accountNo" label="Account Number">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="ifscCode" label="IFSC Code">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="micr" label="MICR Code">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
           </Form>
        </TabPane>

        {/* TAB 4: RECRUITMENT TRAIL */}
        <TabPane tab={<span><HistoryOutlined /> Recruitment Audit Trail</span>} key="4">
           <div className="p-3">
              <Alert message="This data is automatically imported from the recruitment lifecycle." type="success" showIcon className="mb-3" />
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="Application Date">{candidate.appliedDate ? dayjs(candidate.appliedDate).format("DD MMM YYYY") : "N/A"}</Descriptions.Item>
                <Descriptions.Item label="Candidate ID">{candidate._id}</Descriptions.Item>
                <Descriptions.Item label="Interview Date">{candidate.interviewDate ? dayjs(candidate.interviewDate).format("DD MMM YYYY") : "N/A"}</Descriptions.Item>
                <Descriptions.Item label="Evaluation Score"><Badge count={candidate.totalMarks || 0} color="#faad14" /></Descriptions.Item>
                <Descriptions.Item label="Offer Letter Sent">
                    {candidate.offerLetterDetails?.sentDate ? dayjs(candidate.offerLetterDetails.sentDate).format("DD MMM YYYY") : <Tag color="default">Not Sent</Tag>}
                </Descriptions.Item>
                <Descriptions.Item label="Joining Letter Sent">
                    {candidate.joiningLetterDetails?.sentDate ? dayjs(candidate.joiningLetterDetails.sentDate).format("DD MMM YYYY") : <Tag color="default">Not Sent</Tag>}
                </Descriptions.Item>
              </Descriptions>
           </div>
        </TabPane>
      </Tabs>

      <style>{`
        .ant-modal-body { padding: 12px 24px 24px 24px; }
        .ant-table-thead > tr > th { background: #fafafa !important; font-weight: 600 !important; }
      `}</style>
    </Modal>
  );
};

export default EmployeeAddFormModal;
