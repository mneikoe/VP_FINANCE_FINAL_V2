import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Row, Col, Button } from "react-bootstrap";
import { getProspectById } from "../../../redux/feature/ProspectRedux/ProspectThunx";
import { fetchDetails } from "../../../redux/feature/LeadSource/LeadThunx";
import { getAllOccupationTypes } from "../../../redux/feature/OccupationType/OccupationThunx";
import { getAllOccupations } from "../../../redux/feature/LeadOccupation/OccupationThunx";
import { useNavigate, useParams } from "react-router-dom";
import PersonalDetailsForm from "./PersonalDetailFormProspect";
import FamilyMembersForm from "./FamilyMembersFormForProspect";
import FinancialInformationForm from "./FinancialInformationFormForProspect";
import FuturePrioritiesForm from "./FuturePrioririesFormForProspect";
import ProposedPlanForm from "./ProposedPlanFormForProspect";
import { FaUser, FaUsers, FaRupeeSign, FaBullseye } from "react-icons/fa";

const ProspectFirstForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("personal");
  const [prospectId, setProspectId] = useState(id || "");
  const [isEdit, setIsEdit] = useState(false);
  const [prospectData, setProspectData] = useState(null);

  // Central drafts for Prospect form persistence
  const [personalDraft, setPersonalDraft] = useState(null);
  const [familyDraft, setFamilyDraft] = useState([]);
  const [financialDraft, setFinancialDraft] = useState({
    insurance: [],
    investments: [],
    loans: [],
  });
  const [prioritiesDraft, setPrioritiesDraft] = useState({
    futurePriorities: [],
    needs: {},
  });
  const [proposedPlanDraft, setProposedPlanDraft] = useState([]);

  useEffect(() => {
    dispatch(getAllOccupationTypes());
    dispatch(getAllOccupations());
    dispatch(fetchDetails());

    if (id) {
      setIsEdit(true);
      dispatch(getProspectById(id)).then((response) => {
        if (response?.payload?.prospect) {
          const data = response.payload.prospect;
          setProspectData(data);
          setProspectId(data._id || id);

          // Load existing data for editing
          setPersonalDraft(data.personalDetails || null);
          setFamilyDraft(data.familyMembers || []);
          setFinancialDraft(
            data.financialInfo || {
              insurance: [],
              investments: [],
              loans: [],
            }
          );
          setPrioritiesDraft({
            futurePriorities: data.futurePriorities || [],
            needs: data.needs || {},
          });
          setProposedPlanDraft(data.proposedPlan || []);
        }
      });
    } else {
      setIsEdit(false);
      setProspectId("");
      setProspectData(null);
      setPersonalDraft(null);
      setFamilyDraft([]);
      setFinancialDraft({
        insurance: [],
        investments: [],
        loans: [],
      });
      setPrioritiesDraft({
        futurePriorities: [],
        needs: {},
      });
      setProposedPlanDraft([]);
    }
  }, [dispatch, id]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleProspectCreated = (newProspectId) => {
    setProspectId(newProspectId);
    setIsEdit(true);
    dispatch(getProspectById(newProspectId)).then((response) => {
      if (response?.payload?.prospect) {
        const data = response.payload.prospect;
        setProspectData(data);
        setPersonalDraft(data.personalDetails || null);
        setFamilyDraft(data.familyMembers || []);
        setFinancialDraft(
          data.financialInfo || {
            insurance: [],
            investments: [],
            loans: [],
          }
        );
        setPrioritiesDraft({
          futurePriorities: data.futurePriorities || [],
          needs: data.needs || {},
        });
        setProposedPlanDraft(data.proposedPlan || []);
      }
    });
  };

  const sectionTitles = {
    personal: { icon: <FaUser />, label: "Personal Details" },
    family: { icon: <FaUsers />, label: "Family Details" },
    financial: { icon: <FaRupeeSign />, label: "Financial Information" },
    priorities: { icon: <FaBullseye />, label: "Future Priorities" },
    proposed: { icon: <FaBullseye />, label: "Proposed Financial Plan" },
  };

  const memoizedProspectDataForFamily = React.useMemo(() => {
    if (isEdit) return prospectData;
    return {
      personalDetails: personalDraft,
      familyMembers: familyDraft,
    };
  }, [isEdit, prospectData, personalDraft, familyDraft]);

  return (
    <div className="container-fluid p-0">
      <div className="prospect-form-shell border rounded-3 bg-white p-2 shadow-sm">
      <h6 className="mb-1 fw-semibold">Prospect</h6>

      <ul
        className="nav nav-pills mb-1 bg-white shadow-sm rounded"
        id="pills-tab"
        role="tablist"
      >
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link custom-tab ${
              activeTab === "personal" ? "active-custom blue" : ""
            }`}
            onClick={() => handleTabChange("personal")}
          >
            <FaUser className="me-2" /> Personal Details
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link custom-tab ${
              activeTab === "family" ? "active-custom green" : ""
            }`}
            onClick={() => handleTabChange("family")}
          >
            <FaUsers className="me-2" /> Add Family Details
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link custom-tab ${
              activeTab === "financial" ? "active-custom purple" : ""
            }`}
            onClick={() => handleTabChange("financial")}
          >
            <FaRupeeSign className="me-2" /> Financial Details
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link custom-tab ${
              activeTab === "priorities" ? "active-custom orange" : ""
            }`}
            onClick={() => handleTabChange("priorities")}
          >
            <FaBullseye className="me-2" /> Future's Priorities
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link custom-tab ${
              activeTab === "proposed" ? "active-custom" : ""
            }`}
            onClick={() => handleTabChange("proposed")}
          >
            <FaBullseye className="me-2" /> Proposed Financial Plan
          </button>
        </li>
      </ul>
      <div className="tab-content p-2 border rounded bg-light">
        <h6 className="mb-1 text-primary fw-semibold section-title">
          {sectionTitles[activeTab]?.icon}
          {sectionTitles[activeTab]?.label}
        </h6>
        {activeTab === "personal" && (
          <PersonalDetailsForm
            isEdit={isEdit}
            prospectData={isEdit ? prospectData : (personalDraft ? { personalDetails: personalDraft } : null)}
            onProspectCreated={handleProspectCreated}
            onFormDataUpdate={setPersonalDraft}
          />
        )}
        {activeTab === "family" && (
          <FamilyMembersForm
            prospectId={prospectId}
            prospectData={memoizedProspectDataForFamily}
            onProspectCreated={handleProspectCreated}
            onDataUpdate={setFamilyDraft}
          />
        )}
        {activeTab === "financial" && (
          <FinancialInformationForm
            prospectId={prospectId}
            prospectData={isEdit ? prospectData : (financialDraft ? { financialInfo: financialDraft } : null)}
            onProspectCreated={handleProspectCreated}
            onDataUpdate={setFinancialDraft}
          />
        )}
        {activeTab === "priorities" && (
          <FuturePrioritiesForm
            prospectId={prospectId}
            prospectData={isEdit ? prospectData : (prioritiesDraft ? { futurePriorities: prioritiesDraft.futurePriorities, needs: prioritiesDraft.needs } : null)}
            onProspectCreated={handleProspectCreated}
            onDataUpdate={setPrioritiesDraft}
          />
        )}
        {activeTab === "proposed" && (
          <ProposedPlanForm
            prospectId={prospectId}
            prospectData={isEdit ? prospectData : (proposedPlanDraft ? { proposedPlan: proposedPlanDraft } : null)}
            onDataUpdate={setProposedPlanDraft}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="d-flex justify-content-between mt-3 p-2 border-top bg-white rounded shadow-sm">
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
          ← Previous
        </Button>

        {activeTab !== "proposed" && (
          <Button
            variant="primary"
            onClick={() => {
              if (activeTab === "personal") handleTabChange("family");
              else if (activeTab === "family") handleTabChange("financial");
              else if (activeTab === "financial") handleTabChange("priorities");
              else if (activeTab === "priorities") handleTabChange("proposed");
            }}
            size="sm"
          >
            Next →
          </Button>
        )}
      </div>

      <style>{`
  .prospect-form-shell {
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
    </div>
  );
};

export default ProspectFirstForm;
