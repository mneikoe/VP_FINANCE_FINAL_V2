import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Statistic,
  Space,
  Typography,
  Badge,
  Tooltip,
  Avatar,
  Empty,
  Spin,
  Alert,
  Input,
  Select,
  Divider,
  List,
  ConfigProvider
} from "antd";
import {
  SyncOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  IdcardOutlined,
  EyeOutlined,
  TeamOutlined,
  ShareAltOutlined,
  HistoryOutlined,
  ArrowRightOutlined,
  FlagOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  ThunderboltOutlined,
  SolutionOutlined,
  BuildOutlined
} from "@ant-design/icons";
import axios from "../../config/axios";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const OETaskSummary = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); }
    catch { return {}; }
  });
  const oeId = user?.id;

  // Detail Modal
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Forward to RM Modal
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [forwardTask, setForwardTask] = useState(null);
  const [forwardRemark, setForwardRemark] = useState("");
  const [forwardStatus, setForwardStatus] = useState("in-progress");
  const [forwardRmId, setForwardRmId] = useState("");
  const [rmList, setRmList] = useState([]);
  const [loadingRMs, setLoadingRMs] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const statusConfig = {
    assigned: { color: "default", text: "Assigned", icon: <ClockCircleOutlined /> },
    "in-progress": { color: "processing", text: "In Progress", icon: <SyncOutlined spin /> },
    completed: { color: "success", text: "Completed", icon: <CheckCircleOutlined /> },
    overdue: { color: "error", text: "Overdue", icon: <FlagOutlined /> },
    pending: { color: "warning", text: "Pending", icon: <ClockCircleOutlined /> },
  };

  const priorityConfig = {
    urgent: { color: "error", text: "Urgent" },
    high: { color: "warning", text: "High" },
    medium: { color: "blue", text: "Medium" },
    low: { color: "default", text: "Low" },
  };

  // ─── Fetch tasks ───────────────────────────────────────────
  const fetchTasks = async () => {
    const id = oeId || JSON.parse(localStorage.getItem("user") || "{}")?.id;
    if (!id) { setTasks([]); setLoading(false); return; }
    setLoading(true);
    try {
      const res = await axios.get("/api/OE/assigned-tasks", { params: { oeId: id } });
      setTasks(res.data?.success && Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) { 
      setTasks([]); 
      toast.error("Failed to synchronize tasks.");
    } finally { 
      setLoading(false); 
    }
  };

  // ─── Fetch RM list ─────────────────────────────────────────
  const fetchRMList = async () => {
    if (rmList.length > 0) return;
    setLoadingRMs(true);
    try {
      const res = await axios.get("/api/OE/rm-list");
      setRmList(res.data?.data || []);
    } catch (err) { 
      setRmList([]); 
    } finally { 
      setLoadingRMs(false); 
    }
  };

  useEffect(() => { fetchTasks(); }, [oeId]);

  // ─── Helpers ───────────────────────────────────────────────
  const fmt = (d) => {
    if (!d) return "—";
    try { return format(d instanceof Date ? d : parseISO(d), "dd MMM yyyy"); }
    catch { return "—"; }
  };

  const isForwardedByRM = (t) => t?.forwardedFromRM && (t.forwardedFromRM.forwardedAt || t.forwardedFromRM.remark);
  const isForwardedByOE = (t) => t?.oeForwardedToRM && t.oeForwardedToRM.forwardedAt;

  // ─── Open Detail Modal ─────────────────────────────────────
  const openDetail = (task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  // ─── Open Forward Modal ────────────────────────────────────
  const openForward = (task) => {
    setForwardTask(task);
    setForwardStatus(task?.status === "completed" ? "completed" : "in-progress");
    setForwardRemark("");
    setForwardRmId("");
    setShowForwardModal(true);
    fetchRMList();
  };

  // ─── Submit Forward ────────────────────────────────────────
  const handleForwardToRM = async () => {
    if (!forwardTask || !oeId) return;
    if (!forwardRmId) { toast.warning("Please select an RM to forward to."); return; }
    setSubmitting(true);
    try {
      const res = await axios.put("/api/OE/forward-to-rm", {
        taskId: forwardTask._id,
        oeId,
        rmId: forwardRmId,
        status: forwardStatus,
        remark: forwardRemark,
      });
      if (res.data?.success) {
        toast.success("Task forwarded to RM successfully.");
        setShowForwardModal(false);
        fetchTasks();
      } else {
        toast.error(res.data?.message || "Failed to forward.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to forward.");
    } finally {
      setSubmitting(false);
    }
  };

  const stats = useMemo(() => ({
    total: tasks.length,
    fromRM: tasks.filter(isForwardedByRM).length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    overdue: tasks.filter((t) => t.status === "overdue").length,
  }), [tasks]);

  const columns = [
    {
      title: "Task",
      key: "task",
      width: 250,
      render: (_, t) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: '14px' }}>{t.name}</Text>
          <Space size={4}>
            {isForwardedByRM(t) && <Tag color="blue" icon={<ShareAltOutlined />} style={{ fontSize: '10px' }}>Fwd by RM</Tag>}
            {isForwardedByOE(t) && <Tag color="orange" icon={<HistoryOutlined />} style={{ fontSize: '10px' }}>Prev. Fwd RM</Tag>}
          </Space>
        </Space>
      )
    },
    {
      title: "Organisation",
      key: "organisation",
      render: (_, t) => (
        <div>
          <div style={{ fontSize: '13px' }}>{t.company || "—"}</div>
          {t.product && <Text type="secondary" style={{ fontSize: '11px' }}>{t.product}</Text>}
        </div>
      )
    },
    {
      title: "Timeline",
      dataIndex: "dueDate",
      width: 130,
      render: (d) => <Text style={{ fontSize: '13px' }}>{fmt(d)}</Text>
    },
    {
      title: "Priority",
      dataIndex: "priority",
      width: 110,
      render: (p) => {
        const cfg = priorityConfig[p] || priorityConfig.medium;
        return <Tag color={cfg.color} style={{ borderRadius: '6px', fontWeight: 600 }}>{cfg.text.toUpperCase()}</Tag>;
      }
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 130,
      render: (s) => {
        const cfg = statusConfig[s] || statusConfig.assigned;
        return <Tag color={cfg.color} icon={cfg.icon} style={{ borderRadius: '6px' }}>{cfg.text.toUpperCase()}</Tag>;
      }
    },
    {
      title: "Network",
      key: "entities",
      width: 140,
      render: (_, t) => (
        <Space size={8}>
          <Tooltip title="Clients"><Badge count={t.assignedClients?.length || 0} style={{ backgroundColor: '#10b981' }} overflowCount={99} /></Tooltip>
          <Tooltip title="Prospects"><Badge count={t.assignedProspects?.length || 0} style={{ backgroundColor: '#0891b2' }} overflowCount={99} /></Tooltip>
        </Space>
      )
    },
    {
      title: "Actions",
      key: "actions",
      fixed: 'right',
      width: 180,
      render: (_, t) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} onClick={() => openDetail(t)}>View</Button>
          <Button size="small" type="primary" icon={<ShareAltOutlined />} onClick={() => openForward(t)}>Fwd RM</Button>
        </Space>
      )
    }
  ];

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#0891b2', borderRadius: 12 } }}>
      <div style={{ paddingBottom: '40px' }}>
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <Title level={3} style={{ margin: 0 }}>Task Summary (OE)</Title>
            <Text type="secondary">Monitor and forward operational assignments</Text>
          </div>
          <Button icon={<SyncOutlined />} onClick={fetchTasks} loading={loading} size="large">Sync</Button>
        </div>

        {/* Stats Row */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={12} md={6}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card bordered={false} style={{ background: '#ecfeff', borderRadius: 16 }}>
                  <Statistic title="Total Tasks" value={stats.total} prefix={<ThunderboltOutlined style={{ color: '#0891b2' }} />} />
                </Card>
              </Col>
              <Col span={12}>
                <Card bordered={false} style={{ background: '#f0f9ff', borderRadius: 16 }}>
                  <Statistic title="From RM" value={stats.fromRM} prefix={<ShareAltOutlined style={{ color: '#0369a1' }} />} />
                </Card>
              </Col>
            </Row>
          </Col>
          <Col xs={12} md={6}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card bordered={false} style={{ background: '#fffbeb', borderRadius: 16 }}>
                  <Statistic title="In Progress" value={stats.inProgress} prefix={<ClockCircleOutlined style={{ color: '#d97706' }} />} />
                </Card>
              </Col>
              <Col span={12}>
                <Card bordered={false} style={{ background: '#fef2f2', borderRadius: 16 }}>
                  <Statistic title="Overdue" value={stats.overdue} prefix={<FlagOutlined style={{ color: '#dc2626' }} />} />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Table Container */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card 
            bordered={false} 
            style={{ borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', overflow: 'hidden' }}
            styles={{ body: { padding: 0 } }}
          >
            <Table 
              columns={columns} 
              dataSource={tasks} 
              rowKey="_id" 
              loading={loading}
              scroll={{ x: 1200 }}
              pagination={{ pageSize: 10, style: { padding: '16px 24px' } }}
              locale={{ emptyText: <Empty description="No operational tasks registered" /> }}
            />
          </Card>
        </motion.div>

        {/* ─── Detail Modal ──────────────────────────────────────── */}
        <Modal
          title={<Title level={4} style={{ margin: 0 }}>Assignment Details</Title>}
          open={showDetailModal}
          onCancel={() => setShowDetailModal(false)}
          width={900}
          footer={[
            <Button key="close" onClick={() => setShowDetailModal(false)}>Close</Button>,
            <Button key="fwd" type="primary" icon={<ShareAltOutlined />} onClick={() => { setShowDetailModal(false); openForward(selectedTask); }}>Forward to RM</Button>
          ]}
        >
          {selectedTask && (
            <div style={{ padding: '12px 0' }}>
              {/* Forwarding Chain */}
              <div style={{ marginBottom: 20 }}>
                {isForwardedByRM(selectedTask) && (
                  <Alert 
                    message="Forwarded by RM" 
                    description={
                      <div>
                        <Text strong>{selectedTask.forwardedFromRM?.forwardedBy?.name || "RM User"}</Text> 
                        <Text type="secondary"> on {fmt(selectedTask.forwardedFromRM?.forwardedAt)}</Text>
                        {selectedTask.forwardedFromRM?.remark && <div style={{ marginTop: 4, fontStyle: 'italic' }}>"{selectedTask.forwardedFromRM.remark}"</div>}
                      </div>
                    }
                    type="info" showIcon icon={<ShareAltOutlined />} style={{ marginBottom: 12 }}
                  />
                )}
                {isForwardedByOE(selectedTask) && (
                  <Alert 
                    message="Previously forwarded to RM" 
                    description={
                      <div>
                        <Text type="secondary">Processed on {fmt(selectedTask.oeForwardedToRM?.forwardedAt)}</Text>
                        {selectedTask.oeForwardedToRM?.remark && <div style={{ marginTop: 4, fontStyle: 'italic' }}>"{selectedTask.oeForwardedToRM.remark}"</div>}
                      </div>
                    }
                    type="warning" showIcon icon={<HistoryOutlined />}
                  />
                )}
              </div>

              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <Card size="small" title="Core Information" style={{ borderRadius: 12 }}>
                    <List size="small">
                      <List.Item><Text type="secondary">Company</Text> <Text strong>{selectedTask.company || "—"}</Text></List.Item>
                      <List.Item><Text type="secondary">Product</Text> <Text strong>{selectedTask.product || "—"}</Text></List.Item>
                      <List.Item><Text type="secondary">Due Date</Text> <Tag color="blue">{fmt(selectedTask.dueDate)}</Tag></List.Item>
                      <List.Item><Text type="secondary">Priority</Text> <Tag color={priorityConfig[selectedTask.priority]?.color}>{selectedTask.priority?.toUpperCase()}</Tag></List.Item>
                      <List.Item><Text type="secondary">Status</Text> <Tag color={statusConfig[selectedTask.status]?.color}>{selectedTask.status?.toUpperCase()}</Tag></List.Item>
                    </List>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card size="small" title="Execution Details" style={{ borderRadius: 12 }}>
                    <List size="small">
                      <List.Item><Text type="secondary">Assigned At</Text> <Text strong>{fmt(selectedTask.assignedAt)}</Text></List.Item>
                      <List.Item><Text type="secondary">Est. Days</Text> <Badge count={selectedTask.estimatedDays} style={{ backgroundColor: '#0891b2' }} /></List.Item>
                      <List.Item><Text type="secondary">OE Type</Text> <Tag>{selectedTask.oeType || "General"}</Tag></List.Item>
                      <List.Item>
                        <div>
                          <Text type="secondary">Initial Remarks</Text>
                          <div style={{ fontSize: '12px', marginTop: 4 }}>{selectedTask.remarks || "No remarks provided"}</div>
                        </div>
                      </List.Item>
                    </List>
                  </Card>
                </Col>
              </Row>

              <Divider orientation="left">Network Engagement</Divider>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Card size="small" title={<Space><SolutionOutlined /><span>Clients ({selectedTask.assignedClients?.length || 0})</span></Space>} style={{ borderRadius: 12 }} styles={{ body: { padding: 0 } }}>
                    <List
                      dataSource={selectedTask.assignedClients}
                      renderItem={c => (
                        <List.Item style={{ padding: '8px 16px' }}>
                          <Space>
                            <Avatar size="small" style={{ backgroundColor: '#10b981' }}>C</Avatar>
                            <div>
                              <Text strong style={{ fontSize: '12px' }}>{c.personalDetails?.groupName || c.groupName}</Text>
                              <div style={{ fontSize: '10px', color: '#64748b' }}>{c.personalDetails?.mobileNo || c.mobileNo}</div>
                            </div>
                          </Space>
                        </List.Item>
                      )}
                      locale={{ emptyText: <Text type="secondary" style={{ padding: 12, display: 'block' }}>No clients linked</Text> }}
                    />
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card size="small" title={<Space><TeamOutlined /><span>Prospects ({selectedTask.assignedProspects?.length || 0})</span></Space>} style={{ borderRadius: 12 }} styles={{ body: { padding: 0 } }}>
                    <List
                      dataSource={selectedTask.assignedProspects}
                      renderItem={p => (
                        <List.Item style={{ padding: '8px 16px' }}>
                          <Space>
                            <Avatar size="small" style={{ backgroundColor: '#0891b2' }}>P</Avatar>
                            <div>
                              <Text strong style={{ fontSize: '12px' }}>{p.personalDetails?.groupName || p.groupName}</Text>
                              <div style={{ fontSize: '10px', color: '#64748b' }}>{p.personalDetails?.mobileNo || p.mobileNo}</div>
                            </div>
                          </Space>
                        </List.Item>
                      )}
                      locale={{ emptyText: <Text type="secondary" style={{ padding: 12, display: 'block' }}>No prospects linked</Text> }}
                    />
                  </Card>
                </Col>
              </Row>

              {selectedTask.checklists?.length > 0 && (
                <>
                  <Divider orientation="left">Compliance Checklist</Divider>
                  <Card size="small" style={{ borderRadius: 12, background: '#f8fafc' }}>
                    <List
                      dataSource={selectedTask.checklists}
                      renderItem={item => <List.Item style={{ fontSize: '12px' }}><Space><CheckCircleOutlined style={{ color: '#10b981' }} />{item}</Space></List.Item>}
                    />
                  </Card>
                </>
              )}
            </div>
          )}
        </Modal>

        {/* ─── Forward to RM Modal ───────────────────────────────── */}
        <Modal
          title={<Title level={4} style={{ margin: 0, color: '#0891b2' }}>Forward Task to RM</Title>}
          open={showForwardModal}
          onCancel={() => setShowForwardModal(false)}
          onOk={handleForwardToRM}
          confirmLoading={submitting}
          okText="Dispatch Assignment"
          width={700}
        >
          {forwardTask && (
            <div style={{ padding: '12px 0' }}>
              <Card size="small" style={{ background: '#f0f9ff', border: '1px solid #bae6fd', marginBottom: 20, borderRadius: 12 }}>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Text strong style={{ fontSize: '16px' }}>{forwardTask.name}</Text>
                    <div><Text type="secondary">{forwardTask.company} • </Text><Tag color={priorityConfig[forwardTask.priority]?.color}>{forwardTask.priority?.toUpperCase()}</Tag></div>
                  </Col>
                  {forwardTask.dueDate && <Col><Tag icon={<CalendarOutlined />} color="warning">Due: {fmt(forwardTask.dueDate)}</Tag></Col>}
                </Row>
              </Card>

              {isForwardedByRM(forwardTask) && (
                <Alert 
                  message="Forwarding Chain Notice"
                  description={`This task was originally received from ${forwardTask.forwardedFromRM?.forwardedBy?.name || "RM"}. Forwarding it back will return it to the RM registry.`}
                  type="info" showIcon style={{ marginBottom: 20 }}
                />
              )}

              <Form layout="vertical">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Target Relationship Manager (RM)" required>
                      <Select 
                        placeholder="Select RM..." 
                        loading={loadingRMs} 
                        value={forwardRmId} 
                        onChange={setForwardRmId}
                        size="large"
                      >
                        {rmList.map(rm => (
                          <Option key={rm.id || rm._id} value={rm.id || rm._id}>
                            {rm.name} {rm.employeeCode ? `[${rm.employeeCode}]` : ""}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Completion Status" required>
                      <Select value={forwardStatus} onChange={setForwardStatus} size="large">
                        <Option value="in-progress">In Progress</Option>
                        <Option value="pending">Pending</Option>
                        <Option value="completed">Completed</Option>
                        <Option value="assigned">Assigned</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label="Execution Remarks / Notes">
                  <TextArea rows={4} value={forwardRemark} onChange={e => setForwardRemark(e.target.value)} placeholder="Detail your findings, updates or notes for the RM..." />
                </Form.Item>
              </Form>

              <Alert 
                icon={<InfoCircleOutlined />}
                message={<Text strong style={{ fontSize: '12px' }}>Network Persistence</Text>}
                description="The full network of clients and prospects associated with this task will be preserved during dispatch."
                type="info" showIcon
              />
            </div>
          )}
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default OETaskSummary;
