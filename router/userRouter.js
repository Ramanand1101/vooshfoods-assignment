// module.exports = userRouter;
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid"); // Import uuidv4
const { verifyToken, invalidateToken } = require("../middleware/auth");
const User = require("../models/User"); // Adjust the path as per your folder structure
require("dotenv").config();

const userRouter = express.Router();


// POST /logout - Logout a user and invalidate the token
userRouter.post("/logout", verifyToken, (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  // Add the token to the blacklist
  blacklistedTokens.push(token);

  res.status(200).json({
    status: 200,
    data: null,
    message: "User logged out successfully.",
    error: null,
  });
});

userRouter.post("/signup", async (req, res) => {
    const { email, password } = req.body;
  
    // Check if either email or password is missing and provide a specific error message
    if (!email || !password) {
      const missingField = !email ? "email" : "password";
      return res.status(400).json({
        status: 400,
        data: null,
        message: `Bad Request, Reason: Missing ${missingField}`,
        error: null,
      });
    }
  
    try {
      // Check if the email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          status: 409,
          data: null,
          message: "Email already exists.",
          error: null,
        });
      }
  
      // Determine if this is the first user
      const userCount = await User.countDocuments(); // Get the number of users
      const role = userCount === 0 ? "Admin":undefined; // Assign 'admin' to the first user, 'editor' to others
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Generate a user_id (you can use UUID or any method of generating unique IDs)
      const userId = uuidv4();
  
      // Create a new user
      const newUser = new User({
        email,
        password: hashedPassword,
        user_id: userId, // Assign the generated user_id
        role, // Assign the role dynamically
      });
  
      // Save the new user to the database
      await newUser.save();
  
      res.status(201).json({
        status: 201,
        data: null,
        message: "User created successfully.",
        error: null,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        data: null,
        message: "Internal Server Error.",
        error: error.message,
      });
    }
  });

// POST /login - Login a user
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request, Reason: Missing Fields",
      error: null,
    });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "User not found.",
        error: null,
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: "Bad Request, Reason: Invalid Credentials",
        error: null,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { user_id: user._id, email: user.email, role: user.role }, // Include the user's role in the token
      process.env.JWT_SECRET, // Secret key for JWT
      { expiresIn: "1h" } // Token expiry time
    );

    res.status(200).json({
      status: 200,
      data: { token },
      message: "Login successful.",
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      data: null,
      message: "Internal Server Error.",
      error: error.message,
    });
  }
});


userRouter.get("/users", verifyToken, async (req, res) => {
    const { limit = 5, offset = 0, role } = req.query;
    
    // Validate the limit and offset query parameters
    if (isNaN(limit) || isNaN(offset)) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: "Bad Request: Invalid limit or offset.",
        error: null,
      });
    }
  
    try {
      const currentUser = await User.findById(req.user.user_id);
  
      // Only admins can access this endpoint
      if (currentUser.role !== "Admin") {
        return res.status(401).json({
          status: 401,
          data: null,
          message: "Unauthorized Access",
          error: null,
        });
      }
  
      // Build the query with role filtering
      const query = role ? { role } : {};
  
      // Fetch users with pagination and role filter
      const users = await User.find(query)
        .skip(parseInt(offset))
        .limit(parseInt(limit));
  
      res.status(200).json({
        status: 200,
        data: users,
        message: "Users retrieved successfully.",
        error: null,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        data: null,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  });
  userRouter.post("/users/add-user", verifyToken, async (req, res) => {
    const { email, password, role } = req.body;
  
    // Validate required fields
    if (!email || !password || !role) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: "Bad Request: Missing fields.",
        error: null,
      });
    }
  
    // Validate role (cannot be "admin")
    if (role === "admin") {
      return res.status(403).json({
        status: 403,
        data: null,
        message: "Forbidden Access: Cannot assign 'admin' role.",
        error: null,
      });
    }
  
    try {
      const currentUser = await User.findById(req.user.user_id);
  
      // Only admins can add users
      if (currentUser.role !== "Admin") {
        return res.status(401).json({
          status: 401,
          data: null,
          message: "Unauthorized Access",
          error: null,
        });
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          status: 409,
          data: null,
          message: "Email already exists.",
          error: null,
        });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new user
      const newUser = new User({
        email,
        password: hashedPassword,
        role,
      });
  
      await newUser.save();
  
      res.status(201).json({
        status: 201,
        data: null,
        message: "User created successfully.",
        error: null,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        data: null,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  });
    
  userRouter.delete("/users/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
  
    try {
      const currentUser = await User.findById(req.user.user_id);
  
      // Only admins can delete users
      if (currentUser.role !== "Admin") {
        return res.status(401).json({
          status: 401,
          data: null,
          message: "Unauthorized Access",
          error: null,
        });
      }
  
      const userToDelete = await User.findById(id);
  
      if (!userToDelete) {
        return res.status(404).json({
          status: 404,
          data: null,
          message: "User not found.",
          error: null,
        });
      }
  
      // Prevent deleting other admins
      if (userToDelete.role === "Admin" && currentUser.user_id !== id) {
        return res.status(403).json({
          status: 403,
          data: null,
          message: "Forbidden Access: Cannot delete another admin.",
          error: null,
        });
      }
  
      await User.findByIdAndDelete(id);
  
      res.status(200).json({
        status: 200,
        data: null,
        message: "User deleted successfully.",
        error: null,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        data: null,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  });
  userRouter.put("/users/update-password", verifyToken, async (req, res) => {
    const { old_password, new_password } = req.body;
  
    // 400: Bad Request
    if (!old_password || !new_password) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: "Bad Request: Missing old or new password.",
        error: null,
      });
    }
  
    try {
      const currentUser = await User.findById(req.user.user_id);
  
      // 404: User Not Found
      if (!currentUser) {
        return res.status(404).json({
          status: 404,
          data: null,
          message: "User not found.",
          error: null,
        });
      }
  
      // Check if the old password matches
      const validPassword = await bcrypt.compare(old_password, currentUser.password);
      if (!validPassword) {
        // 401: Unauthorized
        return res.status(401).json({
          status: 401,
          data: null,
          message: "Unauthorized Access: Incorrect old password.",
          error: null,
        });
      }
  
      // Hash new password
      const hashedPassword = await bcrypt.hash(new_password, 10);
  
      currentUser.password = hashedPassword;
      await currentUser.save();
  
      // 204: No Content (Success)
      res.status(204).send();
    } catch (error) {
      console.error(error);
      // 500: Internal Server Error
      res.status(500).json({
        status: 500,
        data: null,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  });
  
module.exports = userRouter;
