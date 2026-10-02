const {
    createReport,
    getReportsByUser,
    getDashboardStats,
    getLatestReports,
    updateReportStatus
} = require("../models/reportModel");

const {
    analyzeImage
} = require("../services/aiService");


// ================= DASHBOARD STATS =================

const dashboardStats = (req, res) => {

    const user_id = req.user.id;

    getDashboardStats(
        user_id,
        (err, result) => {

            if (err) {

                console.error(
                    "DASHBOARD ERROR:",
                    err
                );

                return res.status(500).json({
                    message: "Database Error"
                });

            }

            return res
                .status(200)
                .json(result[0]);

        }
    );

};


// ================= LATEST REPORTS =================

const latestReports = (req, res) => {

    const user_id = req.user.id;

    getLatestReports(
        user_id,
        (err, result) => {

            if (err) {

                console.error(
                    "LATEST REPORTS ERROR:",
                    err
                );

                return res.status(500).json({
                    message: "Database Error"
                });

            }

            return res
                .status(200)
                .json(result);

        }
    );

};


// ================= SOS + GEMINI + MYSQL =================

const uploadReport = async (req, res) => {

    try {

        console.log(
            "========== SENTINEL AI SOS =========="
        );

        console.log(
            "USER:",
            req.user
        );

        console.log(
            "BODY:",
            req.body
        );

        console.log(
            "FILE:",
            req.file
        );


        const {
            emergency_type,
            latitude,
            longitude,
            address
        } = req.body;


        // ================= VALIDATION =================

        if (!req.file) {

            return res.status(400).json({
                message:
                    "Emergency image is required"
            });

        }


        if (!latitude || !longitude) {

            return res.status(400).json({
                message:
                    "Location is required"
            });

        }


        const imagePath =
            req.file.path;

        const file_path =
            `uploads/${req.file.filename}`;


        // ================= GEMINI AI =================

        console.log(
            "Analyzing emergency image..."
        );

        const aiResult =
            await analyzeImage(imagePath);

        console.log(
            "GEMINI RESULT:",
            aiResult
        );


        const detectedEmergency =
            aiResult.emergencyType &&
            aiResult.emergencyType !== "Unknown"
                ? aiResult.emergencyType
                : emergency_type || "Emergency";


        const severity =
            aiResult.severity ||
            "Unknown";


        const guidance =
            aiResult.guidance ||
            "Contact emergency services immediately.";


        // ================= USER ID =================

        const user_id =
            req.user.id;


        // ================= SAVE TO MYSQL =================

        createReport(

            user_id,
            detectedEmergency,
            file_path,
            latitude,
            longitude,
            address || "",
            severity,
            guidance,

            (err, result) => {

                if (err) {

                    console.error(
                        "MYSQL REPORT SAVE ERROR:",
                        err
                    );

                    return res
                        .status(500)
                        .json({
                            message:
                                "Emergency analyzed but report could not be saved"
                        });

                }


                console.log(
                    "REPORT SAVED:",
                    result.insertId
                );


                return res
                    .status(201)
                    .json({

                        message:
                            "Emergency report analyzed and saved successfully ✅",

                        reportId:
                            result.insertId,

                        ai: {

                            emergencyType:
                                detectedEmergency,

                            severity:
                                severity,

                            guidance:
                                guidance
                        },

                        location: {

                            latitude:
                                latitude,

                            longitude:
                                longitude,

                            address:
                                address || ""
                        },

                        image:
                            file_path

                    });

            }

        );


    } catch (error) {

        console.error(
            "SOS REPORT ERROR:",
            error
        );


        return res
            .status(500)
            .json({

                message:
                    error.message ||
                    "Emergency report failed"

            });

    }

};


// ================= MY REPORTS =================

const getMyReports = (req, res) => {

    getReportsByUser(

        req.user.id,

        (err, result) => {

            if (err) {

                console.error(
                    "MY REPORTS ERROR:",
                    err
                );

                return res
                    .status(500)
                    .json({
                        message:
                            "Database Error"
                    });

            }


            return res
                .status(200)
                .json(result);

        }

    );

};


// ================= CHANGE REPORT STATUS =================

const changeReportStatus = (req, res) => {

    const report_id =
        Number(req.params.id);

    const user_id =
        req.user.id;

    const {
        status
    } = req.body;


    // Validate report ID

    if (
        !Number.isInteger(report_id) ||
        report_id <= 0
    ) {

        return res
            .status(400)
            .json({
                message:
                    "Invalid report ID"
            });

    }


    // Only allow valid statuses

    const allowedStatuses = [
        "Pending",
        "Resolved"
    ];


    if (
        !allowedStatuses.includes(status)
    ) {

        return res
            .status(400)
            .json({
                message:
                    "Status must be Pending or Resolved"
            });

    }


    updateReportStatus(

        report_id,
        user_id,
        status,

        (err, result) => {

            if (err) {

                console.error(
                    "STATUS UPDATE ERROR:",
                    err
                );

                return res
                    .status(500)
                    .json({
                        message:
                            "Could not update report status"
                    });

            }


            // Report doesn't exist OR
            // doesn't belong to this user

            if (result.affectedRows === 0) {

                return res
                    .status(404)
                    .json({
                        message:
                            "Report not found"
                    });

            }


            console.log(
                `REPORT ${report_id} STATUS UPDATED TO ${status}`
            );


            return res
                .status(200)
                .json({

                    message:
                        "Report status updated successfully",

                    reportId:
                        report_id,

                    status:
                        status

                });

        }

    );

};


// ================= EXPORT =================

module.exports = {

    uploadReport,
    getMyReports,
    dashboardStats,
    latestReports,
    changeReportStatus

};