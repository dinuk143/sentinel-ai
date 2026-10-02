const {
    getEmergencyContactsByUser,
    createEmergencyContact,
    updateEmergencyContact,
    deleteEmergencyContact
} = require("../models/emergencyContactModel");


// ========================================
// NORMALIZE PHONE NUMBER
// ========================================

const normalizePhone = (phone) => {
    let cleaned = String(phone || "")
        .trim()
        .replace(/[\s\-()]/g, "");

    // Indian 10-digit number
    if (/^[6-9][0-9]{9}$/.test(cleaned)) {
        cleaned = `+91${cleaned}`;
    }

    // Indian number starting with 91
    if (/^91[6-9][0-9]{9}$/.test(cleaned)) {
        cleaned = `+${cleaned}`;
    }

    return cleaned;
};


// ========================================
// VALIDATE CONTACT
// ========================================

const validateContact = (
    contact_name,
    relationship,
    phone
) => {
    if (!contact_name || !phone) {
        return "Contact name and phone number are required.";
    }

    if (contact_name.length > 100) {
        return "Contact name is too long.";
    }

    if (relationship.length > 50) {
        return "Relationship is too long.";
    }

    const phonePattern =
        /^\+[1-9][0-9]{9,14}$/;

    if (!phonePattern.test(phone)) {
        return "Please enter a valid mobile number.";
    }

    return null;
};


// ========================================
// GET ALL CONTACTS
// ========================================

const getEmergencyContacts = (
    req,
    res
) => {
    const user_id = req.user.id;

    getEmergencyContactsByUser(
        user_id,
        (err, results) => {
            if (err) {
                console.error(
                    "GET EMERGENCY CONTACTS ERROR:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Unable to load emergency contacts."
                });
            }

            return res.status(200).json({
                contacts: results || []
            });
        }
    );
};


// ========================================
// ADD NEW CONTACT
// ========================================

const addEmergencyContact = (
    req,
    res
) => {
    const user_id = req.user.id;

    let {
        contact_name,
        relationship,
        phone
    } = req.body;

    contact_name =
        String(contact_name || "").trim();

    relationship =
        String(relationship || "").trim();

    phone = normalizePhone(phone);

    const validationError =
        validateContact(
            contact_name,
            relationship,
            phone
        );

    if (validationError) {
        return res.status(400).json({
            message: validationError
        });
    }

    createEmergencyContact(
        user_id,
        contact_name,
        relationship || null,
        phone,
        (err, result) => {
            if (err) {
                console.error(
                    "CREATE EMERGENCY CONTACT ERROR:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Unable to save emergency contact."
                });
            }

            console.log(
                `EMERGENCY CONTACT ${result.insertId} CREATED FOR USER ${user_id}`
            );

            return res.status(201).json({
                message:
                    "Emergency contact added successfully.",

                contact: {
                    id: result.insertId,
                    user_id,
                    contact_name,
                    relationship:
                        relationship || null,
                    phone
                }
            });
        }
    );
};


// ========================================
// EDIT CONTACT
// ========================================

const editEmergencyContact = (
    req,
    res
) => {
    const user_id = req.user.id;
    const id = Number(req.params.id);

    if (
        !Number.isInteger(id) ||
        id <= 0
    ) {
        return res.status(400).json({
            message:
                "Invalid emergency contact ID."
        });
    }

    let {
        contact_name,
        relationship,
        phone
    } = req.body;

    contact_name =
        String(contact_name || "").trim();

    relationship =
        String(relationship || "").trim();

    phone = normalizePhone(phone);

    const validationError =
        validateContact(
            contact_name,
            relationship,
            phone
        );

    if (validationError) {
        return res.status(400).json({
            message: validationError
        });
    }

    updateEmergencyContact(
        id,
        user_id,
        contact_name,
        relationship || null,
        phone,
        (err, result) => {
            if (err) {
                console.error(
                    "UPDATE EMERGENCY CONTACT ERROR:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Unable to update emergency contact."
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message:
                        "Emergency contact not found."
                });
            }

            console.log(
                `EMERGENCY CONTACT ${id} UPDATED FOR USER ${user_id}`
            );

            return res.status(200).json({
                message:
                    "Emergency contact updated successfully.",

                contact: {
                    id,
                    user_id,
                    contact_name,
                    relationship:
                        relationship || null,
                    phone
                }
            });
        }
    );
};


// ========================================
// REMOVE CONTACT
// ========================================

const removeEmergencyContact = (
    req,
    res
) => {
    const user_id = req.user.id;
    const id = Number(req.params.id);

    if (
        !Number.isInteger(id) ||
        id <= 0
    ) {
        return res.status(400).json({
            message:
                "Invalid emergency contact ID."
        });
    }

    deleteEmergencyContact(
        id,
        user_id,
        (err, result) => {
            if (err) {
                console.error(
                    "DELETE EMERGENCY CONTACT ERROR:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Unable to delete emergency contact."
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message:
                        "Emergency contact not found."
                });
            }

            console.log(
                `EMERGENCY CONTACT ${id} DELETED FOR USER ${user_id}`
            );

            return res.status(200).json({
                message:
                    "Emergency contact deleted successfully."
            });
        }
    );
};


module.exports = {
    getEmergencyContacts,
    addEmergencyContact,
    editEmergencyContact,
    removeEmergencyContact
};