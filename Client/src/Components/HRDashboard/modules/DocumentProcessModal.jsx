import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Upload,
  Button,
  DatePicker,
  Typography,
  Space,
  Divider,
  Switch,
  message,
  Row,
  Col,
} from "antd";
import {
  UploadOutlined,
  MailOutlined,
  FilePdfOutlined,
  SendOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Text, Title } = Typography;
const { TextArea } = Input;

const DocumentProcessModal = ({
  open,
  onCancel,
  candidate,
  type, // "Offer Letter" or "Joining Letter"
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [sendEmail, setSendEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const isOffer = type === "Offer Letter";

  // Default Template
  const getDefaultTemplate = (name, designation, joiningDate) => {
    if (isOffer) {
      return `Dear ${name},

We are pleased to offer you the position of ${designation} at VP Finance. 

Please find attached your Offer Letter for your review. We look forward to having you on our team.

Best regards,
HR Department
VP Finance`;
    } else {
      const dateStr = joiningDate ? dayjs(joiningDate).format("DD MMM YYYY") : "[Joining Date]";
      return `Dear ${name},

Congratulations! We are excited to inform you that your joining date for the position of ${designation} is scheduled for ${dateStr}.

Please find your Joining Letter attached. 

We are excited for you to start your journey with us. Please let us know if you have any questions.

Best regards,
HR Department
VP Finance`;
    }
  };

  useEffect(() => {
    if (open && candidate) {
      const designation = candidate.appliedFor?.designation || candidate.designation || "Position";
      form.setFieldsValue({
        emailSubject: isOffer 
          ? `Offer Letter - ${candidate.candidateName} - ${designation}`
          : `Joining Letter - ${candidate.candidateName} - ${designation}`,
        joiningDate: candidate.joiningLetterDetails?.joiningDate ? dayjs(candidate.joiningLetterDetails.joiningDate) : null,
      });
      
      const currentJoiningDate = form.getFieldValue("joiningDate");
      form.setFieldsValue({
        emailBody: getDefaultTemplate(candidate.candidateName, designation, currentJoiningDate),
      });
      
      setFileList([]);
    }
  }, [open, candidate, type]);

  const updateEmailTemplate = () => {
    const values = form.getFieldsValue();
    const designation = candidate.appliedFor?.designation || candidate.designation || "Position";
    form.setFieldsValue({
      emailBody: getDefaultTemplate(candidate.candidateName, designation, values.joiningDate),
    });
  };

  const handleUpload = async () => {
    try {
      const values = await form.validateFields();
      if (fileList.length === 0) {
        message.error("Please upload the PDF document");
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append(isOffer ? "offerLetterFile" : "joiningLetterFile", fileList[0].originFileObj);
      formData.append("sentDate", new Date().toISOString());
      if (!isOffer && values.joiningDate) {
        formData.append("joiningDate", values.joiningDate.toISOString());
      }
      
      // 1. Upload File & Update Candidate
      const endpoint = isOffer 
        ? `/api/addcandidate/${candidate._id}/offer-letter`
        : `/api/addcandidate/${candidate._id}/joining-letter`;
      
      const uploadRes = await axios.put(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 2. Send Email if requested
      if (sendEmail && candidate.email) {
        const docInfo = isOffer ? uploadRes.data.candidate.offerLetterDetails : uploadRes.data.candidate.joiningLetterDetails;
        
        await axios.post("/api/email/send", {
          to: candidate.email,
          subject: values.emailSubject,
          html: values.emailBody.replace(/\n/g, "<br/>"),
          text: values.emailBody,
          attachments: [
            {
              filename: `${type}.pdf`,
              path: docInfo.file.path
            }
          ]
        });
        message.success(`${type} sent and email with attachment delivered!`);
      } else {
        message.success(`${type} processed successfully!`);
      }

      onSuccess();
    } catch (error) {
      console.error("Error processing document:", error);
      message.error(error.response?.data?.message || `Failed to process ${type}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={<Space><FilePdfOutlined style={{ color: isOffer ? '#1890ff' : '#13c2c2' }} /> Process {type}</Space>}
      open={open}
      onCancel={onCancel}
      onOk={handleUpload}
      confirmLoading={loading}
      width={700}
      okText={`Send ${type}`}
      okButtonProps={{ icon: <SendOutlined /> }}
    >
      <Form 
        form={form} 
        layout="vertical"
        onValuesChange={(changed) => {
          if (changed.joiningDate) updateEmailTemplate();
        }}
      >
        <Title level={5}>Document Details</Title>
        <Row gutter={16}>
          <Col span={isOffer ? 24 : 12}>
            <Form.Item label={`Attach ${type} (PDF)`} required>
              <Upload
                beforeUpload={() => false}
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList.slice(-1))}
                accept=".pdf"
              >
                <Button icon={<UploadOutlined />}>Select PDF File</Button>
              </Upload>
            </Form.Item>
          </Col>
          {!isOffer && (
            <Col span={12}>
              <Form.Item 
                name="joiningDate" 
                label="Joining Date" 
                rules={[{ required: true, message: 'Please select joining date' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  placeholder="Select joining date"
                  prefix={<CalendarOutlined />}
                />
              </Form.Item>
            </Col>
          )}
        </Row>

        <Divider style={{ margin: '16px 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Space>
            <MailOutlined />
            <Text strong>Send Email Notification</Text>
          </Space>
          <Switch 
            checked={sendEmail} 
            onChange={setSendEmail} 
            disabled={!candidate?.email}
          />
        </div>

        {sendEmail && (
          <div className="fade-in">
            <Form.Item
              name="emailSubject"
              label="Email Subject"
              rules={[{ required: sendEmail, message: 'Subject is required' }]}
            >
              <Input placeholder="Subject..." />
            </Form.Item>

            <Form.Item
              name="emailBody"
              label="Email Body (Template)"
              rules={[{ required: sendEmail, message: 'Body is required' }]}
            >
              <TextArea rows={8} placeholder="Email body content..." />
            </Form.Item>
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default DocumentProcessModal;
