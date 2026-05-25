

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../../config/axios";
import { Form, Row, Col, Button } from "react-bootstrap";
import {
  addFuturePrioritiesAndNeeds,
  updateFuturePrioritiesAndNeeds,
  getClientById,
} from "../../../redux/feature/ClientRedux/ClientThunx";
import { toast } from "react-toastify";

const FUTURE_PRIORITY_OPTIONS = [
  ["Life Insurance", "Health Insurance", "Retirement Fund", "Wealth Creation"],
  ["Child Higher Education", "Child Professional Education", "Child Marriage", "Property Investment"],
  ["Purchase House", "Purchase Car", "Business Fund Creation", "Business Expansion"],
];

const initialFuturePriorityForm = {
  _id: null,
  priorityName: "",
  submissionDate: "",
  members: [],
  approxAmount: "",
  individualOrFamily: "",
  policyType: "",
  companyName: "",
  termPpt: "",
  maturityDate: "",
  remark: "",
  documents: [],
  customFields: [],
};

const initialNeeds = {
  createdDate: new Date().toISOString(),
  financialCalculation: false,
  assesmentOfNeed: false,
  portfolioManagement: false,
  doorStepServices: false,
  purchaseNewProducts: false,
  anyCorrection: "",
  anyUpdation: "",
};

