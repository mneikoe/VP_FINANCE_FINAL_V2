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
  EnvironmentOutlined,
  GlobalOutlined,
  BarcodeOutlined,
  PushpinOutlined,
  SearchOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import { toast } from "react-toastify";
import {
  fetchAreas,
  createArea,
  updateArea,
  deleteArea,
} from "../../../redux/feature/LeadArea/AreaThunx";

const { Title, Text } = Typography;

const Area = () => {
  const dispatch = useDispatch();
  const { areas, loading, success } = useSelector((state) => state.leadArea);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
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
    dispatch(fetchAreas());
  };

  const showModal = (area = null) => {
    if (area) {
      setEditingArea(area);
      form.setFieldsValue({
        name: area.name,
        shortcode: area.shortcode,
        pincode: area.pincode,
        city: area.city,
      });
    } else {
      setEditingArea(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingArea(null);
    form.resetFields();
  };

  const onFinish = async (values) => {
    if (editingArea) {
      const result = await dispatch(updateArea({ id: editingArea._id, areaData: values }));
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Area updated successfully");
        loadData();
      }
    } else {
      const result = await dispatch(createArea(values));
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Area created successfully");
        loadData();
      }
    }
  };

  const handleDelete = async (id) => {
    const result = await dispatch(deleteArea(id));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Area deleted successfully");
      loadData();
    }
  };

  const filteredData = (Array.isArray(areas) ? areas : []).filter((item) =>
    item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.shortcode?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.city?.toLowerCase().includes(searchText.toLowerCase()) ||
    String(item.pincode).includes(searchText)
  );

  const columns = [
    {
      title: "Area Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => (
        <Space>
          <EnvironmentOutlined style={{ color: "#1890ff" }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Area Short Code",
      dataIndex: "shortcode",
      key: "shortcode",
      render: (text) => (
        <Space>
          <BarcodeOutlined style={{ color: "#52c41a" }} />
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      sorter: (a, b) => a.city.localeCompare(b.city),
      render: (text) => (
        <Space>
          <GlobalOutlined style={{ color: "#faad14" }} />
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Pin Code",
      dataIndex: "pincode",
      key: "pincode",
      render: (text) => (
        <Space>
          <PushpinOutlined style={{ color: "#eb2f96" }} />
          <Text>{text}</Text>
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
              title="Delete Area"
              description="Confirm deletion of this area?"
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
    <div className="premium-master-layout" style={{ padding: "24px", minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Card bordered={false} className="shadow-sm border-radius-8">
            <Row justify="space-between" align="middle" gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Space align="center" size="middle">
                  <Title level={3} style={{ margin: 0 }}>Area Master</Title>
                  <Badge count={filteredData.length} showZero color="#1890ff" />
                </Space>
                <Text type="secondary">Manage your geographic service areas and locations</Text>
              </Col>
              <Col xs={24} sm={12} style={{ textAlign: "right" }}>
                <Space wrap>
                  <Input 
                    placeholder="Search areas..." 
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
                    Add New Area
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
              scroll={{ x: 800 }}
              className="ant-table-striped custom-table"
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={
          <Space>
            {editingArea ? <EditOutlined className="text-primary" /> : <PlusOutlined className="text-primary" />}
            <Title level={4} style={{ margin: 0 }}>
              {editingArea ? "Update Area" : "Create New Area"}
            </Title>
          </Space>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
        centered
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: "20px" }}
          requiredMark="optional"
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Area Name"
                name="name"
                rules={[{ required: true, message: "Please enter area name!" }]}
              >
                <Input prefix={<EnvironmentOutlined className="text-muted" />} placeholder="e.g. Downtown" size="large" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Area Short Code"
                name="shortcode"
                rules={[{ required: true, message: "Please enter area short code!" }]}
              >
                <Input prefix={<BarcodeOutlined className="text-muted" />} placeholder="e.g. DT-01" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: "Please enter city!" }]}
              >
                <Input prefix={<GlobalOutlined className="text-muted" />} placeholder="e.g. New York" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Pin Code"
                name="pincode"
                rules={[{ required: true, message: "Please enter pin code!" }]}
              >
                <Input prefix={<PushpinOutlined className="text-muted" />} placeholder="e.g. 10001" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginBottom: 0, textAlign: "right", marginTop: "32px" }}>
            <Space>
              <Button onClick={handleCancel} size="large">Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading} size="large">
                {editingArea ? "Update Changes" : "Save Area"}
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
        .ant-btn-primary.shadow-sm {
          box-shadow: 0 2px 4px rgba(24, 144, 255, 0.35);
        }
      `}</style>
    </div>
  );
};

export default Area;



