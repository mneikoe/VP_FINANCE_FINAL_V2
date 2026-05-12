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
  Tabs,
  Typography,
  Space,
  Badge,
  Tooltip,
  Avatar,
  Empty,
  Spin,
  Input,
  Select,
  Divider,
  Progress,
  Checkbox,
  List,
  ConfigProvider,
  Alert
} from "antd";
import {
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  FileTextOutlined,
  FilterOutlined,
  ExclamationCircleOutlined,
  FlagOutlined,
  CheckOutlined,
  UnorderedListOutlined,
  LineChartOutlined,
  HistoryOutlined,
  UserOutlined,
  ShareAltOutlined,
  SyncOutlined,
  TeamOutlined,
  IdcardOutlined,
  ShopOutlined,
  ThunderboltOutlined,
  SearchOutlined
} from "@ant-design/icons";
import axios from "../../../config/axios";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const TaskSummary = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completionRemarks, setCompletionRemarks] = useState("");
  const [completingTask, setCompletingTask] = useState(false);
  const [selectedCompletionClients, setSelectedCompletionClients] = useState([]);
  const [selectedCompletionProspects, setSelectedCompletionProspects] = useState([]);
  
  // Forward to OE states
  const [forwardToOE, setForwardToOE] = useState(false);
  const [selectedOEId, setSelectedOEId] = useState("");
  const [forwardRemark, setForwardRemark] = useState("");
  const [oeList, setOeList] = useState([]);
  const [loadingOE, setLoadingOE] = useState(false);

  // Standalone Forward-to-OE Modal
  const [showForwardOEModal, setShowForwardOEModal] = useState(false);
  const [forwardOESelectedOE, setForwardOESelectedOE] = useState("");
  const [forwardOERemark, setForwardOERemark] = useState("");
  const [forwardOEStatus, setForwardOEStatus] = useState("keep");
  const [forwardOESubmitting, setForwardOESubmitting] = useState(false);

  const [activeTaskTab, setActiveTaskTab] = useState("assigned");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchText, setSearchText] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const employeeId = user?.id || user?._id;
  const employeeName = user?.username || "Employee";

  // Priority configuration
  const priorityConfig = {
    urgent: { color: "#ef4444", text: "URGENT", icon: <FlagOutlined /> },
    high: { color: "#f59e0b", text: "HIGH", icon: <FlagOutlined /> },
    medium: { color: "#3b82f6", text: "MEDIUM", icon: <FlagOutlined /> },
    low: { color: "#64748b", text: "LOW", icon: <FlagOutlined /> },
  };

  const statusConfig = {
    pending: { color: "default", text: "PENDING" },
    "in-progress": { color: "processing", text: "IN PROGRESS" },
    completed: { color: "success", text: "COMPLETED" },
    overdue: { color: "error", text: "OVERDUE" },
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/Task/assigned/${employeeId}`);
      if (response.data?.success) {
        const enhancedTasks = (response.data.data?.tasks || []).map(task => ({
          ...task,
          _id: task.id || task._id,
          name: task.name || task.parentTask?.name || "Unnamed Task",
          priority: task.assignmentDetails?.priority || task.priority || "medium",
          dueDate: task.assignmentDetails?.dueDate || task.dueDate,
          status: task.status || task.assignmentDetails?.status || "pending",
          taskMode: task.taskMode || task.parentTask?.taskMode || "assigned",
          assignedClients: task.assignmentDetails?.assignedClients || [],
          assignedProspects: task.assignmentDetails?.assignedProspects || [],
        }));
        setTasks(enhancedTasks);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (employeeId) fetchTasks(); }, [employeeId]);

  const fetchOEList = async () => {
    setLoadingOE(true);
    try {
      const response = await axios.get("/api/employee/getAllEmployees", { params: { role: "OE" } });
      if (response.data?.success) {
        setOeList((response.data.data || []).filter(e => !e.dateOfTermination));
      }
    } finally { setLoadingOE(false); }
  };

  const handleCompleteTask = async () => {
    if (!completionRemarks.trim()) { toast.warning("Remarks required"); return; }
    setCompletingTask(true);
    try {
      const payload = {
        status: "completed",
        remarks: completionRemarks,
        employeeId,
        employeeName,
        completedForClients: selectedTask.taskMode === "default" ? selectedCompletionClients : [],
        completedForProspects: selectedTask.taskMode === "default" ? selectedCompletionProspects : [],
      };
      const res = await axios.put(`/api/Task/${selectedTask._id}/status`, payload);
      if (res.data?.success) {
        toast.success("Task Finalized");
        setShowCompleteModal(false);
        fetchTasks();
      }
    } finally { setCompletingTask(false); }
  };

  const handleForwardToOE = async () => {
    if (!forwardOESelectedOE) { toast.warning("Select recipient"); return; }
    setForwardOESubmitting(true);
    try {
      const res = await axios.post("/api/Task/rm-forward-to-oe", {
        taskId: selectedTask._id,
        oeId: forwardOESelectedOE,
        remark: forwardOERemark,
        status: forwardOEStatus,
        rmId: employeeId,
      });
      if (res.data?.success) {
        toast.success("Dispatched to OE");
        setShowForwardOEModal(false);
        fetchTasks();
      }
    } finally { setForwardOESubmitting(false); }
  };

  const displayTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchTab = activeTaskTab === "default" ? t.taskMode === "default" : t.taskMode !== "default";
      const matchStatus = filterStatus === "all" || t.status === filterStatus;
      const matchPriority = filterPriority === "all" || t.priority === filterPriority;
      const matchSearch = !searchText || t.name.toLowerCase().includes(searchText.toLowerCase());
      return matchTab && matchStatus && matchPriority && matchSearch;
    });
  }, [tasks, activeTaskTab, filterStatus, filterPriority, searchText]);

  const stats = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter(t => t.status === "pending").length,
    inProgress: tasks.filter(t => t.status === "in-progress").length,
    completed: tasks.filter(t => t.status === "completed").length,
  }), [tasks]);

  const columns = [
    {
      title: "Objective",
      key: "name",
      width: 300,
      render: (_, t) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ color: '#1e293b' }}>{t.name}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>Category: {t.type || 'Standard'}</Text>
          {t.taskMode === 'default' && <Tag color="blue" style={{ marginTop: 4 }}>Monthly Recurring</Tag>}
        </Space>
      )
    },
    {
      title: "Priority",
      dataIndex: "priority",
      width: 120,
      render: (p) => {
        const cfg = priorityConfig[p] || priorityConfig.medium;
        return <Tag icon={cfg.icon} color={cfg.color} style={{ borderRadius: '6px', fontWeight: 600 }}>{cfg.text}</Tag>;
      }
    },
    {
      title: "Timeline",
      dataIndex: "dueDate",
      width: 160,
      render: (d, t) => t.taskMode === 'default' ? <Text type="secondary">Recurring</Text> : <Text strong>{d ? format(parseISO(d), "dd MMM yyyy") : "N/A"}</Text>
    },
    {
      title: "Engagement",
      key: "entities",
      width: 150,
      render: (_, t) => (
        <Space size={4}>
          <Tooltip title="Assigned Clients"><Badge count={t.assignedClients?.length || 0} style={{ backgroundColor: '#4f46e5' }} overflowCount={99} /></Tooltip>
          <Text type="secondary">/</Text>
          <Tooltip title="Assigned Prospects"><Badge count={t.assignedProspects?.length || 0} style={{ backgroundColor: '#f59e0b' }} overflowCount={99} /></Tooltip>
        </Space>
      )
    },
    {
      title: "Current Status",
      dataIndex: "status",
      width: 140,
      render: (s) => <Tag color={statusConfig[s]?.color}>{statusConfig[s]?.text}</Tag>
    },
    {
      title: "Actions",
      fixed: 'right',
      width: 260,
      render: (_, t) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} onClick={() => navigate(`/rm/task/${t._id}`)}>View</Button>
          <Button size="small" type="primary" icon={<CheckCircleOutlined />} disabled={t.status === 'completed'} onClick={() => { setSelectedTask(t); setShowCompleteModal(true); }}>Finalize</Button>
          {t.taskMode !== 'default' && (
            <Button size="small" ghost type="primary" icon={<ShareAltOutlined />} onClick={() => { setSelectedTask(t); fetchOEList(); setShowForwardOEModal(true); }}>OE Dispatch</Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#4f46e5', borderRadius: 12 } }}>
      <div style={{ padding: '0 0 40px 0' }}>
        {/* Statistics Row */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} style={{ background: '#f8fafc', borderRadius: 16 }}>
              <Statistic title="Active Portfolio Tasks" value={stats.total} prefix={<ThunderboltOutlined style={{ color: '#4f46e5' }} />} />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} style={{ background: '#f8fafc', borderRadius: 16 }}>
              <Statistic title="Execution Pending" value={stats.pending} valueStyle={{ color: '#64748b' }} />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} style={{ background: '#f8fafc', borderRadius: 16 }}>
              <Statistic title="In Strategic Motion" value={stats.inProgress} valueStyle={{ color: '#3b82f6' }} />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} style={{ background: '#f8fafc', borderRadius: 16 }}>
              <Statistic title="Successful Outcomes" value={stats.completed} valueStyle={{ color: '#10b981' }} />
            </Card>
          </Col>
        </Row>

        {/* Filter Bar */}
        <Card bordered={false} style={{ marginBottom: 24, borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={8}>
              <Input prefix={<SearchOutlined />} placeholder="Search strategy by name..." value={searchText} onChange={e => setSearchText(e.target.value)} size="large" allowClear />
            </Col>
            <Col xs={24} md={5}>
              <Select value={filterStatus} onChange={setFilterStatus} style={{ width: '100%' }} size="large">
                <Option value="all">All Lifecycles</Option>
                <Option value="pending">Pending</Option>
                <Option value="in-progress">In-Progress</Option>
                <Option value="completed">Completed</Option>
              </Select>
            </Col>
            <Col xs={24} md={5}>
              <Select value={filterPriority} onChange={setFilterPriority} style={{ width: '100%' }} size="large">
                <Option value="all">All Priorities</Option>
                <Option value="urgent">Urgent</Option>
                <Option value="high">High</Option>
                <Option value="medium">Medium</Option>
              </Select>
            </Col>
            <Col xs={24} md={6}>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button size="large" icon={<SyncOutlined />} onClick={fetchTasks} loading={loading}>Sync</Button>
                <Button size="large" type="primary" onClick={() => navigate('/rm/dashboard')}>Dashboard</Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Main Workspace */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card 
            bordered={false} 
            style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}
            styles={{ body: { padding: 0 } }}
          >
            <Tabs 
              activeKey={activeTaskTab} 
              onChange={setActiveTaskTab} 
              type="line"
              style={{ padding: '0 24px' }}
              items={[
                { key: 'assigned', label: <Space><ThunderboltOutlined /><span>Assigned Tasks</span></Space> },
                { key: 'default', label: <Space><SyncOutlined /><span>Default Tasks</span></Space> }
              ]}
            />
            <Table 
              columns={columns} 
              dataSource={displayTasks} 
              rowKey="_id" 
              loading={loading}
              scroll={{ x: 1300 }}
              pagination={{ pageSize: 10, style: { padding: '16px 24px' } }}
            />
          </Card>
        </motion.div>

        {/* Modal: Complete Task */}
        <Modal
          title={<Title level={4} style={{ margin: 0 }}>Complete Task</Title>}
          open={showCompleteModal}
          onCancel={() => setShowCompleteModal(false)}
          footer={[
            <Button key="cancel" onClick={() => setShowCompleteModal(false)}>Hold On</Button>,
            <Button key="submit" type="primary" loading={completingTask} onClick={handleCompleteTask}>Finalize Objective</Button>
          ]}
          width={700}
        >
          <div style={{ padding: '12px 0' }}>
            <Text type="secondary">Task: </Text><Text strong>{selectedTask?.name}</Text>
            <Divider />
            <Form layout="vertical">
              <Form.Item label="Execution Remarks" required>
                <TextArea rows={4} value={completionRemarks} onChange={e => setCompletionRemarks(e.target.value)} placeholder="Detail the outcomes and next steps..." />
              </Form.Item>
              {selectedTask?.taskMode === 'default' && (
                <Alert message="Note: This is a recurring monthly duty." type="info" showIcon style={{ marginBottom: 16 }} />
              )}
            </Form>
          </div>
        </Modal>

        {/* Modal: Dispatch to OE */}
        <Modal
          title={<Title level={4} style={{ margin: 0 }}>Forward to OE</Title>}
          open={showForwardOEModal}
          onCancel={() => setShowForwardOEModal(false)}
          footer={[
            <Button key="cancel" onClick={() => setShowForwardOEModal(false)}>Abort</Button>,
            <Button key="submit" type="primary" loading={forwardOESubmitting} onClick={handleForwardToOE}>Dispatch Assignment</Button>
          ]}
          width={600}
        >
          <div style={{ padding: '12px 0' }}>
            <Form layout="vertical">
              <Form.Item label="Target Operational Executive (OE)" required>
                <Select placeholder="Select eligible OE..." loading={loadingOE} value={forwardOESelectedOE} onChange={setForwardOESelectedOE}>
                  {oeList.map(oe => <Option key={oe._id} value={oe._id}>{oe.name} ({oe.employeeCode})</Option>)}
                </Select>
              </Form.Item>
              <Form.Item label="Strategic Dispatch Instructions">
                <TextArea rows={3} value={forwardOERemark} onChange={e => setForwardOERemark(e.target.value)} placeholder="Guidelines for the OE..." />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default TaskSummary;
