const RewardIncentive = require("../Models/RewardIncentiveModel");

exports.createRewardIncentive = async (req, res) => {
  try {
    const data = req.body;
    data.netIncentivePayable = (parseFloat(data.incentiveAmount) || 0) - (parseFloat(data.deductions) || 0);
    
    const incentive = new RewardIncentive(data);
    await incentive.save();
    res.status(201).json({ success: true, data: incentive });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getRewardIncentives = async (req, res) => {
  try {
    const { search, month, year } = req.query;
    let query = { isActive: true };
    if (month) query.month = month;
    if (year) query.year = year;
    
    let incentives = await RewardIncentive.find(query).populate("employeeRef");
    if (search) {
      incentives = incentives.filter(i => 
        (i.employeeName && i.employeeName.toLowerCase().includes(search.toLowerCase())) ||
        (i.employeeRef && i.employeeRef.name && i.employeeRef.name.toLowerCase().includes(search.toLowerCase()))
      );
    }
    res.status(200).json({ success: true, data: incentives });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateRewardIncentive = async (req, res) => {
  try {
    const data = req.body;
    data.netIncentivePayable = (parseFloat(data.incentiveAmount) || 0) - (parseFloat(data.deductions) || 0);
    
    const incentive = await RewardIncentive.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json({ success: true, data: incentive });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteRewardIncentive = async (req, res) => {
  try {
    await RewardIncentive.findByIdAndUpdate(req.params.id, { isActive: false });
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
