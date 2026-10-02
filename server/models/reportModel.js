const db = require("../config/db");

// ================= CREATE REPORT =================

const createReport = (
    user_id,
    emergency_type,
    file_path,
    latitude,
    longitude,
    address,
    severity,
    guidance,
    callback
) => {

    const sql = `
        INSERT INTO reports
        (
            user_id,
            emergency_type,
            file_path,
            latitude,
            longitude,
            address,
            severity,
            guidance
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            user_id,
            emergency_type,
            file_path,
            latitude,
            longitude,
            address,
            severity,
            guidance
        ],
        callback
    );
};


// ================= GET USER REPORTS =================

const getReportsByUser = (user_id, callback) => {

    const sql = `
        SELECT *
        FROM reports
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [user_id], callback);

};


// ================= GET REPORT BY ID =================

const getReportById = (id, callback) => {

    const sql = `
        SELECT *
        FROM reports
        WHERE id = ?
    `;

    db.query(sql, [id], callback);

};


// ================= UPDATE REPORT STATUS =================

const updateReportStatus = (
    report_id,
    user_id,
    status,
    callback
) => {

    const sql = `
        UPDATE reports
        SET status = ?
        WHERE id = ?
        AND user_id = ?
    `;

    db.query(
        sql,
        [
            status,
            report_id,
            user_id
        ],
        callback
    );

};


// ================= DASHBOARD =================

const getDashboardStats = (user_id, callback) => {

    const sql = `
        SELECT
            COUNT(*) AS total_reports,
            SUM(
                CASE
                    WHEN status = 'Pending'
                    THEN 1
                    ELSE 0
                END
            ) AS pending_reports,
            SUM(
                CASE
                    WHEN status = 'Resolved'
                    THEN 1
                    ELSE 0
                END
            ) AS resolved_reports
        FROM reports
        WHERE user_id = ?
    `;

    db.query(
        sql,
        [user_id],
        callback
    );

};


// ================= LATEST REPORTS =================

const getLatestReports = (user_id, callback) => {

    const sql = `
        SELECT *
        FROM reports
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 5
    `;

    db.query(
        sql,
        [user_id],
        callback
    );

};


// ================= EXPORT =================

module.exports = {
    createReport,
    getReportsByUser,
    getReportById,
    updateReportStatus,
    getDashboardStats,
    getLatestReports
};