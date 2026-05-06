const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema(
  {
    employeeRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    basicSalary: { type: Number, default: 0 },
    monthDays: { type: Number, default: 0 },
    workingDays: { type: Number, default: 0 },
    perDayWages: { type: Number, default: 0 },
    netSalary: { type: Number, default: 0 },
    
    // Allowance
    kmRun: { type: Number, default: 0 },
    ratePerKm: { type: Number, default: 0 },
    
    // Expenses
    total: { type: Number, default: 0 }, // User asked to replace "Other Exp." with "Total"
    exp: { type: Number, default: 0 }, // User asked to add "Exp" after "Total"
    totalSalaryEarned: { type: Number, default: 0 },
    
    // Deduction
    securityDeposit: { type: Number, default: 0 },
    fine: { type: Number, default: 0 },
    pf: { type: Number, default: 0 },
    advance: { type: Number, default: 0 },
    totalDeduction: { type: Number, default: 0 },
    
    // Final
    salaryPayable: { type: Number, default: 0 },
    bankAccount: { type: String, default: "" },
    transferDate: { type: Date, default: null },
    
    month: { type: String, required: true }, // e.g., "May 2026"
    year: { type: Number, required: true },
    
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Salary", salarySchema);
