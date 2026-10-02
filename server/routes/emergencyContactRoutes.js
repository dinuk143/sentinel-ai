const express = require("express");

const router = express.Router();

const verifyToken =
    require("../middleware/authMiddleware");

const {
    getEmergencyContacts,
    addEmergencyContact,
    editEmergencyContact,
    removeEmergencyContact
} = require(
    "../controllers/emergencyContactController"
);


// Get all contacts
router.get(
    "/",
    verifyToken,
    getEmergencyContacts
);


// Add new contact
router.post(
    "/",
    verifyToken,
    addEmergencyContact
);


// Edit contact
router.put(
    "/:id",
    verifyToken,
    editEmergencyContact
);


// Delete contact
router.delete(
    "/:id",
    verifyToken,
    removeEmergencyContact
);


module.exports = router;