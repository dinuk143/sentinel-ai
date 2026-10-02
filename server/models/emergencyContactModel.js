const db = require("../config/db");

// ========================================
// GET ALL CONTACTS OF LOGGED-IN USER
// ========================================

const getEmergencyContactsByUser = (
    user_id,
    callback
) => {
    const sql = `
        SELECT
            id,
            user_id,
            contact_name,
            relationship,
            phone,
            created_at,
            updated_at
        FROM emergency_contacts
        WHERE user_id = ?
        ORDER BY created_at DESC, id DESC
    `;

    db.query(
        sql,
        [user_id],
        callback
    );
};


// ========================================
// CREATE NEW CONTACT
// ========================================

const createEmergencyContact = (
    user_id,
    contact_name,
    relationship,
    phone,
    callback
) => {
    const sql = `
        INSERT INTO emergency_contacts
        (
            user_id,
            contact_name,
            relationship,
            phone
        )
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            user_id,
            contact_name,
            relationship,
            phone
        ],
        callback
    );
};


// ========================================
// UPDATE CONTACT
// ========================================

const updateEmergencyContact = (
    id,
    user_id,
    contact_name,
    relationship,
    phone,
    callback
) => {
    const sql = `
        UPDATE emergency_contacts
        SET
            contact_name = ?,
            relationship = ?,
            phone = ?,
            updated_at = NOW()
        WHERE id = ?
        AND user_id = ?
    `;

    db.query(
        sql,
        [
            contact_name,
            relationship,
            phone,
            id,
            user_id
        ],
        callback
    );
};


// ========================================
// DELETE CONTACT
// ========================================

const deleteEmergencyContact = (
    id,
    user_id,
    callback
) => {
    const sql = `
        DELETE FROM emergency_contacts
        WHERE id = ?
        AND user_id = ?
    `;

    db.query(
        sql,
        [id, user_id],
        callback
    );
};


module.exports = {
    getEmergencyContactsByUser,
    createEmergencyContact,
    updateEmergencyContact,
    deleteEmergencyContact
};