const CommissionIncentive = require("../Models/CommissionIncentiveModel");

exports.createCommissionIncentive = async (req, res) => {
  try {
    const data = req.body;
    
    // Handle empty clientRef
    if (data.clientRef === "" || data.clientRef === null) {
      delete data.clientRef;
    }

    data.incentiveAmount = ((parseFloat(data.premiumAmount) || 0) * (parseFloat(data.rateOfIncentive) || 0)) / 100;
    data.netIncentivePayable = data.incentiveAmount - (parseFloat(data.deductions) || 0);
    
    const incentive = new CommissionIncentive(data);
    await incentive.save();
    res.status(201).json({ success: true, data: incentive });
  } catch (error) {
    console.error("Error creating commission incentive:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getCommissionIncentives = async (req, res) => {
  try {
    const { search, month, year } = req.query;
    let query = { isActive: true };
    if (month) query.month = month;
    if (year) query.year = year;
    
    let incentives = await CommissionIncentive.find(query).populate("clientRef");
    if (search) {
      incentives = incentives.filter(i => 
        (i.clientName && i.clientName.toLowerCase().includes(search.toLowerCase())) ||
        (i.clientRef && i.clientRef.name && i.clientRef.name.toLowerCase().includes(search.toLowerCase()))
      );
    }
    res.status(200).json({ success: true, data: incentives });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCommissionIncentive = async (req, res) => {
  try {
    const data = req.body;

    // Handle empty clientRef
    if (data.clientRef === "" || data.clientRef === null) {
      data.clientRef = undefined; // Or use $unset in update if necessary
    }

    data.incentiveAmount = ((parseFloat(data.premiumAmount) || 0) * (parseFloat(data.rateOfIncentive) || 0)) / 100;
    data.netIncentivePayable = data.incentiveAmount - (parseFloat(data.deductions) || 0);
    
    const incentive = await CommissionIncentive.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json({ success: true, data: incentive });
  } catch (error) {
    console.error("Error updating commission incentive:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteCommissionIncentive = async (req, res) => {
  try {
    await CommissionIncentive.findByIdAndUpdate(req.params.id, { isActive: false });
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
