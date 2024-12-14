const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // Import UUID function

const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    default: uuidv4, // Automatically generate a UUID for new documents
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Admin", "Editor", "Viewer"],
    default: "Viewer",
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

const User = mongoose.model("User", userSchema);

module.exports = User;
