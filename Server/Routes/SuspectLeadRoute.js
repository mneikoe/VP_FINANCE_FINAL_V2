const express = require("express");
const router = express.Router();

const controller = require("../Controller/SuspectLeadCtrl");

router.post("/", controller.createSuspectLead); // Create
router.get("/", controller.getSuspectLeads); // Read all
router.get("/:id", controller.getSuspectLeadById); // get by Id
router.put("/:id", controller.updateSuspectLead); // Update
router.delete("/:id", controller.deleteSuspectLead); // Delete

module.exports = router;