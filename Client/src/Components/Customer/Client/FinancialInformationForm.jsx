import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../../../config/axios";
import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { FaShieldAlt, FaPlus, FaSyncAlt } from "react-icons/fa";
import { addFinancialInfo, updateFinancialInfo } from "../../../redux/feature/ClientRedux/ClientThunx";
import { fetchCompanyName } from "../../../redux/feature/ComapnyName/CompanyThunx";
import { fetchFinancialProduct } from "../../../redux/feature/FinancialProduct/FinancialThunx";
import { toast } from "react-toastify";

const INSURANCE_OPTIONS = [
  "LIC Policy",
  "Pvt. Life Policy",
  "Health Policy",
  "Motor Policy",
  "Fire Policy",
  "Other Policy",
];

const INVESTMENT_OPTIONS = [
  "Deposits",
  "Mutual Fund",
  "Stock Market",
  "Gold",
  "Property",
  "Other Investment",
];

const LOAN_OPTIONS = [
  "Business Loan",
  "Home Loan",
  "Vehicle Loan",
  "Personal Loan",
  "Gold Loan",
  "Other Loan",
];

const INSURANCE_COMPANY_OPTIONS = [
  "LIC",
  "HDFC Life",
  "ICICI Prudential",
  "SBI Life",
  "Max Life",
  "Bajaj Allianz Life",
  "Kotak Life",
  "Tata AIA",
  "Aditya Birla Sun Life",
  "Reliance Nippon Life",
  "Star Health",
  "Niva Bupa",
  "New India Assurance",
  "ICICI Lombard",
  "Bajaj Allianz General",
  "United India Insurance",
  "Oriental Insurance",
  "National Insurance",
  "Other",
];

const initialInsuranceForm = {
  _id: null,
  type: "",
  submissionDate: "",
  memberName: "",
  insuranceCompany: "",
  policyNumber: "",
  planName: "",
  sumAssured: "",
  mode: "",
  premium: "",
  startDate: "",
  maturityDate: "",
  term: "",
  ppt: "",
  document: null,
  customFields: [],
};

const initialInvestmentForm = {
  _id: null,
  type: "",
  submissionDate: "",
  memberName: "",
  financialProduct: "",
  companyName: "",
  planName: "",
  amount: "",
  maturityAmt: "",
  startDate: "",
  maturityDate: "",
  document: null,
  customFields: [],
};

const initialLoanForm = {
  _id: null,
  type: "",
  submissionDate: "",
  memberName: "",
  loanType: "",
  companyName: "",
  loanAccountNumber: "",
  outstandingAmount: "",
  interestRate: "",
  term: "",
  startDate: "",
  maturityDate: "",
  document: null,
  customFields: [],
};

