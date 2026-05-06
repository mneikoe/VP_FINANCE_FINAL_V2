import React, { useState, useEffect } from "react";
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
  SearchOutlined,
  ReloadOutlined,
  LinkOutlined
} from "@ant-design/icons";
import {
  createDetails,
  fetchDetails,
  updateDetails,
  deleteDetails,
} from "../../../redux/feature/LeadSource/LeadThunx";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

const LeadSource = () => {
  const dispatch = useDispatch();
  const { leadsourceDetail: leadSources, loading, success } = useSelector(
    (state) => state.leadsource
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
    dispatch(fetchDetails());
  };

  const showModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      form.setFieldsValue({ sourceName: item.sourceName });
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
    try {
      if (editingItem) {
        await dispatch(updateDetails({ id: editingItem._id, data: values })).unwrap();
        toast.success("Lead source updated successfully!");
      } else {
        await dispatch(createDetails(values)).unwrap();
        toast.success("Lead source created successfully!");
      }
      loadData();
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteDetails(id)).unwrap();
      toast.success("Lead source deleted successfully!");
      loadData();
    } catch (error) {
      toast.error("Failed to delete lead source.");
    }
  };

  const filteredData = (Array.isArray(leadSources) ? leadSources : []).filter((item) =>
    item.sourceName?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Lead Name",
      dataIndex: "sourceName",
      key: "sourceName",
      sorter: (a, b) => (a.sourceName || "").localeCompare(b.sourceName || ""),
      render: (text) => (
        <Space>
          <LinkOutlined style={{ color: "#1890ff" }} />
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
              title="Delete Lead Source"
              description="Confirm deletion of this lead source?"
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
                  <Title level={3} style={{ margin: 0 }}>Lead Source Master</Title>
                  <Badge count={filteredData.length} showZero color="#fa8c16" />
                </Space>
                <Text type="secondary">Manage the origins of your leads</Text>
              </Col>
              <Col xs={24} sm={12} style={{ textAlign: "right" }}>
                <Space wrap>
                  <Input 
                    placeholder="Search source..." 
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
                    Add Source
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
              {editingItem ? "Update Lead Source" : "Create New Lead Source"}
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
            label="Lead Name"
            name="sourceName"
            rules={[{ required: true, message: "Please enter the lead source name!" }]}
          >
            <Input 
              prefix={<LinkOutlined className="text-muted" />} 
              placeholder="e.g. Website, Referral, Social Media" 
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right", marginTop: "32px" }}>
            <Space>
              <Button onClick={handleCancel} size="large">Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading} size="large">
                {editingItem ? "Update Changes" : "Save Source"}
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

export default LeadSource;