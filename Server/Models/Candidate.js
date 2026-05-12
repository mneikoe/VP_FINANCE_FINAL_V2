// models/Candidate.js - UPDATED
const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    // Personal Details
    candidateName: {
      type: String,
      required: [true, "Candidate name is required"],
      trim: true,
    },
    mobileNo: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
    },

    // Professional Details
    designation: {
      type: String,
      default: "",
      trim: true,
    },
    education: {
      type: String,
      default: "",
      trim: true,
    },
    ageGroup: {
      type: String,
      default: "",
      trim: true,
    },
    vehicle: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    nativePlace: {
      type: String,
      default: "",
      trim: true,
    },
    spokenEnglish: {
      type: Boolean,
      default: false,
    },
    salaryExpectation: {
      type: String,
      default: "",
      trim: true,
    },
    referredBy: {
      type: String,
      default: "None",
      trim: true,
    },
    computerKnowledge: {
      type: String,
      default: "None",
      trim: true,
    },

    // Experience Fields
    experienceFields: {
      administrative: { type: Number, default: 0, min: 0, max: 5 },
      insuranceSales: { type: Number, default: 0, min: 0, max: 5 },
      anySales: { type: Number, default: 0, min: 0, max: 5 },
      fieldWork: { type: Number, default: 0, min: 0, max: 5 },
    },

    // Operational Activities
    operationalActivities: {
      dataManagement: { type: Boolean, default: false }, // Data Management with CPCT
      backOffice: { type: Boolean, default: false },     // Back Office Operations
      mis: { type: Boolean, default: false },            // (unused now)
      insuranceField: { type: Boolean, default: false }, // Insurance & Financial Field
      anyOther: { type: Boolean, default: false },       // Any other
    },
    salesExperience: {
      adminTeamMgmt: { type: Boolean, default: false }, // Administrative Work & Team Management
      salesInsFin: { type: Boolean, default: false },   // Sales in Insurance & Financial Field
      salesAnyField: { type: Boolean, default: false }, // Sales & Services in any field
      fieldWork: { type: Boolean, default: false },      // Field Work
      salesOther: { type: Boolean, default: false },     // Others
    },

    // Grading System (Existing)
    totalMarks: {
      type: Number,
      default: 0,
    },
    shortlisted: {
      type: Boolean,
      default: false,
    },

    // Status Tracking
    currentStage: {
      type: String,
      enum: [
        "Career Enquiry",
        "Resume Shortlisted",
        "Interview Process",
        "Selected",
        "Joining Data",
        "Joining Letter Sent",
        "Offer Letter Sent",
        "Added as Employee",
        "Rejected",
      ],
      default: "Career Enquiry",
    },
    currentStatus: {
      type: String,
      enum: [
        "Career Enquiry",
        "Resume Shortlisted",
        "Interview Process",
        "Joining Data",
        "Joining Letter Sent",
        "Offer Letter Sent",
        "Added as Employee",
        "Rejected",
      ],
      default: "Career Enquiry",
    },

    // Interview Details
    interviewDate: {
      type: Date,
      default: null,
    },
    interviewPlace: {
      type: String,
      default: "",
      trim: true,
    },

    // Application Details
    appliedFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vacancy",
      required: [true, "Applied for vacancy is required"],
    },
    resume: {
      type: String,
      default: "",
    },

    appliedDate: {
      type: Date,
      default: Date.now,
    },

    // ✅ NEW: Offer Letter Details with PDF Upload
    offerLetterDetails: {
      sentDate: {
        type: Date,
        default: null,
      },
      accepted: {
        type: Boolean,
        default: false,
      },
      acceptedDate: {
        type: Date,
        default: null,
      },
      file: {
        filename: String,
        originalName: String,
        path: String,
        uploadedDate: {
          type: Date,
          default: Date.now,
        },
        fileType: String,
        fileSize: Number,
      },
      notes: {
        type: String,
        default: "",
      },
    },

    // ✅ NEW: Joining Letter Details with PDF Upload
    joiningLetterDetails: {
      sentDate: {
        type: Date,
        default: null,
      },
      received: {
        type: Boolean,
        default: false,
      },
      receivedDate: {
        type: Date,
        default: null,
      },
      joiningDate: {
        type: Date,
        default: null,
      },
      file: {
        filename: String,
        originalName: String,
        path: String,
        uploadedDate: {
          type: Date,
          default: Date.now,
        },
        fileType: String,
        fileSize: Number,
      },
      notes: {
        type: String,
        default: "",
      },
    },

    // ✅ NEW: Employee Details (When added as employee)
    employeeDetails: {
      employeeId: String,
      joiningDate: Date,
      department: String,
      designation: String,
      salary: String,
      addedDate: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Calculate marks before saving (Same as frontend logic)
candidateSchema.pre("save", function (next) {
  this.totalMarks = calculateMarks(this);
  this.shortlisted = this.totalMarks >= 20;
  next();
});

// Same calculation logic as frontend
function calculateMarks(candidate) {
  let marks = 0;

  // 1. Referred By
  const referredMarks = { "Internship": 3, "Referred By": 2, "Platofrm Indeep": 1, "Job Hai": 1 };
  marks += referredMarks[candidate.referredBy] || 0;

  // 2. Age group marks
  const ageMarks = { "31-45yr": 3, "26yr-30yr": 2, "20-25yr": 1 };
  marks += ageMarks[candidate.ageGroup] || 0;

  // 3. Education marks
  const eduMarks = { "PG with any financial Subject": 3, "Maths/Economics/MBA": 2, "Graduate": 1 };
  marks += eduMarks[candidate.education] || 0;

  // 4. Operations Experience (Max 10)
  marks += candidate.operationalActivities?.insuranceField ? 4 : 0;
  marks += candidate.operationalActivities?.dataManagement ? 3 : 0;
  marks += candidate.operationalActivities?.backOffice ? 2 : 0;
  marks += candidate.operationalActivities?.anyOther ? 1 : 0;

  // 5. Sales & Work Experience (NEW - Max 15)
  marks += candidate.salesExperience?.adminTeamMgmt ? 5 : 0;
  marks += candidate.salesExperience?.salesInsFin ? 4 : 0;
  marks += candidate.salesExperience?.salesAnyField ? 3 : 0;
  marks += candidate.salesExperience?.fieldWork ? 2 : 0;
  marks += candidate.salesExperience?.salesOther ? 1 : 0;

  // 6. Computer Knowledge
  const compMarks = { "Advance (M.S office)": 3, "MIS + EXCEL": 2, "Basic": 1 };
  marks += compMarks[candidate.computerKnowledge] || 0;

  // 7. Location marks
  const locationMarks = { "H.B Road": 2, "Arera Colony": 2, "BHEL": 1, "Mandideep": 1, "Others": 1 };
  marks += locationMarks[candidate.location] || 0;

  // 8. Native place marks
  marks += candidate.nativePlace === "Bhopal" ? 2 : 1;

  // 9. Salary expectation marks
  const salaryMarks = { "12-15K": 3, "15-18K": 2, "18-20K": 1, "20-25k": 1 };
  marks += salaryMarks[candidate.salaryExpectation] || 0;

  // 10. Vehicle marks
  marks += candidate.vehicle ? 2 : 1;

  return marks;
}

module.exports = mongoose.model("Candidate", candidateSchema);
