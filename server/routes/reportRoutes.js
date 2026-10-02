const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    uploadReport,
    getMyReports,
    dashboardStats,
    latestReports,
    changeReportStatus
} = require("../controllers/reportController");


// ================= EMERGENCY SOS =================

router.post(
    "/upload",
    verifyToken,
    upload.single("file"),
    uploadReport
);


// ================= MY REPORTS =================

router.get(
    "/my-reports",
    verifyToken,
    getMyReports
);


// ================= DASHBOARD STATS =================

router.get(
    "/dashboard-stats",
    verifyToken,
    dashboardStats
);


// ================= LATEST REPORTS =================

router.get(
    "/latest",
    verifyToken,
    latestReports
);


// ================= UPDATE REPORT STATUS =================

router.patch(
    "/:id/status",
    verifyToken,
    changeReportStatus
);


module.exports = router;