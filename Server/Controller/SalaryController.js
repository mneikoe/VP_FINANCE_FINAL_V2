const Salary = require("../Models/SalaryModel");
const Employee = require("../Models/employeeModel");

// Create Salary Entry
exports.createSalary = async (req, res) => {
  try {
    const data = req.body;
    
    // Backend Calculations
    const netSalary = parseFloat(data.netSalary) || 0;
    const allowance = (parseFloat(data.kmRun) || 0) * (parseFloat(data.ratePerKm) || 0);
    const otherTotal = parseFloat(data.total) || 0;
    const exp = parseFloat(data.exp) || 0;
    
    data.totalSalaryEarned = (netSalary + allowance + otherTotal + exp).toFixed(2);
    
    const deductions = (parseFloat(data.securityDeposit) || 0) + 
                      (parseFloat(data.fine) || 0) + 
                      (parseFloat(data.pf) || 0) + 
                      (parseFloat(data.advance) || 0);
                      
    data.totalDeduction = deductions.toFixed(2);
    data.salaryPayable = (parseFloat(data.totalSalaryEarned) - deductions).toFixed(2);

    const salary = new Salary(data);
    await salary.save();
    res.status(201).json({ success: true, data: salary });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get All Salaries (with search and pagination)
exports.getSalaries = async (req, res) => {
  try {
    const { search, month, year } = req.query;
    let query = { isActive: true };

    if (month) query.month = month;
    if (year) query.year = year;

    let salaries = await Salary.find(query).populate("employeeRef", "name employeeCode");

    if (search) {
      salaries = salaries.filter(s => 
        s.employeeRef.name.toLowerCase().includes(search.toLowerCase()) ||
        s.employeeRef.employeeCode.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.status(200).json({ success: true, data: salaries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Salary Entry
exports.updateSalary = async (req, res) => {
  try {
    const data = req.body;
    
    // Backend Calculations
    const netSalary = parseFloat(data.netSalary) || 0;
    const allowance = (parseFloat(data.kmRun) || 0) * (parseFloat(data.ratePerKm) || 0);
    const otherTotal = parseFloat(data.total) || 0;
    const exp = parseFloat(data.exp) || 0;
    
    data.totalSalaryEarned = (netSalary + allowance + otherTotal + exp).toFixed(2);
    
    const deductions = (parseFloat(data.securityDeposit) || 0) + 
                      (parseFloat(data.fine) || 0) + 
                      (parseFloat(data.pf) || 0) + 
                      (parseFloat(data.advance) || 0);
                      
    data.totalDeduction = deductions.toFixed(2);
    data.salaryPayable = (parseFloat(data.totalSalaryEarned) - deductions).toFixed(2);

    const salary = await Salary.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!salary) return res.status(404).json({ success: false, message: "Salary record not found" });
    res.status(200).json({ success: true, data: salary });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete Salary Entry (Soft Delete)
exports.deleteSalary = async (req, res) => {
  try {
    const salary = await Salary.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!salary) return res.status(404).json({ success: false, message: "Salary record not found" });
    res.status(200).json({ success: true, message: "Salary record deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Salary Entry
exports.getSalaryById = async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id).populate("employeeRef");
    if (!salary) return res.status(404).json({ success: false, message: "Salary record not found" });
    res.status(200).json({ success: true, data: salary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
