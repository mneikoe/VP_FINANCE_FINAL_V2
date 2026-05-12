const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const employeeSchema = new mongoose.Schema(
  {
    // Personal Details
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "",
    },
    dob: {
      type: Date,
      default: null,
    },
    marriageDate: {
      type: Date,
      default: null,
    },
    mobileNo: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },
    emailId: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    panNo: {
      type: String,
      default: "",
      uppercase: true,
      trim: true,
    },
    aadharNo: {
      type: String,
      default: "",
      trim: true,
    },
    presentAddress: {
      type: String,
      default: "",
      trim: true,
    },
    permanentAddress: {
      type: String,
      default: "",
      trim: true,
    },
    homeTown: {
      type: String,
      default: "",
      trim: true,
    },
    familyContactPerson: {
      type: String,
      default: "",
      trim: true,
    },
    familyContactMobile: {
      type: String,
      default: "",
      trim: true,
    },
    emergencyContactPerson: {
      type: String,
      default: "",
      trim: true,
    },
    emergencyContactMobile: {
      type: String,
      default: "",
      trim: true,
    },
    workArea: {
      type: String,
      default: "",
      trim: true,
    },
    workPincode: {
      type: String,
      default: "",
      trim: true,
    },
    workSubArea: {
      type: String,
      default: "",
      trim: true,
    },
    workCity: {
      type: String,
      default: "",
      trim: true,
    },

    // For RM - To track which areas they manage
    managedAreas: [
      {
        area: String,
        pincode: String,
        subAreas: [String],
      },
    ],

    // Official Details
    designation: {
      type: String,
      default: "",
      trim: true,
    },
    employeeCode: {
      type: String,
      required: [true, "Employee code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    officeMobile: {
      type: String,
      default: "",
      trim: true,
    },
    officeEmail: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    allottedLoginId: {
      type: String,
      default: "",
      trim: true,
    },
    allocatedWorkArea: {
      type: String,
      default: "",
      trim: true,
    },
    dateOfJoining: {
      type: Date,
      default: null,
    },
    dateOfTermination: {
      type: Date,
      default: null,
    },
    salaryOnJoining: {
      type: String,
      default: "",
    },
    expenses: {
      type: String,
      default: "",
    },
    incentives: {
      type: String,
      default: "",
    },
    // Office Kit Allotment (Structured)
    officeKitAllotment: {
      oneTime: [{
        particular: String,
        allotmentDate: Date,
        condition: String,
        quantity: Number
      }],
      yearly: [{
        particular: String,
        allotmentDate: Date,
        condition: String,
        quantity: Number
      }],
      monthly: [{
        particular: String,
        allotmentDate: Date,
        condition: String,
        quantity: Number
      }]
    },

    // Recruitment Audit Trail
    recruitmentDetails: {
      candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate" },
      appliedDate: Date,
      interviewDate: Date,
      interviewPlace: String,
      totalMarks: Number,
      offerLetter: {
        path: String,
        sentDate: Date
      },
      joiningLetter: {
        path: String,
        sentDate: Date,
        joiningDate: Date
      },
      resume: String
    },

    allotmentDate: {
      type: Date,
      default: null,
    },

    // Role field
    role: {
      type: String,
      enum: ["Telecaller", "Telemarketer", "OE", "HR", "RM", "OA", "Accountant"],
      required: [true, "Role is required"],
    },

    // OE type: only for role OE - "onfield" | "inhouse"
    oeType: {
      type: String,
      enum: ["onfield", "inhouse"],
      default: "inhouse",
    },

    // Bank Details
    bankName: {
      type: String,
      default: "",
    },
    accountNo: {
      type: String,
      default: "",
    },
    ifscCode: {
      type: String,
      default: "",
    },
    micr: {
      type: String,
      default: "",
    },

    // Alerts
    onFirstJoining: {
      type: String,
      default: "",
    },
    onSixMonthCompletion: {
      type: String,
      default: "",
    },
    onTwelveMonthCompletion: {
      type: String,
      default: "",
    },

    // Job Profile and Target PDFs
    jobProfile: {
      path: { type: String, default: "" },
      uploadDate: { type: Date, default: null },
    },
    target: {
      path: { type: String, default: "" },
      uploadDate: { type: Date, default: null },
    },
    // HR Actions & Performance Tracking
    hrActions: [{
      actionDate: { type: Date, default: Date.now },
      title: String,
      description: String, // Supports HTML/Rich Text (CKEditor)
      points: { type: Number, default: 0 },
      actionType: { 
        type: String, 
        enum: ["Appreciation", "Warning", "Training", "Promotion", "Review", "Other"],
        default: "Review"
      },
      files: [{
        name: String,
        path: String,
        uploadedAt: { type: Date, default: Date.now }
      }]
    }],
    // Direct Document/Files Storage
    generalDocuments: [{
      name: String,
      path: String,
      category: String,
      uploadedAt: { type: Date, default: Date.now }
    }],
    taskRewards: [{
      rewardDate: { type: Date, default: Date.now },
      taskId: { type: mongoose.Schema.Types.ObjectId, ref: "IndividualTask" },
      taskName: String,
      points: { type: Number, default: 0 },
      remarks: String
    }],
  },
  {
    timestamps: true,
  }
);

employeeSchema.methods.comparePassword = async function (candidatePassword) {
  const bcrypt = require("bcryptjs");
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Employee", employeeSchema);
