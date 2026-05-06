const mongoose = require("mongoose");

const rewardIncentiveSchema = new mongoose.Schema(
  {
    employeeRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    employeeName: String,
    taskCategory: String,
    taskName: String,
    financialProduct: String,
    companyName: String,
    rewardPoints: { type: Number, default: 0 },
    incentiveAmount: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netIncentivePayable: { type: Number, default: 0 },
    bankAccount: String,
    transferDate: { type: Date, default: null },
    month: String,
    year: Number,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RewardIncentive", rewardIncentiveSchema);
