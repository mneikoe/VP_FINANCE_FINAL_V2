const express = require("express");
const router = express.Router();
const Employee = require("../Models/employeeModel");
const upload = require("../config/upload");

// ✅ Add HR Action to an Employee
router.post("/add-action/:id", upload.array("files"), async (req, res) => {
  try {
    const { title, description, points, actionType } = req.body;
    const employeeId = req.params.id;

    const actionFiles = req.files ? req.files.map(file => ({
      name: file.originalname,
      path: `/Images/${file.filename}`,
      uploadedAt: new Date()
    })) : [];

    const newAction = {
      title,
      description,
      points: Number(points) || 0,
      actionType,
      files: actionFiles,
      actionDate: new Date()
    };

    const employee = await Employee.findByIdAndUpdate(
      employeeId,
      { $push: { hrActions: newAction } },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    res.status(200).json({ success: true, message: "HR Action added successfully", data: employee });
  } catch (error) {
    console.error("Error adding HR action:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// ✅ Add General Documents to an Employee
router.post("/upload-docs/:id", upload.array("documents"), async (req, res) => {
  try {
    const { category } = req.body;
    const employeeId = req.params.id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    const newDocs = req.files.map(file => ({
      name: file.originalname,
      path: `/Images/${file.filename}`,
      category: category || "General",
      uploadedAt: new Date()
    }));

    const employee = await Employee.findByIdAndUpdate(
      employeeId,
      { $push: { generalDocuments: { $each: newDocs } } },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    res.status(200).json({ success: true, message: "Documents uploaded successfully", data: employee });
  } catch (error) {
    console.error("Error uploading docs:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// ✅ Get All HR Actions (for HR Dashboard)
router.get("/get-all/actions", async (req, res) => {
  try {
    const employees = await Employee.find({ "hrActions.0": { $exists: true } })
      .select("hrActions name employeeCode role")
      .lean();

    const allActions = [];
    employees.forEach(emp => {
      emp.hrActions.forEach(action => {
        allActions.push({
          ...action,
          employeeId: {
            _id: emp._id,
            name: emp.name,
            employeeCode: emp.employeeCode,
            role: emp.role
          }
        });
      });
    });

    // Sort by date descending
    allActions.sort((a, b) => new Date(b.actionDate) - new Date(a.actionDate));

    res.status(200).json({ success: true, data: allActions });
  } catch (error) {
    console.error("Error fetching all HR actions:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