const FinancialInformationForm = ({ clientId, clientData, onClientCreated, onDataUpdate }) => {
  const dispatch = useDispatch();
  const { financialInfo, loading, error } = useSelector((state) => state.client || {});
  const companies = useSelector((state) => state.CompanyName?.CompanyNames || []);
  const products = useSelector((state) => state.financialProduct?.FinancialProducts || []);

  useEffect(() => {
    dispatch(fetchCompanyName());
    dispatch(fetchFinancialProduct());
  }, [dispatch]);

  const [openInsurance, setOpenInsurance] = useState([]);
  const [openInvestments, setOpenInvestments] = useState([]);
  const [openLoans, setOpenLoans] = useState([]);

  const [insuranceForms, setInsuranceForms] = useState([]);
  const [investmentForms, setInvestmentForms] = useState([]);
  const [loanForms, setLoanForms] = useState([]);

  const [insuranceFormData, setInsuranceFormData] = useState({});
  const [investmentFormData, setInvestmentFormData] = useState({});
  const [loanFormData, setLoanFormData] = useState({});

  // Prepopulate forms with draft or saved info
  useEffect(() => {
    if (clientData?.financialInfo) {
      setInsuranceForms(clientData.financialInfo.insurance || []);
      setInvestmentForms(clientData.financialInfo.investments || []);
      setLoanForms(clientData.financialInfo.loans || []);
    } else {
      setInsuranceForms([]);
      setInvestmentForms([]);
      setLoanForms([]);
    }
  }, [clientData]);

  // Sync back to parent
  useEffect(() => {
    if (onDataUpdate) {
      onDataUpdate({
        insurance: insuranceForms,
        investments: investmentForms,
        loans: loanForms,
      });
    }
  }, [insuranceForms, investmentForms, loanForms, onDataUpdate]);

  const [insuranceFiles, setInsuranceFiles] = useState({});
  const [investmentFiles, setInvestmentFiles] = useState({});
  const [loanFiles, setLoanFiles] = useState({});

  const [familyMembers, setFamilyMembers] = useState([]);
  const [customerName, setCustomerName] = useState("");

  const getMemberList = () => {
    if (familyMembers && familyMembers.length > 0) {
      return familyMembers;
    }
    const selfName = customerName || clientData?.personalDetails?.name || clientData?.name || "";
    return [{ _id: "self", name: selfName || "Self" }];
  };

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        if (!clientId) return;
        const response = await axiosInstance.get(`/api/client/${clientId}`);
        const result = response.data;
        if (result.success) {
          setFamilyMembers(result.client.familyMembers || []);
          setCustomerName(result.client.personalDetails?.name || "");
          // Prepopulate forms with existing financial info
          if (result.client.financialInfo) {
            setInsuranceForms(result.client.financialInfo.insurance || []);
            setInvestmentForms(result.client.financialInfo.investments || []);
            setLoanForms(result.client.financialInfo.loans || []);
          }
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

  const handleCheckboxChange = (option, group, existingData = null) => {
    if (group === "insurance") {
      setOpenInsurance((prev) =>
        prev.includes(option) ? prev.filter((v) => v !== option) : [...prev, option]
      );
      setInsuranceFormData((prev) => ({
        ...prev,
        [option]: existingData || { ...initialInsuranceForm, type: option },
      }));
    }
    if (group === "investment") {
      setOpenInvestments((prev) =>
        prev.includes(option) ? prev.filter((v) => v !== option) : [...prev, option]
      );
      setInvestmentFormData((prev) => ({
        ...prev,
        [option]: existingData || { ...initialInvestmentForm, type: option },
      }));
    }
    if (group === "loan") {
      setOpenLoans((prev) =>
        prev.includes(option) ? prev.filter((v) => v !== option) : [...prev, option]
      );
      setLoanFormData((prev) => ({
        ...prev,
        [option]: existingData || { ...initialLoanForm, type: option },
      }));
    }
  };

  const handleFormChange = (option, group, field, value) => {
    if (group === "insurance") {
      setInsuranceFormData((prev) => ({
        ...prev,
        [option]: { ...prev[option], [field]: value },
      }));
    }
    if (group === "investment") {
      setInvestmentFormData((prev) => ({
        ...prev,
        [option]: { ...prev[option], [field]: value },
      }));
    }
    if (group === "loan") {
      setLoanFormData((prev) => ({
        ...prev,
        [option]: { ...prev[option], [field]: value },
      }));
    }
  };

  const handleAddCustomField = (option, group, key, value) => {
    if (group === "insurance") {
      setInsuranceFormData((prev) => {
        const item = prev[option] || { ...initialInsuranceForm, type: option };
        const customFields = [...(item.customFields || []), { key, value }];
        return { ...prev, [option]: { ...item, customFields } };
      });
    }
    if (group === "investment") {
      setInvestmentFormData((prev) => {
        const item = prev[option] || { ...initialInvestmentForm, type: option };
        const customFields = [...(item.customFields || []), { key, value }];
        return { ...prev, [option]: { ...item, customFields } };
      });
    }
    if (group === "loan") {
      setLoanFormData((prev) => {
        const item = prev[option] || { ...initialLoanForm, type: option };
        const customFields = [...(item.customFields || []), { key, value }];
        return { ...prev, [option]: { ...item, customFields } };
      });
    }
  };

  const handleCustomFieldChange = (option, group, idx, value) => {
    if (group === "insurance") {
      setInsuranceFormData((prev) => {
        const item = prev[option];
        const customFields = [...(item.customFields || [])];
        customFields[idx] = { ...customFields[idx], value };
        return { ...prev, [option]: { ...item, customFields } };
      });
    }
    if (group === "investment") {
      setInvestmentFormData((prev) => {
        const item = prev[option];
        const customFields = [...(item.customFields || [])];
        customFields[idx] = { ...customFields[idx], value };
        return { ...prev, [option]: { ...item, customFields } };
      });
    }
    if (group === "loan") {
      setLoanFormData((prev) => {
        const item = prev[option];
        const customFields = [...(item.customFields || [])];
        customFields[idx] = { ...customFields[idx], value };
        return { ...prev, [option]: { ...item, customFields } };
      });
    }
  };

  const handleCustomFieldKeyChange = (option, group, idx, key) => {
    if (group === "insurance") {
      setInsuranceFormData((prev) => {
        const item = prev[option];
        const customFields = [...(item.customFields || [])];
        customFields[idx] = { ...customFields[idx], key };
        return { ...prev, [option]: { ...item, customFields } };
      });
    }
    if (group === "investment") {
      setInvestmentFormData((prev) => {
        const item = prev[option];
        const customFields = [...(item.customFields || [])];
        customFields[idx] = { ...customFields[idx], key };
        return { ...prev, [option]: { ...item, customFields } };
      });
    }
    if (group === "loan") {
      setLoanFormData((prev) => {
        const item = prev[option];
        const customFields = [...(item.customFields || [])];
        customFields[idx] = { ...customFields[idx], key };
        return { ...prev, [option]: { ...item, customFields } };
      });
    }
  };

  const handleCustomLabelChange = (option, group, field, newLabel) => {
    if (group === "insurance") {
      setInsuranceFormData((prev) => {
        const item = prev[option] || { ...initialInsuranceForm, type: option };
        const customLabels = { ...(item.customLabels || {}), [field]: newLabel };
        return { ...prev, [option]: { ...item, customLabels } };
      });
    }
    if (group === "investment") {
      setInvestmentFormData((prev) => {
        const item = prev[option] || { ...initialInvestmentForm, type: option };
        const customLabels = { ...(item.customLabels || {}), [field]: newLabel };
        return { ...prev, [option]: { ...item, customLabels } };
      });
    }
    if (group === "loan") {
      setLoanFormData((prev) => {
        const item = prev[option] || { ...initialLoanForm, type: option };
        const customLabels = { ...(item.customLabels || {}), [field]: newLabel };
        return { ...prev, [option]: { ...item, customLabels } };
      });
    }
  };

  const renderLabel = (option, group, field, defaultLabel) => {
    let currentLabel = defaultLabel;
    if (group === "insurance") {
      currentLabel = insuranceFormData[option]?.customLabels?.[field] || defaultLabel;
    } else if (group === "investment") {
      currentLabel = investmentFormData[option]?.customLabels?.[field] || defaultLabel;
    } else if (group === "loan") {
      currentLabel = loanFormData[option]?.customLabels?.[field] || defaultLabel;
    }
    return (
      <Form.Control
        type="text"
        value={currentLabel}
        onChange={(e) => handleCustomLabelChange(option, group, field, e.target.value)}
        className="mb-1 fw-bold cf-label-input"
        style={{ fontSize: '0.78rem', minHeight: '24px', padding: '0.1rem 0.3rem', border: 'none', borderBottom: '1px dashed #ced4da', background: 'transparent' }}
      />
    );
  };

  const handleRemoveCustomField = (option, group, idx) => {
    if (group === "insurance") {
      setInsuranceFormData((prev) => {
        const item = prev[option];
        const customFields = (item.customFields || []).filter((_, i) => i !== idx);
        return { ...prev, [option]: { ...item, customFields } };
      });
    }
    if (group === "investment") {
      setInvestmentFormData((prev) => {
        const item = prev[option];
        const customFields = (item.customFields || []).filter((_, i) => i !== idx);
        return { ...prev, [option]: { ...item, customFields } };
      });
    }
    if (group === "loan") {
      setLoanFormData((prev) => {
        const item = prev[option];
        const customFields = (item.customFields || []).filter((_, i) => i !== idx);
        return { ...prev, [option]: { ...item, customFields } };
      });
    }
  };

  const handleFileChange = (option, group, files) => {
    if (group === "insurance") {
      setInsuranceFiles((prev) => ({
        ...prev,
        [option]: files ? Array.from(files) : [],
      }));
    }
    if (group === "investment") {
      setInvestmentFiles((prev) => ({
        ...prev,
        [option]: files ? Array.from(files) : [],
      }));
    }
    if (group === "loan") {
      setLoanFiles((prev) => ({
        ...prev,
        [option]: files ? Array.from(files) : [],
      }));
    }
  };

  const handleSaveForm = (option, group) => {
    if (group === "insurance") {
      const formData = { ...insuranceFormData[option] };
      setInsuranceForms((prev) => {
        const existingIndex = prev.findIndex((item) => item._id === formData._id);
        if (existingIndex >= 0) {
          const updatedForms = [...prev];
          updatedForms[existingIndex] = formData;
          return updatedForms;
        }
        return [...prev, formData];
      });
      setOpenInsurance((prev) => prev.filter((v) => v !== option));
      setInsuranceFormData((prev) => {
        const copy = { ...prev };
        delete copy[option];
        return copy;
      });
      setInsuranceFiles((prev) => {
        const copy = { ...prev };
        delete copy[option];
        return copy;
      });
    }
    if (group === "investment") {
      const formData = { ...investmentFormData[option] };
      setInvestmentForms((prev) => {
        const existingIndex = prev.findIndex((item) => item._id === formData._id);
        if (existingIndex >= 0) {
          const updatedForms = [...prev];
          updatedForms[existingIndex] = formData;
          return updatedForms;
        }
        return [...prev, formData];
      });
      setOpenInvestments((prev) => prev.filter((v) => v !== option));
      setInvestmentFormData((prev) => {
        const copy = { ...prev };
        delete copy[option];
        return copy;
      });
      setInvestmentFiles((prev) => {
        const copy = { ...prev };
        delete copy[option];
        return copy;
      });
    }
    if (group === "loan") {
      const formData = { ...loanFormData[option] };
      setLoanForms((prev) => {
        const existingIndex = prev.findIndex((item) => item._id === formData._id);
        if (existingIndex >= 0) {
          const updatedForms = [...prev];
          updatedForms[existingIndex] = formData;
          return updatedForms;
        }
        return [...prev, formData];
      });
      setOpenLoans((prev) => prev.filter((v) => v !== option));
      setLoanFormData((prev) => {
        const copy = { ...prev };
        delete copy[option];
        return copy;
      });
      setLoanFiles((prev) => {
        const copy = { ...prev };
        delete copy[option];
        return copy;
      });
    }
  };

  const handleCloseForm = (option, group) => {
    if (group === "insurance") {
      setOpenInsurance((prev) => prev.filter((v) => v !== option));
      setInsuranceFormData((prev) => {
        const copy = { ...prev };
        delete copy[option];
        return copy;
      });
      setInsuranceFiles((prev) => {
        const copy = { ...prev };
        delete copy[option];
        return copy;
      });
    }
    if (group === "investment") {
      setOpenInvestments((prev) => prev.filter((v) => v !== option));
      setInvestmentFormData((prev) => {
        const copy = { ...prev };
        delete copy[option];
        return copy;
      });
      setInvestmentFiles((prev) => {
        const copy = { ...prev };
        delete copy[option];
        return copy;
      });
    }
    if (group === "loan") {
      setOpenLoans((prev) => prev.filter((v) => v !== option));
      setLoanFormData((prev) => {
        const copy = { ...prev };
        delete copy[option];
        return copy;
      });
      setLoanFiles((prev) => {
        const copy = { ...prev };
        delete copy[option];
        return copy;
      });
    }
  };

  const handleSubmit = async (e, isUpdate = false) => {
    e.preventDefault();

    try {
      const financialData = {
        insurance: insuranceForms,
        investments: investmentForms,
        loans: loanForms,
      };

      const files = {
        insuranceDocuments: Object.values(insuranceFiles).flat(),
        investmentDocuments: Object.values(investmentFiles).flat(),
        loanDocuments: Object.values(loanFiles).flat(),
      };

      const idToUse = clientData?._id || clientId;
      if (!idToUse) {
        toast.error("Client ID is missing.");
        return;
      }

      const action = isUpdate
        ? await dispatch(updateFinancialInfo({ clientId: idToUse, financialData, files }))
        : await dispatch(addFinancialInfo({ clientId: idToUse, financialData, files }));

      if (isUpdate ? updateFinancialInfo.fulfilled.match(action) : addFinancialInfo.fulfilled.match(action)) {
        setInsuranceForms([]);
        setInvestmentForms([]);
        setLoanForms([]);
        setInsuranceFiles({});
        setInvestmentFiles({});
        setLoanFiles({});
        toast.success(action.payload.message);
        if (!isUpdate && onClientCreated && action.payload.clientId) {
          onClientCreated(action.payload.clientId);
        }
      } else {
        toast.error(action.payload || "Failed to save financial information.");
      }
    } catch (error) {
      console.error(`Error ${isUpdate ? "updating" : "adding"} financial data:`, error);
      toast.error(`Failed to ${isUpdate ? "update" : "add"} financial information. Please try again.`);
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleEditForm = (item, group) => {
    const option = item.type;
    if (group === "insurance") {
      handleCheckboxChange(option, "insurance", { ...item, document: null });
    }
    if (group === "investment") {
      handleCheckboxChange(option, "investment", { ...item, document: null });
    }
    if (group === "loan") {
      handleCheckboxChange(option, "loan", { ...item, document: null });
    }
  };

  return (
    <Form onSubmit={(e) => handleSubmit(e, false)} className="compact-financial-form">
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Insurance</Form.Label>
            {INSURANCE_OPTIONS.map((option) => (
              <Form.Check
                key={option}
                type="checkbox"
                label={option}
                value={option}
                checked={openInsurance.includes(option)}
                onChange={() => handleCheckboxChange(option, "insurance")}
              />
            ))}
          </Form.Group>
          <h6 className="mt-3">Saved Insurance</h6>
          {insuranceForms.map((item, index) => (
            <div key={index} className="border p-2 mb-2">
              <p>{item.type} - {item.memberName} - {item.policyNumber}</p>
              <Button size="sm" onClick={() => handleEditForm(item, "insurance")}>
                Edit
              </Button>
            </div>
          ))}
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Investments</Form.Label>
            {INVESTMENT_OPTIONS.map((option) => (
              <Form.Check
                key={option}
                type="checkbox"
                label={option}
                value={option}
                checked={openInvestments.includes(option)}
                onChange={() => handleCheckboxChange(option, "investment")}
              />
            ))}
          </Form.Group>
          <h6 className="mt-3">Saved Investments</h6>
          {investmentForms.map((item, index) => (
            <div key={index} className="border p-2 mb-2">
              <p>{item.type} - {item.memberName} - {item.financialProduct}</p>
              <Button size="sm" onClick={() => handleEditForm(item, "investment")}>
                Edit
              </Button>
            </div>
          ))}
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Loans</Form.Label>
            {LOAN_OPTIONS.map((option) => (
              <Form.Check
                key={option}
                type="checkbox"
                label={option}
                value={option}
                checked={openLoans.includes(option)}
                onChange={() => handleCheckboxChange(option, "loan")}
              />
            ))}
          </Form.Group>
          <h6 className="mt-3">Saved Loans</h6>
          {loanForms.map((item, index) => (
            <div key={index} className="border p-2 mb-2">
              <p>{item.type} - {item.memberName} - {item.loanAccountNumber}</p>
              <Button size="sm" onClick={() => handleEditForm(item, "loan")}>
                Edit
              </Button>
            </div>
          ))}
        </Col>
      </Row>

      {/* Insurance Forms */}
      {openInsurance.map((option) => (
        <div key={option} className="border p-3 mb-3">
          <h5 className={`text-primary insurance-form-title ${option === "LIC Policy" ? "lic-policy-title" : ""}`}>
            {option === "LIC Policy" && <FaShieldAlt className="lic-icon" />}
            <span>{option} Insurance</span>
          </h5>
          <Row>
            <Col md={4}>
              <Form.Group>
                {renderLabel(option, "insurance", "submissionDate", "Submission Date")}
                <Form.Control
                  type="date"
                  value={insuranceFormData[option]?.submissionDate || getCurrentDate()}
                  onChange={(e) =>
                    handleFormChange(option, "insurance", "submissionDate", e.target.value)
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                {renderLabel(option, "insurance", "memberName", option === "LIC Policy" ? "Policy Holder Name" : "Member Name")}
                <Form.Select
                  name="memberName"
                  value={insuranceFormData[option]?.memberName || ""}
                  onChange={(e) =>
                    handleFormChange(option, "insurance", "memberName", e.target.value)
                  }
                  required
                >
                  <option value="">
                    {option === "LIC Policy"
                      ? "Select Policy Holder Name"
                      : "Select Member Name"}
                  </option>
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
                {renderLabel(option, "insurance", "insuranceCompany", "Insurance Company")}
                <Form.Select
                  value={insuranceFormData[option]?.insuranceCompany || ""}
                  onChange={(e) =>
                    handleFormChange(option, "insurance", "insuranceCompany", e.target.value)
                  }
                  required
                >
                  <option value="">Select Insurance Company</option>
                  {companies && companies.length > 0
                    ? companies.map((company) => (
                        <option key={company._id} value={company.companyName}>
                          {company.companyName}
                        </option>
                      ))
                    : INSURANCE_COMPANY_OPTIONS.map((company) => (
                        <option key={company} value={company}>
                          {company}
                        </option>
                      ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                {renderLabel(option, "insurance", "policyNumber", "Policy Number")}
                <Form.Control
                  type="text"
                  value={insuranceFormData[option]?.policyNumber || ""}
                  onChange={(e) =>
                    handleFormChange(option, "insurance", "policyNumber", e.target.value)
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                {renderLabel(option, "insurance", "planName", "Plan Name")}
                <Form.Control
                  type="text"
                  value={insuranceFormData[option]?.planName || ""}
                  onChange={(e) =>
                    handleFormChange(option, "insurance", "planName", e.target.value)
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                {renderLabel(option, "insurance", "sumAssured", option === "Motor Policy" ? "DV Value" : "Sum Assured")}
                <Form.Control
                  type="number"
                  value={insuranceFormData[option]?.sumAssured || ""}
                  onChange={(e) =>
                    handleFormChange(option, "insurance", "sumAssured", e.target.value)
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                {renderLabel(option, "insurance", "mode", "Mode")}
                <Form.Select
                  value={insuranceFormData[option]?.mode || ""}
                  onChange={(e) =>
                    handleFormChange(option, "insurance", "mode", e.target.value)
                  }
                  required
                >
                  <option value="">Select Mode</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Half Yearly">Half Yearly</option>
                  <option value="Yearly">Yearly</option>
                  <option value="Single Premium">Single Premium</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                {renderLabel(option, "insurance", "premium", "Premium")}
                <Form.Control
                  type="number"
                  value={insuranceFormData[option]?.premium || ""}
                  onChange={(e) =>
                    handleFormChange(option, "insurance", "premium", e.target.value)
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                {renderLabel(option, "insurance", "startDate", "Start Date")}
                <Form.Control
                  type="date"
                  value={insuranceFormData[option]?.startDate || ""}
                  onChange={(e) =>
                    handleFormChange(option, "insurance", "startDate", e.target.value)
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                {renderLabel(option, "insurance", "maturityDate", option === "Health Policy" ? "Expire Date" : "Maturity Date")}
                <Form.Control
                  type="date"
                  value={insuranceFormData[option]?.maturityDate || ""}
                  onChange={(e) =>
                    handleFormChange(option, "insurance", "maturityDate", e.target.value)
                  }
                  required
                />
              </Form.Group>
            </Col>
            {option === "LIC Policy" && (
              <>
                <Col md={4}>
                  <Form.Group>
                    {renderLabel(option, "insurance", "term", "Term")}
                    <Form.Control
                      type="text"
                      value={insuranceFormData[option]?.term || ""}
                      onChange={(e) =>
                        handleFormChange(option, "insurance", "term", e.target.value)
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    {renderLabel(option, "insurance", "ppt", "PPT")}
                    <Form.Control
                      type="text"
                      value={insuranceFormData[option]?.ppt || ""}
                      onChange={(e) =>
                        handleFormChange(option, "insurance", "ppt", e.target.value)
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </>
            )}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Upload Documents (up to 10)</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/gif,image/avif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain"
                  onChange={(e) => handleFileChange(option, "insurance", e.target.files)}
                />
              </Form.Group>
            </Col>

            {/* Custom fields list */}
            {(insuranceFormData[option]?.customFields || []).map((cf, idx) => (
              <Col md={4} key={idx}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    value={cf.key || ""}
                    onChange={(e) => handleCustomFieldKeyChange(option, "insurance", idx, e.target.value)}
                    placeholder="Field Name"
                    className="mb-1 fw-bold cf-key-input"
                    style={{ fontSize: '0.78rem', minHeight: '24px', padding: '0.1rem 0.3rem', border: 'none', borderBottom: '1px dashed #ced4da', background: 'transparent' }}
                  />
                  <div className="d-flex align-items-center">
                    <Form.Control
                      type="text"
                      value={cf.value || ""}
                      onChange={(e) => handleCustomFieldChange(option, "insurance", idx, e.target.value)}
                      required
                    />
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="ms-1"
                      onClick={() => handleRemoveCustomField(option, "insurance", idx)}
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
                    placeholder="e.g. Branch Name"
                    id={`new-cf-key-insurance-${option.replace(/\s+/g, '-')}`}
                    style={{ minHeight: '28px', fontSize: '0.75rem' }}
                  />
                </div>
                <div>
                  <Form.Label className="mb-0 text-muted" style={{ fontSize: '0.7rem' }}>New Field Value</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Value"
                    id={`new-cf-val-insurance-${option.replace(/\s+/g, '-')}`}
                    style={{ minHeight: '28px', fontSize: '0.75rem' }}
                  />
                </div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    const keyInput = document.getElementById(`new-cf-key-insurance-${option.replace(/\s+/g, '-')}`);
                    const valInput = document.getElementById(`new-cf-val-insurance-${option.replace(/\s+/g, '-')}`);
                    if (keyInput && keyInput.value.trim()) {
                      handleAddCustomField(option, "insurance", keyInput.value.trim(), valInput ? valInput.value : "");
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
          <Button
            variant="primary"
            className="me-2 mt-2"
            onClick={() => handleSaveForm(option, "insurance")}
          >
            Save
          </Button>
          <Button
            variant="secondary"
            className="mt-2"
            onClick={() => handleCloseForm(option, "insurance")}
          >
            Close
          </Button>
        </div>
      ))}

      {/* Investment Forms */}
      {openInvestments.map((option) => (
        <div key={option} className="border p-3 mb-3">
          <h5 className="text-success">{option} Investment</h5>
          <Row>
            <Col md={4}>
              <Form.Group>
                {renderLabel(option, "investment", "submissionDate", "Submission Date")}
                <Form.Control
                  type="date"
                  value={investmentFormData[option]?.submissionDate || getCurrentDate()}
                  onChange={(e) =>
                    handleFormChange(option, "investment", "submissionDate", e.target.value)
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                {renderLabel(option, "investment", "memberName", "Member Name")}
                <Form.Select
                  name="memberName"
                  value={investmentFormData[option]?.memberName || ""}
                  onChange={(e) =>
                    handleFormChange(option, "investment", "memberName", e.target.value)
                  }
                  required
                >
                  <option value="">Select Member Name</option>
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
                {renderLabel(option, "investment", "financialProduct", "Financial Product")}
                <Form.Select
                  value={investmentFormData[option]?.financialProduct || ""}
                  onChange={(e) =>
                    handleFormChange(option, "investment", "financialProduct", e.target.value)
                  }
                  required
                >
                  <option value="">Select Financial Product</option>
                  {products?.map((product) => (
                    <option key={product._id} value={product.name}>
                      {product.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                {renderLabel(option, "investment", "companyName", "Company Name")}
                <Form.Select
                  value={investmentFormData[option]?.companyName || ""}
                  onChange={(e) =>
                    handleFormChange(option, "investment", "companyName", e.target.value)
                  }
                  required
                >
                  <option value="">Select Company</option>
                  {companies?.map((company) => (
                    <option key={company._id} value={company.companyName}>
                      {company.companyName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                {renderLabel(option, "investment", "planName", "Plan Name")}
                <Form.Control
                  type="text"
                  value={investmentFormData[option]?.planName || ""}
                  onChange={(e) =>
                    handleFormChange(option, "investment", "planName", e.target.value)
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                {renderLabel(option, "investment", "amount", option === "Deposits" ? "Investment Amount" : "Amount")}
                <Form.Control
                  type="number"
                  value={investmentFormData[option]?.amount || ""}
                  onChange={(e) =>
                    handleFormChange(option, "investment", "amount", e.target.value)
                  }
                  required
                />
              </Form.Group>
            </Col>
            {option === "Deposits" && (
              <Col md={4}>
                <Form.Group>
                  {renderLabel(option, "investment", "maturityAmt", "Maturity Amt")}
                  <Form.Control
                    type="number"
                    value={investmentFormData[option]?.maturityAmt || ""}
                    onChange={(e) =>
                      handleFormChange(option, "investment", "maturityAmt", e.target.value)
                    }
                    required
                  />
                </Form.Group>
              </Col>
            )}
            <Col md={4}>
              <Form.Group>
                {renderLabel(option, "investment", "startDate", "Start Date")}
                <Form.Control
                  type="date"
                  value={investmentFormData[option]?.startDate || ""}
                  onChange={(e) =>
                    handleFormChange(option, "investment", "startDate", e.target.value)
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                {renderLabel(option, "investment", "maturityDate", "Maturity Date")}
                <Form.Control
                  type="date"
                  value={investmentFormData[option]?.maturityDate || ""}
                  onChange={(e) =>
                    handleFormChange(option, "investment", "maturityDate", e.target.value)
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Upload Documents (up to 10)</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/gif,image/avif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain"
                  onChange={(e) => handleFileChange(option, "investment", e.target.files)}
                />
              </Form.Group>
            </Col>

            {/* Custom fields list */}
            {(investmentFormData[option]?.customFields || []).map((cf, idx) => (
              <Col md={4} key={idx}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    value={cf.key || ""}
                    onChange={(e) => handleCustomFieldKeyChange(option, "investment", idx, e.target.value)}
                    placeholder="Field Name"
                    className="mb-1 fw-bold cf-key-input"
                    style={{ fontSize: '0.78rem', minHeight: '24px', padding: '0.1rem 0.3rem', border: 'none', borderBottom: '1px dashed #ced4da', background: 'transparent' }}
                  />
                  <div className="d-flex align-items-center">
                    <Form.Control
                      type="text"
                      value={cf.value || ""}
                      onChange={(e) => handleCustomFieldChange(option, "investment", idx, e.target.value)}
                      required
                    />
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="ms-1"
                      onClick={() => handleRemoveCustomField(option, "investment", idx)}
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
                    placeholder="e.g. Folio Number"
                    id={`new-cf-key-investment-${option.replace(/\s+/g, '-')}`}
                    style={{ minHeight: '28px', fontSize: '0.75rem' }}
                  />
                </div>
                <div>
                  <Form.Label className="mb-0 text-muted" style={{ fontSize: '0.7rem' }}>New Field Value</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Value"
                    id={`new-cf-val-investment-${option.replace(/\s+/g, '-')}`}
                    style={{ minHeight: '28px', fontSize: '0.75rem' }}
                  />
                </div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    const keyInput = document.getElementById(`new-cf-key-investment-${option.replace(/\s+/g, '-')}`);
                    const valInput = document.getElementById(`new-cf-val-investment-${option.replace(/\s+/g, '-')}`);
                    if (keyInput && keyInput.value.trim()) {
                      handleAddCustomField(option, "investment", keyInput.value.trim(), valInput ? valInput.value : "");
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
          <Button
            variant="primary"
            className="me-2 mt-2"
            onClick={() => handleSaveForm(option, "investment")}
          >
            Save
          </Button>
          <Button
            variant="secondary"
            className="mt-2"
            onClick={() => handleCloseForm(option, "investment")}
          >
            Close
          </Button>
        </div>
      ))}

      {/* Loan Forms */}
      {openLoans.map((option) => (
        <div key={option} className="border p-3 mb-3">
          <h5 className="text-danger">{option} Loan</h5>
          <Row>
            <Col md={4}>
              <Form.Group>
                {renderLabel(option, "loan", "submissionDate", "Submission Date")}
                <Form.Control
                  type="date"
                  value={loanFormData[option]?.submissionDate || getCurrentDate()}
                  onChange={(e) =>
                    handleFormChange(option, "loan", "submissionDate", e.target.value)
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                {renderLabel(option, "loan", "memberName", "Member Name")}
                <Form.Select
                  name="memberName"
                  value={loanFormData[option]?.memberName || ""}
                  onChange={(e) =>
                    handleFormChange(option, "loan", "memberName", e.target.value)
                  }
                  required
                >
                  <option value="">Select Member Name</option>
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
                {renderLabel(option, "loan", "loanType", "Loan Type")}
                <Form.Control
                  type="text"
                  value={loanFormData[option]?.loanType || ""}
                  onChange={(e) =>
                    handleFormChange(option, "loan", "loanType", e.target.value)
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                {renderLabel(option, "loan", "companyName", "Company Name")}
                <Form.Select
                  value={loanFormData[option]?.companyName || ""}
                  onChange={(e) =>
                    handleFormChange(option, "loan", "companyName", e.target.value)
                  }
                  required
                >
                  <option value="">Select Company</option>
                  {companies?.map((company) => (
                    <option key={company._id} value={company.companyName}>
                      {company.companyName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                {renderLabel(option, "loan", "loanAccountNumber", "Loan Account Number")}
                <Form.Control
                  type="text"
                  value={loanFormData[option]?.loanAccountNumber || ""}
                  onChange={(e) =>
                    handleFormChange(option, "loan", "loanAccountNumber", e.target.value)
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                {renderLabel(option, "loan", "outstandingAmount", "Outstanding Amount")}
                <Form.Control
                  type="number"
                  value={loanFormData[option]?.outstandingAmount || ""}
                  onChange={(e) =>
                    handleFormChange(option, "loan", "outstandingAmount", e.target.value)
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                {renderLabel(option, "loan", "interestRate", "Interest Rate (%)")}
                <Form.Control
                  type="number"
                  step="0.01"
                  value={loanFormData[option]?.interestRate || ""}
                  onChange={(e) =>
                    handleFormChange(option, "loan", "interestRate", e.target.value)
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                {renderLabel(option, "loan", "term", "Term")}
                <Form.Control
                  type="text"
                  placeholder="e.g., 5 years, 60 months"
                  value={loanFormData[option]?.term || ""}
                  onChange={(e) =>
                    handleFormChange(option, "loan", "term", e.target.value)
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                {renderLabel(option, "loan", "startDate", "Start Date")}
                <Form.Control
                  type="date"
                  value={loanFormData[option]?.startDate || ""}
                  onChange={(e) =>
                    handleFormChange(option, "loan", "startDate", e.target.value)
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                {renderLabel(option, "loan", "maturityDate", "Maturity Date")}
                <Form.Control
                  type="date"
                  value={loanFormData[option]?.maturityDate || ""}
                  onChange={(e) =>
                    handleFormChange(option, "loan", "maturityDate", e.target.value)
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Upload Documents (up to 10)</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/gif,image/avif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain"
                  onChange={(e) => handleFileChange(option, "loan", e.target.files)}
                />
              </Form.Group>
            </Col>

            {/* Custom fields list */}
            {(loanFormData[option]?.customFields || []).map((cf, idx) => (
              <Col md={4} key={idx}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    value={cf.key || ""}
                    onChange={(e) => handleCustomFieldKeyChange(option, "loan", idx, e.target.value)}
                    placeholder="Field Name"
                    className="mb-1 fw-bold cf-key-input"
                    style={{ fontSize: '0.78rem', minHeight: '24px', padding: '0.1rem 0.3rem', border: 'none', borderBottom: '1px dashed #ced4da', background: 'transparent' }}
                  />
                  <div className="d-flex align-items-center">
                    <Form.Control
                      type="text"
                      value={cf.value || ""}
                      onChange={(e) => handleCustomFieldChange(option, "loan", idx, e.target.value)}
                      required
                    />
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="ms-1"
                      onClick={() => handleRemoveCustomField(option, "loan", idx)}
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
                    placeholder="e.g. Branch"
                    id={`new-cf-key-loan-${option.replace(/\s+/g, '-')}`}
                    style={{ minHeight: '28px', fontSize: '0.75rem' }}
                  />
                </div>
                <div>
                  <Form.Label className="mb-0 text-muted" style={{ fontSize: '0.7rem' }}>New Field Value</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Value"
                    id={`new-cf-val-loan-${option.replace(/\s+/g, '-')}`}
                    style={{ minHeight: '28px', fontSize: '0.75rem' }}
                  />
                </div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    const keyInput = document.getElementById(`new-cf-key-loan-${option.replace(/\s+/g, '-')}`);
                    const valInput = document.getElementById(`new-cf-val-loan-${option.replace(/\s+/g, '-')}`);
                    if (keyInput && keyInput.value.trim()) {
                      handleAddCustomField(option, "loan", keyInput.value.trim(), valInput ? valInput.value : "");
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
          <Button
            variant="primary"
            className="me-2 mt-2"
            onClick={() => handleSaveForm(option, "loan")}
          >
            Save
          </Button>
          <Button
            variant="secondary"
            className="mt-2"
            onClick={() => handleCloseForm(option, "loan")}
          >
            Close
          </Button>
        </div>
      ))}

      <style>{`
        .compact-financial-form .row {
          --bs-gutter-x: 0.55rem;
          --bs-gutter-y: 0.35rem;
        }
        .compact-financial-form .form-group {
          margin-bottom: 0.35rem;
        }
        .compact-financial-form .form-label {
          font-size: 0.78rem;
          margin-bottom: 0.18rem;
          line-height: 1.1;
        }
        .compact-financial-form .form-control,
        .compact-financial-form .form-select {
          min-height: 30px;
          font-size: 0.82rem;
          padding: 0.2rem 0.5rem;
        }
        .compact-financial-form .border.p-3 {
          padding: 0.7rem !important;
          margin-bottom: 0.55rem !important;
        }
        .compact-financial-form .insurance-form-title {
          margin-bottom: 0.45rem;
          font-size: 1rem;
        }
        .compact-financial-form .lic-policy-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          color: #0d6efd !important;
          text-align: center;
        }
        .compact-financial-form .lic-icon {
          color: #0ea5e9;
          filter: drop-shadow(0 0 1px #9ca3af);
        }
        .compact-financial-form .lic-policy-title span {
          border-bottom: 1px solid #9ca3af;
          padding-bottom: 1px;
        }
        .compact-financial-form .financial-action-row {
          display: flex;
          justify-content: flex-end;
          gap: 0.45rem;
          margin-top: 0.45rem;
        }
        .compact-financial-form .financial-action-btn {
          min-width: 34px;
          min-height: 32px;
          padding: 0.3rem 0.5rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
      <div className="financial-action-row">
        <Button
          type="submit"
          className="btn btn-primary financial-action-btn"
          title="Add Financial Info"
          aria-label="Add Financial Info"
        >
          <FaPlus />
        </Button>
        <Button
          type="button"
          className="btn btn-success financial-action-btn"
          onClick={(e) => handleSubmit(e, true)}
          title="Update Financial Info"
          aria-label="Update Financial Info"
        >
          <FaSyncAlt />
        </Button>
      </div>
    </Form>
  );
};

export default FinancialInformationForm;