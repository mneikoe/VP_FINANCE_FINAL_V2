const express = require("express");
const router = express.Router();

const ProspectCtrl = require("../Controller/ProspectLeadCtrl");

router.post("/", ProspectCtrl.createProspectLead); // Create
router.get("/", ProspectCtrl.getProspectLeads); // Read all
router.get("/:id", ProspectCtrl.getProspectLeadById); // get by Id
router.put("/:id", ProspectCtrl.updateProspectLead); // Update
router.delete("/:id", ProspectCtrl.deleteProspectLead); // Delete

router.put("/status/:id", ProspectCtrl.updateProspectLeadStatus);

module.exports = router;