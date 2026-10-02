const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const emergencyContactRoutes =
    require("./routes/emergencyContactRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use(
    "/api/emergency-contacts",
    emergencyContactRoutes
);
app.get("/", (req, res) => {
    res.send("🚑 Sentinel AI Backend Running");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});