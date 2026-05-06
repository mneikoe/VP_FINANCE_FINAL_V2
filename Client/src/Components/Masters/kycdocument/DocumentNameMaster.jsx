import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Empty,
  Form,
  Input,
  List,
  Popconfirm,
  Select,
  Space,
  Tag,
  Typography,
  message,
  Row,
  Col,
  Divider,
  Tooltip,
  Badge
} from "antd";
import { 
  FileSearchOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  FileTextOutlined
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchKycDocuments,
  updateKycDocument,
} from "../../../redux/feature/kycdocument/documentthunx";

const { Title, Text } = Typography;

const parseCommaSeparatedNames = (value) =>
  [...new Set(String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean))];

function DocumentNameMaster() {
  const dispatch = useDispatch();
  const { documents, loading } = useSelector((state) => state.kycdoc);
  const [selectedTypeId, setSelectedTypeId] = useState("");
  const [bulkNames, setBulkNames] = useState("");
  const [editingName, setEditingName] = useState(null);
  const [newEditingName, setNewEditingName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchKycDocuments());
  }, [dispatch]);

  const selectedType = useMemo(
    () => documents.find((doc) => doc._id === selectedTypeId),
    [documents, selectedTypeId]
  );

  const updateNames = async (nextNames, successMessage) => {
    if (!selectedTypeId) {
      message.warning("Please select document type first");
      return;
    }
    setSaving(true);
    try {
      await dispatch(
        updateKycDocument({
          id: selectedTypeId,
          updatedData: { documentNames: [...new Set(nextNames)] },
        })
      ).unwrap();
      message.success(successMessage);
      await dispatch(fetchKycDocuments());
    } catch (error) {
      message.error(error || "Failed to update document names");
    } finally {
      setSaving(false);
    }
  };

  const handleAddBulkNames = async () => {
    const incomingNames = parseCommaSeparatedNames(bulkNames);
    if (!incomingNames.length) {
      message.warning("Enter at least one document name");
      return;
    }
    const existing = selectedType?.documentNames || [];
    await updateNames([...existing, ...incomingNames], "Document names added successfully");
    setBulkNames("");
  };

  const handleDeleteName = async (name) => {
    const existing = selectedType?.documentNames || [];
    await updateNames(
      existing.filter((item) => item !== name),
      "Document name removed"
    );
    if (editingName === name) {
      setEditingName(null);
      setNewEditingName("");
    }
  };

  const handleStartEdit = (name) => {
    setEditingName(name);
    setNewEditingName(name);
  };

  const handleRenameName = async () => {
    const nextName = newEditingName.trim();
    if (!editingName || !nextName) {
      message.warning("Enter a valid name");
      return;
    }
    const existing = selectedType?.documentNames || [];
    const updated = existing.map((item) => (item === editingName ? nextName : item));
    await updateNames(updated, "Document name updated");
    setEditingName(null);
    setNewEditingName("");
  };

  return (
    <div style={{ padding: "24px", minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card bordered={false} className="shadow-sm border-radius-8">
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <FileSearchOutlined style={{ fontSize: "32px", color: "#1890ff" }} />
              <div>
                <Title level={3} style={{ margin: 0 }}>Document Name Master</Title>
                <Text type="secondary">Map specific document names to their respective categories</Text>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Space direction="vertical" size={24} style={{ width: "100%" }}>
            <Card title="Configuration" bordered={false} className="shadow-sm border-radius-8">
              <Form layout="vertical">
                <Form.Item 
                  label={<Text strong>Select Document Type</Text>} 
                  required
                  extra="Choose the category you want to manage"
                >
                  <Select
                    showSearch
                    size="large"
                    placeholder="Search & Select Type"
                    value={selectedTypeId || undefined}
                    onChange={(val) => {
                      setSelectedTypeId(val);
                      setEditingName(null);
                      setNewEditingName("");
                    }}
                    options={documents.map((doc) => ({ label: doc.name, value: doc._id }))}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Form>

              {selectedTypeId && (
                <>
                  <Divider style={{ margin: "16px 0" }} />
                  <div style={{ marginBottom: "20px" }}>
                    <Text strong style={{ display: "block", marginBottom: "8px" }}>Add New Document Names</Text>
                    <Space.Compact style={{ width: "100%" }}>
                      <Input
                        size="large"
                        value={bulkNames}
                        onChange={(e) => setBulkNames(e.target.value)}
                        placeholder="e.g. Aadhar Card, PAN Card"
                        onPressEnter={handleAddBulkNames}
                      />
                      <Button 
                        type="primary" 
                        size="large" 
                        onClick={handleAddBulkNames} 
                        loading={saving}
                        icon={<PlusOutlined />}
                      >
                        Add
                      </Button>
                    </Space.Compact>
                    <Text type="secondary" style={{ fontSize: "12px", marginTop: "4px", display: "block" }}>
                      <InfoCircleOutlined /> Separate multiple names with commas ( , )
                    </Text>
                  </div>
                </>
              )}
            </Card>

            {editingName && (
              <Card 
                title={<Space><EditOutlined /> Rename Entry</Space>} 
                bordered={false} 
                className="shadow-sm border-radius-8 border-primary"
                style={{ borderLeft: "4px solid #1890ff" }}
              >
                <Text type="secondary" style={{ display: "block", marginBottom: "12px" }}>
                  Editing: <Tag color="blue">{editingName}</Tag>
                </Text>
                <Space.Compact style={{ width: "100%" }}>
                  <Input
                    size="large"
                    value={newEditingName}
                    onChange={(e) => setNewEditingName(e.target.value)}
                    placeholder="Enter new name"
                  />
                  <Button 
                    type="primary" 
                    size="large" 
                    onClick={handleRenameName} 
                    loading={saving}
                  >
                    Save
                  </Button>
                  <Button size="large" onClick={() => setEditingName(null)}>Cancel</Button>
                </Space.Compact>
              </Card>
            )}
          </Space>
        </Col>

        <Col xs={24} lg={14}>
          <Card 
            title={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <Space>
                  <FileTextOutlined />
                  <span>Mapped Document Names</span>
                </Space>
                {selectedType && <Badge count={selectedType.documentNames?.length || 0} color="#52c41a" />}
              </div>
            }
            bordered={false} 
            className="shadow-sm border-radius-8"
            bodyStyle={{ minHeight: "400px" }}
          >
            {!selectedTypeId ? (
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
                description="Select a document type to view and manage names" 
                style={{ marginTop: "80px" }}
              />
            ) : (selectedType?.documentNames || []).length === 0 ? (
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
                description="No document names mapped to this type yet" 
                style={{ marginTop: "80px" }}
              />
            ) : (
              <List
                loading={loading || saving}
                dataSource={selectedType?.documentNames || []}
                renderItem={(name) => (
                  <List.Item
                    className="hover-item"
                    actions={[
                      <Tooltip title="Rename" key="rename">
                        <Button 
                          type="text" 
                          icon={<EditOutlined />} 
                          onClick={() => handleStartEdit(name)}
                          style={{ color: "#1890ff" }}
                        />
                      </Tooltip>,
                      <Popconfirm
                        key="delete"
                        title="Remove Mapping"
                        description={`Are you sure you want to remove "${name}"?`}
                        onConfirm={() => handleDeleteName(name)}
                        okText="Remove"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                      >
                        <Tooltip title="Remove">
                          <Button 
                            type="text" 
                            icon={<DeleteOutlined />} 
                            danger
                          />
                        </Tooltip>
                      </Popconfirm>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<CheckCircleOutlined style={{ color: "#52c41a", marginTop: "4px" }} />}
                      title={<Text strong>{name}</Text>}
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>

      <style>{`
        .border-radius-8 { border-radius: 8px; overflow: hidden; }
        .shadow-sm {
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
        }
        .hover-item:hover {
          background-color: #fafafa;
          transition: background-color 0.3s;
        }
        .border-primary { border: 1px solid #e6f7ff; }
      `}</style>
    </div>
  );
}

export default DocumentNameMaster;

