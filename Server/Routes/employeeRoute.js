const express = require("express");
const {
  addEmployee,
  updateEmployee,
  getEmployeeById,
  getAllEmployees,
  deleteEmployee,
  getLastEmployeeCode,
  getEmployeeRoles,
  getEmployeesByArea,
  getEmployeeAreas,
  getClientsByEmployeeArea,
  getClientsByArea,
  getClientsByAllocatedRM,
  uploadEmployeeDocument,
} = require("../Controller/employeeController");

const upload = require("../config/upload");

const router = express.Router();

router.post("/addEmployee", addEmployee);
router.put("/updateEmployee", updateEmployee);
router.get("/getEmployeeById", getEmployeeById);
router.get("/getAllEmployees", getAllEmployees);
router.delete("/deleteEmployee", deleteEmployee);
router.get("/get-last-code", getLastEmployeeCode);
router.get("/getEmployeeRoles", getEmployeeRoles);
router.get("/getEmployeesByArea", getEmployeesByArea);
router.get("/getEmployeeAreas", getEmployeeAreas);
router.get("/getClientsByEmployeeArea", getClientsByEmployeeArea);
router.get("/getClientsByArea", getClientsByArea);
router.get("/getClientsByAllocatedRM", getClientsByAllocatedRM);

// ✅ Document upload route
router.post("/upload-document", upload.single("file"), uploadEmployeeDocument);

// ✅ Generic upload route for employee documents (before employee is created)
router.post("/upload-temp-doc", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const filePath = `/Images/${req.file.filename}`;
    res.json({
      success: true,
      message: "File uploaded successfully",
      filePath: filePath,
      filename: req.file.originalname
    });
  } catch (error) {
    console.error("❌ Temp file upload error:", error);
    res.status(500).json({ success: false, message: "Error uploading file", error: error.message });
  }
});

module.exports = router;
