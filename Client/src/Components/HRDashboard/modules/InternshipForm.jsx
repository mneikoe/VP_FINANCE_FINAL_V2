import React, { useState } from "react";
import {
  Modal,
  Form,
  Row,
  Col,
  Button,
  Input,
  Select,
  DatePicker,
  Steps,
  Checkbox,
  Upload,
  message,
  Typography,
  Divider,
  Result,
  Descriptions,
  Alert,
} from "antd";
import {
  UserOutlined,
  BookOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  UploadOutlined,
  LeftOutlined,
  RightOutlined,
  SolutionOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TextArea } = Input;

const InternshipForm = ({ show, onHide, onSuccess }) => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [transcriptFile, setTranscriptFile] = useState(null);
  const [otherFiles, setOtherFiles] = useState([]);

  // Store form data for review
  const [formDataForReview, setFormDataForReview] = useState({});

  const next = async () => {
    try {
      // Validate only the current step's fields
      const fieldsToValidate = getFieldsForStep(current);
      await form.validateFields(fieldsToValidate);
      
      if (current === 3 && !resumeFile) {
        message.error("Resume is required");
        return;
      }

      const values = form.getFieldsValue();
      setFormDataForReview({ ...formDataForReview, ...values });
      setCurrent(current + 1);
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const getFieldsForStep = (step) => {
    switch (step) {
      case 0: return ["fullName", "gender", "dateOfBirth", "nationality", "contactNo", "email", "permanentAddress"];
      case 1: return ["universityName", "degreeProgram", "yearOfStudy", "expectedGraduationDate", "cumulativeGPA"];
      case 2: return ["positionApplied", "preferredStartDate", "preferredEndDate", "hoursPerWeek", "relevantSkills"];
      case 3: return [];
      default: return [];
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      // Ensure all dates are formatted correctly
      const finalData = {
        ...values,
        dateOfBirth: values.dateOfBirth?.format("YYYY-MM-DD"),
        expectedGraduationDate: values.expectedGraduationDate?.format("YYYY-MM-DD"),
        preferredStartDate: values.preferredStartDate?.format("YYYY-MM-DD"),
        preferredEndDate: values.preferredEndDate?.format("YYYY-MM-DD"),
        declarationAccepted: values.declarationAccepted === true
      };

      formData.append("data", JSON.stringify(finalData));

      if (resumeFile) formData.append("resume", resumeFile);
      if (transcriptFile) formData.append("transcript", transcriptFile);
      otherFiles.forEach(file => formData.append("otherDocuments", file));

      const response = await axios.post("/api/internships", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        message.success("Application submitted successfully!");
        resetForm();
        onSuccess();
      }
    } catch (error) {
      console.error("Submission error:", error);
      const errorMsg = error.response?.data?.message || "Failed to submit application. Please check all fields.";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    form.resetFields();
    setResumeFile(null);
    setTranscriptFile(null);
    setOtherFiles([]);
    setCurrent(0);
    setFormDataForReview({});
  };

  const steps = [
    { title: 'Personal', icon: <UserOutlined /> },
    { title: 'Education', icon: <BookOutlined /> },
    { title: 'Internship', icon: <SolutionOutlined /> },
    { title: 'Uploads', icon: <FileTextOutlined /> },
    { title: 'Review', icon: <CheckCircleOutlined /> },
  ];

  const renderReview = () => {
    const data = form.getFieldsValue();
    return (
      <div className="fade-in">
        <Alert
            message="Please review your application details before final submission."
            type="info"
            showIcon
            style={{ marginBottom: 20 }}
        />
        <Descriptions title="Personal Information" bordered column={2} size="small">
          <Descriptions.Item label="Full Name">{data.fullName}</Descriptions.Item>
          <Descriptions.Item label="Gender">{data.gender}</Descriptions.Item>
          <Descriptions.Item label="Email" span={2}>{data.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{data.contactNo}</Descriptions.Item>
          <Descriptions.Item label="DOB">{data.dateOfBirth?.format("DD MMM YYYY")}</Descriptions.Item>
          <Descriptions.Item label="Nationality">{data.nationality}</Descriptions.Item>
          <Descriptions.Item label="Address" span={2}>{data.permanentAddress}</Descriptions.Item>
        </Descriptions>

        <Divider />
        <Descriptions title="Academic & Internship" bordered column={2} size="small">
          <Descriptions.Item label="University" span={2}>{data.universityName}</Descriptions.Item>
          <Descriptions.Item label="Degree">{data.degreeProgram}</Descriptions.Item>
          <Descriptions.Item label="Year">{data.yearOfStudy}</Descriptions.Item>
          <Descriptions.Item label="Position" span={2}>{data.positionApplied}</Descriptions.Item>
          <Descriptions.Item label="Start Date">{data.preferredStartDate?.format("DD MMM YYYY")}</Descriptions.Item>
          <Descriptions.Item label="End Date">{data.preferredEndDate?.format("DD MMM YYYY")}</Descriptions.Item>
        </Descriptions>

        <Divider />
        <div style={{ background: '#f0f2f5', padding: '15px', borderRadius: '8px' }}>
            <Form.Item 
                name="declarationAccepted" 
                valuePropName="checked"
                style={{ margin: 0 }}
                rules={[{ 
                validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('You must accept the declaration')) 
                }]}
            >
                <Checkbox>
                <Text strong>Declaration: </Text>
                I hereby declare that the information provided is true and accurate to the best of my knowledge.
                </Checkbox>
            </Form.Item>
        </div>
      </div>
    );
  };

  return (
    <Modal
      title={
        <div style={{ padding: '10px 0' }}>
          <Title level={4} style={{ margin: 0 }}>Internship Application Form</Title>
          <Text type="secondary">Follow the steps to submit your application</Text>
        </div>
      }
      open={show}
      onCancel={onHide}
      footer={null}
      width={900}
      centered
      destroyOnClose
    >
      <div style={{ padding: '0 20px 20px 20px' }}>
        <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '12px', marginBottom: '32px' }}>
          <Steps 
            current={current} 
            size="small"
            items={steps.map(item => ({
              key: item.title,
              title: item.title,
              icon: item.icon,
            }))}
          />
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          preserve={true}
          initialValues={{ 
            nationality: "Indian", 
            gender: "Male",
            yearOfStudy: "First Year" 
          }}
        >
          {/* STEP 0: PERSONAL */}
          <div style={{ display: current === 0 ? 'block' : 'none' }}>
            <Row gutter={24}>
                <Col span={12}>
                  <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
                    <Input placeholder="Full Name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
                    <Select>
                      <Select.Option value="Male">Male</Select.Option>
                      <Select.Option value="Female">Female</Select.Option>
                      <Select.Option value="Other">Other</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="dateOfBirth" label="Date of Birth" rules={[{ required: true }]}>
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="nationality" label="Nationality" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="contactNo" label="Contact Number" rules={[{ required: true }]}>
                    <Input placeholder="10-digit mobile number" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email' }]}>
                    <Input placeholder="email@example.com" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="permanentAddress" label="Permanent Address" rules={[{ required: true }]}>
                    <TextArea rows={3} placeholder="Complete permanent address" />
                  </Form.Item>
                </Col>
              </Row>
          </div>

          {/* STEP 1: EDUCATION */}
          <div style={{ display: current === 1 ? 'block' : 'none' }}>
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item name="universityName" label="University / College Name" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="degreeProgram" label="Degree / Program" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="yearOfStudy" label="Year of Study" rules={[{ required: true }]}>
                    <Select>
                      <Select.Option value="First Year">First Year</Select.Option>
                      <Select.Option value="Second Year">Second Year</Select.Option>
                      <Select.Option value="Third Year">Third Year</Select.Option>
                      <Select.Option value="Fourth Year">Fourth Year</Select.Option>
                      <Select.Option value="Final Year">Final Year</Select.Option>
                      <Select.Option value="Post Graduate">Post Graduate</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="expectedGraduationDate" label="Expected Graduation Date" rules={[{ required: true }]}>
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="cumulativeGPA" label="Cumulative GPA (Scale of 10)">
                    <Input type="number" step="0.1" />
                  </Form.Item>
                </Col>
              </Row>
          </div>

          {/* STEP 2: INTERNSHIP */}
          <div style={{ display: current === 2 ? 'block' : 'none' }}>
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item name="positionApplied" label="Position Applied For" rules={[{ required: true }]}>
                    <Input placeholder="e.g. Software Developer Intern" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="preferredStartDate" label="Preferred Start Date" rules={[{ required: true }]}>
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="preferredEndDate" label="Preferred End Date" rules={[{ required: true }]}>
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="hoursPerWeek" label="Hours Available per Week" rules={[{ required: true }]}>
                    <Input type="number" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="relevantSkills" label="Relevant Skills (Comma separated)">
                    <TextArea rows={3} placeholder="JavaScript, React, etc." />
                  </Form.Item>
                </Col>
              </Row>
          </div>

          {/* STEP 3: UPLOADS */}
          <div style={{ display: current === 3 ? 'block' : 'none' }}>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item label="Resume (PDF) *" required>
                    <Upload 
                      beforeUpload={(file) => { setResumeFile(file); return false; }} 
                      maxCount={1}
                      accept=".pdf"
                    >
                      <Button icon={<UploadOutlined />} block>Select Resume</Button>
                    </Upload>
                    {resumeFile && <Text type="success">✓ {resumeFile.name}</Text>}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Transcript (Optional)">
                    <Upload 
                      beforeUpload={(file) => { setTranscriptFile(file); return false; }} 
                      maxCount={1}
                      accept=".pdf"
                    >
                      <Button icon={<UploadOutlined />} block>Select Transcript</Button>
                    </Upload>
                    {transcriptFile && <Text type="success">✓ {transcriptFile.name}</Text>}
                  </Form.Item>
                </Col>
                <Col span={24}>
                   <Divider />
                   <Form.Item label="Other Supporting Documents (Max 5)">
                    <Upload 
                      beforeUpload={(file) => { setOtherFiles([...otherFiles, file]); return false; }} 
                      multiple
                      maxCount={5}
                    >
                      <Button icon={<UploadOutlined />}>Upload Multiple Files</Button>
                    </Upload>
                    {otherFiles.length > 0 && <Text type="success">✓ {otherFiles.length} files selected</Text>}
                  </Form.Item>
                </Col>
              </Row>
          </div>

          {/* STEP 4: REVIEW */}
          {current === 4 && renderReview()}

          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between' }}>
            {current > 0 && (
              <Button icon={<LeftOutlined />} onClick={() => prev()}>
                Previous
              </Button>
            )}
            <div style={{ marginLeft: 'auto' }}>
              <Button style={{ marginRight: 8 }} onClick={onHide}>
                Cancel
              </Button>
              {current < steps.length - 1 && (
                <Button type="primary" onClick={() => next()}>
                  Next <RightOutlined />
                </Button>
              )}
              {current === steps.length - 1 && (
                <Button type="primary" htmlType="submit" loading={loading} style={{ background: '#52c41a', borderColor: '#52c41a' }}>
                  Submit Application
                </Button>
              )}
            </div>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default InternshipForm;
