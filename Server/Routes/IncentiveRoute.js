const express = require("express");
const router = express.Router();
const commissionCtrl = require("../Controller/CommissionIncentiveController");
const rewardCtrl = require("../Controller/RewardIncentiveController");

// Commission Routes
router.post("/commission", commissionCtrl.createCommissionIncentive);
router.get("/commission", commissionCtrl.getCommissionIncentives);
router.put("/commission/:id", commissionCtrl.updateCommissionIncentive);
router.delete("/commission/:id", commissionCtrl.deleteCommissionIncentive);

// Reward Routes
router.post("/reward", rewardCtrl.createRewardIncentive);
router.get("/reward", rewardCtrl.getRewardIncentives);
router.put("/reward/:id", rewardCtrl.updateRewardIncentive);
router.delete("/reward/:id", rewardCtrl.deleteRewardIncentive);

module.exports = router;
