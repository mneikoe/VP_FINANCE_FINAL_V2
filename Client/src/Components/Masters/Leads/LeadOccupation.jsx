import React, { useState, useEffect, useMemo } from "react";
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
  Col,
  Select,
  Tag
} from "antd";
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  ReloadOutlined,
  IdcardOutlined,
  AppstoreOutlined
} from "@ant-design/icons";
import {
  getAllOccupations,
  createOccupation,
  updateOccupation,
  deleteOccupation,
} from "../../../redux/feature/LeadOccupation/OccupationThunx";
import { getAllOccupationTypes } from "../../../redux/feature/OccupationType/OccupationThunx";
import { toast } from "react-toastify";

const { Title, Text } = Typography;
const { Option } = Select;

const LeadOccupation = () => {
  const dispatch = useDispatch();
  const { alldetails, loading: occLoading, success } = useSelector((state) => state.leadOccupation);
  const { alldetailsForTypes, loading: typeLoading } = useSelector((state) => state.OccupationType);

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
    dispatch(getAllOccupationTypes());
    dispatch(getAllOccupations());
  };

  const showModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      form.setFieldsValue({ 
        occupationName: item.occupationName,
        occupationType: item.occupationType?._id 
      });
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
        const result = await dispatch(
          updateOccupation({ id: editingItem._id, data: values })
        );
        if (result.meta.requestStatus === "fulfilled") {
          toast.success("Occupation updated successfully!");
          loadData();
        }
      } else {
        const result = await dispatch(
          createOccupation(values)
        );
        if (result.meta.requestStatus === "fulfilled") {
          toast.success("Occupation added successfully!");
          loadData();
        }
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    const result = await dispatch(deleteOccupation(id));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Occupation deleted successfully!");
      loadData();
    }
  };

  const filteredData = (Array.isArray(alldetails) ? alldetails : []).filter((item) =>
    item.occupationName?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.occupationType?.occupationType?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Occupation Name",
      dataIndex: "occupationName",
      key: "occupationName",
      sorter: (a, b) => (a.occupationName || "").localeCompare(b.occupationName || ""),
      render: (text) => (
        <Space>
          <IdcardOutlined style={{ color: "#1890ff" }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Category",
      dataIndex: ["occupationType", "occupationType"],
      key: "category",
      filters: Array.from(new Set((alldetails || []).map(item => item.occupationType?.occupationType))).filter(Boolean).map(type => ({ text: type, value: type })),
      onFilter: (value, record) => record.occupationType?.occupationType === value,
      render: (text) => (
        <Tag color="blue" icon={<AppstoreOutlined />}>
          {text || "Uncategorized"}
        </Tag>
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
              title="Delete Occupation"
              description="Confirm deletion of this occupation?"
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
                  <Title level={3} style={{ margin: 0 }}>Occupation Master</Title>
                  <Badge count={filteredData.length} showZero color="#13c2c2" />
                </Space>
                <Text type="secondary">Assign occupation names under specific categories</Text>
              </Col>
              <Col xs={24} sm={12} style={{ textAlign: "right" }}>
                <Space wrap>
                  <Input 
                    placeholder="Search occupation or category..." 
                    prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />} 
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 280 }}
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
                    Add Occupation
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
              loading={occLoading || typeLoading}
              pagination={{ pageSize: 10, showSizeChanger: true }}
              scroll={{ x: 800 }}
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
              {editingItem ? "Update Occupation" : "Create New Occupation"}
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
            label="Category (Occupation Type)"
            name="occupationType"
            rules={[{ required: true, message: "Please select an occupation type!" }]}
          >
            <Select 
              placeholder="Select Category" 
              size="large"
              loading={typeLoading}
              suffixIcon={<AppstoreOutlined className="text-muted" />}
            >
              {(alldetailsForTypes || []).map((item) => (
                <Option key={item._id} value={item._id}>
                  {item.occupationType}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Occupation Name"
            name="occupationName"
            rules={[{ required: true, message: "Please enter the occupation name!" }]}
          >
            <Input 
              prefix={<IdcardOutlined className="text-muted" />} 
              placeholder="e.g. Doctor, Engineer, Accountant" 
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right", marginTop: "32px" }}>
            <Space>
              <Button onClick={handleCancel} size="large">Cancel</Button>
              <Button type="primary" htmlType="submit" loading={occLoading} size="large">
                {editingItem ? "Update Changes" : "Save Occupation"}
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

export default LeadOccupation;

