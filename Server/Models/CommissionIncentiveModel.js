const mongoose = require("mongoose");

const commissionIncentiveSchema = new mongoose.Schema(
  {
    leadSource: String,
    leadName: String,
    clientRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client", // Adjust ref name if different
    },
    clientName: String, // Manual override or fallback
    financialProduct: String,
    companyName: String,
    plan: String,
    doc: String,
    mode: String,
    premiumAmount: { type: Number, default: 0 },
    rateOfIncentive: { type: Number, default: 0 },
    incentiveAmount: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netIncentivePayable: { type: Number, default: 0 },
    nextDueDate: { type: Date, default: null },
    bankAccount: String,
    transferDate: { type: Date, default: null },
    month: String,
    year: Number,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CommissionIncentive", commissionIncentiveSchema);
