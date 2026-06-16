import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button } from "react-bootstrap";
import { getSuspectById } from "../../../redux/feature/SuspectRedux/SuspectThunx";
import { fetchDetails } from "../../../redux/feature/LeadSource/LeadThunx";
import { getAllOccupationTypes } from "../../../redux/feature/OccupationType/OccupationThunx";
import { getAllOccupations } from "../../../redux/feature/LeadOccupation/OccupationThunx";
import { createSuspect } from "../../../redux/feature/SuspectRedux/SuspectThunx";
import { useNavigate, useParams } from "react-router-dom";
import PersonalDetailFormSuspect from "./PersonalDetailFormSuspect";
import FamilyMembersFormSuspect from "./FamilyMembersFormSuspect";
import FinancialInformationFormSuspect from "./FinancialInformationFormSuspect";
import FuturePrioritiesFromSuspect from "./FuturePrioritiesFromSuspect";
import ProposedPanFormSuspect from "./ProposedPanFormSuspect";
import {
  FaUser,
  FaUsers,
  FaRupeeSign,
  FaBullseye,
  FaFileAlt,
  FaSave,
} from "react-icons/fa";
import { toast } from "react-toastify";

const SuspectFirstForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("personal");
  const [suspectId, setSuspectId] = useState(id || "");
  const [isEdit, setIsEdit] = useState(false);
  const [suspectData, setSuspectData] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Store all form data
  const [personalData, setPersonalData] = useState(null);
  const [familyData, setFamilyData] = useState([]);
  const [financialData, setFinancialData] = useState({
    insurance: [],
    investments: [],
    loans: [],
  });
  const [prioritiesData, setPrioritiesData] = useState({
    futurePriorities: [],
    needs: {},
  });
  const [proposedPlanData, setProposedPlanData] = useState([]);

  useEffect(() => {
    dispatch(getAllOccupationTypes());
    dispatch(getAllOccupations());
    dispatch(fetchDetails());

    if (id) {
      setIsEdit(true);
      dispatch(getSuspectById(id)).then((response) => {
        if (response?.payload?.suspect) {
          const data = response.payload.suspect;
          setSuspectData(data);
          setSuspectId(data._id || id);

          // Load existing data for editing
          setPersonalData(data.personalDetails || null);
          setFamilyData(data.familyMembers || []);
          setFinancialData(
            data.financialInfo || {
              insurance: [],
              investments: [],
              loans: [],
            }
          );
          setPrioritiesData({
            futurePriorities: data.futurePriorities || [],
            needs: data.needs || {},
          });
          setProposedPlanData(data.proposedPlan || []);
        }
      });
    } else {
      setIsEdit(false);
      setSuspectId("");
      setSuspectData(null);
      setPersonalData(null);
      setFamilyData([]);
      setFinancialData({
        insurance: [],
        investments: [],
        loans: [],
      });
      setPrioritiesData({
        futurePriorities: [],
        needs: {},
      });
      setProposedPlanData([]);
    }
  }, [dispatch, id]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Data collection functions
  const handlePersonalDataUpdate = React.useCallback((formData) => {
    setPersonalData(formData);
  }, []);

  const handleFamilyDataUpdate = React.useCallback((data) => {
    setFamilyData(data);
  }, []);

  const handleFinancialDataUpdate = React.useCallback((data) => {
    setFinancialData(data);
  }, []);

  const handlePrioritiesDataUpdate = React.useCallback((data) => {
    setPrioritiesData(data);
  }, []);

  const handleProposedPlanDataUpdate = React.useCallback((data) => {
    setProposedPlanData(data);
  }, []);

  const memoizedSuspectDataForFamily = React.useMemo(() => {
    if (isEdit) return suspectData;
    return {
      personalDetails: personalData,
      familyMembers: familyData,
    };
  }, [isEdit, suspectData, personalData, familyData]);

  // Handle Next button click - ONLY NAVIGATION
  const handleNextClick = () => {
    // Simple navigation only
    switch (activeTab) {
      case "personal":
        handleTabChange("family");
        break;
      case "family":
        handleTabChange("financial");
        break;
      case "financial":
        handleTabChange("priorities");
        break;
      case "priorities":
        handleTabChange("proposed");
        break;
      default:
        break;
    }
  };

  // Handle Create button click - CREATE ONLY
  const handleCreateClick = async () => {
    if (!personalData) {
      toast.error("Please fill in personal details first");
      return;
    }

    if (!personalData.groupHeadName || !personalData.mobileNo) {
      toast.error("Please fill in required fields (Group Head and Mobile No)");
      return;
    }

    setIsCreating(true);

    try {
      // Prepare suspect data with whatever data we have
      const suspectDataToCreate = {
        personalDetails: personalData,
        familyMembers: familyData,
        financialInfo: financialData,
        futurePriorities: prioritiesData.futurePriorities,
        needs: prioritiesData.needs,
        proposedPlan: proposedPlanData,
        status: "suspect",
      };

      console.log("Creating suspect with current data");

      const resultAction = await dispatch(createSuspect(suspectDataToCreate));

      if (resultAction?.payload) {
        const newSuspectId =
          resultAction.payload.suspect?._id || resultAction.payload;
        setSuspectId(newSuspectId);
        toast.success("🎉 Suspect Created Successfully!");

        setIsEdit(true);
        dispatch(getSuspectById(newSuspectId)).then((response) => {
          if (response?.payload?.suspect) {
            const data = response.payload.suspect;
            setSuspectData(data);
            setPersonalData(data.personalDetails || null);
            setFamilyData(data.familyMembers || []);
            setFinancialData(
              data.financialInfo || {
                insurance: [],
                investments: [],
                loans: [],
              }
            );
            setPrioritiesData({
              futurePriorities: data.futurePriorities || [],
              needs: data.needs || {},
            });
            setProposedPlanData(data.proposedPlan || []);
          }
        });
      }
    } catch (error) {
      toast.error("Failed to create suspect");
      console.error("Create error:", error);
    } finally {
      setIsCreating(false);
    }
  };

  // Tab configurations
  const tabs = [
    {
      id: "personal",
      name: "Personal Details",
      icon: <FaUser className="me-2" />,
      enabled: true,
    },
    {
      id: "family",
      name: "Add Family Details",
      icon: <FaUsers className="me-2" />,
      enabled: true,
    },
    {
      id: "financial",
      name: "Financial Details",
      icon: <FaRupeeSign className="me-2" />,
      enabled: true,
    },
    {
      id: "priorities",
      name: "Future's Priorities",
      icon: <FaBullseye className="me-2" />,
      enabled: true,
    },
    {
      id: "proposed",
      name: "Proposed Financial Plan",
      icon: <FaFileAlt className="me-2" />,
      enabled: true,
    },
  ];

  return (
    <div className="container-fluid p-0">
      <div className="suspect-form-shell border rounded-3 bg-white p-2 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <h6 className="text-primary mb-0 fw-semibold">
          {isEdit ? "Edit Suspect" : "Create New Suspect"}
        </h6>
        {isEdit && suspectId && (
          <div className="badge bg-info text-dark px-2 py-1">
            <small>Suspect ID: {suspectId.substring(0, 8)}...</small>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <ul
        className="nav nav-pills mb-1 bg-white shadow-sm"
        role="tablist"
      >
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.id} role="presentation">
            <button
              className={`nav-link custom-tab d-flex align-items-center ${
                activeTab === tab.id
                  ? "active-custom"
                  : ""
              }`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.icon}
              {tab.name}
            </button>
          </li>
        ))}
      </ul>

      {/* Tab Content */}
      <div className="tab-content p-2 border rounded bg-light shadow-sm compact-suspect-content">
        {/* Personal Details Tab */}
        {activeTab === "personal" && (
          <div className="tab-pane fade show active">
            <h6 className="mb-1 text-primary fw-semibold section-title">
              <FaUser className="me-2" />
              Personal Details
            </h6>
            <PersonalDetailFormSuspect
              isEdit={isEdit}
              suspectData={isEdit ? suspectData : (personalData ? { personalDetails: personalData } : null)}
              onFormDataUpdate={handlePersonalDataUpdate}
            />
          </div>
        )}

        {/* Family Members Tab */}
        {activeTab === "family" && (
          <div className="tab-pane fade show active">
            <h6 className="mb-1 text-primary fw-semibold section-title">
              <FaUsers className="me-2" />
              Family Details
            </h6>
            <FamilyMembersFormSuspect
              suspectId={suspectId}
              suspectData={memoizedSuspectDataForFamily}
              onDataUpdate={handleFamilyDataUpdate}
              onBack={() => handleTabChange("personal")}
            />
          </div>
        )}

        {/* Financial Information Tab */}
        {activeTab === "financial" && (
          <div className="tab-pane fade show active">
            <h6 className="mb-1 text-primary fw-semibold section-title">
              <FaRupeeSign className="me-2" />
              Financial Information
            </h6>
            <FinancialInformationFormSuspect
              suspectId={suspectId}
              suspectData={isEdit ? suspectData : (financialData ? { financialInfo: financialData } : null)}
              onDataUpdate={handleFinancialDataUpdate}
              onBack={() => handleTabChange("family")}
            />
          </div>
        )}

        {/* Future Priorities Tab */}
        {activeTab === "priorities" && (
          <div className="tab-pane fade show active">
            <h6 className="mb-1 text-primary fw-semibold section-title">
              <FaBullseye className="me-2" />
              Future Priorities
            </h6>
            <FuturePrioritiesFromSuspect
              suspectId={suspectId}
              suspectData={isEdit ? suspectData : (prioritiesData ? { futurePriorities: prioritiesData.futurePriorities, needs: prioritiesData.needs } : null)}
              onDataUpdate={handlePrioritiesDataUpdate}
              onBack={() => handleTabChange("financial")}
            />
          </div>
        )}

        {/* Proposed Plan Tab */}
        {activeTab === "proposed" && (
          <div className="tab-pane fade show active">
            <h6 className="mb-1 text-primary fw-semibold section-title">
              <FaFileAlt className="me-2" />
              Proposed Financial Plan
            </h6>
            <ProposedPanFormSuspect
              suspectId={suspectId}
              suspectData={isEdit ? suspectData : (proposedPlanData ? { proposedPlan: proposedPlanData } : null)}
              onDataUpdate={handleProposedPlanDataUpdate}
              onBack={() => handleTabChange("priorities")}
            />
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="d-flex justify-content-between mt-1">
        <Button
          variant="secondary"
          onClick={() => {
            if (activeTab === "family") handleTabChange("personal");
            else if (activeTab === "financial") handleTabChange("family");
            else if (activeTab === "priorities") handleTabChange("financial");
            else if (activeTab === "proposed") handleTabChange("priorities");
            else navigate(-1);
          }}
          disabled={activeTab === "personal"}
          size="sm"
        >
          ← Back
        </Button>

        <div>
          {/* Create Button - Always visible */}
          <Button
            variant="success"
            onClick={handleCreateClick}
            disabled={isCreating || !personalData}
            className="me-2"
            size="sm"
          >
            <FaSave className="me-2" />
            {isCreating ? "Creating..." : "Create Suspect"}
          </Button>

          {/* Next Button - For all tabs except proposed */}
          {activeTab !== "proposed" && (
            <Button variant="primary" onClick={handleNextClick} size="sm">
              Next →
            </Button>
          )}
        </div>
      </div>
      </div>
      <style>{`
        .suspect-form-shell {
          border-color: #e5e7eb !important;
        }
        .nav-pills {
          width: 100%;
          border-radius: 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 4px;
          display: flex;
          gap: 4px;
        }
        .nav-pills .nav-item {
          flex: 1;
        }
        .custom-tab {
          width: 100%;
          padding: 8px 16px;
          border-radius: 6px !important;
          border: none;
          background: transparent;
          color: #64748b;
          font-weight: 600;
          font-size: 0.82rem;
          transition: all 0.2s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .custom-tab:hover {
          color: #0f172a;
          background: #e2e8f0;
        }
        .active-custom {
          color: #ffffff !important;
          background: linear-gradient(135deg, #0d6efd, #0284c7) !important;
          box-shadow: 0 4px 6px -1px rgba(13, 110, 253, 0.25), 0 2px 4px -2px rgba(13, 110, 253, 0.25) !important;
        }
        .compact-suspect-content .row {
          --bs-gutter-x: 0.5rem;
          --bs-gutter-y: 0.35rem;
        }
        .compact-suspect-content .form-label {
          font-size: 0.76rem;
          font-weight: 600;
          margin-bottom: 0.15rem;
          color: #374151;
        }
        .compact-suspect-content .form-control,
        .compact-suspect-content .form-select {
          min-height: 30px;
          font-size: 0.8rem;
          padding: 0.2rem 0.5rem;
          border-color: #d1d5db;
        }
        .compact-suspect-content .form-control::placeholder,
        .compact-suspect-content .form-select::placeholder {
          color: transparent !important;
        }
        .compact-suspect-content textarea.form-control {
          min-height: 52px;
        }
        .compact-suspect-content .form-text {
          font-size: 0.68rem;
          margin-top: 0.08rem;
          margin-bottom: 0;
        }
        .compact-suspect-content .mb-3,
        .compact-suspect-content .mb-4 {
          margin-bottom: 0.45rem !important;
        }
        .section-title {
          font-size: 0.9rem;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.35rem;
          margin-bottom: 0.75rem;
        }
      `}</style>
    </div>
  );
};

export default SuspectFirstForm;
