import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  Card,
  Typography,
  Tooltip,
  Badge,
  Row,
  Col
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PhoneOutlined,
  SearchOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import {
  createCallingPurpose,
  deleteCallingPurpose,
  fetchCallingPurposes,
  updateCallingPurpose,
} from "../../../redux/feature/CallingPurpose/CallingPurposeThunx";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

const CallingPurpose = () => {
  const dispatch = useDispatch();
  const { callingPurposes, loading, success } = useSelector(
    (state) => state.callingPurpose
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      handleCancel();
    }
  }, [success]);

  const loadData = () => {
    dispatch(fetchCallingPurposes());
  };

  const showModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      form.setFieldsValue({ purposeName: item.purposeName });
    } else {
      setEditingItem(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    form.resetFields();
  };

  const onFinish = async (values) => {
    if (editingItem) {
      const result = await dispatch(updateCallingPurpose({ id: editingItem._id, data: values }));
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Calling purpose updated successfully!");
        loadData();
      }
    } else {
      const result = await dispatch(createCallingPurpose(values));
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Calling purpose added successfully!");
        loadData();
      }
    }
  };

  const handleDelete = async (id) => {
    const result = await dispatch(deleteCallingPurpose(id));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Calling purpose deleted successfully!");
      loadData();
    }
  };

  const filteredData = (Array.isArray(callingPurposes) ? callingPurposes : []).filter((item) =>
    item.purposeName?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Purpose Name",
      dataIndex: "purposeName",
      key: "purposeName",
      sorter: (a, b) => (a.purposeName || "").localeCompare(b.purposeName || ""),
      render: (text) => (
        <Space>
          <PhoneOutlined style={{ color: "#1890ff" }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => showModal(record)}
              style={{ color: "#1890ff" }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete Purpose"
              description="Confirm deletion of this calling purpose?"
              onConfirm={() => handleDelete(record._id)}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                danger
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Card bordered={false} className="shadow-sm border-radius-8">
            <Row justify="space-between" align="middle" gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Space align="center" size="middle">
                  <Title level={3} style={{ margin: 0 }}>Calling Purpose Master</Title>
                  <Badge count={filteredData.length} showZero color="#1890ff" />
                </Space>
                <Text type="secondary">Manage the reasons for calling your leads</Text>
              </Col>
              <Col xs={24} sm={12} style={{ textAlign: "right" }}>
                <Space wrap>
                  <Input
                    placeholder="Search purpose..."
                    prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 250 }}
                    allowClear
                  />
                  <Button icon={<ReloadOutlined />} onClick={loadData} title="Refresh Data" />
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => showModal()}
                    size="large"
                    className="shadow-sm"
                  >
                    Add Purpose
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card bordered={false} className="shadow-sm border-radius-8" bodyStyle={{ padding: 0 }}>
            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey="_id"
              loading={loading}
              pagination={{ pageSize: 10, showSizeChanger: true }}
              scroll={{ x: 600 }}
              className="ant-table-striped custom-table"
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={
          <Space>
            {editingItem ? <EditOutlined className="text-primary" /> : <PlusOutlined className="text-primary" />}
            <Title level={4} style={{ margin: 0 }}>
              {editingItem ? "Update Purpose" : "Create New Purpose"}
            </Title>
          </Space>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: "20px" }}
          requiredMark="optional"
        >
          <Form.Item
            label="Purpose Name"
            name="purposeName"
            rules={[{ required: true, message: "Please enter the calling purpose name!" }]}
          >
            <Input
              prefix={<PhoneOutlined className="text-muted" />}
              placeholder="e.g. Follow up, Initial Contact"
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right", marginTop: "32px" }}>
            <Space>
              <Button onClick={handleCancel} size="large">Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading} size="large">
                {editingItem ? "Update Changes" : "Save Purpose"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <style>{`
        .custom-table .ant-table-thead > tr > th {
          background-color: #FFCC00 !important;
          color: #000 !important;
          font-weight: bold !important;
          border-right: 1px solid #ffffff !important;
          border-radius: 0 !important;
          text-align: center !important;
        }
        .custom-table .ant-table-thead > tr > th:last-child {
          border-right: none !important;
        }
        .custom-table .ant-table-tbody > tr > td {
          text-align: center !important;
        }
        .ant-table-striped .ant-table-tbody > tr:nth-child(2n) > td {
          background-color: #fafafa;
        }
        .text-muted { color: #bfbfbf; }
        .text-primary { color: #1890ff; }
        .border-radius-8 { border-radius: 8px; overflow: hidden; }
        .shadow-sm {
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
        }
      `}</style>
    </div>
  );
};

export default CallingPurpose;