const FuturePrioritiesForm = ({ clientId }) => {
  const dispatch = useDispatch();
  const { client, loading, error } = useSelector((state) => state.client || {});

  const [openPriorities, setOpenPriorities] = useState([]);
  const [futurePriorityForms, setFuturePriorityForms] = useState({});
  const [savedFuturePriorityForms, setSavedFuturePriorityForms] = useState([]);
  const [needs, setNeeds] = useState(initialNeeds);
  const [priorityFiles, setPriorityFiles] = useState({});
  const [familyMembers, setFamilyMembers] = useState([]);
  const [customerName, setCustomerName] = useState("");

  const getMemberList = () => {
    if (familyMembers && familyMembers.length > 0) {
      return familyMembers;
    }
    const selfName = customerName || client?.personalDetails?.name || client?.name || "";
    return [{ _id: "self", name: selfName || "Self" }];
  };

  useEffect(() => {
    if (clientId) {
      dispatch(getClientById(clientId));
    }
      
  }, [clientId, dispatch]);




  useEffect(() => {
    const fetchClientData = async () => {
      try {
        if (!clientId) return;
        const response = await axiosInstance.get(`/api/client/${clientId}`);
        const result = response.data;
        if (result.success) {
             setFamilyMembers(result.client.familyMembers || []);
             setCustomerName(result.client.personalDetails?.name || "");
          setSavedFuturePriorityForms(result.client.futurePriorities || []);
          // Prepopulate forms with existing financial info
        
        } else {
          toast.error(result.message || "Failed to load client data.");
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
        toast.error(error.response?.data?.message || "Error loading client data. Check your network.");
      }
    };

    fetchClientData();
  }, [clientId]);


  useEffect(() => {
    if (client) {
      console.log("Client data:", client); // Debug
      setFamilyMembers(client.familyMembers || []);
      setCustomerName(client.personalDetails?.name || "");
      setSavedFuturePriorityForms(client.futurePriorities || []);
console.log("savedFuturePriorityForms",savedFuturePriorityForms)
  
      setNeeds({
        ...initialNeeds,
        ...client.needs,
        createdDate: client.needs?.createdDate || new Date().toISOString(),
      });
    }
  }, [client]);

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleCheckboxChange = (option) => {
    setOpenPriorities((prev) =>
      prev.includes(option) ? prev.filter((v) => v !== option) : [...prev, option]
    );

    setFuturePriorityForms((prev) => ({
      ...prev,
      [option]: prev[option] || {
        ...initialFuturePriorityForm,
        priorityName: option,
        submissionDate: getCurrentDate(),
      },
    }));
  };

  const handleFormChange = (priority, field, value) => {
    setFuturePriorityForms((prev) => ({
      ...prev,
      [priority]: {
        ...prev[priority],
        [field]:
          field === "approxAmount"
            ? parseFloat(value) || ""
            : field === "members"
            ? value
            : value,
      },
    }));
  };

  const handleAddCustomField = (priority, key, value) => {
    setFuturePriorityForms((prev) => {
      const item = prev[priority] || {
        ...initialFuturePriorityForm,
        priorityName: priority,
        submissionDate: getCurrentDate(),
      };
      const customFields = [...(item.customFields || []), { key, value }];
      return { ...prev, [priority]: { ...item, customFields } };
    });
  };

  const handleCustomFieldChange = (priority, idx, value) => {
    setFuturePriorityForms((prev) => {
      const item = prev[priority];
      const customFields = [...(item.customFields || [])];
      customFields[idx] = { ...customFields[idx], value };
      return { ...prev, [priority]: { ...item, customFields } };
    });
  };

  const handleCustomFieldKeyChange = (priority, idx, key) => {
    setFuturePriorityForms((prev) => {
      const item = prev[priority];
      const customFields = [...(item.customFields || [])];
      customFields[idx] = { ...customFields[idx], key };
      return { ...prev, [priority]: { ...item, customFields } };
    });
  };

  const handleCustomLabelChange = (priority, field, newLabel) => {
    setFuturePriorityForms((prev) => {
      const item = prev[priority] || {
        ...initialFuturePriorityForm,
        priorityName: priority,
        submissionDate: getCurrentDate(),
      };
      const customLabels = { ...(item.customLabels || {}), [field]: newLabel };
      return { ...prev, [priority]: { ...item, customLabels } };
    });
  };

  const renderLabel = (priority, field, defaultLabel) => {
    const currentLabel = futurePriorityForms[priority]?.customLabels?.[field] || defaultLabel;
    return (
      <Form.Control
        type="text"
        value={currentLabel}
        onChange={(e) => handleCustomLabelChange(priority, field, e.target.value)}
        className="mb-1 fw-bold cf-label-input"
        style={{ fontSize: '0.78rem', minHeight: '24px', padding: '0.1rem 0.3rem', border: 'none', borderBottom: '1px dashed #ced4da', background: 'transparent' }}
      />
    );
  };


  const handleRemoveCustomField = (priority, idx) => {
    setFuturePriorityForms((prev) => {
      const item = prev[priority];
      const customFields = (item.customFields || []).filter((_, i) => i !== idx);
      return { ...prev, [priority]: { ...item, customFields } };
    });
  };

  const handleFileChange = (priority, files) => {
    setPriorityFiles((prev) => ({
      ...prev,
      [priority]: files ? Array.from(files) : [],
    }));
  };

  const handleSaveForm = (priority) => {
    const formData = futurePriorityForms[priority];
    const isLifeInsurance = priority === "Life Insurance";
    if (
      !formData?.priorityName ||
      !formData?.members?.length ||
      !formData?.approxAmount ||
      (isLifeInsurance &&
        (!formData?.individualOrFamily ||
          !formData?.policyType ||
          !formData?.companyName ||
          !formData?.termPpt ||
          !formData?.maturityDate))
    ) {
      toast.error("Please complete all required fields before saving.");
      return;
    }

    setSavedFuturePriorityForms((prev) => {
      const existingIndex = prev.findIndex((item) => item._id === formData._id);
      if (existingIndex >= 0) {
        const updatedForms = [...prev];
        updatedForms[existingIndex] = {
          ...formData,
          submissionDate: formData.submissionDate || getCurrentDate(),
          documents: priorityFiles[priority] || [],
        };
        return updatedForms;
      }
      return [
        ...prev,
        {
          ...formData,
          submissionDate: formData.submissionDate || getCurrentDate(),
          documents: priorityFiles[priority] || [],
        },
      ];
    });

    setOpenPriorities((prev) => prev.filter((v) => v !== priority));
    setFuturePriorityForms((prev) => {
      const copy = { ...prev };
      delete copy[priority];
      return copy;
    });
    setPriorityFiles((prev) => {
      const copy = { ...prev };
      delete copy[priority];
      return copy;
    });

    toast.success(`${priority} saved.`);
  };

  const handleCloseForm = (priority) => {
    setOpenPriorities((prev) => prev.filter((v) => v !== priority));
    setFuturePriorityForms((prev) => {
      const copy = { ...prev };
      delete copy[priority];
      return copy;
    });
    setPriorityFiles((prev) => {
      const copy = { ...prev };
      delete copy[priority];
      return copy;
    });
  };

  const handleNeedsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNeeds((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e, isUpdate = false) => {
    e.preventDefault();

    try {
      if (!clientId) {
        toast.error("Client ID is missing.");
        return;
      }

      const payload = {
        clientId,
        futurePriorities: savedFuturePriorityForms,
        needs: { ...needs, createdDate: new Date().toISOString() },
        documents: Object.values(priorityFiles).flat(),
      };

      const action = isUpdate
        ? await dispatch(updateFuturePrioritiesAndNeeds(payload))
        : await dispatch(addFuturePrioritiesAndNeeds(payload));

      if (
        isUpdate
          ? updateFuturePrioritiesAndNeeds.fulfilled.match(action)
          : addFuturePrioritiesAndNeeds.fulfilled.match(action)
      ) {
        toast.success(action.payload.message || "Future Priorities saved successfully.");
        await dispatch(getClientById(clientId));
      } else {
        toast.error(action.payload || "Failed to save future priorities.");
      }
    } catch (error) {
      console.error("Error submitting future priorities:", error);
      toast.error("Failed to submit. Please try again.");
    }
  };

  const handleEditForm = (item) => {
    setOpenPriorities((prev) => [...prev, item.priorityName]);
    setFuturePriorityForms((prev) => ({
      ...prev,
      [item.priorityName]: { ...item },
    }));
  };

  return (
    <Form onSubmit={(e) => handleSubmit(e, false)}>
      <Row className="mb-3">
        {FUTURE_PRIORITY_OPTIONS.map((column, colIdx) => (
          <Col md={4} key={colIdx}>
            <Form.Group>
              <Form.Label>Future Priorities</Form.Label>
              {column.map((option) => (
                <Form.Check
                  key={option}
                  type="checkbox"
                  label={option}
                  value={option}
                  checked={openPriorities.includes(option)}
                  onChange={() => handleCheckboxChange(option)}
                />
              ))}
            </Form.Group>
          </Col>
        ))}
      </Row>

      <h6 className="mt-3">Saved Future Priorities</h6>
      {savedFuturePriorityForms.map((item) => (
        <div key={item._id || item.priorityName} className="border p-2 mb-2">
          <p>
            {item.priorityName} - {item.members.join(", ")} - {item.approxAmount}
          </p>
          <Button size="sm" onClick={() => handleEditForm(item)}>
            Edit
          </Button>
        </div>
      ))}

      {openPriorities.map((priority) => (
        <div key={priority} className="border p-3 mb-3">
          <h5 className="text-info">{priority} Form</h5>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                {renderLabel(priority, "submissionDate", "Submission Date")}
                <Form.Control
                  type="date"
                  value={futurePriorityForms[priority]?.submissionDate || getCurrentDate()}
                  onChange={(e) => handleFormChange(priority, "submissionDate", e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                {renderLabel(priority, "members", "Members")}
                <Form.Select
                  // multiple
                  value={futurePriorityForms[priority]?.members || []}
                  onChange={(e) =>
                    handleFormChange(
                      priority,
                      "members",
                      Array.from(e.target.selectedOptions, (option) => option.value)
                    )
                  }
                  required
                >
                  {getMemberList().map((member) => (
                    <option key={member._id} value={member.name}>
                      {member.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                {renderLabel(priority, "approxAmount", priority === "Life Insurance" ? "Insurance Amount" : "Approx Amount")}
                <Form.Control
                  type="number"
                  value={futurePriorityForms[priority]?.approxAmount || ""}
                  onChange={(e) => handleFormChange(priority, "approxAmount", e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            {priority === "Life Insurance" && (
              <>
                <Col md={4}>
                  <Form.Group>
                    {renderLabel(priority, "individualOrFamily", "Individual / Family")}
                    <Form.Select
                      value={futurePriorityForms[priority]?.individualOrFamily || ""}
                      onChange={(e) =>
                        handleFormChange(
                          priority,
                          "individualOrFamily",
                          e.target.value
                        )
                      }
                      required
                    >
                      <option value="">Select</option>
                      <option value="Individual">Individual</option>
                      <option value="Family">Family</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    {renderLabel(priority, "policyType", "Policy Type")}
                    <Form.Control
                      type="text"
                      value={futurePriorityForms[priority]?.policyType || ""}
                      onChange={(e) =>
                        handleFormChange(priority, "policyType", e.target.value)
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    {renderLabel(priority, "companyName", "Company Name")}
                    <Form.Control
                      type="text"
                      value={futurePriorityForms[priority]?.companyName || ""}
                      onChange={(e) =>
                        handleFormChange(priority, "companyName", e.target.value)
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    {renderLabel(priority, "termPpt", "Terms / PPT")}
                    <Form.Control
                      type="text"
                      value={futurePriorityForms[priority]?.termPpt || ""}
                      onChange={(e) =>
                        handleFormChange(priority, "termPpt", e.target.value)
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    {renderLabel(priority, "maturityDate", "Maturity Date")}
                    <Form.Control
                      type="date"
                      value={futurePriorityForms[priority]?.maturityDate || ""}
                      onChange={(e) =>
                        handleFormChange(priority, "maturityDate", e.target.value)
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </>
            )}
            <Col md={4}>
              <Form.Group>
                {renderLabel(priority, "remark", "Remark")}
                <Form.Control
                  type="text"
                  value={futurePriorityForms[priority]?.remark || ""}
                  onChange={(e) => handleFormChange(priority, "remark", e.target.value)}
                />
              </Form.Group>
            </Col>

            {/* Custom fields list */}
            {(futurePriorityForms[priority]?.customFields || []).map((cf, idx) => (
              <Col md={4} key={idx}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    value={cf.key || ""}
                    onChange={(e) => handleCustomFieldKeyChange(priority, idx, e.target.value)}
                    placeholder="Field Name"
                    className="mb-1 fw-bold cf-key-input"
                    style={{ fontSize: '0.78rem', minHeight: '24px', padding: '0.1rem 0.3rem', border: 'none', borderBottom: '1px dashed #ced4da', background: 'transparent' }}
                  />
                  <div className="d-flex align-items-center">
                    <Form.Control
                      type="text"
                      value={cf.value || ""}
                      onChange={(e) => handleCustomFieldChange(priority, idx, e.target.value)}
                      required
                    />
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="ms-1"
                      onClick={() => handleRemoveCustomField(priority, idx)}
                      type="button"
                    >
                      &times;
                    </Button>
                  </div>
                </Form.Group>
              </Col>
            ))}

            {/* Add Custom Field Form */}
            <Col md={12} className="mt-2">
              <div className="d-flex align-items-end gap-2 border p-2 rounded">
                <div>
                  <Form.Label className="mb-0 text-muted" style={{ fontSize: '0.7rem' }}>New Field Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Goal Target Year"
                    id={`new-cf-key-priority-${priority.replace(/\s+/g, '-')}`}
                    style={{ minHeight: '28px', fontSize: '0.75rem' }}
                  />
                </div>
                <div>
                  <Form.Label className="mb-0 text-muted" style={{ fontSize: '0.7rem' }}>New Field Value</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Value"
                    id={`new-cf-val-priority-${priority.replace(/\s+/g, '-')}`}
                    style={{ minHeight: '28px', fontSize: '0.75rem' }}
                  />
                </div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    const keyInput = document.getElementById(`new-cf-key-priority-${priority.replace(/\s+/g, '-')}`);
                    const valInput = document.getElementById(`new-cf-val-priority-${priority.replace(/\s+/g, '-')}`);
                    if (keyInput && keyInput.value.trim()) {
                      handleAddCustomField(priority, keyInput.value.trim(), valInput ? valInput.value : "");
                      keyInput.value = "";
                      if (valInput) valInput.value = "";
                    }
                  }}
                  type="button"
                  style={{ minHeight: '28px', fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                >
                  Add Field
                </Button>
              </div>
            </Col>
          </Row>
          <Button variant="primary" className="me-2 ml-10 mt-2" onClick={() => handleSaveForm(priority)}>
            Save
          </Button>
          <Button variant="secondary" className="mt-2" onClick={() => handleCloseForm(priority)}>
            Close
          </Button>
        </div>
      ))}

      <Row className="mb-3">
  <Col md={12}>
  
  </Col>
</Row>

      <Button type="submit" className="btn btn-primary mt-3 me-2" disabled={loading}>
        Add Future Priorities
      </Button>
      <Button
        type="button"
        className="btn btn-primary mt-3"
        onClick={(e) => handleSubmit(e, true)}
        disabled={loading}
      >
        Update Future Priorities
      </Button>
    </Form>
  );
};

export default FuturePrioritiesForm;