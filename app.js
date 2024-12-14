const express = require("express");
const app = express();
const { connection } = require("./config/db");
const userRouter = require("./router/userRouter");  // Correct import of userRouter
const artistRouter=require("./router/artistRouter")
const albumRouter=require("./router/albumRouter")
const trackRouter=require("./router/trackRouter")
const favoriteRouter=require("./router/favoriteRouter")
require("dotenv").config();

const port = process.env.PORT || 5000; // Use PORT from .env if available

// Middleware to parse JSON
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Vooshfoods");
});

// Use userRouter for all routes related to users
app.use("/api/v1",userRouter); // All user routes will be prefixed with /api/users
app.use("/api/v1",artistRouter);
app.use("/api/v1",albumRouter);
app.use("/api/v1",trackRouter);
app.use("/api/v1",favoriteRouter);


// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

// Start the server
app.listen(port, async () => {
  try {
    await connection; // Connect to the database
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
  }
  console.log(`Server running on http://localhost:${port}`);
});
