const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const eventRoutes = require("./routes/eventRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Routes
app.use("/api/events", eventRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Campus Event Management API is running!");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000
  })
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });

// Port for Render
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});