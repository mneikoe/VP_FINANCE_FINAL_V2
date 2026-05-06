import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  DatePicker,
  Input,
  Switch,
  Typography,
  Space,
  Divider,
  Button,
  message,
  Row,
  Col,
} from "antd";
import { MailOutlined, EnvironmentOutlined, CalendarOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Text, Title } = Typography;
const { TextArea } = Input;

const InterviewScheduleModal = ({ open, onCancel, candidate, onScheduleSuccess }) => {
  const [form] = Form.useForm();
  const [sendEmail, setSendEmail] = useState(true);
  const [loading, setLoading] = useState(false);

  // Default Template
  const defaultTemplate = (name, date, place, designation) => `Dear ${name},

We are pleased to invite you for an interview for the position of ${designation}.

Interview Details:
Date: ${date}
Place: ${place}

Please bring a copy of your resume and relevant documents.

Best regards,
HR Department
VP Finance`;

  useEffect(() => {
    if (open && candidate) {
      form.setFieldsValue({
        interviewDate: candidate.interviewDate ? dayjs(candidate.interviewDate) : null,
        interviewPlace: candidate.interviewPlace || "VP Finance Office, Arera Colony, Bhopal",
        emailSubject: `Interview Invitation - ${candidate.appliedFor?.designation || candidate.designation || "Position"}`,
      });
      
      updateEmailBody();
    }
  }, [open, candidate]);

  const updateEmailBody = () => {
    const vals = form.getFieldsValue();
    const dateStr = vals.interviewDate ? dayjs(vals.interviewDate).format("DD MMM YYYY, hh:mm A") : "[Date Not Set]";
    const place = vals.interviewPlace || "[Place Not Set]";
    const designation = candidate?.appliedFor?.designation || candidate?.designation || "Position";
    
    form.setFieldsValue({
      emailBody: defaultTemplate(candidate?.candidateName || "Candidate", dateStr, place, designation)
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // 1. Update Candidate Stage & Interview Details
      await axios.put(`/api/addcandidate/${candidate._id}/stage`, {
        currentStage: "Interview Process",
        interviewDate: values.interviewDate.toDate(),
        interviewPlace: values.interviewPlace
      });

      // 2. Optionally Send Email
      if (sendEmail && candidate.email) {
        await axios.post("/api/email/send", {
          to: candidate.email,
          subject: values.emailSubject,
          html: values.emailBody.replace(/\n/g, "<br/>"),
          text: values.emailBody
        });
        message.success("Interview scheduled and email sent!");
      } else {
        message.success("Interview scheduled successfully!");
      }

      onScheduleSuccess();
      form.resetFields();
    } catch (error) {
      console.error("Scheduling error:", error);
      message.error(error.response?.data?.message || "Failed to schedule interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={<Space><CalendarOutlined style={{ color: '#faad14' }} /> Schedule Interview</Space>}
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={700}
      okText="Schedule & Move"
      okButtonProps={{ style: { backgroundColor: '#faad14', borderColor: '#faad14' } }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ sendEmail: true }}
        onValuesChange={(changed) => {
          if (changed.interviewDate || changed.interviewPlace) {
            updateEmailBody();
          }
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="interviewDate"
              label="Interview Date & Time"
              rules={[{ required: true, message: 'Please select date' }]}
            >
              <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="interviewPlace"
              label="Interview Location"
              rules={[{ required: true, message: 'Please enter location' }]}
            >
              <Input prefix={<EnvironmentOutlined />} placeholder="Office Address" />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={{ margin: '12px 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Space>
            <MailOutlined />
            <Text strong>Send Invitation Email</Text>
          </Space>
          <Switch 
            checked={sendEmail} 
            onChange={setSendEmail} 
            disabled={!candidate?.email}
          />
        </div>

        {sendEmail && (
          <div className="fade-in">
            {!candidate?.email && <Text type="danger" style={{ display: 'block', marginBottom: 8 }}>Candidate email not found!</Text>}
            
            <Form.Item
              name="emailSubject"
              label="Email Subject"
              rules={[{ required: sendEmail, message: 'Subject is required' }]}
            >
              <Input placeholder="Interview invitation..." />
            </Form.Item>

            <Form.Item
              name="emailBody"
              label="Email Body (Template)"
              rules={[{ required: sendEmail, message: 'Body is required' }]}
            >
              <TextArea rows={8} placeholder="Dear Candidate..." />
            </Form.Item>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Tip: You can edit the template above before sending.
            </Text>
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default InterviewScheduleModal;
