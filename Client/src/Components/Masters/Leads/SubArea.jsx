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
  Select,
  Tag,
  Badge,
  Row,
  Col
} from "antd";
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EnvironmentOutlined,
  BlockOutlined,
  NumberOutlined,
  PushpinOutlined,
  SearchOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import { toast } from "react-toastify";
import {
  fetchSubAreas,
  createSubArea,
  updateSubArea,
  deleteSubArea,
} from "../../../redux/feature/LeadSubArea/SubAreaThunx";
import { fetchAreas } from "../../../redux/feature/LeadArea/AreaThunx";

const { Title, Text } = Typography;
const { Option } = Select;

const SubArea = () => {
  const dispatch = useDispatch();
  const { subAreas, loading, success } = useSelector((state) => state.leadSubArea);
  const { areas } = useSelector((state) => state.leadArea);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubArea, setEditingSubArea] = useState(null);
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
    dispatch(fetchSubAreas());
    dispatch(fetchAreas());
  };

  const showModal = (subArea = null) => {
    if (subArea) {
      setEditingSubArea(subArea);
      form.setFieldsValue({
        areaId: subArea.areaId?._id,
        subAreaName: subArea.subAreaName,
      });
    } else {
      setEditingSubArea(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingSubArea(null);
    form.resetFields();
  };

  const onFinish = async (values) => {
    if (editingSubArea) {
      const result = await dispatch(updateSubArea({ id: editingSubArea._id, subAreaData: values }));
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Sub Area updated successfully");
      }
    } else {
      const result = await dispatch(createSubArea(values));
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Sub Area created successfully");
      }
    }
    dispatch(fetchSubAreas());
  };

  const handleDelete = async (id) => {
    const result = await dispatch(deleteSubArea(id));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Sub Area deleted successfully");
      dispatch(fetchSubAreas());
    }
  };

  const filteredData = subAreas.filter((item) => 
    item.subAreaName?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.areaId?.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Parent Area",
      dataIndex: ["areaId", "name"],
      key: "areaName",
      sorter: (a, b) => (a.areaId?.name || "").localeCompare(b.areaId?.name || ""),
      render: (text) => (
        <Space>
          <EnvironmentOutlined style={{ color: "#1890ff" }} />
          <Text strong>{text || "N/A"}</Text>
        </Space>
      ),
    },
    {
      title: "Sub Area Name",
      dataIndex: "subAreaName",
      key: "subAreaName",
      sorter: (a, b) => (a.subAreaName || "").localeCompare(b.subAreaName || ""),
      render: (text) => (
        <Tag color="geekblue" style={{ borderRadius: "4px", padding: "2px 10px", fontWeight: 500 }}>
          {text}
        </Tag>
      ),
    },
    {
      title: "Area Short Code",
      dataIndex: ["areaId", "shortcode"],
      key: "shortcode",
      render: (text) => (
        <Space>
          <NumberOutlined style={{ color: "#52c41a" }} />
          <Text code>{text || "-"}</Text>
        </Space>
      ),
    },
    {
      title: "Pincode",
      dataIndex: ["areaId", "pincode"],
      key: "pincode",
      render: (text) => (
        <Space>
          <PushpinOutlined style={{ color: "#faad14" }} />
          <Text type="secondary">{text || "-"}</Text>
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 100,
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
              title="Delete Sub Area"
              description="Confirm deletion of this sub area?"
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
                  <Title level={3} style={{ margin: 0 }}>Sub Area Master</Title>
                  <Badge count={filteredData.length} overflowCount={999} showZero color="#1890ff" />
                </Space>
                <Text type="secondary">Manage detailed regions within your geographic areas</Text>
              </Col>
              <Col xs={24} sm={12} style={{ textAlign: "right" }}>
                <Space wrap>
                  <Input 
                    placeholder="Search Sub Area or Area..." 
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
                    Add Sub Area
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
              pagination={{ 
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} sub areas`
              }}
              scroll={{ x: 800 }}
              className="ant-table-striped custom-table"
              locale={{ emptyText: "No sub areas found" }}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={
          <Space>
            {editingSubArea ? <EditOutlined className="text-primary" /> : <PlusOutlined className="text-primary" />}
            <Title level={4} style={{ margin: 0 }}>
              {editingSubArea ? "Update Sub Area" : "Create New Sub Area"}
            </Title>
          </Space>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
        centered
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: "20px" }}
          requiredMark="optional"
        >
          <Form.Item
            label="Parent Area"
            name="areaId"
            rules={[{ required: true, message: "Please select an area!" }]}
          >
            <Select 
              placeholder="Choose a parent area" 
              showSearch
              size="large"
              filterOption={(input, option) =>
                (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
              }
              suffixIcon={<EnvironmentOutlined />}
            >
              {areas.map((area) => (
                <Option key={area._id} value={area._id}>
                  {area.name} ({area.pincode})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Sub Area Name"
            name="subAreaName"
            rules={[{ required: true, message: "Please enter the name of the sub area!" }]}
          >
            <Input 
              prefix={<BlockOutlined className="text-muted" />} 
              placeholder="e.g. Sector 5, Phase 2" 
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right", marginTop: "32px" }}>
            <Space>
              <Button onClick={handleCancel} size="large">Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading} size="large" className="px-5">
                {editingSubArea ? "Update Changes" : "Save Sub Area"}
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
        .ant-card-head { border-bottom: 1px solid #f0f0f0; }
        .px-5 { padding-left: 2rem; padding-right: 2rem; }
      `}</style>
    </div>
  );
};

export default SubArea;
